import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { NotificationsService } from '../notifications/notifications.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class VerificationService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly notificationsService: NotificationsService,
    private readonly auditService: AuditService,
  ) {}

  // 1. SUBMIT REQUEST (User)
  async create(data: { userId: string; documentUrl: string }) {
    const existing = await this.databaseService.verificationRequest.findUnique({
      where: { userId: data.userId },
    });

    // If resubmitting, update existing record and reset reason
    if (existing) {
      return this.databaseService.verificationRequest.update({
        where: { userId: data.userId },
        data: {
          documentUrl: data.documentUrl,
          status: 'PENDING',
          rejectionReason: null,
        },
      });
    }

    return this.databaseService.verificationRequest.create({
      data: {
        userId: data.userId,
        documentUrl: data.documentUrl,
        status: 'PENDING',
      },
    });
  }

  // 2. GET STATUS (User)
  async getStatus(userId: string) {
    return this.databaseService.verificationRequest.findUnique({
      where: { userId },
    });
  }

  // 3. ADMIN: GET ALL PENDING
  async findAllPending(query?: { page?: string; pageSize?: string; status?: string; search?: string }) {
    const page = Math.max(1, Number(query?.page) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(query?.pageSize) || 20));
    const skip = (page - 1) * pageSize;

    const where: any = {
      status:
        query?.status && query.status !== 'ALL'
          ? query.status
          : 'PENDING',
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

  // 4. ADMIN: APPROVE/REJECT
  async updateStatus(
    id: string,
    status: 'APPROVED' | 'REJECTED',
    rejectionReason?: string,
    actorId?: string,
  ) {
    // 1. Update the Request
    const request = await this.databaseService.verificationRequest.update({
      where: { id },
      data: {
        status,
      },
    });

    // 2. Update the User's overall verification status
    if (status === 'APPROVED') {
      await this.databaseService.user.update({
        where: { id: request.userId },
        data: { isVerified: true },
      });
    } else if (status === 'REJECTED') {
      await this.databaseService.user.update({
        where: { id: request.userId },
        data: { isVerified: false },
      });
    }

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
}
