'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { MenuItem, Category } from '@/types';
import { cn } from '@/lib/utils';
import {
  Plus,
  Search,
  Star,
  Pencil,
  Trash2,
  Loader2,
  UtensilsCrossed,
  X,
  Filter,
} from 'lucide-react';
import AdminTableSkeleton from '@/components/skeletons/AdminTableSkeleton';

type FilterTab = 'all' | 'available' | 'unavailable' | 'featured';

export default function AdminMenuPage() {
  const router = useRouter();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [menuRes, catRes] = await Promise.all([
        api.get('/menu'),
        api.get('/categories'),
      ]);
      setItems(menuRes.data.data?.items || menuRes.data.data || []);
      setCategories(catRes.data.data?.categories || catRes.data.data || []);
    } catch (err) {
      console.error('Failed to fetch menu', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (typeof item.category === 'object'
        ? item.category?.name?.toLowerCase().includes(search.toLowerCase())
        : item.category?.toLowerCase().includes(search.toLowerCase()));

    switch (activeTab) {
      case 'available':
        return matchesSearch && item.isAvailable;
      case 'unavailable':
        return matchesSearch && !item.isAvailable;
      case 'featured':
        return matchesSearch && item.isFeatured;
      default:
        return matchesSearch;
    }
  });

  const toggleAvailability = async (id: string) => {
    setTogglingId(id);
    try {
      await api.patch(`/menu/${id}/toggle-availability`);
      setItems((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, isAvailable: !item.isAvailable } : item
        )
      );
    } catch (err) {
      console.error('Failed to toggle availability', err);
    } finally {
      setTogglingId(null);
    }
  };

  const toggleFeatured = async (id: string) => {
    setTogglingId(id);
    try {
      await api.patch(`/menu/${id}/toggle-featured`);
      setItems((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, isFeatured: !item.isFeatured } : item
        )
      );
    } catch (err) {
      console.error('Failed to toggle featured', err);
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.delete(`/menu/${deleteId}`);
      setItems((prev) => prev.filter((item) => item._id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error('Failed to delete item', err);
    } finally {
      setDeleting(false);
    }
  };

  const getCategoryName = (category: any) => {
    if (typeof category === 'object' && category?.name) return category.name;
    const found = categories.find((c) => c._id === category || c.slug === category);
    return found?.name || 'Uncategorized';
  };

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'available', label: 'Available' },
    { key: 'unavailable', label: 'Unavailable' },
    { key: 'featured', label: 'Featured (Hero)' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-brand-cream">Menu Items</h1>
          <p className="text-brand-cream/50 mt-1">{items.length} total items</p>
        </div>
        <Link
          href="/admin/menu/new"
          className="bg-brand-yellow text-brand-black font-semibold px-5 py-2.5 rounded-lg hover:bg-brand-yellow/90 transition-colors inline-flex items-center gap-2"
        >
          <Plus size={18} />
          Add Item
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-cream/40"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search food items..."
            className="w-full bg-brand-surface-light border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-brand-cream text-sm placeholder-brand-cream/30 focus:outline-none focus:border-brand-yellow transition-colors shadow-sm"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar bg-brand-surface-light rounded-xl border border-white/10 p-1 shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all',
                activeTab === tab.key
                  ? 'bg-brand-yellow text-brand-black shadow-md'
                  : 'text-brand-cream/60 hover:text-brand-cream'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Food Items List / Table */}
      {loading ? (
        <AdminTableSkeleton rows={5} />
      ) : filteredItems.length === 0 ? (
        <div className="bg-brand-surface-light rounded-2xl border border-white/10 p-12 text-center shadow-xl space-y-3">
          <UtensilsCrossed size={48} className="mx-auto text-brand-cream/20" />
          <p className="text-brand-cream/60 text-base font-semibold">No menu items found</p>
          <Link
            href="/admin/menu/new"
            className="inline-flex items-center gap-2 btn-primary !h-10 text-xs px-5 shadow-md"
          >
            <Plus size={15} /> Add your first dish
          </Link>
        </div>
      ) : (
        <div className="bg-brand-surface-light rounded-2xl border border-white/10 overflow-hidden shadow-xl">
          {/* 📱 Mobile Food Items Card View */}
          <div className="sm:hidden divide-y divide-white/5">
            {filteredItems.map((item) => (
              <div key={item._id} className="p-4 space-y-3 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-3">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0 border border-white/10 shadow-sm"
                    />
                  ) : (
                    <div className="w-14 h-14 bg-brand-surface rounded-xl flex items-center justify-center shrink-0 border border-white/10">
                      <UtensilsCrossed size={20} className="text-brand-cream/30" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="text-brand-cream font-bold text-sm truncate">{item.name}</h3>
                      <span className="text-brand-yellow font-black text-sm shrink-0">৳{item.price}</span>
                    </div>
                    <p className="text-brand-cream/50 text-xs mt-0.5 truncate">{getCategoryName(item.category)}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full', item.isAvailable ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/15 text-red-400 border border-red-500/30')}>
                        {item.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                      {item.isFeatured && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-0.5">
                          <Star size={9} className="fill-amber-400" />
                          <span>Hero Featured</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Mobile Item Controls */}
                <div className="pt-2 flex items-center justify-between gap-2 border-t border-white/5 text-xs">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleAvailability(item._id)}
                      disabled={togglingId === item._id}
                      className={cn(
                        'px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-all',
                        item.isAvailable
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-white/5 text-brand-cream/60 border border-white/10'
                      )}
                    >
                      <span>{item.isAvailable ? 'In Stock' : 'Out of Stock'}</span>
                    </button>
                    <button
                      onClick={() => toggleFeatured(item._id)}
                      disabled={togglingId === item._id}
                      className={cn(
                        'p-1.5 rounded-lg border transition-all',
                        item.isFeatured
                          ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                          : 'bg-brand-surface text-brand-cream/40 border-white/10'
                      )}
                      title="Toggle Hero"
                    >
                      <Star size={14} className={item.isFeatured ? 'fill-amber-400' : ''} />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/admin/menu/${item._id}/edit`}
                      className="p-1.5 rounded-lg bg-brand-surface border border-brand-border text-brand-cream/80 hover:text-brand-yellow transition-colors"
                      title="Edit Item"
                    >
                      <Pencil size={14} />
                    </Link>
                    <button
                      onClick={() => setDeleteId(item._id)}
                      className="p-1.5 rounded-lg bg-brand-surface border border-brand-border text-brand-cream/60 hover:text-red-400 transition-colors"
                      title="Delete Item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 💻 Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-brand-cream/50 text-xs font-bold uppercase tracking-wider px-5 py-3.5">Item</th>
                  <th className="text-left text-brand-cream/50 text-xs font-bold uppercase tracking-wider px-5 py-3.5 hidden md:table-cell">Category</th>
                  <th className="text-left text-brand-cream/50 text-xs font-bold uppercase tracking-wider px-5 py-3.5">Price</th>
                  <th className="text-left text-brand-cream/50 text-xs font-bold uppercase tracking-wider px-5 py-3.5 hidden lg:table-cell">Available</th>
                  <th className="text-left text-brand-cream/50 text-xs font-bold uppercase tracking-wider px-5 py-3.5 hidden lg:table-cell" title="Show in homepage Hero slider">Hero / Featured</th>
                  <th className="text-right text-brand-cream/50 text-xs font-bold uppercase tracking-wider px-5 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b border-white/5 last:border-0 hover:bg-brand-surface-hover transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-11 h-11 rounded-xl object-cover border border-white/10 shadow-sm shrink-0"
                          />
                        ) : (
                          <div className="w-11 h-11 bg-brand-surface rounded-xl flex items-center justify-center border border-white/10 shrink-0">
                            <UtensilsCrossed size={18} className="text-brand-cream/30" />
                          </div>
                        )}
                        <div>
                          <span className="text-brand-cream text-sm font-bold block">{item.name}</span>
                          <span className="text-brand-cream/40 text-xs md:hidden">{getCategoryName(item.category)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-brand-cream/70 text-sm hidden md:table-cell font-medium">
                      {getCategoryName(item.category)}
                    </td>
                    <td className="px-5 py-3.5 text-brand-yellow font-bold text-sm">৳{item.price}</td>
                    <td className="px-5 py-3.5 hidden lg:table-cell">
                      <button
                        onClick={() => toggleAvailability(item._id)}
                        disabled={togglingId === item._id}
                        className={cn(
                          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                          item.isAvailable ? 'bg-emerald-500' : 'bg-white/20'
                        )}
                      >
                        <span
                          className={cn(
                            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                            item.isAvailable ? 'translate-x-6' : 'translate-x-1'
                          )}
                        />
                      </button>
                    </td>
                    <td className="px-5 py-3.5 hidden lg:table-cell">
                      <button
                        onClick={() => toggleFeatured(item._id)}
                        disabled={togglingId === item._id}
                        className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        <Star
                          size={18}
                          className={cn(
                            'transition-colors',
                            item.isFeatured
                              ? 'text-brand-yellow fill-brand-yellow'
                              : 'text-brand-cream/30 hover:text-brand-yellow'
                          )}
                        />
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/menu/${item._id}/edit`}
                          className="p-2 text-brand-cream/60 hover:text-brand-yellow hover:bg-white/5 rounded-xl transition-colors"
                          title="Edit Item"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button
                          onClick={() => setDeleteId(item._id)}
                          className="p-2 text-brand-cream/60 hover:text-red-400 hover:bg-white/5 rounded-xl transition-colors"
                          title="Delete Item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-brand-surface-light rounded-xl border border-white/10 p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <Trash2 size={20} className="text-red-400" />
              </div>
              <h3 className="text-brand-cream font-semibold text-lg">Delete Item</h3>
            </div>
            <p className="text-brand-cream/60 mb-6">
              Are you sure you want to delete this menu item? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-brand-cream/60 hover:text-brand-cream text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {deleting && <Loader2 className="animate-spin" size={16} />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
