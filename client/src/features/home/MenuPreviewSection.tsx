'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import SectionHeader from '@/components/common/SectionHeader';
import MenuCard from '@/components/menu/MenuCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import api from '@/lib/api';
import { MenuItem, Category } from '@/types';
import { cn } from '@/lib/utils';

export default function MenuPreviewSection() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, menuRes] = await Promise.all([
          api.get('/categories'),
          api.get('/menu?limit=6'),
        ]);
        const cats = Array.isArray(catRes.data.data)
          ? catRes.data.data
          : catRes.data.data?.categories || [];
        const menuList = Array.isArray(menuRes.data.data)
          ? menuRes.data.data
          : menuRes.data.data?.items || [];
        setCategories(cats);
        setItems(menuList);
      } catch {
        // graceful fallback
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const safeItems = Array.isArray(items) ? items : [];
  const filteredItems = activeCategory === 'all'
    ? safeItems
    : safeItems.filter((item) => {
        const cat = item.category as Category;
        return cat?._id === activeCategory ||
               cat?.name?.toLowerCase() === activeCategory.toLowerCase() ||
               cat?.slug?.toLowerCase() === activeCategory.toLowerCase();
      });

  return (
    <section className="section-padding bg-brand-surface border-t border-white/5">
      <div className="container-bb">
        <SectionHeader
          eyebrow="Crafted With Care"
          title="EXPLORE OUR MENU"
          subtitle="From sizzling street bites to refreshing beachside sips."
        />

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 sm:mb-10 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:justify-center">
          <button
            onClick={() => setActiveCategory('all')}
            className={cn(
              'px-4 py-2 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-all shadow-sm',
              activeCategory === 'all'
                ? 'bg-brand-yellow text-black font-extrabold shadow-[0_2px_10px_rgba(var(--brand-yellow-rgb),0.35)]'
                : 'bg-brand-surface-light text-brand-cream/70 hover:text-brand-cream border border-brand-border hover:border-brand-yellow/50'
            )}
          >
            All Items
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setActiveCategory(cat._id)}
              className={cn(
                'px-4 py-2 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-all shadow-sm',
                activeCategory === cat._id
                  ? 'bg-brand-yellow text-black font-extrabold shadow-[0_2px_10px_rgba(var(--brand-yellow-rgb),0.35)]'
                  : 'bg-brand-surface-light text-brand-cream/70 hover:text-brand-cream border border-brand-border hover:border-brand-yellow/50'
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Grid or Loading */}
        {loading ? (
          <LoadingSpinner />
        ) : filteredItems.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
          >
            {filteredItems.slice(0, 6).map((item) => (
              <MenuCard key={item._id} item={item} featured={item.isFeatured} />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12 text-brand-cream/50 text-sm">
            No items currently available in this category.
          </div>
        )}

        <div className="text-center mt-10 sm:mt-12">
          <Link href="/menu" className="btn-primary">
            VIEW FULL MENU
          </Link>
        </div>
      </div>
    </section>
  );
}
