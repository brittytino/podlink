# PodLink - Accountability Pod Platform

> 🚀 A Next.js accountability platform that connects users in small groups (pods) to help them achieve their goals through peer support and daily check-ins.

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.0-2D3748)](https://www.prisma.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

## � Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

## �🚀 Features

### Core Features
- **🔐 User Authentication**: Google OAuth via Firebase + traditional login/register with secure JWT sessions
- **👥 Accountability Pods**: Smart matching algorithm that creates 4-6 member groups based on goals and preferences
- **📊 Daily Check-ins**: Progress tracking with streak counters and weekly summaries
- **💬 Real-time Chat**: Pod communication powered by Socket.io with typing indicators
- **🆘 Crisis Support**: Emergency alert system and personalized crisis toolkit
- **🏆 Leaderboard**: Pod rankings, individual achievements, and badge system
- **📱 Responsive Design**: Mobile-first design that works seamlessly on all devices
- **🤖 AI Integration**: Gemini AI for generating anonymous names and supportive messages

### User Experience
- Guided onboarding for new users
- Anonymous display names for privacy
- Customizable availability schedules
- Avatar uploads with Cloudinary
- Real-time notifications
- Week progress visualization

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router + Turbopack)
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 3.4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Real-time**: Socket.io Client

### Backend
- **API**: Next.js API Routes (Edge & Node Runtime)
- **ORM**: Prisma 6.18
- **Database**: Neon PostgreSQL (with connection pooling)
- **Authentication**: NextAuth.js v4
- **Real-time Server**: Socket.io Server
- **File Upload**: Cloudinary
- **AI**: Google Gemini API

### DevOps & Tools
- **Package Manager**: npm
- **Linting**: ESLint 9
- **Type Checking**: TypeScript strict mode
- **Deployment**: Vercel (recommended)
- **Version Control**: Git


## 📦 Installation

### Prerequisites
- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **PostgreSQL**: Neon account (free tier available)
- **Firebase**: Google Cloud project for OAuth
- **Cloudinary**: Account for image uploads (optional)
- **Gemini API**: Google AI API key (optional, has fallback)

### Quick Start

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
   
   Create a `.env.local` file in the root directory:
   
   ```bash
   # Database Configuration
   DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
   DIRECT_URL="postgresql://user:password@host/database?sslmode=require"
   
   # NextAuth Configuration
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-generate-with-openssl-rand-base64-32"
   
   # Firebase Configuration (Google OAuth)
   NEXT_PUBLIC_FIREBASE_API_KEY="your-firebase-api-key"
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
   NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789"
   NEXT_PUBLIC_FIREBASE_APP_ID="1:123456789:web:abcdef"
   
   # Cloudinary Configuration (Image Uploads)
   CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
   
   # Socket.io Configuration
   SOCKET_PORT=3001
   NEXT_PUBLIC_SOCKET_URL="http://localhost:3001"
   
   # AI Features (Optional - has fallback)
   GEMINI_API_KEY="your-gemini-api-key"
   GEMINI_MODEL="gemini-2.0-flash-exp"
   ```

4. **Set up the database**
   ```bash
   # Reset database and apply all migrations
   npx prisma migrate reset --force
   
   # Generate Prisma Client
   npx prisma generate
   
   # Optional: Seed database with demo data
   npx prisma db seed
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```
   
   This will start:
   - Next.js server on `http://localhost:3000`
   - Socket.io server on `http://localhost:3001`
   - Socket emit server on `http://localhost:3002`

6. **Open your browser**
   
   Navigate to `http://localhost:3000` and start using PodLink!

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🔧 Configuration

### Firebase Setup (Google OAuth)

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Click "Add project" and follow the setup wizard
   - Enable Google Analytics (optional)

2. **Enable Google Authentication**
   - In Firebase Console, go to "Authentication" → "Sign-in method"
   - Enable "Google" provider
   - Add your domain to authorized domains (e.g., `localhost`, `your-app.vercel.app`)

3. **Get Configuration**
   - Go to Project Settings → General
   - Scroll to "Your apps" section
   - Click the web icon (`</>`) to add a web app
   - Copy the configuration values to your `.env.local`

