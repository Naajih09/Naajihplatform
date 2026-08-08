import axios from 'axios';
import {
  BillingInterval,
  PaymentProvider,
  PaymentStatus,
  UserRole,
} from '@prisma/client';
import { PaymentsService } from './payments.service';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('PaymentsService', () => {
  const databaseService: any = {
    paymentTransaction: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    subscription: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
    },
    user: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
    },
  };
  const notificationsService: any = {
    create: jest.fn(),
  };
  const cache: any = {
    deleteByPrefix: jest.fn(),
  };

  const createService = () =>
    new PaymentsService(databaseService, notificationsService, cache);

  beforeEach(() => {
    jest.resetAllMocks();
    process.env.FRONTEND_URL = 'https://app.example.com';
    process.env.BACKEND_URL = 'https://api.example.com';
    process.env.PAYSTACK_SECRET_KEY = 'paystack-secret';
    process.env.OPAY_SECRET_KEY = 'opay-secret';
    process.env.OPAY_MERCHANT_ID = 'merchant';
    process.env.OPAY_PUB_KEY = 'public';
    process.env.SUBSCRIPTION_AMOUNT_NGN = '15000';
    process.env.ASPIRING_OWNER_SUBSCRIPTION_AMOUNT_NGN = '5000';
    process.env.SUBSCRIPTION_DURATION_DAYS = '30';
    process.env.YEARLY_SUBSCRIPTION_DURATION_DAYS = '365';
    process.env.YEARLY_SUBSCRIPTION_BILLING_MONTHS = '10';
  });

  it('stores yearly billing metadata and validates yearly amount', async () => {
    mockedAxios.post.mockResolvedValue({
      data: {
        data: {
          authorization_url: 'https://paystack.example/checkout',
          reference: 'provider-ref',
        },
      },
    });
    const service = createService();

    await service.initializeTransaction(
      'paystack',
      'founder@example.com',
      150000,
      'user-1',
      UserRole.ENTREPRENEUR,
      'pitch-payment',
      '127.0.0.1',
      'NETWORKING_PREMIUM',
      'YEARLY',
    );

    expect(databaseService.paymentTransaction.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          amount: 15000000,
          metadata: expect.objectContaining({
            product: 'NETWORKING_PREMIUM',
            reason: 'pitch-payment',
            billingInterval: BillingInterval.YEARLY,
          }),
        }),
      }),
    );
  });

  it('extends successful yearly payments from the current active expiry', async () => {
    const activeEnd = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);
    databaseService.paymentTransaction.findUnique.mockResolvedValue({
      reference: 'ref-1',
      provider: PaymentProvider.PAYSTACK,
      status: PaymentStatus.INITIALIZED,
      amount: 15000000,
      email: 'founder@example.com',
      userId: 'user-1',
      metadata: {
        billingInterval: BillingInterval.YEARLY,
        product: 'NETWORKING_PREMIUM',
      },
    });
    databaseService.paymentTransaction.update.mockResolvedValue({});
    databaseService.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'founder@example.com',
    });
    databaseService.subscription.findUnique.mockResolvedValue({
      userId: 'user-1',
      plan: 'PREMIUM',
      billingInterval: BillingInterval.MONTHLY,
      endDate: activeEnd,
      trialEndsAt: null,
    });
    databaseService.subscription.upsert.mockResolvedValue({});
    mockedAxios.get.mockResolvedValue({
      data: {
        data: {
          status: 'success',
          customer: { email: 'founder@example.com' },
        },
      },
    });
    const service = createService();

    await service.verifyTransaction('paystack', 'ref-1');

    const upsert = databaseService.subscription.upsert.mock.calls[0][0];
    const expectedMinimumEnd = new Date(
      activeEnd.getTime() + 364 * 24 * 60 * 60 * 1000,
    );

    expect(upsert.update.billingInterval).toBe(BillingInterval.YEARLY);
    expect(upsert.update.plan).toBe('PREMIUM');
    expect(upsert.update.trialEndsAt).toBeNull();
    expect(upsert.update.endDate.getTime()).toBeGreaterThanOrEqual(
      expectedMinimumEnd.getTime(),
    );
    expect(cache.deleteByPrefix).toHaveBeenCalledWith('user:user-1:');
  });
});
