import { Navbar } from '@/components/layout/Navbar';
import { MobileNav } from '@/components/layout/MobileNav';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="container flex-1 py-4 sm:py-6 pb-20 sm:pb-6 max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
