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
  const [activeTab, setActiveTab] = useState<'connect' | 'menu' | 'review' | 'location'>(defaultTab);
  const [copied, setCopied] = useState(false);

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://bbites.salahuddin.codes';

  const qrTargets = {
    connect: {
      title: "Connect & Socials Gateway",
      subtitle: "Instant access to all social channels, reels & direct hotline",
      url: `${siteUrl}/connect`,
      badge: "Social Hub",
      icon: Globe,
      color: "from-brand-yellow to-amber-500",
    },
    menu: {
      title: "Digital Food Menu & Ordering",
      subtitle: "Scan to browse chicken momos, crunchy fuchka & teas",
      url: `${siteUrl}/menu`,
      badge: "Food Menu",
      icon: Utensils,
      color: "from-amber-400 to-orange-500",
    },
    review: {
      title: "Google Maps 5-Star Review",
      subtitle: "Scan to leave an instant 5-star rating on Google Maps",
      url: "https://g.page/r/CZY9cCNvq2_GEAE/review",
      badge: "Google Review",
      icon: Star,
      color: "from-yellow-400 to-amber-500",
    },
    location: {
      title: "Marine Drive GPS Directions",
      subtitle: "Scan to open live Google Maps GPS navigation to stall",
      url: "https://maps.app.goo.gl/Xni3a5YXNXsCe5zz5",
      badge: "GPS Map",
      icon: MapPin,
      color: "from-emerald-400 to-cyan-500",
    },
  };

  const current = qrTargets[activeTab];
  // Generate high quality SVG / PNG QR code using standard encoded URL
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(
    current.url
  )}&color=fbbf24&bgcolor=0a0a0c&margin=2&qzone=1`;

  const handleCopy = () => {
    navigator.clipboard.writeText(current.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    try {
      const res = await fetch(qrCodeUrl);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `brothers-bites-${activeTab}-qr.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      window.open(qrCodeUrl, '_blank');
    }
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
          className="relative w-full max-w-md rounded-3xl bg-brand-surface-light border border-brand-yellow/30 p-5 sm:p-7 shadow-[0_0_50px_rgba(251,191,36,0.15)] z-10 space-y-5"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-brand-yellow/15 border border-brand-yellow/30 flex items-center justify-center text-brand-yellow">
                <QrCode size={20} />
              </div>
              <div>
                <h3 className="text-base font-black text-brand-cream uppercase tracking-tight">
                  Scan & Connect QR Code
                </h3>
                <p className="text-[11px] text-brand-cream/60">
                  Brother&apos;s Bites Digital Scanner Hub
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

          {/* QR Code Card Display */}
          <div className="relative rounded-3xl bg-brand-black border border-brand-yellow/20 p-5 flex flex-col items-center justify-center text-center space-y-3 shadow-inner">
            <div className="relative w-52 h-52 sm:w-56 sm:h-56 rounded-2xl overflow-hidden bg-brand-black p-2 border border-white/10 shadow-2xl">
              <img
                src={qrCodeUrl}
                alt={`${current.title} QR Code`}
                className="w-full h-full object-contain rounded-xl"
              />
              
              {/* Brand Logo in center */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-11 h-11 rounded-xl bg-brand-black border-2 border-brand-yellow p-1 shadow-lg">
                  <Image
                    src="/images/logo-icon.png"
                    alt="Brother's Bites"
                    width={36}
                    height={36}
                    className="object-contain"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-yellow/15 border border-brand-yellow/30 text-brand-yellow text-[10px] font-bold uppercase tracking-wider mb-1">
                <Sparkles size={10} />
                <span>{current.badge}</span>
              </div>
              <h4 className="text-sm font-bold text-brand-cream">{current.title}</h4>
              <p className="text-[11px] text-brand-cream/60 max-w-xs mt-0.5 leading-snug">
                {current.subtitle}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              onClick={handleCopy}
              className="py-2.5 px-3 rounded-xl bg-brand-surface border border-brand-border hover:border-brand-yellow/40 text-brand-cream font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              <span>{copied ? 'Copied' : 'Copy Link'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="py-2.5 px-3 rounded-xl bg-brand-surface border border-brand-border hover:border-brand-yellow/40 text-brand-cream font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Download size={13} />
              <span>Save PNG</span>
            </button>

            <a
              href={current.url}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl bg-brand-yellow text-brand-black font-extrabold transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95 text-center"
            >
              <span>Open Link</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
