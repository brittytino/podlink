'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Github, Users2, Menu, X, Star, GitFork } from 'lucide-react';

interface NavigationProps {
  scrollDirection: string;
  githubStars: number;
  isStarred: boolean;
  setIsStarred: (value: boolean) => void;
}

export default function Navigation({ scrollDirection, githubStars, isStarred, setIsStarred }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [realGithubStars, setRealGithubStars] = useState<number>(githubStars);
  const [realGithubForks, setRealGithubForks] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#story', label: 'Story' },
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#testimonials', label: 'Testimonials' },
  ];

  // Fetch real GitHub stars and forks
  useEffect(() => {
    const fetchGitHubStats = async () => {
      try {
        const response = await fetch('https://api.github.com/repos/brittytino/podlink', {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setRealGithubStars(data.stargazers_count);
          setRealGithubForks(data.forks_count);
        } else {
          // Fallback to animated value
          setRealGithubStars(githubStars);
          setRealGithubForks(0);
        }
      } catch (error) {
        console.log('Using fallback GitHub stats');
        setRealGithubStars(githubStars);
        setRealGithubForks(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGitHubStats();
  }, [githubStars]);

  return (
    <>
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ 
          y: scrollDirection === 'down' ? -100 : 0,
          opacity: 1
        }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <motion.div 
              whileHover={{ rotate: 5 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-lg blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative w-9 h-9 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-lg flex items-center justify-center">
                <Users2 size={20} className="text-white" />
              </div>
            </motion.div>
            <div className="text-xl font-['Playfair_Display',serif] font-bold">
              <span className="bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">Pod</span>
              <span className="text-slate-900">Link</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-[#667eea] transition-colors relative group"
              >
                {link.label}
                <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-[#667eea] to-[#764ba2] scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </a>
            ))}
          </div>

          {/* Right Side - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {/* GitHub Stats Button with Star and Fork Count */}
            <motion.a 
              href="https://github.com/brittytino/podlink" 
              target="_blank" 
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group flex items-center gap-2.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium text-sm transition-all duration-300 shadow-sm hover:shadow-md"
              onClick={(e) => {
                setIsStarred(!isStarred);
              }}
            >
              <Github size={16} className="flex-shrink-0" />
              
              {/* Stars */}
              <div className="flex items-center gap-1.5">
                <motion.div
                  animate={isStarred ? { rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <Star 
                    size={13} 
                    className={`${isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-slate-400'} transition-all`} 
                  />
                </motion.div>
                {isLoading ? (
                  <motion.span 
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-xs font-semibold w-6 text-center"
                  >
                    ...
                  </motion.span>
                ) : (
                  <motion.span 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs font-semibold"
                  >
                    {realGithubStars.toLocaleString()}
                  </motion.span>
                )}
              </div>

              {/* Separator */}
              <div className="w-px h-4 bg-slate-700 group-hover:bg-slate-600"></div>

              {/* Forks */}
              <div className="flex items-center gap-1.5">
                <GitFork size={13} className="text-slate-400" />
                {isLoading ? (
                  <motion.span 
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-xs font-semibold w-6 text-center"
                  >
                    ...
                  </motion.span>
                ) : (
                  <motion.span 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-xs font-semibold"
                  >
                    {realGithubForks.toLocaleString()}
                  </motion.span>
                )}
              </div>
            </motion.a>

            <Link href="/login" className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-[#667eea] transition-colors">
              Login
            </Link>

            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-5 py-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-lg font-medium text-sm shadow-md hover:shadow-lg transition-all duration-300"
              >
                Get Started
              </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-16 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-lg overflow-hidden"
          >
            <div className="px-6 py-4 space-y-2">
              {navLinks.map((link, idx) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
              
              <div className="pt-4 border-t border-slate-200 space-y-2">
                <motion.a
                  href="https://github.com/brittytino/podlink"
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.05 }}
                  className="flex items-center justify-between px-4 py-3 bg-slate-900 text-white rounded-lg font-medium text-sm"
                >
                  <div className="flex items-center gap-2">
                    <Github size={18} />
                    <span>GitHub</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Stars */}
                    <div className="flex items-center gap-1 px-2 py-1 bg-slate-800 rounded-md">
                      <Star size={12} className={isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-slate-400'} />
                      <span className="text-xs font-semibold">
                        {isLoading ? '...' : realGithubStars.toLocaleString()}
                      </span>
                    </div>
                    {/* Forks */}
                    <div className="flex items-center gap-1 px-2 py-1 bg-slate-800 rounded-md">
                      <GitFork size={12} className="text-slate-400" />
                      <span className="text-xs font-semibold">
                        {isLoading ? '...' : realGithubForks.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </motion.a>
                
                <Link href="/login">
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (navLinks.length + 1) * 0.05 }}
                    className="w-full px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors text-center"
                  >
                    Login
                  </motion.button>
                </Link>
                
                <Link href="/register">
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (navLinks.length + 2) * 0.05 }}
                    className="w-full px-4 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-lg font-medium text-sm"
                  >
                    Get Started Free
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
