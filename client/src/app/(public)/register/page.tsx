'use client';

import { useState, FormEvent, Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  User as UserIcon,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Home,
  Building2,
  Compass,
  Loader2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Gift,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/account';

  const { user, register, loading: authLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    street: '',
    city: "Cox's Bazar",
    area: '',
    landmark: '',
  });

  // If already logged in, redirect automatically
  useEffect(() => {
    if (!authLoading && user) {
      router.replace(redirect);
    }
  }, [user, authLoading, router, redirect]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!formData.phone.trim()) {
      setError('Please enter your phone number');
      return;
    }
    if (!formData.email.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    const res = await register({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      password: formData.password,
      address: formData.street || formData.area ? {
        street: formData.street.trim(),
        city: formData.city.trim() || "Cox's Bazar",
        area: formData.area.trim(),
        landmark: formData.landmark.trim(),
      } : undefined,
    });
    setLoading(false);

    if (res.success) {
      router.push(redirect);
    } else {
      setError(res.message || 'Registration failed. Please try again.');
    }
  };

  const labelClass = 'block text-xs font-bold uppercase tracking-wider text-brand-cream/70 mb-1.5';
  const inputClass =
    'w-full bg-black/40 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-sm text-brand-cream placeholder-brand-cream/30 focus:outline-none focus:border-brand-yellow/50 focus:ring-1 focus:ring-brand-yellow/50 transition-colors';

  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Member Perks */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex lg:col-span-5 flex-col justify-between p-8 rounded-3xl bg-gradient-to-br from-brand-surface via-brand-surface-light to-brand-surface border border-white/10 relative overflow-hidden shadow-2xl sticky top-24"
      >
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-yellow/10 border border-brand-yellow/20 text-brand-yellow text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Permanent Member Perks
          </div>

          <h2 className="text-3xl font-display font-black text-brand-cream tracking-tight mb-4">
            Join the <span className="text-brand-yellow">Brother&apos;s Bites</span> Family.
          </h2>

          <p className="text-sm text-brand-cream/70 leading-relaxed mb-6">
            Create your permanent customer profile once, and enjoy ultra-fast 1-click food delivery everywhere across Cox&apos;s Bazar.
          </p>

          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
              <div className="w-9 h-9 rounded-xl bg-brand-yellow/15 flex items-center justify-center shrink-0 text-brand-yellow">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-brand-cream uppercase tracking-wide">Instant Checkout Auto-Fill</h4>
                <p className="text-xs text-brand-cream/60">No need to type your address every time. 1-click order confirmation.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
              <div className="w-9 h-9 rounded-xl bg-brand-yellow/15 flex items-center justify-center shrink-0 text-brand-yellow">
                <Gift className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-brand-cream uppercase tracking-wide">Member-Only Deals & Coupons</h4>
                <p className="text-xs text-brand-cream/60">Enjoy automatic discount eligibility on special occasions.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
              <div className="w-9 h-9 rounded-xl bg-brand-yellow/15 flex items-center justify-center shrink-0 text-brand-yellow">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-brand-cream uppercase tracking-wide">Order History & Invoices</h4>
                <p className="text-xs text-brand-cream/60">Instant digital receipts and 1-tap re-ordering anytime.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-brand-cream/50">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Free & Instant Signup
          </span>
          <span className="text-brand-yellow font-medium">Cox&apos;s Bazar Delivery</span>
        </div>
      </motion.div>

      {/* Right Column: Registration Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="lg:col-span-7 bg-brand-surface/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative"
      >
        <div className="text-center sm:text-left mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-yellow/10 border border-brand-yellow/20 text-brand-yellow text-xs font-bold uppercase tracking-wider mb-3 lg:hidden">
            <Sparkles className="w-3.5 h-3.5" />
            Join Brother&apos;s Bites Club
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-brand-cream tracking-tight">
            Create Customer Account
          </h1>
          <p className="text-sm text-brand-cream/60 mt-1.5">
            Fill in your details to get started with 1-click orders.
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Full Name *</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-cream/40 pointer-events-none" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Salah Uddin"
                required
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Phone Number *</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-cream/40 pointer-events-none" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="018XXXXXXXX"
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-cream/40 pointer-events-none" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  required
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass}>Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-cream/40 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                required
                minLength={6}
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-cream/40 hover:text-brand-cream transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Delivery Address Section */}
          <div className="pt-3 border-t border-white/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-yellow flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5" />
                Saved Delivery Address (Optional)
              </span>
              <span className="text-[10px] text-brand-cream/40 uppercase font-semibold">For 1-Click Checkout</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className={labelClass}>Street Address / Hotel / House</label>
                <div className="relative">
                  <Home className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-cream/40 pointer-events-none" />
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="e.g. Hotel Sea Crown, Room 402 or Flat 3B"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>City</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-cream/40 pointer-events-none" />
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Cox's Bazar"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Area / Zone</label>
                  <div className="relative">
                    <Compass className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-cream/40 pointer-events-none" />
                    <input
                      type="text"
                      name="area"
                      value={formData.area}
                      onChange={handleChange}
                      placeholder="e.g. Sugandha, Kolatoli, Laboni"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className={labelClass}>Nearby Landmark</label>
                <div className="relative">
                  <Compass className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-cream/40 pointer-events-none" />
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                    placeholder="e.g. Opposite to Burmese Market"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-brand-yellow text-brand-black font-extrabold text-sm uppercase tracking-wider hover:bg-yellow-400 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-brand-yellow/20 disabled:opacity-60 disabled:cursor-not-allowed mt-4"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                Create Permanent Account
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center space-y-4">
          <p className="text-sm text-brand-cream/60">
            Already have an account?{' '}
            <Link
              href={`/login${redirect !== '/account' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
              className="text-brand-yellow font-bold hover:underline"
            >
              Sign In
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

export default function RegisterPage() {
  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center p-12 text-brand-cream/60">
            <Loader2 className="w-8 h-8 animate-spin text-brand-yellow mb-3" />
            <p className="text-sm">Loading registration...</p>
          </div>
        }
      >
        <RegisterForm />
      </Suspense>
    </div>
  );
}
