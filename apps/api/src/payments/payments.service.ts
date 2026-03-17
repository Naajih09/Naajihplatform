import { BadRequestException, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import axios from 'axios';
import { DatabaseService } from '../database/database.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PaymentProvider, PaymentStatus } from '@prisma/client';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class PaymentsService {
  private getEnv(name: string) {
    const value = process.env[name];
    if (!value) {
      throw new BadRequestException(`${name} is not configured`);
    }
    return value;
  }

  private get paystackSecretKey() {
    return this.getEnv('PAYSTACK_SECRET_KEY');
  }

  private get opaySecretKey() {
    return this.getEnv('OPAY_SECRET_KEY');
  }

  private get opayMerchantId() {
    return this.getEnv('OPAY_MERCHANT_ID');
  }

  private get opayPublicKey() {
    return this.getEnv('OPAY_PUB_KEY');
  }

  private get opayWebhookSecret() {
    return this.getEnv('OPAY_WEBHOOK_SECRET');
  }

  private get frontendUrl() {
    return this.getEnv('FRONTEND_URL');
  }

  private get backendUrl() {
    return this.getEnv('BACKEND_URL');
  }

  private get subscriptionAmountNgn() {
    const amount = Number(process.env.SUBSCRIPTION_AMOUNT_NGN || 0);
    return Number.isFinite(amount) && amount > 0 ? amount : null;
  }

  private get subscriptionDurationDays() {
    const days = Number(process.env.SUBSCRIPTION_DURATION_DAYS || 30);
    return Number.isFinite(days) && days > 0 ? days : 30;
  }

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async initializeTransaction(
    provider: 'paystack' | 'opay',
    email: string,
    amount: number,
    userId?: string,
  ) {
    if (!email || !userId) {
      throw new BadRequestException('Authenticated user is required');
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new BadRequestException('Invalid amount');
    }

    if (this.subscriptionAmountNgn && amount !== this.subscriptionAmountNgn) {
      throw new BadRequestException('Invalid subscription amount');
    }

    const reference =
      provider === 'paystack'
        ? `PSTACK_${Date.now()}_${Math.floor(Math.random() * 1000)}`
        : `OPAY_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const amountKobo = Math.round(amount * 100);
    await this.databaseService.paymentTransaction.create({
      data: {
        reference,
        provider: provider === 'paystack' ? PaymentProvider.PAYSTACK : PaymentProvider.OPAY,
        amount: amountKobo,
        email,
        userId,
        status: PaymentStatus.INITIALIZED,
      },
    });

    if (provider === 'paystack') {
      return this.initializePaystack(email, amountKobo, reference);
    }
    return this.initializeOPay(email, amountKobo, reference);
  }

  private async initializePaystack(email: string, amountKobo: number, reference: string) {
    const url = 'https://api.paystack.co/transaction/initialize';
    const response = await axios.post(
      url,
      {
        email,
        amount: amountKobo,
        reference,
      },
      {
        headers: {
          Authorization: `Bearer ${this.paystackSecretKey}`,
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data.data; // { authorization_url, reference }
  }

  private async initializeOPay(email: string, amountKobo: number, reference: string) {
    const url =
      'https://api.opaycheckout.com/api/v1/international/cashier/create';

    const response = await axios.post(
      url,
      {
        amount: {
          total: amountKobo,
          currency: 'NGN',
        },
        reference,
        returnUrl: `${this.frontendUrl}/dashboard/subscription?provider=opay`,
        callbackUrl: `${this.backendUrl}/api/payments/webhook/opay`,
        merchantId: this.opayMerchantId,
        productName: 'Najih Premium Subscription',
        productDescription: 'Subscription for Premium access on Naajihplatform',
        userClientIp: '127.0.0.1', // Should be dynamic in production
      },
      {
        headers: {
          Authorization: `Bearer ${this.opayPublicKey}`,
          'Content-Type': 'application/json',
          'Merchant-Id': this.opayMerchantId,
        },
      },
    );

    if (response.data.code !== '00000') {
      throw new Error(response.data.message || 'OPay initialization failed');
    }

    return {
      authorization_url: response.data.data.cashierUrl,
      reference,
    };
  }

  async verifyTransaction(provider: 'paystack' | 'opay', reference: string) {
    const transaction = await this.databaseService.paymentTransaction.findUnique({
      where: { reference },
    });
    if (!transaction) {
      throw new BadRequestException('Unknown reference');
    }
    if (
      (provider === 'paystack' && transaction.provider !== PaymentProvider.PAYSTACK) ||
      (provider === 'opay' && transaction.provider !== PaymentProvider.OPAY)
    ) {
      throw new BadRequestException('Provider mismatch');
    }

    let status = 'failed';
    let customerEmail = '';

    if (provider === 'paystack') {
      const url = `https://api.paystack.co/transaction/verify/${reference}`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${this.paystackSecretKey}` },
      });
      const data = response.data.data;
      if (data.status === 'success') {
        status = 'success';
        customerEmail = data.customer.email;
      }
    } else {
      const url =
        'https://api.opaycheckout.com/api/v1/international/cashier/query';
      const response = await axios.post(
        url,
        {
          merchantId: this.opayMerchantId,
          reference,
        },
        {
          headers: {
            Authorization: `Bearer ${this.opayPublicKey}`,
            'Merchant-Id': this.opayMerchantId,
          },
        },
      );
      const data = response.data.data;
      if (response.data.code === '00000' && data.status === 'SUCCESSFUL') {
        status = 'success';
        // OPay might not return email in query, we might need to store reference/email mapping or use the reference to find the user
      }
    }

    await this.databaseService.paymentTransaction.update({
      where: { reference },
      data: {
        status: status === 'success' ? PaymentStatus.SUCCESS : PaymentStatus.FAILED,
        email: customerEmail || transaction.email,
      },
    });

    if (status === 'success') {
      const user = transaction?.userId
        ? await this.databaseService.user.findUnique({
            where: { id: transaction.userId },
          })
        : await this.databaseService.user.findFirst({
            where: customerEmail ? { email: customerEmail } : {},
          });

      if (user) {
        const endDate = new Date(
          Date.now() + this.subscriptionDurationDays * 24 * 60 * 60 * 1000,
        );
        await this.databaseService.subscription.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            plan: 'PREMIUM',
            endDate,
            trialUsed: true,
            trialEndsAt: null,
          },
          update: {
            plan: 'PREMIUM',
            endDate,
            trialUsed: true,
            trialEndsAt: null,
          },
        });

        // Notify user
        await this.notificationsService.create(
          user.id,
          `Subscription upgraded to PREMIUM! Enjoy your new perks.`,
        );
      }
    }
    return { status };
  }

  @Cron('0 3 * * *')
  async expireSubscriptions() {
    const now = new Date();
    await this.databaseService.subscription.updateMany({
      where: {
        plan: 'PREMIUM',
        endDate: { lt: now },
      },
      data: {
        plan: 'FREE',
        endDate: null,
        trialEndsAt: null,
      },
    });
  }

  async handlePaystackWebhook(
    signature: string | undefined,
    payload: any,
    rawBody?: Buffer,
  ) {
    const paystackSecret = process.env.PAYSTACK_WEBHOOK_SECRET;
    if (!paystackSecret) {
      throw new BadRequestException('PAYSTACK_WEBHOOK_SECRET is not configured');
    }

    const expected = crypto
      .createHmac('sha512', paystackSecret)
      .update(rawBody ?? Buffer.from(JSON.stringify(payload)))
      .digest('hex');

    if (!signature || signature !== expected) {
      throw new BadRequestException('Invalid Paystack signature');
    }

    const reference = payload?.data?.reference;
    if (!reference) {
      throw new BadRequestException('Missing Paystack reference');
    }

    if (payload?.event && payload.event !== 'charge.success') {
      return { status: 'ignored', reason: 'event_not_success' };
    }

    const amount = payload?.data?.amount;
    const transaction = await this.databaseService.paymentTransaction.findUnique({
      where: { reference },
    });
    if (!transaction) {
      throw new BadRequestException('Unknown reference');
    }
    if (Number.isFinite(amount) && Number(amount) !== transaction.amount) {
      throw new BadRequestException('Amount mismatch');
    }
    if (transaction.status === PaymentStatus.SUCCESS) {
      return { status: 'ok' };
    }
    return this.verifyTransaction('paystack', reference);
  }

  async handleOPayWebhook(
    signature: string | undefined,
    payload: any,
    rawBody?: Buffer,
  ) {
    const expected = crypto
      .createHmac('sha256', this.opayWebhookSecret)
      .update(rawBody ?? Buffer.from(JSON.stringify(payload)))
      .digest('hex');

    if (!signature || signature !== expected) {
      throw new BadRequestException('Invalid OPay signature');
    }

    const reference = payload?.data?.reference || payload?.orderNo;
    if (!reference) {
      throw new BadRequestException('Missing OPay reference');
    }
    const status = payload?.data?.status || payload?.status;
    if (status && status !== 'SUCCESSFUL') {
      return { status: 'ignored', reason: 'status_not_success' };
    }

    const amount = payload?.data?.amount?.total || payload?.amount?.total;
    const transaction = await this.databaseService.paymentTransaction.findUnique({
      where: { reference },
    });
    if (!transaction) {
      throw new BadRequestException('Unknown reference');
    }
    if (Number.isFinite(amount) && Number(amount) !== transaction.amount) {
      throw new BadRequestException('Amount mismatch');
    }
    if (transaction.status === PaymentStatus.SUCCESS) {
      return { status: 'ok' };
    }
    return this.verifyTransaction('opay', reference);
  }
}
