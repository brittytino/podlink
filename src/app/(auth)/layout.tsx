"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Navigation from '@/components/landing/Navigation';
import { CheckCircle2, Zap, Users, Lock } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname?.includes("login");
  const isRegister = pathname?.includes("register") || pathname?.includes("signup");

  const title = isRegister
    ? "Build Habits That Last Forever"
    : "Welcome Back";

  const subtitle = isRegister
    ? "Join 8,000+ people who stopped failing alone. Real accountability, real results."
    : "Your streak is waiting. Log in and keep the momentum.";

  return (
    <div className="min-h-screen font-['Inter'] antialiased bg-gray-50 dark:bg-black">
      
      {/* Fixed Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 dark:border-zinc-800/50 bg-white/80 dark:bg-black/80 backdrop-blur-xl">
        <Navigation scrollDirection="" githubStars={0} isStarred={false} setIsStarred={() => {}} />
      </div>

      <div className="flex min-h-screen pt-16">
        {/* LEFT: Hero Panel */}
        <div className="hidden lg:flex lg:w-2/5 xl:w-1/2 flex-col justify-center px-12 xl:px-16 relative overflow-hidden bg-white dark:bg-zinc-950">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-blue-600/5" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 max-w-xl"
          >
            <h1 className="text-5xl xl:text-6xl font-light tracking-tight text-gray-900 dark:text-white leading-tight">
              {title}
            </h1>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              {subtitle}
            </p>

            <div className="mt-10 space-y-6">
              <GlassBenefit icon={<Zap className="w-5 h-5" />} title="No more excuses" desc="Daily check-ins with real people who care" />
              <GlassBenefit icon={<Users className="w-5 h-5" />} title="Perfect pod matching" desc="We pair you with committed partners — automatically" />
              <GlassBenefit icon={<CheckCircle2 className="w-5 h-5" />} title="Visible progress" desc="Streaks, stats, and wins — updated in real time" />
            </div>

            <div className="mt-12 flex items-center gap-6 text-sm font-medium text-gray-500 dark:text-gray-400">
              <span>Private pods</span>
              <span className="w-1 h-1 bg-gray-400 rounded-full" />
              <span>Encrypted</span>
              <span className="w-1 h-1 bg-gray-400 rounded-full" />
              <span>No ads</span>
            </div>
          </motion.div>
        </div>

        {/* RIGHT: Wide & Elegant Form Panel */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-8 xl:p-12 bg-gray-50 dark:bg-black">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-xl" 
          >
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <h2 className="text-3xl font-light text-gray-900 dark:text-white">{title}</h2>
              <p className="mt-3 text-base text-gray-600 dark:text-gray-300">{subtitle}</p>
            </div>

            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function GlassBenefit({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <motion.div
      whileHover={{ x: 8 }}
      className="flex items-start gap-4 transition-all duration-200"
    >
      <div className="p-3 rounded-xl bg-gray-100 dark:bg-zinc-900 text-gray-900 dark:text-white shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white text-base">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}