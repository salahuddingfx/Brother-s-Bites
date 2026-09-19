'use client';

import { useState, useEffect, FormEvent } from 'react';
import api from '@/lib/api';
import { useAuth } from '../layout';
import {
  User as UserIcon,
  Mail,
  Phone,
  ShieldCheck,
  Shield,
  ChefHat,
  UserCog,
  Save,
  Loader2,
  Lock,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Eye,
  EyeOff,
  AtSign,
} from 'lucide-react';
import { UserRole } from '@/types';

export default function AdminProfilePage() {
  const { user, setUser } = useAuth();

  // Profile fields
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setUsername(user.username || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);
    setSavingProfile(true);

    try {
      const res = await api.put('/auth/profile', {
        name: name.trim(),
        username: username.trim() || undefined,
        email: email.trim(),
        phone: phone.trim() || undefined,
      });

      const updatedUser = res.data?.data;
      if (updatedUser) {
        setUser(updatedUser);
      }
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err: any) {
      setProfileMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update profile.',
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 6 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match. Please verify.' });
      return;
    }

    setSavingPassword(true);

    try {
      await api.put('/auth/change-password', {
        currentPassword,
        newPassword,
      });

      setPasswordMsg({ type: 'success', text: 'Password updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update password. Please check your current password.',
      });
    } finally {
      setSavingPassword(false);
    }
  };

  const getRoleBadge = (r?: UserRole) => {
    switch (r) {
      case 'super_admin':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-yellow/15 text-brand-yellow border border-brand-yellow/30">
            <ShieldCheck className="w-4 h-4" />
            Super Administrator
          </span>
        );
      case 'manager':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
            <UserCog className="w-4 h-4" />
            Restaurant Manager
          </span>
        );
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30">
            <Shield className="w-4 h-4" />
            Administrator
          </span>
        );
      case 'staff':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <ChefHat className="w-4 h-4" />
            Kitchen Staff
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="heading-md text-brand-cream font-extrabold tracking-tight flex items-center gap-3">
          <UserIcon className="w-7 h-7 text-brand-yellow" />
          <span>My Admin Profile</span>
        </h1>
        <p className="text-xs sm:text-sm text-brand-cream/60 mt-1">
          Manage your personal account credentials, username, contact info, and security.
        </p>
      </div>

      {/* Top Profile Summary Card */}
      <div className="bg-brand-surface-light border border-brand-border rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-brand-yellow text-brand-black font-black text-3xl sm:text-4xl flex items-center justify-center shadow-lg uppercase shrink-0">
            {user?.name?.charAt(0) || 'A'}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-brand-cream">{user?.name}</h2>
              <div>{getRoleBadge(user?.role)}</div>
            </div>

            <p className="text-xs text-brand-cream/60 font-mono">
              @{user?.username || user?.email?.split('@')[0]}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-brand-cream/70">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-brand-yellow" />
                {user?.email}
              </span>
              {user?.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-brand-yellow" />
                  {user.phone}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details Form Card */}
      <div className="bg-brand-surface-light border border-brand-border rounded-3xl p-6 sm:p-8 shadow-xl">
        <h3 className="text-lg font-bold text-brand-cream mb-4 pb-3 border-b border-brand-border flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-brand-yellow" />
          <span>Personal Information</span>
        </h3>

        {profileMsg && (
          <div
            className={`p-4 rounded-xl text-xs font-semibold mb-6 flex items-center gap-2 ${
              profileMsg.type === 'success'
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                : 'bg-red-500/10 border border-red-500/30 text-red-400'
            }`}
          >
            {profileMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{profileMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-brand-cream/80 mb-2">
                Full Display Name *
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-cream/40" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Salahuddin"
                  className="w-full bg-brand-surface border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-brand-cream text-xs sm:text-sm focus:outline-none focus:border-brand-yellow"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-cream/80 mb-2">
                Login Username
              </label>
              <div className="relative">
                <AtSign className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-cream/40" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. admin"
                  className="w-full bg-brand-surface border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-brand-cream text-xs sm:text-sm focus:outline-none focus:border-brand-yellow"
                />
              </div>
              <p className="text-[11px] text-brand-cream/40 mt-1">
                You can sign in using this username or your email address.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-brand-cream/80 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-cream/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@brothersbites.com"
                  className="w-full bg-brand-surface border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-brand-cream text-xs sm:text-sm focus:outline-none focus:border-brand-yellow"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-cream/80 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-cream/40" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+880 1812-345678"
                  className="w-full bg-brand-surface border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-brand-cream text-xs sm:text-sm focus:outline-none focus:border-brand-yellow"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end">
            <button
              type="submit"
              disabled={savingProfile}
              className="btn-primary text-xs flex items-center gap-2 disabled:opacity-50"
            >
              {savingProfile ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Profile...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Profile Details</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Change Password Card */}
      <div className="bg-brand-surface-light border border-brand-border rounded-3xl p-6 sm:p-8 shadow-xl">
        <h3 className="text-lg font-bold text-brand-cream mb-4 pb-3 border-b border-brand-border flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-brand-yellow" />
          <span>Change Account Password</span>
        </h3>

        {passwordMsg && (
          <div
            className={`p-4 rounded-xl text-xs font-semibold mb-6 flex items-center gap-2 ${
              passwordMsg.type === 'success'
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                : 'bg-red-500/10 border border-red-500/30 text-red-400'
            }`}
          >
            {passwordMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{passwordMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-semibold text-brand-cream/80 mb-2">
              Current Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-cream/40" />
              <input
                type={showCurrentPass ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                placeholder="Enter current password"
                className="w-full bg-brand-surface border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-brand-cream text-xs sm:text-sm focus:outline-none focus:border-brand-yellow"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPass((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-cream/40 hover:text-brand-cream"
              >
                {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-cream/80 mb-2">
              New Password * (Min. 6 characters)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-cream/40" />
              <input
                type={showNewPass ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Enter new password"
                className="w-full bg-brand-surface border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-brand-cream text-xs sm:text-sm focus:outline-none focus:border-brand-yellow"
              />
              <button
                type="button"
                onClick={() => setShowNewPass((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-cream/40 hover:text-brand-cream"
              >
                {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-cream/80 mb-2">
              Confirm New Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-cream/40" />
              <input
                type={showNewPass ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Repeat new password"
                className="w-full bg-brand-surface border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-brand-cream text-xs sm:text-sm focus:outline-none focus:border-brand-yellow"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={savingPassword || !currentPassword || !newPassword}
              className="btn-primary text-xs flex items-center gap-2 disabled:opacity-50"
            >
              {savingPassword ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Update Account Password</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
