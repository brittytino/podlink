'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { 
  X, CheckCircle2, MessageCircle, Flame, Heart, Target,
  Star, TrendingUp, Award
} from 'lucide-react';

export default function ProblemSolution() {
  const painPoints = [
    {
      icon: X,
      title: 'Going It Alone',
      description: 'No one to check in with. No one who understands your struggles.',
      color: 'from-red-400 to-rose-500'
    },
    {
      icon: X,
      title: 'Empty Promises',
      description: 'Easy to skip when nobody is watching. Easy to give up.',
      color: 'from-orange-400 to-red-500'
    },
    {
      icon: X,
      title: 'Lost Motivation',
      description: 'Progress feels invisible. Wins go uncelebrated.',
      color: 'from-pink-400 to-red-500'
    }
  ];

  const benefits = [
    { icon: CheckCircle2, text: 'Scientifically proven accountability system' },
    { icon: CheckCircle2, text: 'Anonymous profiles for safe sharing' },
    { icon: CheckCircle2, text: 'Real-time crisis support network' },
    { icon: CheckCircle2, text: 'Smart timezone-based pod matching' },
    { icon: CheckCircle2, text: 'Gamified progress tracking' },
    { icon: CheckCircle2, text: '100% free to start' }
  ];

  return (
    <section className="bg-white py-32 px-6 sm:px-8 lg:px-12">
      <div className="max-w-[1600px] mx-auto">
        {/* Problem Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 bg-red-50 px-4 py-2 rounded-full mb-6">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-red-700 font-bold text-sm uppercase tracking-widest">The Problem</span>
          </div>
          <h2 className="text-slate-900 text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-8 max-w-5xl mx-auto font-['Playfair_Display',serif]">
            <span className="text-red-600">73%</span> of people abandon their goals within the first month
          </h2>
          <p className="text-slate-600 text-xl md:text-2xl lg:text-3xl max-w-4xl mx-auto font-light">
            Not because they lack <span className="text-slate-900 font-semibold">motivation</span>, but because they lack <span className="text-[#667eea] font-semibold italic">real accountability</span>.
          </p>
          
          {/* Pain Points */}
          <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
            {painPoints.map((point, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ y: -5 }}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${point.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                  <point.icon size={24} className="text-white" />
                </div>
                <h4 className="font-bold text-lg mb-2 text-slate-900">{point.title}</h4>
                <p className="text-slate-600 text-sm">{point.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Solution Section */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center mt-32">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1"
          >
            <div className="inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full mb-6">
              <CheckCircle2 size={16} className="text-green-600" />
              <span className="text-green-700 font-bold text-sm uppercase tracking-widest">The Solution</span>
            </div>
            <h2 className="text-slate-900 text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight font-['Playfair_Display',serif]">
              Meet Your Accountability Pod
            </h2>
            <p className="text-slate-600 text-lg md:text-xl lg:text-2xl leading-relaxed mb-12 font-light">
              Small groups of <span className="font-semibold text-[#667eea]">4-6 people</span> with similar goals, matched by AI to ensure compatibility. 
              Daily check-ins, real-time support, and genuine connections that keep you on track.
            </p>
            <div className="space-y-5">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ x: 5 }}
                  className="flex items-start gap-4 group cursor-pointer"
                >
                  <div className="mt-1.5 p-2 bg-green-50 rounded-xl group-hover:bg-green-100 transition-colors">
                    <benefit.icon size={20} className="text-green-600" />
                  </div>
                  <span className="text-slate-700 text-lg md:text-xl font-light">{benefit.text}</span>
                </motion.div>
              ))}
            </div>
            
            {/* Real User Quote */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className="mt-12 bg-gradient-to-br from-purple-50 to-blue-50 border-l-4 border-[#667eea] rounded-2xl p-8 cursor-pointer"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  S
                </div>
                <div>
                  <div className="font-bold text-lg text-slate-900">Sarah M.</div>
                  <div className="text-sm text-slate-600 flex items-center gap-2">
                    <span>Fitness Enthusiast</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Flame size={14} className="text-orange-500" />
                      67-day streak
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-slate-700 italic text-lg leading-relaxed relative">
                <span className="text-6xl text-[#667eea] absolute -top-4 -left-2 opacity-20 font-serif">"</span>
                <span className="relative z-10">
                  I've tried every app and tracker out there. PodLink is different. My pod members actually care about my progress. They celebrate my wins and lift me up when I'm struggling. I've never felt more supported.
                </span>
              </p>
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-200">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <span className="text-sm text-slate-600 font-semibold">Verified Member</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative order-1 lg:order-2"
          >
            <div className="bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-3xl p-10 lg:p-12 text-white shadow-2xl relative overflow-hidden">
              {/* Decorative Elements */}
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"
              />
              <motion.div 
                animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"
              />
              
              <div className="relative z-10">
                <div className="mb-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <Award size={28} />
                    </div>
                    <div>
                      <div className="font-bold text-xl">Morning Warriors Pod</div>
                      <div className="text-sm text-white/80 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        5 members • All active now
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 space-y-5">
                    {[
                      { initial: 'A', name: 'Alex (You)', streak: 45, emoji: '🎯', gradient: 'from-yellow-400 to-orange-500' },
                      { initial: 'S', name: 'Sarah', streak: 67, emoji: '💪', gradient: 'from-pink-400 to-purple-500' },
                      { initial: 'M', name: 'Mike', streak: 89, emoji: '📚', gradient: 'from-blue-400 to-cyan-500' }
                    ].map((member, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.2 }}
                        whileHover={{ x: 5 }}
                        className="flex items-center gap-4 cursor-pointer"
                      >
                        <div className={`w-12 h-12 bg-gradient-to-br ${member.gradient} rounded-xl flex items-center justify-center font-bold text-lg shadow-lg`}>
                          {member.initial}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-lg">{member.name}</div>
                          <div className="text-sm text-white/80 flex items-center gap-1">
                            <Flame size={14} className="text-orange-400" />
                            {member.streak}-day streak
                          </div>
                        </div>
                        <div className="text-2xl">{member.emoji}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6">
                  <div className="text-sm text-white/70 mb-3 font-medium flex items-center gap-2">
                    <MessageCircle size={16} />
                    Latest Activity
                  </div>
                  <div className="text-base lg:text-lg leading-relaxed mb-4">"Just completed my morning routine! Who's with me? 💪"</div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-white/60">2 minutes ago</div>
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Heart size={16} className="text-red-400 fill-red-400" />
                      <span className="text-sm font-semibold">12</span>
                    </motion.div>
                  </div>
                </div>

                {/* Real-time Typing Indicator */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex items-center gap-2 text-sm text-white/70"
                >
                  <div className="flex gap-1">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      className="w-2 h-2 bg-white/60 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      className="w-2 h-2 bg-white/60 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      className="w-2 h-2 bg-white/60 rounded-full"
                    />
                  </div>
                  <span>Sarah is typing...</span>
                </motion.div>
              </div>
            </div>

            {/* Floating Stats */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-2xl border-2 border-slate-200 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                  <TrendingUp size={24} className="text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">92%</div>
                  <div className="text-sm text-slate-600">Success Rate</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="absolute -top-6 -right-6 bg-white rounded-2xl p-6 shadow-2xl border-2 border-slate-200 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Flame size={24} className="text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">89</div>
                  <div className="text-sm text-slate-600">Avg Streak</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
