import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { DatabaseService } from '../database/database.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class PaymentsService {
  private readonly PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
  private readonly OPAY_SECRET_KEY = process.env.OPAY_SECRET_KEY;
  private readonly OPAY_MERCHANT_ID = process.env.OPAY_MERCHANT_ID;
  private readonly OPAY_PUB_KEY = process.env.OPAY_PUB_KEY;

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async initializeTransaction(provider: 'paystack' | 'opay', email: string, amount: number) {
    if (provider === 'paystack') {
      return this.initializePaystack(email, amount);
    } else {
      return this.initializeOPay(email, amount);
    }
  }

  private async initializePaystack(email: string, amount: number) {
    const url = 'https://api.paystack.co/transaction/initialize';
    const response = await axios.post(
      url,
      {
        email,
        amount: amount * 100, // Paystack expects Kobo
      },
      {
        headers: {
          Authorization: `Bearer ${this.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data.data; // { authorization_url, reference }
  }

  private async initializeOPay(email: string, amount: number) {
    const reference = `OPAY_${Date.now()}`;
    const url = 'https://api.opaycheckout.com/api/v1/international/cashier/create';
    
    const response = await axios.post(
      url,
      {
        amount: {
          total: amount * 100,
          currency: 'NGN',
        },
        reference,
        returnUrl: `${process.env.FRONTEND_URL}/dashboard/subscription?provider=opay`,
        callbackUrl: `${process.env.BACKEND_URL}/api/payments/webhook/opay`,
        merchantId: this.OPAY_MERCHANT_ID,
        productName: 'Najih Premium Subscription',
        productDescription: 'Subscription for Premium access on Naajihplatform',
        userClientIp: '127.0.0.1', // Should be dynamic in production
      },
      {
        headers: {
          Authorization: `Bearer ${this.OPAY_PUB_KEY}`,
          'Content-Type': 'application/json',
          'Merchant-Id': this.OPAY_MERCHANT_ID,
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
    let status = 'failed';
    let customerEmail = '';

    if (provider === 'paystack') {
      const url = `https://api.paystack.co/transaction/verify/${reference}`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${this.PAYSTACK_SECRET_KEY}` },
      });
      const data = response.data.data;
      if (data.status === 'success') {
        status = 'success';
        customerEmail = data.customer.email;
      }
    } else {
      const url = 'https://api.opaycheckout.com/api/v1/international/cashier/query';
      const response = await axios.post(
        url,
        {
          merchantId: this.OPAY_MERCHANT_ID,
          reference,
        },
        {
          headers: {
            Authorization: `Bearer ${this.OPAY_PUB_KEY}`,
            'Merchant-Id': this.OPAY_MERCHANT_ID,
          },
        },
      );
      const data = response.data.data;
      if (response.data.code === '00000' && data.status === 'SUCCESSFUL') {
        status = 'success';
        // OPay might not return email in query, we might need to store reference/email mapping or use the reference to find the user
      }
    }

    if (status === 'success') {
      // Find user by email or some other logic if email isn't available
      const user = await this.databaseService.user.findFirst({
         where: customerEmail ? { email: customerEmail } : {}, // Placeholder logic
      });

      if (user) {
        await this.databaseService.subscription.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            plan: 'PREMIUM',
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
          update: {
            plan: 'PREMIUM',
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        });

        // Notify user
        await this.notificationsService.create(user.id, `Subscription upgraded to PREMIUM! Enjoy your new perks.`);
      }
    }
    return { status };
  }
}
