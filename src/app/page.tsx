import { getServerSession } from '@/lib/auth-helper';
import { redirect } from 'next/navigation';
import LandingPage from '@/components/LandingPage';

export default async function Home() {
  const session = await getServerSession();

  // If user is already logged in, redirect to dashboard
  if (session) {
    redirect('/dashboard');
  }

  // If not logged in, show the landing page
  return <LandingPage />;
}
