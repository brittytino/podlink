'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Users, Target, TrendingUp, Award, Sparkles } from 'lucide-react';
import Link from 'next/link';

const steps = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Sign Up & Set Goals',
    description: 'Create your account and define your goals. Tell us what you want to achieve and why it matters to you.',
    details: [
      'Quick 2-minute signup process',
      'Define up to 5 concurrent goals',
      'Set your availability and timezone',
      'Choose your commitment level'
    ],
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    number: '02',
    icon: Users,
    title: 'Get Matched with Your Pod',
    description: 'Our AI algorithm finds the perfect accountability partners who share similar goals and schedules.',
    details: [
      'Smart matching based on goals',
      'Timezone compatibility check',
      'Similar commitment levels',
      'Complementary personalities'
    ],
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    number: '03',
    icon: Target,
    title: 'Daily Check-ins',
    description: 'Share your progress, challenges, and wins with your pod. Build consistency through daily accountability.',
    details: [
      'Quick daily status updates',
      'Share wins and challenges',
      'Get support from pod members',
      'Build your streak'
    ],
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    number: '04',
    icon: TrendingUp,
    title: 'Track Your Progress',
    description: 'Monitor your growth with detailed analytics and visualizations. See how far you\'ve come.',
    details: [
      'Visual progress dashboards',
      'Weekly and monthly reports',
      'Trend analysis',
      'Productivity insights'
    ],
    gradient: 'from-orange-500 to-red-500'
  },
  {
    number: '05',
    icon: Award,
    title: 'Celebrate Milestones',
    description: 'Earn achievements, unlock badges, and climb the leaderboard as you make progress.',
    details: [
      'Achievement system',
      'Milestone celebrations',
      'Leaderboard rankings',
      'Pod success stories'
    ],
    gradient: 'from-yellow-500 to-orange-500'
  },
  {
    number: '06',
    icon: Sparkles,
    title: 'Achieve Your Goals',
    description: 'With consistent accountability and support, transform your aspirations into reality.',
    details: [
      'Goal completion tracking',
      'Success celebrations',
      'Set new ambitious goals',
      'Inspire others in community'
    ],
    gradient: 'from-indigo-500 to-purple-500'
  }
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-['Playfair_Display',serif]">
              How It Works
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto">
              Your journey to achieving goals starts here. Follow these simple steps to unlock your potential.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isEven = index % 2 === 0;
            
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="mb-20 last:mb-0"
              >
                <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}>
                  {/* Icon & Number */}
                  <div className="lg:w-1/3 flex justify-center">
                    <div className="relative">
                      <motion.div
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        className={`w-48 h-48 bg-gradient-to-br ${step.gradient} rounded-3xl flex items-center justify-center shadow-2xl`}
                      >
                        <Icon className="text-white" size={64} />
                      </motion.div>
                      <div className="absolute -top-6 -right-6 w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center">
                        <span className="text-3xl font-bold text-slate-800">{step.number}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="lg:w-2/3">
                    <h2 className="text-4xl font-bold mb-4 text-slate-800 font-['Playfair_Display',serif]">
                      {step.title}
                    </h2>
                    <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                      {step.description}
                    </p>
                    <ul className="space-y-3">
                      {step.details.map((detail, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + idx * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <div className={`mt-1.5 w-2 h-2 rounded-full bg-gradient-to-r ${step.gradient} flex-shrink-0`} />
                          <span className="text-slate-700">{detail}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="flex justify-center my-12">
                    <motion.div
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                      className={`w-1 h-16 bg-gradient-to-b ${step.gradient} rounded-full origin-top`}
                    />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white shadow-2xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-['Playfair_Display',serif]">
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Join now and get matched with your accountability pod in minutes.
            </p>
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get Started Free
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
