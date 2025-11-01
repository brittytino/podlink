'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users } from 'lucide-react';

interface PodRankCardProps {
  rank: number;
  totalPods: number;
  podName: string;
  totalStreak: number;
}

export function PodRankCard({ rank, totalPods, podName, totalStreak }: PodRankCardProps) {
  const percentile = Math.round((1 - rank / totalPods) * 100);

  return (
    <Card className="border-primary">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <TrendingUp className="h-5 w-5" />
          Your Pod Rank
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Current Rank</span>
          <Badge variant="default" className="text-lg font-bold">
            #{rank}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Top</span>
          <span className="text-lg font-bold">{percentile}%</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total Streak</span>
          <span className="text-lg font-bold">{totalStreak} 🔥</span>
        </div>
        <div className="pt-2 border-t">
          <p className="text-sm text-center text-muted-foreground">
            {podName}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
