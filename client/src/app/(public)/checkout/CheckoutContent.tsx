'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Loader2,
  MapPin,
  Store,
  Utensils,
  User,
  Phone,
  Mail,
  Home,
  Building2,
  Compass,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

type OrderType = 'delivery' | 'pickup';

export const DELIVERY_ZONES = [
  {
    id: 'sonar-para',
    name: 'Sonar Para Beach / Inani Zone',
    charge: 30,
    time: '20-30 mins',
    desc: 'Local Beach Area (Close to Kitchen)',
  },
  {
    id: 'himchori',
    name: 'Himchori / Marine Drive',
    charge: 50,
    time: '30-45 mins',
    desc: 'Marine Drive Coastal Strip',
  },
  {
    id: 'kolatoli',
    name: 'Kolatoli / Sugandha / Laboni Beach',
    charge: 70,
    time: '40-55 mins',
    desc: 'Cox\'s Bazar Hotel & Main Beach Zone',
  },
  {
    id: 'sadar',
    name: 'Cox\'s Bazar Sadar / Town',
    charge: 90,
    time: '50-65 mins',
    desc: 'Town / Central Bazar Area',
  },
  {
    id: 'other',
    name: 'Other Extended Area (Cox\'s Bazar)',
    charge: 100,
    time: '60+ mins',
    desc: 'Other locations across Cox\'s Bazar',
  },
];

