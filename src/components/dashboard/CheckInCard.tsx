'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
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

        router.refresh();
      } catch (err: any) {
        console.error('Check-in error:', err);
        setError(err.message || 'Failed to check in. Please try again.');
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.15 }}
    >
      <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg rounded-[28px]">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold text-gray-900 dark:text-white">
            Today&apos;s Check-In
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Today&apos;s Check-in is 1 welcome:
          </p>
        </CardHeader>
        <CardContent className="pb-4">
          {hasCheckedInToday ? (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="flex flex-col items-center justify-center gap-2 py-4 text-green-600 dark:text-green-400"
            >
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <span className="text-sm font-semibold text-center">
                Already checked in today! Great job! 🎉
              </span>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive text-center">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="button"
                    className="w-full h-11 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 font-medium text-sm"
                    onClick={() => handleCheckIn(true)}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="h-5 w-5" />
                        <span>Yes, I stayed on track!</span>
                        <span className="text-lg">👍</span>
                      </>
                    )}
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="button"
                    className="w-full h-11 bg-red-100 hover:bg-red-200 dark:bg-red-950/30 dark:hover:bg-red-950/50 text-red-700 dark:text-red-300 rounded-full shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 font-medium text-sm border-0"
                    onClick={() => handleCheckIn(false)}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <XCircle className="h-5 w-5" />
                        <span>No, I slipped today</span>
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>

              <p className="text-xs text-center text-gray-500 dark:text-gray-400 pt-1">
                Checking in helps keep your streak updated
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
