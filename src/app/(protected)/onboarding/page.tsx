'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { GoalSelection } from '@/components/onboarding/GoalSelection-simple';
import { PodTypeSelection } from '@/components/onboarding/PodTypeSelection';
import { AvailabilityMessageInput } from '@/components/onboarding/AvailabilityMessageInput';
import { TimezoneSelector } from '@/components/onboarding/TimezoneSelector';
import { AvailabilityPicker } from '@/components/onboarding/AvailabilityPicker';
import { GenderSelector } from '@/components/onboarding/GenderSelector';
import { Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();
  const { data: session, update } = useSession();
  const { toast } = useToast();

  // Check if onboarding is already complete
  useEffect(() => {
    const checkOnboarding = async () => {
      // Only check session, don't rely on localStorage for server-side data
      const sessionComplete = session?.user?.onboardingComplete;
      
      if (sessionComplete) {
        router.push('/dashboard');
        return;
      }
      setChecking(false);
    };

    checkOnboarding();
  }, [session, router]);

  const [formData, setFormData] = useState<{
    goalType: 'QUIT_HABIT' | 'BUILD_HABIT' | null;
    goalDescription: string;
    goalCategory: string | null;
    podType: 'REAL' | 'AI' | null;
    availabilityMessage: string;
    timezone: string;
    availabilityHours: { start: string; end: string };
    gender: 'male' | 'female' | null;
  }>({
    goalType: null,
    goalDescription: '',
    goalCategory: null,
    podType: null,
    availabilityMessage: '',
    timezone: 'Asia/Kolkata',
    availabilityHours: { start: '09:00', end: '22:00' },
    gender: null,
  });

  const totalSteps = 6;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step === 1 && (!formData.goalType || !formData.goalDescription.trim())) {
      toast({
        title: 'Required Fields',
        description: 'Please select a goal type and describe your specific goal',
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
    if (step === 4 && !formData.gender) {
      toast({
        title: 'Required Field',
        description: 'Please select your gender',
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
        
        // Update session with onboarding data and avatar
        await update({
          onboardingComplete: true,
          podId: data.podId,
          avatarUrl: data.avatarUrl || null,
        });

        toast({
          title: 'Welcome to PodLink! 🎉',
          description: data.podId
            ? 'You have been assigned to a pod!'
            : 'We will assign you to a pod soon!',
        });

        router.push('/dashboard');
        router.refresh();
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast({
          title: 'Error',
          description: errorData.error || 'Failed to complete onboarding',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Onboarding error:', error);
      toast({
        title: 'Error',
        description: 'Failed to complete onboarding',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking onboarding status
  if (checking) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-background to-muted/20">
      {/* Fixed Header */}
      <div className="flex-none px-4 lg:px-8 pt-6 lg:pt-8 pb-4 lg:pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center lg:text-left mb-6 lg:mb-8">
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 lg:mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Let's Get Started
            </h1>
            <p className="text-base lg:text-lg xl:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
              Tell us about yourself so we can find the perfect accountability pod for you
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6 lg:mb-8">
            <Progress value={progress} className="h-3 lg:h-4 rounded-full bg-muted" />
            <div className="flex justify-between items-center mt-3 lg:mt-4">
              <p className="text-sm lg:text-base text-muted-foreground font-medium">
                Step {step} of {totalSteps}
              </p>
              <p className="text-sm lg:text-base text-primary font-semibold">
                {Math.round(progress)}% Complete
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 px-4 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full">
          <Card className="h-full border-2 shadow-xl rounded-2xl lg:rounded-3xl overflow-hidden bg-card/80 backdrop-blur-sm">
            <CardContent className="h-full p-0 flex flex-col">
              {/* Content Area */}
              <div className="flex-1 p-6 lg:p-10 xl:p-12 overflow-hidden">
                {step === 1 && (
                  <GoalSelection
                    goalType={formData.goalType}
                    goalDescription={formData.goalDescription}
                    goalCategory={formData.goalCategory}
                    onGoalTypeChange={(value) => {
                      console.log('Parent received goal type:', value);
                      setFormData({ ...formData, goalType: value });
                    }}
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
                  <GenderSelector
                    gender={formData.gender}
                    onGenderChange={(value) =>
                      setFormData({ ...formData, gender: value })
                    }
                  />
                )}

                {step === 5 && (
                  <TimezoneSelector
                    timezone={formData.timezone}
                    onTimezoneChange={(value) =>
                      setFormData({ ...formData, timezone: value })
                    }
                  />
                )}

                {step === 6 && (
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
              </div>

              {/* Fixed Footer with Navigation */}
              <div className="flex-none border-t bg-card/90 backdrop-blur-sm p-6 lg:p-8">
                <div className="flex justify-between items-center">
                  {step > 1 ? (
                    <Button 
                      variant="outline" 
                      onClick={handleBack}
                      size="lg"
                      className="px-6 lg:px-8 py-3 lg:py-4 text-base lg:text-lg border-2 rounded-xl hover:bg-muted/50"
                    >
                      <ArrowLeft className="mr-2 h-5 w-5 lg:h-6 lg:w-6" />
                      Back
                    </Button>
                  ) : (
                    <div />
                  )}

                  {step < totalSteps ? (
                    <Button 
                      onClick={handleNext}
                      size="lg"
                      className="px-6 lg:px-8 py-3 lg:py-4 text-base lg:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Next
                      <ArrowRight className="ml-2 h-5 w-5 lg:h-6 lg:w-6" />
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleSubmit} 
                      disabled={loading}
                      size="lg"
                      className="px-6 lg:px-8 py-3 lg:py-4 text-base lg:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 min-w-[160px]"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 lg:h-6 lg:w-6 animate-spin" />
                          Completing...
                        </>
                      ) : (
                        <>
                          Complete Setup
                          <ArrowRight className="ml-2 h-5 w-5 lg:h-6 lg:w-6" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
