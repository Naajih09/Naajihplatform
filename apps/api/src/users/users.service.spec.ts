import { BadRequestException } from '@nestjs/common';
import { PitchStatus, UserRole } from '@prisma/client';
import * as crypto from 'crypto';
import { UsersService } from './users.service';

describe('UsersService (email verification)', () => {
  const databaseService: any = {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
    },
    connection: {
      count: jest.fn(),
    },
    pitch: {
      count: jest.fn(),
    },
  };

  const mailerService: any = {
    sendMail: jest.fn(),
  };

  const cacheService: any = {
    deleteByPrefix: jest.fn(),
    getOrSet: jest.fn((_key: string, _ttl: number, factory: () => unknown) =>
      factory(),
    ),
  };

  const accessPolicyService: any = {
    entitlementsFor: jest.fn(),
    getUserEntitlements: jest.fn(),
  };

  const createService = () =>
    new UsersService(
      databaseService,
      mailerService,
      cacheService,
      accessPolicyService,
    );

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns public metrics from active accounts and approved pitches', async () => {
    cacheService.getOrSet.mockImplementation(
      (_key: string, _ttl: number, factory: () => unknown) =>
        Promise.resolve(factory()),
    );
    databaseService.user.count
      .mockResolvedValueOnce(12)
      .mockResolvedValueOnce(7)
      .mockResolvedValueOnce(5);
    databaseService.pitch.count.mockResolvedValueOnce(4);

    const service = createService();

    await expect(service.getPublicLandingMetrics()).resolves.toEqual({
      founderAccounts: 12,
      investorAccounts: 7,
      approvedOpportunities: 4,
      verifiedUsers: 5,
    });
    expect(cacheService.getOrSet).toHaveBeenCalledWith(
      'public:landing-metrics',
      30,
      expect.any(Function),
    );
    expect(databaseService.user.count).toHaveBeenNthCalledWith(1, {
      where: {
        role: UserRole.ENTREPRENEUR,
        isActive: true,
        isWaitlistUser: false,
      },
    });
    expect(databaseService.user.count).toHaveBeenNthCalledWith(2, {
      where: {
        role: UserRole.INVESTOR,
        isActive: true,
        isWaitlistUser: false,
      },
    });
    expect(databaseService.pitch.count).toHaveBeenCalledWith({
      where: { status: PitchStatus.APPROVED },
    });
    expect(databaseService.user.count).toHaveBeenNthCalledWith(3, {
      where: {
        role: { in: [UserRole.ENTREPRENEUR, UserRole.INVESTOR] },
        isActive: true,
        isWaitlistUser: false,
        isVerified: true,
      },
    });
  });

  it('sends launch invitations and marks only delivered accounts as notified', async () => {
    const waitlistUser = {
      id: 'user-1',
      email: 'founder@example.com',
      entrepreneurProfile: { firstName: '<Amina>' },
      investorProfile: null,
    };
    databaseService.user.findMany.mockResolvedValue([waitlistUser]);
    databaseService.user.update.mockResolvedValue({});
    mailerService.sendMail.mockResolvedValue(true);

    const service = createService();
    const result = await service.inviteWaitlistUsers(
      ['user-1'],
      'We are open!\nCome join.',
    );

    expect(result).toEqual({
      sent: 1,
      failed: 0,
      sentIds: ['user-1'],
      failedIds: [],
    });
    expect(mailerService.sendMail).toHaveBeenCalledWith(
      'founder@example.com',
      'NaajihBiz is open: sign in to your account',
      expect.stringContaining('Hi &lt;Amina&gt;'),
    );
    expect(mailerService.sendMail.mock.calls[0][2]).toContain('/login');
    expect(databaseService.user.update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: { waitlistNotifiedAt: expect.any(Date) },
    });
  });

  it('does not mark launch invitations notified when email delivery fails', async () => {
    databaseService.user.findMany.mockResolvedValue([
      {
        id: 'user-2',
        email: 'investor@example.com',
        entrepreneurProfile: null,
        investorProfile: { firstName: 'Sam' },
      },
    ]);
    mailerService.sendMail.mockResolvedValue(false);

    const service = createService();
    const result = await service.inviteWaitlistUsers(['user-2']);

    expect(result).toEqual({
      sent: 0,
      failed: 1,
      sentIds: [],
      failedIds: ['user-2'],
    });
    expect(databaseService.user.update).not.toHaveBeenCalled();
  });

  it('throws on invalid token', async () => {
    databaseService.user.findFirst.mockResolvedValue(null);
    const service = createService();

    await expect(service.verifyEmailToken('bad')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('throws on expired token', async () => {
    databaseService.user.findFirst.mockResolvedValue({
      id: 'user-1',
      emailVerificationExpires: new Date(Date.now() - 1000),
    });
    const service = createService();

    await expect(service.verifyEmailToken('expired')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('verifies a valid token', async () => {
    const token = 'valid';
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    databaseService.user.findFirst.mockResolvedValue({
      id: 'user-1',
      emailVerificationExpires: new Date(Date.now() + 1000 * 60),
    });
    databaseService.user.update.mockResolvedValue({
      id: 'user-1',
      emailVerified: true,
    });
    const service = createService();

    const result = await service.verifyEmailToken(token);
    expect(result).toEqual({ status: 'ok', message: 'Email verified' });
    expect(databaseService.user.findFirst).toHaveBeenCalledWith({
      where: {
        OR: [
          { emailVerificationToken: tokenHash },
          { emailVerificationToken: token },
        ],
      },
    });
    expect(databaseService.user.update).toHaveBeenCalled();
    expect(cacheService.deleteByPrefix).toHaveBeenCalledWith('user:user-1:');
  });

  it('resends email verification publicly without storing a raw token', async () => {
    databaseService.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'user@example.com',
      emailVerified: false,
      isActive: true,
    });
    databaseService.user.update.mockResolvedValue({});
    mailerService.sendMail.mockResolvedValue(true);
    const service = createService();

    const result =
      await service.requestEmailVerificationByEmail(' USER@example.com ');
    const updateCall = databaseService.user.update.mock.calls[0][0];
    const emailHtml = mailerService.sendMail.mock.calls[0][2];
    const verifyUrl = emailHtml.match(
      /http[^"]*verify-email\?token=([a-f0-9]+)/i,
    );
    const rawToken = verifyUrl?.[1] || '';

    expect(databaseService.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'user@example.com' },
      select: {
        id: true,
        email: true,
        emailVerified: true,
        isActive: true,
      },
    });
    expect(rawToken).toHaveLength(64);
    expect(updateCall.data.emailVerificationToken).toHaveLength(64);
    expect(updateCall.data.emailVerificationToken).toBe(
      crypto.createHash('sha256').update(rawToken).digest('hex'),
    );
    expect(updateCall.data.emailVerificationToken).not.toBe(rawToken);
    expect(result).toMatchObject({ status: 'ok', emailed: true });
  });

  it('sends a password reset link for an active account', async () => {
    databaseService.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'user@example.com',
      isActive: true,
    });
    databaseService.user.update.mockResolvedValue({});
    mailerService.sendMail.mockResolvedValue(true);
    const service = createService();

    const result = await service.requestPasswordReset(' USER@example.com ');

    expect(databaseService.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'user@example.com' },
      select: { id: true, email: true, isActive: true },
    });
    expect(databaseService.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'user-1' },
        data: expect.objectContaining({
          passwordResetToken: expect.any(String),
          passwordResetExpires: expect.any(Date),
        }),
      }),
    );
    expect(mailerService.sendMail).toHaveBeenCalledWith(
      'user@example.com',
      'Reset your NaajihBiz password',
      expect.stringContaining('/reset-password?token='),
    );
    expect(result).toMatchObject({ status: 'ok', emailed: true });
    expect(result).toHaveProperty('resetUrl');
  });

  it('does not reveal whether a reset email exists', async () => {
    databaseService.user.findUnique.mockResolvedValue(null);
    const service = createService();

    const result = await service.requestPasswordReset('missing@example.com');

    expect(result).toEqual({
      status: 'ok',
      message:
        'If an account exists for that email, a password reset link has been sent.',
    });
    expect(mailerService.sendMail).not.toHaveBeenCalled();
  });

  it('normalizes email when finding a user for login', async () => {
    databaseService.user.findUnique.mockResolvedValue({
      id: 'admin-1',
      email: 'admin2@example.com',
      role: UserRole.ADMIN,
      adminPermissions: ['dashboard'],
    });
    const service = createService();

    await service.findOne(' Admin2@Example.com ');

    expect(databaseService.user.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { email: 'admin2@example.com' },
      }),
    );
  });

  it('resets an admin password and reactivates the account', async () => {
    databaseService.user.findUnique.mockResolvedValue({
      id: 'admin-2',
      role: UserRole.ADMIN,
    });
    databaseService.user.update.mockResolvedValue({
      id: 'admin-2',
      email: 'admin2@example.com',
      role: UserRole.ADMIN,
    });
    const service = createService();

    await service.updateAdminPassword('admin-2', 'new-password');

    expect(databaseService.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'admin-2' },
        data: expect.objectContaining({
          password: expect.any(String),
          isActive: true,
          isVerified: true,
          emailVerified: true,
        }),
      }),
    );
    expect(cacheService.deleteByPrefix).toHaveBeenCalledWith('user:admin-2:');
  });

  it('resets password with a valid token and clears the token', async () => {
    databaseService.user.findFirst.mockResolvedValue({ id: 'user-1' });
    databaseService.user.update.mockResolvedValue({});
    const service = createService();

    const result = await service.resetPassword('valid-token', 'new-password');

    expect(result).toEqual({
      status: 'ok',
      message: 'Password reset successfully',
    });
    expect(databaseService.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'user-1' },
        data: expect.objectContaining({
          password: expect.any(String),
          passwordResetToken: null,
          passwordResetExpires: null,
        }),
      }),
    );
    expect(cacheService.deleteByPrefix).toHaveBeenCalledWith('user:user-1:');
  });

  it('backfills permissions for legacy admin accounts', async () => {
    databaseService.user.findUnique.mockResolvedValue({
      id: 'admin-1',
      email: 'admin@example.com',
      role: UserRole.ADMIN,
      adminPermissions: [],
    });
    databaseService.user.update.mockResolvedValue({});
    const service = createService();

    const result = await service.findById('admin-1');

    expect(databaseService.user.update).toHaveBeenCalledWith({
      where: { id: 'admin-1' },
      data: {
        adminPermissions: [
          'dashboard',
          'users',
          'pitches',
          'verification',
          'academy',
          'messages',
          'audit',
          'settings',
        ],
      },
    });
    expect(result?.adminPermissions).toContain('dashboard');
    expect(result?.adminPermissions).toContain('settings');
    expect(cacheService.deleteByPrefix).toHaveBeenCalledWith('user:admin-1:');
  });
});
