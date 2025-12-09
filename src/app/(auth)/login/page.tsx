'use client';

import { useState, useEffect, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const verified = searchParams.get('verified');
    const message = searchParams.get('message');
    
    if (verified === 'true' && message) {
      toast({
        title: 'Email Verified!',
        description: message,
      });
    }
  }, [searchParams, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        let title = 'Login Failed';
        let description = 'Invalid email or password';

        if (result.error === 'EMAIL_NOT_VERIFIED') {
          title = 'Email Not Verified';
          description = 'Please verify your email before logging in. Click below to resend.';
          
          toast({
            title,
            description,
            variant: 'destructive',
          });
          
          setTimeout(() => {
            router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
          }, 2000);
          
          setLoading(false);
          return;
        }

        toast({
          title,
          description,
          variant: 'destructive',
        });
        setLoading(false);
      } else if (result?.ok) {
        toast({
          title: 'Welcome back!',
          description: 'Logging you in...',
        });
        
        // Force a hard redirect to ensure session is loaded
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Network Error',
        description: 'Unable to connect to server',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      // Redirect to dashboard, middleware will handle onboarding redirect if needed
      await signIn('google', { 
        callbackUrl: '/dashboard',
        redirect: true 
      });
    } catch (error) {
      console.error('Google sign-in error:', error);
      toast({
        title: 'Sign-in Error',
        description: 'Failed to sign in with Google. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="w-full border border-gray-200 dark:border-zinc-800 shadow-xl bg-white dark:bg-zinc-950 rounded-2xl">
      <CardHeader className="text-center pt-8 pb-6">
        <CardTitle className="text-2xl sm:text-3xl font-light tracking-tight text-gray-900 dark:text-white">
          Welcome back
        </CardTitle>
        <CardDescription className="text-base text-gray-600 dark:text-gray-400 mt-2">
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 sm:px-8 pb-6 space-y-5">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                className="h-11 pl-12 pr-4 text-base bg-gray-50 dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-800 focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10 rounded-xl transition-all"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </Label>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-gray-500 hover:text-black dark:hover:text-white transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="h-11 pl-12 pr-12 text-base bg-gray-50 dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-800 focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10 rounded-xl transition-all"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none transition-colors"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-11 bg-black hover:bg-gray-900 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black font-medium text-base rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200 dark:border-zinc-800" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white dark:bg-zinc-950 text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Sign In */}
        <Button
          type="button"
          variant="outline"
          className="w-full h-11 border border-gray-300 dark:border-zinc-700 hover:border-black dark:hover:border-white hover:bg-gray-50 dark:hover:bg-zinc-900/50 font-medium rounded-xl transition-all duration-200"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </Button>
      </CardContent>

        <CardFooter className="flex flex-col space-y-6 pt-4 pb-10 px-8 border-t border-gray-100 dark:border-zinc-800/50">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Don’t have an account?{' '}
            <Link
              href="/register"
              className="font-medium text-black dark:text-white hover:underline transition-all"
            >
              Sign up
            </Link>
          </p>

          <div className="flex justify-center gap-6 text-sm text-gray-500 dark:text-gray-500">
            <Link href="/terms" className="hover:text-black dark:hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-black dark:hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/help" className="hover:text-black dark:hover:text-white transition-colors">
              Support
            </Link>
          </div>
        </CardFooter>
      </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-black dark:text-white" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}