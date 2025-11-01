'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { Users } from 'lucide-react';

interface PodMember {
  id: string;
  fullName: string;
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          {podName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={member.avatarUrl || ''} alt={member.fullName} />
                  <AvatarFallback>
                    {member.fullName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{member.fullName}</p>
                  <p className="text-xs text-muted-foreground">@{member.username}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge variant="secondary" className="text-xs">
                  {member.currentStreak} 🔥
                </Badge>
                {member.lastCheckIn && (
                  <span className="text-xs text-muted-foreground">
                    {formatDate(member.lastCheckIn)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
