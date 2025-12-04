'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatWindow } from '@/components/pod/ChatWindow';
import { AlertNotification } from '@/components/pod/AlertNotification';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useSocket } from '@/hooks/useSocket';
import { usePodMessages } from '@/hooks/usePodMessages';
import { Send, Users, Loader2, Phone, Video, Search, MoreVertical, Smile, Paperclip, Plus, X, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { validateMessage } from '@/lib/content-moderation';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

interface PodMember {
  id: string;
  username: string;
  fullName: string;
  displayName?: string;
  avatarUrl: string | null;
  currentStreak: number;
  isOnline?: boolean; // Track online status
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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set()); // Track online user IDs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const podId = session?.user?.podId;
  const { messages, sendMessage, isAITyping, updateMessageReactions, deleteMessage } = usePodMessages(podId || null);

  useEffect(() => {
    if (!session?.user?.podId) return;

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

    fetch(`/api/alerts/list?podId=${session.user.podId}`)
      .then((res) => res.json())
      .then((data) => {
        const active = data.alerts?.find((a: any) => a.status === 'ACTIVE');
        if (active) {
          const displayName = active.user?.displayName || active.user?.username;
          setActiveAlert({
            id: active.id,
            userId: active.userId,
            username: displayName,
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

    socket.emit('join-pod', {
      userId: session.user.id,
      podId,
      username: session.user.username,
    });

    // Receive initial list of online users when joining
    socket.on('online-users', ({ userIds }: { userIds: string[] }) => {
      setOnlineUsers(new Set(userIds));
      console.log('Initial online users:', userIds.length);
    });

    // Handle user online status
    socket.on('user-online', ({ userId }: { userId: string }) => {
      setOnlineUsers((prev) => new Set(prev).add(userId));
      console.log('User came online:', userId);
    });

    // Handle user offline status
    socket.on('user-offline', ({ userId }: { userId: string }) => {
      setOnlineUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
      console.log('User went offline:', userId);
    });

    socket.on('crisis-alert-received', (alert: CrisisAlert) => {
      // Don't show alert to the sender
      if (alert.userId !== session?.user?.id) {
        setActiveAlert(alert);
        toast({
          title: '🚨 Crisis Alert!',
          description: `${alert.username} needs help right now!`,
          variant: 'destructive',
        });
      }
    });

    socket.on('alert-resolved', ({ alertId }: { alertId: string }) => {
      if (activeAlert?.id === alertId) {
        setActiveAlert(null);
      }
    });

    socket.on('message-reaction', ({ messageId, reactions }: { messageId: string; reactions: any }) => {
      updateMessageReactions(messageId, reactions);
    });

    socket.on('message-deleted', ({ messageId }: { messageId: string }) => {
      deleteMessage(messageId);
    });

    return () => {
      socket.off('online-users');
      socket.off('user-online');
      socket.off('user-offline');
      socket.off('crisis-alert-received');
      socket.off('alert-resolved');
      socket.off('message-reaction');
      socket.off('message-deleted');
    };
  }, [socket, session?.user, podId, activeAlert, toast, updateMessageReactions, deleteMessage]);

  const handleSendMessage = async () => {
    if ((!messageText.trim() && !selectedImage) || !session?.user || !podId) return;

    let imageUrl: string | null = null;

    // Upload image if selected
    if (selectedImage) {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append('image', selectedImage);

        const uploadResponse = await fetch('/api/pods/messages/upload-image', {
          method: 'POST',
          body: formData,
        });

        const uploadData = await uploadResponse.json();

        if (!uploadData.success) {
          toast({
            title: 'Upload Failed',
            description: uploadData.error || 'Failed to upload image',
            variant: 'destructive',
          });
          setUploading(false);
          return;
        }

        imageUrl = uploadData.imageUrl;
      } catch (error) {
        console.error('Error uploading image:', error);
        toast({
          title: 'Upload Error',
          description: 'Failed to upload image',
          variant: 'destructive',
        });
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    // Validate message text if present
    if (messageText.trim()) {
      const validation = await validateMessage(messageText);
      if (!validation.isValid) {
        toast({
          title: 'Message Blocked',
          description: validation.error || 'Your message contains inappropriate content.',
          variant: 'destructive',
        });
        setMessageText('');
        return;
      }
    }

    const currentMember = members.find(m => m.id === session.user.id);
    const displayName = currentMember?.displayName || currentMember?.fullName;

    await sendMessage(
      messageText || '',
      session.user.id,
      session.user.username || '',
      session.user.image || null,
      displayName,
      imageUrl
    );
    
    setMessageText('');
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessageText(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid File',
        description: 'Please select an image file',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description: 'Image must be less than 5MB',
        variant: 'destructive',
      });
      return;
    }

    setSelectedImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleReactionAdd = useCallback(async (messageId: string, emoji: string) => {
    try {
      const response = await fetch('/api/pods/messages/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId, emoji }),
      });

      const data = await response.json();

      if (data.success) {
        const reactionsResponse = await fetch(`/api/pods/messages/reactions?messageId=${messageId}`);
        const reactionsData = await reactionsResponse.json();

        updateMessageReactions(messageId, reactionsData.reactions);

        if (socket && podId) {
          socket.emit('message-reaction', {
            podId,
            messageId,
            reactions: reactionsData.reactions,
          });
        }
      }
    } catch (error) {
      console.error('Error adding reaction:', error);
      toast({
        title: 'Error',
        description: 'Failed to add reaction',
        variant: 'destructive',
      });
    }
  }, [socket, podId, toast, updateMessageReactions]);

  const handleReport = useCallback(async (messageId: string) => {
    try {
      const response = await fetch('/api/pods/messages/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId, reason: 'Inappropriate content' }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: data.messageDeleted ? 'Message Removed' : 'Report Submitted',
          description: data.message,
          variant: data.messageDeleted ? 'default' : 'default',
        });

        if (data.messageDeleted) {
          deleteMessage(messageId);

          if (socket && podId) {
            socket.emit('message-deleted', { podId, messageId });
          }
        }
      }
    } catch (error) {
      console.error('Error reporting message:', error);
      toast({
        title: 'Error',
        description: 'Failed to report message',
        variant: 'destructive',
      });
    }
  }, [socket, podId, toast, deleteMessage]);

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
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-indigo-600" />
          <p className="text-sm text-slate-600">Loading pod...</p>
        </div>
      </div>
    );
  }

  if (!podId) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
            <Users className="h-10 w-10 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-xl text-slate-900 mb-2">No Pod Assigned</h3>
            <p className="text-sm text-slate-600">Complete your onboarding to join a pod.</p>
          </div>
          <Button onClick={() => (window.location.href = '/onboarding')} className="bg-indigo-600 hover:bg-indigo-700">
            Complete Onboarding
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 top-[56px] sm:top-[64px] flex bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 overflow-hidden">
      {activeAlert && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
          <AlertNotification alert={activeAlert} onResolve={handleResolveAlert} />
        </div>
      )}

      {/* Desktop Sidebar - Members List */}
      <aside
        className={cn(
          "hidden md:flex flex-col bg-white border-r border-slate-200/80 shadow-sm",
          "w-[340px] lg:w-[380px] xl:w-[420px] flex-shrink-0"
        )}
      >
        <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-white">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-bold text-xl text-slate-900">{podName}</h2>
              <p className="text-sm text-slate-600 font-medium mt-1">
                {members.length} member{members.length !== 1 ? 's' : ''}
              </p>
            </div>
            
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-3 space-y-2">
            {members.map((member) => {
              const displayName = member.displayName || member.fullName;
              const isCurrentUser = member.id === session?.user?.id;
              const isUserOnline = onlineUsers.has(member.id) || isCurrentUser; // Current user is always "online" to themselves
              
              return (
                <div
                  key={member.id}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-2xl transition-all hover:bg-indigo-50/60 cursor-pointer group",
                    isCurrentUser && "bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 shadow-sm"
                  )}
                >
                  <div className="relative flex-shrink-0">
                    <Avatar className="h-14 w-14 ring-2 ring-white shadow-lg group-hover:ring-indigo-200 transition-all">
                      <AvatarImage src={member.avatarUrl || ''} alt={displayName} />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-blue-500 text-white font-bold text-lg">
                        {displayName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {/* Real-time Online/Offline Status Indicator */}
                    <div 
                      className={cn(
                        "absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full shadow-sm transition-all",
                        isUserOnline ? "bg-emerald-500" : "bg-slate-400"
                      )}
                      title={isUserOnline ? "Online" : "Offline"}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-base truncate text-slate-900">{displayName}</p>
                      {isCurrentUser && <span className="text-xs text-indigo-600 font-semibold px-2 py-0.5 bg-indigo-100 rounded-full">(You)</span>}
                      {isUserOnline && !isCurrentUser && (
                        <span className="text-xs text-emerald-600 font-semibold">● Online</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-semibold">{member.currentStreak} day streak</span>
                      <span className="text-base">🔥</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Header */}
        <div className="flex items-center justify-between px-6 lg:px-8 py-5 bg-white border-b border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex-shrink-0"
              onClick={() => setShowMembersList(!showMembersList)}
            >
              <Users className="h-6 w-6" />
            </Button>

            <div className="flex items-center gap-4 min-w-0 flex-1">
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center ring-2 ring-white shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="font-bold text-lg lg:text-xl text-slate-900 truncate">{podName}</h1>
                <p className="text-xs lg:text-sm text-slate-600 truncate font-medium">
                  {onlineUsers.size > 0 ? `${onlineUsers.size} online` : 'No one online'} • {members.length} total • {isConnected ? '✓ Connected' : 'Connecting...'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Button variant="ghost" size="icon" className="hidden lg:flex text-slate-600 hover:text-slate-900 hover:bg-slate-100">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden md:flex text-slate-600 hover:text-slate-900 hover:bg-slate-100">
              <Phone className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden md:flex text-slate-600 hover:text-slate-900 hover:bg-slate-100">
              <Video className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Messages Area - WhatsApp style background */}
        <div 
          className="flex-1 overflow-y-auto px-6 lg:px-12 xl:px-16 py-6"
          style={{
            background: 'linear-gradient(to bottom, #f0f2f5, #e9ebf0)',
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d1d5db' fill-opacity='0.05'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        >
          <div className="max-w-[1400px] mx-auto">
            <ChatWindow
              messages={messages}
              currentUserId={session?.user?.id || ''}
              isAITyping={isAITyping}
              onReactionAdd={handleReactionAdd}
              onReport={handleReport}
            />

            {messages.length === 0 && (
              <div className="flex items-center justify-center py-24">
                <div className="text-center space-y-5 max-w-md bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-slate-200">
                  <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full flex items-center justify-center mx-auto shadow-2xl ring-4 ring-white">
                    <Users className="h-12 w-12 text-white" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-bold text-2xl text-slate-900">Welcome to {podName}!</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Start the conversation with your accountability partners. Share your journey, support each other, and grow together.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="px-6 lg:px-12 xl:px-16 py-5 bg-white border-t border-slate-200 shadow-xl">
          {/* Image Preview */}
          {imagePreview && (
            <div className="mb-3 max-w-[1400px] mx-auto">
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="rounded-lg border-2 border-indigo-200 max-h-40 object-contain"
                />
                <Button
                  onClick={removeImage}
                  size="icon"
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 max-w-[1400px] mx-auto">
            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => fileInputRef.current?.click()}
              className="hidden md:flex text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex-shrink-0 h-12 w-12 rounded-full"
            >
              <ImageIcon className="h-6 w-6" />
            </Button>

            <div className="flex-1 relative">
              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="absolute bottom-full left-0 mb-2 z-50">
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}

              <Input
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pr-24 bg-slate-50 border-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 text-slate-900 placeholder:text-slate-500 rounded-xl py-6 px-5 text-base transition-all shadow-sm"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="h-9 w-9 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full"
                >
                  <Smile className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => fileInputRef.current?.click()}
                  className="h-9 w-9 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full md:hidden"
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <Button
              onClick={handleSendMessage}
              disabled={(!messageText.trim() && !selectedImage) || uploading}
              size="icon"
              className="h-14 w-14 rounded-full bg-gradient-to-br from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50 shadow-lg hover:shadow-xl transition-all flex-shrink-0"
            >
              {uploading ? (
                <Loader2 className="h-6 w-6 text-white animate-spin" />
              ) : (
                <Send className="h-6 w-6 text-white" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Members Overlay */}
      {showMembersList && (
        <div className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex animate-in fade-in duration-200" onClick={() => setShowMembersList(false)}>
          <div className="w-[85vw] max-w-[360px] h-full bg-white shadow-2xl animate-in slide-in-from-left duration-300" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-white">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="font-bold text-xl text-slate-900">{podName}</h2>
                  <p className="text-sm text-slate-600 font-medium mt-1">{members.length} members</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowMembersList(false)} 
                  className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full"
                >
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="overflow-y-auto p-3 space-y-2" style={{ height: 'calc(100vh - 96px)' }}>
              {members.map((member) => {
                const displayName = member.displayName || member.fullName;
                const isCurrentUser = member.id === session?.user?.id;
                return (
                  <div
                    key={member.id}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-2xl transition-all",
                      isCurrentUser && "bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200"
                    )}
                  >
                    <Avatar className="h-14 w-14 ring-2 ring-white shadow-lg">
                      <AvatarImage src={member.avatarUrl || ''} alt={displayName} />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-blue-500 text-white font-bold text-lg">
                        {displayName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-base text-slate-900">{displayName}</p>
                        {isCurrentUser && <span className="text-xs text-indigo-600 font-semibold px-2 py-0.5 bg-indigo-100 rounded-full">(You)</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 font-semibold">{member.currentStreak} day streak</span>
                        <span className="text-base">🔥</span>
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
