'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ReCAPTCHA from 'react-google-recaptcha';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { signIn } from 'next-auth/react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({ title: 'Password Mismatch', description: 'Passwords do not match.', variant: 'destructive' });
      return;
    }
    if (formData.password.length < 6) {
      toast({ title: 'Weak Password', description: 'Must be at least 6 characters.', variant: 'destructive' });
      return;
    }
    const token = recaptchaRef.current?.getValue();
    if (!token) {
      toast({ title: 'Verification Required', description: 'Please complete reCAPTCHA.', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password, recaptchaToken: token }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.emailSent) {
          toast({ 
            title: 'Account Created! 🎉', 
            description: 'Check your email inbox for the verification link.',
          });
        } else {
          toast({ 
            title: 'Account Created', 
            description: 'Email send failed. You can resend it from the next page.',
            variant: 'default',
          });
        }
        router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
      } else {
        toast({ title: 'Error', description: data.error || 'Something went wrong.', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({ title: 'Network Error', description: 'Unable to connect to server.', variant: 'destructive' });
    } finally {
      setLoading(false);
      recaptchaRef.current?.reset();
    }
  };

  const handleGoogleSignIn = () => signIn('google', { callbackUrl: '/onboarding' });

  return (
    <Card className="w-full border border-gray-200 dark:border-zinc-800 shadow-xl bg-white dark:bg-zinc-950 rounded-2xl">
      <CardHeader className="text-center pt-8 pb-6">
        <CardTitle className="text-2xl sm:text-3xl font-light tracking-tight text-gray-900 dark:text-white">
          Create account
        </CardTitle>
      </CardHeader>

      <CardContent className="px-6 sm:px-8 pb-6 space-y-5">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email — Full Width */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</Label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="email"
                placeholder="name@company.com"
                className="h-11 pl-12 text-base bg-gray-50 dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-800 focus:border-black dark:focus:border-white rounded-xl"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={loading}
              />
            </div>
          </div>

          {/* Password + Confirm Password — Stack on mobile, side by side on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="h-11 pl-12 pr-12 text-base bg-gray-50 dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-800 focus:border-black dark:focus:border-white rounded-xl"
                  minLength={6}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="h-11 pl-12 pr-12 text-base bg-gray-50 dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-800 focus:border-black dark:focus:border-white rounded-xl"
                  minLength={6}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  disabled={loading}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* reCAPTCHA */}
          {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
            <div className="flex justify-center py-2">
              <div className="rounded-lg overflow-hidden bg-white dark:bg-zinc-900/50 ring-1 ring-gray-200 dark:ring-zinc-700">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                  size="normal"
                  theme={typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
                />
              </div>
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-11 bg-black hover:bg-gray-900 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black font-medium text-base rounded-xl transition-all"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200 dark:border-zinc-800" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white dark:bg-zinc-950 text-gray-500">Or</span>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full h-11 border border-gray-300 dark:border-zinc-700 hover:border-black dark:hover:border-white hover:bg-gray-50 dark:hover:bg-zinc-900/50 font-medium rounded-xl transition-all"
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

      <CardFooter className="flex justify-center py-6 border-t border-gray-100 dark:border-zinc-800/50">
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-black dark:text-white hover:underline">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}