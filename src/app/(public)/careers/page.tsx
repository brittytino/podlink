'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Code, Heart, Rocket, Users, Zap } from 'lucide-react';
import Link from 'next/link';

const positions = [
  {
    title: 'Senior Full-Stack Engineer',
    department: 'Engineering',
    location: 'San Francisco, CA / Remote',
    type: 'Full-time',
    icon: Code,
    gradient: 'from-blue-500 to-cyan-500',
    description: 'Build scalable features for our accountability platform. Work with React, Node.js, PostgreSQL, and modern cloud infrastructure.'
  },
  {
    title: 'Product Designer',
    department: 'Design',
    location: 'Remote',
    type: 'Full-time',
    icon: Zap,
    gradient: 'from-purple-500 to-pink-500',
    description: 'Design delightful user experiences that help people achieve their goals. Own the design process from research to implementation.'
  },
  {
    title: 'Community Manager',
    department: 'Community',
    location: 'Remote',
    type: 'Full-time',
    icon: Users,
    gradient: 'from-green-500 to-emerald-500',
    description: 'Build and nurture our community of goal-achievers. Create engaging content and support our users in their accountability journey.'
  },
  {
    title: 'Customer Success Lead',
    department: 'Customer Success',
    location: 'San Francisco, CA / Remote',
    type: 'Full-time',
    icon: Heart,
    gradient: 'from-pink-500 to-rose-500',
    description: 'Help our users get the most out of their accountability pods. Be the voice of our customers and drive product improvements.'
  },
  {
    title: 'Growth Marketing Manager',
    department: 'Marketing',
    location: 'Remote',
    type: 'Full-time',
    icon: Rocket,
    gradient: 'from-orange-500 to-red-500',
    description: 'Drive user acquisition and retention through creative campaigns. Experiment with growth tactics across multiple channels.'
  },
  {
    title: 'DevOps Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    icon: Briefcase,
    gradient: 'from-indigo-500 to-purple-500',
    description: 'Build and maintain our cloud infrastructure. Ensure high availability and performance for our growing user base.'
  }
];

const benefits = [
  {
    title: 'Competitive Salary',
    description: 'Top-of-market compensation with equity options for all employees.'
  },
  {
    title: 'Health & Wellness',
    description: 'Comprehensive health insurance, mental health support, and fitness stipend.'
  },
  {
    title: 'Flexible Work',
    description: 'Work from anywhere with flexible hours. We value output over hours logged.'
  },
  {
    title: 'Learning Budget',
    description: '$2,000 annual budget for courses, conferences, and professional development.'
  },
  {
    title: 'Unlimited PTO',
    description: 'Take the time you need to recharge. We trust you to manage your time.'
  },
  {
    title: 'Equipment',
    description: 'Latest MacBook Pro, monitor, and any tools you need to do your best work.'
  },
  {
    title: 'Team Retreats',
    description: 'Quarterly all-hands retreats in exciting locations around the world.'
  },
  {
    title: 'Stock Options',
    description: 'Everyone has skin in the game. Share in our success as we grow.'
  }
];

const values = [
  {
    title: 'Impact First',
    description: 'We measure success by the positive impact we have on people\'s lives.'
  },
  {
    title: 'Transparency',
    description: 'Open communication, honest feedback, and no hidden agendas.'
  },
  {
    title: 'Ownership',
    description: 'Take initiative, make decisions, and own the outcomes.'
  },
  {
    title: 'Continuous Learning',
    description: 'Always be growing. We invest in your development and career growth.'
  }
];

export default function CareersPage() {
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
              Join Our Team
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-8">
              Help us build the future of accountability and personal development. Work with passionate people on meaningful problems.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-slate-700">6 Open Positions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                <span className="text-slate-700">Remote-First</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="text-slate-700">Competitive Benefits</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 text-white"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 font-['Playfair_Display',serif]">
              What We Value
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white"
              >
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="opacity-90">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-800 font-['Playfair_Display',serif]">
              Open Positions
            </h2>
            <p className="text-xl text-slate-600">
              Find your next opportunity to make an impact.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {positions.map((position, index) => {
              const Icon = position.icon;
              return (
                <motion.div
                  key={position.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${position.gradient} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 text-slate-800">{position.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">
                      {position.department}
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
                      {position.type}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm mb-4">{position.description}</p>
                  <p className="text-slate-500 text-sm flex items-center gap-1">
                    <span className="text-slate-400">📍</span>
                    {position.location}
                  </p>
                  
                  <Link href="/contact">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-4 w-full bg-slate-100 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white text-slate-800 py-2 rounded-lg font-semibold transition-all duration-300"
                    >
                      Apply Now
                    </motion.button>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-800 font-['Playfair_Display',serif]">
              Benefits & Perks
            </h2>
            <p className="text-xl text-slate-600">
              We take care of our team so they can do their best work.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <h3 className="text-lg font-bold mb-2 text-slate-800">{benefit.title}</h3>
                <p className="text-slate-600 text-sm">{benefit.description}</p>
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
              Don't See Your Role?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              We're always looking for talented people. Send us your resume and tell us how you can contribute.
            </p>
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get in Touch
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
