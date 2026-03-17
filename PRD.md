# Product Requirements Document (PRD)
# Naajih Platform

**Document Version:** 1.1  
**Last Updated:** March 17, 2026  
**Status:** Active Development

---

## 1. Executive Summary

Naajih Platform is a B2B networking, investment, and learning platform that connects entrepreneurs with investors and provides a structured academy for aspiring founders. The platform enables pitch discovery, verified profiles, connections, messaging, subscriptions, and admin moderation.

**Value Proposition**
- Entrepreneurs: verified investor access, pitch visibility, and deal-ready connections.
- Investors: curated deal flow, verified founders, and structured filters.
- Platform: subscription revenue, transaction facilitation, and ecosystem growth.

---

## 2. Users & Roles

**User Roles**
- Entrepreneur
- Investor
- Aspiring Business Owner
- Admin

**Primary Goals**
- Entrepreneurs: raise funding, validate ideas, build network.
- Investors: discover opportunities, evaluate founders, connect.
- Aspiring: learn, build, and graduate into investor-facing readiness.
- Admin: verify users, moderate pitches, manage academy, audit activity.

---

## 3. Platform Architecture

- Monorepo: Turborepo + pnpm
- Backend: NestJS + PostgreSQL + Prisma
- Frontend: React 19 + React Router v7 + Tailwind CSS
- State: Redux Toolkit + Redux Persist
- Realtime: Socket.io (messaging + notifications)
- File Storage: Cloudinary

---

## 4. Core Features (Implemented)

### 4.1 Authentication & Profiles
- Email/password signup and login
- JWT auth with role-based access
- Email verification via tokenized link (optional enforcement)
- Entrepreneur and Investor profiles
- Admin seed creation protected by secret

### 4.2 Pitches
- Create, list, view, update, delete pitches
- Admin moderation and stats

### 4.3 Connections
- Send, accept/reject, and remove connection requests
- Pending and accepted lists

### 4.4 Messaging
- 1:1 messaging for connected users
- Read status and delete
- Socket.io realtime delivery

### 4.5 Notifications
- Persisted notifications
- Realtime push via Socket.io
- Optional email notifications for important events
- Email templates for verification and notifications

### 4.6 Verification
- Document submission
- Admin approve/reject with audit logs
- User verification status update

### 4.7 Subscriptions & Payments
- Premium subscription flow
- Paystack and OPay initialization + verification
- Webhook verification with raw-body signature checks

### 4.8 Academy
- Programs, modules, lessons, tasks
- Enrollments and submissions
- Certificates and public verification
- Admin CSV import tools

### 4.9 Admin Console
- Admin dashboard stats
- User management
- Pitch moderation
- Verification workflow
- Audit logs
- Academy management (programs, modules, lessons, tasks, submissions, enrollments)

---

## 5. Key User Flows

### Entrepreneur Onboarding
Sign up → Create profile → (Optional) submit verification → Create pitch → Connect → Message investors

### Investor Discovery
Sign up → Create profile → Browse pitches → View details → Connect → Message founders

### Aspiring Academy Path
Sign up → Browse academy → Enroll → Complete lessons/tasks → Submit → Receive certificate

### Admin Verification
Review pending requests → Approve/Reject → User notified → Audit log recorded

---

## 6. API Surface (Current)

**Users**
- `POST /users` signup
- `POST /users/login`
- `POST /users/admin/seed`
- `POST /users/verify-email/request`
- `GET /users/verify-email`
- `GET /users`
- `GET /users/:email`
- `GET /users/stats/:id`
- `GET /users/admin/stats`
- `GET /users/admin/insights`
- `PATCH /users/:id`
- `PATCH /users/password/:id`
- `DELETE /users/:id`

**Pitches**
- `POST /pitches`
- `GET /pitches`
- `GET /pitches/recommended`
- `GET /pitches/:id`
- `GET /pitches/admin`
- `GET /pitches/admin/stats`
- `PATCH /pitches/:id`
- `DELETE /pitches/:id`

**Connections**
- `POST /connections`
- `GET /connections/user/:userId`
- `GET /connections/pending/:userId`
- `PATCH /connections/:id`
- `DELETE /connections/:id`

**Messages**
- `POST /messages`
- `GET /messages/conversation/:otherId`
- `GET /messages/partners`
- `PATCH /messages/:messageId/read`
- `DELETE /messages/:messageId`

**Verification**
- `POST /verification/submit`
- `GET /verification/:userId`
- `GET /verification/admin/pending`
- `PATCH /verification/admin/:id`

**Notifications**
- `GET /notifications/:userId`
- `PATCH /notifications/:id/read`

