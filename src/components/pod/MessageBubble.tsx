'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SocketMessage } from '@/types/socket';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

interface MessageBubbleProps {
  message: SocketMessage;
  isOwn: boolean;
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  return (
    <div className={cn('flex gap-3', isOwn && 'flex-row-reverse')}>
      <Avatar className="h-8 w-8">
        <AvatarImage src={message.avatarUrl || ''} alt={message.username} />
        <AvatarFallback>
          {message.username.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className={cn('flex flex-col gap-1', isOwn && 'items-end')}>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            {message.username}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDate(message.createdAt)}
          </span>
        </div>

        <div
          className={cn(
            'rounded-lg px-4 py-2 max-w-[300px] break-words',
            isOwn
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted',
            message.isCrisisResponse && 'border-2 border-red-500'
          )}
        >
          {message.isCrisisResponse && (
            <div className="flex items-center gap-1 mb-1 text-xs font-medium text-red-600">
              <AlertCircle className="h-3 w-3" />
              Crisis Response
            </div>
          )}
          <p className="text-sm">{message.messageText}</p>
        </div>
      </div>
    </div>
  );
}
