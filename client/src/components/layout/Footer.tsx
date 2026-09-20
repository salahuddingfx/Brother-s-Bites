'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  Phone,
  Clock,
  QrCode,
  Sparkles,
  ExternalLink,
  Utensils,
  Camera,
  Star,
  Heart,
  Navigation,
  Share2,
  ChevronRight,
  ShieldCheck,
  Tag,
  Truck,
  HelpCircle,
} from 'lucide-react';
import InstagramIcon from '@/components/icons/InstagramIcon';
import FacebookIcon from '@/components/icons/FacebookIcon';
import ConnectQRModal from '@/components/common/ConnectQRModal';

export default function Footer() {
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrTab, setQrTab] = useState<'connect' | 'menu' | 'review' | 'location'>('connect');

  const openQrWithTab = (tab: 'connect' | 'menu' | 'review' | 'location') => {
    setQrTab(tab);
    setQrModalOpen(true);
  };

  const culinaryLinks = [
    { href: '/menu', label: 'Digital Food Menu', icon: Utensils },
    { href: '/menu?cat=momos', label: 'Steamed & Wave Momos', icon: Sparkles },
    { href: '/menu?cat=fuchka', label: 'Crispy Fuchka Corner', icon: Heart },
    { href: '/offers', label: 'Exclusive Deals & Combos', icon: Tag },
    { href: '/track-order', label: 'Live Order Tracker', icon: Truck },
  ];

  const exploreLinks = [
    { href: '/about', label: 'Our Story & Master Chefs', icon: Heart },
    { href: '/location', label: 'Marine Drive GPS Map', icon: Navigation },
    { href: '/gallery', label: 'Beachside Photo Gallery', icon: Camera },
    { href: '/reviews', label: 'Customer Reviews & Wall', icon: Star },
    { href: '/faq', label: 'Frequently Asked Questions', icon: HelpCircle, badge: 'FAQ' },
    { href: '/connect', label: 'Socials & Review Hub', icon: Share2, badge: 'New' },
    { href: '/settings', label: 'Customer Profile & Settings', icon: Sparkles },
    { href: '/developer', label: 'Developer Portfolio', icon: ExternalLink },
  ];

  return (
    <footer className="relative bg-brand-surface bg-texture-pattern border-t border-brand-border pt-14 pb-10 overflow-hidden text-brand-cream selection:bg-brand-yellow selection:text-brand-black">
      {/* Ambient Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-36 bg-brand-yellow/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/5 blur-[140px] pointer-events-none" />

      <div className="container-bb relative z-10 space-y-12">
        {/* Top Feature Brand Bar */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-8 border-b border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Link href="/" className="inline-block shrink-0 group">
              <Image
                src="/images/logo.png"
                alt="Brother's Bites"
                width={170}
                height={42}
                className="h-9 sm:h-10 w-auto object-contain group-hover:scale-105 transition-transform"
              />
            </Link>
            <div className="hidden sm:block h-6 w-px bg-white/10" />
            <p className="text-xs font-black uppercase tracking-[0.25em] text-brand-yellow">
              Bites • Sips • Brotherhood
            </p>
          </div>

          {/* Quick Info & Schedule Pills */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs text-brand-cream/80">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-surface-light border border-brand-border shadow-sm">
              <Clock className="w-3.5 h-3.5 text-brand-yellow" />
              <span>Sun–Thu 3PM–12AM • Fri–Sat 10AM–12AM</span>
            </div>

            <a
              href="tel:+8801627817436"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-surface-light border border-brand-border hover:border-brand-yellow/50 hover:text-brand-yellow transition-all shadow-sm group"
            >
              <Phone className="w-3.5 h-3.5 text-brand-yellow group-hover:rotate-12 transition-transform" />
              <span className="font-mono font-bold">+880 1627-817436</span>
            </a>
          </div>
        </div>

        {/* 4-Column Structured Modern Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {/* Column 1: Restaurant Brand & Location */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-brand-cream">
                Brother&apos;s Bites
              </h3>
              <p className="text-xs text-brand-cream/65 mt-2 leading-relaxed">
                Coastal street culinary stop situated right on Marine Drive, Sonar Para Beach, Cox&apos;s Bazar. Savor signature steamed momos, spicy fuchka, and sunset tea rituals.
              </p>
            </div>

            <div className="space-y-2 text-xs text-brand-cream/70">
              <a
                href="https://maps.app.goo.gl/Xni3a5YXNXsCe5zz5"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 hover:text-brand-yellow transition-colors group"
              >
                <MapPin size={15} className="text-brand-yellow shrink-0 mt-0.5" />
                <span>Marine Drive, Sonar Para Beach, Cox&apos;s Bazar</span>
              </a>

              <a
                href="https://wa.me/8801627817436"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span>WhatsApp Preorders: +880 1627-817436</span>
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://facebook.com/brothersbites.bd"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-xl bg-brand-surface-light border border-brand-border hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-400 flex items-center justify-center text-brand-cream/80 transition-all shadow-sm"
                title="Facebook @brothersbites.bd"
              >
                <FacebookIcon className="w-4 h-4 text-blue-400" />
              </a>

              <a
                href="https://instagram.com/brothersbites.bd"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-xl bg-brand-surface-light border border-brand-border hover:border-pink-500/50 hover:bg-pink-500/10 hover:text-pink-400 flex items-center justify-center text-brand-cream/80 transition-all shadow-sm"
                title="Instagram @brothersbites.bd"
              >
                <InstagramIcon className="w-4 h-4 text-pink-400" />
              </a>

              <button
                onClick={() => openQrWithTab('connect')}
                className="px-2.5 py-1 rounded-xl bg-brand-yellow/10 border border-brand-yellow/30 hover:bg-brand-yellow hover:text-brand-black text-brand-yellow text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
                title="Open QR Scanner Hub"
              >
                <QrCode size={13} />
                <span>QR Hub</span>
              </button>
            </div>
          </div>

          {/* Column 2: Culinary & Menu */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-brand-yellow flex items-center gap-1.5">
              <Utensils size={13} />
              <span>Menu & Cravings</span>
            </h3>
            <ul className="space-y-2">
              {culinaryLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-brand-cream/70 hover:text-brand-yellow transition-colors inline-flex items-center gap-2 group py-0.5"
                  >
                    <ChevronRight size={12} className="text-brand-cream/30 group-hover:text-brand-yellow group-hover:translate-x-0.5 transition-all" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Explore & Experience */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-brand-yellow flex items-center gap-1.5">
              <Navigation size={13} />
              <span>Explore & Connect</span>
            </h3>
            <ul className="space-y-2">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-brand-cream/70 hover:text-brand-yellow transition-colors inline-flex items-center gap-2 group py-0.5"
                  >
                    <ChevronRight size={12} className="text-brand-cream/30 group-hover:text-brand-yellow group-hover:translate-x-0.5 transition-all" />
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-brand-yellow text-brand-black uppercase">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: 📲 Instant Scan QR Widget */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-brand-yellow flex items-center gap-1.5">
              <QrCode size={13} />
              <span>Instant QR Scanner</span>
            </h3>
            
            <div className="p-4 rounded-2xl bg-brand-surface-light border border-brand-yellow/20 hover:border-brand-yellow/50 transition-all shadow-xl space-y-3 group">
              <div className="flex items-center gap-3">
                <div className="relative w-16 h-16 rounded-xl bg-brand-black border border-white/10 p-1 flex items-center justify-center shrink-0 shadow-md">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https%3A%2F%2Fbbites.salahuddin.codes%2Fconnect&color=fbbf24&bgcolor=0a0a0c&margin=1"
                    alt="Scan Connect Page QR"
                    className="w-full h-full object-contain rounded-lg"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-4 h-4 rounded bg-brand-black border border-brand-yellow p-0.5">
                      <Image src="/images/logo-icon.png" alt="BB" width={14} height={14} className="object-contain" />
                    </div>
                  </div>
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-bold text-brand-cream group-hover:text-brand-yellow transition-colors">
                    1-Tap Connect & Menu
                  </p>
                  <p className="text-[11px] text-brand-cream/60 leading-snug mt-0.5">
                    Scan with any smartphone camera for live links & reviews
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => openQrWithTab('connect')}
                  className="py-1.5 px-2 rounded-xl bg-brand-surface border border-white/10 hover:border-brand-yellow/40 text-[11px] font-bold text-brand-cream hover:text-brand-yellow transition-all flex items-center justify-center gap-1"
                >
                  <QrCode size={11} />
                  <span>Connect QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => openQrWithTab('review')}
                  className="py-1.5 px-2 rounded-xl bg-brand-yellow text-brand-black text-[11px] font-extrabold hover:bg-brand-yellow-hover transition-all flex items-center justify-center gap-1 shadow-sm"
                >
                  <Star size={11} className="fill-brand-black" />
                  <span>Review QR</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Minimal Copyright Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] sm:text-xs text-brand-cream/50">
          <p>© {new Date().getFullYear()} Brother&apos;s Bites. Marine Drive, Sonar Para Beach, Cox&apos;s Bazar.</p>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <span className="tracking-wider">Handcrafted Coastal Flavors</span>
            <span>•</span>
            <Link href="/developer" className="hover:text-brand-yellow transition-colors font-semibold text-brand-cream/70">
              Developed by Salah Uddin Kader
            </Link>
          </div>
        </div>
      </div>

      {/* Interactive QR Code Modal */}
      {qrModalOpen && (
        <ConnectQRModal
          isOpen={qrModalOpen}
          onClose={() => setQrModalOpen(false)}
          defaultTab={qrTab}
        />
      )}
    </footer>
  );
}
