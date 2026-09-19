'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Order } from '@/types';
import { cn } from '@/lib/utils';
import { Loader2, ArrowLeft, MapPin, Phone, Mail, CheckCircle } from 'lucide-react';

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  confirmed: { label: 'Confirmed', color: 'text-blue-400', bg: 'bg-blue-400/10' },
  preparing: { label: 'Preparing', color: 'text-orange-400', bg: 'bg-orange-400/10' },
  ready: { label: 'Ready', color: 'text-purple-400', bg: 'bg-purple-400/10' },
  out_for_delivery: { label: 'Out for Delivery', color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
  delivered: { label: 'Delivered', color: 'text-green-400', bg: 'bg-green-400/10' },
  cancelled: { label: 'Cancelled', color: 'text-red-400', bg: 'bg-red-400/10' },
};

const allStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'];

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${params.id}`);
        setOrder(res.data.data);
      } catch {
        router.push('/admin/orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [params.id, router]);

  const updateStatus = async (newStatus: string) => {
    if (!order) return;
    setUpdating(true);
    try {
      await api.patch(`/orders/${order._id}/status`, { status: newStatus });
      setOrder({ ...order, status: newStatus as Order['status'] });
    } catch (err) {
      console.error('Failed to update', err);
    } finally {
      setUpdating(false);
    }
  };

  const markPaid = async () => {
    if (!order) return;
    setUpdating(true);
    try {
      await api.patch(`/orders/${order._id}/status`, { paymentStatus: 'paid' });
      setOrder({ ...order, paymentStatus: 'paid' });
    } catch (err) {
      console.error('Failed to update', err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-brand-yellow" size={32} />
      </div>
    );
  }

  if (!order) return null;

  const st = statusConfig[order.status] || statusConfig.pending;
  const sectionClass = 'bg-brand-surface-light rounded-xl border border-white/10 p-6';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="text-brand-cream/60 hover:text-brand-cream">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-brand-cream">Order #{order.orderNumber}</h1>
          <p className="text-brand-cream/50 text-sm">{new Date(order.createdAt).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Info */}
        <section className={sectionClass}>
          <h2 className="text-brand-cream font-semibold text-lg mb-4">Customer Details</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-brand-cream font-medium">{order.customer.name}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-brand-cream/60">
              <Phone size={14} /> {order.customer.phone}
            </div>
            {order.customer.email && (
              <div className="flex items-center gap-3 text-sm text-brand-cream/60">
                <Mail size={14} /> {order.customer.email}
              </div>
            )}
            {order.customer.address && (
              <div className="flex items-start gap-3 text-sm text-brand-cream/60">
                <MapPin size={14} className="shrink-0 mt-0.5" />
                <span>{order.customer.address.street}, {order.customer.address.city}{order.customer.address.area ? `, ${order.customer.address.area}` : ''}{order.customer.address.landmark ? ` (Near ${order.customer.address.landmark})` : ''}</span>
              </div>
            )}
          </div>
        </section>

        {/* Order Info */}
        <section className={sectionClass}>
          <h2 className="text-brand-cream font-semibold text-lg mb-4">Order Info</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-brand-cream/60">Type</span>
              <span className="text-brand-cream capitalize">{order.orderType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-cream/60">Payment</span>
              <span className="text-brand-cream capitalize">{order.paymentMethod} ({order.paymentStatus})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-cream/60">Subtotal</span>
              <span className="text-brand-cream">৳{Math.max(0, order.totalAmount - (order.deliveryFee || 0))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-cream/60">Delivery Fee</span>
              <span className="text-brand-cream">{order.deliveryFee ? `৳${order.deliveryFee}` : 'Free'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-cream/60">Total Items</span>
              <span className="text-brand-cream">{order.totalItems}</span>
            </div>
            <div className="flex justify-between border-t border-white/10 pt-2 font-bold">
              <span className="text-brand-cream">Total Amount</span>
              <span className="text-brand-yellow font-bold text-lg">৳{order.totalAmount}</span>
            </div>
            {order.specialNotes && (
              <div className="pt-2 border-t border-white/10">
                <p className="text-brand-cream/60 mb-1">Notes:</p>
                <p className="text-brand-cream/80 text-xs">{order.specialNotes}</p>
              </div>
            )}
          </div>
        </section>

        {/* Status Management */}
        <section className={sectionClass}>
          <h2 className="text-brand-cream font-semibold text-lg mb-4">Status</h2>
          <div className="mb-4">
            <span className={cn('inline-flex items-center px-3 py-1 rounded-full text-sm font-medium', st.bg, st.color)}>
              {st.label}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {allStatuses.map((s) => (
              <button
                key={s}
                onClick={() => updateStatus(s)}
                disabled={updating || order.status === s}
                className={cn(
                  'px-3 py-2 rounded-lg text-xs font-medium transition-colors capitalize',
                  order.status === s
                    ? 'bg-brand-yellow text-brand-black'
                    : 'bg-brand-surface border border-white/10 text-brand-cream/60 hover:text-brand-cream hover:bg-brand-surface-hover',
                  updating && 'opacity-50'
                )}
              >
                {statusConfig[s]?.label}
              </button>
            ))}
          </div>
          {order.paymentStatus !== 'paid' && (
            <button
              onClick={markPaid}
              disabled={updating}
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors text-sm font-medium"
            >
              <CheckCircle size={16} /> Mark as Paid
            </button>
          )}
        </section>

        {/* Items */}
        <section className={sectionClass}>
          <h2 className="text-brand-cream font-semibold text-lg mb-4">Items</h2>
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-brand-surface rounded-lg">
                {item.image && (
                  <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-brand-cream text-sm font-medium">{item.name}</p>
                  {item.specialInstructions && (
                    <p className="text-brand-cream/40 text-xs truncate">Note: {item.specialInstructions}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-brand-cream text-sm">x{item.quantity}</p>
                  <p className="text-brand-yellow text-sm font-bold">৳{item.price * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
