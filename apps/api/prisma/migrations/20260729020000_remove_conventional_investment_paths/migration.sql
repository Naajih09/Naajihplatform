DROP INDEX IF EXISTS "Pitch_investmentType_idx";

ALTER TABLE "InvestorProfile"
  DROP COLUMN IF EXISTS "investmentPreference";

ALTER TABLE "Pitch"
  DROP COLUMN IF EXISTS "investmentType";
