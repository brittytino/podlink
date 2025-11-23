'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote, CheckCircle, TrendingUp, Award } from 'lucide-react';

const testimonials = [
  {
    name: 'Devadharshini V',
    role: 'Product Manager',
    company: 'FR8',
    avatar: 'https://avatar.iran.liara.run/public/girl?username=devadharshini',
    gender: 'girl',
    goal: 'Daily meditation practice',
    streak: 127,
    rating: 5,
    quote: 'I struggled with maintaining a meditation routine for years. This platform transformed my inconsistent habit into a 127-day streak. My pod celebrates every milestone, and their daily check-ins keep me accountable. It\'s exactly what I needed.',
    verified: true,
    achievement: 'Longest Streak Winner',
    beforeAfter: {
      before: '3 days max streak',
      after: '127 days and counting'
    }
  },
  {
    name: 'Anushri R',
    role: 'Interior Designer',
    company: 'designX',
    avatar: 'https://avatar.iran.liara.run/public/girl?username=anushri',
    gender: 'girl',
    goal: 'Learn Spanish fluently',
    streak: 89,
    rating: 5,
    quote: 'I tried multiple language apps but never stuck with them. Here, I have 5 people who genuinely care about my progress. We share resources, practice together, and celebrate wins. 89 days strong and still going!',
    verified: true,
    achievement: 'Pod MVP',
    beforeAfter: {
      before: 'Quit after 2 weeks',
      after: '89-day streak'
    }
  },
  {
    name: 'Nithika R',
    role: 'CS Executive',
    company: 'Independent',
    avatar: 'https://avatar.iran.liara.run/public/girl?username=nithika',
    gender: 'girl',
    goal: 'Early morning workouts',
    streak: 156,
    rating: 5,
    quote: 'As a fitness enthusiast, I understand the power of accountability. This platform gave me the support system I needed. My 5am workouts are now non-negotiable because my pod counts on me, and I count on them.',
    verified: true,
    achievement: '5am Club Member',
    beforeAfter: {
      before: 'Snoozing daily',
      after: '156 mornings strong'
    }
  },
  {
    name: 'Ranganathan KP',
    role: 'Entrepreneur',
    company: 'StartupCo',
    avatar: 'https://avatar.iran.liara.run/public/boy?username=ranganathan',
    gender: 'boy',
    goal: 'Write 500 words daily',
    streak: 73,
    rating: 5,
    quote: 'Writer\'s block was affecting my startup blog. My pod holds me accountable for 500 words daily. Some days are tough, but they push me through. 73 days later, I have a complete book draft ready!',
    verified: true,
    achievement: 'Content Creator',
    beforeAfter: {
      before: '0 blog posts',
      after: '36,500 words written'
    }
  },
  {
    name: 'Swetha S',
    role: 'Medical Student',
    company: 'AIIMS Delhi',
    avatar: 'https://avatar.iran.liara.run/public/girl?username=swetha',
    gender: 'girl',
    goal: 'Study 3 hours daily',
    streak: 94,
    rating: 5,
    quote: 'Medical school is incredibly demanding. My pod keeps me focused and motivated. When I\'m stressed, they support me. When I succeed, they celebrate with me. The crisis support feature was invaluable during exam week.',
    verified: true,
    achievement: 'Academic Excellence',
    beforeAfter: {
      before: 'Procrastinating',
      after: '282 study hours logged'
    }
  },
  {
    name: 'Dharshini S',
    role: 'Designer',
    company: 'Divine Infotech',
    avatar: 'https://avatar.iran.liara.run/public/girl?username=dharshini',
    gender: 'girl',
    goal: 'Daily creative practice',
    streak: 112,
    rating: 5,
    quote: 'Creative burnout is a real challenge. The anonymous mode allowed me to be vulnerable about my struggles. My pod supports me through creative blocks and celebrates every breakthrough. 112 days of consistent creativity!',
    verified: true,
    achievement: 'Creative Streak',
    beforeAfter: {
      before: 'Months of nothing',
      after: '112 creative pieces'
    }
  }
];

