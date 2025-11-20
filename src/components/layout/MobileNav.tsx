'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Home, Users, Shield, Trophy, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/pod', label: 'Pod', icon: Users },
  { href: '/crisis-toolkit', label: 'Toolkit', icon: Shield },
  { href: '/leaderboard', label: 'Board', icon: Trophy },
  { href: '/profile', label: 'Profile', icon: User },
];

export function MobileNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (!user?.id) return;

    fetch('/api/user/streak')
      .then((res) => res.json())
      .then((data) => {
        setStreak(data.streak || 0);
      })
      .catch(() => {});
  }, [user?.id]);

  return (
    <>
      {/* Bottom Navigation - styled to match primary navbar visual language */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg"
        role="navigation"
        aria-label="Mobile Navigation"
      >
        <div className="max-w-[1200px] mx-auto px-3 sm:px-6">
          <div className="flex items-center justify-between h-16 safe-bottom">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              const isDashboard = item.href === '/dashboard';

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex-1 flex flex-col items-center justify-center gap-1 py-2 px-2 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500',
                    isActive
                      ? 'bg-gradient-to-tr from-blue-50 to-purple-50 text-primary shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={item.label}
                >
                  <div className="relative flex items-center justify-center">
                    <Icon className={cn('h-5 w-5', isActive ? 'text-primary' : 'text-muted-foreground')} />

                    {/* Streak Badge on Dashboard */}
                    {isDashboard && streak > 0 && (
                      <span className="absolute -top-2 -right-3 inline-flex items-center justify-center h-5 min-w-[20px] px-1 rounded-full bg-amber-600 text-white text-[10px] font-bold border-2 border-background">
                        {streak > 9 ? '9+' : streak}
                      </span>
                    )}
                  </div>

                  <span className={cn('text-[11px] mt-1', isActive ? 'text-primary font-semibold' : 'text-xs')}>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <style jsx>{`
        /* ensure comfortable safe area padding for devices with home indicator */
        .safe-bottom { padding-bottom: env(safe-area-inset-bottom); }
        /* slightly larger hit target on mobile */
        nav a { min-height: 44px; }
      `}</style>
    </>
  );
}
