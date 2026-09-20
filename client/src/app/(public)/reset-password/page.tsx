'use client';

import { useState, FormEvent, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import {
  KeyRound,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  Lock,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialToken = searchParams.get('token') || '';

  const [token, setToken] = useState(initialToken);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleReset = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    if (!token.trim()) {
      setError('Reset token is required.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/reset-password', {
        token: token.trim(),
        newPassword,
      });
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2500);
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Failed to reset password. Token may be invalid or expired.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-brand-black text-brand-cream flex items-center justify-center py-12 px-4 selection:bg-brand-yellow selection:text-brand-black">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-brand-surface/90 border border-white/10 rounded-3xl p-6 sm:p-9 shadow-2xl relative overflow-hidden backdrop-blur-xl"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-brand-yellow/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="text-center mb-8 relative">
            <div className="w-14 h-14 rounded-2xl bg-brand-yellow/15 border border-brand-yellow/30 flex items-center justify-center text-brand-yellow mx-auto mb-4 shadow-lg">
              <KeyRound className="w-7 h-7" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-yellow/10 border border-brand-yellow/20 text-brand-yellow text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles size={12} />
              <span>Password Recovery</span>
            </div>
            <h1 className="text-brand-cream text-2xl sm:text-3xl font-display font-black tracking-tight">
              Create New Password
            </h1>
            <p className="text-brand-cream/60 text-xs sm:text-sm mt-1.5">
              Enter your secure new password to regain access to your account.
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 bg-red-500/10 border border-red-500/30 rounded-2xl px-4 py-3 text-red-400 text-xs font-medium flex items-center gap-2.5"
            >
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </motion.div>
          )}

          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6 space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-brand-cream">Password Reset Successful!</h2>
                <p className="text-xs text-brand-cream/70 mt-1">
                  Your password has been updated. Redirecting you to login...
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/login"
                  className="w-full py-3.5 rounded-2xl bg-brand-yellow text-brand-black font-extrabold text-xs uppercase tracking-wider hover:bg-yellow-400 inline-flex items-center justify-center gap-2 shadow-lg shadow-brand-yellow/20 transition-all"
                >
                  <span>Go to Login</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              {/* Token field (only shown if not in URL) */}
              {!initialToken && (
                <div>
                  <label className="block text-brand-cream/80 text-xs font-semibold uppercase tracking-wider mb-2">
                    Reset Token *
                  </label>
                  <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    required
                    placeholder="Paste the reset token from your link"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-brand-cream text-sm placeholder-brand-cream/30 focus:outline-none focus:border-brand-yellow/50 focus:ring-1 focus:ring-brand-yellow/50 transition-colors font-mono"
                  />
                </div>
              )}

              {/* New Password */}
              <div>
                <label className="block text-brand-cream/80 text-xs font-semibold uppercase tracking-wider mb-2">
                  New Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-cream/40">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="At least 6 characters"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl pl-10 pr-11 py-3 text-brand-cream text-sm placeholder-brand-cream/30 focus:outline-none focus:border-brand-yellow/50 focus:ring-1 focus:ring-brand-yellow/50 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-brand-cream/40 hover:text-brand-cream transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 text-brand-yellow" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-brand-cream/80 text-xs font-semibold uppercase tracking-wider mb-2">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-cream/40">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="Re-enter your new password"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl pl-10 pr-11 py-3 text-brand-cream text-sm placeholder-brand-cream/30 focus:outline-none focus:border-brand-yellow/50 focus:ring-1 focus:ring-brand-yellow/50 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-brand-cream/40 hover:text-brand-cream transition-colors"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4 text-brand-yellow" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-brand-yellow text-brand-black font-extrabold text-xs uppercase tracking-wider hover:bg-yellow-400 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-yellow/20 disabled:opacity-60 disabled:cursor-not-allowed mt-4"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Resetting Password...</span>
                  </>
                ) : (
                  <>
                    <span>Reset Password</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Back link */}
          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs text-brand-cream/60 hover:text-brand-yellow transition-colors font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function PublicResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-yellow" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
