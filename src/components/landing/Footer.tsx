'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Mail, Heart, ArrowRight, Send } from 'lucide-react';

const footerLinks = {
  product: [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' }
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Our Story', href: '#story' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press Kit', href: '/press' },
    { label: 'Contact', href: '/contact' }
  ],
  resources: [
    { label: 'Blog', href: '/blog' },
    { label: 'Help Center', href: '/help' },
    { label: 'Community', href: '/community' },
    { label: 'Crisis Support', href: '/crisis' },
    { label: 'API Docs', href: '/docs' }
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'GDPR', href: '/gdpr' },
    { label: 'Security', href: '/security' }
  ]
};

const socialLinks = [
  {
    name: 'GitHub',
    icon: Github,
    href: 'https://github.com/podlink',
    color: 'hover:text-slate-900',
    gradient: 'from-slate-600 to-slate-800'
  },
  {
    name: 'Twitter',
    icon: Twitter,
    href: 'https://twitter.com/podlink',
    color: 'hover:text-blue-400',
    gradient: 'from-blue-400 to-blue-600'
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    href: 'https://linkedin.com/company/podlink',
    color: 'hover:text-blue-600',
    gradient: 'from-blue-600 to-blue-800'
  },
  {
    name: 'Email',
    icon: Mail,
    href: 'mailto:hello@podlink.io',
    color: 'hover:text-purple-600',
    gradient: 'from-purple-600 to-pink-600'
  }
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setIsSubscribed(false);
      }, 3000);
    }
  };

  return (
    <footer className="relative bg-gradient-to-b from-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [180, 0, 180],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
        />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Main Footer Content */}
        <div className="py-16 border-b border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {/* Logo */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <div className="w-6 h-6 border-2 border-white rounded-full" />
                  </div>
                  <span className="text-3xl font-bold font-['Playfair_Display',serif]">PodLink</span>
                </div>

                <p className="text-slate-400 mb-6 leading-relaxed">
                  Transform your goals into achievements with the power of accountability pods. Join thousands who are making progress every single day.
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-800/50 rounded-lg p-3 backdrop-blur-sm">
                    <div className="text-2xl font-bold text-purple-400">1,247</div>
                    <div className="text-xs text-slate-400">Active Members</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3 backdrop-blur-sm">
                    <div className="text-2xl font-bold text-pink-400">92%</div>
                    <div className="text-xs text-slate-400">Success Rate</div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex gap-3">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <motion.a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center ${social.color} transition-colors duration-300 group`}
                      >
                        <Icon size={18} />
                      </motion.a>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Links Sections */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {Object.entries(footerLinks).map(([category, links], idx) => (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                  >
                    <h3 className="text-white font-bold mb-4 capitalize font-['Playfair_Display',serif]">
                      {category}
                    </h3>
                    <ul className="space-y-3">
                      {links.map((link) => (
                        <li key={link.label}>
                          <a
                            href={link.href}
                            className="text-slate-400 hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group"
                          >
                            <span className="w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-4 transition-all duration-300" />
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="py-12 border-b border-slate-800">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-4 font-['Playfair_Display',serif]">
              Stay Updated
            </h3>
            <p className="text-slate-400 mb-6">
              Get weekly accountability tips, success stories, and exclusive updates delivered to your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="relative">
              <div className="flex gap-2 max-w-md mx-auto">
                <div className="flex-1 relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-6 py-4 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors duration-300"
                    required
                  />
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                >
                  {isSubscribed ? (
                    <>
                      <span>Subscribed!</span>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                      >
                        ✓
                      </motion.div>
                    </>
                  ) : (
                    <>
                      <span>Subscribe</span>
                      <Send size={18} />
                    </>
                  )}
                </motion.button>
              </div>
            </form>

            {isSubscribed && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-green-400 text-sm mt-4"
              >
                🎉 Thanks for subscribing! Check your inbox for a welcome email.
              </motion.p>
            )}
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-slate-400 text-sm flex items-center gap-2"
            >
              <span>© 2024 PodLink. Made with</span>
              <Heart size={14} className="text-pink-500 fill-pink-500" />
              <span>for goal achievers worldwide.</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-6 text-sm text-slate-400"
            >
              <a href="#" className="hover:text-white transition-colors duration-300">
                Status
              </a>
              <span className="w-1 h-1 bg-slate-600 rounded-full" />
              <a href="#" className="hover:text-white transition-colors duration-300">
                Changelog
              </a>
              <span className="w-1 h-1 bg-slate-600 rounded-full" />
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>All systems operational</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Easter Egg - Scroll to top */}
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-lg flex items-center justify-center z-50 hover:shadow-xl transition-all duration-300"
        >
          <ArrowRight size={20} className="rotate-[-90deg]" />
        </motion.button>
      </div>
    </footer>
  );
}
