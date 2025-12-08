// StreakDisplay.responsive.tsx
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
        rounded-2xl overflow-hidden border-2 transition-all duration-300
        hover:shadow-xl hover:-translate-y-1
        ${isPod
          ? 'border-purple-200 dark:border-purple-800/50 bg-gradient-to-br from-purple-50 via-white to-purple-50/30 dark:from-purple-950/30 dark:via-background dark:to-purple-950/10'
          : 'border-orange-200 dark:border-orange-800/50 bg-gradient-to-br from-orange-50 via-white to-orange-50/30 dark:from-orange-950/30 dark:via-background dark:to-orange-950/10'
        }
      `}
      role="region"
      aria-label={`${label} streak card`}
    >
      {/* subtle background glow that appears on hover */}
      <div
        className={`
          pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10
          ${isPod ? 'bg-purple-400/12' : 'bg-orange-400/12'}
        `}
        aria-hidden
      />

      {/* decorative, low-contrast corner */}
      <div
        className={`
          pointer-events-none absolute -top-8 -right-8 w-28 h-28 rounded-full opacity-8 -z-20
          ${isPod ? 'bg-purple-500/6' : 'bg-orange-500/6'}
        `}
        aria-hidden
      />

      <CardContent className="relative p-4 sm:p-6">
        <div className="flex items-center gap-4">
          {/* Emoji / icon block */}
          <div className="flex-shrink-0">
            <div
              className={`
                relative flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 rounded-2xl
                ${isPod ? 'bg-gradient-to-br from-purple-600 to-violet-500' : 'bg-gradient-to-br from-orange-500 to-yellow-500'}
                text-white shadow-md ring-1 ring-white/10
              `}
              aria-hidden
            >
              <span className="text-2xl sm:text-3xl">{emoji}</span>
            </div>
          </div>

          {/* main numbers */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <span
                    className={`
                      text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight
                      ${colorClass}
                    `}
                    aria-live="polite"
                  >
                    {streak}
                  </span>

                  {streak > 0 && (
                    <Flame
                      className={`
                        h-5 w-5 sm:h-6 sm:w-6 animate-pulse
                        ${isPod ? 'text-purple-400' : 'text-orange-500'}
                      `}
                      aria-hidden
                    />
                  )}
                </div>

                <p className="text-sm sm:text-base text-muted-foreground mt-1 truncate">
                  {label}
                </p>
              </div>

              {/* small helper on the right for larger screens */}
              <div className="hidden sm:flex flex-col items-end">
                {streak > 0 ? (
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/40 backdrop-blur-sm border"
                    role="status"
                    aria-label="streak progress"
                  >
                    <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="text-xs font-semibold text-foreground/80">
                      {streak} {streak === 1 ? 'Day' : 'Days'} Strong
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground/80">Start your streak today! 💪</p>
                )}
              </div>
            </div>

            {/* footer for small screens */}
            <div className="mt-3 sm:hidden">
              {streak > 0 ? (
                <div className="flex items-center justify-start gap-2 px-3 py-1 rounded-full bg-muted/40 border">
                  <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-xs font-semibold text-foreground/80">
                    {streak} {streak === 1 ? 'Day' : 'Days'} Strong
                  </span>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
