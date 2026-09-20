'use client';

import Link from 'next/link';
import { MapPin, Phone, Clock } from 'lucide-react';
import InstagramIcon from '@/components/icons/InstagramIcon';
import FacebookIcon from '@/components/icons/FacebookIcon';

const navLinks = [
  { href: '/menu', label: 'Menu' },
  { href: '/offers', label: 'Offers' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/track-order', label: 'Track Order' },
  { href: '/about', label: 'About' },
  { href: '/location', label: 'Location' },
  { href: '/contact', label: 'Contact' },
  { href: '/connect', label: 'Socials & Reviews' },
  { href: '/developer', label: 'Developer' },
];

export default function Footer() {

  return (
    <footer className="relative bg-brand-surface bg-texture-pattern border-t border-brand-cream/10 pt-12 pb-8 overflow-hidden">
      {/* Subtle Bottom Ambient Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-brand-yellow/5 blur-3xl pointer-events-none" />

      <div className="container-bb relative z-10">
        {/* Top Minimal Editorial Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-brand-cream/10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Link href="/" className="inline-block shrink-0">
              <img
                src="/images/logo.png"
                alt="Brother's Bites"
                className="h-8 sm:h-9 w-auto object-contain"
              />
            </Link>
            <div className="hidden sm:block h-5 w-px bg-brand-cream/15" />
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-yellow">
              Bites • Sips • Brotherhood
            </p>
          </div>

          {/* Quick Minimal Info Pills */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-brand-cream/70">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-surface-light border border-brand-cream/10">
              <Clock className="w-3.5 h-3.5 text-brand-yellow" />
              <span>Sun–Thu 3PM–12AM • Fri–Sat 10AM–12AM</span>
            </div>

            <a
              href="tel:+8801851075537"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-surface-light border border-brand-cream/10 hover:border-brand-yellow/40 hover:text-brand-yellow transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-brand-yellow" />
              <span>+880 1851-075537</span>
            </a>
          </div>
        </div>

        {/* Middle Navigation & Socials */}
        <div className="py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Horizontal Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-brand-cream/70 hover:text-brand-yellow transition-colors relative group py-1"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-brand-yellow transition-all duration-200 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Location & Social */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://facebook.com/salahuddingfx"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-brand-cream/70 hover:text-brand-yellow transition-colors px-3 py-1.5 rounded-full bg-brand-surface-light border border-brand-cream/10"
              title="Follow us on Facebook"
            >
              <FacebookIcon className="w-3.5 h-3.5 text-brand-yellow" />
              <span>Facebook</span>
            </a>

            <a
              href="https://instagram.com/salahuddingfx"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-brand-cream/70 hover:text-brand-yellow transition-colors px-3 py-1.5 rounded-full bg-brand-surface-light border border-brand-cream/10"
              title="Follow us on Instagram"
            >
              <InstagramIcon className="w-3.5 h-3.5 text-brand-yellow" />
              <span>@brothersbites.bd</span>
            </a>

            <a
              href="https://share.google/c3GkhEDd0hLvdo7Vm"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-brand-cream/60 hover:text-brand-cream transition-colors hidden sm:inline-flex"
            >
              <MapPin className="w-3.5 h-3.5 text-brand-yellow" />
              <span>Sonar Para Beach</span>
            </a>
          </div>
        </div>

        {/* Bottom Minimal Copyright Bar */}
        <div className="pt-6 border-t border-brand-cream/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] sm:text-xs text-brand-cream/40">
          <p>© {new Date().getFullYear()} Brother&apos;s Bites. Marine Drive, Cox&apos;s Bazar.</p>
          <div className="flex items-center gap-4">
            <span className="tracking-wider">Handcrafted Coastal Flavors</span>
            <span>•</span>
            <Link href="/developer" className="hover:text-brand-yellow transition-colors font-semibold text-brand-cream/60">
              Dev: Salah Uddin Kader
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
