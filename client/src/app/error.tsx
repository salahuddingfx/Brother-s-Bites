'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home, WifiOff } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to console or monitoring service
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center bg-brand-surface border border-brand-cream/10 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Error Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-brand-yellow/15 border border-brand-yellow/30 flex items-center justify-center text-brand-yellow shadow-inner">
          <AlertTriangle className="w-10 h-10 animate-pulse" />
        </div>

        <h1 className="heading-md text-brand-cream mb-2 font-bold">
          Something Went Wrong
        </h1>

        <p className="text-sm text-brand-cream/70 mb-6 max-w-sm mx-auto leading-relaxed">
          {error?.message && error.message.toLowerCase().includes('fetch')
            ? 'We could not reach the server. You might be offline or the connection timed out.'
            : 'An unexpected issue occurred while loading this page. Please try again.'}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto btn-primary flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto btn-secondary flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Go Home</span>
          </Link>
        </div>

        {/* Fallback to offline info */}
        <div className="mt-6 pt-6 border-t border-brand-cream/10">
          <Link
            href="/offline"
            className="inline-flex items-center gap-1.5 text-xs text-brand-yellow hover:underline font-semibold"
          >
            <WifiOff className="w-3.5 h-3.5" />
            <span>Having connection issues? View Offline Support</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
