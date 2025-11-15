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
    <div className="space-y-8 max-h-[calc(100vh-300px)] overflow-hidden">
      {/* Welcome Section */}
      {!goalType && (
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold text-foreground">
            What's your goal?
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose the type of goal you want to work on
          </p>
        </div>
      )}

      {/* Goal Type Selection - Simple Buttons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quit a Habit */}
        <Button
          variant={goalType === 'QUIT_HABIT' ? 'default' : 'outline'}
          size="lg"
          className={cn(
            'h-auto p-8 flex flex-col items-center space-y-4 transition-all duration-200',
            goalType === 'QUIT_HABIT'
              ? 'bg-red-500 hover:bg-red-600 text-white border-red-500'
              : 'border-2 hover:border-red-400 hover:bg-red-50'
          )}
          onClick={() => {
            console.log('Quit Habit clicked');
            onGoalTypeChange('QUIT_HABIT');
          }}
        >
          <div className={cn(
            'w-16 h-16 rounded-full border-4 flex items-center justify-center',
            goalType === 'QUIT_HABIT'
              ? 'border-white bg-white'
              : 'border-red-200 bg-red-50'
          )}>
            <Target className={cn(
              'h-8 w-8',
              goalType === 'QUIT_HABIT' ? 'text-red-500' : 'text-red-500'
            )} />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">
              Quit a Habit
            </h3>
            <p className={cn(
              'text-sm leading-relaxed',
              goalType === 'QUIT_HABIT' ? 'text-red-100' : 'text-muted-foreground'
            )}>
              Stop doing something that's holding you back
            </p>
          </div>
          {goalType === 'QUIT_HABIT' && (
            <Check className="h-6 w-6 text-white" />
          )}
        </Button>

        {/* Build a Habit */}
        <Button
          variant={goalType === 'BUILD_HABIT' ? 'default' : 'outline'}
          size="lg"
          className={cn(
            'h-auto p-8 flex flex-col items-center space-y-4 transition-all duration-200',
            goalType === 'BUILD_HABIT'
              ? 'bg-green-500 hover:bg-green-600 text-white border-green-500'
              : 'border-2 hover:border-green-400 hover:bg-green-50'
          )}
          onClick={() => {
            console.log('Build Habit clicked');
            onGoalTypeChange('BUILD_HABIT');
          }}
        >
          <div className={cn(
            'w-16 h-16 rounded-full border-4 flex items-center justify-center',
            goalType === 'BUILD_HABIT'
              ? 'border-white bg-white'
              : 'border-green-200 bg-green-50'
          )}>
            <TrendingUp className={cn(
              'h-8 w-8',
              goalType === 'BUILD_HABIT' ? 'text-green-500' : 'text-green-500'
            )} />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">
              Build a Habit
            </h3>
            <p className={cn(
              'text-sm leading-relaxed',
              goalType === 'BUILD_HABIT' ? 'text-green-100' : 'text-muted-foreground'
            )}>
              Start doing something positive consistently
            </p>
          </div>
          {goalType === 'BUILD_HABIT' && (
            <Check className="h-6 w-6 text-white" />
          )}
        </Button>
      </div>

      {/* Goal Description Section */}
      {goalType && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">
              Describe your specific goal
            </h3>
            <p className="text-muted-foreground">
              Tell us what exactly you want to {goalType === 'QUIT_HABIT' ? 'quit' : 'build'}
            </p>
          </div>
          
          {/* Simple Text Area */}
          <div className="max-w-2xl mx-auto">
            <Textarea
              placeholder={`e.g., ${
                goalType === 'QUIT_HABIT' 
                  ? 'I want to quit checking social media first thing in the morning' 
                  : 'I want to read for 30 minutes every day before bed'
              }`}
              value={goalDescription}
              onChange={(e) => onGoalDescriptionChange(e.target.value)}
              className="min-h-[120px] text-base resize-none border-2 rounded-xl"
            />
            <p className="text-sm text-muted-foreground mt-2">
              {goalDescription.trim() 
                ? "Great! We'll help you connect with others working on similar goals."
                : 'Describe your specific goal in detail for better matching.'}
            </p>
          </div>

          {/* Quick Goal Examples */}
          <div className="max-w-4xl mx-auto">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Popular {goalType === 'QUIT_HABIT' ? 'Habits to Quit' : 'Habits to Build'}
            </h4>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {goals.slice(0, 6).map((goal) => (
                <Button
                  key={goal.id}
                  variant="ghost"
                  size="sm"
                  className="h-auto p-3 text-left justify-start"
                  onClick={() => {
                    onGoalCategoryChange(goal.id);
                    onGoalDescriptionChange(goal.label);
                  }}
                >
                  <div className="truncate">
                    <div className="font-medium text-sm">{goal.label}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Selected Goal Summary */}
          {goalDescription.trim() && (
            <div className="max-w-2xl mx-auto p-4 bg-primary/10 rounded-xl border-2 border-primary/20">
              <div className="flex items-start gap-3">
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                  goalType === 'QUIT_HABIT' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                )}>
                  {goalType === 'QUIT_HABIT' ? (
                    <Target className="h-4 w-4" />
                  ) : (
                    <TrendingUp className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-primary mb-1">
                    Your Selected Goal:
                  </p>
                  <p className="text-sm font-medium">{goalDescription}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}