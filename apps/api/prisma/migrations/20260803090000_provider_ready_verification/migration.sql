ALTER TYPE "VerificationStatus" ADD VALUE IF NOT EXISTS 'FLAGGED';

CREATE TYPE "VerificationType" AS ENUM ('IDENTITY', 'BUSINESS');

CREATE TYPE "VerificationProvider" AS ENUM (
  'MANUAL',
  'INTERNAL_SANDBOX',
  'SMILE_ID',
  'DOJAH',
  'VERIFYME'
);

CREATE TYPE "TrustLevel" AS ENUM (
  'UNVERIFIED',
  'IDENTITY_PENDING',
  'IDENTITY_VERIFIED',
  'BUSINESS_PENDING',
  'BUSINESS_VERIFIED',
  'FULLY_VERIFIED',
  'REJECTED',
  'FLAGGED'
);

ALTER TABLE "VerificationRequest"
  ALTER COLUMN "documentUrl" DROP NOT NULL,
  ADD COLUMN "verificationType" "VerificationType" NOT NULL DEFAULT 'IDENTITY',
  ADD COLUMN "provider" "VerificationProvider" NOT NULL DEFAULT 'MANUAL',
  ADD COLUMN "providerReference" TEXT,
  ADD COLUMN "providerStatus" TEXT,
  ADD COLUMN "trustLevel" "TrustLevel" NOT NULL DEFAULT 'UNVERIFIED',
  ADD COLUMN "consentedAt" TIMESTAMP(3),
  ADD COLUMN "verifiedAt" TIMESTAMP(3),
  ADD COLUMN "riskFlags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "metadata" JSONB,
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "VerificationRequest" DROP CONSTRAINT IF EXISTS "VerificationRequest_userId_key";

UPDATE "VerificationRequest"
SET
  "trustLevel" = CASE
    WHEN "status" = 'APPROVED' THEN 'IDENTITY_VERIFIED'::"TrustLevel"
    WHEN "status" = 'REJECTED' THEN 'REJECTED'::"TrustLevel"
    ELSE 'IDENTITY_PENDING'::"TrustLevel"
  END,
  "verifiedAt" = CASE
    WHEN "status" = 'APPROVED' THEN "createdAt"
    ELSE NULL
  END,
  "consentedAt" = COALESCE("consentedAt", "createdAt");

CREATE INDEX "VerificationRequest_status_idx" ON "VerificationRequest"("status");
CREATE INDEX "VerificationRequest_verificationType_idx" ON "VerificationRequest"("verificationType");
CREATE INDEX "VerificationRequest_provider_providerReference_idx" ON "VerificationRequest"("provider", "providerReference");
CREATE INDEX "VerificationRequest_trustLevel_idx" ON "VerificationRequest"("trustLevel");
CREATE UNIQUE INDEX "VerificationRequest_userId_verificationType_key" ON "VerificationRequest"("userId", "verificationType");
