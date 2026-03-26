# Product Requirements Document
# Naajih Platform

**Document Version:** 2.0  
**Last Updated:** March 19, 2026  
**Status:** MVP Ready

---

## 1. Product Summary

Naajih Platform is a role-based web platform that combines founder networking, investor discovery, structured learning for aspiring business owners, subscription payments, verification, and admin operations in one product.

The product serves three end-user groups:
- Entrepreneurs looking to create pitches, build investor visibility, and form connections.
- Investors looking to discover vetted opportunities and communicate with founders.
- Aspiring business owners looking to learn through academy programs, community discussion, and mentor access.

The platform also includes an admin console for moderation, verification review, academy operations, and platform oversight.

---

## 2. Product Goals

### Business Goals
- Launch a deployable MVP with working revenue paths.
- Monetize aspirant learning through premium academy access.
- Maintain investor and entrepreneur acquisition through networking features.
- Keep admin control strong enough for moderation, verification, and academy quality.

### User Goals
- Entrepreneurs can create and manage pitches, connect, and message.
- Investors can review opportunities, connect with founders, and manage their pipeline.
- Aspirants can learn through free and premium programs, join community discussions, and access mentor sessions.
- Admins can manage users, academy programs, enrollments, submissions, verifications, and audit activity.

---

## 3. User Roles

### Entrepreneur
- Has entrepreneur profile data
- Can create pitches
- Can view opportunities
- Can connect and message
- Can submit verification
- Uses networking-focused subscription flow

### Investor
- Has investor profile data
- Can browse opportunities
- Can connect and message
- Can submit verification
- Uses networking-focused subscription flow

### Aspiring Business Owner
- Uses a learning-first dashboard
- Can access academy programs
- Can join free programs immediately
- Needs premium access for premium programs, mentor booking, and certificates
- Can use community/forum features
- Cannot submit or check KYC verification
- Uses premium learning subscription with a free trial

### Admin
- Has access to admin web only
- Can review users, pitches, verifications, audit logs, academy operations, and settings
- Can manage program pricing state through free vs premium flags

---

## 4. Product Scope

### In Scope for MVP
- Authentication and role-based dashboards
- Entrepreneur and investor profile management
- Pitch creation and opportunity browsing
- Connections and direct messaging
- Notifications
- Verification workflow for entrepreneur and investor roles
- Subscription payments through Paystack and OPay
- Academy with programs, modules, lessons, tasks, submissions, enrollments, milestones, and certificates
- Premium academy gating for aspirants
- Free trial for aspirant premium learning
- Community/forum with moderation
- Mentor booking page with external booking embed
- Admin operations and audit visibility
- Unified light/dark theme across core admin and dashboard flows

### Out of Scope for This MVP
- Native mentor scheduling engine
- In-app video calls
- Multi-tenant organization management
- Advanced analytics and BI dashboards
- Full content recommendation engine
- Automated moderation with ML

---

## 5. Core Value by Role

### For Entrepreneurs
- Present business opportunities clearly
- Reach investors in a structured environment
- Build verified trust signals
- Maintain conversations inside the platform

### For Investors
- Access organized deal flow
- Review founder and pitch information quickly
- Build a network of founders
- Manage opportunity review more efficiently

### For Aspirants
- Start with free introductory learning
- Upgrade to premium for advanced programs
- Access mentor office hours through premium
- Participate in community discussions while learning
- Earn certificates on completion

### For Admin
- Operate the marketplace and academy centrally
- Moderate quality and risk
- Track user and learning activity
- Maintain trust and compliance signals

---

## 6. User Experience Model

### 6.1 Dashboard Model

The dashboard experience is role-aware.

**Aspirant Sidebar**
- Dashboard
- Learning Center
- Community
- Mentor Booking
- Profile
- Upgrade Plan

**Entrepreneur / Investor Sidebar**
- Dashboard
- Opportunities
- Messages
- Connections
- Profile
- Verification
- Upgrade Plan

Entrepreneurs also retain a pitch creation action.

### 6.2 Theme System

The core admin experience and major user dashboard flows share the same light/dark color direction. The design requirement is consistency of surfaces, borders, states, and accent usage across pages instead of page-by-page visual drift.

---

## 7. Feature Requirements

### 7.1 Authentication and Access Control
- Email and password signup/login
- JWT authentication
- Role-based route access
- Email verification fields supported in the user model
- Admin seed flow protected by secret

### 7.2 Profiles
- Entrepreneur profile
- Investor profile
- User account status fields such as `isActive`
- Profile editing from dashboard

