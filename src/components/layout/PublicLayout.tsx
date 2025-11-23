'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Navigation from '@/components/landing/Navigation';
import Footer from '@/components/landing/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const pathname = usePathname();
  const [scrollDirection, setScrollDirection] = useState('up');
  const [lastScrollY, setLastScrollY] = useState(0);
  const [githubStars, setGithubStars] = useState(0);
  const [isStarred, setIsStarred] = useState(false);

  // Smooth scroll detection with debounce
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          if (currentScrollY > lastScrollY && currentScrollY > 100) {
            setScrollDirection('down');
          } else {
            setScrollDirection('up');
          }
          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Animate github stars on mount
  useEffect(() => {
    let start = 0;
    const end = 1247;
    const duration = 2000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setGithubStars(end);
        clearInterval(timer);
      } else {
        setGithubStars(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, []);

  // Reset scroll position on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-slate-50">
      {/* Navigation */}
      <Navigation
        scrollDirection={scrollDirection}
        githubStars={githubStars}
        isStarred={isStarred}
        setIsStarred={setIsStarred}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs />

      {/* Main Content with smooth page transitions */}
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ 
            duration: 0.4,
            ease: [0.25, 0.1, 0.25, 1.0]
          }}
          className="flex-grow"
        >
          {children}
        </motion.main>
      </AnimatePresence>

      {/* Footer */}
      <Footer />

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
}
