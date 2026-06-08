ALTER TABLE "InvestorProfile" ADD COLUMN "investmentPreference" TEXT NOT NULL DEFAULT 'BOTH';
ALTER TABLE "Pitch" ADD COLUMN "investmentType" TEXT NOT NULL DEFAULT 'SHARIA_COMPLIANT';

CREATE INDEX "Pitch_investmentType_idx" ON "Pitch"("investmentType");
