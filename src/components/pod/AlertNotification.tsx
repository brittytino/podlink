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
          alertId: alert.id 
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
    <Card className="border-red-500 bg-red-50 dark:bg-red-950/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5 animate-pulse" />
            Crisis Alert
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={handleResolve}
            disabled={resolving}
          >
            {resolving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <X className="h-4 w-4" />
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm">
          <span className="font-semibold">{alert.username}</span> needs support right now!
        </p>
        {alert.message && (
          <p className="text-sm italic text-muted-foreground">
            "{alert.message}"
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          {formatDate(alert.createdAt)}
        </p>
        <Button 
          variant="destructive" 
          size="sm" 
          className="w-full"
          onClick={handleSendEncouragement}
        >
          Send Encouragement
        </Button>
      </CardContent>
    </Card>
  );
}
