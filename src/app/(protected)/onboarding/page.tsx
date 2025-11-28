'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { GoalSelection } from '@/components/onboarding/GoalSelection-simple';
import { PodTypeSelection } from '@/components/onboarding/PodTypeSelection';
import { AvailabilityMessageInput } from '@/components/onboarding/AvailabilityMessageInput';
import { TimezoneSelector } from '@/components/onboarding/TimezoneSelector';
import { AvailabilityPicker } from '@/components/onboarding/AvailabilityPicker';
import { GenderSelector } from '@/components/onboarding/GenderSelector';
import { Loader2, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
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

  const stepTitles = [
    'Set Your Goal',
    'Choose Your Pod Type',
    'Share Your Availability',
    'Select Gender Preference',
    'Set Your Timezone',
    'Define Your Schedule'
  ];

  const stepDescriptions = [
    'What would you like to achieve?',
    'Get paired with real people or AI assistants',
    'Let your pod know when you\'re available',
    'Help us match you better',
    'Where are you located?',
    'When are you most active?'
  ];

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="h-10 w-10 text-primary mx-auto mb-3" />
          </motion.div>
          <p className="text-slate-600 text-sm font-medium">Loading...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Desktop: Two-Column Layout | Mobile: Single Column */}
      <div className="w-full min-h-screen lg:flex">
        
        {/* Left Sidebar - Progress & Info (Desktop Only) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden lg:flex lg:w-[380px] xl:w-[420px] bg-white border-r border-slate-200 flex-col"
        >
          <div className="flex-1 p-8 xl:p-10 flex flex-col">
            {/* Logo/Brand Area */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome to PodLink</h2>
              <p className="text-sm text-slate-600 leading-relaxed">Let's set up your accountability journey</p>
            </div>

            {/* Progress Overview */}
            <div className="flex-1">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Progress</span>
                  <span className="text-xl font-bold text-primary">{Math.round(progress)}%</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="h-full bg-primary rounded-full shadow-sm"
                  />
                </div>
              </div>

              {/* Step List */}
              <div className="space-y-2.5">
                {stepTitles.map((title, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center gap-3 p-3.5 rounded-xl transition-all duration-200 ${
                      index < step - 1
                        ? 'bg-slate-50'
                        : index === step - 1
                        ? 'bg-primary/5 border border-primary/20'
                        : 'bg-transparent'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 ${
                        index < step - 1
                          ? 'bg-primary text-white shadow-sm'
                          : index === step - 1
                          ? 'bg-primary text-white ring-4 ring-primary/10 shadow-sm'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {index < step - 1 ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-semibold transition-colors duration-200 truncate ${
                          index === step - 1
                            ? 'text-slate-900'
                            : index < step - 1
                            ? 'text-slate-600'
                            : 'text-slate-400'
                        }`}
                      >
                        {title}
                      </p>
                      {index === step - 1 && (
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">{stepDescriptions[index]}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Security Notice */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="flex items-start gap-3 text-xs text-slate-600">
                <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
                <p className="leading-relaxed">
                  Your data is encrypted and secure. We use this information to create the perfect accountability pod for you.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col min-h-screen lg:min-h-0">
          
          {/* Mobile Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-10 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1 min-w-0 pr-3">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 truncate">{stepTitles[step - 1]}</h1>
                <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">{stepDescriptions[step - 1]}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-lg font-bold text-primary">{Math.round(progress)}%</p>
                <p className="text-xs text-slate-500">Step {step}/{totalSteps}</p>
              </div>
            </div>
            
            {/* Mobile Progress Bar */}
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-primary shadow-sm"
              />
            </div>

            {/* Mobile Step Dots */}
            <div className="flex justify-center gap-1.5 mt-3">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index < step - 1
                      ? 'w-5 bg-primary shadow-sm'
                      : index === step - 1
                      ? 'w-7 bg-primary shadow-sm'
                      : 'w-1.5 bg-slate-300'
                  }`}
                />
              ))}
            </div>
          </motion.div>

          {/* Desktop Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="hidden lg:block bg-white border-b border-slate-200 px-8 xl:px-12 py-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl xl:text-3xl font-bold text-slate-900 mb-1">
                  {stepTitles[step - 1]}
                </h1>
                <p className="text-sm xl:text-base text-slate-600">
                  {stepDescriptions[step - 1]}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-500 font-medium">Step {step} of {totalSteps}</span>
                {progress === 100 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50/50 via-white to-slate-50/50">
            <div className="h-full px-4 py-6 sm:px-6 lg:px-10 xl:px-12 lg:py-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="h-full w-full max-w-3xl mx-auto"
                >
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
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Footer Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white border-t border-slate-200 px-4 py-4 sm:px-6 lg:px-10 xl:px-12 lg:py-5 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3 sm:gap-4 max-w-3xl mx-auto">
              {/* Back Button */}
              {step > 1 ? (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="px-4 sm:px-6 h-11 text-sm font-semibold border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all rounded-lg"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  <span>Back</span>
                </Button>
              ) : (
                <div className="w-[90px] sm:w-[110px]" />
              )}

              {/* Next/Complete Button */}
              <div className="flex-1 sm:flex-none flex justify-end">
                {step < totalSteps ? (
                  <Button
                    onClick={handleNext}
                    className="w-full sm:w-auto px-6 sm:px-8 h-11 text-sm font-bold bg-primary hover:bg-primary/90 shadow-sm hover:shadow-md transition-all rounded-lg"
                  >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full sm:w-auto px-6 sm:px-8 h-11 text-sm font-bold bg-green-600 hover:bg-green-700 shadow-sm hover:shadow-md transition-all rounded-lg min-w-[160px] sm:min-w-[200px]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Completing...
                      </>
                    ) : (
                      <>
                        Complete Setup
                        <CheckCircle2 className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
