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
    <Card className="rounded-2xl shadow-sm border">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight flex items-center gap-3">
          <span className="sr-only">Today&apos;s Check-In</span>
          <span className="text-foreground">Today&apos;s Check-In</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasCheckedInToday ? (
          <div className="flex flex-col items-center justify-center gap-2 sm:gap-3 py-6 sm:py-8 text-green-600 dark:text-green-400">
            <CheckCircle2 className="h-6 w-6 sm:h-7 sm:w-7 shrink-0" />
            <span className="text-sm sm:text-base font-semibold text-center max-w-md">
              Already checked in today! Great job! 🎉
            </span>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-5">
            <p className="text-center text-sm sm:text-base text-muted-foreground px-3">
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
                className="w-full h-14 sm:h-16 text-sm sm:text-base font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center"
                onClick={() => handleCheckIn(true)}
                disabled={isPending}
                aria-label="Check in - stayed on track"
              >
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                ) : (
                  <CheckCircle2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                )}
                <span className="truncate">Yes, I stayed on track!</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-14 sm:h-16 text-sm sm:text-base font-medium hover:bg-destructive/5 hover:border-destructive/20 transition-all flex items-center justify-center"
                onClick={() => handleCheckIn(false)}
                disabled={isPending}
                aria-label="Check in - did not stay on track"
              >
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                ) : (
                  <XCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                )}
                <span className="truncate">No, I slipped today</span>
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">Checking in helps keep your streak updated and lets your pod know how you&apos;re doing.</p>
          </div>
        )}
      </CardContent>
      <style jsx>{`
        /* subtle entrance for the card */
        .card-enter {
          animation: fade-in 320ms ease-out;
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Card>
  );
}
