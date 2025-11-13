'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Target, TrendingUp, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BAD_HABITS_TO_QUIT, GOOD_HABITS_TO_BUILD } from '@/lib/goal-categories';

interface GoalSelectionProps {
  goalType: string;
  goalDescription: string;
  goalCategory: string | null;
  onGoalTypeChange: (value: string) => void;
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

  const goals = goalType === 'QUIT_HABIT' ? BAD_HABITS_TO_QUIT : GOOD_HABITS_TO_BUILD;
  
  const filteredGoals = goals.filter(goal =>
    goal.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    goal.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedGoal = goals.find(g => g.id === goalCategory);

  const handleGoalTypeChange = (value: string) => {
    onGoalTypeChange(value);
    onGoalCategoryChange(null);
    onGoalDescriptionChange('');
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-lg font-semibold mb-4 block">
          What's your goal?
        </Label>
        <RadioGroup 
          value={goalType} 
          onValueChange={handleGoalTypeChange}
          className="space-y-3"
        >
          <label htmlFor="quit" className="block">
            <Card 
              className={cn(
                'cursor-pointer transition-all hover:border-primary/50 hover:shadow-md',
                goalType === 'QUIT_HABIT' && 'border-primary border-2 bg-primary/5 shadow-sm'
              )}
            >
              <CardContent className="pt-6 pb-6">
                <div className="flex items-start gap-4">
                  <RadioGroupItem 
                    value="QUIT_HABIT" 
                    id="quit" 
                    className="mt-1 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="h-5 w-5 text-red-500 shrink-0" />
                      <span className="font-semibold text-base">Quit a Habit</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Stop doing something that's holding you back
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </label>

          <label htmlFor="build" className="block">
            <Card 
              className={cn(
                'cursor-pointer transition-all hover:border-primary/50 hover:shadow-md',
                goalType === 'BUILD_HABIT' && 'border-primary border-2 bg-primary/5 shadow-sm'
              )}
            >
              <CardContent className="pt-6 pb-6">
                <div className="flex items-start gap-4">
                  <RadioGroupItem 
                    value="BUILD_HABIT" 
                    id="build" 
                    className="mt-1 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="h-5 w-5 text-green-500 shrink-0" />
                      <span className="font-semibold text-base">Build a Habit</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Start doing something positive consistently
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </label>
        </RadioGroup>
      </div>

      {goalType && (
        <div className="space-y-4">
          <div>
            <Label className="text-base font-semibold mb-2 block">
              Select your specific goal
            </Label>
            <p className="text-sm text-muted-foreground mb-3">
              Choose the goal that best matches what you want to achieve
            </p>
            
            {/* Search input */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search goals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm sm:text-base"
              />
            </div>

            {/* Goal grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1">
              {filteredGoals.map((goal) => (
                <Card
                  key={goal.id}
                  className={cn(
                    'cursor-pointer transition-all hover:border-primary hover:shadow-md active:scale-[0.98] touch-manipulation',
                    goalCategory === goal.id && 'border-primary border-2 bg-primary/5 shadow-sm'
                  )}
                  onClick={() => {
                    onGoalCategoryChange(goal.id);
                    onGoalDescriptionChange(goal.label);
                  }}
                >
                  <CardContent className="pt-4 pb-4 px-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm sm:text-base mb-1 break-words">{goal.label}</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{goal.description}</p>
                      </div>
                      {goalCategory === goal.id && (
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredGoals.length === 0 && (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-3">
                  No goals found matching "{searchQuery}"
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    onGoalCategoryChange(null);
                    onGoalDescriptionChange(searchQuery);
                  }}
                  className="text-sm"
                >
                  Use "{searchQuery}" as custom goal
                </Button>
              </div>
            )}
          </div>

          {/* Custom goal input option */}
          <div className="space-y-2">
            <Label className="text-sm sm:text-base font-medium">Or describe your custom goal:</Label>
            <textarea
              placeholder="e.g., I want to read 30 minutes daily, or I want to quit watching adult content..."
              value={goalDescription}
              onChange={(e) => {
                onGoalDescriptionChange(e.target.value);
                // If custom description is provided, clear category
                if (e.target.value && !selectedGoal) {
                  onGoalCategoryChange(null);
                }
              }}
              className="w-full px-3 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors min-h-[80px] resize-none text-sm sm:text-base"
            />
            <p className="text-xs sm:text-sm text-muted-foreground">
              {goalDescription && !selectedGoal 
                ? "We'll match you with others who have similar goals based on your description."
                : 'Describe your specific goal in detail for better matching.'}
            </p>
          </div>

          {(selectedGoal || goalDescription) && (
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-sm font-medium text-primary mb-1">Your Goal:</p>
              {selectedGoal ? (
                <>
                  <p className="text-sm">{selectedGoal.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{selectedGoal.description}</p>
                </>
              ) : (
                <p className="text-sm">{goalDescription}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
