import { BadRequestException } from '@nestjs/common';
import { VerificationStatus } from '@prisma/client';
import {
  NormalizedVerificationWebhook,
  NormalizeWebhookInput,
} from './verification-provider.interface';

export const mapProviderStatus = (status?: string) => {
  const statusText = String(status || '').toLowerCase();

  if (['approved', 'verified', 'passed', 'success'].includes(statusText)) {
    return VerificationStatus.APPROVED;
  }
  if (['flagged', 'review', 'manual_review'].includes(statusText)) {
    return VerificationStatus.FLAGGED;
  }
  if (['rejected', 'failed', 'declined'].includes(statusText)) {
    return VerificationStatus.REJECTED;
  }

  return VerificationStatus.PENDING;
};

export const normalizeRiskFlags = (riskFlags: unknown) =>
  Array.isArray(riskFlags)
    ? riskFlags.filter((flag): flag is string => typeof flag === 'string')
    : [];

export const normalizeWebhookPayload = (
  input: NormalizeWebhookInput,
): NormalizedVerificationWebhook => {
  if (!input.providerReference) {
    throw new BadRequestException('Provider reference is required.');
  }

  return {
    providerReference: input.providerReference,
    status: mapProviderStatus(input.status),
    providerStatus: input.status || 'pending',
    riskFlags: normalizeRiskFlags(input.riskFlags),
    metadata:
      input.metadata && typeof input.metadata === 'object'
        ? (input.metadata as Record<string, unknown>)
        : undefined,
  };
};
