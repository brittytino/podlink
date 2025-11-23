'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Book, Key, Terminal, CheckCircle2, Copy } from 'lucide-react';

const quickStart = `// Install the SDK
npm install @podlink/sdk

// Initialize the client
import { PodLink } from '@podlink/sdk';

const client = new PodLink({
  apiKey: 'your_api_key_here'
});

// Create a pod
const pod = await client.pods.create({
  name: 'My Accountability Pod',
  goals: ['fitness', 'productivity'],
  maxMembers: 5
});

// Add a check-in
await client.checkIns.create({
  podId: pod.id,
  status: 'completed',
  note: 'Finished my morning workout!'
});`;

const endpoints = [
  {
    method: 'GET',
    path: '/api/v1/pods',
    description: 'List all pods',
    response: '{ pods: [...], total: 10 }'
  },
  {
    method: 'POST',
    path: '/api/v1/pods',
    description: 'Create a new pod',
    response: '{ id, name, created_at, ... }'
  },
  {
    method: 'GET',
    path: '/api/v1/pods/{id}',
    description: 'Get pod details',
    response: '{ id, name, members, goals, ... }'
  },
  {
    method: 'POST',
    path: '/api/v1/check-ins',
    description: 'Create a check-in',
    response: '{ id, status, timestamp, ... }'
  },
  {
    method: 'GET',
    path: '/api/v1/goals',
    description: 'List your goals',
    response: '{ goals: [...], total: 5 }'
  },
  {
    method: 'GET',
    path: '/api/v1/leaderboard',
    description: 'Get leaderboard data',
    response: '{ rankings: [...], your_rank: 42 }'
  }
];

const sdks = [
  { name: 'JavaScript/TypeScript', icon: '📘', color: 'blue' },
  { name: 'Python', icon: '🐍', color: 'green' },
  { name: 'Ruby', icon: '💎', color: 'red' },
  { name: 'PHP', icon: '🐘', color: 'purple' },
  { name: 'Go', icon: '🔷', color: 'cyan' },
  { name: 'Java', icon: '☕', color: 'orange' }
];

export default function APIDocsPage() {
  const [copiedCode, setCopiedCode] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(quickStart);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
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
              API Documentation
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto">
              Build amazing accountability experiences with our powerful REST API. Simple, flexible, and well-documented.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <Terminal className="text-purple-600" size={32} />
              <h2 className="text-4xl font-bold text-slate-800 font-['Playfair_Display',serif]">
                Quick Start
              </h2>
            </div>
            <p className="text-lg text-slate-600">
              Get up and running in minutes with our simple SDK
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-slate-900 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-4 right-4">
              <motion.button
                onClick={copyCode}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
              >
                {copiedCode ? (
                  <>
                    <CheckCircle2 size={16} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copy
                  </>
                )}
              </motion.button>
            </div>
            
            <pre className="text-green-400 overflow-x-auto">
              <code className="text-sm md:text-base">{quickStart}</code>
            </pre>
          </motion.div>
        </div>
      </section>

      {/* Authentication */}
      <section className="pb-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Key className="text-purple-600" size={32} />
              <h2 className="text-4xl font-bold text-slate-800 font-['Playfair_Display',serif]">
                Authentication
              </h2>
            </div>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Secure your API requests with API keys. Get yours from your account dashboard.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-slate-800">Using API Keys</h3>
            <p className="text-slate-600 mb-4">
              Include your API key in the Authorization header of every request:
            </p>
            <div className="bg-slate-900 rounded-xl p-4">
              <code className="text-green-400 text-sm">
                Authorization: Bearer your_api_key_here
              </code>
            </div>
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Keep your API keys secure. Never expose them in client-side code or public repositories.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* API Endpoints */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Book className="text-purple-600" size={32} />
              <h2 className="text-4xl font-bold text-slate-800 font-['Playfair_Display',serif]">
                API Endpoints
              </h2>
            </div>
          </motion.div>

          <div className="max-w-5xl mx-auto space-y-4">
            {endpoints.map((endpoint, index) => (
              <motion.div
                key={`${endpoint.method}-${endpoint.path}`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-3">
                  <span className={`inline-block px-3 py-1 rounded-lg font-bold text-sm ${
                    endpoint.method === 'GET' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {endpoint.method}
                  </span>
                  <code className="text-purple-600 font-mono text-sm md:text-base flex-1">
                    {endpoint.path}
                  </code>
                </div>
                <p className="text-slate-600 mb-3">{endpoint.description}</p>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-xs text-slate-500 mb-1">Response:</div>
                  <code className="text-sm text-slate-700">{endpoint.response}</code>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SDKs */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Code className="text-purple-600" size={32} />
              <h2 className="text-4xl font-bold text-slate-800 font-['Playfair_Display',serif]">
                Official SDKs
              </h2>
            </div>
            <p className="text-lg text-slate-600">
              Use our officially maintained SDKs for your favorite language
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {sdks.map((sdk, index) => (
              <motion.div
                key={sdk.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -8, scale: 1.05 }}
                className="bg-white rounded-2xl p-6 shadow-lg text-center cursor-pointer"
              >
                <div className="text-4xl mb-3">{sdk.icon}</div>
                <div className="text-sm font-semibold text-slate-800">{sdk.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Rate Limits */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <h2 className="text-3xl font-bold mb-6 text-slate-800 font-['Playfair_Display',serif]">
              Rate Limits
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                <span className="font-semibold text-slate-800">Free Tier</span>
                <span className="text-slate-600">1,000 requests/day</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-purple-50 rounded-xl">
                <span className="font-semibold text-purple-800">Pro Tier</span>
                <span className="text-purple-600">10,000 requests/day</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-pink-50 rounded-xl">
                <span className="font-semibold text-pink-800">Enterprise</span>
                <span className="text-pink-600">Custom limits</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white shadow-2xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-['Playfair_Display',serif]">
              Ready to Build?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Get your API key and start integrating accountability into your application.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get API Key
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
