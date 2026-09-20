'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Order } from '@/types';
import { cn } from '@/lib/utils';
import { Loader2, Eye, ChevronLeft, ChevronRight, Receipt } from 'lucide-react';
import InvoiceModal, { InvoiceOrderData } from '@/components/orders/InvoiceModal';

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
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-brand-yellow" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-brand-cream">Orders</h1>
        <p className="text-brand-cream/50 mt-1">Manage incoming orders</p>
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2">
        {statusFilters.map((status) => (
          <button
            key={status}
            onClick={() => { setStatusFilter(status); setPage(1); }}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize',
              statusFilter === status
                ? 'bg-brand-yellow text-brand-black'
                : 'bg-brand-surface text-brand-cream/60 hover:text-brand-cream border border-white/10'
            )}
          >
            {status === 'all' ? 'All Orders' : statusConfig[status]?.label || status}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-brand-surface-light rounded-xl border border-white/10 overflow-hidden">
        {orders.length === 0 ? (
          <div className="text-center py-16 text-brand-cream/40">
            <p>No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-brand-cream/50 text-sm font-medium px-5 py-3">Order</th>
                  <th className="text-left text-brand-cream/50 text-sm font-medium px-5 py-3 hidden sm:table-cell">Customer</th>
                  <th className="text-left text-brand-cream/50 text-sm font-medium px-5 py-3">Items</th>
                  <th className="text-left text-brand-cream/50 text-sm font-medium px-5 py-3">Total</th>
                  <th className="text-left text-brand-cream/50 text-sm font-medium px-5 py-3 hidden md:table-cell">Type</th>
                  <th className="text-left text-brand-cream/50 text-sm font-medium px-5 py-3">Status</th>
                  <th className="text-left text-brand-cream/50 text-sm font-medium px-5 py-3 hidden lg:table-cell">Date</th>
                  <th className="text-right text-brand-cream/50 text-sm font-medium px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const st = statusConfig[order.status] || statusConfig.pending;
                  const next = nextStatus[order.status];
                  return (
                    <tr key={order._id} className="border-b border-white/5 last:border-0 hover:bg-brand-surface-hover transition-colors">
                      <td className="px-5 py-3">
                        <span className="text-brand-yellow font-mono text-sm font-bold">#{order.orderNumber}</span>
                      </td>
                      <td className="px-5 py-3 hidden sm:table-cell">
                        <p className="text-brand-cream text-sm">{order.customer.name}</p>
                        <p className="text-brand-cream/40 text-xs">{order.customer.phone}</p>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-brand-cream text-sm">{order.totalItems} items</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-brand-cream font-medium text-sm">৳{order.totalAmount}</span>
                      </td>
                      <td className="px-5 py-3 hidden md:table-cell">
                        <span className={cn('text-xs font-medium capitalize', order.orderType === 'delivery' ? 'text-cyan-400' : 'text-purple-400')}>
                          {order.orderType}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', st.bg, st.color)}>
                          {st.label}
                        </span>
                      </td>
                      <td className="px-5 py-3 hidden lg:table-cell">
                        <span className="text-brand-cream/50 text-xs">{formatDate(order.createdAt)}</span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {next && (
                            <button
                              onClick={() => updateStatus(order._id, next)}
                              disabled={updatingId === order._id}
                              className="text-xs bg-brand-yellow/10 text-brand-yellow px-2.5 py-1 rounded hover:bg-brand-yellow/20 transition-colors disabled:opacity-50"
                            >
                              {updatingId === order._id ? '...' : `Mark ${statusConfig[next]?.label}`}
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedInvoiceOrder(order as unknown as InvoiceOrderData)}
                            className="text-brand-yellow/60 hover:text-brand-yellow p-1 transition-colors"
                            title="Print / View Invoice Receipt"
                          >
                            <Receipt size={16} />
                          </button>
                          <Link
                            href={`/admin/orders/${order._id}`}
                            className="text-brand-cream/40 hover:text-brand-cream p-1 transition-colors"
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
