'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-[#040404] text-[#FEF4E5] min-h-screen flex items-center justify-center p-4 antialiased">
        <div className="max-w-md w-full text-center bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-[#FEBD0F]/15 border border-[#FEBD0F]/30 flex items-center justify-center text-[#FEBD0F]">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">
            Application Error
          </h1>

          <p className="text-sm text-white/70 mb-6 leading-relaxed">
            {error?.message || 'A critical error occurred. Please try reloading the application.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => reset()}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#FEBD0F] text-[#040404] font-bold text-xs uppercase tracking-wider hover:bg-[#E5A90D] transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>

            <Link
              href="/"
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#121212] border border-white/15 text-white font-bold text-xs uppercase tracking-wider hover:border-[#FEBD0F] transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span>Go Home</span>
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
