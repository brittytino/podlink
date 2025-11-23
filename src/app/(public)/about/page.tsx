'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Target, Users, Zap, Globe, Shield } from 'lucide-react';
import Link from 'next/link';

const values = [
  {
    icon: Heart,
    title: 'Empathy First',
    description: 'We believe in the power of human connection. Every feature we build is designed with compassion and understanding at its core.',
    gradient: 'from-pink-500 to-rose-500'
  },
  {
    icon: Target,
    title: 'Goal-Oriented',
    description: 'We\'re committed to helping people achieve their dreams. Success is measured by the goals our community accomplishes.',
    gradient: 'from-purple-500 to-indigo-500'
  },
  {
    icon: Users,
    title: 'Community Driven',
    description: 'Our users shape our product. We listen, learn, and evolve based on real feedback from our accountability pods.',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Zap,
    title: 'Innovation',
    description: 'We\'re constantly pushing boundaries in personal development technology, making accountability more accessible and effective.',
    gradient: 'from-yellow-500 to-orange-500'
  },
  {
    icon: Globe,
    title: 'Inclusive',
    description: 'Everyone deserves support in achieving their goals. We\'re building a platform that welcomes people from all backgrounds.',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    icon: Shield,
    title: 'Trust & Safety',
    description: 'Your privacy and security are non-negotiable. We protect your data and create safe spaces for vulnerability.',
    gradient: 'from-slate-600 to-slate-800'
  }
];

const team = [
  {
    name: 'Anonymous User',
    role: 'Co-Founder & CEO',
    image: 'https://avatar.iran.liara.run/public/girl?username=cofounder1',
    bio: 'Former Product Lead at top tech companies. Passionate about behavioral psychology and personal development.'
  },
  {
    name: 'TechBuilder_47',
    role: 'Co-Founder & CTO',
    image: 'https://avatar.iran.liara.run/public/boy?username=techbuilder47',
    bio: '15 years in tech. Built scalable platforms at leading companies. Believes in tech for good.'
  },
  {
    name: 'ProductGuru_X',
    role: 'Head of Product',
    image: 'https://avatar.iran.liara.run/public/girl?username=productgurux',
    bio: 'UX researcher turned product leader. Obsessed with creating delightful user experiences.'
  },
  {
    name: 'CodeMaster_Jay',
    role: 'Head of Engineering',
    image: 'https://avatar.iran.liara.run/public/boy?username=codemasterjay',
    bio: 'Full-stack architect with a passion for clean code and mentoring junior developers.'
  }
];

const stats = [
  { value: '1,247', label: 'Active Members' },
  { value: '150+', label: 'Accountability Pods' },
  { value: '92%', label: 'Goal Success Rate' },
  { value: '89', label: 'Average Streak Days' }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-['Playfair_Display',serif]">
              About Us
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto">
              We're on a mission to make goal achievement accessible to everyone through the power of accountability.
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg text-center"
              >
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-['Playfair_Display',serif]">
              Our Mission
            </h2>
            <p className="text-xl md:text-2xl leading-relaxed opacity-95">
              To empower individuals worldwide to achieve their goals through meaningful accountability partnerships. 
              We believe that everyone deserves support in their journey, and together, we're building a community 
              where dreams become reality.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-800 font-['Playfair_Display',serif]">
              Our Values
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              These principles guide every decision we make and feature we build.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="bg-white rounded-2xl p-8 shadow-lg"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${value.gradient} rounded-xl flex items-center justify-center mb-6 shadow-lg`}>
                    <Icon className="text-white" size={28} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-slate-800">{value.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-800 font-['Playfair_Display',serif]">
              Meet Our Team
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              A diverse group of passionate individuals committed to your success.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl p-6 shadow-lg text-center"
              >
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full rounded-2xl object-cover ring-4 ring-white shadow-lg"
                  />
                </div>
                <h3 className="text-xl font-bold mb-1 text-slate-800">{member.name}</h3>
                <p className="text-purple-600 font-semibold mb-3">{member.role}</p>
                <p className="text-sm text-slate-600">{member.bio}</p>
              </motion.div>
            ))}
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
              Join Our Journey
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Become part of a community that's changing how people achieve their goals.
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
