'use client';

import { useEffect, useRef, useState } from 'react';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { SocketMessage } from '@/types/socket';

interface ChatWindowProps {
  messages: SocketMessage[];
  currentUserId: string;
  isAITyping?: boolean;
}

export function ChatWindow({ messages, currentUserId, isAITyping }: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Group messages by date
  const groupedMessages = messages.reduce((groups: { [date: string]: SocketMessage[] }, message) => {
    const messageDate = new Date(message.createdAt).toDateString();
    if (!groups[messageDate]) {
      groups[messageDate] = [];
    }
    groups[messageDate].push(message);
    return groups;
  }, {});

  const formatDateLabel = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  return (
    <div className="space-y-4 pb-4">
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date} className="space-y-3">
          {/* Date Separator */}
          <div className="flex justify-center py-2">
            <div className="bg-muted/80 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-xs font-medium text-muted-foreground">
                {formatDateLabel(date)}
              </span>
            </div>
          </div>

          {/* Messages for this date */}
          <div className="space-y-3">
            {dateMessages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.userId === currentUserId}
              />
            ))}
          </div>
        </div>
      ))}
      
      {isAITyping && <TypingIndicator />}
    </div>
  );
}
