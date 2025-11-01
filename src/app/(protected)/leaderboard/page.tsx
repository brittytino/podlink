'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { LeaderboardTable } from '@/components/leaderboard/LeaderboardTable';
import { PodRankCard } from '@/components/leaderboard/PodRankCard';
import { Trophy, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PodRank {
  id: string;
  name: string;
  totalStreak: number;
  memberCount: number;
  isUserPod: boolean;
}

interface UserPodRank extends PodRank {
  rank: number;
}

export default function LeaderboardPage() {
  const { data: session } = useSession();
  const [pods, setPods] = useState<PodRank[]>([]);
  const [userPod, setUserPod] = useState<UserPodRank | null>(null);
  const [totalPods, setTotalPods] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.podId) return;

    fetch(`/api/leaderboard?userPodId=${session.user.podId}`)
      .then((res) => res.json())
      .then((data) => {
        setPods(data.pods || []);
        setUserPod(data.userPod || null);
        setTotalPods(data.totalPods || 0);
        setLoading(false);
      });
  }, [session?.user?.podId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const userPodInTop10 = pods.some((p) => p.isUserPod);
  const userPodRank = userPodInTop10
    ? pods.findIndex((p) => p.isUserPod) + 1
    : userPod?.rank || 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-1 sm:space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
          <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" />
          Leaderboard
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          See how your pod ranks against others
        </p>
      </div>

      {session?.user?.podId && (
        <PodRankCard
          rank={userPodRank}
          totalPods={totalPods}
          podName={userPod?.name || pods.find((p) => p.isUserPod)?.name || 'Your Pod'}
          totalStreak={
            userPod?.totalStreak ||
            pods.find((p) => p.isUserPod)?.totalStreak ||
            0
          }
        />
      )}

      <Tabs defaultValue="weekly" className="w-full">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="weekly">Weekly Rankings</TabsTrigger>
        </TabsList>
        <TabsContent value="weekly" className="mt-6">
          <LeaderboardTable pods={pods} />
        </TabsContent>
      </Tabs>

      {!userPodInTop10 && userPod && (
        <div className="mt-6 p-4 border rounded-lg bg-muted/50">
          <p className="text-sm text-center text-muted-foreground mb-2">
            Your Pod's Position
          </p>
          <div className="flex items-center justify-between">
            <span className="font-semibold">{userPod.name}</span>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Rank #{userPod.rank}
              </span>
              <span className="font-semibold">{userPod.totalStreak} 🔥</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
