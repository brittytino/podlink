'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Target, TrendingUp, Check, Search } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');

  const goals = goalType === 'QUIT_HABIT' ? BAD_HABITS_TO_QUIT : 
                goalType === 'BUILD_HABIT' ? GOOD_HABITS_TO_BUILD : [];
  
  const filteredGoals = goals.filter(goal =>
    goal.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    goal.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedGoal = goals.find(g => g.id === goalCategory);

  // Handle goal type selection
  const handleGoalTypeSelection = (value: 'QUIT_HABIT' | 'BUILD_HABIT') => {
    console.log('Goal selected:', value);
    onGoalTypeChange(value);
    // Clear category and description when switching goal types
    onGoalCategoryChange(null);
    onGoalDescriptionChange('');
    setSearchQuery('');
  };

  return (
    <div className="space-y-6 lg:space-y-8 max-h-[calc(100vh-300px)] lg:max-h-[calc(100vh-250px)] overflow-hidden">
      {/* Welcome Section - Show when no goal type is selected */}
      {!goalType && (
        <div className="text-center space-y-4 lg:space-y-6 py-6 lg:py-8">
          <div className="space-y-3 lg:space-y-4">
            <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-foreground">
              Choose Your Journey
            </h2>
            <p className="text-base lg:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Every great transformation starts with a single choice. What would you like to focus on?
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 lg:gap-6 text-sm lg:text-base text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>Break free from limiting habits</span>
            </div>
            <div className="hidden sm:block text-muted-foreground/50">or</div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Build empowering new habits</span>
            </div>
          </div>
        </div>
      )}

      {/* Goal Type Selection */}
      <div className="space-y-4 lg:space-y-6">
        <div className="text-center lg:text-left">
          <Label className="text-xl lg:text-2xl font-bold mb-2 lg:mb-3 block text-foreground">
            {goalType ? "Great choice! Now let's get specific" : "What's your goal?"}
          </Label>
          <p className="text-sm lg:text-base text-muted-foreground">
            {goalType ? "You can always change this later" : "Choose the type of goal you want to work on"}
          </p>
          {/* Debug info */}
          <p className="text-xs text-blue-600 mt-2">
            Current selection: {goalType || 'None'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Quit a Habit Option */}
          <button
            type="button"
            className={cn(
              'relative cursor-pointer rounded-xl border-2 transition-all duration-300 p-0 bg-transparent',
              'hover:border-red-400 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]',
              goalType === 'QUIT_HABIT' 
                ? 'border-red-500 bg-red-50 shadow-lg ring-2 ring-red-100' 
                : goalType === null
                  ? 'border-border bg-card hover:bg-red-50/30 hover:border-red-300'
                  : 'border-border/50 bg-muted/30 opacity-60'
            )}
            onClick={() => handleGoalTypeSelection('QUIT_HABIT')}
          >
            <Card className="w-full border-0 shadow-none bg-transparent">
              <CardContent className="p-6 lg:p-8">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={cn(
                    'w-16 h-16 lg:w-20 lg:h-20 rounded-full border-4 flex items-center justify-center transition-all duration-300',
                    goalType === 'QUIT_HABIT'
                      ? 'border-red-500 bg-red-500'
                      : 'border-red-200 bg-red-50'
                  )}>
                    <Target className={cn(
                      'h-8 w-8 lg:h-10 lg:w-10 transition-colors',
                      goalType === 'QUIT_HABIT' ? 'text-white' : 'text-red-500'
                    )} />
                  </div>
                  <div>
                    <h3 className={cn(
                      'text-lg lg:text-xl font-bold mb-2 transition-colors',
                      goalType === 'QUIT_HABIT' ? 'text-red-700' : 'text-foreground'
                    )}>
                      Quit a Habit
                    </h3>
                    <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">
                      Stop doing something that's holding you back from your potential
                    </p>
                  </div>
                  {goalType === 'QUIT_HABIT' && (
                    <Check className="h-6 w-6 lg:h-8 lg:w-8 text-red-500 animate-in fade-in zoom-in duration-200" />
                  )}
                </div>
              </CardContent>
            </Card>
          </button>

          {/* Build a Habit Option */}
          <button
            type="button"
            className={cn(
              'relative cursor-pointer rounded-xl border-2 transition-all duration-300 p-0 bg-transparent',
              'hover:border-green-400 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]',
              goalType === 'BUILD_HABIT' 
                ? 'border-green-500 bg-green-50 shadow-lg ring-2 ring-green-100' 
                : goalType === null
                  ? 'border-border bg-card hover:bg-green-50/30 hover:border-green-300'
                  : 'border-border/50 bg-muted/30 opacity-60'
            )}
            onClick={() => handleGoalTypeSelection('BUILD_HABIT')}
          >
            <Card className="w-full border-0 shadow-none bg-transparent">
              <CardContent className="p-6 lg:p-8">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={cn(
                    'w-16 h-16 lg:w-20 lg:h-20 rounded-full border-4 flex items-center justify-center transition-all duration-300',
                    goalType === 'BUILD_HABIT'
                      ? 'border-green-500 bg-green-500'
                      : 'border-green-200 bg-green-50'
                  )}>
                    <TrendingUp className={cn(
                      'h-8 w-8 lg:h-10 lg:w-10 transition-colors',
                      goalType === 'BUILD_HABIT' ? 'text-white' : 'text-green-500'
                    )} />
                  </div>
                  <div>
                    <h3 className={cn(
                      'text-lg lg:text-xl font-bold mb-2 transition-colors',
                      goalType === 'BUILD_HABIT' ? 'text-green-700' : 'text-foreground'
                    )}>
                      Build a Habit
                    </h3>
                    <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">
                      Start doing something positive consistently to improve your life
                    </p>
                  </div>
                  {goalType === 'BUILD_HABIT' && (
                    <Check className="h-6 w-6 lg:h-8 lg:w-8 text-green-500 animate-in fade-in zoom-in duration-200" />
                  )}
                </div>
              </CardContent>
            </Card>
          </button>
        </div>
      </div>

      {/* Goal Category Selection */}
      {goalType && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 flex-1 min-h-0">
          <div className="text-center lg:text-left">
            <Label className="text-lg lg:text-xl font-bold mb-2 block text-foreground">
              Choose your specific goal
            </Label>
            <p className="text-sm lg:text-base text-muted-foreground">
              Select from popular goals or create your own
            </p>
          </div>
          
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search goals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 lg:h-14 text-base border-2 rounded-xl focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {/* Popular Goals Grid */}
            <div className="space-y-4">
              <h3 className="text-sm lg:text-base font-semibold text-muted-foreground uppercase tracking-wide">
                Popular Goals
              </h3>
              <div className="grid gap-3 max-h-[300px] lg:max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredGoals.slice(0, 6).map((goal) => (
                  <Card
                    key={goal.id}
                    className={cn(
                      'cursor-pointer transition-all duration-200',
                      'hover:border-primary hover:shadow-md hover:scale-[1.01]',
                      'active:scale-[0.99] border-2',
                      goalCategory === goal.id 
                        ? 'border-primary bg-primary/10 shadow-md' 
                        : 'border-border hover:bg-accent/50'
                    )}
                    onClick={() => {
                      onGoalCategoryChange(goal.id);
                      onGoalDescriptionChange(goal.label);
                    }}
                    tabIndex={0}
                    role="button"
                    aria-pressed={goalCategory === goal.id}
                  >
                    <CardContent className="p-4 lg:p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm lg:text-base mb-1 break-words leading-tight">
                            {goal.label}
                          </h4>
                          <p className="text-xs lg:text-sm text-muted-foreground line-clamp-2">
                            {goal.description}
                          </p>
                        </div>
                        {goalCategory === goal.id && (
                          <Check className="h-5 w-5 lg:h-6 lg:w-6 text-primary flex-shrink-0 animate-in fade-in zoom-in duration-200" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Custom Goal Section */}
            <div className="space-y-4">
              <h3 className="text-sm lg:text-base font-semibold text-muted-foreground uppercase tracking-wide">
                Custom Goal
              </h3>
              <div className="space-y-4">
                <Textarea
                  placeholder={`e.g., ${goalType === 'QUIT_HABIT' ? 'I want to quit checking social media first thing in the morning' : 'I want to read for 30 minutes every day before bed'}`}
                  value={goalDescription}
                  onChange={(e) => {
                    onGoalDescriptionChange(e.target.value);
                    if (e.target.value.trim()) {
                      onGoalCategoryChange(null);
                    }
                  }}
                  className="min-h-[120px] lg:min-h-[150px] text-sm lg:text-base resize-none border-2 rounded-xl focus:border-primary"
                />
                <p className="text-xs lg:text-sm text-muted-foreground">
                  {goalDescription && !goalCategory 
                    ? "Perfect! We'll help you connect with others working on similar goals."
                    : 'Describe your specific goal in detail for better matching.'}
                </p>
              </div>

              {/* Selected Goal Summary */}
              {(goalCategory || (goalDescription && !goalCategory)) && (
                <div className="p-4 lg:p-6 bg-primary/10 rounded-xl border-2 border-primary/20 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center flex-shrink-0',
                      goalType === 'QUIT_HABIT' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                    )}>
                      {goalType === 'QUIT_HABIT' ? (
                        <Target className="h-4 w-4 lg:h-5 lg:w-5" />
                      ) : (
                        <TrendingUp className="h-4 w-4 lg:h-5 lg:w-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs lg:text-sm font-semibold text-primary mb-1">
                        Your Selected Goal:
                      </p>
                      {goalCategory ? (
                        <div className="space-y-1">
                          <p className="text-sm lg:text-base font-semibold">
                            {goals.find(g => g.id === goalCategory)?.label}
                          </p>
                          <p className="text-xs lg:text-sm text-muted-foreground">
                            {goals.find(g => g.id === goalCategory)?.description}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm lg:text-base font-medium">{goalDescription}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* No Results Message */}
          {filteredGoals.length === 0 && searchQuery && (
            <div className="text-center py-8 lg:py-12 space-y-4">
              <p className="text-base lg:text-lg text-muted-foreground">
                No goals found matching "{searchQuery}"
              </p>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  onGoalCategoryChange(null);
                  onGoalDescriptionChange(searchQuery);
                  setSearchQuery('');
                }}
                className="text-sm lg:text-base"
              >
                Use "{searchQuery}" as your custom goal
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
