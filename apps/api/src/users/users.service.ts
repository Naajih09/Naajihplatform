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
import { AppCacheService } from '../cache/app-cache.service';
import {
  passwordResetEmail,
  verificationEmail,
  welcomeEmail,
} from '../mailer/templates';

interface CreateUserDto {
  email: string;
  password: string;
  role: UserRole;
  firstName: string;
  lastName: string;
}

const ADMIN_PERMISSIONS = [
  'dashboard',
  'users',
  'pitches',
  'verification',
  'academy',
  'messages',
  'audit',
  'settings',
] as const;

@Injectable()
export class UsersService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly mailerService: MailerService,
    private readonly cache: AppCacheService,
  ) {}

  private clearUserCache(userId?: string) {
    void this.cache.deleteByPrefix('users:');
    void this.cache.deleteByPrefix('admin-users:');
    if (userId) {
      void this.cache.deleteByPrefix(`user:${userId}:`);
    }
  }

  private sanitizeUser<T extends Record<string, any> | null>(user: T) {
    if (!user) return user;
    const {
      password: _password,
      emailVerificationToken: _emailVerificationToken,
      emailVerificationExpires: _emailVerificationExpires,
      passwordResetToken: _passwordResetToken,
      passwordResetExpires: _passwordResetExpires,
      ...safeUser
    } = user;
    return safeUser;
  }

  private getVerificationTtlHours() {
    const hours = Number(process.env.EMAIL_VERIFICATION_TTL_HOURS || 24);
    return Number.isFinite(hours) && hours > 0 ? hours : 24;
  }

  private getTrialDurationDays() {
    const days = Number(process.env.TRIAL_DURATION_DAYS || 14);
    return Number.isFinite(days) && days > 0 ? days : 14;
  }

  private getPasswordResetTtlMinutes() {
    const minutes = Number(process.env.PASSWORD_RESET_TTL_MINUTES || 30);
    return Number.isFinite(minutes) && minutes > 0 ? minutes : 30;
  }

  private hashToken(token: string) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private getFrontendUrl() {
    return (process.env.FRONTEND_URL || 'http://localhost:3001').replace(
      /\/+$/,
      '',
    );
  }

  private shouldExposePasswordResetLink(emailDelivered?: boolean) {
    return (
      process.env.NODE_ENV !== 'production' ||
      (process.env.BETA_TEST_MODE === 'true' &&
        process.env.PASSWORD_RESET_EXPOSE_LINK === 'true') ||
      (emailDelivered === false &&
        process.env.PASSWORD_RESET_FALLBACK_LINK_ON_EMAIL_FAILURE === 'true')
    );
  }

  private normalizeAdminPermissions(permissions?: unknown) {
    if (!Array.isArray(permissions)) return [];
    return permissions
      .filter(
        (permission): permission is string => typeof permission === 'string',
      )
      .map((permission) => permission.trim())
      .filter((permission) =>
        (ADMIN_PERMISSIONS as readonly string[]).includes(permission),
      );
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

  private async sendWelcomeEmail(user: {
    email: string;
    role: UserRole;
    entrepreneurProfile?: { firstName: string | null } | null;
    investorProfile?: { firstName: string | null } | null;
  }) {
    const firstName =
      user.entrepreneurProfile?.firstName ||
      user.investorProfile?.firstName ||
      'there';

    return this.mailerService.sendMail(
      user.email,
      'Welcome to NaajihBiz',
      welcomeEmail({
        firstName,
        role: user.role,
        dashboardUrl: `${this.getFrontendUrl()}/dashboard`,
      }),
    );
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

    await Promise.all([
      this.issueEmailVerification(newUser.id, newUser.email),
      this.sendWelcomeEmail(newUser),
    ]);

    const { password: _, ...result } = newUser;
    this.clearUserCache(newUser.id);
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
        isVerified: true,
        emailVerified: true,
        adminPermissions: [...ADMIN_PERMISSIONS],
        entrepreneurProfile: { create: { firstName, lastName } },
      },
      include: { entrepreneurProfile: true, investorProfile: true },
    });

    const { password: _, ...result } = newUser;
    this.clearUserCache(newUser.id);
    return result;
  }

  async getAdminTeam() {
    const admins = await this.databaseService.user.findMany({
      where: { role: UserRole.ADMIN },
      include: { entrepreneurProfile: true },
      orderBy: { createdAt: 'asc' },
    });

    return admins.map((admin) => this.sanitizeUser(admin));
  }

  async createAdminTeamMember(data: {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    adminPermissions?: string[];
  }) {
    if (!data.email || !data.password || !data.firstName || !data.lastName) {
      throw new BadRequestException(
        'Email, password, first name, and last name are required.',
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const adminPermissions = this.normalizeAdminPermissions(
      data.adminPermissions,
    );

    const newAdmin = await this.databaseService.user.create({
      data: {
        email: data.email.trim().toLowerCase(),
        password: hashedPassword,
        role: UserRole.ADMIN,
        isVerified: true,
        emailVerified: true,
        adminPermissions,
        entrepreneurProfile: {
          create: {
            firstName: data.firstName,
            lastName: data.lastName,
          },
        },
      },
      include: { entrepreneurProfile: true },
    });

    this.clearUserCache(newAdmin.id);
    return this.sanitizeUser(newAdmin);
  }

  async updateAdminPermissions(adminId: string, permissions: unknown) {
    const admin = await this.databaseService.user.findUnique({
      where: { id: adminId },
      select: { id: true, role: true },
    });

    if (!admin || admin.role !== UserRole.ADMIN) {
      throw new BadRequestException('Admin user not found.');
    }

    const updated = await this.databaseService.user.update({
      where: { id: adminId },
      data: {
        adminPermissions: this.normalizeAdminPermissions(permissions),
      },
      include: { entrepreneurProfile: true },
    });

    this.clearUserCache(adminId);
    return this.sanitizeUser(updated);
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
    return this.cache.getOrSet(
      AppCacheService.stableKey('admin-users:list', query || {}),
      30,
      async () => {
        const page = Math.max(1, Number(query?.page) || 1);
        const pageSize = Math.min(
          100,
          Math.max(1, Number(query?.pageSize) || 20),
        );
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
          data: data.map((user) => this.sanitizeUser(user)),
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

  async findPublicByEmail(email: string) {
    const user = await this.findOne(email);
    return this.sanitizeUser(user);
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

    this.clearUserCache(user.id);
    return { status: 'ok', message: 'Email verified' };
  }

  async requestPasswordReset(email: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const genericResponse = {
      status: 'ok',
      message:
        'If an account exists for that email, a password reset link has been sent.',
    };

    const user = await this.databaseService.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true, email: true, isActive: true },
    });

    if (!user || user.isActive === false) {
      return genericResponse;
    }

    const token = crypto.randomBytes(32).toString('hex');
    const resetUrl = `${this.getFrontendUrl()}/reset-password?token=${token}`;
    const expires = new Date(
      Date.now() + this.getPasswordResetTtlMinutes() * 60 * 1000,
    );

    await this.databaseService.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: this.hashToken(token),
        passwordResetExpires: expires,
      },
    });

    const emailed = await this.mailerService.sendMail(
      user.email,
      'Reset your NaajihBiz password',
      passwordResetEmail(resetUrl, this.getPasswordResetTtlMinutes()),
    );

    const response = {
      ...genericResponse,
      emailed,
    };

    if (this.shouldExposePasswordResetLink(emailed)) {
      return {
        ...response,
        resetUrl,
        deliveryFallback:
          emailed === false
            ? 'Email delivery failed, so a temporary reset link is shown for this beta environment.'
            : undefined,
      };
    }

    return response;
  }

  async resetPassword(token: string, password: string) {
    const user = await this.databaseService.user.findFirst({
      where: {
        passwordResetToken: this.hashToken(token),
        passwordResetExpires: { gt: new Date() },
        isActive: true,
      },
      select: { id: true },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired reset link');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.databaseService.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    this.clearUserCache(user.id);
    return { status: 'ok', message: 'Password reset successfully' };
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

    const user = await this.databaseService.user.update({
      where: { id },
      data: updateData,
      include: { entrepreneurProfile: true, investorProfile: true },
    });
    this.clearUserCache(id);
    return this.sanitizeUser(user);
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
    const canCreatePitch = user?.role === UserRole.ENTREPRENEUR && hasPremium;

    return {
      activePitches,
      pendingConnections,
      isVerified: user?.isVerified || false,
      hasPremium,
      pitchLimit: null,
      remainingPitchSlots: hasPremium ? null : 0,
      canCreatePitch,
      totalViews: 0,
    };
  }

  // Admin stats (platform overview)
  async getAdminStats() {
    return this.cache.getOrSet('admin-users:stats', 60, async () => {
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
    });
  }

  // Admin insights (last 7 days time series)
  async getAdminInsights() {
    return this.cache.getOrSet('admin-users:insights', 60, async () => {
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
    });
  }

  // 7. CHANGE PASSWORD
  async changePassword(id: string, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await this.databaseService.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
    this.clearUserCache(id);
    return this.sanitizeUser(user);
  }

  // 8. DELETE ACCOUNT (The Nuclear Option - Fixed)
  async deleteUser(id: string) {
    // 1. Delete related connections
    await this.databaseService.connection.deleteMany({
      where: { OR: [{ senderId: id }, { receiverId: id }] },
    });

    // 2. Delete related messages (New addition for safety)
    await this.databaseService.messageReport.deleteMany({
      where: { OR: [{ reporterId: id }, { reportedUserId: id }] },
    });

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
    const deleted = await this.databaseService.user.delete({ where: { id } });
    this.clearUserCache(id);
    return this.sanitizeUser(deleted);
  }

  // 9. UPGRADE TO PREMIUM
  async upgradeToPremium(userId: string) {
    const sub = await this.databaseService.subscription.findUnique({
      where: { userId },
    });

    if (sub) {
      const subscription = await this.databaseService.subscription.update({
        where: { userId },
        data: { plan: 'PREMIUM' },
      });
      this.clearUserCache(userId);
      return subscription;
    } else {
      const subscription = await this.databaseService.subscription.create({
        data: {
          userId,
          plan: 'PREMIUM',
        },
      });
      this.clearUserCache(userId);
      return subscription;
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
      const updated = await this.databaseService.subscription.update({
        where: { userId },
        data: {
          plan: 'PREMIUM',
          endDate: trialEndsAt,
          trialEndsAt,
          trialUsed: true,
        },
      });
      this.clearUserCache(userId);
      return updated;
    }

    const created = await this.databaseService.subscription.create({
      data: {
        userId,
        plan: 'PREMIUM',
        endDate: trialEndsAt,
        trialEndsAt,
        trialUsed: true,
      },
    });
    this.clearUserCache(userId);
    return created;
  }
}
