import { BadRequestException, Injectable } from '@nestjs/common';
import { VerificationProvider } from '@prisma/client';
import {
  NormalizeWebhookInput,
  StartVerificationSessionResult,
  StartVerificationSessionInput,
  VerificationProviderAdapter,
} from './verification-provider.interface';
import { normalizeWebhookPayload } from './provider-utils';

const providerEnvKey = (provider: VerificationProvider, suffix: string) =>
  `${provider}_VERIFICATION_${suffix}`.replace(/[^A-Z0-9_]/g, '_');

const configuredValue = (provider: VerificationProvider, suffix: string) =>
  process.env[providerEnvKey(provider, suffix)] ||
  process.env[`VERIFICATION_PROVIDER_${suffix}`];

const buildHostedUrl = (
  provider: VerificationProvider,
  input: StartVerificationSessionInput,
) => {
  const rawUrl = configuredValue(provider, 'URL');
  if (!rawUrl) {
    throw new BadRequestException(
      `${provider} verification URL is not configured. Set ${providerEnvKey(
        provider,
        'URL',
      )} or use INTERNAL_SANDBOX.`,
    );
  }

  const callbackUrl = configuredValue(provider, 'CALLBACK_URL');
  const webhookUrl = configuredValue(provider, 'WEBHOOK_URL');
  const url = new URL(rawUrl);
  const params: Record<string, string | null | undefined> = {
    reference: input.providerReference,
    userId: input.userId,
    email: input.email || undefined,
    verificationType: input.verificationType,
    businessName: input.businessName || undefined,
    cacNumber: input.cacNumber || undefined,
    callbackUrl,
    webhookUrl,
  };

  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });

  return url.toString();
};

const startHostedSession = (
  provider: VerificationProvider,
  input: StartVerificationSessionInput,
): StartVerificationSessionResult => ({
  provider,
  providerReference: input.providerReference,
  providerStatus: 'hosted_session_created',
  redirectUrl: buildHostedUrl(provider, input),
  metadata: {
    ...input.metadata,
    providerMode: 'hosted_redirect',
    verificationType: input.verificationType,
    businessName: input.businessName ?? null,
    cacNumber: input.cacNumber ?? null,
  },
  message: `${provider} verification session created.`,
});

@Injectable()
export class DojahVerificationProvider implements VerificationProviderAdapter {
  readonly provider = VerificationProvider.DOJAH;

  startSession(
    input: StartVerificationSessionInput,
  ): Promise<StartVerificationSessionResult> {
    return Promise.resolve().then(() =>
      startHostedSession(this.provider, input),
    );
  }

  normalizeWebhook(input: NormalizeWebhookInput) {
    return normalizeWebhookPayload(input);
  }
}

@Injectable()
export class SmileIdVerificationProvider implements VerificationProviderAdapter {
  readonly provider = VerificationProvider.SMILE_ID;

  startSession(
    input: StartVerificationSessionInput,
  ): Promise<StartVerificationSessionResult> {
    return Promise.resolve().then(() =>
      startHostedSession(this.provider, input),
    );
  }

  normalizeWebhook(input: NormalizeWebhookInput) {
    return normalizeWebhookPayload(input);
  }
}

@Injectable()
export class VerifyMeVerificationProvider implements VerificationProviderAdapter {
  readonly provider = VerificationProvider.VERIFYME;

  startSession(
    input: StartVerificationSessionInput,
  ): Promise<StartVerificationSessionResult> {
    return Promise.resolve().then(() =>
      startHostedSession(this.provider, input),
    );
  }

  normalizeWebhook(input: NormalizeWebhookInput) {
    return normalizeWebhookPayload(input);
  }
}
