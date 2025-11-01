import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth-helper';

export default async function Home() {
  const session = await getServerSession();

  if (session) {
    redirect('/dashboard');
  }

  redirect('/login');
}
