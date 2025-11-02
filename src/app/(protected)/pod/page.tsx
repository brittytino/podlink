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
import { Send, Users, Loader2, Smile, Paperclip, Menu, MessageCircle, MoreVertical } from 'lucide-react';
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
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 sm:h-8 sm:w-8" />
            {podName}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            {members.length} member{members.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Badge variant={isConnected ? 'default' : 'secondary'} className="text-xs sm:text-sm">
          {isConnected ? '🟢 Connected' : '🔴 Connecting...'}
        </Badge>
      </div>

      {/* Active Crisis Alert */}
      {activeAlert && (
        <AlertNotification alert={activeAlert} onResolve={handleResolveAlert} />
      )}

      {/* Pod Members */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">Pod Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:shadow-sm transition-shadow"
              >
                <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                  <AvatarImage src={member.avatarUrl || ''} alt={member.fullName} />
                  <AvatarFallback className="text-sm sm:text-base">
                    {member.fullName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm sm:text-base truncate">{member.fullName}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {member.currentStreak} day streak 🔥
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-card md:rounded-2xl md:shadow-lg overflow-hidden min-h-0">
          {/* Chat Header */}
          <div className="flex-shrink-0 px-4 py-3 bg-gradient-to-r from-muted/30 to-transparent border-b backdrop-blur-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-sm md:text-base truncate">Group Chat</h2>
                  <p className="text-xs text-muted-foreground truncate">
                    {members.length} member{members.length !== 1 ? 's' : ''} • {messages.length} message{messages.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl flex-shrink-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto px-3 md:px-4 lg:px-6 py-4 bg-gradient-to-b from-muted/5 to-transparent custom-scrollbar">
            <ChatWindow messages={messages} currentUserId={session?.user?.id || ''} />
            
            {messages.length === 0 && (
              <div className="h-full flex items-center justify-center p-4">
                <div className="text-center space-y-3 max-w-sm">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center mx-auto">
                    <MessageCircle className="h-8 w-8 text-primary/50" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-muted-foreground text-sm md:text-base">No messages yet</p>
                    <p className="text-xs md:text-sm text-muted-foreground/70">
                      Start the conversation by sending a message below
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Message Input Area */}
          <div className="flex-shrink-0 p-3 md:p-4 bg-muted/30 border-t backdrop-blur-sm safe-area-inset-bottom">
            <div className="flex items-end gap-2 max-w-4xl mx-auto">
              {/* Input Container */}
              <div className="flex-1 bg-card rounded-2xl border-2 border-muted focus-within:border-primary/50 transition-all shadow-sm">
                <div className="flex items-end gap-1 md:gap-2 p-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 rounded-xl flex-shrink-0 hover:bg-muted hidden sm:flex"
                  >
                    <Smile className="h-5 w-5 text-muted-foreground" />
                  </Button>
                  
                  <Textarea
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="flex-1 min-h-[40px] max-h-[120px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-2 text-sm md:text-base placeholder:text-muted-foreground/60"
                    rows={1}
                  />
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 rounded-xl flex-shrink-0 hover:bg-muted hidden sm:flex"
                  >
                    <Paperclip className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </div>
              </div>

              {/* Send Button */}
              <Button 
                onClick={handleSendMessage}
                disabled={!messageText.trim()}
                size="icon"
                className="h-[52px] w-[52px] rounded-2xl bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Hint Text - Hidden on mobile */}
            <p className="hidden sm:block text-xs text-muted-foreground/70 mt-2 text-center">
              Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">Enter</kbd> to send • <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">Shift</kbd> + <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">Enter</kbd> for new line
            </p>
          </div>
        </div>
    </div>
  );
}
