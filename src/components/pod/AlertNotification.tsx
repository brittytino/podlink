'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, X } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

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

  const handleResolve = async () => {
    try {
      const response = await fetch('/api/alerts/resolve', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertId: alert.id }),
      });

      if (response.ok) {
        toast({
          title: 'Alert Resolved',
          description: 'Crisis alert has been marked as resolved.',
        });
        onResolve();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to resolve alert.',
        variant: 'destructive',
      });
    }
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
          >
            <X className="h-4 w-4" />
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
        <Button variant="destructive" size="sm" className="w-full">
          Send Encouragement
        </Button>
      </CardContent>
    </Card>
  );
}
