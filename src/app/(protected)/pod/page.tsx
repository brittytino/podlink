'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatWindow } from '@/components/pod/ChatWindow';
import { AlertNotification } from '@/components/pod/AlertNotification';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useSocket } from '@/hooks/useSocket';
import { usePodMessages } from '@/hooks/usePodMessages';
import { Send, Users, Loader2, AlertTriangle, Settings, Phone, Video, Search, MoreVertical, Smile, Paperclip, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface PodMember {
  id: string;
  username: string;
  fullName: string;
  displayName?: string; // Anonymous name for privacy
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
  const [showMembersList, setShowMembersList] = useState(false);
  const { toast } = useToast();

  const podId = session?.user?.podId;
  const { messages, sendMessage, isAITyping } = usePodMessages(podId || null);

  useEffect(() => {
    if (!session?.user?.podId) return;

    // Fetch pod members
    fetch(`/api/pods/members?podId=${session.user.podId}`)
      .then((res) => res.json())
      .then((data) => {
        setMembers(data.members || []);
        setPodName(data.podName || 'Your Pod');
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching pod members:', error);
        setLoading(false);
        toast({
          title: 'Error',
          description: 'Failed to load pod members',
          variant: 'destructive',
        });
      });

    // Fetch active alerts
    fetch(`/api/alerts/list?podId=${session.user.podId}`)
      .then((res) => res.json())
      .then((data) => {
        const active = data.alerts?.find((a: any) => a.status === 'ACTIVE');
        if (active) {
          const displayName = active.user?.displayName || active.user?.username;
          setActiveAlert({
            id: active.id,
            userId: active.userId,
            username: displayName, // Use displayName for anonymity
            message: active.message,
            createdAt: active.createdAt,
          });
        }
      })
      .catch((error) => {
        console.error('Error fetching alerts:', error);
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

  const handleSendMessage = async () => {
    if (!messageText.trim() || !session?.user || !podId) return;

    // Find current user's displayName from members
    const currentMember = members.find(m => m.id === session.user.id);
    const displayName = currentMember?.displayName || currentMember?.fullName;

    await sendMessage(
      messageText,
      session.user.id,
      session.user.username || '',
      session.user.image || null,
      displayName
    );
    setMessageText('');
  };

  const handleResolveAlert = () => {
    if (!socket || !podId || !activeAlert) return;

    socket.emit('alert-resolved', { podId, alertId: activeAlert.id });
    setActiveAlert(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading your pod...</p>
        </div>
      </div>
    );
  }

  if (!podId) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
        <div className="text-center space-y-6 max-w-md mx-auto p-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="h-10 w-10 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">No Pod Yet</h2>
            <p className="text-muted-foreground">
              You'll be assigned to an accountability pod soon! Hang tight while we find the perfect group for you.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-background to-muted/20 relative overflow-hidden">
      {/* Crisis Alert Banner */}
      {activeAlert && (
        <div className="absolute top-0 left-0 right-0 z-50">
          <AlertNotification alert={activeAlert} onResolve={handleResolveAlert} />
        </div>
      )}

      {/* Main Layout */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar - Members List (Desktop) */}
        <div className={cn(
          "hidden lg:flex flex-col bg-card border-r border-border w-80 transition-all duration-300",
          showMembersList ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}>
          {/* Sidebar Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">{podName}</h2>
              <Badge variant={isConnected ? 'default' : 'secondary'} className="text-xs">
                {isConnected ? '● Online' : '○ Offline'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {members.length} member{members.length !== 1 ? 's' : ''} active
            </p>
          </div>

          {/* Members List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {members.map((member) => {
              const displayName = member.displayName || member.fullName;
              const isCurrentUser = member.id === session?.user?.id;
              return (
                <div
                  key={member.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-muted/50 cursor-pointer",
                    isCurrentUser && "bg-primary/5 border border-primary/20"
                  )}
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={member.avatarUrl || ''} alt={displayName} />
                      <AvatarFallback className="text-sm font-medium">
                        {displayName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-card rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm truncate">{displayName}</p>
                      {isCurrentUser && (
                        <span className="text-xs text-primary font-medium">(You)</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {member.currentStreak} day streak
                      </span>
                      <span className="text-orange-500">🔥</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 bg-card/50 backdrop-blur-sm border-b border-border">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setShowMembersList(!showMembersList)}
              >
                <Users className="h-5 w-5" />
              </Button>
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border border-card rounded-full"></div>
                </div>
                <div>
                  <h1 className="font-semibold text-lg">{podName}</h1>
                  <p className="text-xs text-muted-foreground">
                    {members.length} member{members.length !== 1 ? 's' : ''} • {isConnected ? 'Online' : 'Connecting...'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Phone className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Video className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-hidden relative">
            <div className="h-full overflow-y-auto px-4 lg:px-6 py-4 bg-gradient-to-b from-muted/5 to-transparent chat-container custom-scrollbar">
              <ChatWindow 
                messages={messages} 
                currentUserId={session?.user?.id || ''} 
                isAITyping={isAITyping}
              />
              
              {messages.length === 0 && (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center space-y-4 max-w-sm">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center mx-auto">
                      <Users className="h-10 w-10 text-primary/50" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">Welcome to your pod!</h3>
                      <p className="text-sm text-muted-foreground">
                        Start the conversation and connect with your accountability partners
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Message Input */}
          <div className="p-4 bg-card/50 backdrop-blur-sm border-t border-border">
            <div className="flex items-center gap-3 max-w-4xl mx-auto">
              <Button variant="ghost" size="icon" className="hidden sm:flex text-muted-foreground">
                <Plus className="h-5 w-5" />
              </Button>
              
              <div className="flex-1 relative">
                <Input
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pr-20 bg-muted/50 border-muted focus:border-primary/50 rounded-full py-3 px-4 text-sm resize-none transition-all duration-200"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                    <Smile className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hidden sm:flex">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button 
                onClick={handleSendMessage}
                disabled={!messageText.trim()}
                size="icon"
                className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl disabled:opacity-50 transition-all duration-200"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Members Overlay */}
      {showMembersList && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setShowMembersList(false)}
        >
          <div 
            className="w-80 h-full bg-card border-r border-border"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile sidebar content - same as desktop */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg">{podName}</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowMembersList(false)}
                >
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {members.length} member{members.length !== 1 ? 's' : ''} active
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {members.map((member) => {
                const displayName = member.displayName || member.fullName;
                const isCurrentUser = member.id === session?.user?.id;
                return (
                  <div
                    key={member.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl transition-all duration-200",
                      isCurrentUser && "bg-primary/5 border border-primary/20"
                    )}
                  >
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.avatarUrl || ''} alt={displayName} />
                        <AvatarFallback className="text-sm font-medium">
                          {displayName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-card rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm truncate">{displayName}</p>
                        {isCurrentUser && (
                          <span className="text-xs text-primary font-medium">(You)</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {member.currentStreak} day streak
                        </span>
                        <span className="text-orange-500">🔥</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
