# 🔗 PodLink - Accountability Pod Platform

> A modern web application connecting users in small accountability groups (pods) to achieve their goals through peer support, daily check-ins, and real-time communication.

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.18-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?style=for-the-badge&logo=postgresql)](https://neon.tech/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.8-010101?style=for-the-badge&logo=socket.io)](https://socket.io/)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Getting Started](#-getting-started)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Database Setup](#-database-setup)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**PodLink** is a comprehensive accountability platform designed to help users achieve their personal and professional goals through:

- **Smart Pod Matching**: AI-powered algorithm groups users (4-6 members) based on similar goals, timezones, and preferences
- **Daily Accountability**: Track progress with daily check-ins and maintain streak counters
- **Real-time Communication**: WebSocket-powered chat with emoji reactions, image sharing, and typing indicators
- **Crisis Support System**: Emergency alert system with automated responses and personalized crisis toolkit
- **Gamification**: Leaderboards, achievement badges, and streak restoration mechanics
- **Privacy-First Design**: Anonymous display names and secure data handling

### Target Users
- Individuals seeking accountability for habit formation
- People working on quitting addictions (smoking, alcohol, etc.)
- Professionals building new skills or routines
- Anyone needing peer support for personal growth

---

## ✨ Key Features

### 🔐 Authentication & Onboarding
- **Multi-provider Authentication**
  - Email/Password with bcrypt encryption
  - Google OAuth integration
  - JWT session management via NextAuth.js
- **Guided Onboarding Flow**
  - Goal type selection (Quit Habit / Build Habit)
  - Goal category and description
  - Availability schedule setup
  - Anonymous display name generation (AI-powered)
  - Avatar upload with Cloudinary

### 👥 Accountability Pods
- **Smart Matching Algorithm**
  - Groups users based on goal type and category
  - Timezone consideration for optimal interaction
  - 4-6 member pods for effective peer support
  - AI bots fill incomplete pods for demo accounts
- **Pod Features**
  - Real-time member list with current streaks
  - Pod-level achievement tracking
  - Total pod streak calculation

### 📊 Daily Check-ins
- **Progress Tracking**
  - Daily check-in system with timezone awareness
  - Streak counter (consecutive days)
  - Weekly progress visualization
  - Check-in history API
- **Streak Management**
  - Automatic streak breaking for missed days
  - Streak restoration system (1 per month)
  - Last successful day tracking
  - Timezone-aware date handling

### 💬 Real-time Chat
- **WhatsApp-Style Messaging**
  - Real-time message delivery via Socket.io
  - Emoji picker integration (keyboard + UI picker)
  - Image attachment with Cloudinary upload
  - Image preview before sending (max 5MB)
  - Message reactions with emoji
  - Typing indicators
  - Read receipts (double checkmark)
- **Message Features**
  - Crisis response tagging
  - Message reporting system
  - Automatic message deletion after 3 reports
  - Date separators in chat
  - Automatic scroll to latest
  - Click image to view full-size

### 🆘 Crisis Support
- **Emergency Alert System**
  - One-click crisis alert to pod members
  - Immediate notification broadcast
  - Optional custom message
  - Automated responses from offline members (>6 hours)
  - Alert resolution tracking
- **Crisis Toolkit**
  - Personalized coping strategies
  - Drag-and-drop reordering
  - CRUD operations for toolkit items
  - Quick access during emergencies

### 🏆 Gamification
- **Leaderboard System**
  - Top pods by total streak
  - Top individuals by current streak
  - Real-time ranking updates
  - Achievement badge display
- **Badge System**
  - 7-day streak badge
  - 30-day streak badge
  - Instant Responder (crisis support)
  - Pod Champion (most active member)

### 🤖 AI Integration
- **Google Gemini AI**
  - Anonymous display name generation
  - Crisis response messages
  - Supportive pod messages
  - AI bot members in demo pods

### 📱 User Interface
- **Responsive Design**
  - Mobile-first approach
  - Tablet and desktop optimized
  - Touch-friendly interactions
  - Dark mode support
- **Modern UI/UX**
  - shadcn/ui component library
  - Tailwind CSS styling
  - Smooth animations with Framer Motion
  - WhatsApp-inspired chat design
  - Accessible components (ARIA compliant)

---

## 🛠️ Technology Stack

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.0.5 | React framework with App Router & Turbopack |
| **React** | 19.2.0 | UI library for component-based architecture |
| **TypeScript** | 5.0+ | Type-safe JavaScript for better DX |
| **Tailwind CSS** | 4.x | Utility-first CSS framework |
| **shadcn/ui** | Latest | Accessible UI component library |
| **Lucide React** | 0.552.0 | Icon library |
| **Framer Motion** | 12.23.24 | Animation library |
| **Socket.io Client** | 4.8.1 | WebSocket client for real-time features |
| **Emoji Picker React** | 4.16.1 | Emoji selection component |
| **React Hook Form** | 7.66.0 | Form state management |
| **Zod** | 4.1.12 | Schema validation |
| **Recharts** | 2.15.4 | Data visualization |

### Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js API Routes** | 16.0.5 | Serverless API endpoints |
| **Prisma ORM** | 6.18.0 | Type-safe database client |
| **PostgreSQL** | Latest | Primary database (via Neon) |
| **NextAuth.js** | 5.0-beta.30 | Authentication solution |
| **Socket.io Server** | 4.8.1 | WebSocket server |
| **Cloudinary** | 2.8.0 | Image upload and optimization |
| **Google Gemini API** | Latest | AI-powered features |
| **bcryptjs** | 3.0.2 | Password hashing |

### Development Tools

| Tool | Version | Purpose |
|------|---------|---------|
| **ESLint** | 9.x | Code linting |
| **Concurrently** | 9.2.1 | Run multiple processes |
| **tsx** | 4.20.6 | TypeScript execution |
| **Prisma Studio** | Built-in | Database GUI |

---

## 🏗️ System Architecture

### High-Level Architecture

```
┌───────────────────────────────────────────────────────────┐
│                      Client Layer                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Browser │  │  Mobile  │  │  Tablet  │  │ Desktop  │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       └─────────────┼─────────────┼─────────────┘         │
└─────────────────────┼─────────────┼───────────────────────┘
                      │             │
                      ▼             ▼
┌────────────────────────────────────────────────────────────┐
│               Next.js Application (Vercel)                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           App Router (Server Components)             │  │
│  │  ┌────────┐  ┌────────┐  ┌─────────┐  ┌────────┐     │  │
│  │  │  Auth  │  │  Pod   │  │Dashboard│  │ Chat   │     │  │
│  │  │  Pages │  │  Pages │  │  Pages  │  │ Pages  │     │  │
│  │  └────────┘  └────────┘  └─────────┘  └────────┘     │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                API Routes (Serverless)               │  │
│  │  ┌────────┐  ┌────────┐  ┌─────────┐  ┌────────┐     │  │
│  │  │  /auth │  │ /pods  │  │/check-in│  │/alerts │     │  │
│  │  └────────┘  └────────┘  └─────────┘  └────────┘     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────┬───────────────┬──────────────────────┘
                      │               │
                      ▼               ▼
┌─────────────────────────────┐  ┌──────────────────────────┐
│   Socket.io Server (Node)   │  │    Prisma ORM Layer      │
│  ┌────────────────────────┐ │  │  ┌────────────────────┐  │
│  │  WebSocket Connections │ │  │  │  Type-safe Queries │  │
│  │  - Chat Messages       │ │  │  │  - User CRUD       │  │
│  │  - Crisis Alerts       │ │  │  │  - Pod CRUD        │  │
│  │  - Typing Indicators   │ │  │  │  - Message CRUD    │  │
│  │  - Reactions           │ │  │  │  - Check-in CRUD   │  │
│  └────────────────────────┘ │  │  └────────────────────┘  │
└─────────────────────────────┘  └────────────┬─────────────┘
                                              │
                      ┌───────────────────────┼───────────────┐
                      ▼                       ▼               ▼
        ┌──────────────────────┐  ┌──────────────┐  ┌─────────────┐
        │  Neon PostgreSQL     │  │  Cloudinary  │  │ Gemini AI   │
        │  - User Data         │  │  - Avatars   │  │ - AI Names  │
        │  - Pod Data          │  │  - Images    │  │ - Messages  │
        │  - Messages          │  └──────────────┘  └─────────────┘
        │  - Check-ins         │
        │  - Achievements      │
        └──────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

Before installing PodLink, ensure you have:

- **Node.js** (v20.x or higher) - [Download](https://nodejs.org/)
- **npm** (v9.x or higher) - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)
- **PostgreSQL** database (Neon recommended) - [Sign up](https://neon.tech/)
- **Cloudinary** account - [Sign up](https://cloudinary.com/)
- **Google Gemini API** key - [Get API key](https://ai.google.dev/)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/brittytino/podlink.git
cd podlink

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Initialize database
npx prisma migrate dev
npx prisma db seed

# Start development servers
npm run dev
```

Access the application at `http://localhost:3000`

---

## 📦 Installation

### Step 1: Clone Repository

```bash
git clone https://github.com/brittytino/podlink.git
cd podlink
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Verify Installation

```bash
# Check Node.js version
node --version  # Should be v20.x or higher

# Check npm version
npm --version   # Should be v9.x or higher

# Verify Prisma installation
npx prisma --version
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Database Configuration
DATABASE_URL="postgresql://user:password@host-pooler:5432/database"
DIRECT_URL="postgresql://user:password@host:5432/database"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-32-character-secret-key"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Google Gemini AI
GOOGLE_AI_API_KEY="your-gemini-api-key"

# Application Settings
NODE_ENV="development"
PORT=3000
SOCKET_PORT=3001
```

### Generating Secrets

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32
```

---

## 🗄️ Database Setup

### Initialize Database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database with demo data
npx prisma db seed
```

### Database Management

```bash
# Open Prisma Studio (Database GUI)
npx prisma studio

# Test database connection
npm run db:test

# Push schema without migration
npx prisma db push
```

---

## 🏃 Running the Application

### Development Mode

```bash
# Start both Next.js and Socket.io servers
npm run dev

# Or start them separately
npm run dev:next    # Next.js on port 3000
npm run dev:socket  # Socket.io on port 3001
```

### Production Build

```bash
# Build the application
npm run build

# Start production servers
npm start
```

---

## 📁 Project Structure

```
podlink/
├── prisma/
│   ├── schema.prisma              # Database schema
│   ├── seed.ts                    # Database seed script
│   └── migrations/                # Migration files
├── public/
│   ├── file.svg
│   ├── globe.svg
│   └── badge-icons/               # Achievement badge images
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── (auth)/               # Auth routes
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (protected)/          # Protected routes
│   │   │   ├── dashboard/
│   │   │   ├── pod/              # Pod chat page
│   │   │   ├── leaderboard/
│   │   │   ├── profile/
│   │   │   ├── crisis-toolkit/
│   │   │   └── onboarding/
│   │   ├── api/                  # API routes
│   │   │   ├── auth/             # Authentication
│   │   │   ├── pods/             # Pod management
│   │   │   ├── check-ins/        # Daily check-ins
│   │   │   ├── alerts/           # Crisis alerts
│   │   │   └── leaderboard/
│   │   └── page.tsx              # Landing page
│   ├── components/
│   │   ├── dashboard/            # Dashboard components
│   │   ├── pod/                  # Pod/Chat components
│   │   │   ├── ChatWindow.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   └── AlertNotification.tsx
│   │   ├── leaderboard/
│   │   ├── onboarding/
│   │   ├── toolkit/
│   │   └── ui/                   # shadcn/ui components
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useSocket.ts
│   │   └── usePodMessages.ts
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── prisma.ts
│   │   ├── socket.ts
│   │   ├── cloudinary.ts
│   │   ├── gemini.ts
│   │   ├── pod-matching.ts
│   │   └── streak-manager.ts
│   └── types/
│       ├── index.ts
│       └── socket.ts
├── server.mjs                     # Socket.io server
├── package.json                   # Dependencies
└── README.md                      # This file
```

---

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "SecurePass123!",
  "fullName": "John Doe"
}
```

### Pod Endpoints

#### GET `/api/pods/members?podId={podId}`
Get all members of a pod.

#### POST `/api/pods/messages`
Send a message to the pod.

**Request:**
```json
{
  "podId": "uuid",
  "userId": "uuid",
  "messageText": "Hello team!",
  "imageUrl": "https://cloudinary.com/...",
  "isCrisisResponse": false
}
```

#### POST `/api/pods/messages/upload-image`
Upload image to Cloudinary (max 5MB).

**Request:** `multipart/form-data` with `image` file

**Response:**
```json
{
  "success": true,
  "imageUrl": "https://res.cloudinary.com/..."
}
```

### Check-in Endpoints

#### POST `/api/check-ins/create`
Record daily check-in.

#### GET `/api/check-ins/history?userId={userId}&days={days}`
Get check-in history.

### Crisis Alert Endpoints

#### POST `/api/alerts/create`
Create crisis alert.

#### POST `/api/alerts/resolve`
Resolve a crisis alert.

---

## 🧪 Testing

### Manual Testing Checklist

- [x] User registration and login
- [x] Google OAuth authentication
- [x] Onboarding flow completion
- [x] Daily check-in functionality
- [x] Real-time chat messaging
- [x] Emoji picker (keyboard + UI)
- [x] Image upload and display
- [x] Crisis alert system
- [x] Auto-responses from offline members
- [x] Leaderboard updates
- [x] Streak restoration

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
