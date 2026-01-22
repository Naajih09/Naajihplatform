# Product Requirements Document (PRD)
## Naajih Platform - Entrepreneur & Investor Networking Application

---

## 1. Executive Summary

**Naajih Platform** is a B2B networking and pitch platform that connects entrepreneurs with investors. It enables entrepreneurs to showcase their business ideas through digital pitches, while allowing investors to discover investment opportunities and build networks. The platform facilitates connections, messaging, and business deal discovery in a structured, verification-based ecosystem.

### Core Value Proposition:
- **For Entrepreneurs:** Access to verified investors, pitch visibility, and deal-making opportunities
- **For Investors:** Curated investment opportunities, verified founders, and industry-specific filtering
- **For Platform:** Commission on successful transactions, subscription revenue, and data insights

---

## 2. Product Overview

### 2.1 Target Users

| User Type | Description | Primary Goals |
|-----------|-------------|----------------|
| **Entrepreneurs** | Business founders seeking capital | Find investors, showcase pitches, build network |
| **Investors** | Angel investors, VCs, institutional funds | Discover deals, evaluate opportunities, network |
| **Aspiring Business Owners** | Pre-launch entrepreneurs | Learn, network, prepare for funding |
| **Admin** | Platform administrators | Verify users, manage content, monitor ecosystem |

### 2.2 Platform Architecture

The platform is built using a **monorepo structure** with:
- **Backend:** NestJS + PostgreSQL + Prisma ORM
- **Frontend:** React 19 + React Router v7 + Redux Toolkit + Tailwind CSS
- **State Management:** Redux Persist for persistent auth state
- **Shared UI:** Component library (@repo/ui) in monorepo
- **Build System:** Turborepo for monorepo orchestration

---

## 3. Core Features

### 3.1 User Authentication & Profile Management

#### Authentication
- **Sign Up:** Email-based registration with role selection (Entrepreneur, Investor, Aspiring Owner)
- **Login:** Email/password authentication with JWT tokens
- **Password Security:** Bcrypt hashing with bcrypt-ts
- **Session Persistence:** Redux Persist stores auth state in localStorage

#### User Profiles
**Entrepreneur Profile:**
- First & Last Name
- Business Name
- Industry
- Business Stage (pre-seed, seed, series A, etc.)
- CAC Number (business registration)
- Location

**Investor Profile:**
- First & Last Name
- Organization/Fund Name
- Min/Max Ticket Size (investment range)
- Focus Industries (array)
- Location

**Shared Profile Data:**
- Email (unique identifier)
- Role (ENTREPRENEUR, INVESTOR, ASPIRING_BUSINESS_OWNER, ADMIN)
- Verification Status (PENDING, APPROVED, REJECTED)
- Subscription Plan (FREE, PREMIUM)
- Account Created/Updated timestamps

### 3.2 Pitch Management System

#### Creating Pitches
Entrepreneurs can submit comprehensive business pitches containing:
- **Title:** Business name/pitch headline
- **Tagline:** One-line description
- **Problem Statement:** Market problem being solved
- **Solution:** How the business solves the problem
- **Traction:** User growth, revenue, partnerships (social proof)
- **Market Size:** TAM/SAM/SOM
- **Funding Ask:** Amount seeking
- **Equity Offer:** Percentage of equity offered
- **Pitch Deck:** Optional PDF/document upload (Cloudinary-hosted)

#### Pitch Discovery & Feed
- All authenticated users can browse pitches
- Pitches display with entrepreneur details (name, company)
- Ordered by most recent first
- Includes creator's profile information
- Click-through to detailed pitch view

#### Pitch Details View
- Full pitch information
- Entrepreneur profile (clickable)
- Connect/Message buttons
- Investment interest indication

### 3.3 Networking & Connection System

#### Connection Requests
- Users can send connection requests to other users
- **Status Flow:** PENDING → ACCEPTED/REJECTED
- Prevents duplicate connection requests (unique constraint on senderId + receiverId)
- Track who initiated connection (sender/receiver relationship)

#### Connection Management
- View all connections (sent and received)
- Accept/reject incoming requests
- Remove existing connections
- View connection profile information

#### Use Cases:
- Entrepreneur sends connection request to Investor
- Investor reviews and accepts/rejects
- Accepted connections become "network"

### 3.4 Messaging System

