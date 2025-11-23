'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Scale, Shield, AlertCircle } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Scale className="mx-auto mb-6 text-purple-600" size={64} />
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-['Playfair_Display',serif]">
              Terms of Service
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-4">
              Please read these terms carefully before using our service.
            </p>
            <p className="text-sm text-slate-500">Last updated: November 23, 2024</p>
          </motion.div>
        </div>
      </section>

      <section className="pb-20 px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {[
            { title: '1. Acceptance of Terms', content: 'By accessing and using PodLink, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this service.' },
            { title: '2. User Accounts', content: 'You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate information and keep it updated. You are responsible for all activities under your account.' },
            { title: '3. Acceptable Use', content: 'You agree not to use the service for any unlawful purpose or in any way that could damage, disable, or impair the service. Harassment, hate speech, and abusive behavior are strictly prohibited.' },
            { title: '4. Content Ownership', content: 'You retain ownership of content you post. By posting content, you grant us a license to use, display, and distribute it as necessary to provide the service.' },
            { title: '5. Privacy', content: 'Your use of the service is also governed by our Privacy Policy. Please review it to understand our practices.' },
            { title: '6. Termination', content: 'We reserve the right to terminate or suspend your account at any time for violations of these terms. You may terminate your account at any time from your account settings.' },
            { title: '7. Disclaimer', content: 'The service is provided "as is" without warranties of any kind. We do not guarantee uninterrupted or error-free service.' },
            { title: '8. Limitation of Liability', content: 'We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.' }
          ].map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-slate-800 mb-4">{section.title}</h2>
              <p className="text-slate-600 leading-relaxed">{section.content}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="bg-slate-50 rounded-3xl p-12 text-center">
            <h2 className="text-3xl font-bold mb-4 text-slate-800">Questions?</h2>
            <p className="text-lg text-slate-600 mb-8">
              Contact our legal team at <a href="mailto:legal@podlink.io" className="text-purple-600 font-semibold hover:underline">legal@podlink.io</a>
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
