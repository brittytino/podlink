import type { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import prisma from './prisma';
import NextAuth from 'next-auth';

export const authConfig: NextAuthConfig = {
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

          const isPasswordValid = await bcrypt.compare(
            password,
            String(user.password)
          );

          if (!isPasswordValid) {
            console.log(`Invalid password for user: ${identifier}`);
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.fullName,
            image: user.avatarUrl,
            username: user.username,
            onboardingComplete: user.onboardingComplete,
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
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (!existingUser) {
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
          
          const { generateAnonymousName } = await import('@/lib/gemini');
          const displayName = await generateAnonymousName(existingNames);
          const baseUsername = displayName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
          
          // Ensure username is unique
          let username = baseUsername;
          let counter = 1;
          while (existingUsernames.includes(username)) {
            username = `${baseUsername}_${counter}`;
            counter++;
          }
          
          await prisma.user.create({
            data: {
              email: user.email!,
              username,
              fullName: displayName,
              displayName,
              avatarUrl: user.image,
              timezone: 'UTC',
              availabilityHours: { start: '09:00', end: '22:00' },
              // Don't set goal values - let onboarding handle this
              onboardingComplete: false,
            } as any,
          });
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.username = dbUser.username;
          token.onboardingComplete = dbUser.onboardingComplete;
          token.podId = dbUser.podId;
          token.avatarUrl = dbUser.avatarUrl;
        }
      }

      if (trigger === 'update' && session) {
        token.onboardingComplete = session.onboardingComplete;
        token.podId = session.podId;
        if (session.avatarUrl !== undefined) {
          token.avatarUrl = session.avatarUrl;
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
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig;

// Create auth instance that can be used in middleware and route handlers
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
