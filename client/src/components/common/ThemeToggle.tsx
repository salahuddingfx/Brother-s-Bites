'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export default function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          'w-9 h-9 rounded-lg bg-brand-surface-light border border-white/10 flex items-center justify-center text-brand-cream/40',
          className
        )}
      >
        <Moon size={16} />
      </div>
    );
  }

  const isLight = theme === 'light';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        'relative inline-flex items-center justify-center p-2 rounded-lg transition-colors focus:outline-none',
        'bg-brand-surface-light border border-white/10 text-brand-cream hover:text-brand-yellow hover:border-brand-yellow/30',
        showLabel ? 'gap-2 px-3.5 py-2' : 'w-9 h-9',
        className
      )}
      aria-label={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
    >
      {isLight ? (
        <Moon size={16} className="text-brand-yellow transition-transform duration-300 hover:rotate-12" />
      ) : (
        <Sun size={16} className="text-brand-yellow transition-transform duration-300 hover:rotate-45" />
      )}
      {showLabel && (
        <span className="text-xs font-semibold uppercase tracking-wider">
          {isLight ? 'Dark Mode' : 'Light Mode'}
        </span>
      )}
    </button>
  );
}
