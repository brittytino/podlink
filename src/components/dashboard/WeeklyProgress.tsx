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
  userTimezone?: string;
}

export function WeeklyProgress({ checkIns, userTimezone = 'UTC' }: WeeklyProgressProps) {
  // Get user's current local date based on their timezone
  const getUserLocalDate = (offset: number = 0): string => {
    try {
      const now = new Date();
      const userLocalTime = new Date(now.toLocaleString('en-US', { timeZone: userTimezone }));
      const targetDate = new Date(userLocalTime);
      targetDate.setDate(targetDate.getDate() + offset);
      
      // Return in YYYY-MM-DD format
      const year = targetDate.getFullYear();
      const month = String(targetDate.getMonth() + 1).padStart(2, '0');
      const day = String(targetDate.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error('Error getting user local date:', error);
      // Fallback to UTC
      const date = new Date();
      date.setDate(date.getDate() + offset);
      return date.toISOString().split('T')[0];
    }
  };

  // Generate last 7 days based on user's timezone
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    return getUserLocalDate(-(6 - i));
  });

  const checkInMap = checkIns.reduce((acc, checkIn) => {
    // Parse the check-in date properly (it's stored in user's local timezone)
    const checkInDate = new Date(checkIn.date);
    const year = checkInDate.getFullYear();
    const month = String(checkInDate.getMonth() + 1).padStart(2, '0');
    const day = String(checkInDate.getDate()).padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`;
    
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
          {last7Days.map((date, index) => {
            // Use proper date parsing for day name
            const [year, month, day] = date.split('-').map(Number);
            const dateObj = new Date(year, month - 1, day);
            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
            
            const hasCheckIn = date in checkInMap;
            const isSuccess = checkInMap[date];
            const isToday = index === 6; // Last day in the array is today

            return (
              <div key={date} className="flex items-center gap-3 sm:gap-4">
                <span className={`text-xs sm:text-sm font-medium w-10 sm:w-12 shrink-0 ${
                  isToday ? 'text-primary font-bold' : 'text-muted-foreground'
                }`}>
                  {dayName}
                </span>

                <div className="flex-1">
                  <div className={`relative h-8 sm:h-9 bg-muted/60 rounded-lg overflow-hidden ${
                    isToday ? 'ring-2 ring-primary/50' : 'ring-1 ring-muted/20'
                  }`}>
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
                        {isToday ? 'Check in today' : 'No entry'}
                      </div>
                    )}
                  </div>
                </div>

                <span className={`text-xs sm:text-sm w-14 sm:w-16 text-right shrink-0 font-medium ${
                  isToday ? 'text-primary' : ''
                }`}>
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
