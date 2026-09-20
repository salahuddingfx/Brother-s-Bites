'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import api from '@/lib/api';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Tag,
  Image,
  Settings,
  LogOut,
  Menu,
  X,
  Loader2,
  ShoppingBag,
  Eye,
  Star,
  Plus,
  FolderTree,
  Users,
  ShieldAlert,
  BarChart3,
} from 'lucide-react';
import { User, UserRole } from '@/types';
import ThemeToggle from '@/components/common/ThemeToggle';

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType>({ user: null, setUser: () => {} });
export const useAuth = () => useContext(AuthContext);

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingOrdersCount, setPendingOrdersCount] = useState<number>(0);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/admin/login' || pathname === '/admin/reset-password') {
      setLoading(false);
      return;
    }
    api
      .get('/auth/me')
      .then((res) => {
        const u = res.data?.data?.user || res.data?.data || res.data?.user || res.data;
        if (u && (u._id || u.email || u.role || u.name)) {
          setUser(u);
        } else {
          setUser(null);
        }
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => setLoading(false));

    // Fetch order stats for badge
    api
      .get('/orders/stats')
      .then((res) => {
        const stats = res.data?.data;
        if (stats?.pendingOrders) {
          setPendingOrdersCount(stats.pendingOrders);
        }
      })
      .catch(() => {});
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {}
    if (typeof window !== 'undefined') {
      localStorage.removeItem('bb_admin_token');
    }
    setUser(null);
    window.location.href = '/admin/login';
  };

  // Build role-based navigation items
  const getNavItems = (role?: UserRole) => {
    if (role === 'staff') {
      return [
        {
          label: 'Kitchen Orders',
          href: '/admin/orders',
          icon: ShoppingBag,
          badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} New` : undefined,
        },
      ];
    }

    const baseItems = [
      { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
      {
        label: 'Orders',
        href: '/admin/orders',
        icon: ShoppingBag,
        badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} New` : undefined,
      },
      { label: 'Visitor Analytics', href: '/admin/analytics', icon: BarChart3 },
      { label: 'Menu Items', href: '/admin/menu', icon: UtensilsCrossed },
      { label: 'Categories', href: '/admin/categories', icon: FolderTree },
      { label: 'Offers & Deals', href: '/admin/offers', icon: Tag },
      { label: 'Customer Reviews', href: '/admin/reviews', icon: Star },
      { label: 'Gallery', href: '/admin/gallery', icon: Image },
    ];

    if (role === 'super_admin' || role === 'admin') {
      baseItems.push({
        label: 'Staff & Roles',
        href: '/admin/staff',
        icon: Users,
      });
    }

    if (role === 'super_admin') {
      baseItems.push({
        label: 'Settings',
        href: '/admin/settings',
        icon: Settings,
      });
    }

    return baseItems;
  };

  const navItems = getNavItems(user?.role);

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') return pathname === '/admin/dashboard';
    return pathname === href || pathname.startsWith(href + '/');
  };

  if (pathname === '/admin/login' || pathname === '/admin/reset-password') {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-black flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-brand-yellow" size={36} />
        <p className="text-brand-cream/60 text-xs font-semibold uppercase tracking-wider">
          Loading Admin Control Center...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-brand-black flex flex-col items-center justify-center gap-5 p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-brand-yellow/15 border border-brand-yellow/30 flex items-center justify-center shadow-lg">
          <UtensilsCrossed className="text-brand-yellow" size={28} />
        </div>
        <div className="max-w-md">
          <h2 className="text-2xl font-black text-brand-cream uppercase tracking-tight">
            Admin Sign-in Required
          </h2>
          <p className="text-sm text-brand-cream/60 mt-1.5 leading-relaxed">
            Please sign in to manage food items, orders, and customer reviews.
          </p>
        </div>
        <Link href="/admin/login" className="btn-primary !h-11 text-xs px-8 shadow-lg">
          SIGN IN TO DASHBOARD
        </Link>
      </div>
    );
  }

  // Access check for restricted routes (e.g. staff visiting /admin/staff or /admin/settings)
  const isStaffRestricted =
    user.role === 'staff' && pathname !== '/admin/orders' && !pathname.startsWith('/admin/orders/');
  const isSettingsRestricted =
    user.role !== 'super_admin' && pathname.startsWith('/admin/settings');
  const isStaffManagementRestricted =
    user.role !== 'super_admin' && user.role !== 'admin' && pathname.startsWith('/admin/staff');

  const hasAccessViolation =
    isStaffRestricted || isSettingsRestricted || isStaffManagementRestricted;

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <div className="min-h-screen bg-brand-black flex">
        {/* Mobile Backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            'fixed top-0 left-0 h-full w-64 bg-brand-surface-light border-r border-brand-border z-50 flex flex-col transition-transform duration-300 shadow-2xl',
            'lg:translate-x-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          )}
        >
          {/* Brand Header */}
          <div className="p-4 sm:p-5 border-b border-brand-border flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-black border border-brand-yellow/30 overflow-hidden flex items-center justify-center shadow-sm shrink-0">
                <img
                  src="/images/logo-icon.png"
                  alt="Brother's Bites"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-brand-cream font-black text-sm tracking-wide leading-tight">
                  Brother&apos;s Bites
                </h1>
                <p className="text-brand-yellow text-[11px] font-bold uppercase tracking-wider">
                  Admin Control
                </p>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-brand-cream/60 hover:text-brand-cream p-1.5 rounded-lg hover:bg-white/5"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick Add Food Item CTA (for admins/managers) */}
          {user.role !== 'staff' && (
            <div className="px-3.5 pt-3.5">
              <Link
                href="/admin/menu/new"
                onClick={() => setSidebarOpen(false)}
                className="w-full btn-primary !h-9 text-xs font-bold gap-1.5 justify-center !rounded-xl shadow-sm"
              >
                <Plus size={15} />
                <span>Add Food Item</span>
              </Link>
            </div>
          )}

          {/* Navigation Items */}
          <nav className="flex-1 p-3.5 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all',
                    active
                      ? 'bg-brand-yellow text-brand-black font-extrabold shadow-sm'
                      : 'text-brand-cream/70 hover:text-brand-cream hover:bg-white/5'
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon size={18} className={active ? 'text-brand-black' : 'text-brand-yellow shrink-0'} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={cn(
                        'text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0',
                        active
                          ? 'bg-black text-brand-yellow'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Logout */}
          <div className="p-4 border-t border-brand-border bg-brand-surface/40">
            <Link
              href="/admin/profile"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-2.5 mb-3 px-2.5 py-2 rounded-xl bg-brand-surface border border-brand-border hover:border-brand-yellow/50 transition-colors group cursor-pointer"
              title="View & Edit Profile"
            >
              <div className="w-8 h-8 bg-brand-yellow text-brand-black font-black text-xs rounded-lg flex items-center justify-center shadow-sm shrink-0 uppercase group-hover:scale-105 transition-transform">
                {user.name?.charAt(0) || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-brand-cream text-xs font-bold truncate group-hover:text-brand-yellow transition-colors">
                  {user.name}
                </p>
                <span className="inline-block text-[10px] font-bold text-brand-yellow uppercase tracking-wider">
                  {user.role.replace('_', ' ')}
                </span>
              </div>
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-400/80 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
          {/* Top Header */}
          <header className="sticky top-0 z-30 bg-brand-surface-light/90 backdrop-blur-md border-b border-brand-border shadow-sm">
            <div className="flex items-center justify-between px-4 sm:px-6 h-16">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden text-brand-cream/70 hover:text-brand-cream p-1.5 rounded-lg hover:bg-white/5"
                  aria-label="Open navigation sidebar"
                >
                  <Menu size={22} />
                </button>
                <div className="lg:hidden flex items-center gap-2">
                  <div className="w-7 h-7 bg-brand-yellow rounded-lg flex items-center justify-center font-black text-xs text-black">
                    BB
                  </div>
                  <span className="text-brand-cream font-bold text-sm">Admin</span>
                </div>
                <div className="hidden lg:flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-cream/60">
                  <span>Brother&apos;s Bites Control Center</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Link
                  href="/"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-surface border border-brand-border text-xs font-bold text-brand-cream/80 hover:text-brand-yellow hover:border-brand-yellow/30 transition-all shadow-sm"
                >
                  <Eye size={13} className="text-brand-yellow" />
                  <span className="hidden sm:inline">View Live Site</span>
                </Link>

                <ThemeToggle />
              </div>
            </div>
          </header>

          {/* Page Content or Access Guard */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-brand-black">
            {hasAccessViolation ? (
              <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-4">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-brand-cream">Access Restricted</h2>
                <p className="text-xs sm:text-sm text-brand-cream/60 max-w-sm mt-1 mb-6">
                  Your account role ({user.role}) does not have permission to view this section.
                </p>
                <Link
                  href={user.role === 'staff' ? '/admin/orders' : '/admin/dashboard'}
                  className="btn-primary text-xs"
                >
                  Return to Accessible Section
                </Link>
              </div>
            ) : (
              children
            )}
          </main>
        </div>
      </div>
    </AuthContext.Provider>
  );
}
