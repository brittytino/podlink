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
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Users className="h-4 w-4 sm:h-5 sm:w-5" />
          {podName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 sm:space-y-4">
          {members.map((member) => {
            const displayName = member.displayName || member.fullName;
            return (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <Avatar className="h-9 w-9 sm:h-10 sm:w-10 shrink-0">
                    <AvatarImage src={member.avatarUrl || ''} alt={displayName} />
                    <AvatarFallback className="text-xs sm:text-sm">
                      {displayName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base truncate">{displayName}</p>
                    <p className="text-xs text-muted-foreground truncate">@{member.username}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
                  <Badge variant="secondary" className="text-[10px] sm:text-xs">
                    {member.currentStreak} 🔥
                  </Badge>
                  {member.lastCheckIn && (
                    <span className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(member.lastCheckIn)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
