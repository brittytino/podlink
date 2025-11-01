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
    <Card className={isPod ? 'border-purple-200 bg-purple-50/50' : ''}>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="text-4xl animate-bounce">{emoji}</div>
          <div className={`text-5xl font-bold ${colorClass}`}>
            {streak}
          </div>
          <div className="text-sm text-muted-foreground font-medium">
            {label}
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-1 text-xs text-orange-600">
              <Flame className="h-3 w-3" />
              <span>Day Streak</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
