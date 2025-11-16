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
    <div className="space-y-8 lg:space-y-10 max-h-[calc(100vh-400px)] lg:max-h-none overflow-hidden">
      <div className="text-center lg:text-left space-y-3 lg:space-y-4">
        <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-foreground">
          Choose Your Pod Type
        </h2>
        <p className="text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0">
          Select the type of accountability pod that best matches your preferences and goals
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-12">
        {/* Real Pod Option */}
        <Card
          className={cn(
            'cursor-pointer transition-all duration-300 border-2 rounded-2xl lg:rounded-3xl',
            'hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]',
            'focus-within:ring-2 focus-within:ring-blue-400 focus-within:ring-offset-2',
            podType === 'REAL' 
              ? 'border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-100' 
              : 'border-border hover:border-blue-300 hover:bg-blue-50/30'
          )}
          onClick={() => onPodTypeChange('REAL')}
          tabIndex={0}
          role="button"
          aria-pressed={podType === 'REAL'}
        >
          <CardContent className="p-8 lg:p-10 xl:p-12">
            <div className="flex flex-col items-center space-y-6 lg:space-y-8">
              <div
                className={cn(
                  'w-20 h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 rounded-full flex items-center justify-center transition-all duration-300 relative',
                  podType === 'REAL'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-blue-100 text-blue-500'
                )}
              >
                <Users className="h-10 w-10 lg:h-12 lg:w-12 xl:h-14 xl:w-14" />
                {podType === 'REAL' && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 lg:w-10 lg:h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
                  </div>
                )}
              </div>
              
              <div className="text-center space-y-3 lg:space-y-4">
                <h3 className="text-xl lg:text-2xl xl:text-3xl font-bold text-foreground">
                  Real Pod
                </h3>
                <p className="text-sm lg:text-base xl:text-lg text-muted-foreground leading-relaxed max-w-xs">
                  Connect with real people who share similar goals and provide genuine support
                </p>
              </div>

              <div className="space-y-3 lg:space-y-4 w-full">
                <div className="flex items-center gap-3 text-sm lg:text-base text-muted-foreground">
                  <Heart className="h-4 w-4 lg:h-5 lg:w-5 text-pink-500 flex-shrink-0" />
                  <span>Real human connections</span>
                </div>
                <div className="flex items-center gap-3 text-sm lg:text-base text-muted-foreground">
                  <Users className="h-4 w-4 lg:h-5 lg:w-5 text-blue-500 flex-shrink-0" />
                  <span>Community support</span>
                </div>
                <div className="flex items-center gap-3 text-sm lg:text-base text-muted-foreground">
                  <Sparkles className="h-4 w-4 lg:h-5 lg:w-5 text-yellow-500 flex-shrink-0" />
                  <span>Shared experiences</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Pod Option */}
        <Card
          className={cn(
            'cursor-pointer transition-all duration-300 border-2 rounded-2xl lg:rounded-3xl',
            'hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]',
            'focus-within:ring-2 focus-within:ring-purple-400 focus-within:ring-offset-2',
            podType === 'AI' 
              ? 'border-purple-500 bg-purple-50 shadow-lg ring-2 ring-purple-100' 
              : 'border-border hover:border-purple-300 hover:bg-purple-50/30'
          )}
          onClick={() => onPodTypeChange('AI')}
          tabIndex={0}
          role="button"
          aria-pressed={podType === 'AI'}
        >
          <CardContent className="p-8 lg:p-10 xl:p-12">
            <div className="flex flex-col items-center space-y-6 lg:space-y-8">
              <div
                className={cn(
                  'w-20 h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 rounded-full flex items-center justify-center transition-all duration-300 relative',
                  podType === 'AI'
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'bg-purple-100 text-purple-500'
                )}
              >
                <Bot className="h-10 w-10 lg:h-12 lg:w-12 xl:h-14 xl:w-14" />
                {podType === 'AI' && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 lg:w-10 lg:h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
                  </div>
                )}
              </div>
              
              <div className="text-center space-y-3 lg:space-y-4">
                <h3 className="text-xl lg:text-2xl xl:text-3xl font-bold text-foreground">
                  AI Pod
                </h3>
                <p className="text-sm lg:text-base xl:text-lg text-muted-foreground leading-relaxed max-w-xs">
                  Get personalized support from AI companions along with real members
                </p>
              </div>

              <div className="space-y-3 lg:space-y-4 w-full">
                <div className="flex items-center gap-3 text-sm lg:text-base text-muted-foreground">
                  <Bot className="h-4 w-4 lg:h-5 lg:w-5 text-purple-500 flex-shrink-0" />
                  <span>24/7 AI support</span>
                </div>
                <div className="flex items-center gap-3 text-sm lg:text-base text-muted-foreground">
                  <Sparkles className="h-4 w-4 lg:h-5 lg:w-5 text-purple-400 flex-shrink-0" />
                  <span>Personalized insights</span>
                </div>
                <div className="flex items-center gap-3 text-sm lg:text-base text-muted-foreground">
                  <Users className="h-4 w-4 lg:h-5 lg:w-5 text-blue-500 flex-shrink-0" />
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
          <div className={cn(
            'p-6 lg:p-8 rounded-2xl border-2',
            podType === 'REAL' 
              ? 'bg-blue-50 border-blue-200' 
              : 'bg-purple-50 border-purple-200'
          )}>
            <div className="flex items-center gap-4 lg:gap-6">
              <div className={cn(
                'w-12 h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center',
                podType === 'REAL' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
              )}>
                {podType === 'REAL' ? (
                  <Users className="h-6 w-6 lg:h-8 lg:w-8" />
                ) : (
                  <Bot className="h-6 w-6 lg:h-8 lg:w-8" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm lg:text-base font-semibold text-foreground mb-1">
                  You selected: {podType === 'REAL' ? 'Real Pod' : 'AI Pod'}
                </p>
                <p className="text-sm lg:text-base text-muted-foreground">
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

