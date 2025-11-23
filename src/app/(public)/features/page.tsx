'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Target, TrendingUp, Shield, Zap, Heart,
  MessageCircle, Calendar, Award, Bell, BarChart3, Lock
} from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: Users,
    title: 'Smart Pod Matching',
    description: 'Our AI-powered algorithm matches you with like-minded individuals based on goals, timezone, and availability for maximum synergy.',
    gradient: 'from-purple-500 to-pink-500',
    benefits: ['AI-driven matching', 'Goal alignment', 'Timezone optimization']
  },
  {
    icon: MessageCircle,
    title: 'Real-time Communication',
    description: 'Stay connected with your pod through instant messaging, video calls, and group discussions. Never miss a beat.',
    gradient: 'from-blue-500 to-cyan-500',
    benefits: ['Instant messaging', 'Video calls', 'Group chats']
  },
  {
    icon: Target,
    title: 'Goal Tracking',
    description: 'Set, track, and achieve your goals with our comprehensive tracking system. Visualize your progress and celebrate wins.',
    gradient: 'from-green-500 to-emerald-500',
    benefits: ['Visual progress', 'Milestone tracking', 'Achievement badges']
  },
  {
    icon: TrendingUp,
    title: 'Progress Analytics',
    description: 'Gain insights into your productivity patterns with detailed analytics and personalized recommendations.',
    gradient: 'from-orange-500 to-red-500',
    benefits: ['Detailed reports', 'Trend analysis', 'Performance insights']
  },
  {
    icon: Calendar,
    title: 'Daily Check-ins',
    description: 'Build consistency with daily check-ins. Share updates, challenges, and victories with your accountability pod.',
    gradient: 'from-indigo-500 to-purple-500',
    benefits: ['Daily reminders', 'Streak tracking', 'Consistency building']
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    description: 'Stay on track with intelligent notifications that adapt to your schedule and preferences.',
    gradient: 'from-pink-500 to-rose-500',
    benefits: ['Custom alerts', 'Smart reminders', 'Priority notifications']
  },
  {
    icon: Award,
    title: 'Gamification',
    description: 'Earn points, unlock achievements, and climb the leaderboard as you make progress towards your goals.',
    gradient: 'from-yellow-500 to-orange-500',
    benefits: ['Points system', 'Achievements', 'Leaderboards']
  },
  {
    icon: Shield,
    title: 'Privacy & Security',
    description: 'Your data is protected with enterprise-grade encryption. Control what you share and with whom.',
    gradient: 'from-slate-500 to-slate-700',
    benefits: ['End-to-end encryption', 'Privacy controls', 'Secure storage']
  },
  {
    icon: BarChart3,
    title: 'Performance Dashboard',
    description: 'Monitor your overall performance with a comprehensive dashboard showing all your key metrics at a glance.',
    gradient: 'from-teal-500 to-cyan-500',
    benefits: ['Real-time stats', 'Custom widgets', 'Export reports']
  },
  {
    icon: Zap,
    title: 'Quick Actions',
    description: 'Streamline your workflow with quick actions and shortcuts to the features you use most.',
    gradient: 'from-violet-500 to-purple-500',
    benefits: ['Keyboard shortcuts', 'One-click actions', 'Smart suggestions']
  },
  {
    icon: Heart,
    title: 'Crisis Support',
    description: 'Access immediate support resources and crisis toolkit whenever you need it. Your wellbeing matters.',
    gradient: 'from-red-500 to-pink-500',
    benefits: ['24/7 resources', 'Emergency contacts', 'Support network']
  },
  {
    icon: Lock,
    title: 'Private Pods',
    description: 'Create invite-only pods for your team, friends, or specific projects with complete privacy control.',
    gradient: 'from-gray-600 to-gray-800',
    benefits: ['Invite-only', 'Custom settings', 'Admin controls']
  }
];

export default function FeaturesPage() {
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
              Powerful Features
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto">
              Everything you need to stay accountable, track progress, and achieve your goals with your pod.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 shadow-lg`}>
                    <Icon className="text-white" size={28} />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-slate-800">
                    {feature.title}
                  </h3>
                  
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-slate-500">
                        <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
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
              Ready to Get Started?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Join thousands of users who are achieving their goals with accountability pods.
            </p>
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Your Journey
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
