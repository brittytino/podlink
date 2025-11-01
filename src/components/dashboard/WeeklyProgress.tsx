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
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
          <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
          Weekly Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 sm:space-y-3">
          {last7Days.map((date, index) => {
            const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
            const hasCheckIn = date in checkInMap;
            const isSuccess = checkInMap[date];

            return (
              <div key={date} className="flex items-center gap-2 sm:gap-3">
                <span className="text-[10px] sm:text-xs font-medium text-muted-foreground w-8 sm:w-10 shrink-0">
                  {dayName}
                </span>
                <div className="flex-1 h-7 sm:h-8 bg-muted rounded-lg overflow-hidden">
                  {hasCheckIn && (
                    <div
                      className={`h-full transition-all ${
                        isSuccess
                          ? 'bg-gradient-to-r from-green-500 to-green-600'
                          : 'bg-gradient-to-r from-red-500 to-red-600'
                      }`}
                      style={{ width: '100%' }}
                    />
                  )}
                </div>
                <span className="text-[10px] sm:text-xs w-10 sm:w-12 text-right shrink-0">
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
