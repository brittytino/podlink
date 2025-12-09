import type { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import prisma from './prisma';
import NextAuth from 'next-auth';

// Log environment info for debugging
if (process.env.NODE_ENV === 'production') {
  console.log('🔐 Auth Config - Production Mode');
  console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL || 'Not set');
  console.log('VERCEL_URL:', process.env.VERCEL_URL || 'Not set');
  console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? 'Set ✓' : 'Missing ✗');
  console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'Set ✓' : 'Missing ✗');
}

export const authConfig: NextAuthConfig = {
  basePath: '/api/auth',
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<any> {
        try {
          // Support both email and username for backward compatibility
          const creds = credentials as { email?: string; username?: string; password?: string };
          const emailOrUsername = creds?.email || creds?.username;
          if (!emailOrUsername || !creds?.password) {
            return null;
          }

          const identifier = String(emailOrUsername).toLowerCase().trim();
          const password = String(creds.password).trim();

          // Retry database query with exponential backoff
          let user = null;
          let retries = 3;
          let delay = 500;

          while (retries > 0 && !user) {
            try {
              // Try email first, then username for backward compatibility
              user = await prisma.user.findFirst({
                where: {
                  OR: [
                    { email: identifier },
                    { username: identifier },
                  ],
                },
              });
              break;
            } catch (error: any) {
              retries--;
              if (retries > 0 && (error?.code === 'P1001' || error?.message?.includes('connect'))) {
                console.log(`Database connection error, retrying... (${retries} left)`);
                await new Promise((resolve) => setTimeout(resolve, delay));
                delay *= 2;
              } else {
                console.error('Auth database error:', error);
                return null;
              }
            }
          }

          if (!user || !user.password) {
            console.log(`User not found or no password: ${identifier}`);
            return null;
          }

          // Check if email is verified
          if (!user.emailVerified) {
            console.log(`Email not verified for user: ${identifier}`);
            throw new Error('EMAIL_NOT_VERIFIED');
          }

          const isPasswordValid = await bcrypt.compare(
            password,
            String(user.password)
          );

          if (!isPasswordValid) {
            console.log(`Invalid password for user: ${identifier}`);
            return null;
          }

          console.log(`✅ User authenticated successfully: ${identifier}`);

          return {
            id: user.id,
            email: user.email,
            name: user.fullName,
            image: user.avatarUrl,
            username: user.username,
            onboardingComplete: user.onboardingComplete,
            timezone: user.timezone,
          };
        } catch (error: any) {
          console.error('Auth error:', error);
          
          // Don't expose database errors to client
          if (error?.code === 'P1001') {
            console.error('Database connection failed during authentication');
          }
          
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code"
        }
      },
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('🔐 SignIn callback triggered');
      console.log('Provider:', account?.provider);
      console.log('User email:', user.email);
      
      // Handle Google OAuth sign-in
      if (account?.provider === 'google') {
        try {
          console.log('Processing Google OAuth login for:', user.email);
          
          let existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (!existingUser) {
            console.log('✨ Creating new user from Google OAuth:', user.email);
            // Generate anonymous display name for Google OAuth users
            const existingUsers = await prisma.user.findMany({
              select: { displayName: true, username: true },
              where: { displayName: { not: null } },
            });
            const existingNames = existingUsers
              .map((u) => u.displayName)
              .filter((n): n is string => n !== null);
            const existingUsernames = existingUsers
              .map((u) => u.username)
              .filter((n): n is string => n !== null);
            
            const { generateAnonymousName } = await import('@/lib/openrouter');
            const displayName = await generateAnonymousName(existingNames);
            const baseUsername = displayName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
            
            // Ensure username is unique
            let username = baseUsername;
            let counter = 1;
            while (existingUsernames.includes(username)) {
              username = `${baseUsername}_${counter}`;
              counter++;
            }
            
            existingUser = await prisma.user.create({
              data: {
                email: user.email!,
                username,
                fullName: user.name || displayName,
                displayName,
                avatarUrl: user.image,
                timezone: 'UTC',
                availabilityHours: { start: '09:00', end: '22:00' },
                onboardingComplete: false,
                emailVerified: true, // Auto-verify Google OAuth users
              } as any,
            });
            console.log('✅ New user created successfully:', existingUser.email);
          } else {
            console.log('✅ Existing user found for Google OAuth:', existingUser.email);
            // Update avatar if it changed
            if (user.image && existingUser.avatarUrl !== user.image) {
              await prisma.user.update({
                where: { id: existingUser.id },
                data: { avatarUrl: user.image },
              });
              console.log('Avatar updated for user:', existingUser.email);
            }
          }
          console.log('✅ Google OAuth signIn callback completed successfully');
        } catch (error) {
          console.error('❌ Error in Google OAuth signIn callback:', error);
          return false;
        }
      }
      
      console.log('✅ SignIn callback returning true');
      return true;
    },
    async jwt({ token, user, trigger, session, account }) {
      // Initial sign in
      if (user) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (dbUser) {
            token.id = dbUser.id;
            token.username = dbUser.username;
            token.onboardingComplete = dbUser.onboardingComplete;
            token.podId = dbUser.podId;
            token.avatarUrl = dbUser.avatarUrl;
            token.timezone = dbUser.timezone;
            console.log('JWT token populated for user:', dbUser.email);
          }
        } catch (error) {
          console.error('Error fetching user in jwt callback:', error);
        }
      }

      // When session is updated (e.g., after profile update), fetch latest user data
      if (trigger === 'update') {
        try {
          if (session?.user?.email) {
            const dbUser = await prisma.user.findUnique({
              where: { email: session.user.email },
            });
            
            if (dbUser) {
              token.onboardingComplete = dbUser.onboardingComplete;
              token.podId = dbUser.podId;
              token.avatarUrl = dbUser.avatarUrl;
              token.username = dbUser.username;
              token.timezone = dbUser.timezone;
            }
          }
          
          // Also accept direct session updates
          if (session?.onboardingComplete !== undefined) {
            token.onboardingComplete = session.onboardingComplete;
          }
          if (session?.podId !== undefined) {
            token.podId = session.podId;
          }
          if (session?.avatarUrl !== undefined) {
            token.avatarUrl = session.avatarUrl;
          }
          if (session?.timezone !== undefined) {
            token.timezone = session.timezone;
          }
        } catch (error) {
          console.error('Error updating token:', error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.onboardingComplete = token.onboardingComplete as boolean;
        session.user.podId = token.podId as string | null;
        session.user.image = (token.avatarUrl as string) || '';
        if (token.timezone) {
          session.user.timezone = token.timezone as string;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
    signOut: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  debug: false,
  useSecureCookies: process.env.NODE_ENV === 'production',
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' 
        ? '__Secure-next-auth.session-token'
        : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NODE_ENV === 'production' ? undefined : 'localhost',
      },
    },
    callbackUrl: {
      name: process.env.NODE_ENV === 'production'
        ? '__Secure-next-auth.callback-url'
        : 'next-auth.callback-url',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    csrfToken: {
      name: process.env.NODE_ENV === 'production'
        ? '__Host-next-auth.csrf-token'
        : 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
} satisfies NextAuthConfig;

// Create auth instance that can be used in middleware and route handlers
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
