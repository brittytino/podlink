'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CheckInButtonsProps {
  hasCheckedInToday: boolean;
  userId: string;
}

export function CheckInButtons({ hasCheckedInToday, userId }: CheckInButtonsProps) {
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

  if (hasCheckedInToday) {
    return (
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="py-2"
      >
        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center">
          ✓ Already checked in today!
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-2 sm:space-y-3">
      {error && (
        <div className="p-2 rounded-lg bg-destructive/10 border border-destructive/20">
          <p className="text-xs text-destructive text-center">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            type="button"
            className="w-full h-10 sm:h-11 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5 sm:gap-2 font-medium text-xs sm:text-sm px-2 sm:px-4"
            onClick={() => handleCheckIn(true)}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Yes, I stayed on track!</span>
                <span className="xs:hidden">Yes</span>
                <span className="text-sm sm:text-base">👍</span>
              </>
            )}
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            type="button"
            className="w-full h-10 sm:h-11 bg-red-100 hover:bg-red-200 dark:bg-red-950/30 dark:hover:bg-red-950/50 text-red-700 dark:text-red-300 rounded-full shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5 sm:gap-2 font-medium text-xs sm:text-sm border-0 px-2 sm:px-4"
            onClick={() => handleCheckIn(false)}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <XCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">No, I slipped today</span>
                <span className="xs:hidden">No</span>
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
