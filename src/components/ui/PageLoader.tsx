'use client';
import React from 'react';
import { motion } from 'framer-motion';

export default function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-slate-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        {/* Animated Logo */}
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center"
        >
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600"></div>
          </div>
        </motion.div>

        {/* Loading Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-600 font-medium"
        >
          Loading...
        </motion.p>

        {/* Progress Bar */}
        <motion.div
          className="w-48 h-1 mx-auto mt-4 bg-slate-200 rounded-full overflow-hidden"
        >
          <motion.div
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="h-full w-1/2 bg-gradient-to-r from-purple-600 to-pink-600"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
