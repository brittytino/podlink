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
import { Send, Users, Loader2, Phone, Video, Search, MoreVertical, Smile, Paperclip, Plus } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-6">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-indigo-600" />
          <p className="text-sm text-slate-500">Loading your pod...</p>
        </div>
      </div>
    );
  }

  if (!podId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-6">
        <div className="text-center space-y-6 max-w-md mx-auto p-6 bg-white/60 backdrop-blur-md border border-slate-200 rounded-2xl shadow-sm">
          <div className="w-24 h-24 mx-auto rounded-full bg-indigo-50 flex items-center justify-center">
            <Users className="h-12 w-12 text-indigo-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">No Pod Yet</h2>
            <p className="text-sm text-slate-600">
              You'll be assigned to an accountability pod soon! We'll match you with a supportive group — hang tight.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 relative overflow-hidden">
      {/* Crisis Alert Banner */}
      {activeAlert && (
        <div className="absolute top-6 left-0 right-0 z-50 flex justify-center px-4 sm:px-6 lg:px-12">
          <div className="w-full max-w-[1400px]">
            <AlertNotification alert={activeAlert} onResolve={handleResolveAlert} />
          </div>
        </div>
      )}

      {/* Main Layout — center content and allow it to be wide on large screens */}
      <main className="flex-1 w-full">
        <div className="w-full mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10 py-8">
          <div className="flex gap-6 items-stretch">
            {/* Sidebar - Members List (Desktop) */}
            <aside
              className={cn(
                "hidden xl:flex flex-col bg-white/60 backdrop-blur-sm border border-slate-200 rounded-2xl overflow-hidden flex-shrink-0 transition-all duration-300",
                showMembersList ? "translate-x-0" : "-translate-x-0"
              )}
              style={{ minWidth: 320, maxWidth: 420 }}
              aria-label="Pod members"
            >
              {/* Sidebar Header */}
              <div className="p-5 border-b border-slate-100 bg-gradient-to-b from-white/80 to-white/60">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-lg truncate text-slate-900">{podName}</h2>
                  <Badge variant={isConnected ? 'default' : 'secondary'} className="text-xs">
                    {isConnected ? '● Online' : '○ Offline'}
                  </Badge>
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  {members.length} member{members.length !== 1 ? 's' : ''} active
                </p>
              </div>

              {/* Members List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2 no-scrollbar">
                {members.map((member) => {
                  const displayName = member.displayName || member.fullName;
                  const isCurrentUser = member.id === session?.user?.id;
                  return (
                    <div
                      key={member.id}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 hover:bg-slate-100 cursor-pointer",
                        isCurrentUser && "bg-indigo-50 border border-indigo-100"
                      )}
                    >
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={member.avatarUrl || ''} alt={displayName} />
                          <AvatarFallback className="text-sm font-medium">
                            {displayName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm truncate text-slate-900">{displayName}</p>
                          {isCurrentUser && (
                            <span className="text-xs text-indigo-600 font-medium">(You)</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                          <span>{member.currentStreak} day{member.currentStreak !== 1 ? 's' : ''} streak</span>
                          <span className="text-orange-500">🔥</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </aside>

            {/* Main Chat Area */}
            <section className="flex-1 flex flex-col rounded-2xl overflow-hidden border border-slate-200 bg-white/80 shadow-sm">
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 sm:p-5 bg-white/70 backdrop-blur-sm border-b border-slate-100 sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="xl:hidden"
                    onClick={() => setShowMembersList(!showMembersList)}
                    aria-label="Toggle members list"
                  >
                    <Users className="h-5 w-5" />
                  </Button>

                  <div className="flex items-center gap-3">
                    <div className="relative flex items-center">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-50 to-indigo-25 flex items-center justify-center">
                        <Users className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                    </div>
                    <div className="min-w-0">
                      <h1 className="font-extrabold text-lg sm:text-xl truncate text-slate-900">{podName}</h1>
                      <p className="text-xs text-slate-500 truncate">
                        {members.length} member{members.length !== 1 ? 's' : ''} • {isConnected ? 'Online' : 'Connecting...'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="hidden sm:flex" aria-label="Search">
                    <Search className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="hidden sm:flex" aria-label="Call">
                    <Phone className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="hidden sm:flex" aria-label="Video call">
                    <Video className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" aria-label="More options">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-hidden relative">
                <div className="h-full overflow-y-auto px-4 md:px-6 lg:px-10 py-6 bg-gradient-to-b from-slate-50 to-transparent chat-container no-scrollbar">
                  <ChatWindow
                    messages={messages}
                    currentUserId={session?.user?.id || ''}
                    isAITyping={isAITyping}
                  />

                  {messages.length === 0 && (
                    <div className="h-full flex items-center justify-center py-12">
                      <div className="text-center space-y-4 max-w-sm">
                        <div className="w-24 h-24 bg-gradient-to-br from-indigo-50 to-indigo-25 rounded-full flex items-center justify-center mx-auto">
                          <Users className="h-12 w-12 text-indigo-400" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-semibold text-lg text-slate-900">Welcome to your pod!</h3>
                          <p className="text-sm text-slate-500">
                            Start the conversation and connect with your accountability partners.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Message Input */}
              <div className="p-4 sm:p-5 bg-white/75 backdrop-blur-sm border-t border-slate-100">
                <div className="flex items-center gap-3 max-w-[1200px] mx-auto">
                  <Button variant="ghost" size="icon" className="hidden sm:flex text-slate-500" aria-label="Add">
                    <Plus className="h-5 w-5" />
                  </Button>

                  <div className="flex-1 relative">
                    <Input
                      placeholder="Type a message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="pr-20 bg-slate-50 border-slate-200 focus:border-indigo-400 rounded-full py-3 px-4 text-sm transition-shadow duration-200 shadow-sm"
                      aria-label="Message input"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-700" aria-label="Emojis">
                        <Smile className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-700 hidden sm:flex" aria-label="Attach file">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    size="icon"
                    className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 shadow-lg disabled:opacity-50 transition-transform transform hover:-translate-y-0.5"
                    aria-label="Send message"
                  >
                    <Send className="h-5 w-5 text-white" />
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Mobile Members Overlay */}
      {showMembersList && (
        <div
          className="xl:hidden fixed inset-0 bg-black/40 z-40 flex"
          onClick={() => setShowMembersList(false)}
        >
          <div
            className="w-[min(92vw,360px)] h-full bg-white/95 border-r border-slate-200 left-0 shadow-xl transform transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Members list"
          >
            {/* Mobile sidebar content - same as desktop */}
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg truncate text-slate-900">{podName}</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowMembersList(false)}
                  aria-label="Close members list"
                >
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                {members.length} member{members.length !== 1 ? 's' : ''} active
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
              {members.map((member) => {
                const displayName = member.displayName || member.fullName;
                const isCurrentUser = member.id === session?.user?.id;
                return (
                  <div
                    key={member.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg transition-colors duration-200",
                      isCurrentUser && "bg-indigo-50 border border-indigo-100"
                    )}
                  >
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.avatarUrl || ''} alt={displayName} />
                        <AvatarFallback className="text-sm font-medium">
                          {displayName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm truncate text-slate-900">{displayName}</p>
                        {isCurrentUser && (
                          <span className="text-xs text-indigo-600 font-medium">(You)</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs text-slate-500">
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

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap');

        :global(html, body) {
          font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
        }

        /* Floating animations (subtle) */
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 400ms ease-out;
        }

        /* small helper to hide scrollbar but allow scrolling with decent accessibility */
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: thin;
        }
        .no-scrollbar::-webkit-scrollbar {
          height: 8px;
          width: 8px;
        }
        .no-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(15, 23, 42, 0.08);
          border-radius: 999px;
        }

        /* chat container tweaks */
        .chat-container {
          min-height: 320px;
          display: flex;
          flex-direction: column;
        }

        /* small improvement for very wide screens: keep chat centered with breathing room */
        @media (min-width: 1800px) {
          main > div { padding-left: 8rem; padding-right: 8rem; }
        }

      `}</style>
    </div>
  );
}
