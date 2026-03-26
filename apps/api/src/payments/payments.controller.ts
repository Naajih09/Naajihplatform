import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Headers,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('initialize')
  async initialize(
    @Body()
    data: {
      provider: 'paystack' | 'opay';
      amount: number;
    },
    @Req() req: any,
  ) {
    return this.paymentsService.initializeTransaction(
      data.provider,
      req.user.email,
      data.amount,
      req.user.id,
    );
  }

  @Get('verify')
  async verify(
    @Query('provider') provider: 'paystack' | 'opay',
    @Query('reference') reference: string,
  ) {
    return this.paymentsService.verifyTransaction(provider, reference);
  }

  @Post('webhook/paystack')
  async paystackWebhook(
    @Headers('x-paystack-signature') signature: string | undefined,
    @Req() req: any,
    @Body() payload: any,
  ) {
    return this.paymentsService.handlePaystackWebhook(
      signature,
      payload,
      req?.rawBody,
    );
  }

  @Post('webhook/opay')
  async opayWebhook(
    @Headers('x-opay-signature') signature: string | undefined,
    @Req() req: any,
    @Body() payload: any,
  ) {
    return this.paymentsService.handleOPayWebhook(
      signature,
      payload,
      req?.rawBody,
    );
  }
}
