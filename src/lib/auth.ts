import type { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';
import NextAuth from 'next-auth';

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<any> {
        try {
          if (!credentials?.username || !credentials?.password) {
            return null;
          }

          const username = String(credentials.username).toLowerCase().trim();
          const password = String(credentials.password).trim();

          // Retry database query with exponential backoff
          let user = null;
          let retries = 3;
          let delay = 500;

          while (retries > 0 && !user) {
            try {
              user = await prisma.user.findUnique({
                where: { username },
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
            console.log(`User not found or no password: ${username}`);
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            password,
            String(user.password)
          );

          if (!isPasswordValid) {
            console.log(`Invalid password for user: ${username}`);
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
          // Create new user from Google OAuth
          const username = user.email!.split('@')[0] + Math.floor(Math.random() * 1000);
          
          await prisma.user.create({
            data: {
              email: user.email!,
              username,
              fullName: user.name || 'User',
              avatarUrl: user.image,
              timezone: 'UTC',
              availabilityHours: { start: '09:00', end: '22:00' },
              goalType: 'BUILD_HABIT',
              goalDescription: '',
              onboardingComplete: false,
            },
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
        }
      }

      if (trigger === 'update' && session) {
        token.onboardingComplete = session.onboardingComplete;
        token.podId = session.podId;
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.onboardingComplete = token.onboardingComplete as boolean;
        session.user.podId = token.podId as string | null;
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
