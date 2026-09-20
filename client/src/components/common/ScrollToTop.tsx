'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = useCallback(() => {
    if (typeof window === 'undefined') return;

    const currentScrollY =
      window.scrollY ||
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    const scrollHeight =
      document.documentElement.scrollHeight - window.innerHeight ||
      document.body.scrollHeight - window.innerHeight ||
      1;

    if (scrollHeight > 0) {
      const progress = Math.min(Math.max((currentScrollY / scrollHeight) * 100, 0), 100);
      setScrollProgress(progress);
    }

    // Show button when scrolled down past 150px
    if (currentScrollY > 150) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [handleScroll]);

  const scrollToTop = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    } catch {
      window.scrollTo(0, 0);
    }

    // Fallback for older browsers or nested scroll containers
    if (document.documentElement && document.documentElement.scrollTop > 0) {
      document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (document.body && document.body.scrollTop > 0) {
      document.body.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="fixed bottom-6 right-6 z-[999] pointer-events-auto select-none touch-manipulation"
        >
          <button
            type="button"
            onClick={scrollToTop}
            onTouchEnd={scrollToTop}
            aria-label="Scroll back to top of page"
            className="group relative w-12 h-12 flex items-center justify-center rounded-full bg-brand-surface-light/95 backdrop-blur-md border border-brand-cream/20 shadow-2xl hover:border-brand-yellow hover:bg-brand-surface active:scale-90 hover:scale-105 transition-all duration-200 cursor-pointer"
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
                className="text-brand-yellow transition-all duration-100 ease-out"
                strokeWidth="2.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>

            {/* Central Arrow Icon */}
            <ArrowUp className="w-5 h-5 text-brand-cream group-hover:text-brand-yellow group-hover:-translate-y-0.5 transition-all duration-200 pointer-events-none z-10" />

            {/* Subtle Hover Tooltip */}
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-brand-surface-light border border-brand-cream/20 text-brand-cream text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
              {Math.round(scrollProgress)}%
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
