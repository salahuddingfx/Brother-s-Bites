'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/app/admin/layout';
import { MenuItem, Offer, OrderStats, Order } from '@/types';
import {
  UtensilsCrossed,
  CheckCircle,
  Star,
  Tag,
  Plus,
  ArrowRight,
  Loader2,
  ShoppingBag,
  Clock,
  TrendingUp,
  Sparkles,
  Sliders,
  Eye,
  Receipt,
  Phone,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import AnimatedNumber from '@/components/common/AnimatedNumber';
import InvoiceModal, { InvoiceOrderData } from '@/components/orders/InvoiceModal';

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: 'text-yellow-400', bg: 'bg-yellow-400/15 border-yellow-400/30' },
  confirmed: { label: 'Confirmed', color: 'text-blue-400', bg: 'bg-blue-400/15 border-blue-400/30' },
  preparing: { label: 'Preparing', color: 'text-orange-400', bg: 'bg-orange-400/15 border-orange-400/30' },
  ready: { label: 'Ready', color: 'text-purple-400', bg: 'bg-purple-400/15 border-purple-400/30' },
  out_for_delivery: { label: 'Out for Delivery', color: 'text-cyan-400', bg: 'bg-cyan-400/15 border-cyan-400/30' },
  delivered: { label: 'Delivered', color: 'text-green-400', bg: 'bg-green-400/15 border-green-500/30' },
  cancelled: { label: 'Cancelled', color: 'text-red-400', bg: 'bg-red-400/15 border-red-500/30' },
};

