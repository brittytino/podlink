'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Breadcrumbs() {
  const pathname = usePathname();
  
  // Don't show breadcrumbs on home page
  if (pathname === '/') return null;

  const segments = pathname.split('/').filter(Boolean);
  
  // Format segment name (e.g., 'how-it-works' -> 'How It Works')
  const formatSegment = (segment: string) => {
    return segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-slate-50/50 border-b border-slate-200/60 py-3"
      aria-label="Breadcrumb"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <ol className="flex items-center gap-2 text-sm">
          {/* Home Link */}
          <li>
            <Link 
              href="/"
              className="flex items-center gap-1.5 text-slate-600 hover:text-purple-600 transition-colors group"
            >
              <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Home</span>
            </Link>
          </li>

          {/* Path Segments */}
          {segments.map((segment, index) => {
            const isLast = index === segments.length - 1;
            const href = '/' + segments.slice(0, index + 1).join('/');
            
            return (
              <React.Fragment key={segment}>
                <ChevronRight className="w-4 h-4 text-slate-400" />
                <li>
                  {isLast ? (
                    <span className="text-purple-600 font-semibold">
                      {formatSegment(segment)}
                    </span>
                  ) : (
                    <Link
                      href={href}
                      className="text-slate-600 hover:text-purple-600 transition-colors font-medium"
                    >
                      {formatSegment(segment)}
                    </Link>
                  )}
                </li>
              </React.Fragment>
            );
          })}
        </ol>
      </div>
    </motion.nav>
  );
}
