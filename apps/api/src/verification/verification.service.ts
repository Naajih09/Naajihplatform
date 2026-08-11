import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  Prisma,
  TrustLevel,
  UserRole,
  VerificationProvider,
  VerificationStatus,
  VerificationType,
} from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { NotificationsService } from '../notifications/notifications.service';
import { AuditService } from '../audit/audit.service';
import { AccessPolicyService } from '../policies/access-policy.service';
import { VerificationProviderRegistry } from './providers/verification-provider.registry';

const VERIFICATION_PROVIDERS = Object.values(VerificationProvider);
const VERIFICATION_TYPES = Object.values(VerificationType);

@Injectable()
export class VerificationService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly notificationsService: NotificationsService,
    private readonly auditService: AuditService,
    private readonly accessPolicy: AccessPolicyService,
    private readonly providerRegistry: VerificationProviderRegistry,
  ) {}

  private normalizeVerificationType(type?: string) {
    const normalized = String(type || VerificationType.IDENTITY).toUpperCase();
    if (!VERIFICATION_TYPES.includes(normalized as VerificationType)) {
      throw new BadRequestException('Unsupported verification type.');
    }
    return normalized as VerificationType;
  }

  private normalizeProvider(provider?: string) {
    const configured =
      provider ||
      process.env.VERIFICATION_PROVIDER ||
      VerificationProvider.INTERNAL_SANDBOX;
    const normalized = String(configured).toUpperCase();
    if (!VERIFICATION_PROVIDERS.includes(normalized as VerificationProvider)) {
      throw new BadRequestException('Unsupported verification provider.');
    }
    return normalized as VerificationProvider;
  }

  private trustLevelFor(
    type: VerificationType,
    status: VerificationStatus,
  ): TrustLevel {
    if (status === VerificationStatus.FLAGGED) return TrustLevel.FLAGGED;
    if (status === VerificationStatus.REJECTED) return TrustLevel.REJECTED;
    if (status === VerificationStatus.PENDING) {
      return type === VerificationType.BUSINESS
        ? TrustLevel.BUSINESS_PENDING
        : TrustLevel.IDENTITY_PENDING;
    }

    return type === VerificationType.BUSINESS
      ? TrustLevel.BUSINESS_VERIFIED
      : TrustLevel.IDENTITY_VERIFIED;
  }

  private async refreshUserVerification(userId: string) {
    const user = await this.databaseService.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });

    if (!user) return;

    const requests = await this.databaseService.verificationRequest.findMany({
      where: { userId },
      select: { verificationType: true, status: true },
    });

    const hasApprovedIdentity = requests.some(
      (request) =>
        request.verificationType === VerificationType.IDENTITY &&
        request.status === VerificationStatus.APPROVED,
    );
    const hasApprovedBusiness = requests.some(
      (request) =>
        request.verificationType === VerificationType.BUSINESS &&
        request.status === VerificationStatus.APPROVED,
    );
    const isVerified =
      user.role === UserRole.ENTREPRENEUR
        ? hasApprovedIdentity && hasApprovedBusiness
        : hasApprovedIdentity;

    await this.databaseService.user.update({
      where: { id: userId },
      data: { isVerified },
    });
  }

  private getVerificationSlaHours() {
    const hours = Number(process.env.VERIFICATION_SLA_HOURS || 48);
    return Number.isFinite(hours) && hours > 0 ? hours : 48;
  }

  private async preScreen(data: {
    userId: string;
    documentUrl?: string;
    verificationType: VerificationType;
  }) {
    const riskFlags: string[] = [];
    const metadata: Record<string, unknown> = {
      preScreenedAt: new Date().toISOString(),
    };

    const user = await this.databaseService.user.findUnique({
      where: { id: data.userId },
      include: {
        entrepreneurProfile: true,
        investorProfile: true,
      },
    });

    const profile =
      user?.role === UserRole.INVESTOR
        ? user?.investorProfile
        : user?.entrepreneurProfile;

    if (!user?.emailVerified) riskFlags.push('EMAIL_NOT_VERIFIED');
    if (!profile?.firstName || !profile?.lastName) {
      riskFlags.push('PROFILE_NAME_INCOMPLETE');
    }
    if (user?.role === UserRole.ENTREPRENEUR) {
      if (!user.entrepreneurProfile?.businessName) {
        riskFlags.push('BUSINESS_NAME_MISSING');
      }
      if (
        data.verificationType === VerificationType.BUSINESS &&
        !user.entrepreneurProfile?.cacNumber
      ) {
        riskFlags.push('CAC_NUMBER_MISSING');
      }
    }

    const documentUrl = String(data.documentUrl || '');
    const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'webp'];
    const extension = documentUrl.split('?')[0].split('.').pop()?.toLowerCase();
    metadata.documentExtension = extension || null;
    if (!documentUrl) {
      riskFlags.push('DOCUMENT_URL_MISSING');
    } else if (!extension || !allowedExtensions.includes(extension)) {
      riskFlags.push('UNSUPPORTED_DOCUMENT_TYPE');
    }

    const duplicateChecks: any[] = [];
    if (user?.email) duplicateChecks.push({ email: user.email });
    const businessName = user?.entrepreneurProfile?.businessName;
    if (businessName) {
      duplicateChecks.push({
        entrepreneurProfile: {
          businessName: { equals: businessName, mode: 'insensitive' },
        },
      });
    }

    const duplicateCount = await this.databaseService.user.count({
      where: {
        id: { not: data.userId },
        OR: duplicateChecks.filter(Boolean),
      },
    });
    metadata.duplicateAccountCandidates = duplicateCount;
    if (duplicateCount > 0) riskFlags.push('POSSIBLE_DUPLICATE_ACCOUNT');

    const severeFlags = new Set([
      'DOCUMENT_URL_MISSING',
      'UNSUPPORTED_DOCUMENT_TYPE',
      'BUSINESS_NAME_MISSING',
    ]);
    const status = riskFlags.some((flag) => severeFlags.has(flag))
      ? VerificationStatus.FLAGGED
      : VerificationStatus.PENDING;

    return {
      status,
      riskFlags,
      metadata,
    };
  }

  // 1. SUBMIT REQUEST (User)
  async create(data: {
    userId: string;
    documentUrl: string;
    verificationType?: string;
    consentAccepted?: boolean;
  }) {
    const user = await this.databaseService.user.findUnique({
      where: { id: data.userId },
      include: { subscription: true },
    });
    this.accessPolicy.assertCanSubmitVerification(user);
    const verificationType = this.normalizeVerificationType(
      data.verificationType,
    );
    const screening = await this.preScreen({
      userId: data.userId,
      documentUrl: data.documentUrl,
      verificationType,
    });

    const existing = await this.databaseService.verificationRequest.findUnique({
      where: {
        userId_verificationType: {
          userId: data.userId,
          verificationType,
        },
      },
    });

    // If resubmitting, update existing record and reset reason
    if (existing) {
      return this.databaseService.verificationRequest.update({
        where: { id: existing.id },
        data: {
          documentUrl: data.documentUrl,
          status: screening.status,
          provider: VerificationProvider.MANUAL,
          providerStatus:
            screening.status === VerificationStatus.FLAGGED
              ? 'manual_review_flagged'
              : 'manual_review_pending',
          trustLevel: this.trustLevelFor(
            verificationType,
            screening.status,
          ),
          consentedAt: data.consentAccepted ? new Date() : existing.consentedAt,
          verifiedAt: null,
          riskFlags: screening.riskFlags,
          metadata: screening.metadata as Prisma.InputJsonValue,
          rejectionReason: null,
        },
      });
    }

    return this.databaseService.verificationRequest.create({
      data: {
        userId: data.userId,
        documentUrl: data.documentUrl,
        status: screening.status,
        verificationType,
        provider: VerificationProvider.MANUAL,
        providerStatus:
          screening.status === VerificationStatus.FLAGGED
            ? 'manual_review_flagged'
            : 'manual_review_pending',
        trustLevel: this.trustLevelFor(verificationType, screening.status),
        consentedAt: data.consentAccepted ? new Date() : null,
        riskFlags: screening.riskFlags,
        metadata: screening.metadata as Prisma.InputJsonValue,
      },
    });
  }

  async startProviderSession(data: {
    userId: string;
    verificationType?: string;
    provider?: string;
    consentAccepted?: boolean;
    businessName?: string;
    cacNumber?: string;
  }) {
    if (!data.consentAccepted) {
      throw new BadRequestException(
        'Consent is required before starting third-party verification.',
      );
    }

    const user = await this.databaseService.user.findUnique({
      where: { id: data.userId },
      include: {
        subscription: true,
        entrepreneurProfile: true,
        investorProfile: true,
      },
    });
    this.accessPolicy.assertCanSubmitVerification(user);

    const verificationType = this.normalizeVerificationType(
      data.verificationType,
    );
    const provider = this.normalizeProvider(data.provider);
    const providerReference = [
      'naajih',
      data.userId,
      verificationType.toLowerCase(),
      Date.now(),
    ].join('_');
    const adapter = this.providerRegistry.get(provider);
    const session = await adapter.startSession({
      userId: data.userId,
      email: user?.email,
      verificationType,
      providerReference,
      businessName:
        data.businessName || user?.entrepreneurProfile?.businessName || null,
      cacNumber: data.cacNumber || user?.entrepreneurProfile?.cacNumber || null,
      metadata: {
        providerMode:
          provider === VerificationProvider.INTERNAL_SANDBOX
            ? 'placeholder'
            : 'external',
      },
    });

    const metadata = {
      businessName:
        data.businessName || user?.entrepreneurProfile?.businessName || null,
      cacNumber: data.cacNumber || user?.entrepreneurProfile?.cacNumber || null,
      ...(session.metadata || {}),
    };

    const request = await this.databaseService.verificationRequest.upsert({
      where: {
        userId_verificationType: {
          userId: data.userId,
          verificationType,
        },
      },
      update: {
        status: VerificationStatus.PENDING,
        verificationType,
        provider: session.provider,
        providerReference: session.providerReference,
        providerStatus: session.providerStatus,
        trustLevel: this.trustLevelFor(
          verificationType,
          VerificationStatus.PENDING,
        ),
        consentedAt: new Date(),
        verifiedAt: null,
        riskFlags: [],
        rejectionReason: null,
        metadata,
      },
      create: {
        userId: data.userId,
        status: VerificationStatus.PENDING,
        verificationType,
        provider: session.provider,
        providerReference: session.providerReference,
        providerStatus: session.providerStatus,
        trustLevel: this.trustLevelFor(
          verificationType,
          VerificationStatus.PENDING,
        ),
        consentedAt: new Date(),
        metadata,
      },
    });

    return {
      request,
      provider: session.provider,
      providerReference: session.providerReference,
      redirectUrl: session.redirectUrl,
      message: session.message,
    };
  }

  // 2. GET STATUS (User)
  async getStatus(userId: string, verificationType?: string) {
    if (verificationType) {
      return this.databaseService.verificationRequest.findUnique({
        where: {
          userId_verificationType: {
            userId,
            verificationType: this.normalizeVerificationType(verificationType),
          },
        },
      });
    }

    const requests = await this.databaseService.verificationRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return {
      status: requests.some(
        (request) => request.status === VerificationStatus.APPROVED,
      )
        ? VerificationStatus.APPROVED
        : requests.find(
            (request) => request.status === VerificationStatus.PENDING,
          )?.status ||
          requests[0]?.status ||
          null,
      requests,
    };
  }

  // 3. ADMIN: GET ALL PENDING
  async findAllPending(query?: {
    page?: string;
    pageSize?: string;
    status?: string;
    search?: string;
  }) {
    const page = Math.max(1, Number(query?.page) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(query?.pageSize) || 20));
    const skip = (page - 1) * pageSize;

    const where: any = {
      status:
        query?.status && query.status !== 'ALL' ? query.status : 'PENDING',
    };

    if (query?.search) {
      const search = query.search;
      where.user = {
        OR: [
          { email: { contains: search, mode: 'insensitive' } },
          {
            entrepreneurProfile: {
              firstName: { contains: search, mode: 'insensitive' },
            },
          },
          {
            entrepreneurProfile: {
              lastName: { contains: search, mode: 'insensitive' },
            },
          },
          {
            investorProfile: {
              firstName: { contains: search, mode: 'insensitive' },
            },
          },
          {
            investorProfile: {
              lastName: { contains: search, mode: 'insensitive' },
            },
          },
        ],
      };
    }

    const [total, data] = await Promise.all([
      this.databaseService.verificationRequest.count({ where }),
      this.databaseService.verificationRequest.findMany({
        where,
        include: {
          user: {
            include: { entrepreneurProfile: true, investorProfile: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
    ]);

    return {
      data,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      },
    };
  }

  async getQueueMetrics() {
    const slaHours = this.getVerificationSlaHours();
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const pendingWhere = {
      status: { in: [VerificationStatus.PENDING, VerificationStatus.FLAGGED] },
    };

    const [backlogSize, flaggedSize, recentApproved] = await Promise.all([
      this.databaseService.verificationRequest.count({ where: pendingWhere }),
      this.databaseService.verificationRequest.count({
        where: { status: VerificationStatus.FLAGGED },
      }),
      this.databaseService.verificationRequest.findMany({
        where: {
          status: VerificationStatus.APPROVED,
          verifiedAt: { gte: since },
        },
        select: { createdAt: true, verifiedAt: true },
      }),
    ]);

    const averageHours =
      recentApproved.length === 0
        ? null
        : Math.round(
            recentApproved.reduce((sum, request) => {
              return (
                sum +
                (request.verifiedAt!.getTime() - request.createdAt.getTime()) /
                  36e5
              );
            }, 0) / recentApproved.length,
          );

    return {
      slaHours,
      backlogSize,
      flaggedSize,
      averageTimeToVerifyHours: averageHours,
      reviewedLast30Days: recentApproved.length,
      slaCopy: `Target turnaround is ${slaHours} hours for complete submissions.`,
    };
  }

  async bulkUpdateStatus(
    ids: string[],
    status: VerificationStatus,
    rejectionReason?: string,
    actorId?: string,
  ) {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new BadRequestException('At least one request id is required.');
    }
    if (status === VerificationStatus.REJECTED && !rejectionReason?.trim()) {
      throw new BadRequestException('Rejection reason is required.');
    }

    const results = [];
    for (const id of ids) {
      results.push(
        await this.updateStatus(id, status, rejectionReason, actorId),
      );
    }

    return { updated: results.length, data: results };
  }

  // 4. ADMIN: APPROVE/REJECT
  async updateStatus(
    id: string,
    status: VerificationStatus,
    rejectionReason?: string,
    actorId?: string,
  ) {
    const existing = await this.databaseService.verificationRequest.findUnique({
      where: { id },
      select: { verificationType: true },
    });
    if (!existing) {
      throw new BadRequestException('Verification request not found.');
    }

    // 1. Update the Request
    const request = await this.databaseService.verificationRequest.update({
      where: { id },
      data: {
        status,
        providerStatus: `manual_${status.toLowerCase()}`,
        trustLevel: this.trustLevelFor(existing.verificationType, status),
        verifiedAt: status === VerificationStatus.APPROVED ? new Date() : null,
        rejectionReason: status === 'REJECTED' ? rejectionReason : null,
      },
    });

    await this.refreshUserVerification(request.userId);

    // 3. Notify User
    const message =
      status === 'REJECTED' && rejectionReason
        ? `Your verification request was rejected. Reason: ${rejectionReason}`
        : `Your verification request has been ${status.toLowerCase()}.`;

    await this.notificationsService.create(request.userId, message);

    const user = await this.databaseService.user.findUnique({
      where: { id: request.userId },
      select: { id: true, email: true, role: true },
    });

    await this.auditService.log({
      action: 'VERIFICATION_STATUS_UPDATED',
      entityType: 'VerificationRequest',
      entityId: id,
      actorId,
      metadata: {
        status,
        rejectionReason: rejectionReason ?? null,
        targetUserId: user?.id,
        targetUserEmail: user?.email,
        targetUserRole: user?.role,
      },
    });

    return request;
  }

  async handleProviderWebhook(data: {
    providerReference?: string;
    provider?: string;
    status?: string;
    riskFlags?: unknown;
    metadata?: unknown;
    signature?: string;
  }) {
    const expectedSecret = process.env.VERIFICATION_WEBHOOK_SECRET;
    if (expectedSecret && data.signature !== expectedSecret) {
      throw new UnauthorizedException('Invalid verification webhook secret.');
    }
    if (process.env.NODE_ENV === 'production' && !expectedSecret) {
      throw new UnauthorizedException(
        'Verification webhook secret is not configured.',
      );
    }

    if (!data.providerReference) {
      throw new BadRequestException('Provider reference is required.');
    }

    const provider = data.provider
      ? this.normalizeProvider(data.provider)
      : VerificationProvider.INTERNAL_SANDBOX;
    const adapter = this.providerRegistry.get(provider);
    const normalized = adapter.normalizeWebhook(data);

    const existing = await this.databaseService.verificationRequest.findFirst({
      where: {
        providerReference: normalized.providerReference,
        provider,
      },
    });

    if (!existing) {
      throw new BadRequestException('Verification request not found.');
    }

    const updated = await this.databaseService.verificationRequest.update({
      where: { id: existing.id },
      data: {
        status: normalized.status,
        providerStatus: normalized.providerStatus,
        trustLevel: this.trustLevelFor(
          existing.verificationType,
          normalized.status,
        ),
        verifiedAt:
          normalized.status === VerificationStatus.APPROVED ? new Date() : null,
        riskFlags: normalized.riskFlags,
        metadata: (normalized.metadata ||
          existing.metadata) as Prisma.InputJsonValue,
        rejectionReason:
          normalized.status === VerificationStatus.REJECTED
            ? 'Rejected by verification provider.'
            : null,
      },
    });

    await this.refreshUserVerification(updated.userId);
    return updated;
  }
}