**Payments**
- `POST /payments/initialize`
- `GET /payments/verify`
- `POST /payments/webhook/paystack`
- `POST /payments/webhook/opay`

**Academy**
- `GET /academy`
- `GET /academy/:id`
- `GET /academy/lesson/:id`
- `POST /academy/lesson/:lessonId/complete`
- `POST /academy/join/:programId`
- `POST /academy/task/:taskId/submit`
- `GET /academy/milestones`
- `GET /academy/certificate/:programId`
- `GET /academy/certificate/:programId/pdf`
- `GET /academy/public/verify`
- Admin academy routes: programs, modules, lessons, tasks, submissions, enrollments, imports

**Audit**
- `GET /audit`
- `GET /audit/recent`

---

## 7. Data Model (Core)

- User, EntrepreneurProfile, InvestorProfile
- Pitch
- Connection
- Message
- VerificationRequest
- Subscription
- Notification
- AuditLog
- Academy models (Program, Module, Lesson, Task, Enrollment, Submission, Milestones, Certificates)
- PaymentTransaction

---

## 8. Tech Stack

**Backend**
- NestJS 11
- Prisma 5
- PostgreSQL
- JWT Auth + Passport
- Socket.io
- Nodemailer

**Frontend**
- React 19
- React Router v7
- Redux Toolkit + Persist
- Tailwind CSS
- Axios/Fetch

---

## 9. Non-Functional Requirements

- API p95 < 200ms
- Frontend load < 3s
- Rate limiting on auth
- CORS properly configured
- Webhook verification using raw request body

---

## 10. Environment Variables

**Backend (`apps/api/.env`)**
- `DATABASE_URL`
- `JWT_SECRET`
- `REQUIRE_EMAIL_VERIFICATION`
- `EMAIL_VERIFICATION_TTL_HOURS`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_SEED_SECRET`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
- `NOTIFICATION_EMAIL_ENABLED`
- `APP_BASE_URL`
- `CERT_LOGO_URL`
- `PAYSTACK_SECRET_KEY`
- `PAYSTACK_WEBHOOK_SECRET`
- `OPAY_SECRET_KEY`
- `OPAY_MERCHANT_ID`
- `OPAY_PUB_KEY`
- `OPAY_WEBHOOK_SECRET`
- `FRONTEND_URL`
- `BACKEND_URL`
- `SUBSCRIPTION_AMOUNT_NGN`
- `SUBSCRIPTION_DURATION_DAYS`

**Frontend**
- `VITE_API_BASE_URL`

---

## 11. UI Page Map

### User Web (apps/user-web)

Public:
- `/` Landing
- `/login`
- `/signup`
- `/certificate/verify/:programId/:userId`

Dashboard:
- `/dashboard` Home
- `/dashboard/learning-center`
- `/dashboard/learning-center/:id`
- `/dashboard/academy/:id`
- `/dashboard/academy/course/:lessonId`
- `/dashboard/academy/certificate/:programId`
- `/dashboard/verification`
- `/dashboard/opportunities`
- `/dashboard/opportunities/:id`
- `/dashboard/investor`
- `/dashboard/profile`
- `/dashboard/subscription`
- `/dashboard/create-pitch`
- `/dashboard/connections`
- `/dashboard/messages`
- `/dashboard/settings`

### Admin Web (apps/admin-web)

Public:
- `/login`
- `/unauthorized`

Protected:
- `/admin/dashboard`
- `/admin/users`
- `/admin/pitches`
- `/admin/verification`
- `/admin/audit`
- `/admin/settings`
- `/admin/academy`
- `/admin/academy/:id`
- `/admin/academy/submissions`
- `/admin/academy/enrollments`

---

## 12. Admin & Academy Detail

**Admin Console**
- Dashboard stats (users, pitches, verification, audit)
- User management (view, update, reset passwords, delete)
- Pitch moderation (status updates, deletion)
- Verification review (approve/reject with reasons)
- Audit logs (recent and searchable)

**Academy**
- Programs listing and creation
- Program detail with modules, lessons, tasks
- CSV import for programs, modules, lessons, tasks, enrollments
- Learner enrollments and status updates
- Task submissions review with feedback
- Certificates and public verification

---

## 13. Roadmap (Near-Term)

- Complete remaining UI wiring and data consistency
- Improve analytics and admin dashboards
- Production-ready payment reconciliation
- Email templates and marketing automation
- Enhanced search and recommendation features

---

## 14. Success Metrics

- Pitch creation rate
- Verified user ratio
- Connection acceptance rate
- Messages sent per user
- Subscription conversion rate
- Academy completion rate
