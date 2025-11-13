'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Bot, Check } from 'lucide-react';
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
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">Choose Your Pod Type</h2>
        <p className="text-sm text-muted-foreground">
          Select the type of accountability pod that works best for you
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card
          className={cn(
            'cursor-pointer transition-all hover:border-primary',
            podType === 'REAL' && 'border-primary border-2 bg-primary/5'
          )}
          onClick={() => onPodTypeChange('REAL')}
        >
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-3">
              <div
                className={cn(
                  'w-16 h-16 rounded-full flex items-center justify-center transition-colors',
                  podType === 'REAL'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                <Users className="h-8 w-8" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="font-semibold">Real Pod</h3>
                <p className="text-sm text-muted-foreground">
                  Connect with real people who share similar goals
                </p>
              </div>
              {podType === 'REAL' && (
                <Check className="h-5 w-5 text-primary" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card
          className={cn(
            'cursor-pointer transition-all hover:border-primary',
            podType === 'AI' && 'border-primary border-2 bg-primary/5'
          )}
          onClick={() => onPodTypeChange('AI')}
        >
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-3">
              <div
                className={cn(
                  'w-16 h-16 rounded-full flex items-center justify-center transition-colors',
                  podType === 'AI'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                <Bot className="h-8 w-8" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="font-semibold">AI Pod</h3>
                <p className="text-sm text-muted-foreground">
                  Get support from AI companions and real members
                </p>
              </div>
              {podType === 'AI' && (
                <Check className="h-5 w-5 text-primary" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

