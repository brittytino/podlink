'use client';
import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Brain, MessageSquare, Shield, AlertCircle, TrendingUp, Trophy } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Matching',
    description: 'Our intelligent algorithm creates perfect accountability pods based on goals, timezone, availability, and personality compatibility.',
    gradient: 'from-purple-500 to-pink-500',
    stats: '98% match satisfaction',
    benefits: ['Timezone alignment', 'Goal compatibility', 'Personality matching', 'Availability sync']
  },
  {
    icon: MessageSquare,
    title: 'Real-Time Pod Chat',
    description: 'Stay connected with your pod through instant messaging, daily check-ins, and milestone celebrations.',
    gradient: 'from-blue-500 to-cyan-500',
    stats: '10K+ messages daily',
    benefits: ['Instant messaging', 'Voice notes', 'Media sharing', 'Typing indicators']
  },
  {
    icon: Shield,
    title: 'Anonymous Profiles',
    description: 'Share your journey without judgment. Optional anonymity lets you be vulnerable and authentic.',
    gradient: 'from-green-500 to-emerald-500',
    stats: '87% choose anonymous',
    benefits: ['Full privacy', 'Optional reveal', 'Secure encryption', 'GDPR compliant']
  },
  {
    icon: AlertCircle,
    title: 'Crisis Support',
    description: 'Mental health safety net. Alert your pod instantly when you need support during difficult moments.',
    gradient: 'from-red-500 to-orange-500',
    stats: '247 alerts responded',
    benefits: ['Instant alerts', '24/7 support', 'Pod notifications', 'Professional resources']
  },
  {
    icon: TrendingUp,
    title: 'Progress Tracking',
    description: 'Visualize your journey with detailed analytics, streak tracking, and achievement milestones.',
    gradient: 'from-indigo-500 to-purple-500',
    stats: '89-day avg streak',
    benefits: ['Daily check-ins', 'Streak calendar', 'Analytics dashboard', 'Goal milestones']
  },
  {
    icon: Trophy,
    title: 'Leaderboards & Gamification',
    description: 'Friendly competition with pod and global leaderboards. Earn badges and celebrate wins together.',
    gradient: 'from-yellow-500 to-orange-500',
    stats: '127 active challenges',
    benefits: ['Pod rankings', 'Achievement badges', 'Weekly challenges', 'Milestone rewards']
  }
];

const FeatureCard = ({ feature, index }: { feature: typeof features[0], index: number }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [10, -10]), {
    stiffness: 200,
    damping: 30
  });
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-10, 10]), {
    stiffness: 200,
    damping: 30
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d'
      }}
      className="group relative"
    >
      {/* Card */}
      <div className="relative bg-white rounded-2xl p-8 border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-500 h-full overflow-hidden">
        {/* Gradient overlay on hover */}
        <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`} />
        
        {/* Animated border gradient */}
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} style={{ padding: '2px' }}>
          <div className="bg-white rounded-2xl h-full w-full" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Icon */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg`}
          >
            <Icon size={32} className="text-white" strokeWidth={2} />
          </motion.div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-slate-900 mb-3 font-['Playfair_Display',serif]">
            {feature.title}
          </h3>

          {/* Description */}
          <p className="text-slate-600 mb-6 leading-relaxed">
            {feature.description}
          </p>

          {/* Stats badge */}
          <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${feature.gradient} bg-opacity-10 px-4 py-2 rounded-full mb-6`}>
            <TrendingUp size={14} className="text-slate-700" />
            <span className="text-sm font-semibold text-slate-800">{feature.stats}</span>
          </div>

          {/* Benefits list */}
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            whileInView={{ height: 'auto', opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-2"
          >
            {feature.benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                className="flex items-center gap-2"
              >
                <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${feature.gradient}`} />
                <span className="text-sm text-slate-600">{benefit}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Floating particles effect */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-tr from-blue-400/20 to-cyan-400/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </motion.div>
  );
};

export default function FeaturesSection() {
  return (
    <section id="features" className="relative bg-gradient-to-b from-slate-50 to-white py-32 px-6 sm:px-8 lg:px-12 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        />
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-full mb-6">
            <Trophy size={16} className="text-purple-600" />
            <span className="text-purple-700 font-bold text-sm uppercase tracking-widest">Powerful Features</span>
          </div>
          
          <h2 className="text-slate-900 text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight font-['Playfair_Display',serif]">
            Everything You Need to Succeed
          </h2>
          
          <p className="text-slate-600 text-xl md:text-2xl max-w-3xl mx-auto font-light">
            Built with care, designed for results. Every feature serves one purpose: keeping you accountable.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-20"
        >
          <p className="text-slate-600 text-lg mb-6">
            Join 1,247+ members already achieving their goals
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            Start Your Journey Free
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