4. **Configure OAuth Consent Screen**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Select your Firebase project
   - Navigate to "APIs & Services" → "OAuth consent screen"
   - Configure app name, support email, and authorized domains

### Neon Database Setup

1. **Create Neon Account**
   - Sign up at [Neon.tech](https://neon.tech)
   - Create a new project (free tier includes 1 project)

2. **Get Connection Strings**
   - In Neon dashboard, click on your project
   - Go to "Connection Details"
   - Copy the **Pooled connection** string for `DATABASE_URL`
   - Copy the **Direct connection** string for `DIRECT_URL`
   - **Important**: Use pooled connection for better performance on free tier

3. **Configure Database**
   - The database will auto-pause after 5 minutes of inactivity (free tier)
   - First query may take 2-5 seconds to wake up the database
   - The app handles this automatically with retry logic

### Cloudinary Setup (Image Uploads)

1. **Create Cloudinary Account**
   - Sign up at [Cloudinary](https://cloudinary.com)
   - Free tier includes 25GB storage

2. **Get API Credentials**
   - Go to Dashboard
   - Copy Cloud Name, API Key, and API Secret
   - Add them to `.env.local`

3. **Configure Upload Preset** (Optional)
   - Go to Settings → Upload
   - Create an unsigned upload preset
   - Set folder name to `podlink-avatars`

### Gemini AI Setup (Optional)

1. **Get API Key**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Add it to `.env.local` as `GEMINI_API_KEY`

2. **Note on Fallbacks**
   - If API key is not set or quota is exceeded, the app uses built-in fallback name generation
   - AI features gracefully degrade to static responses
   - The app remains fully functional without Gemini API

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**
   - In Vercel project settings, go to "Environment Variables"
   - Add all variables from your `.env.local`
   - Make sure to add them for all environments (Production, Preview, Development)

4. **Configure Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`
   - Node Version: 18.x

5. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your app
   - Every push to `main` branch will trigger automatic deployment

### Deploy to Other Platforms

#### Railway.app
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

#### Render.com
- Create new Web Service
- Connect GitHub repository
- Set build command: `npm run build`
- Set start command: `npm start`
- Add environment variables

### Environment-Specific Configuration

For production, update these environment variables:

```bash
NEXTAUTH_URL="https://your-domain.com"
NEXT_PUBLIC_SOCKET_URL="https://your-domain.com"
```

## 🎯 Core Functionality

### Authentication Flow

1. **New User Registration**
   - User clicks "Continue with Google" or uses email/password
   - Firebase/NextAuth handles authentication
   - User data stored in Neon PostgreSQL
   - Anonymous display name generated via Gemini AI (or fallback)
   - User redirected to onboarding

2. **Onboarding Process**
   - Goal selection (quit habit vs. build habit)
   - Goal category and description
   - Gender selection (for pod matching)
   - Availability schedule setup
   - Timezone configuration
   - Pod assignment based on preferences

3. **Existing User Login**
   - Authentication via Google OAuth or credentials
   - Session validation with NextAuth JWT
   - Smart routing based on onboarding status
   - Redirect to dashboard if onboarding complete

4. **Session Management**
   - JWT tokens with secure httpOnly cookies
   - Middleware protects all authenticated routes
   - Auto-refresh on token expiration
   - Logout clears all session data

### Pods System

- **Smart Matching Algorithm**
  - Groups users by goal type (quit/build habit)
  - Matches similar goal categories
  - Considers timezone and availability
  - Balances pod sizes (4-6 members)

- **Pod Features**
  - Real-time chat with Socket.io
  - Member presence indicators
  - Shared streak tracking
  - Crisis alert system
  - Pod-wide achievements

### Daily Check-ins

- Simple yes/no tracking: "Did you stay on track today?"
- Automatic streak calculation
- Weekly progress summaries
- Visual progress indicators
- Achievement badges for milestones

### Crisis Support

- **Emergency Alerts**
  - One-click SOS button
  - Instant notification to pod members
  - AI-generated supportive messages
  - Response tracking

- **Crisis Toolkit**
  - Personalized coping strategies
  - Quick access resources
  - Breathing exercises
  - Emergency contacts

## 🏗️ Project Structure

```
podlink/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts                # Database seed data
│   └── migrations/            # Migration history
├── public/                    # Static assets
├── scripts/                   # Utility scripts
├── src/
│   ├── app/
│   │   ├── (auth)/           # Authentication pages
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (protected)/      # Protected routes
│   │   │   ├── dashboard/
│   │   │   ├── onboarding/
│   │   │   ├── pod/
│   │   │   ├── profile/
│   │   │   ├── leaderboard/
│   │   │   └── crisis-toolkit/
│   │   ├── api/              # API routes
│   │   │   ├── auth/         # NextAuth handlers
│   │   │   ├── pods/         # Pod operations
│   │   │   ├── check-ins/    # Check-in tracking
│   │   │   ├── alerts/       # Crisis alerts
│   │   │   └── profile/      # User profile
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Landing page
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   ├── ui/               # shadcn/ui components
│   │   ├── auth/             # Auth components
│   │   ├── dashboard/        # Dashboard widgets
│   │   ├── pod/              # Pod chat & features
│   │   ├── profile/          # Profile management
│   │   ├── leaderboard/      # Rankings display
│   │   ├── toolkit/          # Crisis toolkit
│   │   ├── layout/           # Navigation components
│   │   └── onboarding/       # Onboarding steps
│   ├── hooks/
│   │   ├── useAuth.ts        # Authentication hook
│   │   ├── useSocket.ts      # Socket.io hook
│   │   ├── usePodMessages.ts # Pod chat hook
│   │   └── use-toast.ts      # Toast notifications
│   ├── lib/
│   │   ├── auth.ts           # NextAuth config
│   │   ├── prisma.ts         # Prisma client
│   │   ├── firebase.ts       # Firebase config
│   │   ├── gemini.ts         # Gemini AI utils
│   │   ├── socket.ts         # Socket.io server
│   │   ├── socket-emit.ts    # Socket emit server
│   │   ├── cloudinary.ts     # Image upload
│   │   ├── pod-matching.ts   # Pod assignment logic
│   │   └── utils.ts          # Helper functions
│   ├── types/
│   │   ├── index.ts          # Shared types
│   │   ├── socket.ts         # Socket event types
│   │   └── next-auth.d.ts    # NextAuth type extensions
│   ├── middleware.ts         # Route protection
│   └── styles/               # Additional styles
├── server.mjs                # Socket.io server
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
└── README.md
```

## 🔍 Troubleshooting

### Database Connection Issues

#### Problem: `password authentication failed for user 'neondb_owner'`

**Solution:**

1. **Get Fresh Connection String**
   - Go to [Neon Console](https://console.neon.tech)
   - Select your project
   - Copy the **pooled** connection string (ends with `-pooler`)

2. **Update `.env.local`**
   ```bash
   DATABASE_URL="postgresql://user:password@host-pooler.region.aws.neon.tech/database?sslmode=require"
   ```

3. **Restart Server**
   ```bash
   # Stop current server (Ctrl+C)
   rm -rf .next  # Clear cache
   npm run dev   # Restart
   ```

#### Problem: Database schema out of sync

**Solution:**

```bash
# Reset database and reapply migrations
npx prisma migrate reset --force

# Generate Prisma Client
npx prisma generate

# Restart server
npm run dev
```

### Build Errors

#### Problem: TypeScript compilation errors

**Solution:**

```bash
# Check for type errors
npm run build

# Common fixes:
# 1. Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# 2. Clear Next.js cache
rm -rf .next

# 3. Regenerate Prisma Client
npx prisma generate
```

#### Problem: Missing environment variables

**Solution:**

- Ensure `.env.local` exists in project root
- Check all required variables are set
- Use `.env.example` as reference
- Restart dev server after changes

### Authentication Issues

#### Problem: Google Sign-In popup blocked

**Solution:**
- The app automatically falls back to redirect mode
- Clear browser cache and cookies
- Check Firebase authorized domains include your domain
- Ensure popup blockers are disabled

#### Problem: Session not persisting

**Solution:**

```bash
# Check NEXTAUTH_SECRET is set
echo $NEXTAUTH_SECRET

# Generate new secret if needed
openssl rand -base64 32

# Add to .env.local
NEXTAUTH_SECRET="your-new-secret"
```

### Socket.io Connection Issues

#### Problem: Real-time chat not working

**Solution:**

1. **Check Socket Server is Running**
   ```bash
   # Should see: "🔌 Socket.io server running on port 3001"
   npm run dev
   ```

2. **Update Socket URL**
   ```bash
   # In .env.local
   NEXT_PUBLIC_SOCKET_URL="http://localhost:3001"
   ```

3. **Check Firewall/Network**
   - Ensure port 3001 is not blocked
   - Check browser console for connection errors

### Gemini API Issues

#### Problem: API quota exceeded (429 error)

**Solution:**
- This is normal for free tier
- App automatically uses fallback name generation
- No action needed - the app works perfectly without Gemini
- Optional: Upgrade to paid Gemini API tier for higher limits

### Performance Issues

#### Problem: Slow database queries (Neon free tier)

**Solution:**
- Free tier databases auto-pause after 5 minutes
- First query takes 2-5 seconds to wake up
- This is normal and handled by auto-retry logic
- Consider upgrading to Neon Pro for always-on database

## 🧪 Testing

### Run Tests
```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

### Manual Testing Checklist

- [ ] User registration with email/password
- [ ] Google OAuth login
- [ ] Onboarding flow completion
- [ ] Pod assignment
- [ ] Daily check-in submission
- [ ] Real-time chat messaging
- [ ] Crisis alert creation
- [ ] Profile updates
- [ ] Avatar upload
- [ ] Leaderboard display

## 📚 API Documentation

### Authentication Endpoints

```typescript
POST /api/auth/register
Body: { email: string, password: string }
Response: { user: { id: string, email: string } }

GET /api/auth/session
Response: { user: User | null }
```

### Pod Endpoints

```typescript
GET /api/pods/members
Response: { members: User[] }

POST /api/pods/messages
Body: { message: string, podId: string }
Response: { message: PodMessage }

GET /api/pods/assign
Response: { pod: Pod }
```

### Check-in Endpoints

```typescript
POST /api/check-ins/create
Body: { stayedOnTrack: boolean }
Response: { checkIn: CheckIn, streak: number }

GET /api/check-ins/history
Query: { days?: number }
Response: { checkIns: CheckIn[] }
```

### Profile Endpoints

```typescript
GET /api/profile
Response: { user: User }

PUT /api/profile/update
Body: Partial<User>
Response: { user: User }

POST /api/profile/upload-avatar
Body: FormData (multipart/form-data)
Response: { avatarUrl: string }
```

## 🤝 Contributing

We welcome contributions from the community! Whether you're fixing bugs, adding features, or improving documentation, your help is appreciated.

### How to Contribute

1. **Fork the Repository**
   - Click the "Fork" button at the top right of this repository
   - Clone your fork locally:
     ```bash
     git clone https://github.com/YOUR_USERNAME/podlink.git
     cd podlink
     ```

2. **Create a Branch**
   ```bash
   git checkout -b feature/your-amazing-feature
   # or
   git checkout -b fix/bug-description
   ```

3. **Make Your Changes**
   - Follow the existing code style
   - Write clear, commented code
   - Add tests if applicable
   - Update documentation as needed

4. **Test Your Changes**
   ```bash
   # Run type checking
   npm run build
   
   # Test locally
   npm run dev
   
   # Run tests (if available)
   npm test
   ```

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   # or
   git commit -m "fix: resolve bug description"
   ```
   
   **Commit Message Guidelines:**
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `style:` Code style changes (formatting, etc.)
   - `refactor:` Code refactoring
   - `test:` Adding tests
   - `chore:` Maintenance tasks

6. **Push to Your Fork**
   ```bash
   git push origin feature/your-amazing-feature
   ```

7. **Open a Pull Request**
   - Go to the original repository
   - Click "Pull Requests" → "New Pull Request"
   - Select your fork and branch
   - Fill out the PR template with:
     - Clear description of changes
     - Screenshots (if UI changes)
     - Related issue numbers
     - Testing steps

### Contribution Ideas

Here are some areas where we'd love your help:

#### 🐛 Bug Fixes
- Fix reported issues
- Improve error handling
- Enhance performance
- Fix accessibility issues

#### ✨ New Features
- Video chat support for pods
- Mobile app (React Native)
- Advanced analytics dashboard
- Gamification features
- Integration with habit tracking apps
- Multi-language support (i18n)
- Dark mode improvements
- Custom pod themes

#### 📖 Documentation
- Improve setup instructions
- Add API documentation
- Create video tutorials
- Write blog posts
- Translate documentation

#### 🧪 Testing
- Write unit tests
- Add E2E tests
- Improve test coverage
- Test on different devices

#### 🎨 Design
- Improve UI/UX
- Create new illustrations
- Design marketing materials
- Optimize for accessibility

### Development Guidelines

#### Code Style
- Use TypeScript for type safety
- Follow existing naming conventions
- Use functional components in React
- Prefer composition over inheritance
- Write self-documenting code

#### Best Practices
- Keep components small and focused
- Use custom hooks for shared logic
- Handle loading and error states
- Optimize for performance
- Ensure mobile responsiveness
- Write accessible HTML

#### Database Changes
- Create migrations for schema changes
- Test migrations on fresh database
- Don't modify existing migrations
- Update seed data if needed

#### Component Structure
```typescript
// Good component example
interface Props {
  userId: string;
  onUpdate: () => void;
}

export function UserProfile({ userId, onUpdate }: Props) {
  // hooks
  const [isLoading, setIsLoading] = useState(false);
  
  // handlers
  const handleUpdate = async () => {
    // implementation
  };
  
  // render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### Getting Help

- 💬 **Discussions**: Ask questions in [GitHub Discussions](https://github.com/brittytino/podlink/discussions)
- 🐛 **Issues**: Report bugs in [GitHub Issues](https://github.com/brittytino/podlink/issues)
- 📧 **Email**: Contact brittytino@example.com for private inquiries
- 📖 **Docs**: Check this README and code comments

### Code of Conduct

We are committed to providing a welcoming and inclusive experience for everyone. We expect all contributors to:

- Be respectful and considerate
- Welcome newcomers and help them get started
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

Unacceptable behavior includes:
- Harassment or discrimination
- Trolling or insulting comments
- Public or private harassment
- Publishing others' private information
- Other unethical or unprofessional conduct

### Recognition

Contributors will be:
- Listed in the Contributors section
- Mentioned in release notes
- Given credit in relevant documentation

Thank you for helping make PodLink better! 🎉

## 📄 License

This project is licensed under the **MIT License** - see below for details:

```
MIT License

Copyright (c) 2025 PodLink

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🆘 Support & Community

### Get Help

- 📖 **Documentation**: Read this README thoroughly
- 💬 **GitHub Discussions**: [Ask questions and share ideas](https://github.com/brittytino/podlink/discussions)
- 🐛 **Bug Reports**: [Open an issue](https://github.com/brittytino/podlink/issues/new?template=bug_report.md)
- ✨ **Feature Requests**: [Suggest new features](https://github.com/brittytino/podlink/issues/new?template=feature_request.md)
- 📧 **Email**: brittytino@example.com

### Stay Updated

- ⭐ **Star this repo** to show support and stay notified
- 👀 **Watch releases** for update notifications
- 🐦 **Follow on Twitter**: [@brittytino](https://twitter.com/brittytino)
- 💼 **LinkedIn**: [Connect with us](https://linkedin.com/in/brittytino)

## 🙏 Acknowledgments

Built with these amazing technologies:
- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Socket.io](https://socket.io/) - Real-time communication
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Neon](https://neon.tech/) - Serverless PostgreSQL
- [Vercel](https://vercel.com/) - Deployment platform
- [Cloudinary](https://cloudinary.com/) - Image management
- [Google Gemini](https://ai.google.dev/) - AI capabilities

Special thanks to all contributors who help make PodLink better!

---

<div align="center">

**Built with ❤️ for accountability and personal growth**

[Website](https://podlink.vercel.app) • [Report Bug](https://github.com/brittytino/podlink/issues) • [Request Feature](https://github.com/brittytino/podlink/issues)

Made by [brittytino](https://github.com/brittytino) and [contributors](https://github.com/brittytino/podlink/graphs/contributors)

⭐ **Star this repo** if you find it helpful!

</div>