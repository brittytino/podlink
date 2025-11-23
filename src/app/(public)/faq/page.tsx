'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, HelpCircle, Users, Lock, CreditCard, Zap } from 'lucide-react';
import Link from 'next/link';

const categories = [
  { id: 'general', name: 'General', icon: HelpCircle },
  { id: 'pods', name: 'Pods & Matching', icon: Users },
  { id: 'privacy', name: 'Privacy & Security', icon: Lock },
  { id: 'billing', name: 'Billing', icon: CreditCard },
  { id: 'features', name: 'Features', icon: Zap }
];

const faqs = [
  {
    category: 'general',
    question: 'What is an accountability pod?',
    answer: 'An accountability pod is a small group of 3-5 like-minded individuals who support each other in achieving their goals. Members check in daily, share progress, and provide encouragement and constructive feedback.'
  },
  {
    category: 'general',
    question: 'How is this different from other goal-tracking apps?',
    answer: 'Unlike solo goal-tracking apps, we focus on the power of peer accountability. Research shows you\'re 95% more likely to achieve your goals when you have an accountability partner. We combine this with smart matching, daily check-ins, and community support.'
  },
  {
    category: 'pods',
    question: 'How does pod matching work?',
    answer: 'Our AI-powered algorithm matches you based on your goals, timezone, availability, and commitment level. We analyze hundreds of data points to ensure you\'re paired with compatible pod members who can support your specific journey.'
  },
  {
    category: 'pods',
    question: 'Can I join multiple pods?',
    answer: 'Yes! Free users can join 1 pod, while Pro users can join up to 5 pods. This allows you to have dedicated accountability for different areas of your life (fitness, career, learning, etc.).'
  },
  {
    category: 'pods',
    question: 'What if my pod isn\'t a good fit?',
    answer: 'You can leave a pod at any time and request to be matched with a new one. We also continuously improve our matching algorithm based on successful pod dynamics.'
  },
  {
    category: 'pods',
    question: 'Can I create a private pod with friends?',
    answer: 'Absolutely! Pro and Team users can create private, invite-only pods. This is perfect for existing friend groups, coworkers, or study groups who want to use our platform together.'
  },
  {
    category: 'privacy',
    question: 'Is my data secure?',
    answer: 'Yes. We use enterprise-grade encryption (AES-256) for data at rest and TLS 1.3 for data in transit. Your data is stored in secure, SOC 2 compliant data centers. We never sell your personal information.'
  },
  {
    category: 'privacy',
    question: 'Who can see my check-ins and progress?',
    answer: 'Only members of your pod can see your check-ins and progress. You have complete control over what you share. Your data is never made public without your explicit consent.'
  },
  {
    category: 'privacy',
    question: 'Can I export or delete my data?',
    answer: 'Yes! You can export all your data at any time (Pro feature) and you have the right to delete your account and all associated data whenever you want, in compliance with GDPR.'
  },
  {
    category: 'billing',
    question: 'Is there a free trial for Pro?',
    answer: 'Yes! We offer a 14-day free trial of Pro features. No credit card required. You can cancel anytime during the trial with no charges.'
  },
  {
    category: 'billing',
    question: 'Can I cancel my subscription anytime?',
    answer: 'Yes. You can cancel your subscription at any time from your account settings. Your Pro features will remain active until the end of your billing period.'
  },
  {
    category: 'billing',
    question: 'Do you offer refunds?',
    answer: 'We offer a 30-day money-back guarantee for annual subscriptions. If you\'re not satisfied within the first 30 days, contact support for a full refund.'
  },
  {
    category: 'billing',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express), debit cards, and PayPal. Enterprise customers can also pay via invoice.'
  },
  {
    category: 'features',
    question: 'What happens if I miss a check-in?',
    answer: 'Missing a check-in will break your streak, and your pod members will be notified. However, life happens! You can get back on track the next day. We also send reminder notifications to help you stay consistent.'
  },
  {
    category: 'features',
    question: 'Can I use the app offline?',
    answer: 'You can view your past data offline, but posting check-ins and communicating with your pod requires an internet connection. Your offline actions will sync when you reconnect.'
  },
  {
    category: 'features',
    question: 'Is there a mobile app?',
    answer: 'Yes! We have native iOS and Android apps with all the features of the web version. Download from the App Store or Google Play.'
  },
  {
    category: 'features',
    question: 'How does the crisis support feature work?',
    answer: 'If you or a pod member are in crisis, you can access our crisis toolkit which includes emergency hotlines, breathing exercises, and grounding techniques. Pod members can also be notified if someone needs urgent support.'
  },
  {
    category: 'general',
    question: 'How long should I commit to a pod?',
    answer: 'We recommend committing to at least 30 days to see meaningful results. Research shows it takes 21-66 days to form a habit. Many of our successful users stay with their pods for 6+ months.'
  },
  {
    category: 'features',
    question: 'Can I set recurring goals?',
    answer: 'Yes! You can set daily, weekly, or monthly recurring goals. Perfect for habits like "exercise 3x per week" or "read for 30 minutes daily".'
  },
  {
    category: 'billing',
    question: 'Do you offer student or non-profit discounts?',
    answer: 'Yes! We offer 50% off Pro subscriptions for students (with valid .edu email) and 30% off for registered non-profit organizations. Contact support to apply.'
  }
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('general');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
              Frequently Asked Questions
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-8">
              Everything you need to know about accountability pods and how we work.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Search for answers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-lg"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setActiveCategory(category.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeCategory === category.id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'bg-white text-slate-700 hover:bg-slate-100 shadow'
                  }`}
                >
                  <Icon size={18} />
                  {category.name}
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 text-lg">No questions found matching your search.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors duration-300"
                  >
                    <span className="text-lg font-semibold text-slate-800 pr-4">
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: expandedIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="text-purple-600 flex-shrink-0" size={24} />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {expandedIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5 text-slate-600 leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
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
              Still Have Questions?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Our support team is here to help you 24/7.
            </p>
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Contact Support
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
