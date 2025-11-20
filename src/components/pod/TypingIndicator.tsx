'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot } from 'lucide-react';

export function TypingIndicator() {
  return (
    <div className="flex gap-3 items-end">
      {/* AI Avatar */}
      <Avatar className="h-9 w-9 mb-1 ring-2 ring-primary/20 shadow-sm">
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
            <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse delay-150" />
            <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse delay-300" />
          </div>
        </div>
      </div>
    </div>
  );
}
