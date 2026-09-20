'use client';

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
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
  CheckCircle2,
  KeyRound,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import api from '@/lib/api';

export default function AuthModal() {
  const { isAuthModalOpen, authModalTab, openAuthModal, closeAuthModal, login, register } = useAuth();
  const activeTab = authModalTab;
  const setActiveTab = (tab: 'login' | 'register' | 'forgot') => {
    openAuthModal(tab);
    setError('');
    setSuccessMsg('');
    setGeneratedResetUrl('');
  };

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Forgot password form
  const [forgotEmail, setForgotEmail] = useState('');
  const [generatedResetUrl, setGeneratedResetUrl] = useState('');

  // Login form
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form
  const [regForm, setRegForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    street: '',
    city: "Cox's Bazar",
    area: '',
  });

  if (!isAuthModalOpen) return null;

  const handleForgotSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setGeneratedResetUrl('');
    setLoading(true);

    try {
      const res = await api.post('/auth/forgot-password', {
        email: forgotEmail.trim(),
      });
      setSuccessMsg(
        res.data?.message || 'Password reset instructions have been generated.'
      );
      if (res.data?.data?.resetUrl) {
        setGeneratedResetUrl(res.data.data.resetUrl);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Failed to process forgot password request.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(loginIdentifier.trim(), loginPassword);
    setLoading(false);

    if (!res.success) {
      setError(res.message || 'Login failed. Please check your credentials.');
    } else {
      setSuccessMsg('Welcome back to Brother\'s Bites!');
      setTimeout(() => {
        closeAuthModal();
      }, 800);
    }
  };

  const handleRegisterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!regForm.name.trim() || !regForm.email.trim() || !regForm.phone.trim() || !regForm.password) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);

    const res = await register({
      name: regForm.name.trim(),
      email: regForm.email.trim(),
      phone: regForm.phone.trim(),
      password: regForm.password,
      address: {
        street: regForm.street.trim() || undefined,
        city: regForm.city.trim() || "Cox's Bazar",
        area: regForm.area.trim() || undefined,
      },
    });

    setLoading(false);

    if (!res.success) {
      setError(res.message || 'Registration failed. Please try again.');
    } else {
      setSuccessMsg('Account created successfully! You are now logged in.');
      setTimeout(() => {
        closeAuthModal();
      }, 1000);
    }
  };

  const inputClass =
    'w-full bg-brand-surface border border-white/10 rounded-xl px-4 py-2.5 text-brand-cream text-sm placeholder-brand-cream/30 focus:outline-none focus:border-brand-yellow transition-colors';
  const labelClass = 'block text-brand-cream/70 text-xs font-semibold uppercase tracking-wider mb-1.5';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-brand-surface-light border border-white/15 rounded-2xl shadow-2xl p-6 sm:p-7 z-10 overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-2 text-brand-cream/50 hover:text-brand-cream hover:bg-white/5 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>

          {/* Brand Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-yellow/10 border border-brand-yellow/20 text-brand-yellow text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles size={12} />
              <span>Brother&apos;s Bites Club</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-brand-cream tracking-tight">
              {activeTab === 'login'
                ? 'Welcome Back, Friend!'
                : activeTab === 'register'
                ? "Join Brother's Bites"
                : 'Reset Your Password'}
            </h2>
            <p className="text-xs text-brand-cream/50 mt-1">
              {activeTab === 'login'
                ? 'Sign in to access saved addresses & 1-click checkout'
                : activeTab === 'register'
                ? 'Create an account to save your delivery info & track past orders'
                : 'Enter your email to receive password reset instructions'}
            </p>
          </div>

          {/* Tab Switcher */}
          {activeTab === 'forgot' ? (
            <div className="flex items-center justify-between bg-black/40 px-3 py-2 rounded-xl border border-white/5 mb-6">
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-cream/70 hover:text-brand-yellow transition-colors"
              >
                <ArrowLeft size={14} />
                <span>Back to Sign In</span>
              </button>
              <div className="flex items-center gap-1 text-[11px] text-brand-yellow font-bold uppercase tracking-wider">
                <KeyRound size={12} />
                <span>Recovery</span>
              </div>
            </div>
          ) : (
            <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 mb-6">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  setError('');
                }}
                className={cn(
                  'flex-1 py-2 text-xs font-bold rounded-lg transition-all',
                  activeTab === 'login'
                    ? 'bg-brand-yellow text-brand-black shadow-sm font-extrabold'
                    : 'text-brand-cream/60 hover:text-brand-cream'
                )}
              >
                SIGN IN
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('register');
                  setError('');
                }}
                className={cn(
                  'flex-1 py-2 text-xs font-bold rounded-lg transition-all',
                  activeTab === 'register'
                    ? 'bg-brand-yellow text-brand-black shadow-sm font-extrabold'
                    : 'text-brand-cream/60 hover:text-brand-cream'
                )}
              >
                CREATE ACCOUNT
              </button>
            </div>
          )}

          {/* Feedback Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs flex items-center gap-2">
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs flex items-center gap-2 font-medium">
              <CheckCircle2 size={16} className="shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Forms */}
          {activeTab === 'forgot' ? (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div>
                <label className={labelClass}>Registered Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-cream/40 pointer-events-none" />
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className={cn(inputClass, 'pl-10')}
                    placeholder="name@email.com"
                    required
                  />
                </div>
              </div>

              {generatedResetUrl && (
                <div className="p-3 bg-brand-yellow/10 border border-brand-yellow/30 rounded-xl text-xs space-y-2">
                  <div className="flex items-center gap-1.5 text-brand-yellow font-bold">
                    <Sparkles size={14} />
                    <span>Reset Link Ready</span>
                  </div>
                  <a
                    href={generatedResetUrl}
                    onClick={() => closeAuthModal()}
                    className="text-brand-yellow underline break-all font-mono text-[11px] block hover:text-white"
                  >
                    Click here to reset password &rarr;
                  </a>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center !h-11 font-bold text-xs uppercase tracking-wider mt-2 gap-2 shadow-lg shadow-brand-yellow/15"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Generating Link...
                  </>
                ) : (
                  'SEND RESET INSTRUCTIONS'
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="inline-flex items-center gap-1.5 text-xs text-brand-cream/60 hover:text-brand-yellow transition-colors font-semibold"
                >
                  <ArrowLeft size={14} />
                  <span>Back to Sign In</span>
                </button>
              </div>
            </form>
          ) : activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className={labelClass}>Email or Username *</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-cream/40 pointer-events-none" />
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className={cn(inputClass, 'pl-10')}
                    placeholder="you@email.com or username"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-brand-cream/70 text-xs font-semibold uppercase tracking-wider">
                    Password *
                  </label>
                  <button
                    type="button"
                    onClick={() => setActiveTab('forgot')}
                    className="text-xs text-brand-yellow hover:underline font-semibold transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-cream/40 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className={cn(inputClass, 'pl-10 pr-10')}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-cream/40 hover:text-brand-cream transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center !h-11 font-bold text-xs uppercase tracking-wider mt-2 gap-2 shadow-lg shadow-brand-yellow/15"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'SIGN IN TO YOUR ACCOUNT'
                )}
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-brand-cream/50">
                  Don&apos;t have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('register')}
                    className="text-brand-yellow font-bold hover:underline"
                  >
                    Create Account
                  </button>
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 max-h-[60vh] overflow-y-auto pr-1">
              <div>
                <label className={labelClass}>Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-cream/40 pointer-events-none" />
                  <input
                    type="text"
                    value={regForm.name}
                    onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                    className={cn(inputClass, 'pl-10')}
                    placeholder="e.g. Salah Uddin"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Phone Number *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-cream/40 pointer-events-none" />
                    <input
                      type="tel"
                      value={regForm.phone}
                      onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                      className={cn(inputClass, 'pl-10')}
                      placeholder="+880 1..."
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-cream/40 pointer-events-none" />
                    <input
                      type="email"
                      value={regForm.email}
                      onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                      className={cn(inputClass, 'pl-10')}
                      placeholder="name@email.com"
                      required
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
                    value={regForm.password}
                    onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                    className={cn(inputClass, 'pl-10 pr-10')}
                    placeholder="Min 6 characters"
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-cream/40 hover:text-brand-cream transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Default Address Section (Optional for permanent customer) */}
              <div className="pt-2 border-t border-white/5 space-y-3">
                <p className="text-[11px] font-bold text-brand-cream/40 uppercase tracking-wider">
                  Default Delivery Address (For 1-Click Checkout)
                </p>

                <div>
                  <div className="relative">
                    <Home className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-cream/40 pointer-events-none" />
                    <input
                      type="text"
                      value={regForm.street}
                      onChange={(e) => setRegForm({ ...regForm, street: e.target.value })}
                      className={cn(inputClass, 'pl-10')}
                      placeholder="House/Street/Hotel Name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="relative">
                      <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-cream/40 pointer-events-none" />
                      <input
                        type="text"
                        value={regForm.city}
                        onChange={(e) => setRegForm({ ...regForm, city: e.target.value })}
                        className={cn(inputClass, 'pl-10')}
                        placeholder="City"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="relative">
                      <Compass className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-cream/40 pointer-events-none" />
                      <input
                        type="text"
                        value={regForm.area}
                        onChange={(e) => setRegForm({ ...regForm, area: e.target.value })}
                        className={cn(inputClass, 'pl-10')}
                        placeholder="Area / Zone"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center !h-11 font-bold text-xs uppercase tracking-wider mt-3 gap-2 shadow-lg shadow-brand-yellow/15"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'CREATE PERMANENT ACCOUNT'
                )}
              </button>

              <div className="text-center pt-1">
                <p className="text-xs text-brand-cream/50">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('login')}
                    className="text-brand-yellow font-bold hover:underline"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
