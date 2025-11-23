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
    <section className="relative bg-gradient-to-b from-white via-slate-50/30 to-white py-20 sm:py-32 px-6 sm:px-8 lg:px-12 overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <motion.div
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 -left-20 w-96 h-96 bg-gradient-to-br from-red-100 to-orange-100 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 30, 0],
            x: [0, -20, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-1/4 -right-20 w-96 h-96 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Problem Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-20 sm:mb-32"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 bg-red-50 px-4 py-2 rounded-full mb-6 sm:mb-8"
          >
            <motion.div 
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 bg-red-500 rounded-full"
            />
            <span className="text-red-700 font-bold text-xs sm:text-sm uppercase tracking-widest">The Problem</span>
          </motion.div>
          
          <h2 className="text-slate-900 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 sm:mb-8 max-w-5xl mx-auto font-['Playfair_Display',serif]">
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-red-600"
            >
              73%
            </motion.span> of people abandon their goals within the first month
          </h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-slate-600 text-lg sm:text-xl md:text-2xl max-w-4xl mx-auto font-light"
          >
            Not because they lack <span className="text-slate-900 font-semibold">motivation</span>, but because they lack <span className="text-[#667eea] font-semibold italic">real accountability</span>.
          </motion.p>
          
          {/* Pain Points */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-12 sm:mt-16 max-w-5xl mx-auto">
            {painPoints.map((point, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.15, duration: 0.5, ease: "easeOut" }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 text-left hover:shadow-xl hover:border-red-200 transition-all duration-300 cursor-pointer group"
              >
                <motion.div 
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                  className={`w-12 h-12 bg-gradient-to-br ${point.color} rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:shadow-lg`}
                >
                  <point.icon size={22} className="text-white" />
                </motion.div>
                <h4 className="font-bold text-base sm:text-lg mb-2 text-slate-900">{point.title}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{point.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Solution Section */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="order-2 lg:order-1"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full mb-6"
            >
              <CheckCircle2 size={16} className="text-green-600" />
              <span className="text-green-700 font-bold text-xs sm:text-sm uppercase tracking-widest">The Solution</span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-slate-900 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 leading-tight font-['Playfair_Display',serif]"
            >
              Meet Your Accountability Pod
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-slate-600 text-base sm:text-lg md:text-xl leading-relaxed mb-8 sm:mb-12 font-light"
            >
              Small groups of <span className="font-semibold text-[#667eea]">4-6 people</span> with similar goals, matched by AI to ensure compatibility. 
              Daily check-ins, real-time support, and genuine connections that keep you on track.
            </motion.p>
            
            <div className="space-y-4">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.4, ease: "easeOut" }}
                  whileHover={{ x: 8, scale: 1.02 }}
                  className="flex items-start gap-3 sm:gap-4 group cursor-pointer"
                >
                  <motion.div 
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    className="mt-1 p-2 bg-green-50 rounded-xl group-hover:bg-green-100 transition-colors shadow-sm"
                  >
                    <benefit.icon size={18} className="text-green-600" />
                  </motion.div>
                  <span className="text-slate-700 text-base sm:text-lg font-light">{benefit.text}</span>
                </motion.div>
              ))}
            </div>
            
            {/* Real User Quote */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.8 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="mt-10 sm:mt-12 bg-gradient-to-br from-purple-50 via-blue-50 to-purple-50 border-l-4 border-[#667eea] rounded-2xl p-6 sm:p-8 cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start gap-3 sm:gap-4 mb-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg flex-shrink-0">
                  M
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-base sm:text-lg text-slate-900">Monika M.</div>
                  <div className="text-xs sm:text-sm text-slate-600 flex items-center gap-2 flex-wrap">
                    <span>Fitness Enthusiast</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="flex items-center gap-1">
                      <Flame size={14} className="text-orange-500 flex-shrink-0" />
                      67-day streak
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-slate-700 italic text-base sm:text-lg leading-relaxed relative">
                <span className="text-5xl sm:text-6xl text-[#667eea] absolute -top-2 sm:-top-4 -left-1 sm:-left-2 opacity-20 font-serif">"</span>
                <span className="relative z-10">
                  I've tried every app and tracker out there. This platform is different. My pod members actually care about my progress. They celebrate my wins and lift me up when I'm struggling. I've never felt more supported.
                </span>
              </p>
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-200/60">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 1 + i * 0.05 }}
                    >
                      <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    </motion.div>
                  ))}
                </div>
                <span className="text-xs sm:text-sm text-slate-600 font-semibold">Verified Member</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative order-1 lg:order-2"
          >
            <div className="bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-2xl sm:rounded-3xl p-8 sm:p-10 lg:p-12 text-white shadow-2xl relative overflow-hidden">
              {/* Decorative Elements */}
              <motion.div 
                animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-white/10 rounded-full blur-3xl"
              />
              <motion.div 
                animate={{ scale: [1, 1.4, 1], opacity: [0.15, 0.3, 0.15] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-0 left-0 w-28 sm:w-32 h-28 sm:h-32 bg-white/10 rounded-full blur-2xl"
              />
              
              <div className="relative z-10">
                <div className="mb-6 sm:mb-8">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6"
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Award size={24} className="sm:w-7 sm:h-7" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-lg sm:text-xl truncate">Morning Warriors Pod</div>
                      <div className="text-xs sm:text-sm text-white/80 flex items-center gap-2">
                        <motion.div 
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-2 h-2 bg-green-400 rounded-full"
                        />
                        3 members • All active now
                      </div>
                    </div>
                  </motion.div>
                  
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-4 sm:space-y-5">
                    {[
                      { initial: 'B', name: 'brave_soldier (You)', streak: 45, emoji: '🎯', gradient: 'from-yellow-400 to-orange-500' },
                      { initial: 'P', name: 'phenomenan_star', streak: 67, emoji: '💪', gradient: 'from-pink-400 to-purple-500' },
                      { initial: 'S', name: 'sparking_queen', streak: 89, emoji: '📚', gradient: 'from-blue-400 to-cyan-500' }
                    ].map((member, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + i * 0.15, duration: 0.4 }}
                        whileHover={{ x: 6, scale: 1.02 }}
                        className="flex items-center gap-3 sm:gap-4 cursor-pointer group"
                      >
                        <motion.div 
                          whileHover={{ rotate: [0, -5, 5, 0] }}
                          transition={{ duration: 0.4 }}
                          className={`w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-br ${member.gradient} rounded-xl flex items-center justify-center font-bold text-base sm:text-lg shadow-lg flex-shrink-0 group-hover:shadow-xl`}
                        >
                          {member.initial}
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-base sm:text-lg truncate">{member.name}</div>
                          <div className="text-xs sm:text-sm text-white/80 flex items-center gap-1">
                            <Flame size={14} className="text-orange-400 flex-shrink-0" />
                            {member.streak}-day streak
                          </div>
                        </div>
                        <div className="text-xl sm:text-2xl flex-shrink-0">{member.emoji}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.9 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl sm:rounded-3xl p-5 sm:p-6"
                >
                  <div className="text-xs sm:text-sm text-white/70 mb-3 font-medium flex items-center gap-2">
                    <MessageCircle size={16} className="flex-shrink-0" />
                    Latest Activity
                  </div>
                  <div className="text-sm sm:text-base lg:text-lg leading-relaxed mb-4">"Just completed my morning routine! Who's with me? 💪"</div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-white/60">2 minutes ago</div>
                    <motion.div 
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <Heart size={16} className="text-red-400 fill-red-400" />
                      </motion.div>
                      <span className="text-sm font-semibold">12</span>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Real-time Typing Indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.1 }}
                  className="mt-4 flex items-center gap-2 text-xs sm:text-sm text-white/70"
                >
                  <div className="flex gap-1">
                    <motion.div
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                      className="w-2 h-2 bg-white/60 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                      className="w-2 h-2 bg-white/60 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                      className="w-2 h-2 bg-white/60 rounded-full"
                    />
                  </div>
                  <span>Monika is typing...</span>
                </motion.div>
              </div>
            </div>

            {/* Floating Stats */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.08, y: -4 }}
              className="absolute -bottom-4 sm:-bottom-6 -left-4 sm:-left-6 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl border-2 border-slate-200 cursor-pointer"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <motion.div 
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
                >
                  <TrendingUp size={20} className="text-white sm:w-6 sm:h-6" />
                </motion.div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-slate-900">92%</div>
                  <div className="text-xs sm:text-sm text-slate-600">Success Rate</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.08, y: -4 }}
              className="absolute -top-4 sm:-top-6 -right-4 sm:-right-6 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl border-2 border-slate-200 cursor-pointer"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <motion.div 
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
                >
                  <Flame size={20} className="text-white sm:w-6 sm:h-6" />
                </motion.div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-slate-900">89</div>
                  <div className="text-xs sm:text-sm text-slate-600">Avg Streak</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
