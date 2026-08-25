ALTER TABLE "User"
  ADD COLUMN "isConferenceWaitlist" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "conferenceNotifiedAt" TIMESTAMP(3);

CREATE INDEX "User_isConferenceWaitlist_idx"
  ON "User"("isConferenceWaitlist");
