-- Speed up frequent dashboard, admin, academy, messaging, and feed queries.
CREATE INDEX IF NOT EXISTS "User_role_idx" ON "User"("role");
CREATE INDEX IF NOT EXISTS "User_isActive_idx" ON "User"("isActive");
CREATE INDEX IF NOT EXISTS "User_isVerified_idx" ON "User"("isVerified");
CREATE INDEX IF NOT EXISTS "User_createdAt_idx" ON "User"("createdAt");
CREATE INDEX IF NOT EXISTS "User_emailVerificationToken_idx" ON "User"("emailVerificationToken");
CREATE INDEX IF NOT EXISTS "User_passwordResetToken_idx" ON "User"("passwordResetToken");

CREATE INDEX IF NOT EXISTS "Pitch_userId_idx" ON "Pitch"("userId");
CREATE INDEX IF NOT EXISTS "Pitch_status_idx" ON "Pitch"("status");
CREATE INDEX IF NOT EXISTS "Pitch_category_idx" ON "Pitch"("category");
CREATE INDEX IF NOT EXISTS "Pitch_createdAt_idx" ON "Pitch"("createdAt");

CREATE INDEX IF NOT EXISTS "Connection_receiverId_status_idx" ON "Connection"("receiverId", "status");
CREATE INDEX IF NOT EXISTS "Connection_createdAt_idx" ON "Connection"("createdAt");

CREATE INDEX IF NOT EXISTS "Message_senderId_receiverId_createdAt_idx" ON "Message"("senderId", "receiverId", "createdAt");
CREATE INDEX IF NOT EXISTS "Message_receiverId_isRead_idx" ON "Message"("receiverId", "isRead");

CREATE INDEX IF NOT EXISTS "Notification_userId_isRead_idx" ON "Notification"("userId", "isRead");
CREATE INDEX IF NOT EXISTS "Notification_userId_createdAt_idx" ON "Notification"("userId", "createdAt");

CREATE INDEX IF NOT EXISTS "Program_createdAt_idx" ON "Program"("createdAt");
CREATE INDEX IF NOT EXISTS "Module_programId_order_idx" ON "Module"("programId", "order");
CREATE INDEX IF NOT EXISTS "Lesson_moduleId_order_idx" ON "Lesson"("moduleId", "order");
CREATE INDEX IF NOT EXISTS "Task_moduleId_dueDate_idx" ON "Task"("moduleId", "dueDate");

CREATE INDEX IF NOT EXISTS "UserLessonProgress_lessonId_idx" ON "UserLessonProgress"("lessonId");
CREATE INDEX IF NOT EXISTS "UserTaskSubmission_userId_idx" ON "UserTaskSubmission"("userId");
CREATE INDEX IF NOT EXISTS "UserTaskSubmission_taskId_submittedAt_idx" ON "UserTaskSubmission"("taskId", "submittedAt");
CREATE INDEX IF NOT EXISTS "UserTaskSubmission_status_idx" ON "UserTaskSubmission"("status");
CREATE INDEX IF NOT EXISTS "UserMilestone_milestoneId_idx" ON "UserMilestone"("milestoneId");

CREATE INDEX IF NOT EXISTS "ProgramEnrollment_programId_status_idx" ON "ProgramEnrollment"("programId", "status");
CREATE INDEX IF NOT EXISTS "ProgramEnrollment_userId_status_idx" ON "ProgramEnrollment"("userId", "status");
CREATE INDEX IF NOT EXISTS "ProgramEnrollment_enrolledAt_idx" ON "ProgramEnrollment"("enrolledAt");

CREATE INDEX IF NOT EXISTS "CommunityPost_status_createdAt_idx" ON "CommunityPost"("status", "createdAt");
CREATE INDEX IF NOT EXISTS "CommunityPost_userId_idx" ON "CommunityPost"("userId");
CREATE INDEX IF NOT EXISTS "CommunityComment_postId_status_idx" ON "CommunityComment"("postId", "status");
CREATE INDEX IF NOT EXISTS "CommunityComment_userId_idx" ON "CommunityComment"("userId");
