'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Phone,
  UtensilsCrossed,
  User as UserIcon,
  LogOut,
  PackageCheck,
  LayoutDashboard,
  ChevronDown,
  Settings,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import ThemeToggle from '@/components/common/ThemeToggle';
import { CartNavButton } from '@/components/cart/CartDrawer';
import { useAuth } from '@/context/AuthContext';

// Main navigation links including Track Order
const mainNavLinks = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/offers', label: 'Offers' },
  { href: '/track-order', label: 'Track Order' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const isStaff = user && ['super_admin', 'admin', 'manager', 'staff'].includes(user.role);

  return (
    <>
      {/* Floating Centered Island Navbar */}
      <header className="fixed top-2 sm:top-4 inset-x-0 z-50 flex justify-center px-2.5 sm:px-4 pointer-events-none">
        <nav
          className={cn(
            'pointer-events-auto w-[calc(100%-16px)] sm:w-auto max-w-5xl lg:max-w-6xl flex items-center justify-between gap-1.5 sm:gap-2.5 md:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-300 border shadow-2xl backdrop-blur-xl',
            scrolled
              ? 'bg-brand-surface/95 border-brand-border/90 shadow-black/30'
              : 'bg-brand-surface/90 border-brand-border/70 shadow-black/20'
          )}
        >
          {/* Logo - Crisp and uncropped */}
          <Link
            href="/"
            className="flex items-center gap-1.5 group shrink-0 pr-1"
            aria-label="Brother's Bites Home"
          >
            <div className="h-6 sm:h-7.5 flex items-center justify-center">
              <img
                src="/images/logo.png"
                alt="Brother's Bites"
                className="h-6 sm:h-7.5 w-auto max-w-[110px] sm:max-w-[135px] object-contain rounded-lg transition-transform duration-200 group-hover:scale-105"
              />
            </div>
          </Link>

          {/* Desktop Navigation Links (including Track Order) */}
          <div className="hidden md:flex items-center gap-0.5 sm:gap-1 px-1">
            {mainNavLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'text-xs font-semibold px-2.5 py-1.5 rounded-full transition-all duration-200 select-none whitespace-nowrap',
                    active
                      ? 'bg-brand-yellow text-brand-black font-bold shadow-sm'
                      : 'text-brand-cream/75 hover:text-brand-cream hover:bg-white/5'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Divider on Desktop */}
          <div className="hidden md:block w-px h-4 bg-brand-border/80 mx-0.5 shrink-0" />

          {/* Right Action Utilities */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Customer Account / Sign In */}
            {user ? (
              <div className="relative hidden md:block" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 hover:border-brand-yellow/40 hover:bg-white/10 transition-all text-xs text-brand-cream font-medium"
                >
                  <div className="w-5 h-5 rounded-full bg-brand-yellow text-brand-black font-extrabold flex items-center justify-center text-[10px]">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden lg:inline max-w-[75px] truncate">{user.name.split(' ')[0]}</span>
                  <ChevronDown size={12} className="text-brand-cream/60" />
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-48 bg-brand-surface-light border border-white/10 rounded-2xl shadow-2xl p-2 z-50 divide-y divide-white/5"
                    >
                      <div className="px-3 py-2">
                        <p className="text-xs font-bold text-brand-cream truncate">{user.name}</p>
                        <p className="text-[10px] text-brand-cream/50 truncate">{user.phone || user.email}</p>
                      </div>

                      <div className="py-1 space-y-0.5">
                        <Link
                          href="/account"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-brand-cream/80 hover:text-brand-cream hover:bg-white/5 transition-colors"
                        >
                          <PackageCheck size={14} className="text-brand-yellow" />
                          <span>My Orders & Profile</span>
                        </Link>
                        <Link
                          href="/settings"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-brand-cream/80 hover:text-brand-cream hover:bg-white/5 transition-colors"
                        >
                          <Settings size={14} className="text-brand-yellow" />
                          <span>Account Settings</span>
                        </Link>
                        {isStaff && (
                          <Link
                            href="/admin/dashboard"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-brand-yellow hover:bg-brand-yellow/10 transition-colors"
                          >
                            <LayoutDashboard size={14} />
                            <span>Admin Dashboard</span>
                          </Link>
                        )}
                      </div>

                      <div className="pt-1">
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors text-left"
                        >
                          <LogOut size={14} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold text-brand-cream/80 hover:text-brand-yellow px-2.5 py-1 rounded-full hover:bg-white/5 transition-colors border border-white/10 hover:border-brand-yellow/30"
              >
                <UserIcon size={13} />
                <span>Sign In</span>
              </Link>
            )}

            {/* Cart Drawer Button */}
            <CartNavButton />

            {/* Dark/Light Theme Toggle */}
            <ThemeToggle className="w-8 h-8 sm:w-9 sm:h-9" />

            {/* Direct ORDER NOW Button */}
            <Link
              href="/menu"
              className="inline-flex items-center gap-1.5 btn-primary !h-8 sm:!h-8.5 !px-3 sm:!px-4 text-[11px] sm:text-xs font-extrabold uppercase tracking-wide !rounded-full shadow-md shadow-brand-yellow/15 hover:scale-[1.02] transition-transform whitespace-nowrap"
            >
              <UtensilsCrossed size={12} className="shrink-0" />
              <span>ORDER NOW</span>
            </Link>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-1 text-brand-cream hover:text-brand-yellow transition-colors focus:outline-none rounded-full hover:bg-white/10 shrink-0"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer Navigation Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Mobile Rounded Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed top-20 inset-x-4 max-w-sm mx-auto z-50 md:hidden bg-brand-surface border border-brand-border rounded-3xl p-5 shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <img src="/images/logo-icon.png" alt="Brother's Bites" className="w-8 h-8 rounded-xl object-contain bg-black/40 p-1 border border-brand-yellow/30" />
                  <span className="font-display font-black text-sm text-brand-cream tracking-tight">BROTHER&apos;S BITES</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-full text-brand-cream/60 hover:text-brand-cream hover:bg-white/10 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="space-y-1 py-1">
                {mainNavLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'block px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all',
                        isActive
                          ? 'bg-brand-yellow text-brand-black shadow-sm font-extrabold'
                          : 'text-brand-cream/80 hover:text-brand-cream hover:bg-white/5'
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              {/* User Section & Action Buttons */}
              <div className="pt-3 mt-2 border-t border-white/10 space-y-2">
                {user ? (
                  <div className="p-2.5 rounded-2xl bg-white/[0.04] border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-brand-yellow text-brand-black font-black text-xs flex items-center justify-center shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-brand-cream truncate">{user.name}</p>
                        <p className="text-[10px] text-brand-cream/50 truncate">{user.phone || user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Link
                        href="/account"
                        onClick={() => setIsOpen(false)}
                        className="px-2.5 py-1 rounded-lg bg-brand-yellow/10 text-brand-yellow text-xs font-bold"
                      >
                        Profile
                      </Link>
                      <Link
                        href="/settings"
                        onClick={() => setIsOpen(false)}
                        className="p-1.5 text-brand-cream/70 hover:bg-white/10 rounded-lg"
                        title="Settings"
                      >
                        <Settings size={14} />
                      </Link>
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          logout();
                        }}
                        className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg"
                        title="Sign Out"
                      >
                        <LogOut size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="btn-secondary w-full justify-center !rounded-xl !h-10 text-xs gap-2"
                  >
                    <UserIcon size={14} className="text-brand-yellow" />
                    <span>Sign In / Create Account</span>
                  </Link>
                )}

                <Link
                  href="/menu"
                  onClick={() => setIsOpen(false)}
                  className="btn-primary w-full justify-center !rounded-xl !h-10 text-xs gap-2"
                >
                  <UtensilsCrossed size={14} />
                  <span>EXPLORE FULL MENU</span>
                </Link>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="tel:+8801627817436"
                    className="btn-secondary w-full justify-center text-xs gap-1.5 !rounded-xl !h-9"
                  >
                    <Phone className="h-3.5 w-3.5 text-brand-yellow" />
                    <span>Call Hotline</span>
                  </a>
                  <Link
                    href="/track-order"
                    onClick={() => setIsOpen(false)}
                    className="btn-secondary w-full justify-center text-xs gap-1.5 !rounded-xl !h-9"
                  >
                    <span>Track Order</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
