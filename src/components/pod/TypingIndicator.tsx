'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot } from 'lucide-react';

export function TypingIndicator() {
  return (
    <div className="flex gap-2 items-end justify-start">
      {/* AI Avatar */}
      <Avatar className="h-8 w-8 mb-1 ring-2 ring-primary/20">
        <AvatarFallback className="bg-gradient-to-br from-primary/30 to-primary/10 text-primary">
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col items-start">
        {/* AI name */}
        <div className="flex items-center gap-1 mb-1 px-1">
          <span className="text-xs font-medium text-muted-foreground">AI Helper</span>
        </div>

        {/* Typing bubble */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl rounded-bl-md px-4 py-3 max-w-full">
          <div className="flex gap-1 items-center">
            <div className="w-2 h-2 bg-primary/60 rounded-full typing-dot" />
            <div className="w-2 h-2 bg-primary/60 rounded-full typing-dot" />
            <div className="w-2 h-2 bg-primary/60 rounded-full typing-dot" />
          </div>
        </div>
      </div>
    </div>
  );
}
