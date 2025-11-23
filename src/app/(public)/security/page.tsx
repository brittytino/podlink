'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, AlertCircle, CheckCircle2, Server } from 'lucide-react';

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Shield className="mx-auto mb-6 text-purple-600" size={64} />
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-['Playfair_Display',serif]">
              Security
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Your security is our top priority. Learn about our comprehensive security measures.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Lock, title: 'Encryption', content: 'All data encrypted with AES-256 at rest and TLS 1.3 in transit.', gradient: 'from-purple-500 to-pink-500' },
              { icon: Server, title: 'Secure Infrastructure', content: 'SOC 2 compliant data centers with 24/7 monitoring.', gradient: 'from-blue-500 to-cyan-500' },
              { icon: Eye, title: 'Access Controls', content: 'Strict role-based access with multi-factor authentication.', gradient: 'from-green-500 to-emerald-500' },
              { icon: AlertCircle, title: 'Vulnerability Scanning', content: 'Regular security audits and penetration testing.', gradient: 'from-orange-500 to-red-500' },
              { icon: CheckCircle2, title: 'Compliance', content: 'GDPR, CCPA, and SOC 2 Type II compliant.', gradient: 'from-indigo-500 to-purple-500' },
              { icon: Shield, title: 'DDoS Protection', content: 'Advanced protection against distributed attacks.', gradient: 'from-pink-500 to-rose-500' }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-2xl p-8 shadow-lg"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center mb-6`}>
                    <Icon className="text-white" size={28} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-slate-800">{item.title}</h3>
                  <p className="text-slate-600">{item.content}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="bg-slate-50 rounded-3xl p-12">
            <h2 className="text-3xl font-bold mb-6 text-slate-800 text-center">Report a Security Issue</h2>
            <p className="text-lg text-slate-600 text-center mb-8">
              If you discover a security vulnerability, please report it to{' '}
              <a href="mailto:security@podlink.io" className="text-purple-600 font-semibold hover:underline">security@podlink.io</a>
            </p>
            <p className="text-sm text-slate-500 text-center">
              We appreciate responsible disclosure and will respond within 24 hours.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
