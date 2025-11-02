'use client';

import { Card, CardContent } from '@/components/ui/card';
import { getStreakColor, getStreakEmoji } from '@/lib/utils';
import { Flame, TrendingUp } from 'lucide-react';

interface StreakDisplayProps {
  streak: number;
  label: string;
  isPod?: boolean;
}

export function StreakDisplay({ streak, label, isPod = false }: StreakDisplayProps) {
  const emoji = getStreakEmoji(streak);
  const colorClass = getStreakColor(streak);

  return (
    <Card 
      className={`
        group relative overflow-hidden border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1
        ${isPod 
          ? 'border-purple-200 dark:border-purple-800/50 bg-gradient-to-br from-purple-50 via-white to-purple-50/30 dark:from-purple-950/30 dark:via-background dark:to-purple-950/10' 
          : 'border-orange-200 dark:border-orange-800/50 bg-gradient-to-br from-orange-50 via-white to-orange-50/30 dark:from-orange-950/30 dark:via-background dark:to-orange-950/10'
        }
      `}
    >
      {/* Subtle Glow Effect */}
      <div className={`
        absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10
        ${isPod ? 'bg-purple-400/20' : 'bg-orange-400/20'}
      `} />
      
      {/* Decorative Corner Element */}
      <div className={`
        absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-10
        ${isPod ? 'bg-purple-500' : 'bg-orange-500'}
      `} />

      <CardContent className="relative p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          {/* Emoji Icon */}
          <div className="relative">
            <div className={`
              absolute inset-0 rounded-2xl blur-md opacity-50
              ${isPod ? 'bg-purple-400' : 'bg-orange-400'}
            `} />
            <div className="relative text-4xl sm:text-5xl transform group-hover:scale-110 transition-transform duration-300">
              {emoji}
            </div>
          </div>

          {/* Streak Number and Label */}
          <div className="flex-1 min-w-0 text-right">
            <div className="flex items-baseline justify-end gap-2">
              <span className={`
                text-5xl sm:text-6xl font-bold tracking-tight transition-all duration-300 group-hover:scale-105
                ${colorClass}
              `}>
                {streak}
              </span>
              {streak > 0 && (
                <Flame className={`
                  h-6 w-6 sm:h-7 sm:w-7 mb-2 animate-pulse
                  ${isPod ? 'text-purple-500' : 'text-orange-500'}
                `} />
              )}
            </div>
            <p className="text-xs sm:text-sm font-medium text-muted-foreground mt-1 truncate">
              {label}
            </p>
          </div>
        </div>

        {/* Footer Badge */}
        {streak > 0 && (
          <div className="mt-4 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-muted/50 to-muted/30 backdrop-blur-sm border">
            <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
            <span className="text-xs font-semibold text-foreground/80">
              {streak} {streak === 1 ? 'Day' : 'Days'} Strong
            </span>
          </div>
        )}

        {streak === 0 && (
          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground/70">
              Start your streak today! 💪
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}