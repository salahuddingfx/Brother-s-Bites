'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { cn } from '@/lib/utils';
import {
  Users,
  Eye,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  RefreshCw,
  TrendingUp,
  ArrowUpRight,
  Clock,
  Sparkles,
  Compass,
  Activity,
  Calendar,
  ExternalLink,
} from 'lucide-react';

interface AnalyticsData {
  period: string;
  totalPageviews: number;
  uniqueVisitors: number;
  topPages: { path: string; count: number }[];
  deviceBreakdown: { device: string; count: number }[];
  browserBreakdown: { browser: string; count: number }[];
  recentVisits?: {
    _id?: string;
    path: string;
    device: string;
    browser: string;
    referrer?: string;
    createdAt: string;
  }[];
  timeline?: { date: string; count: number }[];
}

const PERIODS = [
  { id: 'today', label: 'Today' },
  { id: 'yesterday', label: 'Yesterday' },
  { id: '7d', label: 'Last 7 Days' },
  { id: '30d', label: 'Last 30 Days' },
  { id: 'this_month', label: 'This Month' },
  { id: 'all', label: 'All Time' },
];

export default function AdminAnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('7d');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchAnalytics = useCallback(async (period: string, isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await api.get(`/analytics/visitors?period=${period}`);
      if (res.data?.success) {
        setAnalytics(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics(selectedPeriod);
  }, [selectedPeriod, fetchAnalytics]);

  const totalViews = analytics?.totalPageviews || 0;
  const uniqueVisitors = analytics?.uniqueVisitors || 0;
  const avgViewsPerVisitor = uniqueVisitors > 0 ? (totalViews / uniqueVisitors).toFixed(1) : '0';

  // Calculate device percentages
  const mobileCount =
    analytics?.deviceBreakdown?.find((d) => d.device.toLowerCase() === 'mobile')?.count || 0;
  const desktopCount =
    analytics?.deviceBreakdown?.find((d) => d.device.toLowerCase() === 'desktop')?.count || 0;
  const tabletCount =
    analytics?.deviceBreakdown?.find((d) => d.device.toLowerCase() === 'tablet')?.count || 0;
  const totalDeviceCount = (analytics?.deviceBreakdown || []).reduce((acc, curr) => acc + curr.count, 0) || 1;

  const mobilePercent = Math.round((mobileCount / totalDeviceCount) * 100);
  const desktopPercent = Math.round((desktopCount / totalDeviceCount) * 100);
  const tabletPercent = Math.round((tabletCount / totalDeviceCount) * 100);

  const topLandingPage = analytics?.topPages?.[0]?.path || '/';

  const formatRelativeTime = (isoString?: string) => {
    if (!isoString) return 'Just now';
    const now = new Date();
    const past = new Date(isoString);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getPageLabel = (path: string) => {
    if (path === '/') return 'Homepage (Main Banner & Showcase)';
    if (path === '/menu') return 'Full Digital Menu & Ordering';
    if (path === '/about') return 'About Brotherhood & Chefs';
    if (path === '/location') return 'Marine Drive Live Map & Directions';
    if (path === '/gallery') return 'Restaurant & Food Gallery';
    if (path === '/reviews') return 'Customer Reviews & Ratings';
    if (path === '/offers') return 'Deals & Specials';
    if (path.startsWith('/menu/')) return 'Menu Item Detail Page';
    return path;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-brand-cream tracking-tight uppercase">
              Visitor Analytics
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Beacon Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-brand-cream/60 mt-1">
            Real-time traffic metrics, visitor devices, popular dishes explored, and Cox&apos;s Bazar tourist interactions.
          </p>
        </div>

        {/* Filter Controls & Refresh */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Period Pills */}
          <div className="flex items-center bg-brand-surface p-1 rounded-xl border border-white/10 overflow-x-auto">
            {PERIODS.map((period) => (
              <button
                key={period.id}
                type="button"
                onClick={() => setSelectedPeriod(period.id)}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap',
                  selectedPeriod === period.id
                    ? 'bg-brand-yellow text-brand-black font-bold shadow-sm'
                    : 'text-brand-cream/70 hover:text-brand-cream hover:bg-white/5'
                )}
              >
                {period.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => fetchAnalytics(selectedPeriod, true)}
            disabled={refreshing || loading}
            className="p-2.5 rounded-xl border border-white/10 bg-brand-surface hover:bg-white/5 text-brand-cream/80 hover:text-brand-yellow transition-all disabled:opacity-50"
            title="Refresh analytics data"
          >
            <RefreshCw size={16} className={cn(refreshing && 'animate-spin text-brand-yellow')} />
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Pageviews */}
        <div className="bg-brand-surface border border-white/10 rounded-2xl p-5 relative overflow-hidden group hover:border-brand-yellow/30 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-yellow/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
          <div className="flex items-center justify-between text-brand-cream/60 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Pageviews</span>
            <div className="w-8 h-8 rounded-lg bg-brand-yellow/10 text-brand-yellow flex items-center justify-center">
              <Eye size={16} />
            </div>
          </div>
          <div className="text-3xl font-black text-brand-cream font-mono">
            {loading ? '...' : totalViews.toLocaleString()}
          </div>
          <p className="text-[11px] text-brand-cream/50 mt-1 flex items-center gap-1">
            <TrendingUp size={12} className="text-emerald-400" />
            <span>Avg {avgViewsPerVisitor} views per visitor</span>
          </p>
        </div>

        {/* Card 2: Unique Visitors */}
        <div className="bg-brand-surface border border-white/10 rounded-2xl p-5 relative overflow-hidden group hover:border-blue-400/30 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
          <div className="flex items-center justify-between text-brand-cream/60 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Unique Visitors</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Users size={16} />
            </div>
          </div>
          <div className="text-3xl font-black text-brand-cream font-mono">
            {loading ? '...' : uniqueVisitors.toLocaleString()}
          </div>
          <p className="text-[11px] text-brand-cream/50 mt-1">
            Distinct devices & sessions
          </p>
        </div>

        {/* Card 3: Mobile vs Desktop */}
        <div className="bg-brand-surface border border-white/10 rounded-2xl p-5 relative overflow-hidden group hover:border-purple-400/30 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
          <div className="flex items-center justify-between text-brand-cream/60 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Mobile Traffic Share</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Smartphone size={16} />
            </div>
          </div>
          <div className="text-3xl font-black text-brand-cream font-mono">
            {loading ? '...' : `${mobilePercent}%`}
          </div>
          <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-purple-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${mobilePercent}%` }}
            />
          </div>
        </div>

        {/* Card 4: Top Visited Page */}
        <div className="bg-brand-surface border border-white/10 rounded-2xl p-5 relative overflow-hidden group hover:border-emerald-400/30 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
          <div className="flex items-center justify-between text-brand-cream/60 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Top Landing Route</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Compass size={16} />
            </div>
          </div>
          <div className="text-lg font-bold text-brand-cream truncate font-mono">
            {loading ? '...' : topLandingPage}
          </div>
          <p className="text-[11px] text-brand-cream/50 mt-1 truncate">
            {getPageLabel(topLandingPage)}
          </p>
        </div>
      </div>

      {/* Daily Timeline Bar Chart (if data available) */}
      {analytics?.timeline && analytics.timeline.length > 0 && (
        <div className="bg-brand-surface border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-yellow" />
              <h2 className="text-base font-bold text-brand-cream">Daily Traffic Activity</h2>
            </div>
            <span className="text-xs text-brand-cream/50">Hits per day</span>
          </div>

          <div className="pt-4 flex items-end gap-2 h-44 sm:h-52 overflow-x-auto pb-2">
            {(() => {
              const maxDay = Math.max(...analytics.timeline.map((t) => t.count), 1);
              return analytics.timeline.map((item, idx) => {
                const heightPercent = Math.max(Math.round((item.count / maxDay) * 100), 8);
                const displayDate = item.date.slice(5); // e.g. "09-20"
                return (
                  <div key={idx} className="flex-1 min-w-[36px] max-w-[60px] flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[10px] font-mono text-brand-cream/60 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.count}
                    </span>
                    <div className="w-full bg-white/5 rounded-t-lg overflow-hidden flex items-end h-[120px] sm:h-[140px]">
                      <div
                        className="w-full bg-gradient-to-t from-brand-yellow to-amber-300 rounded-t-lg transition-all duration-300 group-hover:brightness-125"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-brand-cream/50 font-mono whitespace-nowrap">
                      {displayDate}
                    </span>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}

      {/* Deep Analytics: Top Pages & Device/Browser Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Popular Pages */}
        <div className="bg-brand-surface border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4 text-brand-yellow" />
              <h2 className="text-base font-bold text-brand-cream">Most Visited Pages</h2>
            </div>
            <span className="text-xs text-brand-cream/50">Hits & Share</span>
          </div>

          {loading ? (
            <div className="py-8 text-center text-xs text-brand-cream/40">Loading page stats...</div>
          ) : !analytics?.topPages?.length ? (
            <div className="py-8 text-center text-xs text-brand-cream/40">
              No pageviews recorded yet for this timeframe.
            </div>
          ) : (
            <div className="space-y-3">
              {analytics.topPages.map((page, idx) => {
                const percent = totalViews > 0 ? Math.round((page.count / totalViews) * 100) : 0;
                return (
                  <div key={idx} className="space-y-1.5 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <span className={cn(
                          'w-5 h-5 rounded flex items-center justify-center text-[10px] font-black shrink-0',
                          idx === 0 ? 'bg-amber-400/20 text-amber-300' :
                          idx === 1 ? 'bg-slate-300/20 text-slate-300' :
                          idx === 2 ? 'bg-amber-700/20 text-amber-500' :
                          'bg-white/5 text-brand-cream/50'
                        )}>
                          {idx + 1}
                        </span>
                        <Link
                          href={page.path}
                          target="_blank"
                          className="font-mono text-brand-cream/90 hover:text-brand-yellow truncate transition-colors flex items-center gap-1"
                        >
                          {page.path}
                          <ExternalLink size={10} className="opacity-40" />
                        </Link>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-mono font-bold text-brand-cream">{page.count}</span>
                        <span className="text-[10px] text-brand-cream/40 w-9 text-right font-mono">
                          {percent}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-brand-yellow h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(percent, 3)}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-brand-cream/40 truncate pl-7">
                      {getPageLabel(page.path)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Device & Browser Share */}
        <div className="space-y-6">
          {/* Device Breakdown */}
          <div className="bg-brand-surface border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-purple-400" />
                <h2 className="text-base font-bold text-brand-cream">Device Distribution</h2>
              </div>
              <span className="text-xs text-brand-cream/50">Operating Platforms</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center space-y-1">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto">
                  <Smartphone size={16} />
                </div>
                <div className="text-lg font-black text-brand-cream font-mono">{mobilePercent}%</div>
                <p className="text-[10px] text-brand-cream/50 uppercase font-semibold">Mobile ({mobileCount})</p>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center space-y-1">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto">
                  <Monitor size={16} />
                </div>
                <div className="text-lg font-black text-brand-cream font-mono">{desktopPercent}%</div>
                <p className="text-[10px] text-brand-cream/50 uppercase font-semibold">Desktop ({desktopCount})</p>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center space-y-1">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                  <Tablet size={16} />
                </div>
                <div className="text-lg font-black text-brand-cream font-mono">{tabletPercent}%</div>
                <p className="text-[10px] text-brand-cream/50 uppercase font-semibold">Tablet ({tabletCount})</p>
              </div>
            </div>
          </div>

          {/* Browser Breakdown */}
          <div className="bg-brand-surface border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-400" />
                <h2 className="text-base font-bold text-brand-cream">Top Browsers</h2>
              </div>
              <span className="text-xs text-brand-cream/50">Client Clients</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {(analytics?.browserBreakdown || []).map((b, idx) => (
                <div
                  key={idx}
                  className="px-3 py-2 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-2.5 text-xs font-medium text-brand-cream"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  <span>{b.browser}</span>
                  <span className="text-brand-cream/40 font-mono text-[11px]">({b.count})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Visitor Stream (Recent Visits Log) */}
      <div className="bg-brand-surface border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <h2 className="text-base font-bold text-brand-cream">Recent Visitor Stream</h2>
          </div>
          <span className="text-xs text-brand-cream/50">Latest page interactions & referrer logs</span>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-brand-cream/40">Loading activity feed...</div>
        ) : !analytics?.recentVisits?.length ? (
          <div className="py-8 text-center text-xs text-brand-cream/40">
            No recent activity recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-brand-cream/40 border-b border-white/5 uppercase tracking-wider text-[10px]">
                  <th className="pb-2.5 font-semibold">Page Route</th>
                  <th className="pb-2.5 font-semibold">Device</th>
                  <th className="pb-2.5 font-semibold">Browser</th>
                  <th className="pb-2.5 font-semibold">Referrer</th>
                  <th className="pb-2.5 font-semibold text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {analytics.recentVisits.map((visit, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 text-brand-cream font-bold pr-3">
                      <Link href={visit.path} target="_blank" className="hover:text-brand-yellow truncate block max-w-[200px] sm:max-w-none">
                        {visit.path}
                      </Link>
                    </td>
                    <td className="py-3 text-brand-cream/70 capitalize">
                      <span className="inline-flex items-center gap-1.5">
                        {visit.device === 'mobile' && <Smartphone size={13} className="text-purple-400" />}
                        {visit.device === 'desktop' && <Monitor size={13} className="text-blue-400" />}
                        {visit.device === 'tablet' && <Tablet size={13} className="text-emerald-400" />}
                        {visit.device}
                      </span>
                    </td>
                    <td className="py-3 text-brand-cream/70">{visit.browser}</td>
                    <td className="py-3 text-brand-cream/40 truncate max-w-[150px]">
                      {visit.referrer ? visit.referrer.replace(/https?:\/\//, '') : 'Direct / Local'}
                    </td>
                    <td className="py-3 text-right text-brand-cream/50 text-[11px] whitespace-nowrap">
                      {formatRelativeTime(visit.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
