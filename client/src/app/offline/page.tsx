'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  WifiOff,
  RefreshCw,
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  Home,
  CheckCircle2,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

export default function OfflinePage() {
  const [isChecking, setIsChecking] = useState(false);
  const [checkStatus, setCheckStatus] = useState<'idle' | 'online' | 'offline'>('idle');

  const checkConnection = async () => {
    setIsChecking(true);
    setCheckStatus('idle');
    try {
      const response = await fetch(`/favicon.ico?_t=${Date.now()}`, {
        method: 'HEAD',
        cache: 'no-store',
      });
      if (response.ok || response.status < 500) {
        setCheckStatus('online');
        setTimeout(() => {
          window.location.href = '/';
        }, 1200);
      } else {
        setCheckStatus('offline');
      }
    } catch {
      setCheckStatus('offline');
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    const handleOnline = () => {
      setCheckStatus('online');
    };
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  return (
    <div className="min-h-screen bg-brand-black text-brand-cream flex flex-col justify-between selection:bg-brand-yellow selection:text-brand-black px-4 py-8 sm:py-12">
      {/* Top Bar Branding */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between pb-6 border-b border-brand-cream/10">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-brand-yellow flex items-center justify-center text-brand-black font-black text-xl shadow-lg shadow-brand-yellow/20 group-hover:scale-105 transition-transform duration-200">
            BB
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-brand-cream">
              Brother&apos;s Bites
            </span>
            <span className="block text-[10px] text-brand-yellow uppercase tracking-widest font-semibold">
              Marine Drive • Cox&apos;s Bazar
            </span>
          </div>
        </Link>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span>Offline Mode</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-2xl mx-auto w-full py-8 sm:py-12 text-center flex flex-col items-center">
        {/* Animated Icon Container */}
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-brand-yellow/10 blur-2xl animate-pulse" />
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-brand-surface-light border-2 border-brand-yellow/30 flex items-center justify-center text-brand-yellow shadow-2xl">
            <WifiOff className="w-12 h-12 sm:w-14 sm:h-14 animate-pulse" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 text-xs font-black backdrop-blur-md">
            !
          </div>
        </div>

        <h1 className="heading-lg text-brand-cream mb-3 font-extrabold tracking-tight">
          You&apos;re Currently <span className="text-brand-yellow">Offline</span>
        </h1>

        <p className="text-brand-cream/70 text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed">
          It looks like your internet connection was lost or the server is momentarily unreachable.
          Don&apos;t worry — we&apos;re still serving hot bites at Marine Drive!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md mb-10">
          <button
            onClick={checkConnection}
            disabled={isChecking}
            className="w-full sm:w-auto flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
            <span>{isChecking ? 'Checking Connection...' : 'Check Connection'}</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto flex-1 btn-secondary flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Go to Home</span>
          </Link>
        </div>

        {/* Connection Status Feedback Alert */}
        {checkStatus === 'online' && (
          <div className="w-full max-w-md mb-8 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Connection detected! Redirecting you back...</span>
          </div>
        )}

        {checkStatus === 'offline' && (
          <div className="w-full max-w-md mb-8 p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-center justify-center gap-2 animate-in fade-in duration-200">
            <WifiOff className="w-4 h-4 text-red-400" />
            <span>Still offline. Please check your Wi-Fi or mobile data.</span>
          </div>
        )}

        {/* Quick Offline Assistance Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full text-left">
          {/* Direct Phone Order */}
          <div className="p-4 rounded-2xl bg-brand-surface border border-brand-cream/10 hover:border-brand-yellow/30 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-brand-yellow/15 border border-brand-yellow/30 flex items-center justify-center text-brand-yellow">
                <Phone className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-brand-cream">Phone Orders</h2>
            </div>
            <p className="text-xs text-brand-cream/60 mb-3">
              Directly call our kitchen counter for urgent orders & reservations.
            </p>
            <a
              href="tel:+8801812345678"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-yellow hover:underline"
            >
              +880 1812-345678 →
            </a>
          </div>

          {/* WhatsApp Inquiries */}
          <div className="p-4 rounded-2xl bg-brand-surface border border-brand-cream/10 hover:border-brand-yellow/30 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-brand-cream">WhatsApp Helpline</h2>
            </div>
            <p className="text-xs text-brand-cream/60 mb-3">
              Send us a message for table bookings and takeouts.
            </p>
            <a
              href="https://wa.me/8801812345678"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:underline"
            >
              Chat on WhatsApp →
            </a>
          </div>

          {/* Location Information */}
          <div className="p-4 rounded-2xl bg-brand-surface border border-brand-cream/10 hover:border-brand-yellow/30 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-brand-yellow/15 border border-brand-yellow/30 flex items-center justify-center text-brand-yellow">
                <MapPin className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-brand-cream">Our Location</h2>
            </div>
            <p className="text-xs text-brand-cream/70 leading-relaxed">
              Marine Drive, Sonar Para Beach, Cox&apos;s Bazar, Bangladesh
            </p>
          </div>

          {/* Opening Hours */}
          <div className="p-4 rounded-2xl bg-brand-surface border border-brand-cream/10 hover:border-brand-yellow/30 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-brand-yellow/15 border border-brand-yellow/30 flex items-center justify-center text-brand-yellow">
                <Clock className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-brand-cream">Opening Hours</h2>
            </div>
            <p className="text-xs text-brand-cream/70 leading-relaxed">
              Everyday: 12:00 PM – 11:30 PM (Kitchen closes at 11:00 PM)
            </p>
          </div>
        </div>

        {/* Offline Tips Box */}
        <div className="mt-8 p-4 rounded-2xl bg-brand-yellow/5 border border-brand-yellow/20 w-full text-left flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-brand-yellow shrink-0 mt-0.5" />
          <div className="text-xs text-brand-cream/80 space-y-1">
            <p className="font-semibold text-brand-cream flex items-center gap-1.5">
              <span>Quick Offline Tips</span>
              <Sparkles className="w-3.5 h-3.5 text-brand-yellow" />
            </p>
            <p className="text-brand-cream/60">
              • If you are connected to Wi-Fi, try toggling Airplane Mode on and off.
            </p>
            <p className="text-brand-cream/60">
              • If the local development server is restarting, please wait a few seconds and click Check Connection.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto w-full pt-6 border-t border-brand-cream/10 text-center text-xs text-brand-cream/50">
        © {new Date().getFullYear()} Brother&apos;s Bites. Bites • Sips • Brotherhood.
      </footer>
    </div>
  );
}
