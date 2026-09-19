'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import {
  Loader2,
  Eye,
  EyeOff,
  User as UserIcon,
  Lock,
  KeyRound,
  X,
  Send,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';

export default function AdminLoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot password modal states
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [generatedResetUrl, setGeneratedResetUrl] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', {
        identifier: identifier.trim(),
        password,
      });

      if (res.data?.data?.token) {
        localStorage.setItem('bb_admin_token', res.data.data.token);
      }

      window.location.href = '/admin/dashboard';
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Invalid username/email or password'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');
    setGeneratedResetUrl('');
    setForgotLoading(true);

    try {
      const res = await api.post('/auth/forgot-password', {
        email: forgotEmail.trim(),
      });
      setForgotSuccess(
        res.data?.message || 'Password reset link generated.'
      );
      if (res.data?.data?.resetUrl) {
        setGeneratedResetUrl(res.data.data.resetUrl);
      }
    } catch (err: any) {
      setForgotError(
        err.response?.data?.message || 'Failed to process forgot password request.'
      );
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-black text-brand-cream flex items-center justify-center p-4 selection:bg-brand-yellow selection:text-brand-black">
      <div className="w-full max-w-md">
        <div className="bg-brand-surface-light rounded-3xl border border-white/10 p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-yellow/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none" />

          {/* Logo & Header */}
          <div className="text-center mb-8 relative">
            <Link href="/" className="inline-block group">
              <img
                src="/images/logo-icon.png"
                alt="Brother's Bites"
                className="w-16 h-16 object-contain rounded-2xl mx-auto mb-4 bg-brand-surface p-1.5 border border-brand-yellow/30 shadow-lg group-hover:scale-105 transition-transform duration-200"
              />
            </Link>
            <h1 className="text-brand-cream text-2xl font-extrabold tracking-tight">
              Admin Portal
            </h1>
            <p className="text-brand-cream/60 text-xs mt-1">
              Sign in to manage orders, menus & restaurant operations
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 relative">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-xs font-medium flex items-center gap-2 animate-in fade-in duration-200">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Username or Email Input */}
            <div>
              <label className="block text-brand-cream/80 text-xs font-semibold uppercase tracking-wider mb-2">
                Username or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-cream/40">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  autoComplete="username"
                  className="w-full bg-brand-surface border border-white/10 rounded-xl pl-10 pr-4 py-3 text-brand-cream text-sm placeholder-brand-cream/30 focus:outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow transition-all duration-200"
                  placeholder="admin or admin@brothersbites.com"
                />
              </div>
            </div>

            {/* Password Input with Show/Hide Toggle */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-brand-cream/80 text-xs font-semibold uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotModalOpen(true);
                    setForgotError('');
                    setForgotSuccess('');
                    setGeneratedResetUrl('');
                  }}
                  className="text-xs text-brand-yellow hover:underline font-semibold transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-cream/40">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full bg-brand-surface border border-white/10 rounded-xl pl-10 pr-11 py-3 text-brand-cream text-sm placeholder-brand-cream/30 focus:outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow transition-all duration-200"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-brand-cream/40 hover:text-brand-cream transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-brand-yellow" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Return to Public Site */}
          <div className="mt-6 pt-6 border-t border-white/10 text-center text-xs text-brand-cream/50">
            <Link href="/" className="hover:text-brand-yellow transition-colors font-semibold">
              ← Return to Brother&apos;s Bites Home
            </Link>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-brand-surface-light border border-white/15 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setForgotModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 text-brand-cream/40 hover:text-brand-cream rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-yellow/15 border border-brand-yellow/30 flex items-center justify-center text-brand-yellow">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-brand-cream">
                  Reset Password
                </h2>
                <p className="text-xs text-brand-cream/60">
                  Enter your registered admin email address
                </p>
              </div>
            </div>

            {forgotError && (
              <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-xs">
                {forgotError}
              </div>
            )}

            {forgotSuccess && (
              <div className="mb-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-emerald-300 text-xs space-y-2">
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{forgotSuccess}</span>
                </div>
                {generatedResetUrl && (
                  <div className="mt-2 p-2.5 bg-black/40 rounded-lg border border-emerald-500/20">
                    <p className="text-[11px] text-brand-cream/70 mb-1">
                      Direct Reset Link (Local/Dev Mode):
                    </p>
                    <Link
                      href={generatedResetUrl}
                      className="text-xs font-mono text-brand-yellow hover:underline break-all block"
                    >
                      {generatedResetUrl}
                    </Link>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-brand-cream/70 text-xs font-semibold mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                  placeholder="admin@brothersbites.com"
                  className="w-full bg-brand-surface border border-white/10 rounded-xl px-4 py-2.5 text-brand-cream text-sm placeholder-brand-cream/30 focus:outline-none focus:border-brand-yellow transition-colors"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-brand-cream/70 hover:text-brand-cream transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="btn-primary py-2 px-4 text-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  {forgotLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Generate Reset Link</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-brand-cream/50 text-center">
              Need immediate help? Contact Super Admin directly at{' '}
              <span className="text-brand-yellow font-semibold">+880 1812-345678</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
