'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Cookie, ToggleLeft, Eye, Settings } from 'lucide-react';

export default function CookiePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Cookie className="mx-auto mb-6 text-purple-600" size={64} />
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-['Playfair_Display',serif]">
              Cookie Policy
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Learn about how we use cookies and similar technologies.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-20 px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {[
            { icon: Cookie, title: 'Essential Cookies', content: 'Required for the website to function properly. These include authentication cookies and security features.' },
            { icon: Eye, title: 'Analytics Cookies', content: 'Help us understand how visitors use our site so we can improve it. We use Google Analytics with IP anonymization.' },
            { icon: Settings, title: 'Preference Cookies', content: 'Remember your settings and preferences like language, timezone, and theme choices.' },
            { icon: ToggleLeft, title: 'Your Control', content: 'You can control cookie preferences through your browser settings or our cookie consent tool. Note that disabling certain cookies may limit functionality.' }
          ].map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Icon className="text-white" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">{section.title}</h2>
                </div>
                <p className="text-slate-600 leading-relaxed">{section.content}</p>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
