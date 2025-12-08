'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';

interface PodMember {
  id: string;
  fullName: string;
  displayName?: string;
  username: string;
  avatarUrl: string | null;
  currentStreak: number;
  lastCheckIn: Date | null;
}

interface PodMembersGridProps {
  members: PodMember[];
}

export function PodMembersGrid({ members }: PodMembersGridProps) {
  const getMemberRole = (streak: number) => {
    if (streak === 0) return 'Getting Started';
    if (streak < 3) return 'Building Momentum';
    if (streak < 7) return 'On Fire';
    if (streak < 14) return 'Streak Master';
    if (streak < 30) return 'Champion';
    return 'Legend';
  };

  const getRoleColor = (streak: number) => {
    if (streak === 0) return 'from-gray-50/80 to-gray-50/60 border-gray-100';
    if (streak < 3) return 'from-blue-50/80 to-cyan-50/60 border-blue-100';
    if (streak < 7) return 'from-orange-50/80 to-amber-50/60 border-orange-100';
    if (streak < 14) return 'from-purple-50/80 to-pink-50/60 border-purple-100';
    if (streak < 30) return 'from-emerald-50/80 to-green-50/60 border-emerald-100';
    return 'from-yellow-50/80 to-amber-50/60 border-yellow-200';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {members.map((member, index) => {
        const displayName = member.displayName || member.fullName;
        const role = getMemberRole(member.currentStreak);
        const roleColor = getRoleColor(member.currentStreak);
        
        return (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className={`flex items-center gap-2 p-2 rounded-xl sm:rounded-2xl bg-gradient-to-r ${roleColor} dark:from-gray-900/20 dark:to-gray-950/10 dark:border-gray-700/30 hover:shadow-md transition-all`}
          >
            <Avatar className="h-8 w-8 sm:h-10 sm:w-10 ring-2 ring-white dark:ring-gray-700 shadow-sm flex-shrink-0">
              <AvatarImage src={member.avatarUrl || ''} alt={displayName} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-bold text-xs sm:text-sm">
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-xs sm:text-sm truncate text-gray-900 dark:text-white">
                {displayName}
              </p>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 truncate">
                {role}
              </p>
            </div>

            <div className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 flex-shrink-0">
              <motion.div 
                animate={{ 
                  scale: member.currentStreak > 0 ? [1, 1.2, 1] : 1,
                  opacity: member.currentStreak > 0 ? [1, 0.7, 1] : 1
                }}
                transition={{ 
                  repeat: member.currentStreak > 0 ? Infinity : 0, 
                  duration: 2 
                }}
                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                  member.currentStreak >= 7 ? 'bg-purple-500' :
                  member.currentStreak >= 3 ? 'bg-green-500' :
                  member.currentStreak > 0 ? 'bg-blue-500' : 'bg-gray-300'
                }`} 
              />
              <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">
                {member.currentStreak > 0 ? `${member.currentStreak}d` : 'Idle'}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
