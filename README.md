# PodLink - Accountability Pod Platform

A Next.js accountability platform that connects users in small groups (pods) to help them achieve their goals through peer support and daily check-ins.

## 🚀 Features

- **User Authentication**: Google OAuth via Firebase + traditional login/register
- **Accountability Pods**: 4-6 member groups for goal tracking
- **Daily Check-ins**: Progress tracking with streak counters
- **Real-time Chat**: Pod communication with Socket.io
- **Crisis Support**: Emergency toolkit and alert system
- **Leaderboard**: Pod rankings and individual achievements
- **Responsive Design**: Mobile-first, works on all devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, Prisma ORM
- **Database**: Neon PostgreSQL
- **Authentication**: NextAuth.js + Firebase Auth
- **Real-time**: Socket.io
- **File Upload**: Cloudinary
- **UI Components**: shadcn/ui

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/brittytino/podlink.git
   cd podlink
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create `.env` file with:
   ```bash
   # Database
   DATABASE_URL="your-neon-postgresql-url"
   DIRECT_URL="your-neon-direct-url"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"

   # Firebase (Google OAuth)
   NEXT_PUBLIC_FIREBASE_API_KEY="your-firebase-api-key"
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
   NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.firebasestorage.app"
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
   NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"

   # Cloudinary (Image uploads)
   CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"

   # Socket.io
   SOCKET_PORT=3001
   NEXT_PUBLIC_SOCKET_URL="http://localhost:3001"

   # AI Features
   GEMINI_API_KEY="your-gemini-api-key"
   ```

4. **Set up database**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

## 🌐 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add all environment variables in Vercel dashboard
3. Deploy automatically on every push to main branch

### Manual Deployment
```bash
npm run build
npm start
```

## 🔧 Key Configuration

### Firebase Setup
1. Create Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Google Authentication
3. Add your domain to authorized domains
4. Copy config values to `.env`

### Neon Database Setup
1. Create account at [neon.tech](https://neon.tech)
2. Create new PostgreSQL database
3. Copy connection strings to `.env`
4. Run `npx prisma db push` to create tables

### Google OAuth Setup
- Popup authentication with automatic fallback to redirect
- Mobile-optimized authentication flow
- Comprehensive error handling for popup blockers

## 📱 Authentication Features

- **Google Sign-in**: Firebase OAuth with intelligent popup/redirect fallback
- **Smart User Routing**: New users → onboarding, existing users → dashboard  
- **Session Management**: NextAuth.js with JWT tokens and user status tracking
- **User Profiles**: Avatar uploads, timezone settings, goal tracking
- **Guided Onboarding**: Step-by-step setup for new users with pod matching
- **Error Handling**: Comprehensive popup blocking detection and troubleshooting UI

### Authentication Flow
1. User clicks "Continue with Google" on login page
2. Firebase popup authentication (automatically falls back to redirect if popup is blocked)
3. User information verified and stored in Neon database
4. Smart routing based on user status:
   - **New users**: Redirected to `/onboarding` to complete profile setup
   - **Existing users**: Redirected to `/dashboard` to continue their journey
5. JWT token created with user ID, onboarding status, and pod assignment
6. Middleware protects all routes and ensures proper user flow

## 🎯 Core Functionality

### Pods System
- Automatic pod assignment based on preferences
- 4-6 member groups for optimal accountability
- Pod chat with real-time messaging
- Shared goals and progress tracking

### Daily Check-ins
- Simple yes/no progress tracking
- Streak counters for motivation
- Weekly progress summaries
- Achievement badges

### Crisis Support
- Emergency alert system
- Crisis intervention toolkit
- Peer support notifications
- Resource library

## 🏗️ Project Structure

```
src/
├── app/                 # Next.js app router
│   ├── (auth)/         # Authentication pages
│   ├── (protected)/    # Dashboard and main app
│   └── api/            # API endpoints
├── components/         # React components
│   ├── ui/             # shadcn/ui components
│   ├── dashboard/      # Dashboard specific
│   ├── pod/            # Pod functionality
│   └── auth/           # Authentication
├── lib/                # Utility functions
│   ├── auth.ts         # NextAuth configuration
│   ├── firebase.ts     # Firebase setup
│   ├── prisma.ts       # Database client
│   └── utils.ts        # Helper functions
└── types/              # TypeScript definitions
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email brittytino@example.com or create an issue on GitHub.

---

**Built with ❤️ for accountability and personal growth**