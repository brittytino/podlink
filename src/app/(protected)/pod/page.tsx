'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChatWindow } from '@/components/pod/ChatWindow';
import { AlertNotification } from '@/components/pod/AlertNotification';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useSocket } from '@/hooks/useSocket';
import { usePodMessages } from '@/hooks/usePodMessages';
import { Send, Users, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PodMember {
  id: string;
  username: string;
  fullName: string;
  avatarUrl: string | null;
  currentStreak: number;
}

interface CrisisAlert {
  id: string;
  userId: string;
  username: string;
  message: string | null;
  createdAt: string;
}

export default function PodPage() {
  const { data: session } = useSession();
  const { socket, isConnected } = useSocket();
  const [members, setMembers] = useState<PodMember[]>([]);
  const [podName, setPodName] = useState('');
  const [messageText, setMessageText] = useState('');
  const [activeAlert, setActiveAlert] = useState<CrisisAlert | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const podId = session?.user?.podId;
  const { messages, sendMessage } = usePodMessages(podId || null);

  useEffect(() => {
    if (!session?.user?.podId) return;

    // Fetch pod members
    fetch(`/api/pods/members?podId=${session.user.podId}`)
      .then((res) => res.json())
      .then((data) => {
        setMembers(data.members || []);
        setPodName(data.podName || 'Your Pod');
        setLoading(false);
      });

    // Fetch active alerts
    fetch(`/api/alerts/list?podId=${session.user.podId}`)
      .then((res) => res.json())
      .then((data) => {
        const active = data.alerts?.find((a: any) => a.status === 'ACTIVE');
        if (active) {
          setActiveAlert({
            id: active.id,
            userId: active.userId,
            username: active.user.username,
            message: active.message,
            createdAt: active.createdAt,
          });
        }
      });
  }, [session?.user?.podId]);

  useEffect(() => {
    if (!socket || !session?.user || !podId) return;

    // Join pod room
    socket.emit('join-pod', {
      userId: session.user.id,
      podId,
      username: session.user.username,
    });

    // Listen for crisis alerts
    socket.on('crisis-alert-received', (alert: CrisisAlert) => {
      setActiveAlert(alert);
      toast({
        title: '🚨 Crisis Alert!',
        description: `${alert.username} needs help right now!`,
        variant: 'destructive',
      });
    });

    // Listen for alert resolution
    socket.on('alert-resolved', ({ alertId }: { alertId: string }) => {
      if (activeAlert?.id === alertId) {
        setActiveAlert(null);
      }
    });

    return () => {
      socket.off('crisis-alert-received');
      socket.off('alert-resolved');
    };
  }, [socket, session?.user, podId, activeAlert, toast]);

  const handleSendMessage = () => {
    if (!messageText.trim() || !session?.user || !podId) return;

    sendMessage(
      messageText,
      session.user.id,
      session.user.username || '',
      session.user.image || null
    );
    setMessageText('');
  };

  const handleResolveAlert = () => {
    if (!socket || !podId || !activeAlert) return;

    socket.emit('alert-resolved', { podId, alertId: activeAlert.id });
    setActiveAlert(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!podId) {
    return (
      <div className="text-center py-12">
        <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">No Pod Yet</h2>
        <p className="text-muted-foreground">
          You'll be assigned to an accountability pod soon!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8" />
            {podName}
          </h1>
          <p className="text-muted-foreground">
            {members.length} member{members.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Badge variant={isConnected ? 'default' : 'secondary'}>
          {isConnected ? '🟢 Connected' : '🔴 Connecting...'}
        </Badge>
      </div>

      {/* Active Crisis Alert */}
      {activeAlert && (
        <AlertNotification alert={activeAlert} onResolve={handleResolveAlert} />
      )}

      {/* Pod Members */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pod Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 p-3 rounded-lg border bg-card"
              >
                <Avatar>
                  <AvatarImage src={member.avatarUrl || ''} alt={member.fullName} />
                  <AvatarFallback>
                    {member.fullName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{member.fullName}</p>
                  <p className="text-xs text-muted-foreground">
                    {member.currentStreak} day streak 🔥
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Group Chat</h2>
        <ChatWindow messages={messages} currentUserId={session?.user?.id || ''} />

        {/* Message Input */}
        <div className="flex gap-2">
          <Textarea
            placeholder="Send a message of support..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="min-h-[60px]"
          />
          <Button onClick={handleSendMessage} size="icon" className="h-[60px] w-[60px]">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
