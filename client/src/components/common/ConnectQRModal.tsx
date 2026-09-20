'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  QrCode,
  Download,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Share2,
  Utensils,
  MapPin,
  Star,
  Globe,
} from 'lucide-react';

interface ConnectQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'connect' | 'menu' | 'review' | 'location';
}

export default function ConnectQRModal({
  isOpen,
  onClose,
  defaultTab = 'connect',
}: ConnectQRModalProps) {
  const [activeTab, setActiveTab] = useState<'connect' | 'menu' | 'review' | 'location'>('connect');
  const [qrTheme, setQrTheme] = useState<'dark' | 'print'>('dark');
  const [copied, setCopied] = useState(false);

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://bbites.salahuddin.codes';

  const qrTargets = {
    connect: {
      title: "Connect & Socials Gateway",
      subtitle: "Instant access to all social channels, reels & direct hotline",
      url: `${siteUrl}/connect`,
      badge: "Social Hub",
      icon: Globe,
    },
    menu: {
      title: "Digital Food Menu & Ordering",
      subtitle: "Scan to browse chicken momos, crunchy fuchka & teas",
      url: `${siteUrl}/menu`,
      badge: "Food Menu",
      icon: Utensils,
    },
    review: {
      title: "Google Maps 5-Star Review",
      subtitle: "Scan to leave an instant 5-star rating on Google Maps",
      url: "https://g.page/r/CZY9cCNvq2_GEAE/review",
      badge: "Google Review",
      icon: Star,
    },
    location: {
      title: "Marine Drive GPS Directions",
      subtitle: "Scan to open live Google Maps GPS navigation to stall",
      url: "https://maps.app.goo.gl/Xni3a5YXNXsCe5zz5",
      badge: "GPS Map",
      icon: MapPin,
    },
  };

  const current = qrTargets[activeTab];
  const localSvgPath = `/qr-codes/${activeTab}-qr-${qrTheme}.svg`;
  const localPngPath = `/qr-codes/${activeTab}-qr-${qrTheme}.png`;

  const handleCopy = () => {
    navigator.clipboard.writeText(current.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md rounded-3xl bg-brand-surface-light border border-brand-yellow/30 p-5 sm:p-7 shadow-[0_0_50px_rgba(251,191,36,0.15)] z-10 space-y-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-brand-yellow/15 border border-brand-yellow/30 flex items-center justify-center text-brand-yellow">
                <QrCode size={20} />
              </div>
              <div>
                <h3 className="text-base font-black text-brand-cream uppercase tracking-tight">
                  Vector SVG & Print QR Hub
                </h3>
                <p className="text-[11px] text-brand-cream/60">
                  Print-ready SVGs & 2K resolution stickers
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-brand-cream/50 hover:text-brand-cream hover:bg-white/5 transition-colors"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick Switcher Tabs */}
          <div className="grid grid-cols-4 gap-1 p-1 rounded-2xl bg-brand-black/70 border border-white/10 text-xs">
            {(['connect', 'menu', 'review', 'location'] as const).map((tab) => {
              const TabIcon = qrTargets[tab].icon;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 rounded-xl font-bold transition-all flex flex-col items-center justify-center gap-1 ${
                    activeTab === tab
                      ? 'bg-brand-yellow text-brand-black shadow-md'
                      : 'text-brand-cream/60 hover:text-brand-cream hover:bg-white/5'
                  }`}
                >
                  <TabIcon size={14} />
                  <span className="text-[10px] capitalize">{tab}</span>
                </button>
              );
            })}
          </div>

          {/* Theme Selector (Dark Gold vs Print Black & White) */}
          <div className="flex items-center justify-between px-1 text-xs">
            <span className="text-brand-cream/60 text-[11px] font-semibold">QR Style:</span>
            <div className="flex items-center gap-1 p-0.5 rounded-xl bg-brand-black/60 border border-white/10">
              <button
                onClick={() => setQrTheme('dark')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  qrTheme === 'dark'
                    ? 'bg-brand-yellow text-brand-black shadow-sm'
                    : 'text-brand-cream/60 hover:text-brand-cream'
                }`}
              >
                ✨ Luxury Gold
              </button>
              <button
                onClick={() => setQrTheme('print')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  qrTheme === 'print'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-brand-cream/60 hover:text-brand-cream'
                }`}
              >
                🖨️ Print Black & White
              </button>
            </div>
          </div>

          {/* QR Code Card Display */}
          <div className={`relative rounded-3xl p-5 flex flex-col items-center justify-center text-center space-y-3 shadow-inner border ${
            qrTheme === 'print'
              ? 'bg-white text-black border-slate-300'
              : 'bg-brand-black text-brand-cream border-brand-yellow/20'
          }`}>
            <div className={`relative w-48 h-48 sm:w-52 sm:h-52 rounded-2xl overflow-hidden p-2 border shadow-2xl ${
              qrTheme === 'print' ? 'bg-white border-black/10' : 'bg-brand-black border-white/10'
            }`}>
              <img
                src={localSvgPath}
                alt={`${current.title} QR Code`}
                className="w-full h-full object-contain rounded-xl"
              />
              
              {/* Brand Logo overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className={`w-10 h-10 rounded-xl p-1 shadow-lg border-2 ${
                  qrTheme === 'print' ? 'bg-white border-black' : 'bg-brand-black border-brand-yellow'
                }`}>
                  <Image
                    src="/images/logo-icon.png"
                    alt="Brother's Bites"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-1 ${
                qrTheme === 'print' ? 'bg-black text-white' : 'bg-brand-yellow/15 text-brand-yellow border border-brand-yellow/30'
              }`}>
                <Sparkles size={10} />
                <span>{current.badge}</span>
              </div>
              <h4 className={`text-sm font-bold ${qrTheme === 'print' ? 'text-black' : 'text-brand-cream'}`}>
                {current.title}
              </h4>
              <p className={`text-[11px] max-w-xs mt-0.5 leading-snug ${
                qrTheme === 'print' ? 'text-slate-600' : 'text-brand-cream/60'
              }`}>
                {current.subtitle}
              </p>
            </div>
          </div>

          {/* Download Action Buttons (SVG Vector & High-Res PNG) */}
          <div className="space-y-2 pt-1">
            <div className="grid grid-cols-2 gap-2 text-xs">
              {/* Vector SVG Download */}
              <a
                href={localSvgPath}
                download={`brothers-bites-${activeTab}-${qrTheme}.svg`}
                className="py-2 px-3 rounded-xl bg-brand-surface border border-brand-yellow/40 hover:bg-brand-yellow/10 text-brand-yellow font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 text-center shadow-sm"
              >
                <Download size={13} />
                <span>Raw SVG (Vector)</span>
              </a>

              {/* 2K PNG Download */}
              <a
                href={localPngPath}
                download={`brothers-bites-${activeTab}-${qrTheme}-2k.png`}
                className="py-2 px-3 rounded-xl bg-brand-surface border border-brand-border hover:border-brand-yellow/40 text-brand-cream font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 text-center shadow-sm"
              >
                <Download size={13} />
                <span>2K Print PNG</span>
              </a>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={handleCopy}
                className="py-2 px-3 rounded-xl bg-brand-surface border border-brand-border hover:border-brand-yellow/40 text-brand-cream/80 hover:text-brand-cream font-semibold transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                <span>{copied ? 'Link Copied' : 'Copy URL'}</span>
              </button>

              <a
                href={current.url}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-3 rounded-xl bg-brand-yellow text-brand-black font-black transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95 text-center"
              >
                <span>Visit Link</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
