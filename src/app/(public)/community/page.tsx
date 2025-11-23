'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Users, MessageCircle, Calendar, Award, TrendingUp, Heart } from 'lucide-react';
import Link from 'next/link';

const stats = [
  { icon: Users, value: '1,247+', label: 'Active Members', gradient: 'from-purple-500 to-pink-500' },
  { icon: MessageCircle, value: '150+', label: 'Active Pods', gradient: 'from-blue-500 to-cyan-500' },
  { icon: Award, value: '3,847', label: 'Goals Achieved', gradient: 'from-green-500 to-emerald-500' },
  { icon: TrendingUp, value: '92%', label: 'Success Rate', gradient: 'from-orange-500 to-red-500' }
];

const events = [
  {
    title: 'Weekly Accountability Check-in',
    date: 'Every Monday, 7:00 PM PST',
    type: 'Virtual Meetup',
    attendees: '50+',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    title: 'Goal Setting Workshop',
    date: 'First Saturday of Month',
    type: 'Workshop',
    attendees: '30+',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    title: 'Success Stories Sharing',
    date: 'Every Friday, 6:00 PM PST',
    type: 'Community Call',
    attendees: '40+',
    gradient: 'from-green-500 to-emerald-500'
  }
];

const features = [
  {
    icon: MessageCircle,
    title: 'Community Forums',
    description: 'Connect with thousands of goal-achievers, share experiences, and get advice from those who\'ve been there.',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    icon: Calendar,
    title: 'Community Events',
    description: 'Join weekly check-ins, workshops, and networking sessions to stay motivated and connected.',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Award,
    title: 'Leaderboards',
    description: 'Friendly competition to keep you motivated. See how you stack up and celebrate top achievers.',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    icon: Heart,
    title: 'Support Network',
    description: 'A safe space to share struggles, celebrate wins, and find support when you need it most.',
    gradient: 'from-pink-500 to-rose-500'
  }
];

const topMembers = [
  { name: 'User_4829', streak: 247, goals: 18, avatar: 'https://avatar.iran.liara.run/public/girl?username=user4829' },
  { name: 'GoalChaser_92', streak: 198, goals: 15, avatar: 'https://avatar.iran.liara.run/public/boy?username=goalchaser92' },
  { name: 'FocusedDreamer', streak: 156, goals: 12, avatar: 'https://avatar.iran.liara.run/public/girl?username=focuseddreamer' },
  { name: 'Consistent_Alex', streak: 134, goals: 11, avatar: 'https://avatar.iran.liara.run/public/boy?username=consistentalex' }
];

export default function CommunityPage() {
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
              Community
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto">
              Join a vibrant community of goal-achievers supporting each other on their journey to success.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg text-center"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-slate-600">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-800 font-['Playfair_Display',serif]">
              Community Features
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="bg-white rounded-2xl p-8 shadow-lg"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 shadow-lg`}>
                    <Icon className="text-white" size={28} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-slate-800">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-800 font-['Playfair_Display',serif]">
              Upcoming Events
            </h2>
            <p className="text-lg text-slate-600">
              Join live events to connect, learn, and grow with the community
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className={`inline-block bg-gradient-to-r ${event.gradient} text-white px-4 py-2 rounded-full text-sm font-semibold mb-4`}>
                  {event.type}
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-800">{event.title}</h3>
                <p className="text-slate-600 mb-4">{event.date}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">👥 {event.attendees} attendees</span>
                  <Link href="/register">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-slate-100 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white text-slate-800 px-4 py-2 rounded-lg font-semibold transition-all"
                    >
                      Join
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Members */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-800 font-['Playfair_Display',serif]">
              Top Contributors
            </h2>
            <p className="text-lg text-slate-600">
              Celebrating our most dedicated community members
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg text-center"
              >
                <div className="relative inline-block mb-4">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white shadow-lg"
                  />
                  {index === 0 && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-sm">
                      👑
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{member.name}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center gap-2 text-orange-600">
                    <span>🔥</span>
                    <span>{member.streak} day streak</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-green-600">
                    <span>🎯</span>
                    <span>{member.goals} goals completed</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white shadow-2xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-['Playfair_Display',serif]">
              Join Our Community
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Become part of a supportive network of goal-achievers who celebrate your wins and support your journey.
            </p>
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get Started
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
