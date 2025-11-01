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
    <div className="overflow-x-auto -mx-3 sm:mx-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 sm:w-16 text-xs sm:text-sm">Rank</TableHead>
            <TableHead className="text-xs sm:text-sm">Pod Name</TableHead>
            <TableHead className="text-center text-xs sm:text-sm">Members</TableHead>
            <TableHead className="text-right text-xs sm:text-sm">Total Streak</TableHead>
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
            <TableCell className="font-medium text-xs sm:text-sm">
              <div className="flex items-center justify-center">
                {getRankIcon(index + 1)}
              </div>
            </TableCell>
            <TableCell className="text-xs sm:text-sm">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold truncate">{pod.name}</span>
                {pod.isUserPod && (
                  <Badge variant="secondary" className="text-[10px] sm:text-xs shrink-0">
                    Your Pod
                  </Badge>
                )}
              </div>
            </TableCell>
            <TableCell className="text-center text-xs sm:text-sm">{pod.memberCount}</TableCell>
            <TableCell className="text-right text-xs sm:text-sm">
              <Badge variant="outline" className="font-semibold text-[10px] sm:text-xs">
                {pod.totalStreak} 🔥
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </div>
  );
}
