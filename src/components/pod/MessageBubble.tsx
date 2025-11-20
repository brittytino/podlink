'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SocketMessage } from '@/types/socket';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCheck, Bot, Sparkles } from 'lucide-react';

interface MessageBubbleProps {
  message: SocketMessage & { isAI?: boolean };
  isOwn: boolean;
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
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

  return (
    <div
      className={cn(
        'flex gap-2 items-end',
        isOwnMessage ? 'justify-end' : 'justify-start'
      )}
    >
      {/* Avatar for other users and AI */}
      {!isOwnMessage && (
        <Avatar className={cn('h-9 w-9 mb-1 shadow-sm', isAI && 'ring-2 ring-primary/20')}>
          <AvatarImage src={message.avatarUrl || ''} alt={displayName} />
          <AvatarFallback
            className={cn(
              'text-sm',
              isAI ? 'bg-gradient-to-br from-primary/30 to-primary/10 text-primary' : 'bg-gradient-to-br from-primary/20 to-primary/10'
            )}
          >
            {isAI ? <Bot className="h-4 w-4" /> : displayName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          'flex flex-col max-w-[280px] sm:max-w-[340px] lg:max-w-[540px]',
          isOwnMessage ? 'items-end' : 'items-start'
        )}
      >
        {/* Username (only for other users and AI) */}
        {!isOwnMessage && (
          <div className="flex items-center gap-2 mb-1 px-1">
            <span className="text-xs font-medium text-muted-foreground">{displayName}</span>
            {isAI && (
              <div className="flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-primary" />
                <span className="text-xs text-primary font-medium">AI</span>
              </div>
            )}
          </div>
        )}

        {/* Message Bubble */}
        <div
          className={cn(
            'relative rounded-2xl px-4 py-3 shadow-sm max-w-full break-words transition-all duration-200',
            isOwnMessage
              ? 'bg-primary text-primary-foreground rounded-br-md'
              : isAI
              ? 'bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-bl-md'
              : 'bg-card border border-border rounded-bl-md',
            message.isCrisisResponse && 'ring-2 ring-destructive ring-offset-2'
          )}
        >
          {/* Crisis Response Indicator */}
          {message.isCrisisResponse && (
            <div
              className={cn(
                'flex items-center gap-1 mb-2 text-xs font-medium',
                isOwnMessage ? 'text-primary-foreground/80' : 'text-destructive'
              )}
            >
              <AlertCircle className="h-3 w-3" />
              Crisis Response
            </div>
          )}

          {/* Message Text */}
          <p className="text-sm leading-relaxed">{message.messageText}</p>

          {/* Timestamp and Status */}
          <div
            className={cn(
              'flex items-center gap-2 mt-2 justify-end text-xs',
              isOwnMessage ? 'text-primary-foreground/70' : isAI ? 'text-primary/70' : 'text-muted-foreground'
            )}
          >
            <span>{formatTime(message.createdAt)}</span>
            {/* Read receipt indicators for own messages */}
            {isOwnMessage && <CheckCheck className="h-3 w-3 text-blue-400" />}
            {/* AI indicator */}
            {isAI && <Bot className="h-3 w-3 opacity-60" />}
          </div>
        </div>
      </div>

      {/* Spacer for own messages to maintain consistent spacing */}
      {isOwnMessage && <div className="w-9" />}
    </div>
  );
}
