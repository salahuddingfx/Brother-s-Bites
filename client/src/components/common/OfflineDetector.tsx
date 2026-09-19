'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { WifiOff, Wifi, RefreshCw, X, AlertTriangle } from 'lucide-react';

export default function OfflineDetector() {
  const [isOffline, setIsOffline] = useState(false);
  const [showReconnected, setShowReconnected] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const checkConnection = useCallback(async () => {
    setIsChecking(true);
    try {
      // Try to fetch a small timestamped request or favicon to test actual connectivity
      const response = await fetch(`/favicon.ico?_t=${Date.now()}`, {
        method: 'HEAD',
        cache: 'no-store',
      });
      if (response.ok || response.status < 500) {
        setIsOffline(false);
        setShowReconnected(true);
        setDismissed(false);
        setTimeout(() => setShowReconnected(false), 4000);
      } else {
        setIsOffline(true);
      }
    } catch {
      setIsOffline(true);
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    // Initial check
    if (typeof window !== 'undefined') {
      if (!navigator.onLine) {
        setIsOffline(true);
      }

      const handleOnline = () => {
        setIsOffline(false);
        setShowReconnected(true);
        setDismissed(false);
        setTimeout(() => setShowReconnected(false), 4000);
      };

      const handleOffline = () => {
        setIsOffline(true);
        setShowReconnected(false);
        setDismissed(false);
      };

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  if (!isOffline && !showReconnected) {
    return null;
  }

  // If dismissed during current offline session, keep a minimal floating badge
  if (isOffline && dismissed) {
    return (
      <button
        onClick={() => setDismissed(false)}
        className="fixed bottom-5 left-5 z-50 flex items-center gap-2 px-3 py-2 bg-red-950/90 border border-red-500/30 text-red-200 text-xs font-semibold rounded-full shadow-lg backdrop-blur-md hover:bg-red-900 transition-all duration-200"
        title="You are currently offline"
        aria-label="Offline status indicator"
      >
        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
        <span>Offline</span>
      </button>
    );
  }

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[92%] max-w-xl animate-in fade-in slide-in-from-top-4 duration-300">
      {isOffline ? (
        <div className="bg-brand-surface/95 dark:bg-[#121212]/95 border border-red-500/40 rounded-2xl p-3.5 sm:p-4 shadow-2xl shadow-red-950/30 backdrop-blur-md text-brand-cream">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                <WifiOff className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <p className="text-sm font-bold text-brand-cream flex items-center gap-2">
                  <span>No Internet Connection</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/20 text-red-300 border border-red-500/30">
                    Offline
                  </span>
                </p>
                <p className="text-xs text-brand-cream/60 mt-0.5">
                  Some features may not be available until you reconnect.
                </p>
              </div>
            </div>

            <button
              onClick={() => setDismissed(true)}
              className="p-1.5 text-brand-cream/40 hover:text-brand-cream rounded-lg hover:bg-white/5 transition-colors shrink-0"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 pt-3 border-t border-brand-cream/10 flex items-center justify-between gap-2 text-xs">
            <Link
              href="/offline"
              className="text-brand-yellow hover:underline font-semibold flex items-center gap-1"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              View Offline Page
            </Link>

            <button
              onClick={checkConnection}
              disabled={isChecking}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-yellow text-brand-black font-bold hover:bg-brand-yellow-hover transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
              <span>{isChecking ? 'Checking...' : 'Retry'}</span>
            </button>
          </div>
        </div>
      ) : showReconnected ? (
        <div className="bg-emerald-950/95 border border-emerald-500/40 rounded-2xl p-3 sm:p-3.5 shadow-2xl shadow-emerald-950/30 backdrop-blur-md text-emerald-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 shrink-0">
              <Wifi className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-emerald-200">
                You&apos;re back online!
              </p>
              <p className="text-[11px] text-emerald-300/70">
                Connection restored successfully.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowReconnected(false)}
            className="p-1 text-emerald-300/60 hover:text-emerald-100 rounded-md hover:bg-emerald-900/40 transition-colors"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
