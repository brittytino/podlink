'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { GoalSelection } from '@/components/onboarding/GoalSelection';
import { PodTypeSelection } from '@/components/onboarding/PodTypeSelection';
import { AvailabilityMessageInput } from '@/components/onboarding/AvailabilityMessageInput';
import { TimezoneSelector } from '@/components/onboarding/TimezoneSelector';
import { AvailabilityPicker } from '@/components/onboarding/AvailabilityPicker';
import { Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { update } = useSession();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    goalType: 'BUILD_HABIT',
    goalDescription: '',
    goalCategory: null as string | null,
    podType: null as 'REAL' | 'AI' | null,
    availabilityMessage: '',
    timezone: 'Asia/Kolkata',
    availabilityHours: { start: '09:00', end: '22:00' },
  });

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step === 1 && !formData.goalDescription.trim()) {
      toast({
        title: 'Required Field',
        description: 'Please select a goal or describe your custom goal',
        variant: 'destructive',
      });
      return;
    }
    if (step === 2 && !formData.podType) {
      toast({
        title: 'Required Field',
        description: 'Please select a pod type',
        variant: 'destructive',
      });
      return;
    }
    if (step === 3 && !formData.availabilityMessage.trim()) {
      toast({
        title: 'Required Field',
        description: 'Please write your availability message',
        variant: 'destructive',
      });
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update session
        await update({
          onboardingComplete: true,
          podId: data.podId,
        });

        toast({
          title: 'Welcome to PodLink! 🎉',
          description: data.podId
            ? 'You have been assigned to a pod!'
            : 'We will assign you to a pod soon!',
        });

        router.push('/dashboard');
        router.refresh();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to complete onboarding',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-3 sm:px-4">
      <div className="w-full max-w-2xl">
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Let's Get Started</h1>
          <p className="text-sm sm:text-base text-muted-foreground px-2">
            Tell us about yourself so we can find the perfect accountability pod for you
          </p>
        </div>

        <div className="mb-6">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground text-center mt-2">
            Step {step} of {totalSteps}
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            {step === 1 && (
              <GoalSelection
                goalType={formData.goalType}
                goalDescription={formData.goalDescription}
                goalCategory={formData.goalCategory}
                onGoalTypeChange={(value) =>
                  setFormData({ ...formData, goalType: value, goalCategory: null })
                }
                onGoalDescriptionChange={(value) =>
                  setFormData({ ...formData, goalDescription: value })
                }
                onGoalCategoryChange={(value) =>
                  setFormData({ ...formData, goalCategory: value })
                }
              />
            )}

            {step === 2 && (
              <PodTypeSelection
                podType={formData.podType}
                onPodTypeChange={(value) =>
                  setFormData({ ...formData, podType: value })
                }
              />
            )}

            {step === 3 && (
              <AvailabilityMessageInput
                message={formData.availabilityMessage}
                onMessageChange={(value) =>
                  setFormData({ ...formData, availabilityMessage: value })
                }
              />
            )}

            {step === 4 && (
              <TimezoneSelector
                timezone={formData.timezone}
                onTimezoneChange={(value) =>
                  setFormData({ ...formData, timezone: value })
                }
              />
            )}

            {step === 5 && (
              <AvailabilityPicker
                startTime={formData.availabilityHours.start}
                endTime={formData.availabilityHours.end}
                onStartTimeChange={(value) =>
                  setFormData({
                    ...formData,
                    availabilityHours: {
                      ...formData.availabilityHours,
                      start: value,
                    },
                  })
                }
                onEndTimeChange={(value) =>
                  setFormData({
                    ...formData,
                    availabilityHours: {
                      ...formData.availabilityHours,
                      end: value,
                    },
                  })
                }
              />
            )}

            <div className="flex justify-between mt-8">
              {step > 1 ? (
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              ) : (
                <div />
              )}

              {step < totalSteps ? (
                <Button onClick={handleNext}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Completing...
                    </>
                  ) : (
                    'Complete Setup'
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
