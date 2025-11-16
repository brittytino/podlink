'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trophy, Flag, Users2, Menu, X, ArrowRight, Target } from 'lucide-react';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollDirection, setScrollDirection] = useState('up');
  const [animatedWord, setAnimatedWord] = useState('accountability');
  const [isVisible, setIsVisible] = useState({});

  const words = ['accountability', 'habits', 'goals', 'growth', 'community', 'transformation', 'success'];

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting
          }));
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-reveal]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedWord(prev => {
        const currentIndex = words.indexOf(prev);
        return words[(currentIndex + 1) % words.length];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const weeklySchedule = [
    { day: 'Monday', exercise: 'Set Weekly Goals & Pod Check-in', time: 'Flexible' },
    { day: 'Tuesday', exercise: 'Daily Habit Tracking', time: 'Your Choice' },
    { day: 'Wednesday', exercise: 'Mid-week Pod Accountability', time: 'Pod Schedule' },
    { day: 'Thursday', exercise: 'Progress Reflection & Journaling', time: 'Evening' },
    { day: 'Friday', exercise: 'Weekly Achievement Review', time: 'End of Day' }
  ];

  const lastActivities = [
    { exercise: 'Morning Habit Check-in', duration: '5 min' },
    { exercise: 'Pod Encouragement Message', duration: '10 min' },
    { exercise: 'Goal Progress Update', duration: '15 min' },
    { exercise: 'Peer Support Session', duration: '25 min' },
    { exercise: 'Achievement Badge Earned', duration: '2 min' }
  ];

  return (
    <div className="min-h-screen bg-black text-white font-['Oswald',sans-serif] overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 bg-black transition-transform duration-400 ${scrollDirection === 'down' ? '-translate-y-full' : 'translate-y-0'}`}>
        <div className="max-w-[1600px] mx-auto px-4 h-24 flex items-center justify-between">
          <div className="text-4xl font-['Bebas_Neue',sans-serif] font-bold">
            <span className="text-[#ff5370]">Pod</span>Link
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-lg font-medium hover:text-[#ff5370] transition-colors relative group">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#ff5370] group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#schedules" className="text-lg font-medium hover:text-[#ff5370] transition-colors relative group">
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#ff5370] group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#plans" className="text-lg font-medium hover:text-[#ff5370] transition-colors relative group">
              Community
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#ff5370] group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#about" className="text-lg font-medium hover:text-[#ff5370] transition-colors relative group">
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#ff5370] group-hover:w-full transition-all duration-300"></span>
            </a>
            <Link href="/login" className="text-lg font-medium hover:text-[#ff5370] transition-colors">
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-900 rounded-lg transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-black z-40 flex flex-col pt-24 px-6 gap-8">
            <div className="flex justify-between items-center border-b border-white pb-4 -mt-8">
              <div className="text-4xl font-['Bebas_Neue',sans-serif] font-bold">
                <span className="text-[#ff5370]">Pod</span>Link
              </div>
              <button onClick={() => setIsMenuOpen(false)} className="p-2">
                <X size={24} />
              </button>
            </div>
            <a href="#home" onClick={() => setIsMenuOpen(false)} className="text-2xl font-medium hover:text-[#ff5370] transition-colors px-4">Home</a>
            <a href="#schedules" onClick={() => setIsMenuOpen(false)} className="text-2xl font-medium hover:text-[#ff5370] transition-colors px-4">Features</a>
            <a href="#plans" onClick={() => setIsMenuOpen(false)} className="text-2xl font-medium hover:text-[#ff5370] transition-colors px-4">Community</a>
            <a href="#about" onClick={() => setIsMenuOpen(false)} className="text-2xl font-medium hover:text-[#ff5370] transition-colors px-4">About</a>
            <Link href="/login" onClick={() => setIsMenuOpen(false)} className="text-2xl font-medium hover:text-[#ff5370] transition-colors px-4 text-left">
              Login
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative mt-24">
        <div className="relative h-[calc(100vh-6rem)] bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center overflow-hidden">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute top-1/5 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float-delayed"></div>
            <div className="absolute bottom-1/4 right-1/3 w-56 h-56 bg-white/10 rounded-full blur-3xl animate-float"></div>
          </div>

          <div className="relative z-10 text-center px-4">
            <h1 className="font-['Bebas_Neue',sans-serif] text-7xl md:text-9xl uppercase mb-8 animate-fade-in">
              Good Morning, Goal Achiever
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              Transform your habits with accountability partners who care about your success
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="inline-flex items-center gap-2 bg-[#ff5370] hover:bg-white hover:text-[#ff5370] text-white px-8 py-4 rounded-lg text-xl font-bold uppercase transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#ff5370]/30">
                JOIN PODLINK <ArrowRight size={20} />
              </Link>
              <a href="#discover" className="inline-flex items-center gap-2 border-2 border-white hover:bg-white hover:text-[#667eea] text-white px-8 py-4 rounded-lg text-xl font-bold uppercase transition-all duration-300 hover:-translate-y-1">
                DISCOVER MORE
              </a>
            </div>
          </div>
        </div>

        {/* Fold Section */}
        <div id="discover" className="bg-white py-20 px-6">
          <div 
            id="fold-text"
            data-reveal
            className={`max-w-4xl mx-auto text-center transition-all duration-700 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
          >
            <p className="text-black text-3xl md:text-4xl leading-relaxed">
              It's a new day,{' '}
              <span className="text-[#ff5370] font-semibold">
                a new opportunity to build unbreakable habits.
              </span>{' '}
              Connect with like-minded accountability partners in small pods. Share your goals, track progress together, and celebrate victories as a community.
            </p>
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section id="schedules" className="bg-white py-20 px-6">
        <div 
          id="schedule-content"
          data-reveal
          className={`max-w-7xl mx-auto transition-all duration-700  ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
        >
          <div className="grid md:grid-cols-2 gap-12">
            {/* Weekly Schedule */}
            <div className="flex flex-col items-center gap-4">
              <h2 className="font-['Bebas_Neue',sans-serif] text-5xl text-[#ff5370] uppercase">How PodLink Works</h2>
              <div className="w-full border-4 border-black rounded-lg overflow-hidden bg-white">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-800">
                      <th className="text-white text-left p-4 font-semibold">Day</th>
                      <th className="text-white text-left p-4 font-semibold">Activity</th>
                      <th className="text-white text-left p-4 font-semibold">When</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weeklySchedule.map((item, i) => (
                      <tr key={i} className="border-b border-gray-200 hover:bg-white hover:text-[#ff5370] transition-colors cursor-pointer">
                        <td className="text-black p-4 font-semibold">{item.day}</td>
                        <td className="text-black p-4">{item.exercise}</td>
                        <td className="text-black p-4">{item.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="flex flex-col items-center gap-4">
              <h2 className="font-['Bebas_Neue',sans-serif] text-5xl text-[#ff5370] uppercase">Community Activities</h2>
              <div className="w-full border-4 border-black rounded-lg overflow-hidden bg-white">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-800">
                      <th className="text-white text-left p-4 font-semibold">Activity Type</th>
                      <th className="text-white text-left p-4 font-semibold">Time Needed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lastActivities.map((item, i) => (
                      <tr key={i} className="border-b border-gray-200 hover:bg-white hover:text-[#ff5370] transition-colors cursor-pointer">
                        <td className="text-black p-4 font-semibold">{item.exercise}</td>
                        <td className="text-black p-4">{item.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Showcase */}
        <div className="mt-20 bg-black h-96 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#ff5370]/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          </div>
          <div className="relative z-10 text-center px-4">
            <h2 className="font-['Bebas_Neue',sans-serif] text-6xl md:text-7xl mb-4">Join Your Accountability Pod</h2>
            <p className="text-2xl opacity-90">
              Small groups, big results. Get matched with 3-5 people who share your commitment to growth.
            </p>
          </div>
        </div>
      </section>

      {/* Cards Section */}
      <section id="plans" className="bg-[#ff5370] py-20 px-6">
        <div 
          id="cards-content"
          data-reveal
          className={`max-w-7xl mx-auto transition-all duration-700 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
        >
          <div className="grid md:grid-cols-3 gap-8">
            {/* Personal Achievements Card */}
            <div className="bg-black rounded-lg p-8 hover:bg-gray-900 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/50 transition-all duration-300 cursor-pointer">
              <Trophy size={32} className="text-[#ff5370] mb-4" />
              <h2 className="font-['Bebas_Neue',sans-serif] text-3xl mb-4">Track Progress</h2>
              <ul className="space-y-3">
                <li className="pb-2 border-b border-gray-800">Visual habit streak counters</li>
                <li className="pb-2 border-b border-gray-800">Goal completion tracking</li>
                <li className="pb-2 border-b border-gray-800">Achievement badges & rewards</li>
                <li className="pb-2">Personal leaderboard ranking</li>
              </ul>
            </div>

            {/* Active Challenges Card */}
            <div className="bg-black rounded-lg p-8 hover:bg-gray-900 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/50 transition-all duration-300 cursor-pointer">
              <Flag size={32} className="text-[#ff5370] mb-4" />
              <h2 className="font-['Bebas_Neue',sans-serif] text-3xl mb-4">Pod Features</h2>
              <ul className="space-y-3">
                <li className="pb-2 border-b border-gray-800">AI-powered pod matching</li>
                <li className="pb-2 border-b border-gray-800">Real-time group chat</li>
                <li className="pb-2 border-b border-gray-800">Daily check-in reminders</li>
                <li className="pb-2">Crisis support alerts</li>
              </ul>
            </div>

            {/* Community Activity Card */}
            <div className="bg-black rounded-lg p-8 hover:bg-gray-900 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/50 transition-all duration-300 cursor-pointer">
              <Users2 size={32} className="text-[#ff5370] mb-4" />
              <h2 className="font-['Bebas_Neue',sans-serif] text-3xl mb-4">Community Support</h2>
              <ul className="space-y-3">
                <li className="pb-2 border-b border-gray-800">Anonymous profiles for safety</li>
                <li className="pb-2 border-b border-gray-800">Peer encouragement system</li>
                <li className="pb-2 border-b border-gray-800">Shared goal celebrations</li>
                <li className="pb-2">24/7 community support</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-[#ff5370] min-h-screen flex flex-col justify-center items-center text-center py-20 px-6 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-float"></div>
          <div className="absolute top-40 right-40 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-float-delayed"></div>
          <div className="absolute bottom-40 right-32 w-36 h-36 bg-white/10 rounded-full blur-2xl animate-float"></div>
          <div className="absolute bottom-32 left-40 w-48 h-48 bg-white/10 rounded-full blur-2xl animate-float-delayed"></div>
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center items-center max-w-4xl">
          <div className="text-6xl md:text-8xl font-['Bebas_Neue',sans-serif] mb-12 transition-opacity duration-500">
            {animatedWord}
          </div>
          
          <footer className="w-full">
            <p className="text-xl md:text-2xl mb-8 text-gray-100">
              Building better habits, one pod at a time. Join thousands who have transformed their lives through accountability partnerships.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center mb-8">
              <Link href="/register" className="bg-black hover:bg-white hover:text-[#ff5370] text-white px-8 py-4 rounded-lg text-xl font-bold uppercase transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex items-center gap-2">
                Start Your Journey <ArrowRight size={20} />
              </Link>
              <Link href="/login" className="bg-transparent border-2 border-white hover:bg-white hover:text-[#ff5370] text-white px-8 py-4 rounded-lg text-xl font-bold uppercase transition-all duration-300 hover:-translate-y-1">
                Sign In
              </Link>
            </div>
            
            <p className="text-gray-200 text-sm">
              © 2025 PodLink. All rights reserved. Building habits, building futures.
            </p>
          </footer>
        </div>
      </section>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Oswald:wght@200..700&display=swap');
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-30px) translateX(-15px); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
}