import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class PaymentsService {
  private readonly PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

  constructor(private readonly databaseService: DatabaseService) {}

  async initializeTransaction(email: string, amount: number) {
    const url = 'https://api.paystack.co/transaction/initialize';
    const response = await axios.post(
      url,
      {
        email,
        amount: amount * 100, // Paystack expects Kobo (Sub-unit)
      },
      {
        headers: {
          Authorization: `Bearer ${this.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data.data; // Includes authorization_url and reference
  }

  async verifyTransaction(reference: string) {
    const url = `https://api.paystack.co/transaction/verify/${reference}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.PAYSTACK_SECRET_KEY}`,
      },
    });

    const data = response.data.data;
    if (data.status === 'success') {
      const email = data.customer.email;
      const user = await this.databaseService.user.findUnique({
        where: { email },
      });

      if (user) {
        await this.databaseService.subscription.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            plan: 'PREMIUM',
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          },
          update: {
            plan: 'PREMIUM',
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        });
      }
    }
    return data;
  }
}
