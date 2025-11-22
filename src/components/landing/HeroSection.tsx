'use client';
import React from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, CheckCircle2, Shield, Users, TrendingUp } from 'lucide-react';

interface HeroSectionProps {
  statsCount: {
    pods: number;
    members: number;
    goals: number;
    streak: number;
  };
  activePill: number;
  pillMessages: string[];
}

export default function HeroSection({ statsCount, activePill, pillMessages }: HeroSectionProps) {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const opacity = useTransform(scrollY, [0, 200], [1, 0.3]);

  return (
    <section id="home" className="relative min-h-screen pt-16">
      {/* Background with wider container */}
      <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/20 flex items-center overflow-hidden">
        
        {/* Subtle Animated Background Orbs */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <motion.div 
            className="absolute top-[20%] left-[15%] w-[500px] h-[500px] bg-gradient-to-br from-[#667eea]/10 to-[#764ba2]/10 rounded-full blur-3xl"
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "reverse"
            }}
          />
          <motion.div 
            className="absolute top-[30%] right-[10%] w-[400px] h-[400px] bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"
            animate={{
              y: [0, 30, 0],
              x: [0, -20, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "reverse"
            }}
          />
        </div>

        {/* Main Content - Wider Container */}
        <motion.div 
          style={{ y: y1, opacity }}
          className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 py-20"
        >
          <div className="text-center space-y-10">
            
            {/* Trust Badge with Smooth Animation */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex justify-center"
            >
              <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-full border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow duration-300">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-2 h-2 bg-green-500 rounded-full"
                />
                <Sparkles size={16} className="text-[#667eea]" />
                <motion.span 
                  key={activePill}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-slate-700 font-medium text-sm"
                >
                  {pillMessages[activePill]}
                </motion.span>
              </div>
            </motion.div>
            
            {/* Main Heading - Elegant & Spacious */}
            <div className="space-y-4">
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="font-['Playfair_Display',serif] text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.1] tracking-tight font-bold"
              >
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="block bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent"
                >
                  Achieve Your Goals
                </motion.span>
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="block text-slate-900 mt-3"
                >
                  With Accountability
                </motion.span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
                className="text-slate-600 text-lg sm:text-xl lg:text-2xl max-w-3xl mx-auto font-light leading-relaxed"
              >
                Join accountability pods of 4-6 people matched by AI. 
                <span className="font-semibold text-slate-900"> 92% success rate </span>
                vs 27% going solo.
              </motion.p>
            </div>

            {/* Trust Indicators - Clean & Minimal */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1, ease: "easeOut" }}
              className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600"
            >
              {[
                { icon: CheckCircle2, text: 'Free Forever', color: 'text-green-500' },
                { icon: Shield, text: 'Anonymous Mode', color: 'text-blue-500' },
                { icon: Users, text: '1,247+ Members', color: 'text-purple-500' }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 1.2 + idx * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <Icon size={18} className={item.color} />
                    <span>{item.text}</span>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Link href="/register">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="group px-8 py-4 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center gap-2"
                >
                  <span>Get Started Free</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
                </motion.button>
              </Link>
              
              <Link href="#how-it-works">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="px-8 py-4 bg-white text-slate-700 rounded-xl font-semibold border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  See How It Works
                </motion.button>
              </Link>
            </motion.div>
          </div>

          {/* Stats Cards - Wider Layout */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6, ease: "easeOut" }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mt-16 lg:mt-20"
          >
            {[
              { value: statsCount.pods, label: 'Active Pods', icon: Users, color: 'from-purple-500 to-purple-600' },
              { value: statsCount.members.toLocaleString(), label: 'Members', icon: TrendingUp, color: 'from-blue-500 to-blue-600' },
              { value: statsCount.goals.toLocaleString(), label: 'Goals Achieved', icon: CheckCircle2, color: 'from-green-500 to-green-600' },
              { value: `${statsCount.streak}d`, label: 'Avg Streak', icon: Sparkles, color: 'from-orange-500 to-orange-600' }
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 1.8 + idx * 0.1,
                    ease: "easeOut"
                  }}
                  whileHover={{ 
                    y: -8,
                    transition: { duration: 0.2 }
                  }}
                  className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/60 shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <motion.div 
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}
                    whileHover={{ rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icon size={22} className="text-white" />
                  </motion.div>
                  <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-600 font-medium">{stat.label}</div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
