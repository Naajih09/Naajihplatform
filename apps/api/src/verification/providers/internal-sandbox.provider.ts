import { Injectable } from '@nestjs/common';
import { VerificationProvider } from '@prisma/client';
import {
  NormalizeWebhookInput,
  StartVerificationSessionInput,
  VerificationProviderAdapter,
} from './verification-provider.interface';
import { normalizeWebhookPayload } from './provider-utils';

@Injectable()
export class InternalSandboxVerificationProvider implements VerificationProviderAdapter {
  readonly provider = VerificationProvider.INTERNAL_SANDBOX;

  startSession(input: StartVerificationSessionInput) {
    return Promise.resolve({
      provider: this.provider,
      providerReference: input.providerReference,
      providerStatus: 'session_created',
      redirectUrl: null,
      metadata: {
        ...input.metadata,
        providerMode: 'placeholder',
        verificationType: input.verificationType,
        businessName: input.businessName ?? null,
        cacNumber: input.cacNumber ?? null,
      },
      message:
        'Sandbox verification session created. Configure a third-party provider URL to launch hosted KYC/KYB.',
    });
  }

  normalizeWebhook(input: NormalizeWebhookInput) {
    return normalizeWebhookPayload(input);
  }
}
