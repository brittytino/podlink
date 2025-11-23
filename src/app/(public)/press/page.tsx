'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Image, FileText, Palette, ExternalLink } from 'lucide-react';

const assets = {
  logos: [
    { name: 'Logo - Full Color (PNG)', size: '1024x1024', format: 'PNG', file: 'podlink-logo-color.png' },
    { name: 'Logo - White (PNG)', size: '1024x1024', format: 'PNG', file: 'podlink-logo-white.png' },
    { name: 'Logo - Black (PNG)', size: '1024x1024', format: 'PNG', file: 'podlink-logo-black.png' },
    { name: 'Logo - Full Color (SVG)', size: 'Vector', format: 'SVG', file: 'podlink-logo-color.svg' }
  ],
  screenshots: [
    { name: 'Dashboard View', size: '1920x1080', format: 'PNG', file: 'dashboard.png' },
    { name: 'Pod Chat Interface', size: '1920x1080', format: 'PNG', file: 'pod-chat.png' },
    { name: 'Progress Analytics', size: '1920x1080', format: 'PNG', file: 'analytics.png' },
    { name: 'Mobile App', size: '1080x1920', format: 'PNG', file: 'mobile-app.png' }
  ],
  brandColors: [
    { name: 'Primary Purple', hex: '#667eea', rgb: 'RGB(102, 126, 234)' },
    { name: 'Primary Pink', hex: '#764ba2', rgb: 'RGB(118, 75, 162)' },
    { name: 'Accent Blue', hex: '#4299e1', rgb: 'RGB(66, 153, 225)' },
    { name: 'Success Green', hex: '#48bb78', rgb: 'RGB(72, 187, 120)' }
  ]
};

const companyInfo = {
  founded: '2023',
  headquarters: 'San Francisco, CA',
  employees: '25-50',
  funding: 'Seed Round, $3M',
  mission: 'To empower individuals worldwide to achieve their goals through meaningful accountability partnerships.'
};

const stats = [
  { label: 'Active Users', value: '1,247+' },
  { label: 'Accountability Pods', value: '150+' },
  { label: 'Goals Achieved', value: '3,847+' },
  { label: 'Success Rate', value: '92%' }
];

export default function PressKitPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

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
              Press Kit
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto">
              Download our brand assets, logos, screenshots, and company information for media coverage.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg text-center"
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Information */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl"
          >
            <h2 className="text-3xl font-bold mb-8 text-slate-800 font-['Playfair_Display',serif]">
              Company Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {Object.entries(companyInfo).map(([key, value]) => (
                <div key={key}>
                  <div className="text-sm text-slate-500 mb-1 capitalize">{key}</div>
                  <div className="text-lg font-semibold text-slate-800">{value}</div>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-slate-200">
              <h3 className="text-lg font-bold mb-3 text-slate-800">Media Contact</h3>
              <p className="text-slate-600">
                <strong>Email:</strong> <a href="mailto:press@podlink.io" className="text-purple-600 hover:underline">press@podlink.io</a><br />
                <strong>Phone:</strong> <a href="tel:+1234567890" className="text-purple-600 hover:underline">+1 (234) 567-890</a>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Brand Colors */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-8">
              <Palette className="text-purple-600" size={32} />
              <h2 className="text-3xl font-bold text-slate-800 font-['Playfair_Display',serif]">
                Brand Colors
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {assets.brandColors.map((color, index) => (
                <motion.div
                  key={color.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg"
                >
                  <div
                    className="w-full h-32 rounded-xl mb-4 shadow-inner"
                    style={{ backgroundColor: color.hex }}
                  />
                  <h3 className="font-bold text-slate-800 mb-2">{color.name}</h3>
                  <div className="space-y-1">
                    <button
                      onClick={() => copyToClipboard(color.hex, color.name + '-hex')}
                      className="text-sm text-slate-600 hover:text-purple-600 transition-colors w-full text-left"
                    >
                      {copied === color.name + '-hex' ? '✓ Copied!' : `HEX: ${color.hex}`}
                    </button>
                    <button
                      onClick={() => copyToClipboard(color.rgb, color.name + '-rgb')}
                      className="text-sm text-slate-600 hover:text-purple-600 transition-colors w-full text-left"
                    >
                      {copied === color.name + '-rgb' ? '✓ Copied!' : color.rgb}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Logos */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-8">
              <Image className="text-purple-600" size={32} />
              <h2 className="text-3xl font-bold text-slate-800 font-['Playfair_Display',serif]">
                Logos
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {assets.logos.map((logo, index) => (
                <motion.div
                  key={logo.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg"
                >
                  <div className="bg-slate-100 rounded-xl h-48 mb-4 flex items-center justify-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-white rounded-full" />
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">{logo.name}</h3>
                  <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
                    <span>{logo.size}</span>
                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded font-semibold">
                      {logo.format}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                  >
                    <Download size={18} />
                    Download
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Screenshots */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-8">
              <FileText className="text-purple-600" size={32} />
              <h2 className="text-3xl font-bold text-slate-800 font-['Playfair_Display',serif]">
                Product Screenshots
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {assets.screenshots.map((screenshot, index) => (
                <motion.div
                  key={screenshot.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg"
                >
                  <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl h-48 mb-4 flex items-center justify-center">
                    <span className="text-slate-400">Preview</span>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">{screenshot.name}</h3>
                  <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
                    <span>{screenshot.size}</span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-semibold">
                      {screenshot.format}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                  >
                    <Download size={18} />
                    Download
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Download All */}
      <section className="pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white shadow-2xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-['Playfair_Display',serif]">
              Download Complete Press Kit
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Get all logos, screenshots, and brand assets in one convenient package.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center gap-2"
            >
              <Download size={20} />
              Download All Assets (ZIP)
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
