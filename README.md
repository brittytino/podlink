<div align="center">

# PodLink - Mental Health & Accountability Platform

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.18-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

**Connect. Support. Grow together.** Small accountability pods with real-time chat, streaks, crisis tools, and AI guidance.

</div>

---

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Database](#database)
- [Deployment](#deployment)
- [Ownership & Attribution](#ownership--attribution)
- [Contributing](#contributing)
- [Security](#security)
- [License](#license)

## Overview

PodLink connects people in small pods (4-6 members) to pursue personal growth goals with structured check-ins, real-time collaboration, and supportive interventions. AI is used for pod matching, safety checks, and supportive messaging while keeping user identity private.

## Features

- Authentication & Identity: Email/password (bcrypt), Google OAuth, NextAuth.js JWT sessions, email verification, protected routes, rate limits, reCAPTCHA v2.
- Pods & Matching: AI-powered matching on goal type, category, timezone, and availability; AI-generated pod names; demo pods auto-filled by bots.
- Chat & Real-Time: Socket.IO messaging with presence, typing indicators, read receipts, reactions, image uploads (Cloudinary), connection status, separators, auto-scroll.
- Streaks & Gamification: Daily check-ins, longest/current streaks, restoration (1 per 30 days), calendars, pod/global leaderboards, badges.
- Crisis Toolkit: One-click alerts to pods, AI companion responses, coping strategies, hotline directory, alert resolution tracking.
- Content Safety: AI moderation (OpenRouter) plus keyword patterns; blocks unsafe content before send; auto-deletes after multiple reports.
- AI Integrations: OpenRouter primary (multiple models) with optional Gemini fallback; generates names, pod names, supportive responses, and moderation decisions.

## Architecture

- Frontend: Next.js 16 (App Router, React Server Components), TypeScript, Tailwind, shadcn/ui, Radix primitives.
- Backend: Next.js API routes on Node.js 20, Prisma ORM, PostgreSQL/Neon, NextAuth.js.
- Real-Time: Socket.IO server (ports 3001/3002) for chat, presence, reactions, alerts.
- Infra/Services: Cloudinary for media, OpenRouter/Gemini for AI, reCAPTCHA for abuse protection, Vercel Cron for streak resets.

## Project Structure

```
podlink/
├── prisma/            # Prisma schema, migrations, seed
├── public/            # Static assets
├── scripts/           # Maintenance utilities
├── src/
│   ├── app/           # Next.js routes (auth, public, protected, api)
│   ├── components/    # UI components (auth, dashboard, pod, toolkit, ui)
│   ├── hooks/         # React hooks
│   ├── lib/           # Auth, prisma client, sockets, AI, helpers
│   └── types/         # TypeScript types
└── docs/              # Additional developer docs
```

## Getting Started

### Prerequisites
- Node.js 20+ and npm 9+
- PostgreSQL (or Neon free tier)
- Cloudinary account
- OpenRouter API key (primary AI)
- Optional: Google OAuth credentials, Gemini API key (fallback), reCAPTCHA v2 keys

### Quickstart

```bash
git clone https://github.com/brittytino/podlink.git
cd podlink
npm install
cp .env.example .env

# Configure environment variables
npx prisma db push
npm run db:seed   # optional demo data

npm run dev
# Next.js: http://localhost:3000
# Socket server: http://localhost:3001
```

## Environment Variables

Create `.env` (or `.env.local`). Key entries:
- Database: `DATABASE_URL`, `DIRECT_URL`
- Auth: `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- AI: `OPENROUTER_API`, optional `GEMINI_API_KEY`
- Media: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_URL`
- Abuse protection: `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, `RECAPTCHA_SECRET_KEY`
- Email (if used): SMTP credentials for Nodemailer

See `.env.example` for the full list.

## Scripts

- `npm run dev` - start Next.js and Socket.IO (concurrently)
- `npm run build` - Prisma generate + Next.js build
- `npm start` - production start (Next.js + Socket.IO)
- `npm run lint` - lint the project
- `npm run db:push` - push Prisma schema
- `npm run db:seed` - seed demo data
- `npm run db:studio` - open Prisma Studio

## Database

- Prisma schema: `prisma/schema.prisma`
- Migrations: `prisma/migrations`
- Initialize: `npx prisma db push`
- Seed: `npm run db:seed`
- Use `DIRECT_URL` for migrations if your provider requires a direct connection string.

## Deployment

- Web: Deploy Next.js to Vercel or any Node-compatible host.
- Sockets: Deploy server.mjs to a long-running Node host (Railway, Fly.io, Render, etc.) and point the client env vars to it.
- Cron: Use Vercel Cron or another scheduler for streak resets and housekeeping.
- Configure production secrets via your hosting provider; never commit secrets.

## Ownership & Attribution

- Created and maintained by **Tino Britty J** ([github.com/brittytino](https://github.com/brittytino)).
- Originally built for personal use and released freely to the community; no paid editions.

## Contributing

We welcome contributions! Please read CONTRIBUTING.md, follow the pull request template, and use Conventional Commits.

## Security

See SECURITY.md for vulnerability reporting. Please report privately before public disclosure.

## License

This project is licensed under the MIT License. See LICENSE.
