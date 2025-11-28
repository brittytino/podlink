'use client';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { User, UserCheck, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GenderSelectorProps {
  gender: 'male' | 'female' | null;
  onGenderChange: (value: 'male' | 'female') => void;
}

export function GenderSelector({ gender, onGenderChange }: GenderSelectorProps) {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center sm:text-left space-y-2 sm:space-y-3">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
          Select your gender
        </h2>
        <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
          This helps us generate a personalized profile picture and provide better matching
        </p>
      </div>

      <RadioGroup
        value={gender || ''}
        onValueChange={(value) => {
          if (value === 'male' || value === 'female') {
            onGenderChange(value);
          }
        }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
      >
        {/* Male Option */}
        <div className="relative">
          <RadioGroupItem value="male" id="male" className="peer sr-only" />
          <Label
            htmlFor="male"
            className={cn(
              'flex cursor-pointer rounded-xl border-2 transition-all duration-300',
              'hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]',
              gender === 'male'
                ? 'border-primary bg-primary/5 shadow-md ring-2 ring-primary/20'
                : 'border-border hover:border-primary/50 hover:bg-primary/5'
            )}
          >
            <Card className="w-full border-0 shadow-none bg-transparent">
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col items-center space-y-4 sm:space-y-6">
                  <div
                    className={cn(
                      'w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center transition-all duration-300 relative',
                      gender === 'male'
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-primary/10 text-primary'
                    )}
                  >
                    <User className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12" />
                    {gender === 'male' && (
                      <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-7 h-7 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
                        <Check className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center space-y-2">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
                      Male
                    </h3>
                    <p className="text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed">
                      I identify as male
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Label>
        </div>

        {/* Female Option */}
        <div className="relative">
          <RadioGroupItem value="female" id="female" className="peer sr-only" />
          <Label
            htmlFor="female"
            className={cn(
              'flex cursor-pointer rounded-xl border-2 transition-all duration-300',
              'hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]',
              gender === 'female'
                ? 'border-primary bg-primary/5 shadow-md ring-2 ring-primary/20'
                : 'border-border hover:border-primary/50 hover:bg-primary/5'
            )}
          >
            <Card className="w-full border-0 shadow-none bg-transparent">
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col items-center space-y-4 sm:space-y-6">
                  <div
                    className={cn(
                      'w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center transition-all duration-300 relative',
                      gender === 'female'
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-primary/10 text-primary'
                    )}
                  >
                    <UserCheck className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12" />
                    {gender === 'female' && (
                      <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-7 h-7 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
                        <Check className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center space-y-2">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
                      Female
                    </h3>
                    <p className="text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed">
                      I identify as female
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Label>
        </div>
      </RadioGroup>

      {/* Selected Gender Summary */}
      {gender && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-4 sm:p-5 bg-primary/5 rounded-xl border border-primary/20">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-primary/10 flex-shrink-0">
                {gender === 'male' ? (
                  <User className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                ) : (
                  <UserCheck className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-primary mb-1">
                  Gender: {gender === 'male' ? 'Male' : 'Female'}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                  We'll generate a personalized profile picture and match you with appropriate pod members.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

