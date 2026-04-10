-- Add avatar URLs to public profile records
ALTER TABLE "EntrepreneurProfile"
ADD COLUMN "avatarUrl" TEXT;

ALTER TABLE "InvestorProfile"
ADD COLUMN "avatarUrl" TEXT;
