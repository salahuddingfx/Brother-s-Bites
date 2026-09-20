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
  ShoppingBag,
  Clock,
  TrendingUp,
  Sparkles,
  Sliders,
  Eye,
  Receipt,
  Phone,
  RefreshCw,
  Users,
  Globe,
  Smartphone,
  Laptop,
  Compass,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import AnimatedNumber from '@/components/common/AnimatedNumber';
import Skeleton from '@/components/ui/skeleton';
import AdminDashboardSkeleton from '@/components/skeletons/AdminDashboardSkeleton';
import dynamic from 'next/dynamic';
import type { InvoiceOrderData } from '@/components/orders/InvoiceModal';
const InvoiceModal = dynamic(() => import('@/components/orders/InvoiceModal'), { ssr: false });
import { useLiveSSE } from '@/hooks/useLiveSSE';

interface VisitorAnalyticsData {
  period: string;
  totalPageviews: number;
  uniqueVisitors: number;
  topPages: { path: string; count: number }[];
  deviceBreakdown: { device: string; count: number }[];
  browserBreakdown: { browser: string; count: number }[];
}

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

const PERIODS = [
  { id: 'today', label: 'Today' },
  { id: 'yesterday', label: 'Yesterday' },
  { id: '7d', label: 'Last 7 Days' },
  { id: '30d', label: 'Last 30 Days' },
  { id: 'this_month', label: 'This Month' },
  { id: 'all', label: 'All Time' },
] as const;

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<InvoiceOrderData | null>(null);

  // Live SSE connection
  const { isConnected: isLiveConnected } = useLiveSSE({
    channel: 'admin',
    onNewOrder: (payload) => {
      const newOrd = payload.order;
      if (newOrd) {
        setRecentOrders((prev) => [newOrd, ...prev.filter((o) => o._id !== newOrd._id)].slice(0, 6));
        setOrderStats((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            totalOrders: prev.totalOrders + 1,
            pendingOrders: prev.pendingOrders + 1,
            todayOrders: prev.todayOrders + 1,
            todayRevenue: prev.todayRevenue + (newOrd.totalAmount || 0),
          };
        });
      }
    },
    onOrderUpdated: (payload) => {
      const updatedOrd = payload.order;
      if (updatedOrd) {
        setRecentOrders((prev) =>
          prev.map((ord) => (ord._id === updatedOrd._id ? { ...ord, ...updatedOrd } : ord))
        );
        api.get('/orders/stats').then((res) => {
          if (res.data?.data) setOrderStats(res.data.data);
        }).catch(() => {});
      }
    },
  });

  // Visitor analytics state with filtering
  const [visitorPeriod, setVisitorPeriod] = useState<string>('7d');
  const [visitorStats, setVisitorStats] = useState<VisitorAnalyticsData | null>(null);
  const [loadingVisitors, setLoadingVisitors] = useState<boolean>(false);

  const fetchVisitorStats = async (period: string) => {
    setLoadingVisitors(true);
    try {
      const res = await api.get(`/analytics/visitors?period=${period}`);
      setVisitorStats(res.data?.data || null);
    } catch {
      // Fallback
    } finally {
      setLoadingVisitors(false);
    }
  };

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
    fetchVisitorStats(visitorPeriod);
  }, []);

  const handlePeriodChange = (p: string) => {
    setVisitorPeriod(p);
    fetchVisitorStats(p);
  };

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

  const totalDeviceCount = (visitorStats?.deviceBreakdown || []).reduce((acc, curr) => acc + curr.count, 0) || 1;
  const mobileCount = visitorStats?.deviceBreakdown?.find((d) => d.device.toLowerCase() === 'mobile')?.count || 0;
  const mobilePercent = Math.round((mobileCount / totalDeviceCount) * 100);

  if (loading) {
    return <AdminDashboardSkeleton />;
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
            {/* Live SSE Pulse Pill */}
            <div className={cn(
              'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-300 backdrop-blur-md',
              isLiveConnected
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            )}>
              <span className="relative flex h-2 w-2">
                {isLiveConnected && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span className={cn('relative inline-flex rounded-full h-2 w-2', isLiveConnected ? 'bg-emerald-500' : 'bg-amber-500')}></span>
              </span>
              <span className="font-mono text-[11px]">{isLiveConnected ? 'LIVE FEED ACTIVE' : 'CONNECTING...'}</span>
            </div>

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

      {/* Visitor Traffic & Filtering Section */}
      <div className="card-bb p-5 sm:p-6 border border-brand-border bg-gradient-to-b from-brand-surface to-brand-surface-light shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-white/5 pb-4">
          <div>
            <h2 className="text-base font-bold text-brand-cream uppercase tracking-wide flex items-center gap-2">
              <Users size={18} className="text-brand-yellow" />
              <span>Visitor Traffic & Customer Reach</span>
            </h2>
            <p className="text-xs text-brand-cream/50 mt-0.5">
              Live website visitor analytics, pageviews, and device metrics with custom time filtering
            </p>
          </div>

          {/* Period Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar sm:flex-wrap bg-brand-black/60 p-1 rounded-xl border border-white/10 shrink-0">
            {PERIODS.map((p) => (
              <button
                key={p.id}
                onClick={() => handlePeriodChange(p.id)}
                className={cn(
                  'px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all',
                  visitorPeriod === p.id
                    ? 'bg-brand-yellow text-black shadow-md'
                    : 'text-brand-cream/60 hover:text-brand-cream hover:bg-white/5'
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {loadingVisitors ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card-bb p-4 bg-brand-black/40 border-brand-border/60 space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-20 rounded" />
                  <Skeleton className="w-7 h-7 rounded-lg" />
                </div>
                <Skeleton className="h-7 w-14 rounded" />
                <Skeleton className="h-2.5 w-24 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top metric row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card-bb p-4 bg-brand-black/40 border-brand-border/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-brand-cream/60 uppercase tracking-wider">Unique Visitors</span>
                  <div className="p-1.5 rounded-lg bg-blue-500/15 text-blue-400">
                    <Users size={15} />
                  </div>
                </div>
                <p className="text-2xl font-black text-brand-cream">
                  <AnimatedNumber value={visitorStats?.uniqueVisitors || 0} />
                </p>
                <p className="text-[11px] text-brand-cream/40 mt-1">Filtered by: {PERIODS.find(p => p.id === visitorPeriod)?.label}</p>
              </div>

              <div className="card-bb p-4 bg-brand-black/40 border-brand-border/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-brand-cream/60 uppercase tracking-wider">Total Pageviews</span>
                  <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400">
                    <Globe size={15} />
                  </div>
                </div>
                <p className="text-2xl font-black text-brand-cream">
                  <AnimatedNumber value={visitorStats?.totalPageviews || 0} />
                </p>
                <p className="text-[11px] text-brand-cream/40 mt-1">Total visits recorded</p>
              </div>

              <div className="card-bb p-4 bg-brand-black/40 border-brand-border/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-brand-cream/60 uppercase tracking-wider">Top Device</span>
                  <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400">
                    <Smartphone size={15} />
                  </div>
                </div>
                <p className="text-xl sm:text-2xl font-black text-brand-cream capitalize truncate">
                  {visitorStats?.deviceBreakdown?.[0]?.device || 'Mobile'}
                </p>
                <p className="text-[11px] text-brand-cream/40 mt-1">{mobilePercent}% Mobile Traffic</p>
              </div>

              <div className="card-bb p-4 bg-brand-black/40 border-brand-border/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-brand-cream/60 uppercase tracking-wider">Top Browser</span>
                  <div className="p-1.5 rounded-lg bg-purple-500/15 text-purple-400">
                    <Compass size={15} />
                  </div>
                </div>
                <p className="text-xl sm:text-2xl font-black text-brand-cream capitalize truncate">
                  {visitorStats?.browserBreakdown?.[0]?.browser || 'Chrome'}
                </p>
                <p className="text-[11px] text-brand-cream/40 mt-1">{visitorStats?.browserBreakdown?.[0]?.count || 0} Sessions</p>
              </div>
            </div>

            {/* Popular Pages & Device distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="card-bb p-4 bg-brand-black/40 border-brand-border/60">
                <h3 className="text-xs font-bold uppercase tracking-wider text-brand-cream/70 mb-3 flex items-center gap-1.5">
                  <Globe size={14} className="text-brand-yellow" />
                  <span>Most Visited Customer Pages</span>
                </h3>
                {!visitorStats?.topPages?.length ? (
                  <p className="text-xs text-brand-cream/40 py-4 text-center">No pageview data recorded for this period.</p>
                ) : (
                  <div className="space-y-2">
                    {visitorStats.topPages.slice(0, 5).map((page) => (
                      <div key={page.path} className="flex items-center justify-between p-2 rounded-lg bg-brand-surface border border-white/5 text-xs">
                        <span className="font-mono text-brand-cream truncate max-w-[200px]">{page.path}</span>
                        <span className="font-bold text-brand-yellow shrink-0">{page.count} views</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="card-bb p-4 bg-brand-black/40 border-brand-border/60">
                <h3 className="text-xs font-bold uppercase tracking-wider text-brand-cream/70 mb-3 flex items-center gap-1.5">
                  <Smartphone size={14} className="text-emerald-400" />
                  <span>Device & Platform Share</span>
                </h3>
                {!visitorStats?.deviceBreakdown?.length ? (
                  <p className="text-xs text-brand-cream/40 py-4 text-center">No device data for this period.</p>
                ) : (
                  <div className="space-y-2.5">
                    {visitorStats.deviceBreakdown.map((dev) => {
                      const percent = totalDeviceCount > 0 ? Math.round((dev.count / totalDeviceCount) * 100) : 0;
                      return (
                        <div key={dev.device} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="capitalize text-brand-cream font-medium">{dev.device}</span>
                            <span className="text-brand-yellow font-bold">{dev.count} ({percent}%)</span>
                          </div>
                          <div className="w-full bg-brand-surface rounded-full h-1.5 overflow-hidden">
                            <div className="bg-brand-yellow h-full rounded-full transition-all" style={{ width: `${percent}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
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
          {recentOrders.length === 0 ? (
            <div className="text-center text-brand-cream/40 py-10">
              <p>No incoming customer orders yet.</p>
            </div>
          ) : (
            <>
              {/* 📱 Mobile Recent Orders Cards */}
              <div className="sm:hidden divide-y divide-white/5">
                {recentOrders.map((ord) => {
                  const st = statusConfig[ord.status] || {
                    label: ord.status,
                    color: 'text-brand-cream',
                    bg: 'bg-brand-surface',
                  };
                  const next = nextStatusMap[ord.status];

                  return (
                    <div key={ord._id} className="p-3.5 space-y-2.5 hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono font-bold text-brand-yellow text-xs">
                          #{ord.orderNumber}
                        </span>
                        <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border', st.bg, st.color)}>
                          {st.label}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-brand-cream">{ord.customer.name}</p>
                          <p className="text-brand-cream/50 text-[11px]">{ord.customer.phone}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-brand-yellow">৳{ord.totalAmount}</p>
                          <p className="text-brand-cream/50 text-[10px]">{ord.totalItems} items</p>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between gap-2 border-t border-white/5">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setSelectedInvoiceOrder(ord as unknown as InvoiceOrderData)}
                            className="p-1.5 text-brand-yellow/80 hover:text-brand-yellow hover:bg-brand-yellow/10 rounded-lg transition-colors"
                            title="Print Invoice / Receipt"
                          >
                            <Receipt size={14} />
                          </button>
                          <Link
                            href={`/admin/orders/${ord._id}`}
                            className="p-1.5 text-brand-cream/50 hover:text-brand-cream hover:bg-white/5 rounded-lg transition-colors"
                            title="View Order Details"
                          >
                            <Eye size={14} />
                          </Link>
                        </div>

                        {next && (
                          <button
                            onClick={() => handleUpdateStatus(ord._id, next)}
                            disabled={updatingOrderId === ord._id}
                            className="text-[11px] bg-brand-yellow text-brand-black font-extrabold px-2.5 py-1 rounded-lg hover:bg-brand-yellow-hover transition-colors shadow-sm disabled:opacity-50"
                          >
                            {updatingOrderId === ord._id ? '...' : `Mark ${statusConfig[next]?.label}`}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 💻 Desktop Table */}
              <div className="hidden sm:block overflow-x-auto">
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
                    {recentOrders.map((ord) => {
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
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Invoice Modal for Dashboard */}
      {selectedInvoiceOrder && (
        <InvoiceModal
          isOpen={!!selectedInvoiceOrder}
          onClose={() => setSelectedInvoiceOrder(null)}
          order={selectedInvoiceOrder}
          canPrint={true}
        />
      )}
    </div>
  );
}