### 7.3 Pitches and Opportunities
- Entrepreneurs can create, update, and delete pitches
- Investors and founders can browse opportunity listings
- Pitch detail pages support direct follow-up actions
- Admin can moderate pitch approval status

### 7.4 Connections and Messaging
- Users can send connection requests
- Requests can be accepted or rejected
- Connected users can exchange direct messages
- Notifications support key activity

### 7.5 Verification
- Only `ENTREPRENEUR` and `INVESTOR` can submit verification
- Users can only read their own verification status unless they are admin
- Admin can filter pending, approved, and rejected requests
- Admin can approve or reject with reason
- Verification actions write audit records

### 7.6 Subscriptions and Payments
- Subscription plans include `FREE` and `PREMIUM`
- Payment providers:
  - Paystack
  - OPay
- Payment transactions are tracked with provider, amount, currency, status, and metadata
- Webhook verification uses raw request body and secret validation
- Subscription amount is configurable with env vars

### 7.7 Aspirant Premium Learning Model
- Admin marks programs as free or premium with `isPremium`
- Aspirants can access free programs without premium subscription
- Premium access unlocks:
  - premium academy programs
  - mentor booking
  - certificates
- Aspirants have a free premium trial
- Current MVP pricing direction:
  - Currency: NGN
  - Default premium amount: `5000`
  - Default free trial: `14` days

### 7.8 Academy
- Program list and detail pages
- Programs contain modules
- Modules contain lessons and tasks
- Lesson completion tracking
- Task submissions with admin review
- Enrollment workflow with admin review options
- Milestones and certificates
- Public certificate verification endpoint
- CSV import support for admin academy operations

### 7.9 Community
- Aspirants can create community posts
- Posts support tags
- Comments are supported
- Community items can be pending, approved, or rejected
- Admin moderation includes:
  - approve/reject
  - delete
  - pin/unpin posts
- Reports are supported for posts and comments
- Moderation queue supports reported content review
- Trusted-user style auto-approval logic exists for selected users/conditions already implemented in code

### 7.10 Mentor Booking
- Mentor booking is an embedded external scheduling experience
- Uses a configurable booking URL from frontend env
- Intended for premium aspirants only
- Current integration can point to Calendly or Zoho Bookings because the UI only requires a shareable external booking link

### 7.11 Notifications
- In-app notifications
- Realtime support through Socket.io for active app use
- Mail templates exist for verification and selected notification events

### 7.12 Admin Console
- Overview dashboard
- User management
- Pitch moderation
- Verification review
- Audit logs
- Settings
- Academy programs
- Academy program detail management
- Academy submissions
- Academy enrollments

---

## 8. Routes

### 8.1 User Web Routes

**Public**
- `/`
- `/login`
- `/signup`
- `/certificate/verify/:programId/:userId`

**Dashboard**
- `/dashboard`
- `/dashboard/learning-center`
- `/dashboard/community`
- `/dashboard/mentors`
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

### 8.2 Admin Web Routes

**Public**
- `/login`
- `/unauthorized`

**Protected**
- `/admin/dashboard`
- `/admin/users`
- `/admin/pitches`
- `/admin/audit`
- `/admin/settings`
- `/admin/academy`
- `/admin/academy/submissions`
- `/admin/academy/enrollments`
- `/admin/academy/:id`
- `/admin/verification`

---

## 9. Backend Capability Map

### Users
- Signup
- Login
- Admin seed
- Email verification request and confirmation
- User listing and stats
- User update, password update, delete
- Subscription fetch and free-trial start

### Pitches
- CRUD
- Recommendations
- Admin moderation and stats

### Connections
- Create
- Pending lists
- Accept/reject
- Remove

### Messages
- Send
- Fetch conversation
- Fetch partners
- Mark read
- Delete

### Verification
- Submit verification
- Check own verification status
- Admin pending list with filters
- Admin approve/reject

### Notifications
- Fetch
- Mark read

### Payments
- Initialize subscription payment
- Verify payment
- Paystack webhook
- OPay webhook

### Academy
- List programs
- View program
- View lesson
- Join program
- Complete lesson
- Submit task
- Read milestones
- Fetch certificate
- Generate certificate PDF
- Public certificate verification
- Admin academy management endpoints

### Community
- Create/list/read posts
- Create comments
- Report posts/comments
- Filter by tags
- Filter my posts
- Moderation queue endpoints
- Admin approve/reject/delete/pin actions

### Audit
- List audit logs
- Fetch recent audit logs

---

## 10. Data Model Summary

