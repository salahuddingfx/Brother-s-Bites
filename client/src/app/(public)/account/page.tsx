'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import api from '@/lib/api';
import { Order } from '@/types';
import { cn } from '@/lib/utils';
import InvoiceModal, { InvoiceOrderData } from '@/components/orders/InvoiceModal';

export default function CustomerAccountPage() {
  const { user, loading: authLoading, updateProfile } = useAuth();
  const { addItem, openCart } = useCart();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<InvoiceOrderData | null>(null);

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

  useEffect(() => {
    let isMounted = true;
    if (user) {
      setTimeout(() => {
        if (isMounted) {
          setProfileForm({
            name: user.name || '',
            phone: user.phone || '',
            street: user.address?.street || '',
            city: user.address?.city || "Cox's Bazar",
            area: user.address?.area || '',
            landmark: user.address?.landmark || '',
          });
        }
      }, 0);

      api
        .get('/orders/my-orders')
        .then((res) => {
          if (isMounted) setOrders(res.data.data || []);
        })
        .catch(() => {
          if (isMounted) setOrders([]);
        })
        .finally(() => {
          if (isMounted) setLoadingOrders(false);
        });
    } else {
      setTimeout(() => {
        if (isMounted) setLoadingOrders(false);
      }, 0);
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
      setTimeout(() => setProfileSuccess(''), 3000);
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
        <div className="container-bb max-w-lg mx-auto text-center card-bb p-8 sm:p-10 border-brand-yellow/20 bg-brand-surface-light">
          <div className="w-16 h-16 rounded-2xl bg-brand-yellow/10 border border-brand-yellow/20 text-brand-yellow flex items-center justify-center mx-auto mb-4">
            <Sparkles size={32} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-cream tracking-tight mb-2">
            Permanent Customer Hub
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

  return (
    <div className="min-h-screen bg-brand-black pt-28 pb-16 px-4">
      <div className="container-bb max-w-5xl mx-auto">
        {/* Profile Banner */}
        <div className="card-bb p-6 sm:p-8 bg-brand-surface-light border-white/10 rounded-2xl mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-yellow text-brand-black font-black text-2xl flex items-center justify-center shadow-md">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-brand-cream tracking-tight">
                  {user.name}
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-brand-yellow/15 text-brand-yellow border border-brand-yellow/30">
                  Permanent Member
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-brand-cream/60 mt-1">
                {user.phone && (
                  <span className="flex items-center gap-1">
                    <Phone size={12} className="text-brand-yellow" />
                    {user.phone}
                  </span>
                )}
                {user.email && (
                  <span className="flex items-center gap-1">
                    <Mail size={12} className="text-brand-yellow" />
                    {user.email}
                  </span>
                )}
              </div>
            </div>
          </div>

          <Link
            href="/menu"
            className="btn-primary !h-10 px-5 text-xs font-extrabold uppercase tracking-wider shrink-0 gap-1.5 shadow-lg shadow-brand-yellow/15"
          >
            <Utensils size={14} />
            <span>ORDER FRESH FOOD</span>
          </Link>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-white/10 mb-6 gap-6">
          <button
            onClick={() => setActiveTab('orders')}
            className={cn(
              'pb-3 text-sm font-bold flex items-center gap-2 transition-all relative',
              activeTab === 'orders' ? 'text-brand-yellow' : 'text-brand-cream/60 hover:text-brand-cream'
            )}
          >
            <PackageCheck size={18} />
            <span>My Order History ({orders.length})</span>
            {activeTab === 'orders' && (
              <motion.div
                layoutId="accountTabIndicator"
                className="absolute bottom-0 inset-x-0 h-0.5 bg-brand-yellow"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={cn(
              'pb-3 text-sm font-bold flex items-center gap-2 transition-all relative',
              activeTab === 'profile' ? 'text-brand-yellow' : 'text-brand-cream/60 hover:text-brand-cream'
            )}
          >
            <UserIcon size={18} />
            <span>Saved Details & Address</span>
            {activeTab === 'profile' && (
              <motion.div
                layoutId="accountTabIndicator"
                className="absolute bottom-0 inset-x-0 h-0.5 bg-brand-yellow"
              />
            )}
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === 'orders' ? (
          <div>
            {loadingOrders ? (
              <div className="text-center py-16">
                <Loader2 className="w-8 h-8 text-brand-yellow animate-spin mx-auto mb-2" />
                <p className="text-xs text-brand-cream/50">Loading your orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="card-bb p-12 text-center bg-brand-surface-light border-white/5 rounded-2xl">
                <PackageCheck size={40} className="text-brand-cream/20 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-brand-cream mb-1">No Orders Placed Yet</h3>
                <p className="text-xs text-brand-cream/50 max-w-sm mx-auto mb-6">
                  You haven&apos;t placed any orders with this account yet. Browse our menu to enjoy fresh coastal bites!
                </p>
                <Link href="/menu" className="btn-primary !h-10 px-6 text-xs font-bold uppercase tracking-wider inline-flex">
                  Explore Delicious Menu
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => {
                  const subtotal = Math.max(0, ord.totalAmount - (ord.deliveryFee || 0));
                  return (
                    <motion.div
                      key={ord._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="card-bb bg-brand-surface-light border-white/10 rounded-2xl p-5 sm:p-6 transition-all hover:border-white/20"
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
                          <span>{new Date(ord.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>

                      {/* Items Grid */}
                      <div className="py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {ord.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="bg-brand-surface p-3 rounded-xl border border-white/5 flex items-center gap-3"
                          >
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 rounded-lg object-cover bg-black/40 border border-white/5 shrink-0"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-black/40 border border-white/5 flex items-center justify-center text-brand-cream/20 shrink-0">
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
                            Delivery: <strong className="text-brand-cream font-mono">{ord.deliveryFee ? `৳${ord.deliveryFee}` : 'Free'}</strong>
                          </span>
                          <span className="text-brand-cream font-bold text-sm">
                            Total: <span className="text-brand-yellow font-extrabold font-mono text-base">৳{ord.totalAmount}</span>
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            href={`/track-order?order=${ord.orderNumber}`}
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
        ) : (
          /* Profile & Address Settings */
          <div className="card-bb bg-brand-surface-light border-white/10 rounded-2xl p-6 sm:p-8 max-w-2xl">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-brand-cream">Default Saved Information</h2>
              <p className="text-xs text-brand-cream/50 mt-1">
                This information is automatically pre-filled when you order from Brother&apos;s Bites.
              </p>
            </div>

            {profileSuccess && (
              <div className="mb-4 p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs flex items-center gap-2 font-medium">
                <CheckCircle2 size={16} className="shrink-0" />
                <span>{profileSuccess}</span>
              </div>
            )}

            {profileError && (
              <div className="mb-4 p-3.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs">
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
                  <label className={labelClass}>Phone Number *</label>
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
                  <label className={labelClass}>Default Delivery Street Address</label>
                  <div className="relative">
                    <Home className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-cream/40 pointer-events-none" />
                    <input
                      type="text"
                      value={profileForm.street}
                      onChange={(e) => setProfileForm({ ...profileForm, street: e.target.value })}
                      className={cn(inputClass, 'pl-10')}
                      placeholder="House / Road / Hotel / Resort Name"
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
                        placeholder="e.g. Inani Beach Point, Kolatoli"
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
                      placeholder="Nearby famous hotel or grocery store"
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

        {/* Invoice Modal Preview */}
        {selectedInvoiceOrder && (
          <InvoiceModal
            order={selectedInvoiceOrder}
            isOpen={!!selectedInvoiceOrder}
            onClose={() => setSelectedInvoiceOrder(null)}
          />
        )}
      </div>
    </div>
  );
}
