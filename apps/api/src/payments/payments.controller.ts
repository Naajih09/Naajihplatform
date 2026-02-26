import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('initialize')
  async initialize(@Body() data: { email: string; amount: number }) {
    return this.paymentsService.initializeTransaction(data.email, data.amount);
  }

  @Get('verify')
  async verify(@Query('reference') reference: string) {
    return this.paymentsService.verifyTransaction(reference);
  }
}
