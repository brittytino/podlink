'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, X, Loader2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useSocket } from '@/hooks/useSocket';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface AlertNotificationProps {
  alert: {
    id: string;
    userId: string;
    username: string;
    message: string | null;
    createdAt: string;
  };
  onResolve: () => void;
}

export function AlertNotification({ alert, onResolve }: AlertNotificationProps) {
  const { toast } = useToast();
  const { socket } = useSocket();
  const { data: session } = useSession();
  const router = useRouter();
  const [resolving, setResolving] = useState(false);

  const handleResolve = async () => {
    if (resolving) return;

    setResolving(true);
    try {
      const response = await fetch('/api/alerts/resolve', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertId: alert.id }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to resolve alert');
      }

      // Emit socket event to notify others
      if (socket && session?.user?.podId) {
        socket.emit('alert-resolved', {
          podId: session.user.podId,
          alertId: alert.id,
        });
      }

      toast({
        title: 'Alert Resolved',
        description: 'Crisis alert has been marked as resolved.',
      });
      onResolve();
    } catch (error: any) {
      console.error('Resolve alert error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to resolve alert. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setResolving(false);
    }
  };

  const handleSendEncouragement = () => {
    router.push('/pod');
  };

  return (
    <Card className="rounded-2xl border-2 border-red-200 dark:border-red-800/40 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/10">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-red-600 text-white shadow-sm">
              <AlertCircle className="h-5 w-5 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-red-700">Crisis Alert</span>
              <span className="text-xs text-muted-foreground">Urgent support requested</span>
            </div>
          </div>

          <div className="ml-3 flex items-start gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-full hover:bg-muted/30"
              onClick={handleResolve}
              disabled={resolving}
              aria-label="Resolve alert"
            >
              {resolving ? (
                <Loader2 className="h-4 w-4 animate-spin text-red-600" />
              ) : (
                <X className="h-4 w-4 text-red-600" />
              )}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm">
          <span className="font-medium">{alert.username}</span> needs support right now!
        </p>
        {alert.message && (
          <p className="text-sm italic text-muted-foreground bg-red-50 p-3 rounded-md border border-red-100">"{alert.message}"</p>
        )}
        <p className="text-xs text-muted-foreground">{formatDate(alert.createdAt)}</p>
        <div className="flex gap-2">
          <Button
            variant="destructive"
            size="sm"
            className="flex-1"
            onClick={handleSendEncouragement}
          >
            Send Encouragement
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-32"
            onClick={handleResolve}
            disabled={resolving}
          >
            {resolving ? 'Resolving...' : 'Resolve'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
