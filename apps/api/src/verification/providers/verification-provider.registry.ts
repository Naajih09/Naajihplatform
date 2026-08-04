import { BadRequestException, Injectable } from '@nestjs/common';
import { VerificationProvider } from '@prisma/client';
import {
  DojahVerificationProvider,
  SmileIdVerificationProvider,
  VerifyMeVerificationProvider,
} from './external-placeholder.provider';
import { InternalSandboxVerificationProvider } from './internal-sandbox.provider';
import { VerificationProviderAdapter } from './verification-provider.interface';

@Injectable()
export class VerificationProviderRegistry {
  private readonly adapters: VerificationProviderAdapter[];

  constructor(
    internalSandbox: InternalSandboxVerificationProvider,
    dojah: DojahVerificationProvider,
    smileId: SmileIdVerificationProvider,
    verifyMe: VerifyMeVerificationProvider,
  ) {
    this.adapters = [internalSandbox, dojah, smileId, verifyMe];
  }

  get(provider: VerificationProvider) {
    const adapter = this.adapters.find((item) => item.provider === provider);
    if (!adapter) {
      throw new BadRequestException(`No adapter registered for ${provider}.`);
    }
    return adapter;
  }
}
