'use client';

import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface StreakDisplayProps {
  streak: number;
  label: string;
  isPod?: boolean;
}

export function StreakDisplay({ streak, label, isPod = false }: StreakDisplayProps) {
  const [prevStreak, setPrevStreak] = useState(streak);
  const [isIncreasing, setIsIncreasing] = useState(false);

  useEffect(() => {
    if (streak > prevStreak) {
      setIsIncreasing(true);
      setTimeout(() => setIsIncreasing(false), 1500);
    }
    setPrevStreak(streak);
  }, [streak, prevStreak]);

  const getStreakEmoji = () => {
    if (streak === 0) return '💤';
    if (streak < 3) return '🔥';
    if (streak < 7) return '🚀';
    if (streak < 14) return '⭐';
    if (streak < 30) return '💎';
    return '👑';
  };

  const getStreakMessage = () => {
    if (streak === 0) return 'Start your streak!';
    if (streak === 1) return '1 Day Strong';
    return `${streak} Days Strong`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="relative overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg rounded-[20px] sm:rounded-[28px] h-[100px] sm:h-[120px]">
        {/* Background with wavy pattern */}
        {isPod ? (
          // Purple wavy background for pod streak
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100/90 via-purple-50/70 to-purple-100/50 dark:from-purple-900/40 dark:via-purple-950/20 dark:to-gray-900">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e9d5ff" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#c084fc" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              {/* Wavy lines */}
              <path d="M0,60 Q100,20 200,60 T400,60" fill="none" stroke="url(#purpleGrad)" strokeWidth="40" opacity="0.3" />
              <path d="M0,80 Q100,40 200,80 T400,80" fill="none" stroke="url(#purpleGrad)" strokeWidth="40" opacity="0.2" />
              {/* Star burst */}
              <g transform="translate(320, 60)">
                <path d="M0,-15 L2,-2 L15,0 L2,2 L0,15 L-2,2 L-15,0 L-2,-2 Z" fill="#c084fc" opacity="0.2" />
                <path d="M0,-25 L1,-3 L25,0 L1,3 L0,25 L-1,3 L-25,0 L-1,-3 Z" fill="#e9d5ff" opacity="0.15" />
              </g>
            </svg>
          </div>
        ) : (
          // Beige/peach wavy background for personal streak  
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50/80 via-amber-50/60 to-orange-50/40 dark:from-orange-900/20 dark:via-amber-950/10 dark:to-gray-900">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fed7aa" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#fdba74" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              {/* Wavy lines */}
              <path d="M0,50 Q100,30 200,50 T400,50" fill="none" stroke="url(#orangeGrad)" strokeWidth="30" opacity="0.4" />
              <path d="M0,70 Q100,50 200,70 T400,70" fill="none" stroke="url(#orangeGrad)" strokeWidth="30" opacity="0.3" />
              <path d="M0,90 Q100,70 200,90 T400,90" fill="none" stroke="url(#orangeGrad)" strokeWidth="20" opacity="0.2" />
              {/* X marks */}
              <g transform="translate(350, 40)" opacity="0.25">
                <path d="M-8,-8 L8,8 M-8,8 L8,-8" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
              </g>
              <g transform="translate(380, 70)" opacity="0.2">
                <path d="M-6,-6 L6,6 M-6,6 L6,-6" stroke="#fb923c" strokeWidth="2.5" strokeLinecap="round" />
              </g>
              <g transform="translate(320, 90)" opacity="0.15">
                <path d="M-5,-5 L5,5 M-5,5 L5,-5" stroke="#fdba74" strokeWidth="2" strokeLinecap="round" />
              </g>
            </svg>
          </div>
        )}
        
        <CardContent className="relative p-3 sm:p-5 flex flex-col h-full justify-between">
          {/* Top right label with emoji */}
          <div className="absolute top-2 sm:top-3 right-3 sm:right-4 flex items-center gap-1">
            <motion.span
              key={streak}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              className="text-base sm:text-xl"
            >
              {getStreakEmoji()}
            </motion.span>
            <span className="text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-400">
              {getStreakMessage()}
            </span>
          </div>
          
          {/* Celebration particles */}
          <AnimatePresence>
            {isIncreasing && (
              <>
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ 
                      x: 0, 
                      y: 0, 
                      opacity: 1,
                      scale: 1
                    }}
                    animate={{ 
                      x: Math.cos((i * Math.PI * 2) / 6) * 80,
                      y: Math.sin((i * Math.PI * 2) / 6) * 80,
                      opacity: 0,
                      scale: 0
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-400 rounded-full"
                  />
                ))}
              </>
            )}
          </AnimatePresence>
          
          {/* Bottom content */}
          <div className="mt-auto">
            <motion.div 
              key={streak}
              initial={{ scale: 1 }}
              animate={{ 
                scale: isIncreasing ? [1, 1.2, 1] : 1,
              }}
              transition={{ duration: 0.5 }}
              className="text-4xl sm:text-5xl font-black text-gray-800 dark:text-white mb-1"
            >
              {streak}
            </motion.div>
            <div className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
              {label}
            </div>
            
            {/* Progress bar for personal streak */}
            {!isPod && (
              <div className="mt-2 sm:mt-3 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-400 to-amber-400 rounded-full transition-all duration-500"
                  style={{ width: streak > 0 ? `${Math.min((streak / 30) * 100, 100)}%` : '0%' }}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
