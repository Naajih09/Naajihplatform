import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { User, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { DatabaseService } from '../database/database.service';
import { MailerService } from '../mailer/mailer.service';
import { verificationEmail } from '../mailer/templates';

interface CreateUserDto {
  email: string;
  password: string;
  role: UserRole;
  firstName: string;
  lastName: string;
}

@Injectable()
export class UsersService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly mailerService: MailerService,
  ) {}

  private getVerificationTtlHours() {
    const hours = Number(process.env.EMAIL_VERIFICATION_TTL_HOURS || 24);
    return Number.isFinite(hours) && hours > 0 ? hours : 24;
  }

  private getTrialDurationDays() {
    const days = Number(process.env.TRIAL_DURATION_DAYS || 14);
    return Number.isFinite(days) && days > 0 ? days : 14;
  }

  private async issueEmailVerification(userId: string, email: string) {
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(
      Date.now() + this.getVerificationTtlHours() * 60 * 60 * 1000,
    );

    await this.databaseService.user.update({
      where: { id: userId },
      data: {
        emailVerificationToken: token,
        emailVerificationExpires: expires,
      },
    });

    const apiPrefix = process.env.API_PREFIX || 'api';
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';
    const verifyUrl = `${backendUrl}/${apiPrefix}/users/verify-email?token=${token}`;

    const emailed = await this.mailerService.sendMail(
      email,
      'Verify your Naajih account',
      verificationEmail(verifyUrl, this.getVerificationTtlHours()),
    );

    return { verifyUrl, emailed };
  }

  // 1. SIGNUP (Create User + Profile + Hash Password)
  async create(createUserDto: CreateUserDto) {
    const { email, password, role, firstName, lastName } = createUserDto;

    // 🔐 HASH THE PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine profile type based on role
    let profileData = {};
    if (role === UserRole.ENTREPRENEUR) {
      profileData = {
        entrepreneurProfile: { create: { firstName, lastName } },
      };
    } else if (role === UserRole.INVESTOR) {
      profileData = { investorProfile: { create: { firstName, lastName } } };
    } else {
      // Default for Aspirant
      profileData = {
        entrepreneurProfile: { create: { firstName, lastName } },
      };
    }

    // Save to Database
    const newUser = await this.databaseService.user.create({
      data: {
        email,
        password: hashedPassword, // Save the HASH
        role,
        ...profileData,
      },
      include: { entrepreneurProfile: true, investorProfile: true },
    });

    await this.issueEmailVerification(newUser.id, newUser.email);

    const { password: _, ...result } = newUser;
    return result;
  }

  // Admin-only creation (no public signup)
  async createAdmin(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.databaseService.user.create({
      data: {
        email,
        password: hashedPassword,
        role: UserRole.ADMIN,
        emailVerified: true,
        entrepreneurProfile: { create: { firstName, lastName } },
      },
      include: { entrepreneurProfile: true, investorProfile: true },
    });

    const { password: _, ...result } = newUser;
    return result;
  }

  async findById(id: string): Promise<User | null> {
    return this.databaseService.user.findUnique({
      where: { id },
    });
  }

  // 2. LOGIN (Check Hashed Password)
  async login(email: string, pass: string) {
    const user = await this.databaseService.user.findUnique({
      where: { email },
      include: { entrepreneurProfile: true, investorProfile: true },
    });

    if (!user) return null;
    if (user.isActive === false) return null;

    // Compare the plain text 'pass' with the Hash in DB
    const isMatch = await bcrypt.compare(pass, user.password);

    if (!isMatch) return null;

    return user;
  }

  // 3. FIND ALL
  async findAll(query?: {
    search?: string;
    role?: string;
    sortBy?: string;
    page?: string;
    pageSize?: string;
  }) {
    const page = Math.max(1, Number(query?.page) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(query?.pageSize) || 20));
    const skip = (page - 1) * pageSize;
    const sortBy = query?.sortBy === 'name' ? 'name' : 'date';

    const where: any = {};

    if (query?.role && query.role !== 'ALL') {
      where.role = query.role;
    }

    if (query?.search) {
      const search = query.search;
      where.OR = [
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
      ];
    }

    const [total, data] = await Promise.all([
      this.databaseService.user.count({ where }),
      this.databaseService.user.findMany({
        where,
        include: { entrepreneurProfile: true, investorProfile: true },
        orderBy:
          sortBy === 'name'
            ? [
                { entrepreneurProfile: { firstName: 'asc' } },
                { investorProfile: { firstName: 'asc' } },
                { email: 'asc' },
              ]
            : { createdAt: 'desc' },
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

  // 4. FIND ONE
  async findOne(email: string) {
    return this.databaseService.user.findUnique({
      where: { email },
      include: {
        entrepreneurProfile: true,
        investorProfile: true,
        subscription: true,
      },
    });
  }

  async requestEmailVerification(userId: string) {
    const user = await this.databaseService.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, emailVerified: true },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.emailVerified) {
      return { status: 'ok', message: 'Email already verified' };
    }

    const { verifyUrl, emailed } = await this.issueEmailVerification(
      user.id,
      user.email,
    );
    return {
      status: 'ok',
      message: emailed
        ? 'Verification email sent'
        : 'SMTP is not configured. Use the verification link manually.',
      emailed,
      verifyUrl,
    };
  }

  async verifyEmailToken(token: string) {
    const user = await this.databaseService.user.findFirst({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      throw new BadRequestException('Invalid token');
    }

    if (
      user.emailVerificationExpires &&
      user.emailVerificationExpires < new Date()
    ) {
      throw new BadRequestException('Token expired');
    }

    await this.databaseService.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },
    });

    return { status: 'ok', message: 'Email verified' };
  }

  // 5. UPDATE PROFILE
  async update(id: string, data: any) {
    const { entrepreneurProfile, investorProfile, ...userData } = data;
    const updateData: any = { ...userData };

    if (entrepreneurProfile) {
      // Remove IDs to avoid Prisma errors

      const { id: _id, userId: _uid, ...cleanData } = entrepreneurProfile;
      updateData.entrepreneurProfile = {
        upsert: { create: cleanData, update: cleanData },
      };
    }

    if (investorProfile) {
      const { id: _id, userId: _uid, ...cleanData } = investorProfile;

      if (cleanData.minTicketSize)
        cleanData.minTicketSize = Number(cleanData.minTicketSize);
      if (cleanData.maxTicketSize)
        cleanData.maxTicketSize = Number(cleanData.maxTicketSize);

      updateData.investorProfile = {
        upsert: { create: cleanData, update: cleanData },
      };
    }

    return this.databaseService.user.update({
      where: { id },
      data: updateData,
      include: { entrepreneurProfile: true, investorProfile: true },
    });
  }

  // 6. DASHBOARD STATS
  async getDashboardStats(userId: string) {
    const [activePitches, pendingConnections, user] = await Promise.all([
      this.databaseService.pitch.count({
        where: { userId },
      }),
      this.databaseService.connection.count({
        where: {
          receiverId: userId,
          status: 'PENDING',
        },
      }),
      this.databaseService.user.findUnique({
        where: { id: userId },
        include: { subscription: true },
      }),
    ]);

    const now = new Date();
    const activeUntil =
      user?.subscription?.endDate || user?.subscription?.trialEndsAt;
    const hasPremium =
      user?.subscription?.plan === 'PREMIUM' &&
      (!activeUntil || activeUntil > now);
    const freePitchLimit = Number(process.env.FREE_PITCH_LIMIT || 1);
    const pitchLimit =
      Number.isFinite(freePitchLimit) && freePitchLimit > 0
        ? freePitchLimit
        : 1;
    const remainingPitchSlots = hasPremium
      ? null
      : Math.max(0, pitchLimit - activePitches);

    return {
      activePitches,
      pendingConnections,
      isVerified: user?.isVerified || false,
      hasPremium,
      pitchLimit: hasPremium ? null : pitchLimit,
      remainingPitchSlots,
      canCreatePitch: hasPremium || activePitches < pitchLimit,
      totalViews: 0,
    };
  }

  // Admin stats (platform overview)
  async getAdminStats() {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const [totalUsers, activeUsers, verifiedUsers, roleCounts] =
      await Promise.all([
        this.databaseService.user.count(),
        this.databaseService.user.count({ where: { isActive: true } }),
        this.databaseService.user.count({ where: { isVerified: true } }),
        this.databaseService.user.groupBy({
          by: ['role'],
          _count: { _all: true },
        }),
      ]);

    const [newUsersLast7Days, newConnectionsLast7Days] = await Promise.all([
      this.databaseService.user.count({
        where: { createdAt: { gte: since } },
      }),
      this.databaseService.connection.count({
        where: { createdAt: { gte: since } },
      }),
    ]);

    const roles: Record<string, number> = {};
    roleCounts.forEach((row) => {
      roles[row.role] = row._count._all;
    });

    return {
      totalUsers,
      activeUsers,
      verifiedUsers,
      roles,
      newUsersLast7Days,
      newConnectionsLast7Days,
    };
  }

  // Admin insights (last 7 days time series)
  async getAdminInsights() {
    const days = 7;
    const today = new Date();
    const results: Array<{
      date: string;
      newUsers: number;
      newPitches: number;
      newConnections: number;
    }> = [];

    for (let i = days - 1; i >= 0; i -= 1) {
      const start = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - i,
      );
      const end = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - i + 1,
      );

      const [newUsers, newPitches, newConnections] = await Promise.all([
        this.databaseService.user.count({
          where: { createdAt: { gte: start, lt: end } },
        }),
        this.databaseService.pitch.count({
          where: { createdAt: { gte: start, lt: end } },
        }),
        this.databaseService.connection.count({
          where: { createdAt: { gte: start, lt: end } },
        }),
      ]);

      results.push({
        date: start.toISOString().slice(0, 10),
        newUsers,
        newPitches,
        newConnections,
      });
    }

    return results;
  }

  // 7. CHANGE PASSWORD
  async changePassword(id: string, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return this.databaseService.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  // 8. DELETE ACCOUNT (The Nuclear Option - Fixed)
  async deleteUser(id: string) {
    // 1. Delete related connections
    await this.databaseService.connection.deleteMany({
      where: { OR: [{ senderId: id }, { receiverId: id }] },
    });

    // 2. Delete related messages (New addition for safety)
    await this.databaseService.message.deleteMany({
      where: { OR: [{ senderId: id }, { receiverId: id }] },
    });

    // 3. Delete their pitches
    await this.databaseService.pitch.deleteMany({
      where: { userId: id },
    });

    // 4. Delete their profile (Entrepreneur/Investor)
    try {
      await this.databaseService.entrepreneurProfile.delete({
        where: { userId: id },
      });
    } catch (e) {}

    try {
      await this.databaseService.investorProfile.delete({
        where: { userId: id },
      });
    } catch (e) {}

    // 5. Finally, Delete the User
    return this.databaseService.user.delete({ where: { id } });
  }

  // 9. UPGRADE TO PREMIUM
  async upgradeToPremium(userId: string) {
    const sub = await this.databaseService.subscription.findUnique({
      where: { userId },
    });

    if (sub) {
      return this.databaseService.subscription.update({
        where: { userId },
        data: { plan: 'PREMIUM' },
      });
    } else {
      return this.databaseService.subscription.create({
        data: {
          userId,
          plan: 'PREMIUM',
        },
      });
    }
  }

  async startTrial(userId: string) {
    const subscription = await this.databaseService.subscription.findUnique({
      where: { userId },
    });

    if (subscription?.trialUsed) {
      throw new ForbiddenException('Trial already used.');
    }

    const now = new Date();
    if (
      subscription?.plan === 'PREMIUM' &&
      subscription?.endDate &&
      subscription.endDate > now
    ) {
      throw new ForbiddenException(
        'Active premium subscription already exists.',
      );
    }

    const trialEndsAt = new Date(
      Date.now() + this.getTrialDurationDays() * 24 * 60 * 60 * 1000,
    );

    if (subscription) {
      return this.databaseService.subscription.update({
        where: { userId },
        data: {
          plan: 'PREMIUM',
          endDate: trialEndsAt,
          trialEndsAt,
          trialUsed: true,
        },
      });
    }

    return this.databaseService.subscription.create({
      data: {
        userId,
        plan: 'PREMIUM',
        endDate: trialEndsAt,
        trialEndsAt,
        trialUsed: true,
      },
    });
  }
}
