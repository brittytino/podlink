'use client';
import React, { useEffect, useState } from 'react';

// Import modular components
import Navigation from './landing/Navigation';
import HeroSection from './landing/HeroSection';
import OriginStory from './landing/OriginStory';
import ProblemSolution from './landing/ProblemSolution';
import FeaturesSection from './landing/FeaturesSection';
import HowItWorksSection from './landing/HowItWorksSection';
import TestimonialsSection from './landing/TestimonialsSection';
import Footer from './landing/Footer';

export default function LandingPage() {
  const [scrollDirection, setScrollDirection] = useState('up');
  const [statsCount, setStatsCount] = useState({ pods: 0, members: 0, goals: 0, streak: 0 });
  const [githubStars, setGithubStars] = useState(0);
  const [isStarred, setIsStarred] = useState(false);
  const [activePill, setActivePill] = useState(0);

  const pillMessages = [
    '🎯 Join active members achieving their goals',
    '🔥 Daily accountability with AI-powered matching',
    '⭐ Real-time chat & crisis support',
    '💪 Built for mental health and personal growth'
  ];

  // Animated stats counter - realistic numbers
  useEffect(() => {
    const targetStats = { pods: 45, members: 180, goals: 95, streak: 67 };
    const duration = 2000;
    const steps = 60;
    const increment = {
      pods: targetStats.pods / steps,
      members: targetStats.members / steps,
      goals: targetStats.goals / steps,
      streak: targetStats.streak / steps
    };

    let currentStep = 0;
    const timer = setInterval(() => {
      if (currentStep < steps) {
        setStatsCount({
          pods: Math.floor(increment.pods * currentStep),
          members: Math.floor(increment.members * currentStep),
          goals: Math.floor(increment.goals * currentStep),
          streak: Math.floor(increment.streak * currentStep)
        });
        currentStep++;
      } else {
        setStatsCount(targetStats);
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, []);

  // Rotating pill messages
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePill(prev => (prev + 1) % pillMessages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [pillMessages.length]);

  // Scroll direction detection
  useEffect(() => {
    let lastScrollY = 0;
    
    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      if (Math.abs(scrollY - lastScrollY) > 5) {
        const direction = scrollY > lastScrollY ? 'down' : 'up';
        setScrollDirection(direction);
        lastScrollY = scrollY <= 0 ? 0 : scrollY;
      }
    };

    const handleScroll = () => {
      requestAnimationFrame(updateScrollDirection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-['Inter',sans-serif] overflow-x-hidden antialiased">
      {/* Navigation */}
      <Navigation 
        scrollDirection={scrollDirection}
        githubStars={githubStars}
        isStarred={isStarred}
        setIsStarred={setIsStarred}
      />

      {/* Main Content */}
      <main className="pt-20">
        {/* Hero Section */}
        <HeroSection
          statsCount={statsCount}
          activePill={activePill}
          pillMessages={pillMessages}
        />

        {/* Origin Story - The Reddit/LinkedIn Journey */}
        <OriginStory />

        {/* Problem & Solution */}
        <ProblemSolution />

        {/* Features Section */}
        <FeaturesSection />

        {/* How It Works */}
        <HowItWorksSection />

        {/* Testimonials */}
        <TestimonialsSection />
      </main>

      {/* Footer */}
      <Footer />      {/* Global Styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        :global(body) {
          font-family: 'Inter', sans-serif;
          scroll-behavior: smooth;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        :global(h1, h2, h3, h4, h5, h6) {
          font-family: 'Playfair Display', serif;
          letter-spacing: -0.02em;
        }

        /* Custom scrollbar */}
        :global(::-webkit-scrollbar) {
          width: 12px;
        }

        :global(::-webkit-scrollbar-track) {
          background: #f1f5f9;
          border-radius: 10px;
        }

        :global(::-webkit-scrollbar-thumb) {
          background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
          border-radius: 10px;
          border: 2px solid #f1f5f9;
        }

        :global(::-webkit-scrollbar-thumb:hover) {
          background: linear-gradient(180deg, #764ba2 0%, #667eea 100%);
        }

        /* Text selection styling */}
        :global(::selection) {
          background-color: #667eea;
          color: white;
        }

        :global(::-moz-selection) {
          background-color: #667eea;
          color: white;
        }

        /* Focus states for accessibility */}
        :global(*:focus-visible) {
          outline: 3px solid #667eea;
          outline-offset: 3px;
          border-radius: 8px;
        }

        /* Reduced motion for accessibility */}
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </div>
  );
}
