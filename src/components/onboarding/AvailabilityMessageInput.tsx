'use client';

import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface AvailabilityMessageInputProps {
  message: string;
  onMessageChange: (value: string) => void;
}

export function AvailabilityMessageInput({
  message,
  onMessageChange,
}: AvailabilityMessageInputProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="availability-message" className="text-base font-semibold">
            Default Unavailable Message
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>
                  This message will be shown to your pod members when you're
                  unavailable and they need help. It will rotate with other
                  members' messages.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-sm text-muted-foreground">
          Write a supportive message that will be shown when you're not available
          to help your pod members
        </p>
      </div>

      <Textarea
        id="availability-message"
        placeholder="e.g., 'I'm here for you! Even when I'm away, remember you're stronger than you think. Keep going! 💪'"
        value={message}
        onChange={(e) => onMessageChange(e.target.value)}
        className="min-h-[120px] resize-none"
        maxLength={500}
      />
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span>This message will rotate with others when multiple members are unavailable</span>
        <span>{message.length}/500</span>
      </div>
    </div>
  );
}

