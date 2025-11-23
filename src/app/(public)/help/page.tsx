'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Book, Video, FileText, Headphones, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const categories = [
  {
    name: 'Getting Started',
    icon: Book,
    gradient: 'from-purple-500 to-pink-500',
    articles: [
      'How to create your first accountability pod',
      'Setting effective goals',
      'Understanding the dashboard',
      'Customizing your profile'
    ]
  },
  {
    name: 'Features & Tools',
    icon: FileText,
    gradient: 'from-blue-500 to-cyan-500',
    articles: [
      'Using daily check-ins effectively',
      'Tracking your progress',
      'Understanding pod analytics',
      'Setting up notifications'
    ]
  },
  {
    name: 'Pods & Community',
    icon: Headphones,
    gradient: 'from-green-500 to-emerald-500',
    articles: [
      'How pod matching works',
      'Best practices for pod communication',
      'Handling pod conflicts',
      'Creating private pods'
    ]
  },
  {
    name: 'Tutorials',
    icon: Video,
    gradient: 'from-orange-500 to-red-500',
    articles: [
      'Complete beginner walkthrough',
      'Advanced goal tracking techniques',
      'Maximizing accountability',
      'Using the mobile app'
    ]
  }
];

const popularArticles = [
  { title: 'How do I join my first accountability pod?', views: '12.5K' },
  { title: 'What happens if I miss a check-in?', views: '8.3K' },
  { title: 'How to change my pod preferences', views: '6.7K' },
  { title: 'Understanding the points and leaderboard system', views: '5.2K' },
  { title: 'How to export my progress data', views: '4.1K' }
];

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');

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
              Help Center
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-8">
              Find answers, get support, and learn how to make the most of your accountability journey.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Search for help articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-lg text-lg"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-2xl p-6 shadow-lg cursor-pointer"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${category.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="text-white" size={28} />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-4 text-slate-800">{category.name}</h3>
                  
                  <ul className="space-y-3">
                    {category.articles.map((article, idx) => (
                      <li key={idx}>
                        <Link href="/help">
                          <span className="text-sm text-slate-600 hover:text-purple-600 transition-colors flex items-center gap-2 group">
                            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            {article}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="pb-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 text-slate-800 font-['Playfair_Display',serif]">
              Popular Articles
            </h2>
            <p className="text-lg text-slate-600">
              Most searched help topics this month
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {popularArticles.map((article, index) => (
              <motion.div
                key={article.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 8 }}
              >
                <Link href="/help">
                  <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-800 font-semibold flex-1">{article.title}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-500">{article.views} views</span>
                        <ChevronRight className="text-purple-600" size={20} />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white shadow-2xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-['Playfair_Display',serif]">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Our support team is here to help you 24/7. Get in touch and we'll respond within a few hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Contact Support
                </motion.button>
              </Link>
              <Link href="/faq">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/10 backdrop-blur-sm border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300"
                >
                  View FAQ
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
