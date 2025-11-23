'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, UserCheck, Bell } from 'lucide-react';

const sections = [
  {
    icon: Database,
    title: 'Information We Collect',
    content: [
      {
        subtitle: 'Account Information',
        text: 'When you create an account, we collect your name, email address, and password. You may optionally provide additional information like profile picture, timezone, and availability preferences.'
      },
      {
        subtitle: 'Usage Data',
        text: 'We collect information about how you use our service, including check-ins, goals, pod interactions, and feature usage. This helps us improve our service and provide personalized experiences.'
      },
      {
        subtitle: 'Device Information',
        text: 'We collect device type, operating system, browser type, IP address, and general location data to ensure security and optimize our service for your device.'
      }
    ]
  },
  {
    icon: Eye,
    title: 'How We Use Your Information',
    content: [
      {
        subtitle: 'Service Delivery',
        text: 'We use your information to provide, maintain, and improve our accountability platform, including matching you with compatible pod members and tracking your progress.'
      },
      {
        subtitle: 'Communication',
        text: 'We send you service-related emails, notifications about pod activity, and important updates. You can control notification preferences in your account settings.'
      },
      {
        subtitle: 'Analytics & Improvement',
        text: 'We analyze usage patterns to understand how people use our service, identify areas for improvement, and develop new features that benefit our community.'
      }
    ]
  },
  {
    icon: Lock,
    title: 'Data Security',
    content: [
      {
        subtitle: 'Encryption',
        text: 'All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption. We employ industry-standard security measures to protect your information.'
      },
      {
        subtitle: 'Access Controls',
        text: 'We implement strict access controls. Only authorized personnel with a legitimate business need can access user data, and all access is logged and monitored.'
      },
      {
        subtitle: 'Regular Audits',
        text: 'We conduct regular security audits and penetration testing to identify and address potential vulnerabilities before they can be exploited.'
      }
    ]
  },
  {
    icon: UserCheck,
    title: 'Your Rights',
    content: [
      {
        subtitle: 'Access & Portability',
        text: 'You have the right to access all your personal data and export it in a machine-readable format. Pro users can do this directly from their dashboard.'
      },
      {
        subtitle: 'Correction & Deletion',
        text: 'You can update or correct your information at any time. You also have the right to delete your account and all associated data permanently.'
      },
      {
        subtitle: 'Opt-Out',
        text: 'You can opt out of marketing communications and certain data collection practices. Essential service communications cannot be opted out of while your account is active.'
      }
    ]
  },
  {
    icon: Bell,
    title: 'Third-Party Sharing',
    content: [
      {
        subtitle: 'No Selling',
        text: 'We never sell your personal information to third parties. Your data is yours, and we respect your privacy.'
      },
      {
        subtitle: 'Service Providers',
        text: 'We share data with trusted service providers (hosting, analytics, email) who are contractually obligated to protect your information and use it only for specified purposes.'
      },
      {
        subtitle: 'Legal Requirements',
        text: 'We may disclose information if required by law, court order, or to protect our rights, users\' safety, or investigate fraud.'
      }
    ]
  }
];

export default function PrivacyPage() {
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
            <div className="flex items-center justify-center mb-6">
              <Shield className="text-purple-600" size={64} />
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-['Playfair_Display',serif]">
              Privacy Policy
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-4">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
            <p className="text-sm text-slate-500">
              Last updated: November 23, 2024
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Summary */}
      <section className="pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 text-white"
          >
            <h2 className="text-3xl font-bold mb-6 font-['Playfair_Display',serif]">
              Privacy at a Glance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-4xl mb-2">🔒</div>
                <div className="font-semibold mb-1">Encrypted</div>
                <div className="text-sm opacity-90">AES-256 & TLS 1.3</div>
              </div>
              <div>
                <div className="text-4xl mb-2">🚫</div>
                <div className="font-semibold mb-1">Never Sold</div>
                <div className="text-sm opacity-90">Your data stays yours</div>
              </div>
              <div>
                <div className="text-4xl mb-2">✅</div>
                <div className="font-semibold mb-1">Full Control</div>
                <div className="text-sm opacity-90">Export or delete anytime</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Detailed Sections */}
      <section className="pb-20 px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          {sections.map((section, sectionIndex) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: sectionIndex * 0.1 }}
                className="bg-white rounded-3xl p-8 shadow-lg"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Icon className="text-white" size={28} />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-800 font-['Playfair_Display',serif]">
                    {section.title}
                  </h2>
                </div>

                <div className="space-y-6">
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex}>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">
                        {item.subtitle}
                      </h3>
                      <p className="text-slate-600 leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Contact Section */}
      <section className="pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-slate-50 rounded-3xl p-12 text-center"
          >
            <h2 className="text-3xl font-bold mb-4 text-slate-800 font-['Playfair_Display',serif]">
              Questions About Privacy?
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              Our privacy team is here to help. Contact us at{' '}
              <a href="mailto:privacy@podlink.io" className="text-purple-600 font-semibold hover:underline">
                privacy@podlink.io
              </a>
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg"
                >
                  Contact Us
                </motion.button>
              </a>
              <a href="/gdpr">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-slate-800 px-6 py-3 rounded-xl font-semibold shadow-lg border-2 border-slate-200"
                >
                  GDPR Info
                </motion.button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
