# Development Guide

This document describes how to work on PodLink locally, run quality checks, and understand the system architecture.

## Local Setup

1. Install prerequisites:
   - Node.js 20+
   - npm 9+
   - PostgreSQL (or Neon)
   - Git

2. Clone and install:
   ```bash
   git clone https://github.com/brittytino/podlink.git
   cd podlink
   npm install
   ```

3. Environment variables:
   ```bash
   cp .env.example .env
   # Fill in DATABASE_URL, OPENROUTER_API, CLOUDINARY_*, NEXTAUTH_*, RECAPTCHA_*, etc.
   ```

4. Database setup:
   ```bash
   npx prisma db push
   npm run db:seed   # optional
   ```

5. Run locally:
   ```bash
   npm run dev
   # Next.js at http://localhost:3000
   # Socket server at http://localhost:3001
   ```

## Project Layout

- `src/app` — Next.js App Router pages and API routes
- `src/components` — UI components (auth, dashboard, pod, toolkit, etc.)
- `src/lib` — Utilities (auth, Prisma client, sockets, AI integrations)
- `src/hooks` — React hooks
- `prisma` — Schema and migrations
- `scripts` — Maintenance utilities

## Quality Checks

- Lint: `npm run lint`
- Type check/build: `npm run build`
- Format: use the repo's ESLint + Prettier settings (run lint before PRs)

## Database Notes

- ORM: Prisma; primary database: PostgreSQL (Neon friendly)
- Migrations live in `prisma/migrations`
- Seed data: `npm run db:seed`

## Real-Time Stack

- Socket.IO server runs alongside Next.js (ports 3001/3002)
- Presence, typing indicators, read receipts, reactions, and crisis alerts use sockets

## AI Integrations

- Primary provider: OpenRouter (multiple models supported)
- Fallback provider: Google Gemini (optional)
- Content moderation and generated names/responses depend on these keys

## Deployment Hints

- Next.js can run on Vercel; the socket server must be hosted separately (e.g., Fly.io, Railway, or a Node host) and pointed to by the client.
- Configure environment variables in the hosting provider; do not commit secrets.

## Contribution Flow

- Branch from `main`; use `feature/*` or `fix/*` prefixes
- Follow Conventional Commits (e.g., `feat(chat): add reactions`)
- Open PRs with the provided template and ensure lint/build pass

For more, see the main README and CONTRIBUTING guides.
