'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Bot, Check, Sparkles, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PodTypeSelectionProps {
  podType: 'REAL' | 'AI' | null;
  onPodTypeChange: (value: 'REAL' | 'AI') => void;
}

export function PodTypeSelection({
  podType,
  onPodTypeChange,
}: PodTypeSelectionProps) {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center sm:text-left space-y-2 sm:space-y-3">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
          Choose Your Pod Type
        </h2>
        <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
          Select the type of accountability pod that best matches your preferences
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Real Pod Option */}
        <Card
          className={cn(
            'cursor-pointer transition-all duration-300 border-2 rounded-xl',
            'hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]',
            podType === 'REAL' 
              ? 'border-primary bg-primary/5 shadow-md ring-2 ring-primary/20' 
              : 'border-border hover:border-primary/50 hover:bg-primary/5'
          )}
          onClick={() => onPodTypeChange('REAL')}
          tabIndex={0}
          role="button"
          aria-pressed={podType === 'REAL'}
        >
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col items-center space-y-4 sm:space-y-6">
              <div
                className={cn(
                  'w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center transition-all duration-300 relative',
                  podType === 'REAL'
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-primary/10 text-primary'
                )}
              >
                <Users className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12" />
                {podType === 'REAL' && (
                  <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-7 h-7 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                )}
              </div>
              
              <div className="text-center space-y-2 sm:space-y-3">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
                  Real Pod
                </h3>
                <p className="text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed">
                  Connect with real people who share similar goals and provide genuine support
                </p>
              </div>

              <div className="space-y-2 sm:space-y-3 w-full">
                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm lg:text-base text-muted-foreground">
                  <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-pink-500 flex-shrink-0" />
                  <span>Real human connections</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm lg:text-base text-muted-foreground">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                  <span>Community support</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm lg:text-base text-muted-foreground">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 flex-shrink-0" />
                  <span>Shared experiences</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Pod Option */}
        <Card
          className={cn(
            'cursor-pointer transition-all duration-300 border-2 rounded-xl',
            'hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]',
            podType === 'AI' 
              ? 'border-primary bg-primary/5 shadow-md ring-2 ring-primary/20' 
              : 'border-border hover:border-primary/50 hover:bg-primary/5'
          )}
          onClick={() => onPodTypeChange('AI')}
          tabIndex={0}
          role="button"
          aria-pressed={podType === 'AI'}
        >
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col items-center space-y-4 sm:space-y-6">
              <div
                className={cn(
                  'w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center transition-all duration-300 relative',
                  podType === 'AI'
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-primary/10 text-primary'
                )}
              >
                <Bot className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12" />
                {podType === 'AI' && (
                  <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-7 h-7 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                )}
              </div>
              
              <div className="text-center space-y-2 sm:space-y-3">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
                  AI Pod
                </h3>
                <p className="text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed">
                  Get personalized support from AI companions along with real members
                </p>
              </div>

              <div className="space-y-2 sm:space-y-3 w-full">
                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm lg:text-base text-muted-foreground">
                  <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                  <span>24/7 AI support</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm lg:text-base text-muted-foreground">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 flex-shrink-0" />
                  <span>Personalized insights</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm lg:text-base text-muted-foreground">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                  <span>Real member interactions</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selected Pod Summary */}
      {podType && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-4 sm:p-5 bg-primary/5 rounded-xl border border-primary/20">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-primary/10 flex-shrink-0">
                {podType === 'REAL' ? (
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                ) : (
                  <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-primary mb-1">
                  You selected: {podType === 'REAL' ? 'Real Pod' : 'AI Pod'}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                  {podType === 'REAL' 
                    ? 'You\'ll be matched with real people for authentic accountability and support.'
                    : 'You\'ll get AI-powered insights and support alongside real member interactions.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

