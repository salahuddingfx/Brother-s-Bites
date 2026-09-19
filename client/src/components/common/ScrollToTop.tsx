'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (scrollHeight > 0) {
        const progress = Math.min(Math.max((currentScrollY / scrollHeight) * 100, 0), 100);
        setScrollProgress(progress);
      }

      if (currentScrollY > 280) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // SVG circular geometry
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed bottom-6 right-6 z-50"
        >
          <button
            onClick={scrollToTop}
            aria-label="Scroll to top of page"
            className="group relative w-12 h-12 flex items-center justify-center rounded-full bg-brand-surface-light/90 backdrop-blur-md border border-brand-cream/15 shadow-xl hover:border-brand-yellow/50 transition-all duration-300 hover:shadow-brand-yellow/10"
          >
            {/* SVG Circular Progress Track */}
            <svg
              className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
              viewBox="0 0 44 44"
            >
              {/* Background Track Ring */}
              <circle
                cx="22"
                cy="22"
                r={radius}
                className="text-brand-cream/10"
                strokeWidth="2.5"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Progress Indicator Ring */}
              <circle
                cx="22"
                cy="22"
                r={radius}
                className="text-brand-yellow transition-all duration-150 ease-out"
                strokeWidth="2.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>

            {/* Central Arrow Icon */}
            <ArrowUp className="w-5 h-5 text-brand-cream group-hover:text-brand-yellow group-hover:-translate-y-0.5 transition-all duration-200 z-10" />

            {/* Subtle Hover Tooltip */}
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-brand-surface-light border border-brand-cream/15 text-brand-cream text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
              {Math.round(scrollProgress)}%
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
