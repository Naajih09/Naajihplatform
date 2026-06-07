import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, UserRole } from '@prisma/client';
import { AuditService } from '../audit/audit.service';
import { AppCacheService } from '../cache/app-cache.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class PitchesService {
  constructor(
    private prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly cache: AppCacheService,
    private readonly notificationsService: NotificationsService,
  ) {}

  private clearPitchCache(userId?: string) {
    this.cache.deleteByPrefix('pitches:');
    this.cache.deleteByPrefix('admin-pitches:');
    this.cache.deleteByPrefix('admin-users:');
    if (userId) {
      this.cache.deleteByPrefix(`user:${userId}:`);
      this.cache.deleteByPrefix(`pitches-recommended:${userId}:`);
    } else {
      this.cache.deleteByPrefix('pitches-recommended:');
    }
  }

  private normalizeNumericString(value: unknown, field: string) {
    const rawValue =
      typeof value === 'number'
        ? String(value)
        : typeof value === 'string'
          ? value.trim()
          : '';
    const cleaned = rawValue.replace(/,/g, '');
    const parsed = Number(cleaned);

    if (!cleaned || !Number.isFinite(parsed) || parsed < 0) {
      throw new BadRequestException(`${field} must be a valid number.`);
    }

    return String(parsed);
  }

  private normalizePitchMoneyFields<T extends Record<string, any>>(data: T) {
    const normalized: Record<string, any> = { ...data };

    if ('fundingAsk' in normalized) {
      normalized.fundingAsk = this.normalizeNumericString(
        normalized.fundingAsk,
        'Funding ask',
      );
    }

    if ('equityOffer' in normalized) {
      const equityOffer = Number(
        this.normalizeNumericString(normalized.equityOffer, 'Equity offer'),
      );
      if (equityOffer > 100) {
        throw new BadRequestException('Equity offer cannot exceed 100%.');
      }
      normalized.equityOffer = String(equityOffer);
    }

    return normalized as T;
  }

  // 1. CREATE A PITCH
  async create(data: Prisma.PitchCreateInput, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.role !== UserRole.ENTREPRENEUR) {
      throw new ForbiddenException('Only entrepreneur accounts can submit pitches.');
    }

    if (!user.isVerified) {
      throw new ForbiddenException('Verify your account to unlock this feature');
    }

    const now = new Date();
    const activeUntil =
      user.subscription?.endDate || user.subscription?.trialEndsAt;
    const hasPremium =
      user.subscription?.plan === 'PREMIUM' &&
      (!activeUntil || activeUntil > now);

    if (!hasPremium) {
      throw new ForbiddenException(
        'Premium subscription is required to submit pitches.',
      );
    }

    const pitch = await this.prisma.pitch.create({
      data: {
        ...this.normalizePitchMoneyFields(data),
        user: {
          connect: { id: userId },
        },
      },
    });
    this.clearPitchCache(userId);
    return pitch;
  }

  // 2. GET ALL PITCHES (With Search & Filter)
  async findAll(query: {
    search?: string;
    category?: string;
    status?: string;
    stage?: string;
    industry?: string;
    minTicket?: string;
    maxTicket?: string;
    page?: string;
    pageSize?: string;
  }) {
    const { search, category, status, stage, industry, minTicket, maxTicket } =
      query;
    const page = Math.max(1, Number(query.page) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(query.pageSize) || 20));
    const skip = (page - 1) * pageSize;

    const where: any = {
      AND: [
        // Filter by Category if provided
        category && category !== 'All' && category !== 'ALL'
          ? { category: category }
          : {},

        // Filter by Status if provided
        status && status !== 'All' && status !== 'ALL' ? { status } : {},

        // Filter by Stage (via EntrepreneurProfile)
        stage && stage !== 'All'
          ? {
              user: {
                entrepreneurProfile: {
                  stage: stage,
                },
              },
            }
          : {},

        // Filter by Industry (via EntrepreneurProfile)
        industry && industry !== 'All'
          ? {
              user: {
                entrepreneurProfile: {
                  industry: industry,
                },
              },
            }
          : {},

        // Filter by Ticket Size (fundingAsk)
        minTicket
          ? {
              fundingAsk: {
                gte: minTicket,
              },
            }
          : {},
        maxTicket
          ? {
              fundingAsk: {
                lte: maxTicket,
              },
            }
          : {},

        // Search by Title or Tagline if provided
        search
          ? {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { tagline: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {},
      ],
    };

    return this.cache.getOrSet(
      AppCacheService.stableKey('pitches:list', {
        search,
        category,
        status,
        stage,
        industry,
        minTicket,
        maxTicket,
        page,
        pageSize,
      }),
      30,
      async () => {
        const [total, data] = await Promise.all([
          this.prisma.pitch.count({ where }),
          this.prisma.pitch.findMany({
            where,
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  role: true,
                  isVerified: true,
                  entrepreneurProfile: true,
                },
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
      },
    );
  }
  // 3. GET ONE PITCH (For Details View)
  async findOne(id: string) {
    const uuidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidPattern.test(id)) {
      throw new BadRequestException('Invalid pitch id.');
    }

    return this.cache.getOrSet(`pitches:detail:${id}`, 30, () =>
      this.prisma.pitch.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
              isVerified: true,
              isActive: true,
              emailVerified: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      }),
    );
  }

  // Admin stats (counts, funding total, category breakdown)
  async getAdminStats() {
    return this.cache.getOrSet('admin-pitches:stats', 60, async () => {
      const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const pitches = await this.prisma.pitch.findMany({
        select: { fundingAsk: true, category: true },
      });

      const totalPitches = pitches.length;
      const fundingTotal = pitches.reduce((sum, pitch) => {
        const ask = Number(pitch.fundingAsk);
        return sum + (Number.isFinite(ask) ? ask : 0);
      }, 0);

      const categoryCounts = pitches.reduce(
        (acc: Record<string, number>, pitch) => {
          const category = pitch.category || 'Uncategorized';
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        },
        {},
      );

      const investmentBreakdown = Object.entries(categoryCounts)
        .map(([label, count]) => ({
          label,
          value: Math.round((count / Math.max(totalPitches, 1)) * 100),
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 4);

      const newPitchesLast7Days = await this.prisma.pitch.count({
        where: { createdAt: { gte: since } },
      });

      return {
        totalPitches,
        fundingTotal,
        investmentBreakdown,
        newPitchesLast7Days,
      };
    });
  }

  // 4. UPDATE PITCH
  async update(id: string, data: any, actorId?: string) {
    const updateData = this.normalizePitchMoneyFields(data);

    if (updateData.status === 'REJECTED') {
      const reason = String(updateData.rejectionReason || '').trim();
      if (!reason) {
        throw new BadRequestException('Rejection reason is required.');
      }
      updateData.rejectionReason = reason;
    }

    if (updateData.status === 'APPROVED') {
      updateData.rejectionReason = null;
    }

    const updated = await this.prisma.pitch.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: { id: true, email: true },
        },
      },
    });

    if (updateData?.status) {
      if (updateData.status === 'REJECTED') {
        await this.notificationsService.create(
          updated.user.id,
          `Your pitch "${updated.title}" was rejected. Reason: ${updated.rejectionReason}`,
        );
      } else if (updateData.status === 'APPROVED') {
        await this.notificationsService.create(
          updated.user.id,
          `Your pitch "${updated.title}" has been approved.`,
        );
      }

      await this.auditService.log({
        action: 'PITCH_STATUS_UPDATED',
        entityType: 'Pitch',
        entityId: id,
        actorId,
        metadata: {
          status: updateData.status,
          rejectionReason: updated.rejectionReason ?? null,
          pitchTitle: updated.title,
          ownerId: updated.user?.id,
          ownerEmail: updated.user?.email,
        },
      });
    }

    this.clearPitchCache(updated.user?.id);
    return updated;
  }

  // 5. DELETE PITCH
  async remove(id: string) {
    throw new ForbiddenException(
      'Pitches should be rejected with a reason instead of deleted.',
    );
  }

  // 6. RECOMMENDED PITCHES (Simple industry/category match)
  async getRecommended(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        entrepreneurProfile: true,
        investorProfile: true,
      },
    });

    if (!user) {
      return [];
    }

    const industries = new Set<string>();
    if (user.investorProfile?.focusIndustries?.length) {
      user.investorProfile.focusIndustries.forEach((i) => industries.add(i));
    }
    if (user.entrepreneurProfile?.industry) {
      industries.add(user.entrepreneurProfile.industry);
    }

    const industryList = Array.from(industries);

    const where =
      industryList.length > 0
        ? {
            OR: [
              { category: { in: industryList } },
              {
                user: {
                  entrepreneurProfile: {
                    industry: { in: industryList },
                  },
                },
              },
            ],
          }
        : {};

    return this.cache.getOrSet(`pitches-recommended:${userId}:list`, 30, () =>
      this.prisma.pitch.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
              isVerified: true,
              entrepreneurProfile: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
    );
  }
}
