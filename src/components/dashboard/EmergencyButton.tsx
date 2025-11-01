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
import { AlertCircle, Loader2 } from 'lucide-react';
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
      const response = await fetch('/api/alerts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          podId,
          message: message || 'I need help right now!',
        }),
      });

      if (response.ok) {
        toast({
          title: 'Alert Sent! 🚨',
          description: 'Your pod members have been notified.',
        });
        setOpen(false);
        setMessage('');
        router.push('/pod');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send alert. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        size="lg"
        variant="destructive"
        className="w-full h-14 sm:h-16 text-base sm:text-lg font-bold animate-pulse hover:animate-none shadow-lg hover:shadow-xl transition-shadow"
        onClick={() => setOpen(true)}
      >
        <AlertCircle className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
        I Need Help Now!
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600 text-lg sm:text-xl">
              <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6" />
              Crisis Alert
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Your pod members will be notified immediately. You can add an optional message.
            </DialogDescription>
          </DialogHeader>

          <Textarea
            placeholder="Optional: Describe what you're feeling... (e.g., 'Having strong urges right now')"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[100px] text-sm sm:text-base"
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleEmergency}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Alert to Pod'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
