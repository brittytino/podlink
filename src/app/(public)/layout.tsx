import { Suspense } from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import PageLoader from '@/components/ui/PageLoader';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PublicLayout>
      <Suspense fallback={<PageLoader />}>
        {children}
      </Suspense>
    </PublicLayout>
  );
}
