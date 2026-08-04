import {
  TrustLevel,
  UserRole,
  VerificationProvider,
  VerificationStatus,
  VerificationType,
} from '@prisma/client';
import { VerificationService } from './verification.service';

describe('VerificationService', () => {
  const databaseService: any = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    verificationRequest: {
      create: jest.fn(),
      count: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      upsert: jest.fn(),
    },
  };
  const notificationsService: any = {
    create: jest.fn(),
  };
  const auditService: any = {
    log: jest.fn(),
  };
  const accessPolicy: any = {
    assertCanSubmitVerification: jest.fn(),
  };

  const createService = () =>
    new VerificationService(
      databaseService,
      notificationsService,
      auditService,
      accessPolicy,
    );

  beforeEach(() => {
    jest.resetAllMocks();
    delete process.env.VERIFICATION_PROVIDER;
    delete process.env.VERIFICATION_WEBHOOK_SECRET;
    process.env.NODE_ENV = 'test';
  });

  it('requires consent before starting a provider session', async () => {
    const service = createService();

    await expect(
      service.startProviderSession({
        userId: 'user-1',
        verificationType: VerificationType.IDENTITY,
        consentAccepted: false,
      }),
    ).rejects.toThrow('Consent is required');
  });

  it('creates a provider-ready identity verification session', async () => {
    databaseService.user.findUnique.mockResolvedValue({
      id: 'user-1',
      role: UserRole.ENTREPRENEUR,
      entrepreneurProfile: { businessName: 'Acme', cacNumber: 'RC123' },
    });
    databaseService.verificationRequest.upsert.mockResolvedValue({
      id: 'verification-1',
      userId: 'user-1',
      verificationType: VerificationType.IDENTITY,
    });
    const service = createService();

    const result = await service.startProviderSession({
      userId: 'user-1',
      verificationType: VerificationType.IDENTITY,
      consentAccepted: true,
    });

    expect(databaseService.verificationRequest.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          userId_verificationType: {
            userId: 'user-1',
            verificationType: VerificationType.IDENTITY,
          },
        },
        create: expect.objectContaining({
          provider: VerificationProvider.INTERNAL_SANDBOX,
          status: VerificationStatus.PENDING,
          trustLevel: TrustLevel.IDENTITY_PENDING,
        }),
      }),
    );
    expect(result.provider).toBe(VerificationProvider.INTERNAL_SANDBOX);
    expect(result.providerReference).toContain('user-1_identity');
  });

  it('updates requests from provider webhooks and refreshes user verification', async () => {
    process.env.VERIFICATION_WEBHOOK_SECRET = 'secret';
    databaseService.verificationRequest.findFirst.mockResolvedValue({
      id: 'verification-1',
      userId: 'user-1',
      verificationType: VerificationType.IDENTITY,
      metadata: {},
    });
    databaseService.verificationRequest.update.mockResolvedValue({
      id: 'verification-1',
      userId: 'user-1',
      verificationType: VerificationType.IDENTITY,
      status: VerificationStatus.APPROVED,
    });
    databaseService.user.findUnique.mockResolvedValue({
      id: 'user-1',
      role: UserRole.INVESTOR,
    });
    databaseService.verificationRequest.findMany.mockResolvedValue([
      {
        verificationType: VerificationType.IDENTITY,
        status: VerificationStatus.APPROVED,
      },
    ]);
    const service = createService();

    const result = await service.handleProviderWebhook({
      providerReference: 'provider-ref',
      status: 'verified',
      signature: 'secret',
    });

    expect(result.status).toBe(VerificationStatus.APPROVED);
    expect(databaseService.verificationRequest.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: VerificationStatus.APPROVED,
          trustLevel: TrustLevel.IDENTITY_VERIFIED,
          verifiedAt: expect.any(Date),
        }),
      }),
    );
    expect(databaseService.user.update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: { isVerified: true },
    });
  });
});
