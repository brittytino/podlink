'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PodRank {
  id: string;
  name: string;
  totalStreak: number;
  memberCount: number;
  isUserPod: boolean;
}

interface LeaderboardTableProps {
  pods: PodRank[];
}

export function LeaderboardTable({ pods }: LeaderboardTableProps) {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Award className="h-5 w-5 text-orange-600" />;
    return <span className="text-muted-foreground font-semibold">{rank}</span>;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">Rank</TableHead>
          <TableHead>Pod Name</TableHead>
          <TableHead className="text-center">Members</TableHead>
          <TableHead className="text-right">Total Streak</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pods.map((pod, index) => (
          <TableRow
            key={pod.id}
            className={cn(
              pod.isUserPod && 'bg-primary/10 border-l-4 border-l-primary'
            )}
          >
            <TableCell className="font-medium">
              <div className="flex items-center justify-center">
                {getRankIcon(index + 1)}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{pod.name}</span>
                {pod.isUserPod && (
                  <Badge variant="secondary" className="text-xs">
                    Your Pod
                  </Badge>
                )}
              </div>
            </TableCell>
            <TableCell className="text-center">{pod.memberCount}</TableCell>
            <TableCell className="text-right">
              <Badge variant="outline" className="font-semibold">
                {pod.totalStreak} 🔥
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
