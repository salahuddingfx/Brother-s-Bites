'use client';

import { useState, useEffect } from 'react';
import { Search, UtensilsCrossed } from 'lucide-react';
import api from '@/lib/api';
import MenuCard from '@/components/menu/MenuCard';
import MenuCardSkeleton from '@/components/skeletons/MenuCardSkeleton';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';
import type { MenuItem, Category } from '@/types';
import { cn } from '@/lib/utils';

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [categoriesData, itemsData] = await Promise.all([
          api.get('/categories'),
          api.get('/menu'),
        ]);
        const cats = Array.isArray(categoriesData.data.data)
          ? categoriesData.data.data
          : categoriesData.data.data?.categories || [];
        const menuList = Array.isArray(itemsData.data.data)
          ? itemsData.data.data
          : itemsData.data.data?.items || [];
        setCategories(cats);
        setItems(menuList);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load menu');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') return;
    async function fetchItems() {
      try {
        setLoading(true);
        const params = `?category=${selectedCategory}`;
        const res = await api.get(`/menu${params}`);
        const menuList = Array.isArray(res.data.data)
          ? res.data.data
          : res.data.data?.items || [];
        setItems(menuList);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load menu');
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, [selectedCategory]);

  const safeItems = Array.isArray(items) ? items : [];
  const filteredItems = safeItems.filter((item) =>
    item?.name?.toLowerCase().includes(search.toLowerCase()) ||
    item?.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pb-16 sm:pb-20 pt-4 sm:pt-6">
      {/* Header Banner */}
      <div className="container-bb text-center mb-8 sm:mb-12">
        <p className="eyebrow-bb mb-2">Fresh & Flavorful</p>
        <h1 className="heading-page text-brand-cream uppercase mb-3">OUR FULL MENU</h1>
        <p className="text-brand-cream/60 text-sm sm:text-base max-w-xl mx-auto">
          Explore handcrafted momos, authentic fuchka, seafood fries, sizzling chicken, and beachside drinks.
        </p>
      </div>

      <div className="container-bb">
        {/* Search Bar & Category Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8 sm:mb-10">
          {/* Search Input */}
          <div className="relative w-full md:max-w-xs">
            <Search className="w-4 h-4 text-brand-cream/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search dishes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-brand-surface border border-brand-border text-brand-cream placeholder-brand-cream/40 text-sm focus:outline-none focus:border-brand-yellow transition-colors shadow-sm"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
            <button
              onClick={() => setSelectedCategory('all')}
              className={cn(
                'px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all shadow-sm',
                selectedCategory === 'all'
                  ? 'bg-brand-yellow text-black font-extrabold shadow-[0_2px_10px_rgba(var(--brand-yellow-rgb),0.35)]'
                  : 'bg-brand-surface text-brand-cream/70 hover:text-brand-cream border border-brand-border hover:border-brand-yellow/50'
              )}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat._id)}
                className={cn(
                  'px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all shadow-sm',
                  selectedCategory === cat._id
                    ? 'bg-brand-yellow text-black font-extrabold shadow-[0_2px_10px_rgba(var(--brand-yellow-rgb),0.35)]'
                    : 'bg-brand-surface text-brand-cream/70 hover:text-brand-cream border border-brand-border hover:border-brand-yellow/50'
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        {loading && <MenuCardSkeleton count={6} />}

        {error && <ErrorState message={error} onRetry={() => setSelectedCategory('all')} />}

        {!loading && !error && filteredItems.length === 0 && (
          <EmptyState
            icon={<UtensilsCrossed className="w-12 h-12" />}
            title="No dishes found"
            description="Try searching with a different term or select another category."
          />
        )}

        {!loading && !error && filteredItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredItems.map((item) => (
              <MenuCard key={item._id} item={item} featured={item.isFeatured} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
