ALTER TABLE "User"
  RENAME COLUMN "isConferenceWaitlist" TO "isWaitlistUser";

ALTER TABLE "User"
  RENAME COLUMN "conferenceNotifiedAt" TO "waitlistNotifiedAt";

ALTER INDEX "User_isConferenceWaitlist_idx"
  RENAME TO "User_isWaitlistUser_idx";