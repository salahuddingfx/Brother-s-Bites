'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Order } from '@/types';
import { cn } from '@/lib/utils';
import { Eye, ChevronLeft, ChevronRight, Receipt, Radio, BellRing, ShoppingBag } from 'lucide-react';
import AdminTableSkeleton from '@/components/skeletons/AdminTableSkeleton';
import dynamic from 'next/dynamic';
import type { InvoiceOrderData } from '@/components/orders/InvoiceModal';
const InvoiceModal = dynamic(() => import('@/components/orders/InvoiceModal'), { ssr: false });
import { useLiveSSE } from '@/hooks/useLiveSSE';

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  confirmed: { label: 'Confirmed', color: 'text-blue-400', bg: 'bg-blue-400/10' },
  preparing: { label: 'Preparing', color: 'text-orange-400', bg: 'bg-orange-400/10' },
  ready: { label: 'Ready', color: 'text-purple-400', bg: 'bg-purple-400/10' },
  out_for_delivery: { label: 'Out for Delivery', color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
  delivered: { label: 'Delivered', color: 'text-green-400', bg: 'bg-green-400/10' },
  cancelled: { label: 'Cancelled', color: 'text-red-400', bg: 'bg-red-400/10' },
};

const statusFilters = ['all', 'pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<InvoiceOrderData | null>(null);
  const [newOrderAlert, setNewOrderAlert] = useState<{ orderNumber: string; totalAmount: number } | null>(null);

  // Live SSE Subscription
  const { isConnected } = useLiveSSE({
    channel: 'admin',
    onNewOrder: (payload) => {
      const newOrd = payload.order;
      if (newOrd) {
        setNewOrderAlert({ orderNumber: newOrd.orderNumber, totalAmount: newOrd.totalAmount });
        setOrders((prev) => {
          if (prev.some((o) => o._id === newOrd._id)) return prev;
          if (statusFilter === 'all' || statusFilter === 'pending' || statusFilter === newOrd.status) {
            return [newOrd, ...prev];
          }
          return prev;
        });
        setTimeout(() => setNewOrderAlert(null), 8000);
      }
    },
    onOrderUpdated: (payload) => {
      const updatedOrd = payload.order;
      if (updatedOrd) {
        setOrders((prev) =>
          prev.map((ord) => (ord._id === updatedOrd._id ? { ...ord, ...updatedOrd } : ord))
        );
      }
    },
  });

  useEffect(() => {
    let cancelled = false;
    const loadOrders = async () => {
      try {
        const res = await api.get('/orders', { params: { status: statusFilter, page, limit: 15 } });
        const data = res.data.data;
        if (!cancelled) {
          setOrders(data.orders || []);
          setTotalPages(data.pages || 1);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to fetch orders', err);
        if (!cancelled) setLoading(false);
      }
    };
    loadOrders();
    return () => { cancelled = true; };
  }, [statusFilter, page, refreshKey]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-BD', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const nextStatus: Record<string, string> = {
    pending: 'confirmed',
    confirmed: 'preparing',
    preparing: 'ready',
    ready: 'out_for_delivery',
    out_for_delivery: 'delivered',
  };

  if (loading) {
    return <AdminTableSkeleton rows={5} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-brand-cream">Orders</h1>
          <p className="text-brand-cream/50 mt-1">Manage incoming orders</p>
        </div>

        {/* Live SSE Pulse Indicator */}
        <div className="flex items-center gap-2">
          <div className={cn(
            'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-300 backdrop-blur-md',
            isConnected
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
          )}>
            <span className="relative flex h-2 w-2">
              {isConnected && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span className={cn('relative inline-flex rounded-full h-2 w-2', isConnected ? 'bg-emerald-500' : 'bg-amber-500')}></span>
            </span>
            <span className="font-mono">{isConnected ? 'LIVE SSE CONNECTED' : 'CONNECTING...'}</span>
          </div>
        </div>
      </div>

      {/* Real-time Order Popup Banner */}
      {newOrderAlert && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300 flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-brand-yellow/20 via-brand-yellow/10 to-transparent border border-brand-yellow/30 text-brand-cream">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-brand-yellow text-brand-black flex items-center justify-center font-bold animate-bounce">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-brand-yellow text-sm">🎉 New Live Order Received!</p>
              <p className="text-xs text-brand-cream/80">Order <span className="font-mono font-bold text-white">#{newOrderAlert.orderNumber}</span> for <span className="font-semibold text-brand-yellow">৳{newOrderAlert.totalAmount}</span> has just arrived.</p>
            </div>
          </div>
          <button
            onClick={() => setNewOrderAlert(null)}
            className="text-brand-cream/40 hover:text-brand-cream text-xs px-2 py-1 rounded bg-white/5 border border-white/10"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Status Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar sm:flex-wrap">
        {statusFilters.map((status) => (
          <button
            key={status}
            onClick={() => { setStatusFilter(status); setPage(1); }}
            className={cn(
              'px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all capitalize shrink-0 shadow-sm',
              statusFilter === status
                ? 'bg-brand-yellow text-brand-black shadow-md'
                : 'bg-brand-surface text-brand-cream/60 hover:text-brand-cream border border-white/10'
            )}
          >
            {status === 'all' ? 'All Orders' : statusConfig[status]?.label || status}
          </button>
        ))}
      </div>

      {/* Orders List / Table */}
      <div className="bg-brand-surface-light rounded-2xl border border-white/10 overflow-hidden shadow-xl">
        {orders.length === 0 ? (
          <div className="text-center py-16 text-brand-cream/40 space-y-2">
            <ShoppingBag size={40} className="mx-auto opacity-30 text-brand-yellow" />
            <p className="text-sm font-semibold">No orders found for this filter</p>
          </div>
        ) : (
          <>
            {/* 📱 Mobile Orders Card View (Visible only on < sm screens) */}
            <div className="sm:hidden divide-y divide-white/5">
              {orders.map((order) => {
                const st = statusConfig[order.status] || statusConfig.pending;
                const next = nextStatus[order.status];
                return (
                  <div key={order._id} className="p-4 space-y-3 hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-brand-yellow font-mono text-sm font-bold">
                          #{order.orderNumber}
                        </span>
                        <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider', order.orderType === 'delivery' ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30' : 'bg-purple-500/15 text-purple-400 border border-purple-500/30')}>
                          {order.orderType}
                        </span>
                      </div>
                      <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold', st.bg, st.color)}>
                        {st.label}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <p className="text-brand-cream font-bold">{order.customer.name}</p>
                        {order.customer.phone && (
                          <a href={`tel:${order.customer.phone}`} className="text-brand-cream/60 hover:text-brand-yellow font-mono text-[11px] underline">
                            {order.customer.phone}
                          </a>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-brand-yellow">৳{order.totalAmount}</p>
                        <p className="text-[11px] text-brand-cream/50">{order.totalItems} items • {formatDate(order.createdAt)}</p>
                      </div>
                    </div>

                    {/* Quick Mobile Action Bar */}
                    <div className="pt-2 flex items-center justify-between gap-2 border-t border-white/5">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedInvoiceOrder(order as unknown as InvoiceOrderData)}
                          className="px-2.5 py-1.5 rounded-lg bg-brand-surface border border-brand-border text-brand-cream/80 hover:text-brand-yellow text-xs font-semibold flex items-center gap-1"
                        >
                          <Receipt size={13} className="text-brand-yellow" />
                          <span>Receipt</span>
                        </button>
                        <Link
                          href={`/admin/orders/${order._id}`}
                          className="px-2.5 py-1.5 rounded-lg bg-brand-surface border border-brand-border text-brand-cream/80 hover:text-brand-cream text-xs font-semibold flex items-center gap-1"
                        >
                          <Eye size={13} />
                          <span>Details</span>
                        </Link>
                      </div>

                      {next && (
                        <button
                          onClick={() => updateStatus(order._id, next)}
                          disabled={updatingId === order._id}
                          className="px-3 py-1.5 rounded-xl bg-brand-yellow text-brand-black text-xs font-black shadow-md active:scale-95 transition-all disabled:opacity-50"
                        >
                          {updatingId === order._id ? 'Updating...' : `Mark ${statusConfig[next]?.label}`}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 💻 Desktop / Tablet Table View (Visible only on >= sm screens) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-brand-cream/50 text-xs font-bold uppercase tracking-wider px-5 py-3.5">Order</th>
                    <th className="text-left text-brand-cream/50 text-xs font-bold uppercase tracking-wider px-5 py-3.5">Customer</th>
                    <th className="text-left text-brand-cream/50 text-xs font-bold uppercase tracking-wider px-5 py-3.5">Items</th>
                    <th className="text-left text-brand-cream/50 text-xs font-bold uppercase tracking-wider px-5 py-3.5">Total</th>
                    <th className="text-left text-brand-cream/50 text-xs font-bold uppercase tracking-wider px-5 py-3.5 hidden md:table-cell">Type</th>
                    <th className="text-left text-brand-cream/50 text-xs font-bold uppercase tracking-wider px-5 py-3.5">Status</th>
                    <th className="text-left text-brand-cream/50 text-xs font-bold uppercase tracking-wider px-5 py-3.5 hidden lg:table-cell">Date</th>
                    <th className="text-right text-brand-cream/50 text-xs font-bold uppercase tracking-wider px-5 py-3.5">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const st = statusConfig[order.status] || statusConfig.pending;
                    const next = nextStatus[order.status];
                    return (
                      <tr key={order._id} className="border-b border-white/5 last:border-0 hover:bg-brand-surface-hover transition-colors">
                        <td className="px-5 py-3.5">
                          <span className="text-brand-yellow font-mono text-sm font-bold">#{order.orderNumber}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <p className="text-brand-cream text-sm font-semibold">{order.customer.name}</p>
                          <p className="text-brand-cream/40 text-xs font-mono">{order.customer.phone}</p>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-brand-cream text-sm">{order.totalItems} items</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-brand-cream font-bold text-sm">৳{order.totalAmount}</span>
                        </td>
                        <td className="px-5 py-3.5 hidden md:table-cell">
                          <span className={cn('text-xs font-semibold capitalize px-2 py-0.5 rounded-full', order.orderType === 'delivery' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-purple-500/10 text-purple-400')}>
                            {order.orderType}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold', st.bg, st.color)}>
                            {st.label}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 hidden lg:table-cell">
                          <span className="text-brand-cream/50 text-xs">{formatDate(order.createdAt)}</span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {next && (
                              <button
                                onClick={() => updateStatus(order._id, next)}
                                disabled={updatingId === order._id}
                                className="text-xs font-bold bg-brand-yellow/15 text-brand-yellow px-3 py-1 rounded-xl hover:bg-brand-yellow hover:text-brand-black transition-all disabled:opacity-50"
                              >
                                {updatingId === order._id ? '...' : `Mark ${statusConfig[next]?.label}`}
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedInvoiceOrder(order as unknown as InvoiceOrderData)}
                              className="text-brand-cream/60 hover:text-brand-yellow p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                              title="Print / View Invoice Receipt"
                            >
                              <Receipt size={16} />
                            </button>
                            <Link
                              href={`/admin/orders/${order._id}`}
                              className="text-brand-cream/60 hover:text-brand-cream p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                              title="View Order Details"
                            >
                              <Eye size={16} />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Invoice Modal */}
      {selectedInvoiceOrder && (
        <InvoiceModal
          isOpen={!!selectedInvoiceOrder}
          onClose={() => setSelectedInvoiceOrder(null)}
          order={selectedInvoiceOrder}
          canPrint={true}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-lg bg-brand-surface border border-white/10 text-brand-cream/60 hover:text-brand-cream disabled:opacity-30"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-brand-cream/50 text-sm">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-lg bg-brand-surface border border-white/10 text-brand-cream/60 hover:text-brand-cream disabled:opacity-30"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
