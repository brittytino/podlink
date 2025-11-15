'use client';

import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Info, MessageCircle, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
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

const suggestionMessages = [
  "I'm here for you! Even when I'm away, remember you're stronger than you think. Keep going! 💪",
  "You've got this! I believe in your journey and I'll be back to support you soon. Stay strong! ✨",
  "Taking a quick break, but my support for you never stops. You're amazing and capable! 🌟",
  "Even when I'm offline, know that I'm cheering for your success. Keep pushing forward! 🚀",
];

export function AvailabilityMessageInput({
  message,
  onMessageChange,
}: AvailabilityMessageInputProps) {
  return (
    <div className="space-y-8 lg:space-y-10 max-h-[calc(100vh-400px)] lg:max-h-none overflow-hidden">
      <div className="text-center lg:text-left space-y-3 lg:space-y-4">
        <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-foreground">
          Create Your Support Message
        </h2>
        <p className="text-base lg:text-lg text-muted-foreground max-w-3xl mx-auto lg:mx-0">
          Write an encouraging message that will be shown to your pod members when you're not available to help them
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-12">
        {/* Message Input */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <MessageCircle className="h-6 w-6 lg:h-7 lg:w-7 text-primary" />
              <Label htmlFor="availability-message" className="text-lg lg:text-xl font-bold text-foreground">
                Your Message
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-5 w-5 lg:h-6 lg:w-6 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm p-4">
                    <p className="text-sm leading-relaxed">
                      This message will be shown to your pod members when you're
                      unavailable and they need encouragement. It rotates with other
                      members' messages to provide continuous support.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">
              Make it personal, encouraging, and supportive. Your words can make a real difference!
            </p>
          </div>

          <div className="space-y-4">
            <Textarea
              id="availability-message"
              placeholder="Write your encouraging message here... Be authentic and supportive!"
              value={message}
              onChange={(e) => onMessageChange(e.target.value)}
              className="min-h-[180px] lg:min-h-[220px] xl:min-h-[240px] resize-none text-base lg:text-lg border-2 rounded-xl focus:border-primary"
              maxLength={500}
            />
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm lg:text-base text-muted-foreground">
                <Heart className="h-4 w-4 lg:h-5 lg:w-5 text-pink-500" />
                <span>Your words matter</span>
              </div>
              <span className={cn(
                "text-sm lg:text-base font-medium",
                message.length > 450 ? "text-orange-500" : 
                message.length > 400 ? "text-yellow-500" : "text-muted-foreground"
              )}>
                {message.length}/500
              </span>
            </div>
          </div>
        </div>

        {/* Message Suggestions */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Star className="h-6 w-6 lg:h-7 lg:w-7 text-yellow-500" />
            <h3 className="text-lg lg:text-xl font-bold text-foreground">
              Need Inspiration?
            </h3>
          </div>
          
          <div className="space-y-4 max-h-[300px] lg:max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {suggestionMessages.map((suggestion, index) => (
              <Card
                key={index}
                className={cn(
                  'cursor-pointer transition-all duration-200 border-2',
                  'hover:border-primary hover:shadow-md hover:scale-[1.01]',
                  'active:scale-[0.99]',
                  message === suggestion 
                    ? 'border-primary bg-primary/10 shadow-md' 
                    : 'border-border hover:bg-accent/50'
                )}
                onClick={() => onMessageChange(suggestion)}
              >
                <CardContent className="p-4 lg:p-5">
                  <div className="space-y-3">
                    <p className="text-sm lg:text-base leading-relaxed text-foreground">
                      {suggestion}
                    </p>
                    <Button 
                      variant={message === suggestion ? "default" : "outline"} 
                      size="sm"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMessageChange(suggestion);
                      }}
                    >
                      {message === suggestion ? "Selected" : "Use This Message"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Message Preview */}
      {message && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardContent className="p-6 lg:p-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-6 w-6 lg:h-7 lg:w-7 text-primary" />
                  <h3 className="text-lg lg:text-xl font-bold text-foreground">
                    Preview: How your message will appear
                  </h3>
                </div>
                
                <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-border">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Heart className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm lg:text-base text-muted-foreground mb-1">
                        Support message from you:
                      </p>
                      <p className="text-sm lg:text-base text-foreground leading-relaxed">
                        {message}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

