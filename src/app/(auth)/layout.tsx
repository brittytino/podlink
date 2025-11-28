"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Navigation from '@/components/landing/Navigation';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Dynamic content based on route (support both "register" and "signup")
  const isLogin = pathname?.includes("login");
  const isRegister = pathname?.includes("register") || pathname?.includes("signup");

  const title = isRegister ? "Create Your Account" : "Welcome Back";

  const subtitle = isRegister
    ? "Join PodLink - build healthy habits with supportive partners."
    : "Sign in to access your dashboard, pods and progress.";

  return (
    <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">

      {/* Navbar */}
      <div className="col-span-1 md:col-span-2">
        <Navigation scrollDirection={""} githubStars={0} isStarred={false} setIsStarred={function (value: boolean): void {
          throw new Error("Function not implemented.");
        } } />
      </div>

      {/* LEFT SECTION */}
      <div className="hidden md:flex flex-col justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-300/20 to-blue-300/10 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative z-10 max-w-lg"
        >
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
            {title}
          </h1>

          <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
            {subtitle}
          </p>

          <div className="mt-6">
            <ul className="list-inside list-disc text-gray-600 dark:text-gray-400 space-y-1 text-sm">
              {isRegister ? (
                <>
                  <li>Quick signup - we’ll auto-generate your username.</li>
                  <li>Pods are automatically matched according to your goals and schedule.</li>
                </>
              ) : (
                <>
                  <li>Resume where you left off.</li>
                  <li>Track progress, streaks and pod activity.</li>
                </>
              )}
            </ul>
          </div>

          <div className="mt-8 w-32 h-1 rounded-full bg-gradient-to-r from-purple-500 to-blue-500" />
        </motion.div>
      </div>

      {/* RIGHT SECTION (AUTH CARD) */}
      <div className="flex items-center justify-center p-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
