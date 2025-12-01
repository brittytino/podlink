'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { SocketMessage } from '@/types/socket';
import { cn } from '@/lib/utils';
import { AlertCircle, Check, CheckCheck, Bot, Sparkles, Smile, ChevronDown, Flag, Copy, Reply, Trash2, MoreVertical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MessageBubbleProps {
  message: SocketMessage & { 
    isAI?: boolean;
    reactions?: Array<{ emoji: string; count: number; userIds: string[] }>;
    isDeleted?: boolean;
  };
  isOwn: boolean;
  currentUserId?: string;
  onReactionAdd?: (messageId: string, emoji: string) => void;
  onReport?: (messageId: string) => void;
}

const QUICK_REACTIONS = ['👍', '❤️', '😊', '🎉', '🙏', '💪'];

export function MessageBubble({ message, isOwn, currentUserId, onReactionAdd, onReport }: MessageBubbleProps) {
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { toast } = useToast();
  const displayName = message.displayName || message.username;
  const isAI = message.isAI || false;

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // AI messages are never "own" messages
  const isOwnMessage = isOwn && !isAI;

  const handleReaction = (emoji: string) => {
    if (onReactionAdd) {
      onReactionAdd(message.id, emoji);
    }
    setShowReactionPicker(false);
  };

  const handleReport = () => {
    if (onReport) {
      onReport(message.id);
      toast({
        title: 'Message Reported',
        description: 'Thank you for helping keep our community safe.',
      });
    }
    setShowMenu(false);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(message.messageText);
    toast({
      title: 'Copied',
      description: 'Message copied to clipboard',
    });
    setShowMenu(false);
  };

  // If message is deleted, show placeholder
  if (message.isDeleted) {
    return (
      <div className={cn('flex gap-3 mb-1', isOwnMessage ? 'justify-end' : 'justify-start')}>
        {!isOwnMessage && <div className="w-8" />}
        <div className="flex flex-col max-w-[75%] sm:max-w-[65%]">
          <div className="italic text-xs text-muted-foreground bg-muted/30 rounded-lg px-3 py-2 backdrop-blur-sm">
            <span className="opacity-60">🗑️ This message was deleted</span>
          </div>
        </div>
        {isOwnMessage && <div className="w-8" />}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex gap-3 mb-1.5 group/message',
        isOwnMessage ? 'justify-end' : 'justify-start'
      )}
    >
      {/* Avatar for other users and AI */}
      {!isOwnMessage && (
        <Avatar className={cn('h-8 w-8 mt-1 flex-shrink-0 shadow-sm border-2', isAI ? 'border-primary/30' : 'border-transparent')}>
          <AvatarImage src={message.avatarUrl || ''} alt={displayName} />
          <AvatarFallback
            className={cn(
              'text-xs font-semibold',
              isAI ? 'bg-gradient-to-br from-primary/40 to-primary/20 text-primary' : 'bg-gradient-to-br from-slate-200 to-slate-100 text-slate-700'
            )}
          >
            {isAI ? <Bot className="h-4 w-4" /> : displayName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          'flex flex-col max-w-[75%] sm:max-w-[65%] relative',
          isOwnMessage ? 'items-end' : 'items-start'
        )}
      >
        {/* Username (only for other users and AI) */}
        {!isOwnMessage && (
          <div className="flex items-center gap-1.5 mb-1 px-2">
            <span className="text-xs font-semibold text-foreground/70">{displayName}</span>
            {isAI && (
              <div className="flex items-center gap-1 bg-primary/10 px-1.5 py-0.5 rounded-full">
                <Sparkles className="h-2.5 w-2.5 text-primary" />
                <span className="text-[10px] text-primary font-bold uppercase tracking-wide">AI</span>
              </div>
            )}
          </div>
        )}

        {/* Message Bubble Container with WhatsApp-style dropdown */}
        <div className="relative w-full">
          <div className="flex items-start gap-1">
            {/* Message Bubble */}
            <div
              className={cn(
                'relative rounded-lg px-3 py-2 shadow-sm max-w-full break-words transition-all duration-200',
                isOwnMessage
                  ? 'bg-primary text-primary-foreground rounded-br-sm'
                  : isAI
                  ? 'bg-gradient-to-br from-primary/8 to-primary/5 border border-primary/15 rounded-bl-sm'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-bl-sm',
                message.isCrisisResponse && 'ring-2 ring-red-500/50 ring-offset-1'
              )}
            >
              {/* Crisis Response Indicator */}
              {message.isCrisisResponse && (
                <div
                  className={cn(
                    'flex items-center gap-1.5 mb-2 text-xs font-semibold',
                    isOwnMessage ? 'text-red-100' : 'text-red-600 dark:text-red-400'
                  )}
                >
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>Crisis Response</span>
                </div>
              )}

              {/* Image Attachment */}
              {(message as any).imageUrl && (
                <div className="mb-2">
                  <img
                    src={(message as any).imageUrl}
                    alt="Shared image"
                    className="rounded-lg max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                    style={{ maxHeight: '400px', objectFit: 'contain' }}
                    onClick={() => window.open((message as any).imageUrl, '_blank')}
                  />
                </div>
              )}

              {/* Message Text */}
              {message.messageText && (
                <p className={cn(
                  'text-[14px] leading-[1.4] whitespace-pre-wrap',
                  isOwnMessage ? 'text-primary-foreground' : 'text-foreground'
                )}>
                  {message.messageText}
                </p>
              )}

              {/* Timestamp and Status - WhatsApp Style */}
              <div
                className={cn(
                  'flex items-center gap-1 mt-1 float-right ml-2',
                  isOwnMessage ? 'text-primary-foreground/60' : isAI ? 'text-primary/60' : 'text-muted-foreground'
                )}
              >
                <span className="text-[11px] font-medium">{formatTime(message.createdAt)}</span>
                {isOwnMessage && (
                  <CheckCheck className="h-3.5 w-3.5 text-blue-400" />
                )}
                {isAI && (
                  <Bot className="h-3 w-3 opacity-50" />
                )}
              </div>
              <div className="clear-both" />
            </div>

            {/* WhatsApp-style Dropdown Menu - Right side of message */}
            <DropdownMenu open={showMenu} onOpenChange={setShowMenu}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'h-7 w-7 p-0 rounded-full opacity-0 group-hover/message:opacity-100 transition-opacity flex-shrink-0',
                    'hover:bg-slate-100 dark:hover:bg-slate-800',
                    showMenu && 'opacity-100'
                  )}
                >
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align={isOwnMessage ? 'end' : 'start'} 
                className="w-48 shadow-lg border-slate-200 dark:border-slate-700"
              >
                {/* Reaction Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                      <Smile className="h-4 w-4 mr-3 text-amber-500" />
                      <span>React</span>
                    </DropdownMenuItem>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="right" align="start" className="w-fit p-2">
                    <div className="flex gap-1">
                      {QUICK_REACTIONS.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => handleReaction(emoji)}
                          className="text-xl hover:scale-125 active:scale-110 transition-transform duration-150 p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenuItem onClick={handleCopyText} className="cursor-pointer">
                  <Copy className="h-4 w-4 mr-3 text-blue-500" />
                  <span>Copy Text</span>
                </DropdownMenuItem>

                {!isOwnMessage && !isAI && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleReport} className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400">
                      <Flag className="h-4 w-4 mr-3" />
                      <span>Report Message</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Reactions Display - WhatsApp Style */}
          {message.reactions && message.reactions.length > 0 && (
            <div className={cn(
              'flex flex-wrap gap-1 mt-1',
              isOwnMessage ? 'justify-end' : 'justify-start'
            )}>
              {message.reactions.map((reaction) => {
                const hasReacted = currentUserId && reaction.userIds.includes(currentUserId);
                return (
                  <button
                    key={reaction.emoji}
                    onClick={() => handleReaction(reaction.emoji)}
                    className={cn(
                      'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-all duration-200 shadow-sm',
                      hasReacted
                        ? 'bg-primary/15 border-2 border-primary/40 scale-105'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600'
                    )}
                  >
                    <span className="text-base leading-none">{reaction.emoji}</span>
                    <span className={cn(
                      'font-semibold text-[11px]',
                      hasReacted ? 'text-primary' : 'text-muted-foreground'
                    )}>
                      {reaction.count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Spacer for own messages to maintain layout */}
      {isOwnMessage && <div className="w-8" />}
    </div>
  );
}
