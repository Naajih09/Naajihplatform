import { Injectable } from '@nestjs/common';
import { VerificationProvider } from '@prisma/client';
import {
  NormalizeWebhookInput,
  StartVerificationSessionInput,
  VerificationProviderAdapter,
} from './verification-provider.interface';
import { normalizeWebhookPayload } from './provider-utils';

@Injectable()
export class InternalSandboxVerificationProvider
  implements VerificationProviderAdapter
{
  readonly provider = VerificationProvider.INTERNAL_SANDBOX;

  async startSession(input: StartVerificationSessionInput) {
    return {
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
        'Verification session created. Connect a provider adapter to launch hosted KYC/KYB.',
    };
  }

  normalizeWebhook(input: NormalizeWebhookInput) {
    return normalizeWebhookPayload(input);
  }
}
