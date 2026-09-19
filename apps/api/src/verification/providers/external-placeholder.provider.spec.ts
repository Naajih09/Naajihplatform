import { BadRequestException } from '@nestjs/common';
import { VerificationProvider, VerificationType } from '@prisma/client';
import { DojahVerificationProvider } from './external-placeholder.provider';

describe('external verification providers', () => {
  const input = {
    userId: 'user-1',
    email: 'founder@example.com',
    verificationType: VerificationType.BUSINESS,
    providerReference: 'naajih_user-1_business_123',
    businessName: 'Acme Foods',
    cacNumber: 'RC123',
    metadata: { source: 'test' },
  };

  beforeEach(() => {
    delete process.env.DOJAH_VERIFICATION_URL;
    delete process.env.VERIFICATION_PROVIDER_URL;
    delete process.env.DOJAH_VERIFICATION_CALLBACK_URL;
    delete process.env.DOJAH_VERIFICATION_WEBHOOK_URL;
  });

  it('starts a configured hosted verification session', async () => {
    process.env.DOJAH_VERIFICATION_URL = 'https://verify.example/start';
    process.env.DOJAH_VERIFICATION_CALLBACK_URL =
      'https://app.example/verification/callback';
    process.env.DOJAH_VERIFICATION_WEBHOOK_URL =
      'https://api.example/api/verification/provider/webhook';

    const result = await new DojahVerificationProvider().startSession(input);
    const redirect = new URL(result.redirectUrl || '');

    expect(result.provider).toBe(VerificationProvider.DOJAH);
    expect(result.providerStatus).toBe('hosted_session_created');
    expect(result.metadata).toEqual(
      expect.objectContaining({
        providerMode: 'hosted_redirect',
        source: 'test',
      }),
    );
    expect(redirect.origin).toBe('https://verify.example');
    expect(redirect.searchParams.get('reference')).toBe(
      input.providerReference,
    );
    expect(redirect.searchParams.get('verificationType')).toBe(
      VerificationType.BUSINESS,
    );
    expect(redirect.searchParams.get('callbackUrl')).toBe(
      'https://app.example/verification/callback',
    );
  });

  it('requires a hosted provider URL', async () => {
    await expect(
      new DojahVerificationProvider().startSession(input),
    ).rejects.toThrow(BadRequestException);
  });
});