#### Direct Messaging
- **One-to-One Communication:** Users can message accepted connections
- **Message Storage:** Content persisted in database
- **Read Status:** Track if message has been read (isRead flag)
- **Timestamp:** All messages timestamped for sorting
- **Threading:** Messages organized by conversation pair

#### Message Features:
- View unread message count
- Mark messages as read
- Delete message history (future feature)
- Search messages (future feature)

### 3.5 Verification System

#### Document-Based Verification
- **For Entrepreneurs:** Business registration documents (CAC, tax ID)
- **For Investors:** Fund credentials, accreditation documents
- **Submission:** Upload documents (Cloudinary integration)
- **Status:** PENDING → APPROVED/REJECTED
- **Admin Review:** Admin team manually verifies documents

#### Benefits:
- Builds trust in the ecosystem
- Investors can filter by verified entrepreneurs
- Reduced fraud risk

### 3.6 Subscription & Premium Features

#### Tiers:
| Feature | Free | Premium |
|---------|------|---------|
| Create Pitches | ✓ | ✓ |
| Browse Pitches | ✓ | ✓ |
| Send Messages | Limited | ✓ |
| View Full Profiles | Limited | ✓ |
| Advanced Search | ✗ | ✓ |
| Featured Pitch | ✗ | ✓ |
| Export Network | ✗ | ✓ |
| Priority Support | ✗ | ✓ |

#### Plan Management:
- Subscription model with endDate tracking
- Recurring billing (integration pending: Stripe/Paystack)
- Plan upgrade/downgrade capability

---

## 4. User Workflows

### 4.1 Entrepreneur Onboarding Flow
```
Sign Up (Email, Password, Role=ENTREPRENEUR)
  → Create Entrepreneur Profile (Name, Business, Industry)
  → Verify Email
  → Submit Verification Documents (optional, recommended)
  → Browse Investor Profiles
  → Create First Pitch
  → Send Connection Requests
  → Wait for Investor Responses
  → Message Interested Investors
```

### 4.2 Investor Discovery Flow
```
Sign Up (Email, Password, Role=INVESTOR)
  → Create Investor Profile (Name, Org, Ticket Size, Industries)
  → Verify Investor Credentials
  → Browse Pitch Feed (filtered by industry)
  → View Pitch Details & Creator Profile
  → Send Connection Request to Entrepreneur
  → Message Connected Entrepreneurs
  → Evaluate Deal Opportunity
  → Proceed to Due Diligence (off-platform)
```

### 4.3 Connection & Messaging Flow
```
User A sends Connection Request to User B
  → Connection Status: PENDING
  → User B receives notification (future)
  → User B accepts/rejects
  → If accepted: Connection Status = ACCEPTED
  → Both can now view full profiles & message
  → Messages appear in real-time (future: WebSocket)
```

---

## 5. API Endpoints

### Users Module
```
POST   /users              - Sign up (create user + profile)
POST   /users/login        - Login (authenticate)
GET    /users              - List all users
GET    /users/:email       - Get user by email
PATCH  /users/:id          - Update user profile
```

### Pitches Module
```
POST   /pitches            - Create new pitch (entrepreneur)
GET    /pitches            - Get all pitches (feed)
GET    /pitches/:id        - Get pitch details
PATCH  /pitches/:id        - Update pitch (future)
DELETE /pitches/:id        - Delete pitch (future)
```

### Connections Module
```
POST   /connections                    - Send connection request
GET    /connections/user/:userId       - Get user's connections/network
PATCH  /connections/:connectionId      - Accept/reject request (future)
DELETE /connections/:connectionId      - Remove connection (future)
```

### Messages Module (Schema ready, endpoints pending)
```
POST   /messages                       - Send message
GET    /messages/user/:userId          - Get user's messages
GET    /messages/:conversationId       - Get conversation thread (future)
PATCH  /messages/:messageId            - Mark as read (future)
```

### Verification Module (Schema ready, endpoints pending)
```
POST   /verification                   - Submit verification documents
GET    /verification/:userId           - Get verification status
PATCH  /verification/:id               - Admin approve/reject (future)
```

---

## 6. Database Schema

