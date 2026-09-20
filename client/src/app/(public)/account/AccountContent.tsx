'use client';

import { useState, useEffect, FormEvent, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PackageCheck,
  User as UserIcon,
  MapPin,
  Clock,
  Receipt,
  RotateCw,
  Loader2,
  CheckCircle2,
  Phone,
  Mail,
  Home,
  Building2,
  Compass,
  Sparkles,
  Utensils,
  ExternalLink,
  ShieldCheck,
  ShoppingBag,
  ArrowRight,
  ChevronRight,
  Search,
  Filter,
  CreditCard,
  TrendingUp,
  Award,
  Flame,
  RefreshCw,
  LogOut,
  Truck,
  Plus,
  Settings,
  Star,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import api from '@/lib/api';
import { Order, MenuItem } from '@/types';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import type { InvoiceOrderData } from '@/components/orders/InvoiceModal';
const InvoiceModal = dynamic(() => import('@/components/orders/InvoiceModal'), { ssr: false });
const ReviewModal = dynamic(() => import('@/components/reviews/ReviewModal'), { ssr: false });

export default function AccountContent() {
  const { user, loading: authLoading, updateProfile, logout } = useAuth();
  const { addItem, openCart } = useCart();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'profile' | 'perks'>('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [syncingOrders, setSyncingOrders] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<InvoiceOrderData | null>(null);
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null);
  const [reviewToast, setReviewToast] = useState('');

  // Orders Filter & Search
  const [orderFilter, setOrderFilter] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');
  const [orderSearch, setOrderSearch] = useState('');

  // Featured / Quick add menu items
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([]);

  // Profile Form state
  const [profileForm, setProfileForm] = useState(() => ({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || "Cox's Bazar",
    area: user?.address?.area || '',
    landmark: user?.address?.landmark || '',
  }));
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  const fetchOrders = async (showToast = false) => {
    if (!user) return;
    if (showToast) setSyncingOrders(true);
    try {
      const res = await api.get('/orders/my-orders');
      setOrders(res.data.data || []);
      if (showToast) {
        setSyncMessage('Orders synced successfully!');
        setTimeout(() => setSyncMessage(''), 3000);
      }
    } catch {
      setOrders([]);
    } finally {
      setLoadingOrders(false);
      if (showToast) setSyncingOrders(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (user) {
      setProfileForm({
        name: user.name || '',
        phone: user.phone || '',
        street: user.address?.street || '',
        city: user.address?.city || "Cox's Bazar",
        area: user.address?.area || '',
        landmark: user.address?.landmark || '',
      });

      fetchOrders();

      // Fetch featured items for Quick Order
      api
        .get('/menu/featured')
        .then((res) => {
          if (isMounted && res.data.data) {
            setFeaturedItems(res.data.data.slice(0, 4));
          }
        })
        .catch(() => {
          // Fallback to general menu
          api
            .get('/menu')
            .then((res) => {
              if (isMounted && res.data.data) {
                setFeaturedItems((res.data.data || []).slice(0, 4));
              }
            })
            .catch(() => {});
        });
    } else {
      setLoadingOrders(false);
    }

    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    setSavingProfile(true);

    const res = await updateProfile({
      name: profileForm.name.trim(),
      phone: profileForm.phone.trim(),
      address: {
        street: profileForm.street.trim(),
        city: profileForm.city.trim() || "Cox's Bazar",
        area: profileForm.area.trim(),
        landmark: profileForm.landmark.trim(),
      },
    });

    setSavingProfile(false);

    if (res.success) {
      setProfileSuccess('Profile & default address updated successfully!');
      setTimeout(() => setProfileSuccess(''), 3500);
    } else {
      setProfileError(res.message || 'Failed to update profile.');
    }
  };

  const handleReorder = async (order: Order) => {
    for (const item of order.items) {
      await addItem(
        {
          _id: typeof item.menuItem === 'string' ? item.menuItem : item.menuItem,
          name: item.name,
          price: item.price,
          category: '',
          slug: '',
          isAvailable: true,
          isFeatured: false,
          sortOrder: 0,
          createdAt: '',
          updatedAt: '',
          image: item.image,
        },
        item.quantity,
        item.specialInstructions
      );
    }
    openCart();
  };

  const handleQuickAdd = async (item: MenuItem) => {
    await addItem(item, 1);
    openCart();
  };

  // Calculations
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, ord) => sum + (ord.totalAmount || 0), 0);
    const activeOrders = orders.filter((o) =>
      ['pending', 'confirmed', 'preparing', 'out_for_delivery'].includes(o.status)
    );
    const completedOrders = orders.filter((o) => o.status === 'delivered');
    return {
      totalOrders,
      totalSpent,
      activeOrders,
      completedOrders,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      // Status filter
      if (orderFilter === 'active') {
        if (!['pending', 'confirmed', 'preparing', 'out_for_delivery'].includes(ord.status)) return false;
      } else if (orderFilter === 'completed') {
        if (ord.status !== 'delivered') return false;
      } else if (orderFilter === 'cancelled') {
        if (ord.status !== 'cancelled') return false;
      }

      // Search filter
      if (orderSearch.trim()) {
        const query = orderSearch.toLowerCase().trim();
        const matchesNumber = ord.orderNumber.toLowerCase().includes(query);
        const matchesItem = ord.items.some((i) => i.name.toLowerCase().includes(query));
        return matchesNumber || matchesItem;
      }

      return true;
    });
  }, [orders, orderFilter, orderSearch]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center pt-24 pb-16">
        <Loader2 className="w-8 h-8 text-brand-yellow animate-spin" />
      </div>
    );
  }

  // If not signed in, show member invitation
  if (!user) {
    return (
      <div className="min-h-screen bg-brand-black pt-28 pb-16 px-4">
        <div className="container-bb max-w-lg mx-auto text-center card-bb p-8 sm:p-10 border-brand-yellow/20 bg-brand-surface-light rounded-3xl shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-brand-yellow/10 border border-brand-yellow/20 text-brand-yellow flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Sparkles size={32} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-brand-cream tracking-tight mb-2">
            Brother&apos;s Bites Club Hub
          </h1>
          <p className="text-sm text-brand-cream/60 leading-relaxed mb-6">
            Sign in to view your past orders, download official tax receipts, and save your delivery addresses for 1-click checkout.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/login?redirect=/account"
              className="btn-primary !h-11 px-6 font-bold text-xs uppercase tracking-wider justify-center shadow-lg shadow-brand-yellow/15"
            >
              Sign In to Your Account
            </Link>
            <Link
              href="/register?redirect=/account"
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'out_for_delivery':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'preparing':
      case 'confirmed':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'cancelled':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      default:
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
    }
  };

  const isAdminOrStaff = ['super_admin', 'admin', 'manager', 'staff'].includes(user.role);

  return (
    <div className="min-h-screen bg-brand-black pt-28 pb-20 px-4">
      <div className="container-bb max-w-6xl mx-auto space-y-6">

        {/* 1. Profile Banner Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-gradient-to-r from-brand-surface-light via-brand-surface to-brand-surface-light border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden"
        >
          {/* Subtle Ambient Lighting */}
          <div className="absolute -top-24 -right-24 w-60 h-60 bg-brand-yellow/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* User Meta */}
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-brand-yellow to-yellow-500 text-brand-black font-black text-2xl sm:text-3xl flex items-center justify-center shadow-xl shadow-brand-yellow/20 shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-xl sm:text-2xl font-black text-brand-cream tracking-tight">
                    {user.name}
                  </h1>
                  <span className="text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-brand-yellow/15 text-brand-yellow border border-brand-yellow/30 flex items-center gap-1">
                    <Sparkles size={11} />
                    <span>Brother&apos;s Bites Club</span>
                  </span>
                  {isAdminOrStaff && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30">
                      {user.role.replace('_', ' ')}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-brand-cream/60">
                  {user.username && (
                    <span className="font-mono text-brand-yellow/80">@{user.username}</span>
                  )}
                  {user.phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone size={12} className="text-brand-yellow" />
                      <span>{user.phone}</span>
                    </span>
                  )}
                  {user.email && (
                    <span className="flex items-center gap-1.5">
                      <Mail size={12} className="text-brand-yellow" />
                      <span>{user.email}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
              {isAdminOrStaff && (
                <Link
                  href="/admin/dashboard"
                  className="flex-1 lg:flex-none btn-secondary !h-10 px-4 text-xs font-bold gap-1.5 border-rose-500/30 text-rose-300 hover:bg-rose-500/10"
                >
                  <ShieldCheck size={14} />
                  <span>Admin Hub</span>
                </Link>
              )}

              <button
                type="button"
                onClick={() => fetchOrders(true)}
                disabled={syncingOrders}
                className="flex-1 lg:flex-none btn-secondary !h-10 px-3.5 text-xs font-semibold gap-1.5"
                title="Sync orders associated with your phone/email"
              >
                <RefreshCw size={13} className={cn(syncingOrders && 'animate-spin text-brand-yellow')} />
                <span>{syncingOrders ? 'Syncing...' : 'Sync Orders'}</span>
              </button>

              <Link
                href="/settings"
                className="flex-1 lg:flex-none btn-secondary !h-10 px-3.5 text-xs font-semibold gap-1.5"
                title="Account Settings & Password Security"
              >
                <Settings size={14} className="text-brand-yellow" />
                <span>Settings</span>
              </Link>

              <Link
                href="/menu"
                className="flex-1 lg:flex-none btn-primary !h-10 px-5 text-xs font-extrabold uppercase tracking-wider shrink-0 gap-1.5 shadow-lg shadow-brand-yellow/20"
              >
                <Utensils size={14} />
                <span>ORDER FRESH FOOD</span>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Review Toast Feedback */}
        {reviewToast && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-2xl text-xs flex items-center justify-between gap-3 font-medium shadow-lg shadow-amber-500/5"
          >
            <div className="flex items-center gap-2">
              <Star size={16} className="shrink-0 text-amber-400 fill-amber-400" />
              <span>{reviewToast}</span>
            </div>
            <span className="text-[11px] text-amber-400/70">Verified Customer Review</span>
          </motion.div>
        )}

        {/* Sync Toast Feedback */}
        {syncMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl text-xs flex items-center justify-between gap-3 font-medium"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="shrink-0" />
              <span>{syncMessage}</span>
            </div>
            <span className="text-[11px] text-emerald-400/70">Matched by phone & email</span>
          </motion.div>
        )}

        {/* 2. Overview Stats Metric Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-brand-surface-light border border-white/10 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-brand-cream/60 uppercase tracking-wider">Total Orders</span>
              <div className="w-8 h-8 rounded-xl bg-brand-yellow/15 flex items-center justify-center text-brand-yellow">
                <PackageCheck size={16} />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-brand-cream">{stats.totalOrders}</div>
            <p className="text-[11px] text-brand-cream/40 mt-1">Placed across Brother&apos;s Bites</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-brand-surface-light border border-white/10 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-brand-cream/60 uppercase tracking-wider">Total Spent</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400">
                <CreditCard size={16} />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-brand-yellow">৳{stats.totalSpent}</div>
            <p className="text-[11px] text-brand-cream/40 mt-1">Earned Coastal Food Points</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-brand-surface-light border border-white/10 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-brand-cream/60 uppercase tracking-wider">Active Orders</span>
              <div className={cn(
                'w-8 h-8 rounded-xl flex items-center justify-center',
                stats.activeOrders.length > 0 ? 'bg-amber-500/20 text-amber-400 animate-pulse' : 'bg-white/5 text-brand-cream/40'
              )}>
                <Truck size={16} />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-brand-cream">{stats.activeOrders.length}</div>
            <p className="text-[11px] text-brand-cream/40 mt-1">
              {stats.activeOrders.length > 0 ? 'Currently in kitchen / delivery' : 'No pending kitchen orders'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-brand-surface-light border border-white/10 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-brand-cream/60 uppercase tracking-wider">Delivery Hub</span>
              <div className="w-8 h-8 rounded-xl bg-blue-500/15 flex items-center justify-center text-blue-400">
                <MapPin size={16} />
              </div>
            </div>
            <div className="text-sm font-bold text-brand-cream truncate">
              {user.address?.street ? user.address.street : "Cox's Bazar Beach"}
            </div>
            <p className="text-[11px] text-brand-cream/40 mt-1 truncate">
              {user.address?.area ? `${user.address.area}, ${user.address.city || "Cox's Bazar"}` : '1-Click Checkout Ready'}
            </p>
          </motion.div>
        </div>

        {/* 3. Auto-sync guest order informational notice */}
        <div className="p-4 rounded-2xl bg-brand-yellow/5 border border-brand-yellow/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-brand-cream/70">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-brand-yellow shrink-0" />
            <span>
              <strong>Smart Order Sync Active:</strong> Any orders placed previously using phone{' '}
              <strong className="text-brand-cream">{user.phone || 'number'}</strong> or email{' '}
              <strong className="text-brand-cream">{user.email || 'address'}</strong> are automatically linked here.
            </span>
          </div>
          <button
            type="button"
            onClick={() => fetchOrders(true)}
            className="text-brand-yellow font-bold hover:underline shrink-0 text-left sm:text-right"
          >
            Check for updates &rarr;
          </button>
        </div>

        {/* 4. Active In-Progress Order Highlight */}
        {stats.activeOrders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-5 sm:p-6 bg-gradient-to-r from-amber-500/10 via-brand-surface-light to-amber-500/5 border border-amber-500/30 rounded-3xl shadow-xl space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
                <h3 className="text-base sm:text-lg font-black text-brand-cream">
                  Live Order in Progress: <span className="font-mono text-brand-yellow">#{stats.activeOrders[0].orderNumber}</span>
                </h3>
              </div>
              <Link
                href={`/track-order?query=${stats.activeOrders[0].orderNumber}`}
                className="btn-primary !h-9 px-4 text-xs font-bold uppercase tracking-wider gap-1.5 shadow-md shadow-brand-yellow/15"
              >
                <Truck size={14} />
                <span>Live Tracker</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                <span className="text-brand-cream/50 block">Status:</span>
                <span className="font-bold text-amber-400 uppercase tracking-wide">
                  {stats.activeOrders[0].status.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                <span className="text-brand-cream/50 block">Items Count:</span>
                <span className="font-bold text-brand-cream">
                  {stats.activeOrders[0].items.length} items (৳{stats.activeOrders[0].totalAmount})
                </span>
              </div>
              <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                <span className="text-brand-cream/50 block">Order Type:</span>
                <span className="font-bold text-brand-cream">
                  {stats.activeOrders[0].orderType === 'delivery' ? '🚗 Coastal Delivery' : '🏪 Self Pickup'}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* 5. Navigation Tab Switcher */}
        <div className="flex border-b border-white/10 gap-2 sm:gap-6 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={cn(
              'pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all relative shrink-0',
              activeTab === 'overview' ? 'text-brand-yellow' : 'text-brand-cream/60 hover:text-brand-cream'
            )}
          >
            <TrendingUp size={16} />
            <span>Dashboard Overview</span>
            {activeTab === 'overview' && (
              <motion.div layoutId="accountTabIndicator" className="absolute bottom-0 inset-x-0 h-0.5 bg-brand-yellow" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={cn(
              'pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all relative shrink-0',
              activeTab === 'orders' ? 'text-brand-yellow' : 'text-brand-cream/60 hover:text-brand-cream'
            )}
          >
            <PackageCheck size={16} />
            <span>All Orders ({orders.length})</span>
            {activeTab === 'orders' && (
              <motion.div layoutId="accountTabIndicator" className="absolute bottom-0 inset-x-0 h-0.5 bg-brand-yellow" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={cn(
              'pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all relative shrink-0',
              activeTab === 'profile' ? 'text-brand-yellow' : 'text-brand-cream/60 hover:text-brand-cream'
            )}
          >
            <UserIcon size={16} />
            <span>Saved Details & Address</span>
            {activeTab === 'profile' && (
              <motion.div layoutId="accountTabIndicator" className="absolute bottom-0 inset-x-0 h-0.5 bg-brand-yellow" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('perks')}
            className={cn(
              'pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all relative shrink-0',
              activeTab === 'perks' ? 'text-brand-yellow' : 'text-brand-cream/60 hover:text-brand-cream'
            )}
          >
            <Award size={16} />
            <span>Bites Club Perks</span>
            {activeTab === 'perks' && (
              <motion.div layoutId="accountTabIndicator" className="absolute bottom-0 inset-x-0 h-0.5 bg-brand-yellow" />
            )}
          </button>
        </div>

        {/* 6. TAB CONTENTS */}

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Recent Orders Sneak Peek */}
            <div className="card-bb bg-brand-surface-light border-white/10 rounded-3xl p-6 sm:p-7 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div>
                  <h3 className="text-base font-bold text-brand-cream">Recent Orders</h3>
                  <p className="text-xs text-brand-cream/50">Your latest food experiences</p>
                </div>
                {orders.length > 0 && (
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-brand-yellow hover:underline inline-flex items-center gap-1"
                  >
                    <span>View all {orders.length} orders</span>
                    <ChevronRight size={14} />
                  </button>
                )}
              </div>

              {loadingOrders ? (
                <div className="text-center py-10">
                  <Loader2 className="w-7 h-7 text-brand-yellow animate-spin mx-auto mb-2" />
                  <p className="text-xs text-brand-cream/50">Retrieving order history...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <PackageCheck size={36} className="text-brand-cream/20 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-brand-cream">No orders placed yet</p>
                  <p className="text-xs text-brand-cream/50 max-w-sm mx-auto mt-1 mb-4">
                    Explore our coastal appetizers, momos, and drinks below to place your first order!
                  </p>
                  <Link href="/menu" className="btn-primary !h-9 px-5 text-xs font-bold uppercase tracking-wider inline-flex">
                    Browse Menu
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.slice(0, 3).map((ord) => (
                    <div
                      key={ord._id}
                      className="p-4 rounded-2xl bg-black/30 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-white/15 transition-all"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-brand-yellow/15 flex items-center justify-center text-brand-yellow shrink-0">
                          <ShoppingBag size={18} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sm text-brand-cream">#{ord.orderNumber}</span>
                            <span className={cn('text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border', getStatusBadge(ord.status))}>
                              {ord.status.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <p className="text-xs text-brand-cream/50 mt-0.5">
                            {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                        <span className="font-mono font-black text-brand-yellow text-sm sm:text-base">
                          ৳{ord.totalAmount}
                        </span>
                        <div className="flex items-center gap-2">
                          {ord.status === 'delivered' && (
                            <button
                              type="button"
                              onClick={() => setReviewOrder(ord)}
                              className="btn-secondary !h-8 px-2.5 text-xs font-bold gap-1 text-amber-400 border-amber-500/30 hover:bg-amber-500/10"
                              title="Leave a verified review for this order"
                            >
                              <Star size={12} className="text-amber-400 fill-amber-400" />
                              <span>Review</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setSelectedInvoiceOrder(ord as unknown as InvoiceOrderData)}
                            className="btn-secondary !h-8 px-2.5 text-xs"
                            title="Invoice"
                          >
                            <Receipt size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReorder(ord)}
                            className="btn-primary !h-8 px-3 text-xs font-bold uppercase tracking-wider gap-1"
                          >
                            <RotateCw size={12} />
                            <span>Re-Order</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Signature Bites Shelf */}
            {featuredItems.length > 0 && (
              <div className="card-bb bg-brand-surface-light border-white/10 rounded-3xl p-6 sm:p-7 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-brand-yellow" />
                    <h3 className="text-base font-bold text-brand-cream">Popular Coastal Picks for You</h3>
                  </div>
                  <Link href="/menu" className="text-xs font-bold text-brand-yellow hover:underline">
                    Full Menu &rarr;
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {featuredItems.map((item) => (
                    <div
                      key={item._id}
                      className="bg-brand-surface rounded-2xl border border-white/5 p-3.5 flex flex-col justify-between hover:border-brand-yellow/30 transition-all group"
                    >
                      <div>
                        {item.image && (
                          <div className="relative aspect-video rounded-xl overflow-hidden mb-2.5 bg-black/40">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <h4 className="text-xs font-bold text-brand-cream line-clamp-1">{item.name}</h4>
                        <p className="text-[11px] text-brand-cream/50 line-clamp-2 mt-0.5">{item.description}</p>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/5">
                        <span className="font-mono font-black text-brand-yellow text-sm">৳{item.price}</span>
                        <button
                          type="button"
                          onClick={() => handleQuickAdd(item)}
                          className="btn-primary !h-7.5 px-2.5 text-[11px] font-bold uppercase tracking-wider gap-1"
                        >
                          <Plus size={12} />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ALL ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Filter & Search Bar */}
            <div className="card-bb bg-brand-surface-light border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
                {(['all', 'active', 'completed', 'cancelled'] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setOrderFilter(filter)}
                    className={cn(
                      'px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shrink-0',
                      orderFilter === filter
                        ? 'bg-brand-yellow text-brand-black shadow-sm'
                        : 'text-brand-cream/60 hover:text-brand-cream bg-black/30'
                    )}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-cream/40 pointer-events-none" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search by order # or item..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-brand-cream placeholder-brand-cream/30 focus:outline-none focus:border-brand-yellow transition-colors"
                />
              </div>
            </div>

            {loadingOrders ? (
              <div className="text-center py-16">
                <Loader2 className="w-8 h-8 text-brand-yellow animate-spin mx-auto mb-2" />
                <p className="text-xs text-brand-cream/50">Loading your orders...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="card-bb p-12 text-center bg-brand-surface-light border-white/5 rounded-3xl">
                <PackageCheck size={40} className="text-brand-cream/20 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-brand-cream mb-1">
                  {orderSearch || orderFilter !== 'all' ? 'No Matching Orders' : 'No Orders Placed Yet'}
                </h3>
                <p className="text-xs text-brand-cream/50 max-w-sm mx-auto mb-6">
                  {orderSearch || orderFilter !== 'all'
                    ? 'Try adjusting your search or filter settings.'
                    : "You haven't placed any orders with this account yet. Browse our menu to enjoy fresh coastal bites!"}
                </p>
                <Link href="/menu" className="btn-primary !h-10 px-6 text-xs font-bold uppercase tracking-wider inline-flex">
                  Explore Delicious Menu
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((ord) => {
                  const subtotal = Math.max(0, ord.totalAmount - (ord.deliveryFee || 0));
                  return (
                    <motion.div
                      key={ord._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="card-bb bg-brand-surface-light border-white/10 rounded-3xl p-5 sm:p-6 transition-all hover:border-white/20 shadow-xl"
                    >
                      {/* Top Order Row */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/5">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-brand-yellow text-sm sm:text-base">
                            #{ord.orderNumber}
                          </span>
                          <span
                            className={cn(
                              'text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border',
                              getStatusBadge(ord.status)
                            )}
                          >
                            {ord.status.replace(/_/g, ' ')}
                          </span>
                          <span className="text-xs text-brand-cream/50 font-medium">
                            {ord.orderType === 'delivery' ? '🚗 Delivery' : '🏪 Pickup'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-brand-cream/50">
                          <Clock size={13} />
                          <span>
                            {new Date(ord.createdAt).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Items Grid */}
                      <div className="py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {ord.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="bg-brand-surface p-3 rounded-2xl border border-white/5 flex items-center gap-3"
                          >
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 rounded-xl object-cover bg-black/40 border border-white/5 shrink-0"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center text-brand-cream/20 shrink-0">
                                <Utensils size={18} />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold text-brand-cream truncate">{item.name}</p>
                              <p className="text-[11px] text-brand-cream/50">
                                ৳{item.price} × {item.quantity}
                              </p>
                            </div>
                            <span className="text-xs font-bold text-brand-yellow">
                              ৳{item.price * item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Footer Actions & Totals */}
                      <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4 text-xs">
                          <span className="text-brand-cream/60">
                            Subtotal: <strong className="text-brand-cream font-mono">৳{subtotal}</strong>
                          </span>
                          <span className="text-brand-cream/60">
                            Delivery:{' '}
                            <strong className="text-brand-cream font-mono">
                              {ord.deliveryFee ? `৳${ord.deliveryFee}` : 'Free'}
                            </strong>
                          </span>
                          <span className="text-brand-cream font-bold text-sm">
                            Total: <span className="text-brand-yellow font-extrabold font-mono text-base">৳{ord.totalAmount}</span>
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {ord.status === 'delivered' && (
                            <button
                              type="button"
                              onClick={() => setReviewOrder(ord)}
                              className="btn-secondary !h-8.5 px-3 text-xs font-bold gap-1 text-amber-400 border-amber-500/30 hover:bg-amber-500/10"
                              title="Leave a verified review for this order"
                            >
                              <Star size={13} className="text-amber-400 fill-amber-400" />
                              <span>Review Order</span>
                            </button>
                          )}

                          <Link
                            href={`/track-order?query=${ord.orderNumber}`}
                            className="btn-secondary !h-8.5 px-3.5 text-xs font-semibold gap-1.5"
                          >
                            <ExternalLink size={13} className="text-brand-yellow" />
                            <span>Track Live</span>
                          </Link>

                          <button
                            type="button"
                            onClick={() => setSelectedInvoiceOrder(ord as unknown as InvoiceOrderData)}
                            className="btn-secondary !h-8.5 px-3.5 text-xs font-semibold gap-1.5"
                          >
                            <Receipt size={13} className="text-brand-yellow" />
                            <span>Digital Invoice</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleReorder(ord)}
                            className="btn-primary !h-8.5 px-3.5 text-xs font-bold uppercase tracking-wider gap-1.5 shadow-md shadow-brand-yellow/10"
                          >
                            <RotateCw size={13} />
                            <span>Re-Order</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PROFILE & SAVED ADDRESS */}
        {activeTab === 'profile' && (
          <div className="card-bb bg-brand-surface-light border-white/10 rounded-3xl p-6 sm:p-8 max-w-3xl shadow-xl">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-brand-cream">Default Saved Delivery Information</h2>
              <p className="text-xs text-brand-cream/50 mt-1">
                Save your Cox&apos;s Bazar hotel/resort address here for 1-click automatic pre-filled checkout.
              </p>
            </div>

            {profileSuccess && (
              <div className="mb-5 p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl text-xs flex items-center gap-2.5 font-medium">
                <CheckCircle2 size={18} className="shrink-0 text-emerald-400" />
                <span>{profileSuccess}</span>
              </div>
            )}

            {profileError && (
              <div className="mb-5 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl text-xs">
                {profileError}
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Full Name *</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-cream/40 pointer-events-none" />
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className={cn(inputClass, 'pl-10')}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Phone Number (Used for Order Sync) *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-cream/40 pointer-events-none" />
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className={cn(inputClass, 'pl-10')}
                      required
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
                      value={profileForm.street}
                      onChange={(e) => setProfileForm({ ...profileForm, street: e.target.value })}
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
                        value={profileForm.city}
                        onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
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
                        value={profileForm.area}
                        onChange={(e) => setProfileForm({ ...profileForm, area: e.target.value })}
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
                      value={profileForm.landmark}
                      onChange={(e) => setProfileForm({ ...profileForm, landmark: e.target.value })}
                      className={cn(inputClass, 'pl-10')}
                      placeholder="Nearby famous grocery or beach access road"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="btn-primary !h-11 px-8 text-xs font-bold uppercase tracking-wider gap-2 shadow-lg shadow-brand-yellow/15"
                >
                  {savingProfile ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving changes...
                    </>
                  ) : (
                    'Save Saved Info'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 4: BITES CLUB PERKS */}
        {activeTab === 'perks' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card-bb bg-brand-surface-light border-white/10 rounded-3xl p-6 shadow-xl space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-yellow/15 border border-brand-yellow/30 flex items-center justify-center text-brand-yellow">
                <Sparkles size={22} />
              </div>
              <h3 className="text-base font-bold text-brand-cream">1-Click Coastal Ordering</h3>
              <p className="text-xs text-brand-cream/60 leading-relaxed">
                Your saved hotel and contact details automatically fill in during checkout with zero friction.
              </p>
            </div>

            <div className="card-bb bg-brand-surface-light border-white/10 rounded-3xl p-6 shadow-xl space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Receipt size={22} />
              </div>
              <h3 className="text-base font-bold text-brand-cream">Official Tax Invoices</h3>
              <p className="text-xs text-brand-cream/60 leading-relaxed">
                Download printable, itemized digital receipts with full breakdown anytime from your order history.
              </p>
            </div>

            <div className="card-bb bg-brand-surface-light border-white/10 rounded-3xl p-6 shadow-xl space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Truck size={22} />
              </div>
              <h3 className="text-base font-bold text-brand-cream">Live Order Tracking</h3>
              <p className="text-xs text-brand-cream/60 leading-relaxed">
                Track your momos and signature caramel tea in real-time straight from our Marine Drive kitchen.
              </p>
            </div>
          </div>
        )}

        {/* Invoice Modal Preview */}
        {selectedInvoiceOrder && (
          <InvoiceModal
            order={selectedInvoiceOrder}
            isOpen={!!selectedInvoiceOrder}
            onClose={() => setSelectedInvoiceOrder(null)}
          />
        )}

        {/* Review Modal for Verified Delivered Orders */}
        {reviewOrder && (
          <ReviewModal
            isOpen={!!reviewOrder}
            onClose={() => setReviewOrder(null)}
            initialOrderNumber={reviewOrder.orderNumber}
            initialDish={reviewOrder.items?.[0]?.name || ''}
            onSuccess={() => {
              const orderNum = reviewOrder.orderNumber;
              setReviewOrder(null);
              setReviewToast(`Thank you! Your verified review for order #${orderNum} has been submitted.`);
              setTimeout(() => setReviewToast(''), 5000);
            }}
          />
        )}
      </div>
    </div>
  );
}
