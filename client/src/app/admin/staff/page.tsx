'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { User, UserRole } from '@/types';
import { useAuth } from '../layout';
import {
  Users,
  UserPlus,
  Shield,
  ShieldCheck,
  ChefHat,
  UserCog,
  Trash2,
  Edit2,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Loader2,
  X,
  Search,
  AlertCircle,
  Phone,
  Mail,
  User as UserIcon,
} from 'lucide-react';

export default function StaffManagementPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('staff');
  const [phone, setPhone] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [formError, setFormError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/users');
      setUsers(res.data?.data || []);
    } catch (err: any) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const resetForm = () => {
    setName('');
    setUsername('');
    setEmail('');
    setPassword('');
    setRole('staff');
    setPhone('');
    setIsActive(true);
    setFormError('');
    setSelectedUser(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setCreateModalOpen(true);
  };

  const handleOpenEdit = (u: User) => {
    setSelectedUser(u);
    setName(u.name);
    setUsername(u.username || '');
    setEmail(u.email);
    setRole(u.role);
    setPhone(u.phone || '');
    setIsActive(u.isActive);
    setPassword('');
    setFormError('');
    setEditModalOpen(true);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setActionLoading(true);

    try {
      await api.post('/users', {
        name,
        username: username.trim() || undefined,
        email: email.trim(),
        password,
        role,
        phone: phone.trim() || undefined,
        isActive,
      });
      setCreateModalOpen(false);
      resetForm();
      fetchUsers();
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to create team member');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setFormError('');
    setActionLoading(true);

    try {
      const payload: any = {
        name,
        username: username.trim() || undefined,
        email: email.trim(),
        role,
        phone: phone.trim() || undefined,
        isActive,
      };
      if (password) {
        payload.password = password;
      }

      await api.put(`/users/${selectedUser._id}`, payload);
      setEditModalOpen(false);
      resetForm();
      fetchUsers();
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to update user');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (id: string, userName: string) => {
    if (!confirm(`Are you sure you want to remove ${userName} from the team?`)) return;

    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleToggleStatus = async (u: User) => {
    try {
      await api.put(`/users/${u._id}`, { isActive: !u.isActive });
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const getRoleBadge = (r: UserRole) => {
    switch (r) {
      case 'super_admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-brand-yellow/15 text-brand-yellow border border-brand-yellow/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            Super Admin
          </span>
        );
      case 'manager':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
            <UserCog className="w-3.5 h-3.5" />
            Manager
          </span>
        );
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30">
            <Shield className="w-3.5 h-3.5" />
            Admin
          </span>
        );
      case 'staff':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <ChefHat className="w-3.5 h-3.5" />
            Kitchen Staff
          </span>
        );
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.username && u.username.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const isSuperAdmin = currentUser?.role === 'super_admin';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="heading-md text-brand-cream font-extrabold tracking-tight flex items-center gap-3">
            <Users className="w-7 h-7 text-brand-yellow" />
            <span>Staff & Multi-Admin Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-brand-cream/60 mt-1">
            Manage restaurant team accounts, assign roles, and configure dashboard access control (RBAC).
          </p>
        </div>

        {isSuperAdmin && (
          <button
            onClick={handleOpenCreate}
            className="btn-primary flex items-center justify-center gap-2 self-start sm:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Team Member</span>
          </button>
        )}
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-brand-surface border border-white/10 rounded-2xl p-4">
          <p className="text-xs text-brand-cream/60">Total Accounts</p>
          <p className="text-2xl font-extrabold text-brand-cream mt-1">{users.length}</p>
        </div>
        <div className="bg-brand-surface border border-white/10 rounded-2xl p-4">
          <p className="text-xs text-brand-cream/60">Super Admins</p>
          <p className="text-2xl font-extrabold text-brand-yellow mt-1">
            {users.filter((u) => u.role === 'super_admin').length}
          </p>
        </div>
        <div className="bg-brand-surface border border-white/10 rounded-2xl p-4">
          <p className="text-xs text-brand-cream/60">Managers / Admins</p>
          <p className="text-2xl font-extrabold text-purple-400 mt-1">
            {users.filter((u) => u.role === 'manager' || u.role === 'admin').length}
          </p>
        </div>
        <div className="bg-brand-surface border border-white/10 rounded-2xl p-4">
          <p className="text-xs text-brand-cream/60">Kitchen / Staff</p>
          <p className="text-2xl font-extrabold text-emerald-400 mt-1">
            {users.filter((u) => u.role === 'staff').length}
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-brand-surface border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-cream/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, username or email..."
            className="w-full bg-brand-surface-light border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-brand-cream placeholder-brand-cream/30 focus:outline-none focus:border-brand-yellow"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-brand-cream/60 shrink-0">Filter Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-brand-surface-light border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-brand-cream focus:outline-none focus:border-brand-yellow"
          >
            <option value="all">All Roles</option>
            <option value="super_admin">Super Admin</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
            <option value="staff">Kitchen Staff</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-brand-surface border border-white/10 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <Loader2 className="w-8 h-8 text-brand-yellow animate-spin mx-auto mb-2" />
            <p className="text-xs text-brand-cream/60">Loading team members...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-16 text-center">
            <Users className="w-10 h-10 text-brand-cream/20 mx-auto mb-2" />
            <p className="text-sm font-semibold text-brand-cream">No team members found</p>
            <p className="text-xs text-brand-cream/50 mt-1">
              Try adjusting your search query or role filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-brand-surface-light/50 text-[11px] font-bold text-brand-cream/60 uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Member</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs sm:text-sm">
                {filteredUsers.map((u) => {
                  const isCurrent = currentUser?._id === u._id;
                  return (
                    <tr
                      key={u._id}
                      className="hover:bg-brand-surface-light/40 transition-colors"
                    >
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-brand-yellow/10 border border-brand-yellow/30 flex items-center justify-center text-brand-yellow font-bold text-sm shrink-0">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-brand-cream flex items-center gap-2">
                              <span>{u.name}</span>
                              {isCurrent && (
                                <span className="text-[10px] bg-brand-yellow/20 text-brand-yellow px-1.5 py-0.5 rounded font-bold">
                                  You
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-brand-cream/50">
                              @{u.username || u.email.split('@')[0]}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">{getRoleBadge(u.role)}</td>

                      <td className="py-4 px-4">
                        <div className="space-y-0.5 text-xs text-brand-cream/70">
                          <p className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-brand-cream/40" />
                            <span>{u.email}</span>
                          </p>
                          {u.phone && (
                            <p className="flex items-center gap-1.5 text-brand-cream/50">
                              <Phone className="w-3.5 h-3.5 text-brand-cream/40" />
                              <span>{u.phone}</span>
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        {isSuperAdmin && !isCurrent ? (
                          <button
                            onClick={() => handleToggleStatus(u)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                              u.isActive
                                ? 'bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30'
                                : 'bg-red-500/15 text-red-300 hover:bg-red-500/25 border border-red-500/30'
                            }`}
                          >
                            {u.isActive ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Active</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Inactive</span>
                              </>
                            )}
                          </button>
                        ) : (
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                              u.isActive
                                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                                : 'bg-red-500/15 text-red-300 border border-red-500/30'
                            }`}
                          >
                            {u.isActive ? 'Active' : 'Inactive'}
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isSuperAdmin && (
                            <button
                              onClick={() => handleOpenEdit(u)}
                              className="p-2 rounded-lg bg-brand-surface-light border border-white/10 hover:border-brand-yellow text-brand-cream/70 hover:text-brand-yellow transition-colors"
                              title="Edit Member"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}

                          {isSuperAdmin && !isCurrent && (
                            <button
                              onClick={() => handleDeleteUser(u._id, u.name)}
                              className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 hover:border-red-500 text-red-400 hover:text-red-300 transition-colors"
                              title="Delete Member"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modals */}
      {(createModalOpen || editModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-brand-surface-light border border-white/15 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setCreateModalOpen(false);
                setEditModalOpen(false);
              }}
              className="absolute top-5 right-5 p-1.5 text-brand-cream/40 hover:text-brand-cream rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-brand-cream mb-1 flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-yellow" />
              <span>{createModalOpen ? 'Add New Team Member' : 'Edit Team Member'}</span>
            </h2>
            <p className="text-xs text-brand-cream/60 mb-6">
              {createModalOpen
                ? 'Create a login account and assign a role for your staff.'
                : 'Modify account details, roles, or update credentials.'}
            </p>

            {formError && (
              <div className="mb-5 bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={createModalOpen ? handleCreateUser : handleUpdateUser} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-cream/80 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Hasan Mahmud"
                    className="w-full bg-brand-surface border border-white/10 rounded-xl px-3.5 py-2.5 text-brand-cream text-xs sm:text-sm focus:outline-none focus:border-brand-yellow"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-cream/80 mb-1.5">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. hasan_kitchen"
                    className="w-full bg-brand-surface border border-white/10 rounded-xl px-3.5 py-2.5 text-brand-cream text-xs sm:text-sm focus:outline-none focus:border-brand-yellow"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-cream/80 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="hasan@brothersbites.com"
                    className="w-full bg-brand-surface border border-white/10 rounded-xl px-3.5 py-2.5 text-brand-cream text-xs sm:text-sm focus:outline-none focus:border-brand-yellow"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-cream/80 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+880 1812..."
                    className="w-full bg-brand-surface border border-white/10 rounded-xl px-3.5 py-2.5 text-brand-cream text-xs sm:text-sm focus:outline-none focus:border-brand-yellow"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-cream/80 mb-1.5">
                    Assigned Role *
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full bg-brand-surface border border-white/10 rounded-xl px-3.5 py-2.5 text-brand-cream text-xs sm:text-sm focus:outline-none focus:border-brand-yellow"
                  >
                    <option value="staff">Kitchen Staff (Orders Only)</option>
                    <option value="manager">Manager (Orders, Menu, Offers)</option>
                    <option value="admin">Admin (All Operations)</option>
                    <option value="super_admin">Super Admin (Full Root Access)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-cream/80 mb-1.5">
                    {createModalOpen ? 'Account Password *' : 'Change Password (Optional)'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required={createModalOpen}
                      placeholder={createModalOpen ? 'Min. 6 characters' : 'Leave blank to keep'}
                      className="w-full bg-brand-surface border border-white/10 rounded-xl pl-3.5 pr-10 py-2.5 text-brand-cream text-xs sm:text-sm focus:outline-none focus:border-brand-yellow"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-brand-cream/40 hover:text-brand-cream transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4 text-brand-yellow" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 accent-brand-yellow rounded"
                  />
                  <span className="text-xs font-semibold text-brand-cream">
                    Active Account (Can login)
                  </span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCreateModalOpen(false);
                      setEditModalOpen(false);
                    }}
                    className="px-4 py-2 rounded-lg text-xs font-bold text-brand-cream/70 hover:text-brand-cream transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="btn-primary py-2 px-5 text-xs flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {actionLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>{createModalOpen ? 'Create Account' : 'Save Changes'}</span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