### Core Models
```
User
├── id (UUID)
├── email (unique)
├── password (hashed)
├── role (ENTREPRENEUR, INVESTOR, ASPIRING_BUSINESS_OWNER, ADMIN)
├── entrepreneurProfile (optional, 1-to-1)
├── investorProfile (optional, 1-to-1)
├── pitches (1-to-many)
├── sentConnections (1-to-many)
├── receivedConnections (1-to-many)
├── sentMessages (1-to-many)
├── receivedMessages (1-to-many)
├── verification (1-to-1)
├── subscription (1-to-1)
└── timestamps (createdAt, updatedAt)

EntrepreneurProfile
├── id (UUID)
├── userId (unique FK)
├── firstName, lastName
├── businessName
├── industry
├── stage
├── cacNumber
└── location

InvestorProfile
├── id (UUID)
├── userId (unique FK)
├── firstName, lastName
├── organization
├── minTicketSize, maxTicketSize (Decimal)
├── focusIndustries (array)
└── location

Pitch
├── id (UUID)
├── userId (FK) → User
├── title, tagline
├── problemStatement, solution
├── traction, marketSize
├── fundingAsk, equityOffer
├── pitchDeckUrl
└── timestamps

Connection
├── id (UUID)
├── senderId (FK) → User
├── receiverId (FK) → User
├── status (PENDING, ACCEPTED, REJECTED)
├── unique constraint (senderId, receiverId)
└── timestamps

Message
├── id (UUID)
├── content (text)
├── senderId (FK) → User
├── receiverId (FK) → User
├── isRead (boolean)
└── timestamps

VerificationRequest
├── id (UUID)
├── userId (unique FK) → User
├── documentUrl (Cloudinary)
├── status (PENDING, APPROVED, REJECTED)
└── timestamps

Subscription
├── id (UUID)
├── userId (unique FK) → User
├── plan (FREE, PREMIUM)
├── endDate (nullable)
└── timestamps
```

---

## 7. Technology Stack

### Backend
- **Framework:** NestJS 11.0
- **Database:** PostgreSQL
- **ORM:** Prisma 5.22
- **Authentication:** JWT (Passport-JWT, Passport-Local)
- **File Upload:** Cloudinary
- **Email:** Nodemailer
- **Rate Limiting:** Throttler (4 req/sec, 100 req/min)
- **Validation:** Class-Validator, Class-Transformer
- **Search:** Fuse.js
- **Logging:** Winston

### Frontend
- **Framework:** React 19
- **Router:** React Router v7
- **State Management:** Redux Toolkit + Redux Persist
- **Styling:** Tailwind CSS
- **UI Components:** Custom (@repo/ui library) + Shadcn-inspired
- **Forms:** React Hook Form + Zod validation
- **API Client:** RTK Query (configured, partially used)
- **Charts:** Recharts
- **Date Handling:** date-fns, date-fns-tz
- **HTTP Client:** Axios (via RTK Query)

### DevOps & Tooling
- **Monorepo:** Turborepo + pnpm
- **Linting:** ESLint 9
- **Formatting:** Prettier
- **Package Manager:** pnpm 10.26
- **Deployment:** Vercel (user-web)
- **Node Version:** ≥18

---

## 8. Frontend Structure

### Pages
- **Landing Page** (`landing.tsx`) - Public homepage, CTA to sign up
- **Login Page** (`auth/Login.tsx`) - Email/password authentication
- **Signup Page** (`auth/Signup.tsx`) - Role selection, profile creation
- **Dashboard Home** (`dashboard/DashboardHome.jsx`) - Main dashboard hub
- **Entrepreneur Dashboard** (`dashboard/EntrepreneurDashboard.jsx`) - Pitch management, network
- **Investor Dashboard** (`dashboard/InvestorDashboard.jsx`) - Pitch browsing, deal evaluation
- **Create Pitch** (`dashboard/CreatePitch.tsx`) - Pitch creation form
- **Pitch Details** (`dashboard/PitchDetails.jsx`) - View pitch + creator profile
- **Profile** (`dashboard/Profile.jsx`) - User profile edit/view
- **Opportunities** (`dashboard/Opportunities.jsx`) - Saved pitches, watchlist

### Layouts
- **Blank Layout** - For public pages (landing, login, signup)
- **Dashboard Layout** - For authenticated pages (includes sidebar navigation, header)

### State Management
- **Auth Slice** - Current user, login status, JWT token
- **Persistent Storage** - Redux Persist stores auth state in localStorage
- **Future:** Additional slices for pitches, connections, messages

### Services
- **Auth API** (`auth-api.ts`) - Login mutation using RTK Query
- **Base Query** (`base-query.ts`) - RTK Query configuration with logout on 401
- **HTTP Interceptors** - Automatic token injection, error handling

