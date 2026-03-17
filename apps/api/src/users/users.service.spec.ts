import { BadRequestException } from '@nestjs/common';
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

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('throws on invalid token', async () => {
    databaseService.user.findFirst.mockResolvedValue(null);
    const service = new UsersService(databaseService, mailerService);

    await expect(service.verifyEmailToken('bad')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('throws on expired token', async () => {
    databaseService.user.findFirst.mockResolvedValue({
      id: 'user-1',
      emailVerificationExpires: new Date(Date.now() - 1000),
    });
    const service = new UsersService(databaseService, mailerService);

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
    const service = new UsersService(databaseService, mailerService);

    const result = await service.verifyEmailToken('valid');
    expect(result).toEqual({ status: 'ok', message: 'Email verified' });
    expect(databaseService.user.update).toHaveBeenCalled();
  });
});
