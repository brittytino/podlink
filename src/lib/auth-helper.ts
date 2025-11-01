import { auth } from '@/lib/auth';

export async function getServerSession() {
  return await auth();
}

