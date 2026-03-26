import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class PitchesService {
  constructor(
    private prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  // 1. CREATE A PITCH
  async create(data: Prisma.PitchCreateInput) {
    return this.prisma.pitch.create({
      data,
    });
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

    const [total, data] = await Promise.all([
      this.prisma.pitch.count({ where }),
      this.prisma.pitch.findMany({
        where,
        include: {
          user: {
            include: { entrepreneurProfile: true },
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
  // 3. GET ONE PITCH (For Details View)
  async findOne(id: string) {
    return this.prisma.pitch.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  // Admin stats (counts, funding total, category breakdown)
  async getAdminStats() {
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
  }

  // 4. UPDATE PITCH
  async update(id: string, data: any, actorId?: string) {
    const updated = await this.prisma.pitch.update({
      where: { id },
      data,
      include: {
        user: {
          select: { id: true, email: true },
        },
      },
    });

    if (data?.status) {
      await this.auditService.log({
        action: 'PITCH_STATUS_UPDATED',
        entityType: 'Pitch',
        entityId: id,
        actorId,
        metadata: {
          status: data.status,
          pitchTitle: updated.title,
          ownerId: updated.user?.id,
          ownerEmail: updated.user?.email,
        },
      });
    }

    return updated;
  }

  // 5. DELETE PITCH
  async remove(id: string) {
    return this.prisma.pitch.delete({
      where: { id },
    });
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

    return this.prisma.pitch.findMany({
      where,
      include: {
        user: {
          include: { entrepreneurProfile: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }
}
