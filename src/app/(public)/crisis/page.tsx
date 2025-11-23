'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Phone, MessageCircle, HeartHandshake, Wind, Brain, Shield, Clock } from 'lucide-react';

const emergencyContacts = [
  {
    country: 'United States',
    lines: [
      { name: '988 Suicide & Crisis Lifeline', number: '988', availability: '24/7' },
      { name: 'Crisis Text Line', number: 'Text HOME to 741741', availability: '24/7' },
      { name: 'SAMHSA National Helpline', number: '1-800-662-4357', availability: '24/7' }
    ]
  },
  {
    country: 'United Kingdom',
    lines: [
      { name: 'Samaritans', number: '116 123', availability: '24/7' },
      { name: 'SHOUT Crisis Text Line', number: 'Text SHOUT to 85258', availability: '24/7' }
    ]
  },
  {
    country: 'India',
    lines: [
      { name: 'AASRA', number: '91-9820466726', availability: '24/7' },
      { name: 'Vandrevala Foundation', number: '1860-2662-345', availability: '24/7' },
      { name: 'iCall', number: '91-22-25521111', availability: 'Mon-Sat, 8am-10pm' }
    ]
  },
  {
    country: 'Australia',
    lines: [
      { name: 'Lifeline', number: '13 11 14', availability: '24/7' },
      { name: 'Beyond Blue', number: '1300 22 4636', availability: '24/7' }
    ]
  }
];

const techniques = [
  {
    icon: Wind,
    title: '4-7-8 Breathing',
    description: 'Breathe in for 4, hold for 7, exhale for 8. Repeat 4 times to calm your nervous system.',
    gradient: 'from-blue-500 to-cyan-500',
    steps: [
      'Find a comfortable position',
      'Breathe in through your nose for 4 counts',
      'Hold your breath for 7 counts',
      'Exhale completely through your mouth for 8 counts',
      'Repeat the cycle 4 times'
    ]
  },
  {
    icon: Brain,
    title: '5-4-3-2-1 Grounding',
    description: 'Use your senses to anchor yourself in the present moment and reduce anxiety.',
    gradient: 'from-purple-500 to-pink-500',
    steps: [
      'Name 5 things you can see',
      'Name 4 things you can touch',
      'Name 3 things you can hear',
      'Name 2 things you can smell',
      'Name 1 thing you can taste'
    ]
  },
  {
    icon: Heart,
    title: 'Body Scan Meditation',
    description: 'Systematically relax your body from head to toe to release tension and stress.',
    gradient: 'from-pink-500 to-rose-500',
    steps: [
      'Lie down or sit comfortably',
      'Close your eyes and take deep breaths',
      'Start from your toes, notice any sensations',
      'Slowly move attention up through your body',
      'Release tension in each area as you go'
    ]
  }
];

const resources = [
  {
    title: 'Mental Health Resources',
    description: 'Comprehensive guides on managing stress, anxiety, and depression',
    link: '#'
  },
  {
    title: 'Self-Care Toolkit',
    description: 'Daily practices for maintaining emotional wellbeing',
    link: '#'
  },
  {
    title: 'Guided Meditations',
    description: 'Audio resources for relaxation and mindfulness',
    link: '#'
  },
  {
    title: 'Professional Help Directory',
    description: 'Find therapists and counselors in your area',
    link: '#'
  }
];

export default function CrisisSupportPage() {
  const [selectedCountry, setSelectedCountry] = useState('United States');
  const [expandedTechnique, setExpandedTechnique] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section with Emergency Notice */}
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Emergency Alert */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-red-50 border-2 border-red-300 rounded-2xl p-6 md:p-8 mb-12"
          >
            <div className="flex items-start gap-4">
              <Shield className="text-red-600 flex-shrink-0 mt-1" size={32} />
              <div>
                <h2 className="text-2xl font-bold text-red-800 mb-2">
                  If you're in immediate danger
                </h2>
                <p className="text-red-700 mb-4">
                  Please call emergency services (911 in US, 999 in UK, 112 in EU, 100 in India) or go to your nearest emergency room.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a href="tel:988">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg flex items-center gap-2"
                    >
                      <Phone size={20} />
                      Call 988 (US)
                    </motion.button>
                  </a>
                  <a href="sms:741741">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg flex items-center gap-2"
                    >
                      <MessageCircle size={20} />
                      Text HOME to 741741
                    </motion.button>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-['Playfair_Display',serif]">
              Crisis Support
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto">
              You're not alone. Help is available 24/7. Reach out to trained counselors who care.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Emergency Hotlines */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-800 font-['Playfair_Display',serif]">
              Emergency Hotlines
            </h2>
            <p className="text-lg text-slate-600">
              Free, confidential support available in your country
            </p>
          </motion.div>

          {/* Country Selector */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {emergencyContacts.map((contact, index) => (
              <motion.button
                key={contact.country}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedCountry(contact.country)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  selectedCountry === contact.country
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-white text-slate-700 hover:bg-slate-100 shadow'
                }`}
              >
                {contact.country}
              </motion.button>
            ))}
          </div>

          {/* Hotlines List */}
          <div className="max-w-4xl mx-auto space-y-4">
            {emergencyContacts
              .find(c => c.country === selectedCountry)
              ?.lines.map((line, index) => (
                <motion.div
                  key={line.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 mb-1">{line.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {line.availability}
                        </span>
                      </div>
                    </div>
                    <a href={`tel:${line.number.replace(/[^0-9]/g, '')}`}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2"
                      >
                        <Phone size={20} />
                        {line.number}
                      </motion.button>
                    </a>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      {/* Coping Techniques */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-800 font-['Playfair_Display',serif]">
              Immediate Coping Techniques
            </h2>
            <p className="text-lg text-slate-600">
              Evidence-based methods to help you feel calmer right now
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {techniques.map((technique, index) => {
              const Icon = technique.icon;
              const isExpanded = expandedTechnique === index;
              
              return (
                <motion.div
                  key={technique.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${technique.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="text-white" size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-800">{technique.title}</h3>
                  <p className="text-slate-600 mb-4">{technique.description}</p>
                  
                  <motion.button
                    onClick={() => setExpandedTechnique(isExpanded ? null : index)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="text-purple-600 font-semibold mb-4"
                  >
                    {isExpanded ? 'Hide Steps' : 'Show Steps'}
                  </motion.button>

                  {isExpanded && (
                    <motion.ol
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2 list-decimal list-inside text-sm text-slate-700"
                    >
                      {technique.steps.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </motion.ol>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-800 font-['Playfair_Display',serif]">
              Additional Resources
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {resources.map((resource, index) => (
              <motion.a
                key={resource.title}
                href={resource.link}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                <h3 className="text-lg font-bold text-slate-800 mb-2">{resource.title}</h3>
                <p className="text-slate-600">{resource.description}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Message of Hope */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white shadow-2xl"
          >
            <HeartHandshake className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-['Playfair_Display',serif]">
              You Matter
            </h2>
            <p className="text-lg leading-relaxed opacity-95">
              Your life has value. Your feelings are valid. It's okay to not be okay, and it's brave to ask for help. 
              Recovery is possible, and there are people who want to support you through this. You don't have to face this alone.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
