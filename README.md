# 🔗 PodLink - Mental Health & Accountability Platform

> A modern web application that connects individuals in small accountability groups (pods) to achieve personal growth goals through peer support, daily check-ins, crisis intervention, and real-time communication.

[![Next.js](https://img.shields.io/badge/Next.js-16.0.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.18-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?style=for-the-badge&logo=postgresql)](https://neon.tech/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.8-010101?style=for-the-badge&logo=socket.io)](https://socket.io/)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-AI-purple?style=for-the-badge)](https://openrouter.ai/)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Core Features](#-core-features)
- [Technology Stack](#-technology-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Setup](#-environment-setup)
- [Database Setup](#-database-setup)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [AI Integration](#-ai-integration)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Overview

**PodLink** is a mental health and accountability platform that helps individuals achieve their personal goals through structured peer support and AI-assisted guidance.

### What Makes PodLink Unique?

- **AI-Powered Pod Matching**: Smart algorithm groups users (4-6 members) based on goal similarity, timezone, and compatibility
- **Real-Time Presence**: Live online/offline status tracking for all pod members
- **Crisis Support System**: Immediate help system with AI companion and peer notifications
- **Dynamic AI Generation**: All names, responses, and content generated via OpenRouter API (no static content)
- **Privacy-First**: Anonymous display names protect user identity
- **Streak Gamification**: Daily check-ins with streak counters and restoration system

### Target Audience

- Individuals overcoming addictions (smoking, alcohol, social media, etc.)
- People building healthy habits (exercise, meditation, healthy eating)
- Professionals seeking accountability for personal development
- Anyone needing structured peer support for mental health goals

## ✨ Core Features

### 🔐 Authentication & Security
- **Multi-Provider Authentication**
  - Email/Password with bcrypt hashing
  - Google OAuth 2.0 integration
  - NextAuth.js JWT session management
  - Protected route middleware
- **Onboarding Workflow**
  - Goal type selection (Quit Habit / Build Habit)
  - Goal category with AI-generated suggestions
  - Availability schedule configuration
  - **AI-Generated Display Names** (OpenRouter API - dynamic, no static fallbacks)
  - Avatar upload via Cloudinary (2MB limit)

### 👥 Smart Pod System
- **AI-Powered Matching Algorithm**
  - Groups 4-6 users based on:
    - Goal type and category similarity
    - Timezone compatibility (±3 hours)
    - Availability schedule overlap
  - **Dynamic Pod Names** (OpenRouter API - category-specific generation)
  - AI bots auto-fill demo/incomplete pods
- **Pod Features**
  - **Real-Time Online/Offline Status** (Socket.IO presence tracking)
  - Live member count and online indicators (green/gray dots)
  - Current streak display for each member
  - Total pod streak calculation
  - Connection status badge (Connecting/Connected/Disconnected)

### 💬 Real-Time Chat System
- **WhatsApp-Style Messaging**
  - Socket.IO bidirectional communication (ports 3001, 3002)
  - Live message delivery with instant updates
  - Emoji picker (emoji-picker-react)
  - Image sharing (Cloudinary upload, max 5MB)
  - Full-size image preview modal
  - Message reactions with emoji
  - Typing indicators (3-user limit display)
  - Read receipts (✓✓ checkmarks)
- **Content Moderation**
  - **AI-Powered Moderation** (OpenRouter API + fallback patterns)
  - Blocks offensive content pre-send (400 error response)
  - Detects: racial slurs, profanity, hate speech, harassment
  - 20+ keyword patterns with critical/high severity flags
  - Auto-deletes messages after 3 user reports
  - Temperature 0.1 for strict AI moderation
- **Chat Features**
  - Date separators for organization
  - Auto-scroll to latest message
  - Crisis response tagging
  - Message reporting system
  - Image preview before upload

### 📊 Streak & Check-In System
- **Daily Accountability Tracking**
  - Timezone-aware check-in system
  - Consecutive day streak counter
  - Weekly progress visualization
  - Check-in history API
- **Streak Management**
  - Auto-breaks streaks for missed days (midnight reset)
  - **Streak Restoration** (1 per month, restores to previous streak)
  - Last successful day tracking
  - Grace period handling

### 🆘 Crisis Support Toolkit
- **Emergency Alert System**
  - One-click crisis alert broadcasts to pod
  - Real-time notification to all online members
  - Optional custom help message
  - **AI-Generated Automated Responses** (OpenRouter API for offline members >6 hours)
  - Alert resolution tracking
  - Crisis state management
- **Personal Crisis Toolkit**
  - Customizable coping strategies
  - Drag-and-drop reordering (react-beautiful-dnd)
  - CRUD operations for toolkit items
  - Quick access during emergencies
  - Shareable with pod members

### 🏆 Gamification & Leaderboards
- **Ranking System**
  - Top pods by total combined streak
  - Top individuals by current streak
  - Real-time ranking updates
  - Weekly/monthly/all-time filters
- **Achievement Badges**
  - 7-Day Streak badge
  - 30-Day Streak badge
  - Instant Responder (crisis support <5 min)
  - Pod Champion (most active member)

### 🤖 AI Integration (OpenRouter API)
- **Fully Dynamic AI Generation**
  - **Primary**: OpenRouter API (4 free models)
    - `google/gemini-2.0-flash-exp:free`
    - `meta-llama/llama-3.2-3b-instruct:free`
    - `microsoft/phi-3-mini-128k-instruct:free`
    - `qwen/qwen-2-7b-instruct:free`
  - **Fallback**: Google Gemini 2.0 Flash (50/50 hybrid for chat)
  - **Use Cases**:
    - Anonymous display name generation (temperature 0.9)
    - Pod name generation (category-specific context)
    - Crisis response messages (user context: streak, goal, crisis state)
    - Content moderation (temperature 0.1, strict prompts)
    - Supportive pod messages (AI bot members)
- **No Static Content**: All names, responses, and suggestions dynamically generated

### 📱 Modern UI/UX
- **Responsive Design**
  - Mobile-first approach (375px+)
  - Tablet optimized (768px+)
  - Desktop support (1024px+)
  - Touch-friendly interactions
- **Component Library**
  - shadcn/ui for accessible components
  - Tailwind CSS utility-first styling
  - Framer Motion animations
  - Lucide React icons
  - Custom theme system
---

## 🛠️ Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.0.5 | React framework with App Router, Server Components, Turbopack |
| **React** | 19.2.0 | UI library for component-based architecture |
| **TypeScript** | 5.0+ | Type-safe JavaScript for reliability |
| **Tailwind CSS** | 4.x | Utility-first CSS framework |
| **shadcn/ui** | Latest | Accessible component library (Radix UI primitives) |
| **Lucide React** | 0.552.0 | Icon library |
| **Framer Motion** | 12.23.24 | Smooth animations |
| **Socket.io Client** | 4.8.1 | Real-time WebSocket client |
| **Emoji Picker React** | 4.16.1 | Emoji selection interface |
| **React Hook Form** | 7.66.0 | Form state management |
| **Zod** | 4.1.12 | Schema validation library |
| **Recharts** | 2.15.4 | Data visualization charts |
| **React Beautiful DnD** | Latest | Drag-and-drop toolkit items |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js API Routes** | 16.0.5 | Serverless API endpoints |
| **Prisma ORM** | 6.18.0 | Type-safe database client with auto-reconnect |
| **PostgreSQL** | Latest | Primary database (Neon serverless) |
| **NextAuth.js** | 5.0-beta.30 | Authentication with JWT sessions |
| **Socket.io Server** | 4.8.1 | WebSocket server (ports 3001, 3002) |
| **Node.js** | 20+ | Server runtime environment |
| **Cloudinary** | 2.8.0 | Image CDN and optimization |
| **Google Gemini API** | 2.0 Flash | Fallback AI (50/50 with OpenRouter) |
| **OpenRouter API** | Latest | Primary AI generation (4 free models) |
| **bcryptjs** | 3.0.2 | Password hashing and verification |

### Development Tools

| Tool | Version | Purpose |
|------|---------|---------|
| **ESLint** | 9.x | Code linting and quality |
| **Concurrently** | 9.2.1 | Run multiple dev processes |
| **tsx** | 4.20.6 | TypeScript execution for scripts |
| **Prisma Studio** | Built-in | Visual database editor |

---

## 📋 Prerequisites

Before installation, ensure you have:

### Required Software
- **Node.js** v20.x or higher ([Download](https://nodejs.org/))
- **npm** v9.x or higher (included with Node.js)
- **Git** ([Download](https://git-scm.com/))

### Required Accounts & API Keys
1. **Neon PostgreSQL** - Serverless PostgreSQL database
   - Sign up: [https://neon.tech/](https://neon.tech/)
   - Create a new project and get connection string

2. **Cloudinary** - Image hosting and CDN
   - Sign up: [https://cloudinary.com/](https://cloudinary.com/)
   - Get: Cloud Name, API Key, API Secret

3. **Google Gemini API** - AI fallback (optional but recommended)
   - Get API key: [https://ai.google.dev/](https://ai.google.dev/)

4. **OpenRouter API** - Primary AI generation
   - Sign up: [https://openrouter.ai/](https://openrouter.ai/)
   - Get API key (free tier available with 4 models)

5. **Google OAuth** (optional for social login)
   - Console: [https://console.cloud.google.com/](https://console.cloud.google.com/)
   - Create OAuth 2.0 credentials

### System Requirements
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 500MB free space
- **Network**: Stable internet for real-time features
- **Ports**: 3000 (Next.js), 3001 (Socket.IO), 3002 (Socket.IO Emit Server)

---

## 🔧 Installation

### 1. Clone Repository

```bash
git clone https://github.com/brittytino/podlink.git
cd podlink
```

### 2. Install Dependencies

```bash
npm install
```

This installs all required packages from `package.json` (frontend + backend dependencies).

---

## 🌐 Environment Setup

### 1. Create Environment File

```bash
cp .env.example .env
```

### 2. Configure Environment Variables

Edit `.env` with your credentials:

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
DIRECT_URL="postgresql://user:password@host/database?sslmode=require"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secure-random-string-here"
# Generate with: openssl rand -base64 32

# Google OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Cloudinary (Required for image uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
NEXT_PUBLIC_CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# AI APIs
GEMINI_API_KEY="your-gemini-api-key"
OPENROUTER_API_KEY="your-openrouter-api-key"

# Application URLs
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_SOCKET_URL="http://localhost:3001"

# Socket.IO Ports (default: 3001, 3002)
SOCKET_PORT=3001
EMIT_SERVER_PORT=3002
```

### 3. Generate NextAuth Secret

```bash
openssl rand -base64 32
```

Copy output to `NEXTAUTH_SECRET` in `.env`

---

## 🗄️ Database Setup

### 1. Verify Database Connection

Ensure your Neon PostgreSQL database is active and `DATABASE_URL` is correct in `.env`.

### 2. Push Prisma Schema

```bash
npx prisma db push
```

This creates all tables, relations, and indexes in your database.

### 3. Verify Schema

```bash
npx prisma studio
```

Opens Prisma Studio at `http://localhost:5555` to view database tables.

### 4. Seed Database (Optional)

```bash
npx prisma db seed
```

Populates database with:
- Demo user accounts
- Sample pods
- AI bot members
- Initial check-ins

---

## ▶️ Running the Application

### Development Mode

```bash
npm run dev
```

This starts **3 concurrent processes**:
1. **Next.js Dev Server** - `http://localhost:3000` (Turbopack enabled)
2. **Socket.IO Main Server** - Port `3001` (real-time chat, presence)
3. **Socket.IO Emit Server** - Port `3002` (event broadcasting)

### Production Build

```bash
# Build optimized production bundle
npm run build

# Start production server
npm start
```

### Individual Process Commands

```bash
# Next.js only
npm run next-dev

# Socket.IO servers only
node server.mjs
```

### Prisma Commands

```bash
# Generate Prisma Client (after schema changes)
npx prisma generate

# Database migrations
npx prisma migrate dev

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio
```

## 📁 Project Structure

```
podlink/
├── prisma/                          # Database schema and migrations
│   ├── schema.prisma               # Prisma data models (User, Pod, Message, etc.)
│   ├── seed.ts                     # Database seeding script
│   └── migrations/                 # Migration history
│
├── public/                          # Static assets
│   ├── badge-icons/                # Achievement badge images
│   └── *.svg                       # Public icons
│
├── scripts/                         # Utility scripts
│   ├── check-streak-data.ts        # Streak data validation
│   ├── fix-streak-data.ts          # Streak repair utility
│   ├── reset-ai-streaks.ts         # Reset AI bot streaks
│   └── test-streak-system.ts       # Streak system testing
│
├── server.mjs                       # Socket.IO server (ports 3001, 3002)
│
├── src/
│   ├── middleware.ts               # NextAuth + protected route middleware
│   │
│   ├── app/                         # Next.js App Router
│   │   ├── layout.tsx              # Root layout with SessionProvider
│   │   ├── page.tsx                # Landing page
│   │   │
│   │   ├── (auth)/                 # Authentication routes (guest only)
│   │   │   ├── login/              # Login page
│   │   │   └── register/           # Registration page
│   │   │
│   │   ├── (protected)/            # Protected routes (auth required)
│   │   │   ├── dashboard/          # User dashboard with stats
│   │   │   ├── pod/                # Pod chat interface
│   │   │   ├── profile/            # User profile management
│   │   │   ├── leaderboard/        # Global rankings
│   │   │   ├── onboarding/         # Multi-step onboarding
│   │   │   └── crisis-toolkit/     # Personal crisis toolkit
│   │   │
│   │   ├── (public)/               # Public marketing pages
│   │   │   ├── about/              # About page
│   │   │   ├── features/           # Features showcase
│   │   │   ├── privacy/            # Privacy policy
│   │   │   ├── terms/              # Terms of service
│   │   │   └── ...                 # Other public pages
│   │   │
│   │   └── api/                     # API Routes (serverless functions)
│   │       ├── auth/               # NextAuth endpoints
│   │       ├── pods/               # Pod CRUD operations
│   │       ├── check-ins/          # Check-in system
│   │       ├── streak/             # Streak management
│   │       ├── notifications/      # Crisis alerts
│   │       ├── leaderboard/        # Rankings API
│   │       ├── profile/            # User profile updates
│   │       ├── help/               # Crisis response (OpenRouter AI)
│   │       ├── toolkit/            # Crisis toolkit CRUD
│   │       ├── socket/             # Socket.IO connection
│   │       └── cron/               # Scheduled jobs
│   │
│   ├── components/                  # React components
│   │   ├── LandingPage.tsx         # Marketing landing page
│   │   ├── SessionProvider.tsx     # NextAuth context provider
│   │   ├── auth/                   # Login/Register forms
│   │   ├── dashboard/              # Dashboard widgets
│   │   ├── pod/                    # Chat components
│   │   ├── profile/                # Profile components
│   │   ├── leaderboard/            # Ranking tables
│   │   ├── onboarding/             # Onboarding steps
│   │   ├── toolkit/                # Crisis toolkit components
│   │   ├── landing/                # Landing page sections
│   │   └── ui/                     # shadcn/ui primitives
│   │
│   ├── hooks/                       # Custom React hooks
│   │   ├── useAuth.ts              # Authentication hook
│   │   ├── useSocket.ts            # Socket.IO hook
│   │   ├── usePodMessages.ts       # Chat messages hook
│   │   ├── use-toast.ts            # Toast notifications
│   │   └── use-mobile.ts           # Mobile detection
│   │
│   ├── lib/                         # Core libraries and utilities
│   │   ├── prisma.ts               # Prisma client with auto-reconnect
│   │   ├── auth.ts                 # NextAuth configuration
│   │   ├── socket.ts               # Socket.IO client setup
│   │   ├── socket-emit.ts          # Socket.IO emit server
│   │   ├── openrouter.ts           # OpenRouter API integration
│   │   ├── gemini.ts               # Google Gemini API (fallback)
│   │   ├── cloudinary.ts           # Image upload handler
│   │   ├── content-moderation.ts   # AI + keyword moderation
│   │   ├── streak-manager.ts       # Streak calculation logic
│   │   ├── streak-reset.ts         # Streak reset handler
│   │   ├── pod-matching.ts         # Pod assignment algorithm
│   │   ├── pod-assignment.ts       # User-to-pod matching
│   │   ├── pod-names.ts            # Dynamic pod name generation (OpenRouter)
│   │   ├── ai-bot-names.ts         # AI bot name list
│   │   ├── ai-responses.ts         # AI response templates
│   │   ├── goal-categories.ts      # Goal category definitions
│   │   └── utils.ts                # Shared utility functions
│   │
│   ├── types/                       # TypeScript type definitions
│   │   ├── index.ts                # Shared types (User, Pod, Message, etc.)
│   │   ├── next-auth.d.ts          # NextAuth type extensions
│   │   └── socket.ts               # Socket.IO event types
│   │
│   └── styles/                      # Global styles
│
├── .env                             # Environment variables (git-ignored)
├── package.json                     # Dependencies and scripts
├── tsconfig.json                    # TypeScript configuration
├── next.config.js                   # Next.js configuration
├── tailwind.config.ts               # Tailwind CSS configuration
├── components.json                  # shadcn/ui configuration
├── prisma/schema.prisma             # Database schema
└── README.md                        # This file
```

### Key Files Explained

| File | Purpose |
|------|---------|
| `server.mjs` | Standalone Socket.IO server for real-time features (chat, presence, alerts) |
| `src/middleware.ts` | Protects routes, redirects unauthenticated users |
| `src/lib/prisma.ts` | Prisma client with `ensureConnection()` auto-reconnect logic |
| `src/lib/openrouter.ts` | OpenRouter API wrapper for AI generation (primary) |
| `src/lib/gemini.ts` | Google Gemini API wrapper (fallback, 50/50 for chat) |
| `src/lib/content-moderation.ts` | AI + keyword-based content filtering |
| `src/lib/pod-names.ts` | Dynamic pod name generation via OpenRouter |
| `src/app/api/help/route.ts` | Crisis response API with AI-generated messages |
| `src/app/(protected)/pod/page.tsx` | Main pod chat interface with online/offline status |
| `prisma/schema.prisma` | Complete database schema (22 models) |

---
npm run build

# Start production servers
## 🔌 API Documentation

### Core API Endpoints

#### Authentication (`/api/auth/*`)

```typescript
// Register new user
POST /api/auth/register
Body: { email, username, password, fullName }
Response: { success: true, message: "User created" }

// NextAuth endpoints (handled by NextAuth.js)
POST /api/auth/callback/credentials  // Login
GET  /api/auth/callback/google       // Google OAuth
GET  /api/auth/session               // Get current session
POST /api/auth/signout               // Logout
```

#### Pods (`/api/pods/*`)

```typescript
// Get pod members with online status
GET /api/pods/members?podId={uuid}
Response: { members: User[], onlineUsers: string[] }

// Send message to pod (with content moderation)
POST /api/pods/messages
Body: {
  podId: string
  userId: string
  messageText: string
  imageUrl?: string
  isCrisisResponse?: boolean
}
Response: { success: true, message: Message }
// 400 Error if content violates moderation rules

// Upload image (Cloudinary)
POST /api/pods/messages/upload-image
Body: FormData with 'image' field (max 5MB)
Response: { success: true, imageUrl: string }

// React to message
POST /api/pods/messages/react
Body: { messageId: string, userId: string, emoji: string }

// Report message (auto-deletes after 3 reports)
POST /api/pods/messages/report
Body: { messageId: string, userId: string, reason: string }
```

#### Check-Ins (`/api/check-ins/*`)

```typescript
// Create daily check-in (timezone-aware)
POST /api/check-ins/create
Body: { userId: string, timezone: string }
Response: { success: true, currentStreak: number }

// Get check-in history
GET /api/check-ins/history?userId={uuid}&days={number}
Response: { checkIns: CheckIn[], currentStreak: number }

// Get check-in stats
GET /api/check-ins/stats?userId={uuid}
Response: {
  totalCheckIns: number
  currentStreak: number
  longestStreak: number
  weeklyProgress: number[]
}
```

#### Streaks (`/api/streak/*`)

```typescript
// Restore streak (1 per month)
POST /api/streak/restore
Body: { userId: string }
Response: { success: true, restoredStreak: number }
// 400 Error if already used this month

// Check restoration eligibility
GET /api/streak/can-restore?userId={uuid}
Response: { canRestore: boolean, lastUsed: Date | null }
```

#### Crisis Support (`/api/alerts/*`, `/api/help/*`)

```typescript
// Create crisis alert (broadcasts to pod)
POST /api/alerts/create
Body: {
  userId: string
  podId: string
  customMessage?: string
}
Response: { success: true, alert: CrisisAlert }
// Triggers Socket.IO 'crisis-alert' event

// Resolve crisis alert
POST /api/alerts/resolve
Body: { alertId: string }
Response: { success: true }

// Get AI crisis response (OpenRouter API)
POST /api/help
Body: {
  userId: string
  message?: string
  context?: { goal: string, streak: number, inCrisis: boolean }
}
Response: { success: true, response: string }
// AI-generated supportive message based on user context
```

#### Crisis Toolkit (`/api/toolkit/*`)

```typescript
// Get user's toolkit items
GET /api/toolkit/items?userId={uuid}
Response: { items: ToolkitItem[] }

// Create toolkit item
POST /api/toolkit/items
Body: { userId: string, title: string, description: string, order: number }

// Update toolkit item order (drag-drop)
PUT /api/toolkit/items/reorder
Body: { items: { id: string, order: number }[] }

// Delete toolkit item
DELETE /api/toolkit/items/{itemId}
```

#### Leaderboard (`/api/leaderboard/*`)

```typescript
// Get top pods by total streak
GET /api/leaderboard/pods?limit={number}
Response: {
  pods: { id: string, name: string, totalStreak: number, members: number }[]
}

// Get top users by current streak
GET /api/leaderboard/users?limit={number}
Response: {
  users: { id: string, displayName: string, currentStreak: number, avatar: string }[]
}
```

#### Profile (`/api/profile/*`)

```typescript
// Update user profile
PUT /api/profile/update
Body: {
  userId: string
  displayName?: string
  avatar?: string
  timezone?: string
  availability?: string[]
}
Response: { success: true, user: User }

// Upload avatar (Cloudinary)
POST /api/profile/upload-avatar
Body: FormData with 'avatar' field (max 2MB)
Response: { success: true, avatarUrl: string }
```

#### Onboarding (`/api/onboarding/*`)

```typescript
// Complete onboarding (assigns pod)
POST /api/onboarding/complete
Body: {
  userId: string
  goalType: "QUIT_HABIT" | "BUILD_HABIT"
  goalCategory: string
  goalDescription: string
  availability: string[]
  timezone: string
}
Response: {
  success: true
  pod: Pod
  displayName: string  // AI-generated via OpenRouter
}
```

---

### Socket.IO Events

#### Client → Server Events

```typescript
// Join pod room
socket.emit('join-pod', { podId, userId, displayName })

// Send typing indicator
socket.emit('typing', { podId, userId, displayName })

// Stop typing indicator
socket.emit('stop-typing', { podId, userId })

// Send message (also triggers HTTP POST for persistence)
socket.emit('send-message', { podId, userId, messageText, imageUrl })

// Send crisis alert
socket.emit('crisis-alert', { podId, userId, message })

// Disconnect
socket.emit('disconnect')
```

#### Server → Client Events

```typescript
// Receive new message
socket.on('receive-message', (message: Message) => { ... })

// User is typing (max 3 users shown)
socket.on('typing', ({ userId, displayName }) => { ... })

## 🤖 AI Integration

### OpenRouter API (Primary)

PodLink uses **OpenRouter** as the primary AI provider for dynamic content generation.

#### Available Free Models

1. **Google Gemini 2.0 Flash Exp** (`google/gemini-2.0-flash-exp:free`)
   - Best for: General responses, creative content
   - Speed: Very fast
   - Context: 1M tokens

2. **Meta Llama 3.2 3B Instruct** (`meta-llama/llama-3.2-3b-instruct:free`)
   - Best for: Concise responses
   - Speed: Fast
   - Context: 128k tokens

3. **Microsoft Phi-3 Mini** (`microsoft/phi-3-mini-128k-instruct:free`)
   - Best for: Quick responses
   - Speed: Very fast
   - Context: 128k tokens

4. **Qwen 2 7B Instruct** (`qwen/qwen-2-7b-instruct:free`)
   - Best for: Multilingual support
   - Speed: Fast
   - Context: 32k tokens

#### Use Cases

```typescript
// 1. Display Name Generation (OpenRouter)
// Temperature: 0.9 (creative)
// Model: Randomly selected from 4 free models
const displayName = await generateDisplayName(goalCategory, goalDescription)
// Example: "Phoenix Rising" for quit smoking goal

// 2. Pod Name Generation (OpenRouter)
// Temperature: 0.9 (creative)
// Context: Goal category-specific prompts
const podName = await generatePodName(goalCategory, goalType)
// Example: "The Mindful Warriors" for meditation pod

// 3. Crisis Response (OpenRouter)
// Temperature: 0.7 (balanced)
// Context: User's streak, goal, crisis state
const response = await generateAIResponse(userContext)
// Example: "I see you're struggling, [Name]. Your 15-day streak shows real strength..."

// 4. Content Moderation (OpenRouter)
// Temperature: 0.1 (strict, deterministic)
// Detects: Racial slurs, profanity, hate speech, harassment
const isOffensive = await moderateContent(messageText)
// Blocks message before sending if offensive
```

### Google Gemini API (Fallback)

Gemini 2.0 Flash is used as a **50/50 hybrid** for chat messages alongside OpenRouter.

```typescript
// Chat AI Bot Responses (50% Gemini, 50% OpenRouter)
// Provides diversity in AI-generated pod messages
// Temperature: 0.7
const botMessage = Math.random() > 0.5
  ? await generateGeminiResponse(context)
  : await generateOpenRouterResponse(context)
```

### AI Generation Configuration

#### Environment Variables

```env
# Required for all AI features
OPENROUTER_API_KEY="sk-or-v1-..."

# Optional fallback (recommended)
GEMINI_API_KEY="AIzaSy..."
```

#### Model Selection Logic

```typescript
// src/lib/openrouter.ts
const OPENROUTER_MODELS = [
  'google/gemini-2.0-flash-exp:free',
  'meta-llama/llama-3.2-3b-instruct:free',
  'microsoft/phi-3-mini-128k-instruct:free',
  'qwen/qwen-2-7b-instruct:free'
]

// Random model selection for load balancing
const model = OPENROUTER_MODELS[Math.floor(Math.random() * OPENROUTER_MODELS.length)]
```

### Content Moderation Flow

```
User sends message
       ↓
AI Analysis (OpenRouter, temp 0.1)
       ↓
Keyword Pattern Check (20+ patterns)
       ↓
   Offensive?
    /     \
  Yes      No
   ↓        ↓
400 Error  Save to DB → Socket.IO Broadcast
```

**Moderation Rules:**
- Racial slurs (critical severity) → Instant block
- Profanity (high severity) → Instant block
- Hate speech → Instant block
- Harassment → Instant block
- Message reports (3 reports) → Auto-delete

---

## 🚀 Deployment

### Vercel Deployment (Recommended)

#### 1. Prerequisites
- Vercel account ([Sign up](https://vercel.com/))
- GitHub repository with PodLink code
- All environment variables ready

#### 2. Deploy Steps

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

#### 3. Configure Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

```
DATABASE_URL
DIRECT_URL
NEXTAUTH_URL (https://your-domain.vercel.app)
NEXTAUTH_SECRET
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
NEXT_PUBLIC_CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
GEMINI_API_KEY
OPENROUTER_API_KEY
NEXT_PUBLIC_APP_URL (https://your-domain.vercel.app)
NEXT_PUBLIC_SOCKET_URL (https://socket-server.your-domain.com)
```

#### 4. Deploy Socket.IO Server Separately

**Option A: Railway** ([railway.app](https://railway.app/))
```bash
# railway.json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "node server.mjs"
  }
}
```

**Option B: Render** ([render.com](https://render.com/))
```yaml
# render.yaml
services:
  - type: web
    name: podlink-socket
    env: node
    buildCommand: npm install
    startCommand: node server.mjs
    envVars:
      - key: PORT
        value: 3001
```

**Option C: Fly.io** ([fly.io](https://fly.io/))
```bash
fly launch
fly deploy
```

#### 5. Update CORS in `server.mjs`

```javascript
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:3000',
      'https://your-domain.vercel.app'  // Add production domain
    ],
    methods: ['GET', 'POST'],
    credentials: true
  }
})
```

### Environment-Specific Configuration

#### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use connection pooling for Neon database
- [ ] Enable Cloudinary auto-optimization
- [ ] Configure proper CORS origins
- [ ] Set up error tracking (Sentry, LogRocket)
- [ ] Enable rate limiting on API routes
- [ ] Configure CSP headers in `next.config.js`
- [ ] Set up SSL certificates (auto with Vercel)
- [ ] Configure domain DNS records
- [ ] Test all Socket.IO events in production

#### Database Migration for Production

```bash
# Generate migration
npx prisma migrate dev --name production_init

# Deploy migration to production
npx prisma migrate deploy

# Verify with Prisma Studio
npx prisma studio
```

---

## ⚠️ Troubleshooting

### Common Issues & Solutions

#### 1. Prisma "Engine is not yet connected" Error

**Symptom:** 500 errors on API routes, database queries fail

**Solution:**
```typescript
// Already implemented in src/lib/prisma.ts
const ensureConnection = async () => {
  if (!isConnected) {
    await prisma.$connect()
    isConnected = true
  }
}

// Auto-reconnect with retry logic (3 attempts, progressive delays)
```

**Verification:**
```bash
# Check database connection
npx prisma db pull

# Test connection
curl http://localhost:3000/api/test-db
```

---

#### 2. Socket.IO Connection Failed

**Symptom:** Chat not updating, "Connecting..." status stuck

**Solution:**
```bash
# Kill existing Socket.IO processes
lsof -ti:3001 | xargs kill -9
lsof -ti:3002 | xargs kill -9

# Restart servers
npm run dev
```

**Check ports:**
```bash
# Verify Socket.IO is running
lsof -i :3001
lsof -i :3002

# Test Socket.IO endpoint
curl http://localhost:3001/socket.io/
```

**CORS Issues:**
```javascript
// server.mjs - Verify origin matches
origin: ['http://localhost:3000']  // Must match NEXT_PUBLIC_APP_URL
```

---

#### 3. Content Moderation Not Blocking Messages

**Symptom:** Offensive words bypass moderation, still appear in chat

**Solution:**
- Check `OPENROUTER_API_KEY` is set in `.env`
- Verify keyword patterns in `src/lib/content-moderation.ts`
- Test moderation endpoint:

```bash
curl -X POST http://localhost:3000/api/pods/messages \
  -H "Content-Type: application/json" \
  -d '{"messageText":"test offensive word","podId":"...","userId":"..."}'

# Should return 400 error if offensive
```

**Force re-check:**
```typescript
// src/lib/content-moderation.ts
// Lower AI temperature for stricter moderation
temperature: 0.1  // Already set (very strict)
```

---

#### 4. Online/Offline Status Not Updating

**Symptom:** Users show offline when they're online, or vice versa

**Solution:**
```typescript
// src/app/(protected)/pod/page.tsx
// Verify socket listeners are set up
useEffect(() => {
  socket.on('online-users', (users) => setOnlineUsers(new Set(users)))
  socket.on('user-online', (userId) => setOnlineUsers(prev => new Set([...prev, userId])))
  socket.on('user-offline', (userId) => {
    setOnlineUsers(prev => {
      const updated = new Set(prev)
      updated.delete(userId)
      return updated
    })
  })
}, [])
```

**Check Socket.IO logs:**
```bash
# server.mjs should log:
# "User {userId} joined pod {podId}"
# "Broadcasting online users: [...]"
```

---

#### 5. OpenRouter API Errors

**Symptom:** AI-generated names not working, 500 errors on `/api/help`

**Solution:**
```bash
# Verify API key
echo $OPENROUTER_API_KEY

# Test OpenRouter endpoint
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"google/gemini-2.0-flash-exp:free","messages":[{"role":"user","content":"test"}]}'
```

**Fallback to Gemini:**
```typescript
// src/lib/pod-names.ts
// If OpenRouter fails, uses Gemini automatically
catch (error) {
  console.error('OpenRouter failed, using Gemini:', error)
  return await generateWithGemini(...)
}
```

---

#### 6. Build Errors

**Symptom:** `npm run build` fails with TypeScript errors

**Solution:**
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build

# Check for type errors
npx tsc --noEmit

# Fix common issues
npx prisma generate  # Regenerate Prisma Client
```

**Specific Error Fixes:**
```typescript
// "Cannot find module 'prisma/client'"
npx prisma generate

// "Type 'X' is not assignable to type 'Y'"
// Check src/types/index.ts for type definitions

// "Module not found: Can't resolve 'socket.io-client'"
npm install socket.io-client@4.8.1
```

---

#### 7. Port Already in Use

**Symptom:** `EADDRINUSE: address already in use :::3000`

**Solution:**
```bash
# Find process using port
lsof -ti:3000

# Kill process
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

---

#### 8. Database Connection Timeout (Neon)

**Symptom:** "Connection timed out" or "Too many connections"

**Solution:**
```env
# Use connection pooling
DATABASE_URL="postgresql://user:pass@host-pooler:5432/db?pgbouncer=true"
DIRECT_URL="postgresql://user:pass@host:5432/db"
```

**Neon-specific settings:**
```typescript
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")  // For migrations
}
```

---

#### 9. Image Upload Fails (Cloudinary)

**Symptom:** 500 error on `/api/pods/messages/upload-image`

**Solution:**
```bash
# Verify Cloudinary credentials
curl -X POST https://api.cloudinary.com/v1_1/{CLOUD_NAME}/image/upload \
  -F "file=@test.jpg" \
  -F "api_key={API_KEY}" \
  -F "timestamp={TIMESTAMP}" \
  -F "signature={SIGNATURE}"
```

**Check file size:**
```typescript
// Max 5MB for chat images, 2MB for avatars
if (file.size > 5 * 1024 * 1024) {
  return res.status(400).json({ error: 'File too large' })
}
```

---

#### 10. Streak Not Updating

**Symptom:** Check-in successful but streak stays at 0

**Solution:**
```bash
# Run streak fix script
npx tsx scripts/fix-streak-data.ts

# Check streak data
npx tsx scripts/check-streak-data.ts

# Reset AI bot streaks (if needed)
npx tsx scripts/reset-ai-streaks.ts
```

**Manual verification:**
```bash
# Open Prisma Studio
npx prisma studio

# Check CheckIn table for user
# Verify lastSuccessfulDay matches timezone
```

---

### Getting Help

If issues persist:

1. **Check logs:**
   ```bash
   # Next.js logs
   npm run dev

   # Socket.IO logs
   node server.mjs
   ```

2. **Enable debug mode:**
   ```env
   DEBUG=socket.io*
   NODE_ENV=development
   ```

3. **Consult documentation:**
   - [Next.js Docs](https://nextjs.org/docs)
   - [Prisma Docs](https://www.prisma.io/docs)
   - [Socket.IO Docs](https://socket.io/docs)
   - [OpenRouter API Docs](https://openrouter.ai/docs)

4. **Report bugs:**
   - GitHub Issues: [github.com/brittytino/podlink/issues](https://github.com/brittytino/podlink/issues)
   - Include: Error logs, steps to reproduce, environment details

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details

---

## 👤 Author

**Britty Tino**
- GitHub: [@brittytino](https://github.com/brittytino)
- Project: [PodLink](https://github.com/brittytino/podlink)

---

## 🙏 Acknowledgments

- **Next.js Team** - Amazing React framework
- **Vercel** - Hosting and deployment platform
- **Prisma** - Type-safe ORM
- **Neon** - Serverless PostgreSQL
- **OpenRouter** - Free AI model access
- **Google** - Gemini AI API
- **Cloudinary** - Image CDN
- **shadcn/ui** - Beautiful accessible components
- **Socket.IO** - Real-time communication
- **All contributors** who helped build PodLink

---

<p align="center">
  <strong>Built with ❤️ for mental health and personal growth</strong>
</p>

<p align="center">
  <a href="#-overview">Back to Top ↑</a>
</p>

### Test Database Connection

```bash
npm run db:test
```

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   vercel login
   vercel
   ```

2. **Configure Environment Variables** in Vercel Dashboard

3. **Deploy Socket.io Server** separately (Render/Railway)

4. **Update Socket Connection URL**
   ```env
   NEXT_PUBLIC_SOCKET_URL=https://your-socket-server.onrender.com
   ```

---

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

MIT License - see LICENSE file for details.

---

## 📞 Support & Contact

- 📧 Email: support@podlink.example.com
- 💬 Discord: [Join our community](https://discord.gg/podlink)
- 🐦 Twitter: [@PodLinkApp](https://twitter.com/podlinkapp)

---

## 🙏 Acknowledgements

- **Next.js** - React framework
- **Prisma** - Database ORM
- **Socket.io** - Real-time communication
- **shadcn/ui** - UI components
- **Neon** - Serverless PostgreSQL
- **Cloudinary** - Image management
- **Google Gemini** - AI capabilities

---

<div align="center">

**Made with ❤️ by the PodLink Team**

⭐ Star us on GitHub!

</div>