### Main Entities
- `User`
- `EntrepreneurProfile`
- `InvestorProfile`
- `Pitch`
- `Connection`
- `Message`
- `VerificationRequest`
- `Subscription`
- `Notification`
- `PaymentTransaction`
- `AuditLog`

### Academy Entities
- `Program`
- `Module`
- `Lesson`
- `Task`
- `ProgramEnrollment`
- `UserLessonProgress`
- `UserTaskSubmission`
- `Milestone`
- `UserMilestone`

### Community Entities
- `CommunityPost`
- `CommunityComment`
- `CommunityReport`

### Key State Flags
- `User.isVerified`
- `User.isActive`
- `User.emailVerified`
- `Subscription.plan`
- `Subscription.endDate`
- `Subscription.trialEndsAt`
- `Subscription.trialUsed`
- `Program.isPremium`
- `CommunityPost.status`
- `CommunityPost.isPinned`
- `CommunityComment.status`

---

## 11. Environment Requirements

### Backend
- `DATABASE_URL`
- `JWT_SECRET`
- `REQUIRE_EMAIL_VERIFICATION`
- `EMAIL_VERIFICATION_TTL_HOURS`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_SEED_SECRET`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`
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

### User Web
- `VITE_API_BASE_URL`
- `VITE_CALENDLY_URL`
- `VITE_SUBSCRIPTION_AMOUNT_NGN`
- `VITE_TRIAL_DAYS`

### Admin Web
- `VITE_API_BASE_URL`

---

## 12. Non-Functional Requirements

- Role-based access must be enforced server-side
- Webhook verification must use raw request body and provider secrets
- Core dashboard flows must support both light mode and dark mode with consistent palette behavior
- Prisma schema and generated client must stay in sync after schema edits
- Platform should remain deployable with pnpm monorepo workflows

---

## 13. MVP Readiness Assessment

### Ready
- Multi-role auth and dashboards
- Pitch and opportunity flows
- Messaging and connections
- Verification flow for entrepreneur/investor
- Academy and certificate generation
- Premium academy gating for aspirants
- Community and moderation
- Mentor booking integration surface
- Admin operations

### Launch Dependencies
- Production env vars must be set correctly
- Production database must receive the latest Prisma schema
- Real payment keys and webhook secrets must be configured
- Real booking URL should replace the placeholder URL

### Known Product Boundaries
- Mentor booking depends on an external scheduling provider
- Some secondary pages may still need final visual QA despite the theme pass
- Accessibility cleanup should continue where browser tooling still flags form labeling gaps

---

## 14. Manual QA Checklist

### Admin
- Log in as admin
- Open dashboard in light mode and dark mode
- Review users list and account actions
- Review pending and processed verifications
- Approve or reject a verification
- Review academy program list
- Create or edit a program and verify free/premium state
- Review submissions and enrollments
- Check audit log visibility

### Entrepreneur
- Sign up or log in as entrepreneur
- Update profile
- Create a pitch
- Browse opportunities
- Send a connection request
- Open messages
- Submit verification request
- Open subscription page and confirm networking-focused copy

### Investor
- Sign up or log in as investor
- Update profile
- Browse opportunities
- Open a pitch detail page
- Connect to a founder
- Open messages
- Submit verification request
- Open subscription page and confirm networking-focused copy

### Aspirant
- Sign up or log in as aspiring business owner
- Confirm sidebar only shows learning-first items
- Open learning center
- Join a free program
- Attempt a premium program without premium access and confirm gating
- Start free trial and retry premium access
- Open mentor booking and confirm premium gating works
- Open community and create a post
- Add a comment
- Report a post or comment
- Confirm verification route is not part of the aspirant workflow

### Payments
- Initialize a Paystack subscription payment
- Initialize an OPay subscription payment
- Verify successful payment updates subscription state
- Confirm webhook endpoints accept valid signatures only

### Certificates
- Complete a program flow sufficient for certificate generation
- Open certificate page as aspirant with premium access
- Download PDF
- Open public certificate verification route

### Theme QA
- Check admin dashboard pages in light mode and dark mode
- Check user dashboard pages in light mode and dark mode
- Verify cards, tables, forms, empty states, and hover states are visually consistent

---

## 15. Next Product Priorities After MVP

1. Final browser-based QA across all dashboards and both themes
2. Replace placeholder mentor booking URL with production booking provider URL
3. Continue accessibility cleanup for remaining form-label warnings
4. Add analytics and event tracking for conversion, trial usage, and premium upgrades
5. Add deeper moderation tooling only if community scale demands it
