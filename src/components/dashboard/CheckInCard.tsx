'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CheckInCardProps {
  hasCheckedInToday: boolean;
  userId: string;
}

export function CheckInCard({ hasCheckedInToday, userId }: CheckInCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleCheckIn = async (stayedOnTrack: boolean) => {
    setError(null);
    
    startTransition(async () => {
      try {
        const response = await fetch('/api/check-ins/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, stayedOnTrack }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to check in');
        }

        const data = await response.json();
        
        // Refresh the page to show updated streak and check-in status
        router.refresh();
      } catch (err: any) {
        console.error('Check-in error:', err);
        setError(err.message || 'Failed to check in. Please try again.');
      }
    });
  };

  return (
    <Card className="shadow-sm border-2">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-lg sm:text-xl font-bold">Today&apos;s Check-In</CardTitle>
      </CardHeader>
      <CardContent>
        {hasCheckedInToday ? (
          <div className="flex items-center justify-center gap-2 sm:gap-3 py-6 sm:py-8 text-green-600 dark:text-green-400">
            <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 shrink-0" />
            <span className="text-sm sm:text-base font-semibold text-center">
              Already checked in today! Great job! 🎉
            </span>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            <p className="text-center text-sm sm:text-base text-muted-foreground px-2">
              Did you stay on track with your goal today?
            </p>
            
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive text-center">{error}</p>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                type="button"
                variant="default"
                className="w-full h-14 sm:h-16 text-sm sm:text-base font-medium shadow-md hover:shadow-lg transition-all"
                onClick={() => handleCheckIn(true)}
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                ) : (
                  <CheckCircle2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                )}
                Yes, I stayed on track!
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="w-full h-14 sm:h-16 text-sm sm:text-base font-medium hover:bg-destructive/5 hover:border-destructive/20 transition-all"
                onClick={() => handleCheckIn(false)}
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                ) : (
                  <XCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                )}
                No, I slipped today
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

