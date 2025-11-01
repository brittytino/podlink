'use client';

import { Card, CardContent } from '@/components/ui/card';
import { getStreakColor, getStreakEmoji } from '@/lib/utils';
import { Flame } from 'lucide-react';

interface StreakDisplayProps {
  streak: number;
  label: string;
  isPod?: boolean;
}

export function StreakDisplay({ streak, label, isPod = false }: StreakDisplayProps) {
  const emoji = getStreakEmoji(streak);
  const colorClass = getStreakColor(streak);

  return (
    <Card className={`transition-all hover:shadow-md ${isPod ? 'border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20' : 'hover:scale-[1.02]'}`}>
      <CardContent className="pt-4 sm:pt-6 pb-4 sm:pb-6">
        <div className="flex flex-col items-center justify-center space-y-2 sm:space-y-3">
          <div className="text-3xl sm:text-4xl animate-bounce">{emoji}</div>
          <div className={`text-4xl sm:text-5xl lg:text-6xl font-bold ${colorClass}`}>
            {streak}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground font-medium text-center px-2">
            {label}
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400">
              <Flame className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Day Streak</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
