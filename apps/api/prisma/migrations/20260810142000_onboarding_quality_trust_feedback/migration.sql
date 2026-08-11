-- Cohort 1 onboarding, quality, trust, and feedback v1.

ALTER TABLE "InvestorProfile"
  ADD COLUMN "thesis" TEXT,
  ADD COLUMN "location" TEXT,
  ADD COLUMN "isFeatured" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "isFoundingInvestor" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "featuredNote" TEXT,
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE INDEX "InvestorProfile_isFeatured_idx" ON "InvestorProfile"("isFeatured");
CREATE INDEX "InvestorProfile_isFoundingInvestor_idx" ON "InvestorProfile"("isFoundingInvestor");

CREATE TABLE "OnboardingProgress" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "stepKey" TEXT NOT NULL,
  "completedAt" TIMESTAMP(3),
  "dismissedAt" TIMESTAMP(3),
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "OnboardingProgress_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "OnboardingProgress_userId_stepKey_key" ON "OnboardingProgress"("userId", "stepKey");
CREATE INDEX "OnboardingProgress_userId_completedAt_idx" ON "OnboardingProgress"("userId", "completedAt");

ALTER TABLE "OnboardingProgress"
  ADD CONSTRAINT "OnboardingProgress_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "ConnectionFeedback" (
  "id" TEXT NOT NULL,
  "connectionId" TEXT NOT NULL,
  "reviewerId" TEXT NOT NULL,
  "revieweeId" TEXT NOT NULL,
  "rating" INTEGER,
  "flagReason" TEXT,
  "note" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ConnectionFeedback_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ConnectionFeedback_connectionId_reviewerId_key" ON "ConnectionFeedback"("connectionId", "reviewerId");
CREATE INDEX "ConnectionFeedback_revieweeId_createdAt_idx" ON "ConnectionFeedback"("revieweeId", "createdAt");
CREATE INDEX "ConnectionFeedback_flagReason_idx" ON "ConnectionFeedback"("flagReason");

ALTER TABLE "ConnectionFeedback"
  ADD CONSTRAINT "ConnectionFeedback_connectionId_fkey"
  FOREIGN KEY ("connectionId") REFERENCES "Connection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "ConnectionFeedback"
  ADD CONSTRAINT "ConnectionFeedback_reviewerId_fkey"
  FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "ConnectionFeedback"
  ADD CONSTRAINT "ConnectionFeedback_revieweeId_fkey"
  FOREIGN KEY ("revieweeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