---

## 9. Current Implementation Status

### ✅ Completed
- Database schema with all core models
- User authentication (signup, login, hashing)
- Pitch CRUD operations (create, list, details)
- Connection management (send requests, view network)
- Messaging data model
- User profile management (update)
- Frontend routing structure
- Redux state management setup
- API client initialization (RTK Query)
- Rate limiting middleware
- Verification system schema

### 🔄 In Progress
- Frontend pages (some components stubbed)
- API endpoint implementations for connections/messages
- Verification endpoints
- Integration tests

### ⏳ Future Features
- **Real-time Messaging:** WebSocket integration (Socket.io)
- **Notifications:** Email/push notifications for connections, messages
- **Advanced Search:** Filter pitches by industry, stage, funding ask
- **Search & Recommendations:** Suggest connections based on interests
- **Payment Integration:** Stripe/Paystack for subscriptions
- **Social Proof:** Endorsements, reviews, ratings
- **Due Diligence Tools:** Document sharing, term sheet generator
- **Analytics Dashboard:** Investor insights, pitch performance metrics
- **Mobile App:** React Native version
- **Email Templates:** EJS templates for marketing emails
- **Two-Factor Authentication:** Enhanced security
- **OAuth Integration:** Google, LinkedIn login
- **Export Capabilities:** Network export, pitch deck templates

---

## 10. Success Metrics

### User Growth
- Monthly Active Users (MAU)
- Successful connections formed
- Pitch creation rate (entrepreneurship index)

### Engagement
- Pitch views per user
- Messages sent (network activity)
- Connection acceptance rate
- Average session duration

### Business Metrics
- Deals closed through platform
- Premium subscription conversion rate
- Successful investor-founder matches
- Capital deployed on platform

---

## 11. Non-Functional Requirements

### Performance
- API response time: < 200ms (p95)
- Frontend load time: < 3s
- Database query optimization with indexing

### Security
- All passwords hashed with bcrypt
- JWT token expiration (configurable)
- Rate limiting on authentication endpoints
- Verified email for account creation (future)
- HTTPS only in production
- SQL injection prevention (Prisma ORM)
- CORS configured properly

### Scalability
- Horizontal scaling via Vercel/containerization
- Database connection pooling
- Caching strategy for pitch feeds (future: Redis)
- CDN for static assets
- Cloudinary for image/document storage

### Reliability
- Database backups (automated)
- Error logging & monitoring (future: Sentry)
- Health check endpoints
- Graceful error handling

---

## 12. Constraints & Assumptions

### Constraints
- PostgreSQL as primary database (locked)
- Vercel deployment for frontend
- Cloudinary for file storage
- pnpm as package manager
- React 19+ for frontend

### Assumptions
- Users have valid email addresses
- Users will verify their identity documents
- Investors have genuine capital availability
- Platform hosts on AWS/Vercel infrastructure
- Regulatory compliance handled separately (future consideration for KYC)

---

## 13. Roadmap

### Phase 1 (Current)
- Complete API implementations
- Finish frontend pages
- Testing & bug fixes
- Beta launch with 100 users

### Phase 2 (Q2)
- Payment integration (Stripe)
- Advanced search & filtering
- Email notifications
- User verification automation

### Phase 3 (Q3)
- Real-time messaging (WebSockets)
- Analytics dashboard
- Due diligence tools
- Mobile app (beta)

### Phase 4 (Q4+)
- AI-powered recommendations
- Secondary market (deal trading)
- Institutional features
- Global expansion

---

## 14. Appendix

### API Response Format
```json
{
  "data": { /* Response payload */ },
  "success": true,
  "message": "Optional message"
}
```

### Error Handling
- 400: Bad Request (validation error)
- 401: Unauthorized (invalid credentials)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 429: Too Many Requests (rate limited)
- 500: Internal Server Error

### Environment Variables Required
**Frontend:**
- `VITE_PUBLIC_BASE_URL` - API base URL

**Backend:**
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret
- `CLOUDINARY_NAME` - Cloudinary account
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary secret
- `MAIL_HOST`, `MAIL_USER`, `MAIL_PASSWORD` - Email config
- `NODE_ENV` - Environment (development/production)

---

**Document Version:** 1.0  
**Last Updated:** January 21, 2026  
**Status:** Active Development  
**Owner:** Product Team