const TestimonialCard = ({ testimonial, isActive }: { testimonial: typeof testimonials[0], isActive: boolean }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: isActive ? 1 : 0.5,
        scale: isActive ? 1 : 0.9,
        filter: isActive ? 'blur(0px)' : 'blur(2px)'
      }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-slate-200 relative overflow-hidden">
        {/* Gradient overlay */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full blur-3xl opacity-30" />

        {/* Quote icon */}
        <div className="absolute top-8 right-8 opacity-10">
          <Quote size={100} className="text-purple-600" />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-4">
              {/* Avatar - Real Image */}
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg ring-4 ring-white">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Online indicator */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
              </div>

              {/* User info */}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-bold text-slate-900 font-['Playfair_Display',serif]">
                    {testimonial.name}
                  </h3>
                  {testimonial.verified && (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <CheckCircle size={16} className="text-white" fill="white" />
                    </div>
                  )}
                </div>
                <p className="text-slate-600">{testimonial.role}</p>
                <p className="text-slate-500 text-sm">{testimonial.company}</p>
              </div>
            </div>

            {/* Achievement badge */}
            <div className="hidden md:flex bg-gradient-to-br from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg items-center gap-2">
              <Award size={16} />
              {testimonial.achievement}
            </div>
          </div>

          {/* Rating */}
          <div className="flex gap-1 mb-6">
            {[...Array(testimonial.rating)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <Star size={24} className="text-yellow-400 fill-yellow-400" />
              </motion.div>
            ))}
          </div>

          {/* Quote */}
          <p className="text-slate-700 text-lg md:text-xl leading-relaxed mb-8 font-light">
            "{testimonial.quote}"
          </p>

          {/* Goal & Streak */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4">
              <div className="text-sm text-slate-600 mb-1">Goal</div>
              <div className="text-lg font-bold text-slate-900">{testimonial.goal}</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-4">
              <div className="text-sm text-slate-600 mb-1">Current Streak</div>
              <div className="text-lg font-bold text-orange-600 flex items-center gap-2">
                🔥 {testimonial.streak} days
              </div>
            </div>
          </div>

          {/* Before/After */}
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Before PodLink</div>
                <div className="text-slate-700 font-semibold">{testimonial.beforeAfter.before}</div>
              </div>
              <div>
                <div className="text-xs text-green-600 mb-2 uppercase tracking-wider flex items-center gap-1">
                  <TrendingUp size={12} />
                  After PodLink
                </div>
                <div className="text-green-700 font-bold">{testimonial.beforeAfter.after}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="testimonials" className="relative bg-gradient-to-b from-white to-slate-50 py-32 px-6 sm:px-8 lg:px-12 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="absolute bottom-20 right-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
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
          <div className="inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full mb-6">
            <Star size={16} className="text-green-600 fill-green-600" />
            <span className="text-green-700 font-bold text-sm uppercase tracking-widest">Success Stories</span>
          </div>

          <h2 className="text-slate-900 text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight font-['Playfair_Display',serif]">
            Real People, Real Results
          </h2>

          <p className="text-slate-600 text-xl md:text-2xl max-w-3xl mx-auto font-light">
            Don't just take our word for it. Here's what our members have achieved with their pods.
          </p>
        </motion.div>

        {/* Stats Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {[
            { label: 'Average Rating', value: '4.9/5', icon: '⭐' },
            { label: 'Success Rate', value: '92%', icon: '🎯' },
            { label: 'Active Members', value: '447', icon: '👥' },
            { label: 'Total Streaks', value: '147', icon: '🔥' }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 text-center"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
              <div className="text-sm text-slate-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          {/* Main testimonial */}
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={activeIndex}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 300 : -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -300 : 300 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <TestimonialCard testimonial={testimonials[activeIndex]} isActive={true} />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4 mb-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePrev}
              className="w-14 h-14 bg-white rounded-full shadow-lg border border-slate-200 flex items-center justify-center hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white transition-all duration-300 group"
            >
              <ChevronLeft size={24} className="text-slate-600 group-hover:text-white" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNext}
              className="w-14 h-14 bg-white rounded-full shadow-lg border border-slate-200 flex items-center justify-center hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white transition-all duration-300 group"
            >
              <ChevronRight size={24} className="text-slate-600 group-hover:text-white" />
            </motion.button>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2">
            {testimonials.map((_, idx) => (
              <motion.button
                key={idx}
                onClick={() => {
                  setDirection(idx > activeIndex ? 1 : -1);
                  setActiveIndex(idx);
                }}
                whileHover={{ scale: 1.3 }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === activeIndex
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 w-8'
                    : 'bg-slate-300 w-2'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mt-20"
        >
          <p className="text-slate-600 text-lg mb-6">
            Ready to write your own success story?
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            Join 1,247+ Successful Members
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
