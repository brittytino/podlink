'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Target, TrendingUp } from 'lucide-react';

interface GoalSelectionProps {
  goalType: string;
  goalDescription: string;
  onGoalTypeChange: (value: string) => void;
  onGoalDescriptionChange: (value: string) => void;
}

export function GoalSelection({
  goalType,
  goalDescription,
  onGoalTypeChange,
  onGoalDescriptionChange,
}: GoalSelectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <Label className="text-lg font-semibold mb-4 block">
          What's your goal?
        </Label>
        <RadioGroup value={goalType} onValueChange={onGoalTypeChange}>
          <Card className={goalType === 'QUIT_HABIT' ? 'border-primary' : ''}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <RadioGroupItem value="QUIT_HABIT" id="quit" />
                <div className="flex-1">
                  <Label htmlFor="quit" className="flex items-center gap-2 cursor-pointer">
                    <Target className="h-5 w-5 text-red-500" />
                    <span className="font-semibold">Quit a Habit</span>
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Stop doing something that's holding you back
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={goalType === 'BUILD_HABIT' ? 'border-primary' : ''}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <RadioGroupItem value="BUILD_HABIT" id="build" />
                <div className="flex-1">
                  <Label htmlFor="build" className="flex items-center gap-2 cursor-pointer">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <span className="font-semibold">Build a Habit</span>
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Start doing something positive consistently
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </RadioGroup>
      </div>

      <div>
        <Label htmlFor="description" className="text-base font-semibold">
          Describe your goal
        </Label>
        <p className="text-sm text-muted-foreground mb-2">
          Be specific about what you want to achieve
        </p>
        <Textarea
          id="description"
          placeholder="Example: Stop scrolling social media before bed, Exercise for 30 minutes daily, etc."
          value={goalDescription}
          onChange={(e) => onGoalDescriptionChange(e.target.value)}
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
}
