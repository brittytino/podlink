'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, TrendingUp, Target, Users } from 'lucide-react';
import Link from 'next/link';

const blogPosts = [
  {
    title: 'The Science of Accountability: Why Pods Work',
    excerpt: 'Discover the psychological research behind why accountability partnerships are 95% more effective than going it alone.',
    author: 'Research Team',
    date: 'Nov 20, 2024',
    category: 'Research',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    title: '10 Tips for Leading a Successful Accountability Pod',
    excerpt: 'Learn proven strategies from our top-performing pod leaders to maximize engagement and goal achievement.',
    author: 'Community Leader',
    date: 'Nov 18, 2024',
    category: 'Tips & Tricks',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    title: 'From Procrastination to Progress: A Success Story',
    excerpt: 'How a PodLink member went from chronic procrastinator to completing their first marathon using accountability pods.',
    author: 'Success_Story_92',
    date: 'Nov 15, 2024',
    category: 'Success Stories',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    title: 'Building Habits That Stick: The 30-Day Challenge',
    excerpt: 'A science-backed approach to forming lasting habits through daily accountability and micro-commitments.',
    author: 'HabitBuilder_X',
    date: 'Nov 12, 2024',
    category: 'Habits',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800',
    gradient: 'from-orange-500 to-red-500'
  },
  {
    title: 'The Power of Vulnerability in Accountability',
    excerpt: 'Why being authentic about your struggles creates stronger bonds and better outcomes in your pod.',
    author: 'Psychology Expert',
    date: 'Nov 10, 2024',
    category: 'Psychology',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800',
    gradient: 'from-pink-500 to-rose-500'
  },
  {
    title: 'Remote Work Goals: Staying Productive at Home',
    excerpt: 'Strategies for maintaining focus and achieving career goals while working remotely with your accountability pod.',
    author: 'ProductivityPro',
    date: 'Nov 8, 2024',
    category: 'Productivity',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
    gradient: 'from-indigo-500 to-purple-500'
  }
];

const categories = ['All', 'Research', 'Tips & Tricks', 'Success Stories', 'Habits', 'Psychology', 'Productivity'];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredPosts = selectedCategory === 'All'
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory);

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
              Blog
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto">
              Insights, tips, and success stories from the accountability community.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category, index) => (
              <motion.button
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedCategory(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-white text-slate-700 hover:bg-slate-100 shadow'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.article
                key={post.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
              >
                <div className="relative h-48 overflow-hidden bg-slate-200">
                  <div className={`absolute inset-0 bg-gradient-to-br ${post.gradient} opacity-80`} />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-slate-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h2 className="text-xl font-bold mb-3 text-slate-800 line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-slate-600 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <User size={14} />
                      {post.author}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-purple-600 font-semibold">
                      {post.readTime}
                    </span>
                    <Link href="/blog">
                      <span className="text-purple-600 hover:text-pink-600 transition-colors flex items-center gap-1 font-semibold">
                        Read More
                        <ArrowRight size={16} />
                      </span>
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white shadow-2xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-['Playfair_Display',serif]">
              Never Miss an Update
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Subscribe to our newsletter for weekly tips, success stories, and accountability insights.
            </p>
            <div className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold"
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
