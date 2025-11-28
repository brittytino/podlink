'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Target, TrendingUp, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BAD_HABITS_TO_QUIT, GOOD_HABITS_TO_BUILD } from '@/lib/goal-categories';

type GoalType = 'QUIT_HABIT' | 'BUILD_HABIT' | null;

interface GoalSelectionProps {
  goalType: GoalType;
  goalDescription: string;
  goalCategory: string | null;
  onGoalTypeChange: (value: 'QUIT_HABIT' | 'BUILD_HABIT') => void;
  onGoalDescriptionChange: (value: string) => void;
  onGoalCategoryChange: (value: string | null) => void;
}

export function GoalSelection({
  goalType,
  goalDescription,
  goalCategory,
  onGoalTypeChange,
  onGoalDescriptionChange,
  onGoalCategoryChange,
}: GoalSelectionProps) {
  const goals = goalType === 'QUIT_HABIT' ? BAD_HABITS_TO_QUIT : 
                goalType === 'BUILD_HABIT' ? GOOD_HABITS_TO_BUILD : [];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Goal Type Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Quit a Habit */}
        <Button
          variant={goalType === 'QUIT_HABIT' ? 'default' : 'outline'}
          size="lg"
          className={cn(
            'h-auto p-6 sm:p-8 flex flex-col items-center space-y-3 sm:space-y-4 transition-all duration-200 rounded-xl',
            goalType === 'QUIT_HABIT'
              ? 'bg-primary hover:bg-primary/90 text-white border-primary shadow-sm'
              : 'border-2 hover:border-primary/50 hover:bg-primary/5'
          )}
          onClick={() => {
            console.log('Quit Habit clicked');
            onGoalTypeChange('QUIT_HABIT');
          }}
        >
          <div className={cn(
            'w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all',
            goalType === 'QUIT_HABIT'
              ? 'bg-white/20'
              : 'bg-primary/10'
          )}>
            <Target className={cn(
              'h-7 w-7 sm:h-8 sm:w-8',
              goalType === 'QUIT_HABIT' ? 'text-white' : 'text-primary'
            )} />
          </div>
          <div className="text-center">
            <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">
              Quit a Habit
            </h3>
            <p className={cn(
              'text-xs sm:text-sm leading-relaxed',
              goalType === 'QUIT_HABIT' ? 'text-white/90' : 'text-muted-foreground'
            )}>
              Stop doing something that's holding you back
            </p>
          </div>
          {goalType === 'QUIT_HABIT' && (
            <Check className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          )}
        </Button>

        {/* Build a Habit */}
        <Button
          variant={goalType === 'BUILD_HABIT' ? 'default' : 'outline'}
          size="lg"
          className={cn(
            'h-auto p-6 sm:p-8 flex flex-col items-center space-y-3 sm:space-y-4 transition-all duration-200 rounded-xl',
            goalType === 'BUILD_HABIT'
              ? 'bg-primary hover:bg-primary/90 text-white border-primary shadow-sm'
              : 'border-2 hover:border-primary/50 hover:bg-primary/5'
          )}
          onClick={() => {
            console.log('Build Habit clicked');
            onGoalTypeChange('BUILD_HABIT');
          }}
        >
          <div className={cn(
            'w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all',
            goalType === 'BUILD_HABIT'
              ? 'bg-white/20'
              : 'bg-primary/10'
          )}>
            <TrendingUp className={cn(
              'h-7 w-7 sm:h-8 sm:w-8',
              goalType === 'BUILD_HABIT' ? 'text-white' : 'text-primary'
            )} />
          </div>
          <div className="text-center">
            <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">
              Build a Habit
            </h3>
            <p className={cn(
              'text-xs sm:text-sm leading-relaxed',
              goalType === 'BUILD_HABIT' ? 'text-white/90' : 'text-muted-foreground'
            )}>
              Start doing something positive consistently
            </p>
          </div>
          {goalType === 'BUILD_HABIT' && (
            <Check className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          )}
        </Button>
      </div>

      {/* Goal Description Section */}
      {goalType && (
        <div className="space-y-5 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-bold mb-2">
              Describe your specific goal
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              Tell us what exactly you want to {goalType === 'QUIT_HABIT' ? 'quit' : 'build'}
            </p>
          </div>
          
          {/* Simple Text Area */}
          <div className="w-full">
            <Textarea
              placeholder={`e.g., ${
                goalType === 'QUIT_HABIT' 
                  ? 'I want to quit checking social media first thing in the morning' 
                  : 'I want to read for 30 minutes every day before bed'
              }`}
              value={goalDescription}
              onChange={(e) => onGoalDescriptionChange(e.target.value)}
              className="min-h-[100px] sm:min-h-[120px] text-sm sm:text-base resize-none border-2 rounded-xl focus:ring-2 focus:ring-primary/20"
            />
            <p className="text-xs sm:text-sm text-muted-foreground mt-2">
              {goalDescription.trim() 
                ? "Great! We'll help you connect with others working on similar goals."
                : 'Describe your specific goal in detail for better matching.'}
            </p>
          </div>

          {/* Quick Goal Examples - Fully Responsive */}
          <div className="w-full">
            <h4 className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Popular {goalType === 'QUIT_HABIT' ? 'Habits to Quit' : 'Habits to Build'}
            </h4>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              {goals.slice(0, 6).map((goal) => (
                <Button
                  key={goal.id}
                  variant="outline"
                  size="sm"
                  className="h-auto py-3 px-3 sm:px-4 text-left justify-start hover:bg-primary/5 hover:border-primary/50 transition-all rounded-lg"
                  onClick={() => {
                    onGoalCategoryChange(goal.id);
                    onGoalDescriptionChange(goal.label);
                  }}
                >
                  <div className="w-full">
                    <div className="font-medium text-xs sm:text-sm line-clamp-2">{goal.label}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Selected Goal Summary */}
          {goalDescription.trim() && (
            <div className="w-full p-4 sm:p-5 bg-primary/5 rounded-xl border border-primary/20">
              <div className="flex items-start gap-3">
                <div className={cn(
                  'w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center flex-shrink-0',
                  'bg-primary/10'
                )}>
                  {goalType === 'QUIT_HABIT' ? (
                    <Target className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  ) : (
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-primary mb-1">
                    Your Selected Goal:
                  </p>
                  <p className="text-sm sm:text-base font-medium text-foreground break-words">{goalDescription}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}