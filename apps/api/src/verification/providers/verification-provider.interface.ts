import { VerificationProvider, VerificationStatus, VerificationType } from '@prisma/client';

export interface StartVerificationSessionInput {
  userId: string;
  email?: string | null;
  verificationType: VerificationType;
  providerReference: string;
  businessName?: string | null;
  cacNumber?: string | null;
  metadata?: Record<string, unknown>;
}

export interface StartVerificationSessionResult {
  provider: VerificationProvider;
  providerReference: string;
  providerStatus: string;
  redirectUrl: string | null;
  metadata?: Record<string, unknown>;
  message: string;
}

export interface NormalizeWebhookInput {
  providerReference?: string;
  status?: string;
  riskFlags?: unknown;
  metadata?: unknown;
}

export interface NormalizedVerificationWebhook {
  providerReference: string;
  status: VerificationStatus;
  providerStatus: string;
  riskFlags: string[];
  metadata?: Record<string, unknown>;
}

export interface VerificationProviderAdapter {
  readonly provider: VerificationProvider;
  startSession(
    input: StartVerificationSessionInput,
  ): Promise<StartVerificationSessionResult>;
  normalizeWebhook(input: NormalizeWebhookInput): NormalizedVerificationWebhook;
}
