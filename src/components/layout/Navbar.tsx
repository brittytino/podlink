'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { clearUserSession } from '@/lib/cleanup';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ClientOnly } from '@/components/ui/client-only';
import { Home, Users, Shield, Trophy, User, LogOut, Bell, Flame, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSocket } from '@/hooks/useSocket';
import { cn, getStreakColor, getStreakEmoji } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/pod', label: 'Pod', icon: Users },
  { href: '/crisis-toolkit', label: 'Toolkit', icon: Shield },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/profile', label: 'Profile', icon: User },
];

interface Notification {
  id: string;
  message: string | null;
  createdAt: string;
  user: {
    id: string;
    username: string;
    fullName: string;
    avatarUrl: string | null;
  };
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { socket } = useSocket();
  const [streak, setStreak] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch streak
  useEffect(() => {
    if (!user?.id) return;

    fetch('/api/user/streak')
      .then((res) => res.json())
      .then((data) => {
        setStreak(data.streak || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user?.id]);

  // Fetch notifications
  useEffect(() => {
    if (!user?.id) return;

    const fetchNotifications = () => {
      fetch('/api/notifications/count')
        .then((res) => res.json())
        .then((data) => {
          setNotificationCount(data.count || 0);
        });

      fetch('/api/notifications/list')
        .then((res) => res.json())
        .then((data) => {
          setNotifications(data.notifications || []);
        });
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Refresh every 30s

    return () => clearInterval(interval);
  }, [user?.id]);

  // Listen for new crisis alerts via socket
  useEffect(() => {
    if (!socket || !user?.podId) return;

    const handleCrisisAlert = (alert: any) => {
      // Only show alerts not created by the current user
      if (alert.userId !== user.id) {
        setNotificationCount((prev) => prev + 1);
        fetch('/api/notifications/list')
          .then((res) => res.json())
          .then((data) => {
            setNotifications(data.notifications || []);
          });
      }
    };

    const handleAlertResolved = () => {
      fetch('/api/notifications/count')
        .then((res) => res.json())
        .then((data) => {
          setNotificationCount(data.count || 0);
        });
      fetch('/api/notifications/list')
        .then((res) => res.json())
        .then((data) => {
          setNotifications(data.notifications || []);
        });
    };

    socket.on('crisis-alert-received', handleCrisisAlert);
    socket.on('alert-resolved', handleAlertResolved);

    return () => {
      socket.off('crisis-alert-received', handleCrisisAlert);
      socket.off('alert-resolved', handleAlertResolved);
    };
  }, [socket, user?.podId, user?.id]);

  const handleNotificationClick = (notification: Notification) => {
    router.push('/pod');
  };

  return (
    <nav
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm"
      aria-label="Primary Navigation"
    >
      {/* Wider container: expands on large screens while keeping content flush to left and right */}
      <div className="mx-auto w-full max-w-[1800px] px-4 sm:px-6 lg:px-10">
        {/* Flex row spans full width: left area grows, right area stays sized to content */}
        <div className="flex items-center h-14 sm:h-16 justify-between w-full">
          {/* Left Section: brand + nav */}
          <div className="flex items-center gap-4 sm:gap-6 min-w-0">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 sm:gap-3 hover:opacity-95 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 rounded-md"
              aria-label="Go to dashboard"
            >
              <div className="text-2xl sm:text-3xl md:text-4xl font-['Bebas_Neue',sans-serif] font-extrabold leading-none">
                <span className="text-[#ff5370]">Pod</span>Link
              </div>
            </Link>

            {/* Nav Strip: on small screens it's horizontally scrollable to preserve left/right corners */}
            <div
              className="hidden md:flex items-center gap-2 lg:gap-3 flex-1 overflow-hidden"
              aria-hidden={false}
            >
              <div className="flex items-center gap-2 lg:gap-3 overflow-x-auto py-1 no-scrollbar">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link key={item.href} href={item.href} className="group flex-shrink-0">
                      <Button
                        variant={isActive ? 'secondary' : 'ghost'}
                        className={cn(
                          'px-3 py-2 text-sm rounded-full min-w-[96px] flex items-center justify-center gap-2 transition-transform transform hover:-translate-y-0.5 focus-visible:translate-y-0 focus-visible:ring-2 focus-visible:ring-offset-2',
                          isActive && 'bg-secondary'
                        )}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <Icon className="h-4 w-4 opacity-95" />
                        <span className="hidden lg:inline-block">{item.label}</span>
                        <span className="lg:hidden text-sm">{item.label}</span>
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Section: streak, notifications, user */}
          <div className="flex items-center gap-2 sm:gap-4 justify-end">
            {/* Streak Display */}
            {!loading && streak > 0 && (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 hover:from-amber-100 hover:to-orange-100 dark:hover:from-amber-900/30 dark:hover:to-orange-900/30 transition-shadow shadow-sm hover:shadow-md group"
                aria-label={`${streak} day streak — view dashboard`}
              >
                <span
                  className={cn(
                    'text-lg sm:text-xl transition-transform group-hover:scale-110 drop-shadow-[0_0_6px_rgba(255,140,0,0.85)]',
                    getStreakColor(streak)
                  )}
                  aria-hidden
                >
                  🔥
                </span>
                <span className="text-xs sm:text-sm font-semibold text-amber-700 dark:text-amber-300 tracking-tight">
                  {streak}
                </span>
              </Link>
            )}

            {/* Notifications */}
            <ClientOnly>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative p-2 rounded-lg hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
                    aria-label="Open notifications"
                  >
                    <Bell className="h-5 w-5" />
                    {notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center border-2 border-background">
                        {notificationCount > 9 ? '9+' : notificationCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-80 rounded-xl shadow-lg" align="end">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    <span className="font-medium">Notifications</span>
                    {notificationCount > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {notificationCount} new
                      </Badge>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <ScrollArea className="h-[300px] p-2">
                    {notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-6 text-center">
                        <Bell className="h-12 w-12 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">No notifications</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <DropdownMenuItem
                          key={notification.id}
                          className="cursor-pointer p-3 flex-col items-start gap-1 rounded-md hover:bg-muted/30"
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex items-start gap-3 w-full">
                            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{notification.user.fullName || notification.user.username}</p>
                              <p className="text-xs text-muted-foreground line-clamp-2">{notification.message || 'Needs help right now!'}</p>
                              <p className="text-xs text-muted-foreground mt-1">{new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                          </div>
                        </DropdownMenuItem>
                      ))
                    )}
                  </ScrollArea>
                  {notifications.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/pod" className="cursor-pointer justify-center text-sm">
                          View All Alerts
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </ClientOnly>

            {/* User Menu */}
            <ClientOnly>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full p-0 ring-offset-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
                    aria-label="Open user menu"
                  >
                    <Avatar>
                      <AvatarImage src={user?.image || ''} alt={user?.name || ''} />
                      <AvatarFallback>{user?.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 rounded-xl shadow-lg" align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">@{user?.username}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer flex items-center gap-2">
                      <User className="mr-2 h-4 w-4" />
                      Profile Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600"
                    onClick={() => {
                      clearUserSession();
                      signOut({ callbackUrl: '/login' });
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </ClientOnly>
          </div>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Oswald:wght@200..700&display=swap');

        /* keep your floating animations */
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
        }

        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-30px) translateX(-15px); }
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        /* small helper to hide scrollbar but allow scrolling */
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </nav>
  );
}