const nextStatusMap: Record<string, string> = {
  pending: 'confirmed',
  confirmed: 'preparing',
  preparing: 'ready',
  ready: 'out_for_delivery',
  out_for_delivery: 'delivered',
};

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<InvoiceOrderData | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [menuRes, offerRes, statsRes, ordersRes] = await Promise.all([
        api.get('/menu'),
        api.get('/offers'),
        api.get('/orders/stats').catch(() => ({ data: { data: null } })),
        api.get('/orders?limit=6').catch(() => ({ data: { data: { orders: [] } } })),
      ]);
      setMenuItems(menuRes.data.data?.items || menuRes.data.data || []);
      setOffers(offerRes.data.data?.offers || offerRes.data.data || []);
      setOrderStats(statsRes.data?.data || null);
      setRecentOrders(ordersRes.data?.data?.orders || []);
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (orderId: string, nextStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      await api.patch(`/orders/${orderId}/status`, { status: nextStatus });
      setRecentOrders((prev) =>
        prev.map((ord) => (ord._id === orderId ? { ...ord, status: nextStatus as any } : ord))
      );
      // Refresh stats
      api.get('/orders/stats').then((res) => {
        if (res.data?.data) setOrderStats(res.data.data);
      }).catch(() => {});
    } catch {
      alert('Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const featuredCount = menuItems.filter((i) => i.isFeatured).length;
  const availableCount = menuItems.filter((i) => i.isAvailable).length;

  const stats = [
    {
      label: 'Total Orders',
      value: orderStats?.totalOrders || 0,
      icon: <ShoppingBag size={22} />,
      color: 'text-amber-400',
      bg: 'bg-amber-400/15 border border-amber-400/30',
      gradient: 'from-amber-500/15 via-amber-500/5 to-transparent',
      borderColor: 'border-amber-500/25',
    },
    {
      label: 'Pending Orders',
      value: orderStats?.pendingOrders || 0,
      icon: <Clock size={22} />,
      color: 'text-orange-400',
      bg: 'bg-orange-400/15 border border-orange-400/30',
      gradient: 'from-orange-500/15 via-orange-500/5 to-transparent',
      borderColor: 'border-orange-500/25',
    },
    {
      label: "Today's Orders",
      value: orderStats?.todayOrders || 0,
      icon: <CheckCircle size={22} />,
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/15 border border-emerald-400/30',
      gradient: 'from-emerald-500/15 via-emerald-500/5 to-transparent',
      borderColor: 'border-emerald-500/25',
    },
    {
      label: "Today's Revenue",
      value: orderStats?.todayRevenue || 0,
      icon: <TrendingUp size={22} />,
      color: 'text-purple-400',
      bg: 'bg-purple-400/15 border border-purple-400/30',
      gradient: 'from-purple-500/15 via-purple-500/5 to-transparent',
      borderColor: 'border-purple-500/25',
      prefix: '৳',
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="animate-spin text-brand-yellow" size={36} />
        <p className="text-brand-cream/50 text-xs font-bold uppercase tracking-wider">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-yellow/15 via-brand-surface-light to-brand-surface-light border border-brand-yellow/30 p-5 sm:p-7 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-yellow/20 border border-brand-yellow/40 text-brand-yellow text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles size={13} />
              <span>Beachside Control Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-brand-cream uppercase tracking-tight">
              Welcome back, <span className="text-brand-yellow">{user?.name || 'Brother Admin'}</span>
            </h1>
            <p className="text-brand-cream/70 text-xs sm:text-sm mt-1">
              Manage live customer orders, update food prices, and print official invoices.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={fetchData}
              className="btn-secondary !h-9 text-xs gap-1.5 px-3.5"
              title="Refresh Dashboard"
            >
              <RefreshCw size={13} />
              <span>Refresh</span>
            </button>

            <Link
              href="/admin/menu/new"
              className="btn-primary !h-9 text-xs gap-1.5 px-4 shadow-lg"
            >
              <Plus size={15} />
              <span>Add New Dish</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={cn(
              'rounded-2xl border p-5 shadow-lg relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 bg-brand-surface-light bg-gradient-to-br',
              stat.gradient,
              stat.borderColor
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-brand-cream/60 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl sm:text-3xl font-black text-brand-cream mt-1.5 tracking-tight">
                  {stat.prefix || ''}<AnimatedNumber value={stat.value} padZero={false} />
                </p>
              </div>
              <div className={cn('p-3 rounded-xl shadow-inner', stat.bg)}>
                <span className={stat.color}>{stat.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Action Hub */}
      <div>
        <h2 className="text-base font-bold text-brand-cream uppercase tracking-wide mb-3.5 flex items-center gap-2">
          <Sliders size={16} className="text-brand-yellow" />
          <span>Quick Management Actions</span>
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Link
            href="/admin/orders"
            className="card-bb p-4 hover:border-amber-500/40 bg-gradient-to-br from-amber-500/5 to-transparent transition-all group hover:-translate-y-0.5 shadow-md flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 bg-amber-500/15 border border-amber-500/30 rounded-xl group-hover:scale-110 transition-transform shrink-0">
                <ShoppingBag className="text-amber-400" size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-brand-cream font-bold text-xs sm:text-sm truncate">Live Orders</p>
                <p className="text-brand-cream/50 text-[11px] truncate">Process & track</p>
              </div>
            </div>
            <ArrowRight className="text-brand-cream/30 group-hover:text-amber-400 shrink-0 transition-colors" size={15} />
          </Link>

          <Link
            href="/admin/menu/new"
            className="card-bb p-4 hover:border-emerald-500/40 bg-gradient-to-br from-emerald-500/5 to-transparent transition-all group hover:-translate-y-0.5 shadow-md flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 bg-emerald-500/15 border border-emerald-500/30 rounded-xl group-hover:scale-110 transition-transform shrink-0">
                <Plus className="text-emerald-400" size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-brand-cream font-bold text-xs sm:text-sm truncate">Add Food Item</p>
                <p className="text-brand-cream/50 text-[11px] truncate">New dish & price</p>
              </div>
            </div>
            <ArrowRight className="text-brand-cream/30 group-hover:text-emerald-400 shrink-0 transition-colors" size={15} />
          </Link>

          <Link
            href="/admin/offers"
            className="card-bb p-4 hover:border-pink-500/40 bg-gradient-to-br from-pink-500/5 to-transparent transition-all group hover:-translate-y-0.5 shadow-md flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 bg-pink-500/15 border border-pink-500/30 rounded-xl group-hover:scale-110 transition-transform shrink-0">
                <Tag className="text-pink-400" size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-brand-cream font-bold text-xs sm:text-sm truncate">Special Offers</p>
                <p className="text-brand-cream/50 text-[11px] truncate">Promotions & deals</p>
              </div>
            </div>
            <ArrowRight className="text-brand-cream/30 group-hover:text-pink-400 shrink-0 transition-colors" size={15} />
          </Link>

          <Link
            href="/admin/reviews"
            className="card-bb p-4 hover:border-yellow-500/40 bg-gradient-to-br from-yellow-500/5 to-transparent transition-all group hover:-translate-y-0.5 shadow-md flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 bg-yellow-500/15 border border-yellow-500/30 rounded-xl group-hover:scale-110 transition-transform shrink-0">
                <Star className="text-yellow-400 fill-yellow-400" size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-brand-cream font-bold text-xs sm:text-sm truncate">Reviews</p>
                <p className="text-brand-cream/50 text-[11px] truncate">Customer feedback</p>
              </div>
            </div>
            <ArrowRight className="text-brand-cream/30 group-hover:text-yellow-400 shrink-0 transition-colors" size={15} />
          </Link>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h2 className="text-base font-bold text-brand-cream uppercase tracking-wide flex items-center gap-2">
              <ShoppingBag size={16} className="text-brand-yellow" />
              <span>Recent Customer Orders</span>
            </h2>
            <p className="text-xs text-brand-cream/50">Manage order preparation, delivery and print receipts</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-brand-yellow font-bold text-xs uppercase tracking-wider hover:underline flex items-center gap-1.5"
          >
            <span>View All Orders</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="card-bb overflow-hidden border border-brand-border shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-brand-border bg-brand-surface/60 text-brand-cream/50 uppercase font-bold text-[11px]">
                  <th className="text-left px-4 py-3">Order ID</th>
                  <th className="text-left px-4 py-3">Customer</th>
                  <th className="text-left px-4 py-3">Items & Total</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-brand-cream/40 py-8">
                      No incoming customer orders yet.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((ord) => {
                    const st = statusConfig[ord.status] || {
                      label: ord.status,
                      color: 'text-brand-cream',
                      bg: 'bg-brand-surface',
                    };
                    const next = nextStatusMap[ord.status];

                    return (
                      <tr key={ord._id} className="hover:bg-brand-surface/40 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-brand-yellow">
                          #{ord.orderNumber}
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-bold text-brand-cream">{ord.customer.name}</p>
                          <p className="text-brand-cream/50 flex items-center gap-1 mt-0.5 text-[11px]">
                            <Phone size={10} />
                            <span>{ord.customer.phone}</span>
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-bold text-brand-cream">৳{ord.totalAmount}</p>
                          <p className="text-brand-cream/50 text-[11px]">{ord.totalItems} items</p>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border',
                              st.bg,
                              st.color
                            )}
                          >
                            {st.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {next && (
                              <button
                                onClick={() => handleUpdateStatus(ord._id, next)}
                                disabled={updatingOrderId === ord._id}
                                className="text-[11px] bg-brand-yellow text-brand-black font-extrabold px-2.5 py-1 rounded-lg hover:bg-brand-yellow-hover transition-colors shadow-sm disabled:opacity-50"
                              >
                                {updatingOrderId === ord._id ? '...' : `Mark ${statusConfig[next]?.label}`}
                              </button>
                            )}

                            <button
                              onClick={() => setSelectedInvoiceOrder(ord as unknown as InvoiceOrderData)}
                              className="p-1.5 text-brand-yellow/80 hover:text-brand-yellow hover:bg-brand-yellow/10 rounded-lg transition-colors"
                              title="Print Invoice / Receipt"
                            >
                              <Receipt size={15} />
                            </button>

                            <Link
                              href={`/admin/orders/${ord._id}`}
                              className="p-1.5 text-brand-cream/50 hover:text-brand-cream hover:bg-white/5 rounded-lg transition-colors"
                              title="View Order Details"
                            >
                              <Eye size={15} />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Invoice Modal for Dashboard */}
      {selectedInvoiceOrder && (
        <InvoiceModal
          isOpen={!!selectedInvoiceOrder}
          onClose={() => setSelectedInvoiceOrder(null)}
          order={selectedInvoiceOrder}
        />
      )}
    </div>
  );
}
