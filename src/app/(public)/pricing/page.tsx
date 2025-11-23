'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Crown, Rocket } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    name: 'Free',
    icon: Sparkles,
    price: { monthly: 0, yearly: 0 },
    description: 'Perfect for getting started with accountability',
    gradient: 'from-slate-600 to-slate-800',
    features: [
      'Join 1 accountability pod',
      'Daily check-ins',
      'Basic progress tracking',
      'Community access',
      'Mobile app access',
      '7-day goal history'
    ],
    limitations: [
      'Limited to 3 active goals',
      'Basic analytics only',
      'Standard support'
    ],
    cta: 'Get Started',
    popular: false
  },
  {
    name: 'Pro',
    icon: Crown,
    price: { monthly: 9, yearly: 90 },
    description: 'For serious goal achievers who want more',
    gradient: 'from-purple-600 to-pink-600',
    features: [
      'Join up to 5 pods',
      'Unlimited active goals',
      'Advanced analytics & insights',
      'Priority pod matching',
      'Custom goal categories',
      'Unlimited goal history',
      'Export your data',
      'Ad-free experience',
      'Priority support'
    ],
    limitations: [],
    cta: 'Upgrade to Pro',
    popular: true
  },
  {
    name: 'Team',
    icon: Rocket,
    price: { monthly: 29, yearly: 290 },
    description: 'Perfect for organizations and teams',
    gradient: 'from-blue-600 to-cyan-600',
    features: [
      'Everything in Pro',
      'Private team pods (up to 20 members)',
      'Team analytics dashboard',
      'Custom branding',
      'Admin controls',
      'Dedicated account manager',
      'API access',
      'SSO integration',
      'Custom integrations',
      '24/7 priority support'
    ],
    limitations: [],
    cta: 'Contact Sales',
    popular: false
  }
];

const faqs = [
  {
    q: 'Can I switch plans anytime?',
    a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.'
  },
  {
    q: 'What happens to my data if I downgrade?',
    a: 'Your data is always safe. If you downgrade, some features may be limited, but your historical data remains accessible.'
  },
  {
    q: 'Is there a discount for yearly plans?',
    a: 'Yes! Save 17% when you choose yearly billing. That\'s like getting 2 months free!'
  },
  {
    q: 'Can I try Pro before committing?',
    a: 'Absolutely! We offer a 14-day free trial of Pro with no credit card required.'
  }
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

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
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-8">
              Choose the perfect plan for your accountability journey. No hidden fees, cancel anytime.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-12">
              <span className={`text-lg ${billingCycle === 'monthly' ? 'text-slate-800 font-semibold' : 'text-slate-500'}`}>
                Monthly
              </span>
              <motion.button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className="relative w-16 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full p-1"
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ x: billingCycle === 'yearly' ? 32 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="w-6 h-6 bg-white rounded-full shadow-lg"
                />
              </motion.button>
              <span className={`text-lg ${billingCycle === 'yearly' ? 'text-slate-800 font-semibold' : 'text-slate-500'}`}>
                Yearly
              </span>
              {billingCycle === 'yearly' && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-sm text-green-600 font-semibold bg-green-100 px-3 py-1 rounded-full"
                >
                  Save 17%
                </motion.span>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              const price = plan.price[billingCycle];
              
              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className={`relative bg-white rounded-3xl p-8 shadow-xl ${
                    plan.popular ? 'ring-4 ring-purple-500 ring-opacity-50' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className={`w-14 h-14 bg-gradient-to-br ${plan.gradient} rounded-xl flex items-center justify-center mb-6 shadow-lg`}>
                    <Icon className="text-white" size={28} />
                  </div>

                  <h3 className="text-2xl font-bold mb-2 text-slate-800">{plan.name}</h3>
                  <p className="text-slate-600 mb-6">{plan.description}</p>

                  <div className="mb-6">
                    <span className="text-5xl font-bold text-slate-800">${price}</span>
                    <span className="text-slate-500">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                  </div>

                  <Link href={plan.name === 'Team' ? '/contact' : '/register'}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-full py-4 rounded-xl font-semibold shadow-lg mb-8 ${
                        plan.popular
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                          : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                      }`}
                    >
                      {plan.cta}
                    </motion.button>
                  </Link>

                  <ul className="space-y-4 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="text-green-500 flex-shrink-0 mt-1" size={20} />
                        <span className="text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.limitations.length > 0 && (
                    <div className="pt-6 border-t border-slate-200">
                      <p className="text-sm text-slate-500 mb-2">Limitations:</p>
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation, idx) => (
                          <li key={idx} className="text-sm text-slate-500 flex items-start gap-2">
                            <span className="text-slate-400">•</span>
                            {limitation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 text-slate-800 font-['Playfair_Display',serif]">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <h3 className="text-lg font-bold text-slate-800 mb-2">{faq.q}</h3>
                <p className="text-slate-600">{faq.a}</p>
              </motion.div>
            ))}
          </div>
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
              Our team is here to help you find the perfect plan for your needs.
            </p>
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Contact Sales
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
