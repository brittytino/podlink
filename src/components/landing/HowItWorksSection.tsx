'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Users, MessageCircle, TrendingUp, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Sign Up & Share Your Goal',
    description: 'Tell us what you want to achieve. Whether it\'s fitness, learning, or personal growth - we\'re here for it.',
    icon: UserPlus,
    color: 'from-purple-500 to-pink-500',
    details: [
      'Quick 2-minute signup',
      'Choose your goal category',
      'Set your target timeline',
      'Optional anonymous mode'
    ],
    illustration: (
      <div className="relative w-full h-64">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-gradient-to-br from-purple-400 to-pink-400 rounded-3xl shadow-2xl flex items-center justify-center"
        >
          <UserPlus size={64} className="text-white" />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-4 border-purple-300 rounded-3xl"
        />
      </div>
    )
  },
  {
    number: '02',
    title: 'Get Matched with Your Pod',
    description: 'Our AI finds 4-5 people with similar goals, compatible schedules, and matching energy levels.',
    icon: Users,
    color: 'from-blue-500 to-cyan-500',
    details: [
      'AI-powered matching algorithm',
      'Timezone & availability sync',
      'Goal compatibility check',
      'Personality alignment'
    ],
    illustration: (
      <div className="relative w-full h-64">
        <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: 0 }}
              animate={{
                scale: 1,
                rotate: i * 72,
                x: Math.cos((i * 72 * Math.PI) / 180) * 80,
                y: Math.sin((i * 72 * Math.PI) / 180) * 80
              }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="absolute w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full shadow-lg flex items-center justify-center"
            >
              <div className="w-10 h-10 bg-white rounded-full" />
            </motion.div>
          ))}
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full shadow-2xl flex items-center justify-center">
            <Users size={32} className="text-white" />
          </div>
        </motion.div>
      </div>
    )
  },
  {
    number: '03',
    title: 'Daily Check-ins & Support',
    description: 'Share progress, celebrate wins, and get back on track when you stumble. Your pod has your back.',
    icon: MessageCircle,
    color: 'from-green-500 to-emerald-500',
    details: [
      'Daily progress updates',
      'Real-time pod chat',
      'Milestone celebrations',
      'Crisis support alerts'
    ],
    illustration: (
      <div className="relative w-full h-64">
        <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 space-y-4 w-full max-w-xs">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.2 }}
              className={`flex items-start gap-3 ${i % 2 === 0 ? '' : 'flex-row-reverse'}`}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex-shrink-0" />
              <div className={`flex-1 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-3 ${i % 2 === 0 ? 'rounded-tl-none' : 'rounded-tr-none'}`}>
                <div className="h-2 bg-green-200 rounded-full w-3/4 mb-2" />
                <div className="h-2 bg-green-200 rounded-full w-1/2" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    )
  },
  {
    number: '04',
    title: 'Track & Celebrate Success',
    description: 'Watch your streak grow, compete on leaderboards, and achieve what once seemed impossible.',
    icon: TrendingUp,
    color: 'from-orange-500 to-red-500',
    details: [
      'Streak tracking & analytics',
      'Pod & global leaderboards',
      'Achievement badges',
      'Progress visualization'
    ],
    illustration: (
      <div className="relative w-full h-64">
        <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="bg-gradient-to-br from-orange-400 to-red-400 rounded-3xl p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-white font-bold text-2xl">89 Days</div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                🔥
              </div>
            </div>
            <div className="space-y-2">
              {[100, 85, 95, 78, 92].map((width, i) => (
                <motion.div
                  key={i}
                  initial={{ width: 0 }}
                  animate={{ width: `${width}%` }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="h-2 bg-white/40 rounded-full"
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    )
  }
];

export default function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="how-it-works" className="relative bg-white py-32 px-6 sm:px-8 lg:px-12 overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full mb-6">
            <Sparkles size={16} className="text-blue-600" />
            <span className="text-blue-700 font-bold text-sm uppercase tracking-widest">How It Works</span>
          </div>

          <h2 className="text-slate-900 text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight font-['Playfair_Display',serif]">
            Your Journey to Success
          </h2>

          <p className="text-slate-600 text-xl md:text-2xl max-w-3xl mx-auto font-light">
            Four simple steps to transform your goals from dreams to reality
          </p>
        </motion.div>

        {/* Interactive Timeline */}
        <div className="mb-20">
          {/* Desktop Timeline */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-12 left-0 right-0 h-1 bg-slate-200">
                <motion.div
                  initial={{ width: '0%' }}
                  whileInView={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
                  transition={{ duration: 1, ease: 'easeInOut' }}
                  className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-orange-500"
                />
              </div>

              {/* Steps */}
              <div className="relative flex justify-between">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.2 }}
                      className="flex flex-col items-center cursor-pointer"
                      onClick={() => setActiveStep(index)}
                      onMouseEnter={() => setActiveStep(index)}
                    >
                      {/* Circle */}
                      <motion.div
                        animate={{
                          scale: activeStep === index ? 1.2 : 1,
                          backgroundColor: activeStep >= index ? '#667eea' : '#e2e8f0'
                        }}
                        className="w-24 h-24 rounded-full flex items-center justify-center shadow-xl mb-4 z-10 relative"
                      >
                        <Icon
                          size={32}
                          className={activeStep >= index ? 'text-white' : 'text-slate-400'}
                        />
                        {activeStep === index && (
                          <motion.div
                            layoutId="activeRing"
                            className="absolute inset-0 rounded-full border-4 border-purple-400"
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          />
                        )}
                      </motion.div>

                      {/* Number */}
                      <div className={`text-sm font-bold mb-2 ${activeStep >= index ? 'text-purple-600' : 'text-slate-400'}`}>
                        {step.number}
                      </div>

                      {/* Title */}
                      <div className={`text-center max-w-[200px] font-semibold ${activeStep === index ? 'text-slate-900' : 'text-slate-600'}`}>
                        {step.title}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mobile Timeline */}
          <div className="lg:hidden space-y-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-purple-600 mb-1">{step.number}</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 font-['Playfair_Display',serif]">
                      {step.title}
                    </h3>
                    <p className="text-slate-600">{step.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Active Step Details */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-slate-50 to-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-200"
          >
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Details */}
              <div>
                <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${steps[activeStep].color} bg-opacity-10 px-4 py-2 rounded-full mb-6`}>
                  <span className="text-sm font-bold text-slate-700">Step {steps[activeStep].number}</span>
                </div>

                <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 font-['Playfair_Display',serif]">
                  {steps[activeStep].title}
                </h3>

                <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                  {steps[activeStep].description}
                </p>

                <div className="space-y-3">
                  {steps[activeStep].details.map((detail, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle size={20} className={`bg-gradient-to-r ${steps[activeStep].color} bg-clip-text text-transparent`} />
                      <span className="text-slate-700">{detail}</span>
                    </motion.div>
                  ))}
                </div>

                {activeStep === steps.length - 1 && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                  >
                    Get Started Now
                    <ArrowRight size={20} />
                  </motion.button>
                )}
              </div>

              {/* Right: Illustration */}
              <div className="relative">
                {steps[activeStep].illustration}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Dots (Desktop) */}
        <div className="hidden lg:flex justify-center gap-3 mt-12">
          {steps.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setActiveStep(index)}
              whileHover={{ scale: 1.2 }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeStep === index
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 w-12'
                  : 'bg-slate-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
