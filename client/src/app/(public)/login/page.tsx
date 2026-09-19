'use client';

import { useState, FormEvent, Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Receipt,
  Utensils,
  MapPin,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/account';

  const { user, login, loading: authLoading } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If already logged in, redirect automatically
  useEffect(() => {
    if (!authLoading && user) {
      router.replace(redirect);
    }
  }, [user, authLoading, router, redirect]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim()) {
      setError('Please enter your email or phone number');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    const res = await login(identifier.trim(), password);
    setLoading(false);

    if (res.success) {
      router.push(redirect);
    } else {
      setError(res.message || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      {/* Left Column: Brand & Benefits (Visible on lg) */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex lg:col-span-5 flex-col justify-between p-8 rounded-3xl bg-gradient-to-br from-brand-surface via-brand-surface-light to-brand-surface border border-white/10 relative overflow-hidden shadow-2xl h-full min-h-[540px]"
      >
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-yellow/10 border border-brand-yellow/20 text-brand-yellow text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Brother&apos;s Bites Club
          </div>

          <h2 className="text-3xl font-display font-black text-brand-cream tracking-tight mb-4">
            Welcome back to the <span className="text-brand-yellow">Best Bites</span> in Cox&apos;s Bazar.
          </h2>

          <p className="text-sm text-brand-cream/70 leading-relaxed mb-8">
            Sign in to unlock personalized food ordering, speedy checkouts, and complete order history.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-white/[0.03] border border-white/5">
              <div className="w-9 h-9 rounded-xl bg-brand-yellow/15 flex items-center justify-center shrink-0 text-brand-yellow">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-brand-cream uppercase tracking-wide">1-Click Fast Checkout</h4>
                <p className="text-xs text-brand-cream/60">Your Cox&apos;s Bazar address auto-fills automatically every time.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-white/[0.03] border border-white/5">
              <div className="w-9 h-9 rounded-xl bg-brand-yellow/15 flex items-center justify-center shrink-0 text-brand-yellow">
                <Receipt className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-brand-cream uppercase tracking-wide">Digital Invoices & Tracking</h4>
                <p className="text-xs text-brand-cream/60">View instant itemized receipts and live delivery status.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-white/[0.03] border border-white/5">
              <div className="w-9 h-9 rounded-xl bg-brand-yellow/15 flex items-center justify-center shrink-0 text-brand-yellow">
                <Utensils className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-brand-cream uppercase tracking-wide">1-Click Re-Ordering</h4>
                <p className="text-xs text-brand-cream/60">Loved your previous meal? Re-order with a single tap.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-brand-cream/50">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-brand-yellow" /> Cox&apos;s Bazar, Bangladesh
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Secure 256-bit Login
          </span>
        </div>
      </motion.div>

      {/* Right Column: Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="lg:col-span-7 bg-brand-surface/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative"
      >
        <div className="text-center sm:text-left mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-yellow/10 border border-brand-yellow/20 text-brand-yellow text-xs font-bold uppercase tracking-wider mb-3 lg:hidden">
            <Sparkles className="w-3.5 h-3.5" />
            Customer Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-brand-cream tracking-tight">
            Sign In to Your Account
          </h1>
          <p className="text-sm text-brand-cream/60 mt-1.5">
            Enter your registered email or phone number to continue.
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-center gap-3"
          >
            <div className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-cream/70 mb-2">
              Email or Phone Number
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-brand-cream/40 pointer-events-none" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. name@example.com or 01812345678"
                required
                className="w-full bg-black/40 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-brand-cream placeholder-brand-cream/30 focus:outline-none focus:border-brand-yellow/50 focus:ring-1 focus:ring-brand-yellow/50 transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-brand-cream/70">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-brand-cream/40 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full bg-black/40 border border-white/10 rounded-2xl pl-11 pr-11 py-3.5 text-sm text-brand-cream placeholder-brand-cream/30 focus:outline-none focus:border-brand-yellow/50 focus:ring-1 focus:ring-brand-yellow/50 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-cream/40 hover:text-brand-cream transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-brand-yellow text-brand-black font-extrabold text-sm uppercase tracking-wider hover:bg-yellow-400 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-brand-yellow/20 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing In...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center space-y-4">
          <p className="text-sm text-brand-cream/60">
            Don&apos;t have an account yet?{' '}
            <Link
              href={`/register${redirect !== '/account' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
              className="text-brand-yellow font-bold hover:underline"
            >
              Create Account
            </Link>
          </p>

          <div className="flex items-center justify-center gap-4 text-xs text-brand-cream/40">
            <Link href="/" className="hover:text-brand-cream transition-colors">
              Home
            </Link>
            <span>•</span>
            <Link href="/menu" className="hover:text-brand-cream transition-colors">
              Menu
            </Link>
            <span>•</span>
            <Link href="/checkout" className="hover:text-brand-cream transition-colors">
              Guest Checkout
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center p-12 text-brand-cream/60">
            <Loader2 className="w-8 h-8 animate-spin text-brand-yellow mb-3" />
            <p className="text-sm">Loading login...</p>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
