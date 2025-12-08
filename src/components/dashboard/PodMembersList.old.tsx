'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { Users } from 'lucide-react';

interface PodMember {
  id: string;
  fullName: string;
  displayName?: string; // Anonymous name for privacy
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
    <Card className="rounded-2xl shadow-sm border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3 text-sm sm:text-base md:text-lg font-semibold">
          
          <div className="text-2xl sm:text-3xl md:text-4xl font-['Bebas_Neue',sans-serif] font-extrabold leading-none">
            <span className="text-[#ff5370]">{podName}</span> Members
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 sm:space-y-4">
          {members.map((member) => {
            const displayName = member.displayName || member.fullName;
            return (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 sm:p-4 rounded-xl border bg-card hover:bg-accent/40 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Avatar className="h-10 w-10 sm:h-12 sm:w-12 shrink-0 ring-2 ring-white shadow-sm">
                    <AvatarImage src={member.avatarUrl || ''} alt={displayName} />
                    <AvatarFallback className="text-sm sm:text-base">
                      {displayName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base md:text-lg truncate">{displayName}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">@{member.username}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 sm:gap-1 shrink-0 ml-4">
                  <Badge variant="secondary" className="text-xs sm:text-sm px-2 py-1 rounded-md">
                    {member.currentStreak} 🔥
                  </Badge>
                  {member.lastCheckIn && (
                    <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                      {formatDate(member.lastCheckIn)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
      <style jsx>{`
        /* Make list feel denser on large screens and more touch-friendly on mobile */
        @media (min-width: 1024px) {
          .card-list-item { padding: 1rem; }
        }
      `}</style>
    </Card>
  );
}
