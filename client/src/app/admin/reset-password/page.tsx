'use client';

import { useState, FormEvent, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
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
} from 'lucide-react';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialToken = searchParams.get('token') || '';

  const [token, setToken] = useState(initialToken);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
        router.push('/admin/login');
      }, 2000);
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Failed to reset password. Token may be invalid or expired.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-black text-brand-cream flex items-center justify-center p-4 selection:bg-brand-yellow selection:text-brand-black">
      <div className="w-full max-w-md">
        <div className="bg-brand-surface-light rounded-3xl border border-white/10 p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-brand-yellow/15 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-brand-yellow/15 border border-brand-yellow/30 flex items-center justify-center text-brand-yellow mx-auto mb-4 shadow-lg">
              <KeyRound className="w-7 h-7" />
            </div>
            <h1 className="text-brand-cream text-2xl font-extrabold tracking-tight">
              Create New Password
            </h1>
            <p className="text-brand-cream/60 text-xs mt-1">
              Enter your token and set a new password for your admin account
            </p>
          </div>

          {error && (
            <div className="mb-5 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-xs font-medium flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="text-center py-6 space-y-3 animate-in fade-in duration-300">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-brand-cream">Password Reset Successful!</h2>
              <p className="text-xs text-brand-cream/70">
                Redirecting you to the login page...
              </p>
              <Link href="/admin/login" className="btn-primary inline-flex items-center gap-1.5 text-xs mt-2">
                <span>Go to Login</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              {/* Token field */}
              {!initialToken && (
                <div>
                  <label className="block text-brand-cream/80 text-xs font-semibold uppercase tracking-wider mb-2">
                    Reset Token
                  </label>
                  <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    required
                    placeholder="Paste reset token here"
                    className="w-full bg-brand-surface border border-white/10 rounded-xl px-4 py-3 text-brand-cream text-sm placeholder-brand-cream/30 focus:outline-none focus:border-brand-yellow font-mono transition-colors"
                  />
                </div>
              )}

              {/* New Password */}
              <div>
                <label className="block text-brand-cream/80 text-xs font-semibold uppercase tracking-wider mb-2">
                  New Password
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
                    placeholder="At least 6 characters"
                    className="w-full bg-brand-surface border border-white/10 rounded-xl pl-10 pr-11 py-3 text-brand-cream text-sm placeholder-brand-cream/30 focus:outline-none focus:border-brand-yellow transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-brand-cream/40 hover:text-brand-cream transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-brand-yellow" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-brand-cream/80 text-xs font-semibold uppercase tracking-wider mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-cream/40">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Repeat new password"
                    className="w-full bg-brand-surface border border-white/10 rounded-xl pl-10 pr-4 py-3 text-brand-cream text-sm placeholder-brand-cream/30 focus:outline-none focus:border-brand-yellow transition-colors"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Resetting Password...</span>
                  </>
                ) : (
                  <>
                    <span>Set New Password</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-white/10 text-center text-xs text-brand-cream/50">
            <Link href="/admin/login" className="hover:text-brand-yellow transition-colors font-semibold">
              ← Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-brand-black flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-brand-yellow animate-spin" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
