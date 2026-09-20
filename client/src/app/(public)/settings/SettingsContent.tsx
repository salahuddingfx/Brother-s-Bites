'use client';

import { useState, FormEvent, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  User as UserIcon,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Home,
  Building2,
  Compass,
  MapPin,
  Save,
  ArrowLeft,
  Sparkles,
  LogOut,
  Settings as SettingsIcon,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

export default function SettingsContent() {
  const router = useRouter();
  const { user, loading: authLoading, updateProfile, logout } = useAuth();

  // Profile update state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState("Cox's Bazar");
  const [area, setArea] = useState('');
  const [landmark, setLandmark] = useState('');

  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Change Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setStreet(user.address?.street || '');
      setCity(user.address?.city || "Cox's Bazar");
      setArea(user.address?.area || '');
      setLandmark(user.address?.landmark || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);
    setSavingProfile(true);

    const res = await updateProfile({
      name: name.trim(),
      phone: phone.trim(),
      address: {
        street: street.trim(),
        city: city.trim() || "Cox's Bazar",
        area: area.trim(),
        landmark: landmark.trim(),
      },
    });

    setSavingProfile(false);

    if (res.success) {
      setProfileMsg({ type: 'success', text: 'Profile details & delivery address saved successfully!' });
      setTimeout(() => setProfileMsg(null), 4000);
    } else {
      setProfileMsg({ type: 'error', text: res.message || 'Failed to update profile.' });
    }
  };

  const handleUpdatePassword = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (!currentPassword) {
      setPasswordMsg({ type: 'error', text: 'Please enter your current password.' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 6 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match. Please re-check.' });
      return;
    }

    setSavingPassword(true);

    try {
      await api.put('/auth/change-password', {
        currentPassword,
        newPassword,
      });

      setPasswordMsg({ type: 'success', text: 'Your password has been changed successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordMsg(null), 4000);
    } catch (err: any) {
      setPasswordMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update password. Please check your current password.',
      });
    } finally {
      setSavingPassword(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center pt-24 pb-16">
        <Loader2 className="w-8 h-8 text-brand-yellow animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-brand-black pt-28 pb-16 px-4">
        <div className="container-bb max-w-lg mx-auto text-center card-bb p-8 sm:p-10 border-brand-yellow/20 bg-brand-surface-light rounded-3xl shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-brand-yellow/10 border border-brand-yellow/20 text-brand-yellow flex items-center justify-center mx-auto mb-4 shadow-lg">
            <SettingsIcon size={32} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-brand-cream tracking-tight mb-2">
            Account Settings
          </h1>
          <p className="text-sm text-brand-cream/60 leading-relaxed mb-6">
            Please sign in to access your personal profile, security preferences, and password settings.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/login?redirect=/settings"
              className="btn-primary !h-11 px-6 font-bold text-xs uppercase tracking-wider justify-center shadow-lg shadow-brand-yellow/15"
            >
              Sign In to Your Account
            </Link>
            <Link
              href="/register?redirect=/settings"
              className="btn-secondary !h-11 px-6 font-bold text-xs uppercase tracking-wider justify-center"
            >
              Create New Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const inputClass =
    'w-full bg-brand-surface border border-white/10 rounded-xl px-4 py-2.5 text-brand-cream text-sm placeholder-brand-cream/30 focus:outline-none focus:border-brand-yellow transition-colors';
  const labelClass = 'block text-brand-cream/70 text-xs font-semibold uppercase tracking-wider mb-1.5';

  return (
    <div className="min-h-screen bg-brand-black pt-28 pb-20 px-4">
      <div className="container-bb max-w-4xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/account"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-cream/60 hover:text-brand-yellow transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Dashboard</span>
          </Link>
          <span className="text-xs text-brand-yellow font-bold uppercase tracking-wider flex items-center gap-1">
            <Sparkles size={12} />
            <span>Member Settings</span>
          </span>
        </div>

        {/* Page Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-brand-cream tracking-tight flex items-center gap-3">
            <SettingsIcon className="w-7 h-7 text-brand-yellow" />
            <span>Account Settings & Security</span>
          </h1>
          <p className="text-xs sm:text-sm text-brand-cream/60 mt-1">
            Manage your personal credentials, contact info, default delivery address, and password security.
          </p>
        </div>

        {/* 1. Security & Change Password Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-brand-surface-light border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-brand-yellow/15 border border-brand-yellow/30 flex items-center justify-center text-brand-yellow">
                <KeyRound size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-brand-cream">Change Account Password</h2>
                <p className="text-xs text-brand-cream/50">Keep your account safe by setting a strong password</p>
              </div>
            </div>
            <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck size={12} />
              <span>Encrypted</span>
            </span>
          </div>

          {passwordMsg && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                'mb-6 p-4 rounded-2xl text-xs font-semibold flex items-center gap-2.5',
                passwordMsg.type === 'success'
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                  : 'bg-red-500/10 border border-red-500/30 text-red-400'
              )}
            >
              {passwordMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              )}
              <span>{passwordMsg.text}</span>
            </motion.div>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-xl">
            {/* Current Password */}
            <div>
              <label className={labelClass}>Current Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-cream/40 pointer-events-none" />
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  placeholder="Enter your current password"
                  className={cn(inputClass, 'pl-10 pr-10')}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-cream/40 hover:text-brand-cream transition-colors"
                  aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                >
                  {showCurrentPassword ? <EyeOff size={16} className="text-brand-yellow" /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className={labelClass}>New Password (Min. 6 characters) *</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-cream/40 pointer-events-none" />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Enter new strong password"
                  className={cn(inputClass, 'pl-10 pr-10')}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-cream/40 hover:text-brand-cream transition-colors"
                  aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                >
                  {showNewPassword ? <EyeOff size={16} className="text-brand-yellow" /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className={labelClass}>Confirm New Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-cream/40 pointer-events-none" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Re-enter new password"
                  className={cn(inputClass, 'pl-10 pr-10')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-cream/40 hover:text-brand-cream transition-colors"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={16} className="text-brand-yellow" /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={savingPassword}
                className="btn-primary !h-11 px-6 font-bold text-xs uppercase tracking-wider gap-2 shadow-lg shadow-brand-yellow/15"
              >
                {savingPassword ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <Save size={15} />
                    <span>Update Password</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {/* 2. Personal Profile & Contact Information Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-brand-surface-light border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl"
        >
          <div className="pb-4 mb-6 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <UserIcon size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-brand-cream">Personal Information & Address</h2>
                <p className="text-xs text-brand-cream/50">Details used for food delivery & order synchronization</p>
              </div>
            </div>
          </div>

          {profileMsg && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                'mb-6 p-4 rounded-2xl text-xs font-semibold flex items-center gap-2.5',
                profileMsg.type === 'success'
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                  : 'bg-red-500/10 border border-red-500/30 text-red-400'
              )}
            >
              {profileMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              )}
              <span>{profileMsg.text}</span>
            </motion.div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Full Display Name *</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-cream/40 pointer-events-none" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className={cn(inputClass, 'pl-10')}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Phone Number (Used for Guest Sync) *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-cream/40 pointer-events-none" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className={cn(inputClass, 'pl-10')}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Email Address (Account Identifier)</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-cream/40 pointer-events-none" />
                  <input
                    type="email"
                    value={user.email || ''}
                    disabled
                    className={cn(inputClass, 'pl-10 opacity-60 cursor-not-allowed bg-black/40')}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Username</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-yellow font-mono text-xs">@</span>
                  <input
                    type="text"
                    value={user.username || user.name.toLowerCase().replace(/\s+/g, '_')}
                    disabled
                    className={cn(inputClass, 'pl-8 opacity-60 cursor-not-allowed bg-black/40 font-mono')}
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 space-y-4">
              <div>
                <label className={labelClass}>Default Street / Hotel / Resort Name</label>
                <div className="relative">
                  <Home className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-cream/40 pointer-events-none" />
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className={cn(inputClass, 'pl-10')}
                    placeholder="e.g. Hotel Sayeman / Kolatoli Main Road"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>City</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-cream/40 pointer-events-none" />
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className={cn(inputClass, 'pl-10')}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Area / Zone</label>
                  <div className="relative">
                    <Compass className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-cream/40 pointer-events-none" />
                    <input
                      type="text"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className={cn(inputClass, 'pl-10')}
                      placeholder="e.g. Inani Beach Point, Sugandha Point"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className={labelClass}>Nearby Landmark</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-cream/40 pointer-events-none" />
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    className={cn(inputClass, 'pl-10')}
                    placeholder="Nearby famous grocery or beach access road"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="submit"
                disabled={savingProfile}
                className="btn-primary !h-11 px-8 text-xs font-bold uppercase tracking-wider gap-2 shadow-lg shadow-brand-yellow/15"
              >
                {savingProfile ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Saving Profile...</span>
                  </>
                ) : (
                  <>
                    <Save size={15} />
                    <span>Save Profile Information</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => logout()}
                className="btn-secondary !h-10 px-4 text-xs font-bold gap-1.5 text-red-400 hover:bg-red-500/10 border-red-500/20"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}


