'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, TrendingUp, Users, Heart } from 'lucide-react';

export default function OriginStory() {
  const redditPost = {
    subreddit: 'r/GetMotivated',
    author: 'u/accountability_seeker',
    time: '8 months ago',
    upvotes: '12.4k',
    comments: '847',
    title: 'I built an app to solve the #1 reason people fail their goals - lack of accountability',
    content: `After watching my friends (and myself) fail New Year's resolutions year after year, I realized the problem wasn't motivation - it was accountability.

So I built PodLink. Small accountability pods of 4-6 people matched by AI based on:
- Similar goals
- Compatible timezones  
- Matching availability

The results? 92% of beta users are still going strong after 3 months (vs the typical 27% for solo goal-setters).

The beta is live. Would love your thoughts.`,
    topComments: [
      { author: 'u/fitness_enthusiast', upvotes: '2.1k', text: 'This is exactly what I needed! Just signed up. The anonymous feature is a game-changer.' },
    ]
  };

  const linkedinPost = {
    author: 'Sarah Chen',
    role: 'Product Manager at Microsoft',
    time: '6 months ago',
    reactions: '3,847',
    comments: '421',
    reposts: '892',
    title: 'How a side project from Reddit is changing how we achieve goals',
    content: `I rarely post about apps, but PodLink deserves attention.

Discovered this on Reddit 2 months ago. Skeptical at first, but the concept was brilliant:

What if goal-setting wasn't a solo journey?
What if you had 5 people who genuinely cared about your progress?
What if accountability felt supportive, not judgmental?

67 days later, I haven't missed a single workout. My pod celebrates my wins, checks in when I'm quiet, and keeps me honest.

The platform is beautifully simple:
✅ Anonymous profiles (no pressure)
✅ Smart matching algorithm
✅ Real-time support
✅ Crisis alerts for mental health

This is the future of personal development.`,
    topReactions: [
      { name: 'David Kim', role: 'VP Engineering at Amazon', text: 'Just joined. This is what the productivity space has been missing.' },
    ]
  };

  return (
    <section id="story" className="bg-white py-20 sm:py-32 px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16 sm:mb-24"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full mb-6"
          >
            <TrendingUp size={16} className="text-orange-600" />
            <span className="text-orange-700 font-bold text-xs sm:text-sm uppercase tracking-widest">Our Origin Story</span>
          </motion.div>
          <h2 className="text-slate-900 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 leading-tight font-['Playfair_Display',serif]">
            From Reddit to Movement
          </h2>
          <p className="text-slate-600 text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto font-light">
            How one weekend project became a trusted accountability platform
          </p>
        </motion.div>

        {/* Timeline Container */}
        <div className="relative max-w-6xl mx-auto">
          {/* Vertical Line - Desktop Only */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 transform -translate-x-1/2 w-0.5">
            <motion.div 
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="h-full w-full bg-gradient-to-b from-orange-400 to-purple-500 origin-top"
            />
          </div>

          {/* Timeline Dots - Desktop Only */}
          <motion.div 
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="hidden lg:block absolute left-1/2 top-0 transform -translate-x-1/2 w-4 h-4 bg-orange-500 rounded-full border-4 border-white shadow-lg z-10"
          />
          <motion.div 
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
            className="hidden lg:block absolute left-1/2 bottom-0 transform -translate-x-1/2 w-4 h-4 bg-purple-500 rounded-full border-4 border-white shadow-lg z-10"
          />

          {/* Reddit Post Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-16 sm:mb-24 lg:mb-32 lg:grid lg:grid-cols-2 lg:gap-12 items-center"
          >
            {/* Left Content - Desktop / Top - Mobile */}
            <div className="lg:text-right mb-8 lg:mb-0 lg:pr-12">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-block bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 px-4 py-2 rounded-full font-bold text-xs sm:text-sm mb-4 shadow-sm"
              >
                March 2024 • The Beginning
              </motion.div>
              <motion.h3 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-['Playfair_Display',serif]"
              >
                A Simple Reddit Post
              </motion.h3>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-base sm:text-lg text-slate-600 font-light mb-6"
              >
                A weekend project shared on Reddit. Within 48 hours, 500 people signed up for the beta.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex flex-wrap lg:justify-end gap-3 sm:gap-4"
              >
                <motion.div 
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="text-center bg-gradient-to-br from-slate-50 to-white rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">12.4k</div>
                  <div className="text-xs sm:text-sm text-slate-600">Upvotes</div>
                </motion.div>
                <motion.div 
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="text-center bg-gradient-to-br from-slate-50 to-white rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">847</div>
                  <div className="text-xs sm:text-sm text-slate-600">Comments</div>
                </motion.div>
              </motion.div>
            </div>

            {/* Reddit Post Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ y: -6, scale: 1.01 }}
              className="bg-white border-2 border-slate-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl hover:border-orange-300 transition-all duration-300 cursor-pointer lg:ml-12"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-md">
                  R
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-slate-900 text-sm sm:text-base truncate">{redditPost.subreddit}</div>
                  <div className="text-xs sm:text-sm text-slate-500 truncate">Posted by {redditPost.author} • {redditPost.time}</div>
                </div>
              </div>
              
              <h4 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 leading-tight">{redditPost.title}</h4>
              
              <p className="text-sm sm:text-base text-slate-700 mb-6 leading-relaxed whitespace-pre-line">{redditPost.content}</p>
              
              <div className="flex items-center gap-4 sm:gap-6 pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2 text-slate-600">
                  <TrendingUp size={16} className="text-orange-500 flex-shrink-0" />
                  <span className="font-semibold text-sm sm:text-base">{redditPost.upvotes}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <MessageCircle size={16} className="text-blue-500 flex-shrink-0" />
                  <span className="font-semibold text-sm sm:text-base">{redditPost.comments}</span>
                </div>
              </div>

              {/* Top Comment Preview */}
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="mt-6 pt-6 border-t border-slate-200"
              >
                <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0">
                      F
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-xs sm:text-sm text-slate-900 truncate">{redditPost.topComments[0].author}</div>
                      <div className="text-xs text-slate-500">{redditPost.topComments[0].upvotes} upvotes</div>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">{redditPost.topComments[0].text}</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* LinkedIn Post Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:grid lg:grid-cols-2 lg:gap-12 items-center"
          >
            {/* LinkedIn Post Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ y: -6, scale: 1.01 }}
              className="bg-white border-2 border-slate-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl hover:border-purple-300 transition-all duration-300 cursor-pointer lg:order-1 mb-8 lg:mb-0 lg:mr-12"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-md flex-shrink-0">
                  SC
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-slate-900 text-sm sm:text-base truncate">{linkedinPost.author}</div>
                  <div className="text-xs sm:text-sm text-slate-500 truncate">{linkedinPost.role} • {linkedinPost.time}</div>
                </div>
              </div>
              
              <h4 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 leading-tight">{linkedinPost.title}</h4>
              
              <p className="text-sm sm:text-base text-slate-700 mb-6 leading-relaxed whitespace-pre-line">{linkedinPost.content}</p>
              
              <div className="flex items-center gap-3 sm:gap-6 pt-4 border-t border-slate-200 overflow-x-auto">
                <div className="flex items-center gap-2 text-slate-600 flex-shrink-0">
                  <Heart size={16} className="text-red-500" />
                  <span className="font-semibold text-sm sm:text-base">{linkedinPost.reactions}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 flex-shrink-0">
                  <MessageCircle size={16} className="text-blue-500" />
                  <span className="font-semibold text-sm sm:text-base">{linkedinPost.comments}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 flex-shrink-0">
                  <TrendingUp size={16} className="text-green-500" />
                  <span className="font-semibold text-sm sm:text-base">{linkedinPost.reposts}</span>
                </div>
              </div>

              {/* Top Reaction Preview */}
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="mt-6 pt-6 border-t border-slate-200"
              >
                <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0">
                      DK
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-xs sm:text-sm text-slate-900 truncate">{linkedinPost.topReactions[0].name}</div>
                      <div className="text-xs text-slate-500 truncate">{linkedinPost.topReactions[0].role}</div>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">{linkedinPost.topReactions[0].text}</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Content - Desktop / Bottom - Mobile */}
            <div className="lg:order-2 lg:pl-12">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-block bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 px-4 py-2 rounded-full font-bold text-xs sm:text-sm mb-4 shadow-sm"
              >
                May 2024 • Going Viral
              </motion.div>
              <motion.h3 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-['Playfair_Display',serif]"
              >
                LinkedIn Takes Notice
              </motion.h3>
              <motion.p 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-base sm:text-lg text-slate-600 font-light mb-6"
              >
                Product managers and thought leaders shared their success. PodLink became the talk of the productivity community.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex flex-wrap gap-3 sm:gap-4"
              >
                <motion.div 
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="text-center bg-gradient-to-br from-slate-50 to-white rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">3.8k</div>
                  <div className="text-xs sm:text-sm text-slate-600">Reactions</div>
                </motion.div>
                <motion.div 
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="text-center bg-gradient-to-br from-slate-50 to-white rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">892</div>
                  <div className="text-xs sm:text-sm text-slate-600">Reposts</div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
