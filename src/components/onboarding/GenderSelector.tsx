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
    <div className="space-y-8 lg:space-y-10 max-h-[calc(100vh-400px)] lg:max-h-none overflow-hidden">
      <div className="text-center lg:text-left space-y-3 lg:space-y-4">
        <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-foreground">
          Select your gender
        </h2>
        <p className="text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0">
          This helps us generate a personalized profile picture and provide better matching recommendations
        </p>
      </div>

      <RadioGroup
        value={gender || ''}
        onValueChange={(value) => {
          if (value === 'male' || value === 'female') {
            onGenderChange(value);
          }
        }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-12"
      >
        {/* Male Option */}
        <div className="relative">
          <RadioGroupItem value="male" id="male" className="peer sr-only" />
          <Label
            htmlFor="male"
            className={cn(
              'flex cursor-pointer rounded-2xl lg:rounded-3xl border-2 transition-all duration-300',
              'hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]',
              'focus-within:ring-2 focus-within:ring-blue-400 focus-within:ring-offset-2',
              gender === 'male'
                ? 'border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-100'
                : 'border-border hover:border-blue-300 hover:bg-blue-50/30'
            )}
          >
            <Card className="w-full border-0 shadow-none bg-transparent">
              <CardContent className="p-8 lg:p-10 xl:p-12">
                <div className="flex flex-col items-center space-y-6 lg:space-y-8">
                  <div
                    className={cn(
                      'w-20 h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 rounded-full flex items-center justify-center transition-all duration-300 relative',
                      gender === 'male'
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'bg-blue-100 text-blue-500'
                    )}
                  >
                    <User className="h-10 w-10 lg:h-12 lg:w-12 xl:h-14 xl:w-14" />
                    {gender === 'male' && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 lg:w-10 lg:h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center space-y-3 lg:space-y-4">
                    <h3 className="text-xl lg:text-2xl xl:text-3xl font-bold text-foreground">
                      Male
                    </h3>
                    <p className="text-sm lg:text-base xl:text-lg text-muted-foreground leading-relaxed">
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
              'flex cursor-pointer rounded-2xl lg:rounded-3xl border-2 transition-all duration-300',
              'hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]',
              'focus-within:ring-2 focus-within:ring-pink-400 focus-within:ring-offset-2',
              gender === 'female'
                ? 'border-pink-500 bg-pink-50 shadow-lg ring-2 ring-pink-100'
                : 'border-border hover:border-pink-300 hover:bg-pink-50/30'
            )}
          >
            <Card className="w-full border-0 shadow-none bg-transparent">
              <CardContent className="p-8 lg:p-10 xl:p-12">
                <div className="flex flex-col items-center space-y-6 lg:space-y-8">
                  <div
                    className={cn(
                      'w-20 h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 rounded-full flex items-center justify-center transition-all duration-300 relative',
                      gender === 'female'
                        ? 'bg-pink-500 text-white shadow-lg'
                        : 'bg-pink-100 text-pink-500'
                    )}
                  >
                    <UserCheck className="h-10 w-10 lg:h-12 lg:w-12 xl:h-14 xl:w-14" />
                    {gender === 'female' && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 lg:w-10 lg:h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center space-y-3 lg:space-y-4">
                    <h3 className="text-xl lg:text-2xl xl:text-3xl font-bold text-foreground">
                      Female
                    </h3>
                    <p className="text-sm lg:text-base xl:text-lg text-muted-foreground leading-relaxed">
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
          <div className={cn(
            'p-6 lg:p-8 rounded-2xl border-2',
            gender === 'male' 
              ? 'bg-blue-50 border-blue-200' 
              : 'bg-pink-50 border-pink-200'
          )}>
            <div className="flex items-center gap-4 lg:gap-6">
              <div className={cn(
                'w-12 h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center',
                gender === 'male' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'
              )}>
                {gender === 'male' ? (
                  <User className="h-6 w-6 lg:h-8 lg:w-8" />
                ) : (
                  <UserCheck className="h-6 w-6 lg:h-8 lg:w-8" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm lg:text-base font-semibold text-foreground mb-1">
                  Gender: {gender === 'male' ? 'Male' : 'Female'}
                </p>
                <p className="text-sm lg:text-base text-muted-foreground">
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

