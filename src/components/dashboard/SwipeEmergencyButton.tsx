'use client';

import { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Loader2, Shield, Check, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface SwipeEmergencyButtonProps {
  userId: string;
  podId: string;
}

export function SwipeEmergencyButton({ userId, podId }: SwipeEmergencyButtonProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertSent, setAlertSent] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [swiped, setSwiped] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  
  const constraintsRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const background = useTransform(x, [0, 300], ['#dc2626', '#16a34a']);
  const opacity = useTransform(x, [0, 300], [1, 0]);

  // Send crisis alert
  const sendCrisisAlert = async () => {
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
      const response = await fetch('/api/alerts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          podId,
          message: null,
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
        resetSwipe();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send alert. Please try again.',
        variant: 'destructive',
      });
      setOpen(false);
      resetSwipe();
    } finally {
      setLoading(false);
    }
  };

  const resetSwipe = () => {
    setSwiped(false);
    x.set(0);
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > 250) {
      setSwiped(true);
      x.set(300);
      // Trigger alert
      setOpen(true);
      sendCrisisAlert();
    } else {
      x.set(0);
    }
  };

  const handleDialogClose = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setAlertSent(false);
      setMessage('');
      resetSwipe();
    }
  };

  // Send optional follow-up message
  const sendFollowUpMessage = async () => {
    if (!message.trim()) {
      router.push('/pod');
      setOpen(false);
      resetSwipe();
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
        resetSwipe();
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
      <div className="w-full">
        <div 
          ref={constraintsRef} 
          className="relative h-[44px] sm:h-[52px] bg-gradient-to-r from-red-50/80 to-red-100/90 dark:from-red-950/30 dark:to-red-900/20 rounded-full overflow-hidden border border-red-200 dark:border-red-800/30 shadow-md"
        >
          {/* Background fill */}
          <motion.div
            className="absolute inset-0 bg-red-500/10"
            style={{ 
              scaleX: useTransform(x, [0, 300], [1, 0]),
              transformOrigin: 'left'
            }}
          />
          
          {/* Text label */}
          <motion.div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ opacity }}
          >
            <span className="text-xs sm:text-sm font-semibold text-red-700 dark:text-red-300">
              I Need Help Now!
            </span>
          </motion.div>

          {/* Success text */}
          <motion.div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ opacity: useTransform(x, [250, 300], [0, 1]) }}
          >
            <span className="text-xs sm:text-sm font-semibold text-green-700 dark:text-green-300">
              Alert Sending! 🚨
            </span>
          </motion.div>

          {/* Draggable button */}
          <motion.div
            drag="x"
            dragConstraints={constraintsRef}
            dragElastic={0.1}
            dragMomentum={false}
            onDragEnd={handleDragEnd}
            style={{ x }}
            className="absolute top-1 left-1 bottom-1 w-10 sm:w-12 bg-white dark:bg-gray-800 rounded-full shadow-md cursor-grab active:cursor-grabbing flex items-center justify-center border border-red-300 dark:border-red-700"
          >
            <motion.div
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-red-500/10 dark:bg-red-500/20 flex items-center justify-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-500" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={handleDialogClose}>
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
                <label className="text-sm font-medium">
                  Additional Context (Optional)
                </label>
                <Textarea
                  placeholder="Share what's happening or how your pod can help..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>

              <DialogFooter className="gap-2 sm:gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    router.push('/pod');
                    setOpen(false);
                    resetSwipe();
                  }}
                  disabled={sendingMessage}
                >
                  Skip & Go to Pod
                </Button>
                <Button
                  onClick={sendFollowUpMessage}
                  disabled={sendingMessage}
                  className="bg-gradient-to-r from-red-600 to-orange-600"
                >
                  {sendingMessage ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send & Go to Pod'
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
