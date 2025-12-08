'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const { toast } = useToast();

  const handleResendEmail = async () => {
    if (!email) {
      toast({
        title: 'Error',
        description: 'Email address not found. Please try registering again.',
        variant: 'destructive',
      });
      return;
    }

    setIsResending(true);
    setResendSuccess(false);

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: 'Error',
          description: data.error || 'Failed to resend verification email',
          variant: 'destructive',
        });
        return;
      }

      setResendSuccess(true);
      toast({
        title: 'Email Sent!',
        description: 'A new verification link has been sent to your email.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card className="w-full border border-gray-200 dark:border-zinc-800 shadow-xl bg-white dark:bg-zinc-950 rounded-2xl">
      <CardHeader className="text-center pt-8 pb-6">
        <div className="flex justify-center mb-4">
          <div className="bg-black dark:bg-white p-4 rounded-2xl">
            <Mail className="h-8 w-8 text-white dark:text-black" />
          </div>
        </div>
        <CardTitle className="text-2xl sm:text-3xl font-light tracking-tight text-gray-900 dark:text-white">
          Verify Your Email
        </CardTitle>
        <CardDescription className="text-base text-gray-600 dark:text-gray-400 mt-2">
          We've sent a verification link to your email
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 sm:px-8 pb-6 space-y-5">{email && (
          <div className="bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 rounded-xl p-4">
            <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
              <strong className="text-black dark:text-white">{email}</strong>
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-500 mt-0.5 shrink-0" />
            <p>
              Click the verification link in the email we sent you to activate your account.
            </p>
          </div>

          <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5 shrink-0" />
            <p>
              The verification link will expire in <strong>24 hours</strong>.
            </p>
          </div>
        </div>

        <div className="pt-4 space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            Didn't receive the email?
          </p>

          <Button
            onClick={handleResendEmail}
            disabled={isResending || resendSuccess}
            className="w-full h-11 bg-black hover:bg-gray-900 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black font-medium shadow-sm hover:shadow-md transition-all duration-200"
          >
            {isResending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : resendSuccess ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Email Sent!
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Resend Verification Email
              </>
            )}
          </Button>

          {resendSuccess && (
            <p className="text-sm text-green-600 dark:text-green-500 text-center">
              ✓ Check your inbox for the new verification email
            </p>
          )}
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-zinc-800/50">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            Already verified?{' '}
            <Link
              href="/login"
              className="font-medium text-black dark:text-white hover:underline transition-colors"
            >
              Login here
            </Link>
          </p>
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400">
          <p className="text-center">
            <strong>Tip:</strong> Check your spam folder if you don't see the email.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-black dark:text-white" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
