'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Shield, UserCheck, Download, Trash2, Lock } from 'lucide-react';

export default function GDPRPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Globe className="mx-auto mb-6 text-purple-600" size={64} />
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-['Playfair_Display',serif]">
              GDPR Compliance
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We're committed to protecting the rights of EU citizens under the General Data Protection Regulation.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {[
              { icon: UserCheck, title: 'Right to Access', content: 'Request a copy of all personal data we hold about you.' },
              { icon: Download, title: 'Data Portability', content: 'Export your data in a machine-readable format.' },
              { icon: Trash2, title: 'Right to Erasure', content: 'Request deletion of your personal data ("right to be forgotten").' },
              { icon: Lock, title: 'Data Protection', content: 'We implement appropriate security measures to protect your data.' }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-slate-800">{item.title}</h3>
                  <p className="text-slate-600">{item.content}</p>
                </motion.div>
              );
            })}
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Exercise Your Rights</h2>
            <p className="text-lg mb-8 opacity-90">
              To exercise any of your GDPR rights, contact our Data Protection Officer at{' '}
              <a href="mailto:dpo@podlink.io" className="underline font-semibold">dpo@podlink.io</a>
            </p>
            <a href="/contact">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold shadow-lg">
                Contact DPO
              </motion.button>
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
