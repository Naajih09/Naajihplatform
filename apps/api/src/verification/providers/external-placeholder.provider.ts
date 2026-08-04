import { BadRequestException, Injectable } from '@nestjs/common';
import { VerificationProvider } from '@prisma/client';
import {
  NormalizeWebhookInput,
  StartVerificationSessionResult,
  StartVerificationSessionInput,
  VerificationProviderAdapter,
} from './verification-provider.interface';
import { normalizeWebhookPayload } from './provider-utils';

const unsupportedMessage = (provider: VerificationProvider) =>
  `${provider} adapter is not configured yet. Use INTERNAL_SANDBOX or add provider credentials and API integration.`;

@Injectable()
export class DojahVerificationProvider implements VerificationProviderAdapter {
  readonly provider = VerificationProvider.DOJAH;

  async startSession(
    _input: StartVerificationSessionInput,
  ): Promise<StartVerificationSessionResult> {
    throw new BadRequestException(unsupportedMessage(this.provider));
  }

  normalizeWebhook(input: NormalizeWebhookInput) {
    return normalizeWebhookPayload(input);
  }
}

@Injectable()
export class SmileIdVerificationProvider implements VerificationProviderAdapter {
  readonly provider = VerificationProvider.SMILE_ID;

  async startSession(
    _input: StartVerificationSessionInput,
  ): Promise<StartVerificationSessionResult> {
    throw new BadRequestException(unsupportedMessage(this.provider));
  }

  normalizeWebhook(input: NormalizeWebhookInput) {
    return normalizeWebhookPayload(input);
  }
}

@Injectable()
export class VerifyMeVerificationProvider implements VerificationProviderAdapter {
  readonly provider = VerificationProvider.VERIFYME;

  async startSession(
    _input: StartVerificationSessionInput,
  ): Promise<StartVerificationSessionResult> {
    throw new BadRequestException(unsupportedMessage(this.provider));
  }

  normalizeWebhook(input: NormalizeWebhookInput) {
    return normalizeWebhookPayload(input);
  }
}
