'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface CheckInDay {
  date: string;
  stayedOnTrack: boolean;
}

interface WeeklyProgressProps {
  checkIns: CheckInDay[];
  userTimezone?: string;
  currentStreak?: number;
}

export function WeeklyProgress({ checkIns, userTimezone = 'UTC', currentStreak = 0 }: WeeklyProgressProps) {
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);

  const getUserLocalDate = (offset: number = 0): string => {
    try {
      const now = new Date();
      const userLocalTime = new Date(now.toLocaleString('en-US', { timeZone: userTimezone }));
      const targetDate = new Date(userLocalTime);
      targetDate.setDate(targetDate.getDate() + offset);
      
      const year = targetDate.getFullYear();
      const month = String(targetDate.getMonth() + 1).padStart(2, '0');
      const day = String(targetDate.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error('Error getting user local date:', error);
      const date = new Date();
      date.setDate(date.getDate() + offset);
      return date.toISOString().split('T')[0];
    }
  };

  // Generate last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    return getUserLocalDate(-(6 - i));
  });

  // Build check-in map with actual data
  const checkInMap = checkIns.reduce((acc, checkIn) => {
    const checkInDate = new Date(checkIn.date);
    const year = checkInDate.getFullYear();
    const month = String(checkInDate.getMonth() + 1).padStart(2, '0');
    const day = String(checkInDate.getDate()).padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`;
    
    acc[dateKey] = checkIn.stayedOnTrack;
    return acc;
  }, {} as Record<string, boolean>);

  // Calculate which days are part of the current streak
  const streakDays = new Set<number>();
  if (currentStreak > 0) {
    const visibleStreakDays = Math.min(currentStreak, 7);
    for (let i = 0; i < visibleStreakDays; i++) {
      streakDays.add(6 - i);
    }
  }

  // Get intensity level (0-4) based on actual data, not random
  const getIntensityLevel = (date: string): number => {
    const hasCheckIn = date in checkInMap;
    if (!hasCheckIn) return 0;
    
    const isSuccess = checkInMap[date];
    if (!isSuccess) return 1;
    
    // Use consistent intensity based on date to avoid hydration mismatch
    // Parse date to get a consistent number
    const [year, month, day] = date.split('-').map(Number);
    const dateValue = (year * 10000) + (month * 100) + day;
    
    // Create a consistent "random-like" value from the date
    const hash = (dateValue * 2654435761) % 2147483647;
    const normalized = (hash / 2147483647);
    
    // Map to 2, 3, or 4 for success
    return 2 + Math.floor(normalized * 3);
  };

  // GitHub-style color classes
  const getHeatmapColor = (level: number, isStreak: boolean): string => {
    if (isStreak) {
      // Purple gradient for streak days
      const colors = [
        'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700',
        'bg-red-200 dark:bg-red-900/50 border-red-300 dark:border-red-700',
        'bg-purple-300 dark:bg-purple-900/60 border-purple-400 dark:border-purple-700',
        'bg-purple-500 dark:bg-purple-700 border-purple-600 dark:border-purple-600',
        'bg-purple-700 dark:bg-purple-600 border-purple-800 dark:border-purple-500',
      ];
      return colors[level];
    }
    
    // Green gradient for non-streak days
    const colors = [
      'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700',
      'bg-red-200 dark:bg-red-900/50 border-red-300 dark:border-red-700',
      'bg-green-200 dark:bg-green-900/50 border-green-300 dark:border-green-700',
      'bg-green-400 dark:bg-green-700 border-green-500 dark:border-green-600',
      'bg-green-600 dark:bg-green-600 border-green-700 dark:border-green-500',
    ];
    return colors[level];
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="h-full flex flex-col"
    >
      <Card className="border border-gray-200 dark:border-gray-800 shadow-lg rounded-[20px] sm:rounded-[28px] flex-1 flex flex-col">
        <CardHeader className="pb-2 sm:pb-3 flex-shrink-0 px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
              Weekly Progress
            </CardTitle>
            <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-gray-500">
              <span className="hidden sm:inline">Less</span>
              <div className="flex gap-0.5 sm:gap-1">
                {[0, 1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`w-2 h-2 sm:w-3 sm:h-3 rounded-sm border ${getHeatmapColor(level, false)}`}
                  />
                ))}
              </div>
              <span className="hidden sm:inline">More</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-3 sm:pt-4 pb-4 sm:pb-6 flex-1 px-3 sm:px-6">
          {/* Heatmap Grid */}
          <div className="space-y-3 sm:space-y-4">
            {/* Month labels */}
            <div className="flex justify-between text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 px-0.5 sm:px-1">
              {last7Days.map((date, index) => {
                const [year, month, day] = date.split('-').map(Number);
                const dateObj = new Date(year, month - 1, day);
                const monthName = dateObj.toLocaleDateString('en-US', { month: 'short' });
                const dayOfMonth = dateObj.getDate();
                
                // Show month label on first day or when month changes
                const showMonth = index === 0 || dayOfMonth === 1;
                return (
                  <div key={index} className="flex-1 text-center">
                    {showMonth && monthName}
                  </div>
                );
              })}
            </div>

            {/* Heatmap squares */}
            <div className="flex gap-1.5 sm:gap-2">
              {last7Days.map((date, index) => {
                const [year, month, day] = date.split('-').map(Number);
                const dateObj = new Date(year, month - 1, day);
                const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                const isToday = index === 6;
                const isStreakDay = streakDays.has(index);
                const intensityLevel = getIntensityLevel(date);
                const hasCheckIn = date in checkInMap;
                const isSuccess = hasCheckIn && checkInMap[date];

                return (
                  <motion.div
                    key={date}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="flex-1 flex flex-col items-center gap-1.5 sm:gap-2"
                    onMouseEnter={() => setHoveredDay(date)}
                    onMouseLeave={() => setHoveredDay(null)}
                  >
                    {/* Day label */}
                    <span className={`text-[10px] sm:text-xs font-medium ${
                      isToday ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {dayName}
                    </span>

                    {/* Heatmap square */}
                    <div className="relative w-full aspect-square max-w-[60px] sm:max-w-[80px]">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className={`w-full h-full rounded-lg border-2 transition-all cursor-pointer ${
                          getHeatmapColor(intensityLevel, isStreakDay)
                        } ${isToday ? 'ring-1 sm:ring-2 ring-blue-400 ring-offset-1 sm:ring-offset-2' : ''}`}
                      >
                        {/* Streak badge */}
                        {isStreakDay && (
                          <div className="absolute -top-0.5 sm:-top-1 -right-0.5 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 bg-purple-600 rounded-full flex items-center justify-center text-white text-[8px] sm:text-[10px] font-bold shadow-md z-10">
                            🔥
                          </div>
                        )}
                      </motion.div>

                      {/* Tooltip on hover */}
                      {hoveredDay === date && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-[10px] sm:text-xs rounded-lg shadow-lg whitespace-nowrap z-20"
                        >
                          <div className="font-semibold">{dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                          <div className="text-gray-300 dark:text-gray-600">
                            {hasCheckIn ? (
                              isSuccess ? '✓ Stayed on track' : '✗ Missed goal'
                            ) : 'No check-in'}
                          </div>
                          {isStreakDay && (
                            <div className="text-purple-400 dark:text-purple-600 font-semibold">
                              🔥 {currentStreak} day streak
                            </div>
                          )}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
                        </motion.div>
                      )}
                    </div>

                    {/* Check-in status icon */}
                    <div className="text-base sm:text-lg h-5 sm:h-6">
                      {hasCheckIn ? (
                        isSuccess ? (
                          <span className="text-green-600 dark:text-green-400">✓</span>
                        ) : (
                          <span className="text-red-600 dark:text-red-400">✗</span>
                        )
                      ) : (
                        <span className="text-gray-300 dark:text-gray-600">−</span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Stats summary */}
            <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 text-xs sm:text-sm">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Total check-ins: </span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {checkIns.length}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Success rate: </span>
                    <span className="font-bold text-green-600 dark:text-green-400">
                      {checkIns.length > 0 
                        ? Math.round((checkIns.filter(c => c.stayedOnTrack).length / checkIns.length) * 100)
                        : 0}%
                    </span>
                  </div>
                </div>
                {currentStreak > 0 && (
                  <div className="flex items-center gap-1 px-2.5 sm:px-3 py-0.5 sm:py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                    <span className="text-sm sm:text-lg">🔥</span>
                    <span className="font-bold text-purple-700 dark:text-purple-400 text-xs sm:text-sm">
                      {currentStreak} day streak
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
