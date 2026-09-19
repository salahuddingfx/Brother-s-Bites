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
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-cream/40"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items..."
            className="w-full bg-brand-surface-light border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-brand-cream text-sm placeholder-brand-cream/30 focus:outline-none focus:border-brand-yellow transition-colors"
          />
        </div>
        <div className="flex gap-1 bg-brand-surface-light rounded-lg border border-white/10 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'px-4 py-1.5 rounded-md text-sm font-medium transition-colors',
                activeTab === tab.key
                  ? 'bg-brand-yellow text-brand-black'
                  : 'text-brand-cream/60 hover:text-brand-cream'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-brand-yellow" size={32} />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-brand-surface-light rounded-xl border border-white/10 p-12 text-center">
          <UtensilsCrossed size={48} className="mx-auto text-brand-cream/20 mb-4" />
          <p className="text-brand-cream/50 text-lg">No menu items found</p>
          <Link
            href="/admin/menu/new"
            className="mt-4 inline-flex items-center gap-2 text-brand-yellow hover:underline"
          >
            <Plus size={16} /> Add your first item
          </Link>
        </div>
      ) : (
        <div className="bg-brand-surface-light rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-brand-cream/50 text-sm font-medium px-5 py-3">Item</th>
                  <th className="text-left text-brand-cream/50 text-sm font-medium px-5 py-3 hidden md:table-cell">Category</th>
                  <th className="text-left text-brand-cream/50 text-sm font-medium px-5 py-3">Price</th>
                  <th className="text-left text-brand-cream/50 text-sm font-medium px-5 py-3 hidden lg:table-cell">Available</th>
                  <th className="text-left text-brand-cream/50 text-sm font-medium px-5 py-3 hidden lg:table-cell" title="Show in homepage Hero slider">Hero / Featured</th>
                  <th className="text-right text-brand-cream/50 text-sm font-medium px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b border-white/5 last:border-0 hover:bg-brand-surface-hover transition-colors"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-brand-surface rounded-lg flex items-center justify-center">
                            <UtensilsCrossed size={16} className="text-brand-cream/30" />
                          </div>
                        )}
                        <span className="text-brand-cream text-sm font-medium">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-brand-cream/60 text-sm hidden md:table-cell">
                      {getCategoryName(item.category)}
                    </td>
                    <td className="px-5 py-3 text-brand-cream text-sm">৳{item.price}</td>
                    <td className="px-5 py-3 hidden lg:table-cell">
                      <button
                        onClick={() => toggleAvailability(item._id)}
                        disabled={togglingId === item._id}
                        className={cn(
                          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                          item.isAvailable ? 'bg-green-500' : 'bg-white/20'
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
                    <td className="px-5 py-3 hidden lg:table-cell">
                      <button
                        onClick={() => toggleFeatured(item._id)}
                        disabled={togglingId === item._id}
                        className="p-1"
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
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/menu/${item._id}/edit`}
                          className="p-2 text-brand-cream/50 hover:text-brand-yellow hover:bg-brand-surface-hover rounded-lg transition-colors"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button
                          onClick={() => setDeleteId(item._id)}
                          className="p-2 text-brand-cream/50 hover:text-red-400 hover:bg-brand-surface-hover rounded-lg transition-colors"
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
