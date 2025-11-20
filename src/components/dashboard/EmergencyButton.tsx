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
import { AlertCircle, Loader2, Shield, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmergencyButtonProps {
  userId: string;
  podId: string;
}

export function EmergencyButton({ userId, podId }: EmergencyButtonProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleEmergency = async () => {
    if (!podId) {
      toast({
        title: 'No Pod Assigned',
        description: 'You need to be in a pod to send alerts.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Use the new help endpoint that handles availability and AI responses
      const response = await fetch('/api/help', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          podId,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        if (data.type === 'alert_created') {
          toast({
            title: 'Alert Sent! 🚨',
            description: 'Your pod members have been notified.',
          });
          setOpen(false);
          setMessage('');
          router.push('/pod');
        } else if (data.type === 'availability_message') {
          toast({
            title: `Message from ${data.from}`,
            description: data.message,
          });
          setOpen(false);
          setMessage('');
        } else if (data.type === 'ai_response') {
          toast({
            title: `${data.source} says:`,
            description: data.message,
          });
          setOpen(false);
          setMessage('');
        }
      } else {
        const errorData = await response.json();
        toast({
          title: 'Error',
          description: errorData.error || 'Failed to get help. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to get help. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
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
            onClick={() => setOpen(true)}
            aria-label="Trigger emergency alert dialog"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex items-center justify-center bg-white/10 rounded-lg p-2 sm:p-3">
                <AlertCircle className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>

              <div className="flex flex-col items-start leading-tight text-left">
                <span className="text-sm sm:text-base md:text-lg text-white">I Need Help Now!</span>
                <span className="text-xs sm:text-sm text-white/90 font-medium">Notify your pod and get immediate support</span>
              </div>

              <div className="hidden md:flex items-center justify-center ml-4">
                <Zap className="h-5 w-5 text-yellow-300 animate-bounce" />
              </div>
            </div>
          </Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg border-2 border-red-200 dark:border-red-900/50 shadow-2xl rounded-2xl">
          <DialogHeader className="space-y-3">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg ring-4 ring-red-100 dark:ring-red-900/30">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <DialogTitle className="flex flex-col items-center gap-2 text-center">
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">Crisis Alert</span>
              <div className="flex items-center gap-2 text-sm font-normal text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Instant notification to your pod
              </div>
            </DialogTitle>
            <DialogDescription className="text-center text-sm sm:text-base leading-relaxed">
              Your pod members will be notified immediately and can reach out to support you.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 rounded-xl p-4 border border-red-200 dark:border-red-800/30">
              <p className="text-sm font-medium text-foreground/80 mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                Optional Message
              </p>
              <Textarea
                placeholder="Share what you're feeling right now... (e.g., 'Having strong urges' or 'Need to talk')"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[100px] resize-none bg-background/50 backdrop-blur-sm border-2 focus:border-red-300 dark:focus:border-red-700 transition-colors rounded-lg"
              />
              <p className="text-xs text-muted-foreground mt-2">{message.length}/500 characters</p>
            </div>

            <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg border">
              <Shield className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">Your safety matters. This alert helps your pod provide immediate support during difficult moments.</p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-3">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="flex-1 sm:flex-none rounded-xl hover:bg-muted/80"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEmergency}
              disabled={loading}
              className="flex-1 sm:flex-none bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all rounded-xl font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Alert...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Send Alert to Pod
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Oswald:wght@200..700&display=swap');

        /* subtle helper to keep the button visually consistent with navbar */
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}