export default function CheckoutContent() {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [orderType, setOrderType] = useState<OrderType>('delivery');
  const [selectedZoneId, setSelectedZoneId] = useState('sonar-para');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const currentZone = DELIVERY_ZONES.find((z) => z.id === selectedZoneId) || DELIVERY_ZONES[0];
  const deliveryFee = orderType === 'delivery' ? currentZone.charge : 0;
  const grandTotal = cartTotal + deliveryFee;

  const [form, setForm] = useState(() => ({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    street: user?.address?.street || '',
    city: user?.address?.city || "Cox's Bazar",
    area: user?.address?.area || '',
    landmark: user?.address?.landmark || '',
    specialNotes: '',
  }));

  // Auto-fill customer profile and saved delivery info when logged in
  useEffect(() => {
    if (!user) return;
    const timer = setTimeout(() => {
      setForm((prev) => ({
        ...prev,
        name: prev.name || user.name || '',
        phone: prev.phone || user.phone || '',
        email: prev.email || user.email || '',
        street: prev.street || user.address?.street || '',
        city: prev.city || user.address?.city || "Cox's Bazar",
        area: prev.area || user.address?.area || '',
        landmark: prev.landmark || user.address?.landmark || '',
      }));
    }, 0);
    return () => clearTimeout(timer);
  }, [user]);

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!cart?.items?.length) {
      setError('Your cart is empty');
      return;
    }

    if (!form.name.trim() || !form.phone.trim()) {
      setError('Name and phone number are required');
      return;
    }

    if (orderType === 'delivery' && (!form.street.trim() || !form.city.trim())) {
      setError('Street address and city are required for delivery');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        customer: {
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim() || undefined,
          ...(orderType === 'delivery' && {
            address: {
              street: form.street.trim(),
              city: form.city.trim(),
              area: form.area.trim() ? `${currentZone.name} (${form.area.trim()})` : currentZone.name,
              landmark: form.landmark.trim() || undefined,
            },
          }),
        },
        items: cart.items.map((item) => ({
          menuItem: typeof item.menuItem === 'string' ? item.menuItem : item.menuItem._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          specialInstructions: item.specialInstructions || undefined,
        })),
        deliveryFee,
        orderType,
        paymentMethod: 'cash' as const,
        specialNotes: form.specialNotes.trim() || undefined,
      };

      const res = await api.post('/orders', payload, {
        headers: { 'x-session-id': localStorage.getItem('bb_session_id') || '' },
      });

      await clearCart();
      router.push(`/order-confirmation?order=${res.data.data.orderNumber}`);
    } catch (err: unknown) {
      const errObj = err as { response?: { data?: { message?: string } } };
      setError(errObj.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!cart?.items?.length) {
    return (
      <div className="min-h-screen bg-brand-black pt-24 pb-16">
        <div className="container-bb max-w-2xl mx-auto text-center py-20">
          <p className="text-brand-cream/50 mb-4">Your cart is empty</p>
          <Link href="/menu" className="btn-primary">Browse Menu</Link>
        </div>
      </div>
    );
  }

  const inputClass = 'w-full bg-brand-surface border border-white/10 rounded-lg px-4 py-2.5 text-brand-cream text-sm placeholder-brand-cream/30 focus:outline-none focus:border-brand-yellow transition-colors';
  const labelClass = 'block text-brand-cream/70 text-sm font-medium mb-1.5';

  return (
    <div className="min-h-screen bg-brand-black pt-24 pb-16">
      <div className="container-bb max-w-4xl mx-auto">
        <Link href="/menu" className="inline-flex items-center gap-2 text-brand-cream/60 hover:text-brand-cream text-sm mb-6">
          <ArrowLeft size={16} /> Back to Menu
        </Link>

        <h1 className="text-2xl sm:text-3xl font-bold text-brand-cream mb-2">Checkout</h1>
        <p className="text-brand-cream/50 text-sm mb-6">Complete your order details below</p>

        {/* Permanent Customer Banner / Auto-fill Badge */}
        {user ? (
          <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-xl p-3.5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-medium">
              <CheckCircle2 size={16} className="shrink-0" />
              <span>Signed in as <strong>{user.name}</strong> • Saved details auto-applied!</span>
            </div>
            <Link href="/account" className="text-brand-yellow hover:underline font-bold">
              Manage Profile & Addresses →
            </Link>
          </div>
        ) : (
          <div className="bg-brand-surface-light border border-brand-yellow/25 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg shadow-brand-yellow/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-yellow/15 text-brand-yellow flex items-center justify-center shrink-0">
                <Sparkles size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-brand-cream">Permanent Customer?</p>
                <p className="text-xs text-brand-cream/60">Sign in to auto-fill your saved delivery address & checkout in 1-click.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
              <Link
                href="/login?redirect=/checkout"
                className="btn-primary !h-8.5 px-4 text-xs font-bold"
              >
                Sign In
              </Link>
              <Link
                href="/register?redirect=/checkout"
                className="btn-secondary !h-8.5 px-3 text-xs font-bold"
              >
                Register
              </Link>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg px-4 py-3 text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Form */}
            <div className="lg:col-span-7 space-y-6">
              {/* Order Type */}
              <section className="bg-brand-surface-light rounded-xl border border-white/10 p-6">
                <h2 className="text-brand-cream font-semibold text-lg mb-4">Order Type</h2>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setOrderType('delivery')}
                    className={cn(
                      'flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left',
                      orderType === 'delivery'
                        ? 'border-brand-yellow bg-brand-yellow/5'
                        : 'border-white/10 hover:border-white/20'
                    )}
                  >
                    <MapPin className={cn('w-5 h-5', orderType === 'delivery' ? 'text-brand-yellow' : 'text-brand-cream/40')} />
                    <div>
                      <p className="text-brand-cream text-sm font-medium">Delivery</p>
                      <p className="text-brand-cream/40 text-xs">We bring it to you</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType('pickup')}
                    className={cn(
                      'flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left',
                      orderType === 'pickup'
                        ? 'border-brand-yellow bg-brand-yellow/5'
                        : 'border-white/10 hover:border-white/20'
                    )}
                  >
                    <Store className={cn('w-5 h-5', orderType === 'pickup' ? 'text-brand-yellow' : 'text-brand-cream/40')} />
                    <div>
                      <p className="text-brand-cream text-sm font-medium">Pickup</p>
                      <p className="text-brand-cream/40 text-xs">Collect from restaurant</p>
                    </div>
                  </button>
                </div>
              </section>

              {/* Customer Info */}
              <section className="bg-brand-surface-light rounded-xl border border-white/10 p-6">
                <h2 className="text-brand-cream font-semibold text-lg mb-4">Your Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Full Name *</label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-cream/40 pointer-events-none" />
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        className={cn(inputClass, 'pl-10')}
                        placeholder="Your full name"
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
                        value={form.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        className={cn(inputClass, 'pl-10')}
                        placeholder="+880..."
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Email (for receipt)</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-cream/40 pointer-events-none" />
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        className={cn(inputClass, 'pl-10')}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Delivery Address (conditional) */}
              {orderType === 'delivery' && (
                <motion.section
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-brand-surface-light rounded-xl border border-white/10 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-brand-cream font-semibold text-lg">Delivery Address & Zone</h2>
                    <span className="text-xs text-brand-yellow font-medium bg-brand-yellow/10 border border-brand-yellow/20 px-2 py-0.5 rounded">
                      Charge: ৳{deliveryFee}
                    </span>
                  </div>

                  {/* Delivery Zone Selector */}
                  <div className="mb-5">
                    <label className={labelClass}>Select Your Delivery Zone *</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {DELIVERY_ZONES.map((zone) => {
                        const isSelected = selectedZoneId === zone.id;
                        return (
                          <button
                            type="button"
                            key={zone.id}
                            onClick={() => setSelectedZoneId(zone.id)}
                            className={cn(
                              'p-3 rounded-lg border text-left transition-all flex flex-col justify-between gap-1.5',
                              isSelected
                                ? 'border-brand-yellow bg-brand-yellow/10 ring-1 ring-brand-yellow/40 shadow-sm'
                                : 'border-white/10 bg-brand-surface hover:border-white/20'
                            )}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className={cn('text-xs font-semibold leading-snug', isSelected ? 'text-brand-yellow' : 'text-brand-cream')}>
                                {zone.name}
                              </span>
                              <span className="text-xs font-bold text-brand-yellow bg-brand-yellow/20 px-2 py-0.5 rounded shrink-0">
                                ৳{zone.charge}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-brand-cream/50">
                              <span className="truncate mr-1">{zone.desc}</span>
                              <span className="text-[10px] text-brand-cream/40 shrink-0">⏱ {zone.time}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className={labelClass}>Street Address *</label>
                      <div className="relative">
                        <Home className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-cream/40 pointer-events-none" />
                        <input
                          type="text"
                          value={form.street}
                          onChange={(e) => updateField('street', e.target.value)}
                          className={cn(inputClass, 'pl-10')}
                          placeholder="House/Flat, Road, Hotel / Resort Name"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>City *</label>
                        <div className="relative">
                          <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-cream/40 pointer-events-none" />
                          <input
                            type="text"
                            value={form.city}
                            onChange={(e) => updateField('city', e.target.value)}
                            className={cn(inputClass, 'pl-10')}
                            placeholder="City"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>Area / Local Details</label>
                        <div className="relative">
                          <Compass className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-cream/40 pointer-events-none" />
                          <input
                            type="text"
                            value={form.area}
                            onChange={(e) => updateField('area', e.target.value)}
                            className={cn(inputClass, 'pl-10')}
                            placeholder="e.g. Block C, Inani Point"
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
                          value={form.landmark}
                          onChange={(e) => updateField('landmark', e.target.value)}
                          className={cn(inputClass, 'pl-10')}
                          placeholder="Nearby hotel, beach point, or grocery shop (optional)"
                        />
                      </div>
                    </div>
                  </div>
                </motion.section>
              )}

              {/* Special Notes */}
              <section className="bg-brand-surface-light rounded-xl border border-white/10 p-6">
                <h2 className="text-brand-cream font-semibold text-lg mb-4">Special Instructions</h2>
                <textarea
                  value={form.specialNotes}
                  onChange={(e) => updateField('specialNotes', e.target.value)}
                  rows={3}
                  className={cn(inputClass, 'resize-none')}
                  placeholder="Any special requests or notes for your order..."
                />
              </section>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-5">
              <div className="bg-brand-surface-light rounded-xl border border-white/10 p-6 sticky top-24">
                <h2 className="text-brand-cream font-semibold text-lg mb-4">Order Summary</h2>
                <div className="space-y-3 mb-4 max-h-72 overflow-y-auto pr-1 divide-y divide-white/5">
                  {cart.items.map((item) => (
                    <div key={item._id} className="pt-3 first:pt-0 flex items-center gap-3 text-sm">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover shrink-0 bg-brand-surface border border-white/10"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-brand-surface border border-white/10 flex items-center justify-center shrink-0 text-brand-cream/30">
                          <Utensils size={18} />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-brand-cream font-medium truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-brand-cream/50 mt-0.5">
                          ৳{item.price} × {item.quantity}
                        </p>
                        {item.specialInstructions && (
                          <p className="text-[11px] text-brand-cream/40 italic truncate mt-0.5">
                            &ldquo;{item.specialInstructions}&rdquo;
                          </p>
                        )}
                      </div>
                      <span className="text-brand-yellow font-semibold ml-2 shrink-0">
                        ৳{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/10 pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-cream/60">Subtotal</span>
                    <span className="text-brand-cream font-medium">৳{cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-sm items-center">
                    <div className="flex items-center gap-1.5">
                      <span className="text-brand-cream/60">Delivery Fee</span>
                      {orderType === 'delivery' && (
                        <span className="text-[10px] bg-white/10 text-brand-cream/70 px-1.5 py-0.5 rounded truncate max-w-[120px]">
                          {currentZone.name.split('/')[0]}
                        </span>
                      )}
                    </div>
                    {orderType === 'delivery' ? (
                      <span className="text-brand-cream font-medium">৳{deliveryFee}</span>
                    ) : (
                      <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider">Free (Pickup)</span>
                    )}
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-cream/60">Payment</span>
                    <span className="text-brand-cream/80">Cash on {orderType === 'delivery' ? 'Delivery' : 'Pickup'}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-white/10">
                    <span className="text-brand-cream">Total</span>
                    <span className="text-brand-yellow">৳{grandTotal}</span>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full justify-center mt-6 gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Placing Order...
                    </>
                  ) : (
                    <>PLACE ORDER (৳{grandTotal})</>
                  )}
                </button>
                <p className="text-brand-cream/30 text-xs text-center mt-3">
                  You will receive an email confirmation after placing the order
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
