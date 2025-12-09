import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image: string;
      username: string;
      onboardingComplete: boolean;
      podId: string | null;
      timezone?: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    image?: string;
    username: string;
    onboardingComplete: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    username: string;
    onboardingComplete: boolean;
    podId: string | null;
    avatarUrl: string | null;
    timezone?: string;
  }
}
