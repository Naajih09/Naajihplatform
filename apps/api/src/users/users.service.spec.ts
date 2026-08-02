import { BadRequestException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { UsersService } from './users.service';

describe('UsersService (email verification)', () => {
  const databaseService: any = {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
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
    databaseService.user.findFirst.mockResolvedValue({
      id: 'user-1',
      emailVerificationExpires: new Date(Date.now() + 1000 * 60),
    });
    databaseService.user.update.mockResolvedValue({
      id: 'user-1',
      emailVerified: true,
    });
    const service = createService();

    const result = await service.verifyEmailToken('valid');
    expect(result).toEqual({ status: 'ok', message: 'Email verified' });
    expect(databaseService.user.update).toHaveBeenCalled();
    expect(cacheService.deleteByPrefix).toHaveBeenCalledWith('user:user-1:');
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
