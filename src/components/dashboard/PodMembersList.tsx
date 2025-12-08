'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

interface PodMember {
  id: string;
  fullName: string;
  displayName?: string;
  username: string;
  avatarUrl: string | null;
  currentStreak: number;
  lastCheckIn: Date | null;
}

interface PodMembersListProps {
  members: PodMember[];
  podName: string;
}

export function PodMembersList({ members, podName }: PodMembersListProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg rounded-[28px] h-full flex flex-col">
        <CardHeader className="pb-3 flex-shrink-0">
          <CardTitle className="text-base font-bold text-gray-900 dark:text-white">
            <span className="uppercase tracking-wide text-xs text-gray-500 dark:text-gray-400 font-semibold block">
              {podName.toUpperCase()} MEMBERS
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2 space-y-2 overflow-y-auto flex-1">
          {members.map((member, index) => {
            const displayName = member.displayName || member.fullName;
            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center gap-3 p-2.5 rounded-2xl bg-gradient-to-r from-blue-50/80 to-cyan-50/60 dark:from-blue-950/20 dark:to-cyan-950/10 border border-blue-100 dark:border-blue-900/30 hover:border-blue-200 dark:hover:border-blue-800 transition-all hover:shadow-sm"
              >
                <Avatar className="h-11 w-11 ring-2 ring-white dark:ring-gray-700 shadow-sm">
                  <AvatarImage src={member.avatarUrl || ''} alt={displayName} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-bold text-sm">
                    {displayName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate text-gray-900 dark:text-white">
                    {displayName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {member.currentStreak === 0 ? 'Low mnner' : member.currentStreak < 5 ? 'Low mnner' : 'High ranner'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700">
                    <div className={`w-2 h-2 rounded-full ${member.currentStreak > 0 ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Status</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
}
