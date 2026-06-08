ALTER TABLE "EntrepreneurProfile" ADD COLUMN "focusIndustries" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "InvestorProfile" ALTER COLUMN "focusIndustries" SET DEFAULT ARRAY[]::TEXT[];
