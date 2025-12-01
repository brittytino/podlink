'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Loader2, Shield, Zap, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmergencyButtonProps {
  userId: string;
  podId: string;
}

export function EmergencyButton({ userId, podId }: EmergencyButtonProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertSent, setAlertSent] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Send crisis alert immediately when dialog opens
  const sendCrisisAlert = async () => {
    if (!podId) {
      toast({
        title: 'No Pod Assigned',
        description: 'You need to be in a pod to send alerts.',
        variant: 'destructive',
      });
      setOpen(false);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/alerts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          podId,
          message: null, // No initial message - just send alert
        }),
      });

      if (response.ok) {
        setAlertSent(true);
        toast({
          title: '🚨 Crisis Alert Sent!',
          description: 'Your pod members have been notified immediately.',
        });
      } else {
        const errorData = await response.json();
        toast({
          title: 'Error',
          description: errorData.error || 'Failed to send alert. Please try again.',
          variant: 'destructive',
        });
        setOpen(false);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send alert. Please try again.',
        variant: 'destructive',
      });
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  // Handle dialog open - send alert immediately
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      sendCrisisAlert();
    } else {
      // Reset state when closing
      setAlertSent(false);
      setMessage('');
    }
  };

  // Send optional follow-up message
  const sendFollowUpMessage = async () => {
    if (!message.trim()) {
      // No message to send - just close dialog
      router.push('/pod');
      setOpen(false);
      return;
    }

    setSendingMessage(true);

    try {
      const response = await fetch('/api/pods/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          podId,
          userId,
          messageText: message.trim(),
          isCrisisResponse: true,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Message Sent',
          description: 'Your additional context has been shared with your pod.',
        });
        router.push('/pod');
        setOpen(false);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to send message, but your alert was sent.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message, but your alert was sent.',
        variant: 'destructive',
      });
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <>
      {/* Prominent responsive button matching navbar visual language */}
      <div className="w-full max-w-[900px] mx-auto">
        <div className="relative group">
          {/* Subtle pulse ring to match navbar emphasis */}
          <div className="absolute inset-0 rounded-2xl bg-red-500/10 group-hover:opacity-0 transition-opacity" aria-hidden />

          <Button
            size="lg"
            className="relative w-full h-16 sm:h-18 md:h-20 lg:h-24 text-base sm:text-lg md:text-xl font-extrabold bg-gradient-to-r from-red-600 via-red-500 to-orange-500 hover:from-red-700 hover:via-red-600 hover:to-orange-600 shadow-lg hover:shadow-red-500/30 transition-transform transform-gpu rounded-2xl border-2 border-red-400/20 flex items-center justify-center gap-4"
            onClick={() => handleOpenChange(true)}
            aria-label="Trigger emergency alert dialog"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex items-center justify-center bg-white/10 rounded-lg p-2 sm:p-3">
                <AlertCircle className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>

              <div className="flex flex-col items-start leading-tight text-left">
                <span className="text-sm sm:text-base md:text-lg text-white">I Need Help Now!</span>
                <span className="text-xs sm:text-sm text-white/90 font-medium">Instant support from your pod</span>
              </div>

              <div className="hidden md:flex items-center justify-center ml-4">
                <Zap className="h-5 w-5 text-yellow-300 animate-bounce" />
              </div>
            </div>
          </Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-lg border-2 border-red-200 dark:border-red-900/50 shadow-2xl rounded-2xl">
          <DialogHeader className="space-y-3">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg ring-4 ring-red-100 dark:ring-red-900/30">
              {alertSent ? (
                <Check className="h-8 w-8 text-white" />
              ) : (
                <Shield className="h-8 w-8 text-white" />
              )}
            </div>
            <DialogTitle className="flex flex-col items-center gap-2 text-center">
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                {loading ? 'Sending Crisis Alert...' : alertSent ? 'Alert Sent! 🚨' : 'Crisis Alert'}
              </span>
              {alertSent && (
                <div className="flex items-center gap-2 text-sm font-normal text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Your pod has been notified
                </div>
              )}
            </DialogTitle>
            <DialogDescription className="text-center text-sm sm:text-base leading-relaxed">
              {alertSent
                ? 'Pod members are being alerted. You can add more context below (optional).'
                : 'Sending instant notification to your pod...'}
            </DialogDescription>
          </DialogHeader>

          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-red-500" />
            </div>
          )}

          {alertSent && !loading && (
            <>
              <div className="space-y-3 py-4">
                <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 rounded-xl p-4 border border-red-200 dark:border-red-800/30">
                  <p className="text-sm font-medium text-foreground/80 mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    Additional Message (Optional)
                  </p>
                  <Textarea
                    placeholder="Add more details about what you're feeling... (completely optional)"
                    value={message}
                    onChange={(e) => setMessage(e.target.value.slice(0, 500))}
                    className="min-h-[100px] resize-none bg-background/50 backdrop-blur-sm border-2 focus:border-red-300 dark:focus:border-red-700 transition-colors rounded-lg"
                  />
                  <p className="text-xs text-muted-foreground mt-2">{message.length}/500 characters</p>
                </div>

                <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg border">
                  <Shield className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Your alert has been sent. Pod members will receive auto-responses if they're offline.
                  </p>
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-3">
                <Button
                  onClick={() => {
                    router.push('/pod');
                    setOpen(false);
                  }}
                  variant="outline"
                  disabled={sendingMessage}
                  className="flex-1 sm:flex-none rounded-xl hover:bg-muted/80"
                >
                  Go to Pod Chat
                </Button>
                <Button
                  onClick={sendFollowUpMessage}
                  disabled={sendingMessage}
                  className="flex-1 sm:flex-none bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all rounded-xl font-semibold"
                >
                  {sendingMessage ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : message.trim() ? (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  ) : (
                    'Skip Message'
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
