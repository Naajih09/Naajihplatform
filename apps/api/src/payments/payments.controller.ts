import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('initialize')
  async initialize(@Body() data: { provider: 'paystack' | 'opay'; email: string; amount: number }) {
    return this.paymentsService.initializeTransaction(data.provider, data.email, data.amount);
  }

  @Get('verify')
  async verify(@Query('provider') provider: 'paystack' | 'opay', @Query('reference') reference: string) {
    return this.paymentsService.verifyTransaction(provider, reference);
  }
}
