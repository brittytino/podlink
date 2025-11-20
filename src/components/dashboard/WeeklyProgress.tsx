// WeeklyProgress.responsive.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

interface CheckInDay {
  date: string;
  stayedOnTrack: boolean;
}

interface WeeklyProgressProps {
  checkIns: CheckInDay[];
}

export function WeeklyProgress({ checkIns }: WeeklyProgressProps) {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const checkInMap = checkIns.reduce((acc, checkIn) => {
    const dateKey = new Date(checkIn.date).toISOString().split('T')[0];
    acc[dateKey] = checkIn.stayedOnTrack;
    return acc;
  }, {} as Record<string, boolean>);

  return (
    <Card className="rounded-2xl shadow-sm border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
          <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
          Weekly Progress
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {last7Days.map((date) => {
            const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
            const hasCheckIn = date in checkInMap;
            const isSuccess = checkInMap[date];

            return (
              <div key={date} className="flex items-center gap-3 sm:gap-4">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground w-10 sm:w-12 shrink-0">
                  {dayName}
                </span>

                <div className="flex-1">
                  <div className="relative h-8 sm:h-9 bg-muted/60 rounded-lg overflow-hidden ring-1 ring-muted/20">
                    {hasCheckIn ? (
                      <div
                        className={`h-full transition-all duration-300 ${
                          isSuccess
                            ? 'bg-gradient-to-r from-green-500 to-green-600'
                            : 'bg-gradient-to-r from-red-500 to-red-600'
                        }`}
                        style={{ width: '100%' }}
                        role="img"
                        aria-label={isSuccess ? 'Success' : 'Not success'}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
                        No entry
                      </div>
                    )}
                  </div>
                </div>

                <span className="text-xs sm:text-sm w-14 sm:w-16 text-right shrink-0 font-medium">
                  {hasCheckIn ? (isSuccess ? '✓ Yes' : '✗ No') : '-'}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
