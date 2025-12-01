'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
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
      <div className="fixed inset-0 top-[56px] sm:top-[64px] flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-amber-50/30">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center space-y-3"
        >
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-amber-600" />
          <p className="text-sm text-slate-600 font-medium">Loading leaderboard...</p>
        </motion.div>
      </div>
    );
  }

  const userPodInTop10 = pods.some((p) => p.isUserPod);
  const userPodRank = userPodInTop10
    ? pods.findIndex((p) => p.isUserPod) + 1
    : userPod?.rank || 0;

  return (
    <div className="fixed inset-0 top-[56px] sm:top-[64px] flex bg-gradient-to-br from-slate-50 via-white to-amber-50/30 overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0">
        {/* Fixed Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-shrink-0 px-6 lg:px-10 xl:px-12 py-6 lg:py-7 bg-white/80 backdrop-blur-sm border-b border-slate-200/80 shadow-sm"
        >
          <div className="max-w-[1600px] mx-auto">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold flex items-center gap-3 bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent mb-2">
              <Trophy className="h-7 w-7 sm:h-9 sm:w-9 text-amber-500" />
              Leaderboard
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              See how your pod ranks against others in the community
            </p>
          </div>
        </motion.div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 lg:px-10 xl:px-12 py-6 lg:py-8">
            <div className="max-w-[1600px] mx-auto space-y-6 lg:space-y-8">
              {/* Your Pod Rank Card */}
              {session?.user?.podId && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
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
                </motion.div>
              )}

              {/* Tabs Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <Tabs defaultValue="weekly" className="w-full">
                  <TabsList className="grid w-full max-w-md grid-cols-1 h-auto">
                    <TabsTrigger value="weekly" className="text-base py-3">
                      🏆 Weekly Rankings
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="weekly" className="mt-6">
                    <LeaderboardTable pods={pods} />
                  </TabsContent>
                </Tabs>
              </motion.div>

              {/* Out of Top 10 Card */}
              {!userPodInTop10 && userPod && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="p-6 lg:p-8 border-0 rounded-2xl bg-gradient-to-br from-slate-100/90 to-slate-50/90 backdrop-blur-sm shadow-lg"
                >
                  <p className="text-sm text-center text-muted-foreground mb-4 font-medium uppercase tracking-wider">
                    Your Pod's Position
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="font-bold text-xl lg:text-2xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      {userPod.name}
                    </span>
                    <div className="flex items-center gap-4 lg:gap-6">
                      <span className="text-sm font-semibold text-muted-foreground px-4 py-2 rounded-full bg-white/90 shadow-sm">
                        Rank #{userPod.rank}
                      </span>
                      <span className="font-bold text-xl lg:text-2xl flex items-center gap-2">
                        {userPod.totalStreak} <span className="text-3xl">🔥</span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
