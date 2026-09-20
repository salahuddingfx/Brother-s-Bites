'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';
import api from '@/lib/api';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import ImageLightboxModal from '@/components/common/ImageLightboxModal';
import type { GalleryImage } from '@/types';
import { cn } from '@/lib/utils';

const TABS = ['All', 'Food', 'Place', 'Vibe'] as const;

const DEFAULT_GALLERY: GalleryImage[] = [
  { _id: 'def-1', title: 'Main Chef Ahammad Bin Kashem', category: 'vibe', image: '/images/team/chef-ahammad.jpg', isActive: true, sortOrder: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: 'def-2', title: 'Assistant Chef Sahed Mostafa', category: 'vibe', image: '/images/team/assistant-chef-sahed.jpg', isActive: true, sortOrder: 2, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: 'def-3', title: 'Live Kitchen Searing & Prep', category: 'food', image: '/images/team/kitchen-action.jpg', isActive: true, sortOrder: 3, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: 'def-4', title: 'The Brotherhood Kitchen Crew', category: 'vibe', image: '/images/team/team-brotherhood.jpg', isActive: true, sortOrder: 4, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: 'def-5', title: 'Live Street Cooking Art', category: 'food', image: '/images/shop/shop-1.jpg', isActive: true, sortOrder: 5, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: 'def-6', title: 'Fresh Hot Snacks Preparation', category: 'food', image: '/images/shop/shop-2.jpg', isActive: true, sortOrder: 6, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: 'def-7', title: 'Chef Specialty Bites', category: 'food', image: '/images/shop/shop-3.jpg', isActive: true, sortOrder: 7, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: 'def-8', title: 'Evening Service Prep', category: 'vibe', image: '/images/shop/shop-4.jpg', isActive: true, sortOrder: 8, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: 'def-9', title: 'Beachside Food Stand', category: 'place', image: '/images/shop/shop-5.jpg', isActive: true, sortOrder: 9, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: 'def-10', title: 'Fresh Food & Beverage Counter', category: 'place', image: '/images/shop/shop-6.jpg', isActive: true, sortOrder: 10, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: 'def-11', title: 'Marine Drive Sonar Para Beach Stand', category: 'place', image: '/images/shop/shop-7.jpg', isActive: true, sortOrder: 11, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: 'def-12', title: 'Live Order Serving', category: 'food', image: '/images/shop/shop-8.jpg', isActive: true, sortOrder: 12, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: 'def-13', title: 'Fresh Street Bites & Snacks', category: 'food', image: '/images/shop/shop-9.jpg', isActive: true, sortOrder: 13, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: 'def-14', title: 'Evening Beachside Ambience', category: 'vibe', image: '/images/shop/shop-10.jpg', isActive: true, sortOrder: 14, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: 'def-15', title: 'Fresh Ingredients Display', category: 'food', image: '/images/shop/shop-11.jpg', isActive: true, sortOrder: 15, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: 'def-16', title: 'Golden Crispy Fry Counter', category: 'food', image: '/images/shop/shop-12.jpg', isActive: true, sortOrder: 16, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: 'def-17', title: 'Beachside Walkway View', category: 'place', image: '/images/shop/shop-13.jpg', isActive: true, sortOrder: 17, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: 'def-18', title: 'Golden Sunset at Sonar Para', category: 'place', image: '/images/shop/shop-14.jpg', isActive: true, sortOrder: 18, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: 'def-19', title: 'Night Lights & Street Gathering', category: 'vibe', image: '/images/shop/shop-15.jpg', isActive: true, sortOrder: 19, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: 'def-20', title: 'Ocean Breeze Dining Spot', category: 'place', image: '/images/shop/shop-16.jpg', isActive: true, sortOrder: 20, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: 'def-21', title: 'Brotherhood Community Moments', category: 'vibe', image: '/images/shop/shop-17.jpg', isActive: true, sortOrder: 21, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [activeTab, setActiveTab] = useState<string>('All');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchImages() {
      try {
        setLoading(true);
        const res = await api.get('/gallery');
        const list = res.data.data || [];
        setImages(list.length > 0 ? list : DEFAULT_GALLERY);
      } catch {
        setImages(DEFAULT_GALLERY);
      } finally {
        setLoading(false);
      }
    }
    fetchImages();
  }, []);

  const filtered =
    activeTab === 'All'
      ? images
      : images.filter((img) => img.category?.toLowerCase() === activeTab.toLowerCase());

  return (
    <div className="pb-16 sm:pb-20 pt-4 sm:pt-6">
      {/* Header */}
      <div className="container-bb text-center mb-10 sm:mb-14">
        <p className="eyebrow-bb mb-2">Moments & Memories</p>
        <h1 className="heading-page text-brand-cream uppercase mb-3">PHOTO GALLERY</h1>
        <p className="text-brand-cream/60 text-sm sm:text-base max-w-xl mx-auto">
          Take a look at our dishes, the beachside ambience, and the brotherhood community.
        </p>
      </div>

      <div className="container-bb">
        {/* Category Tabs */}
        <div className="flex justify-center gap-2 mb-10 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-5 py-2 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-sm',
                activeTab === tab
                  ? 'bg-brand-yellow text-black font-extrabold shadow-[0_2px_10px_rgba(var(--brand-yellow-rgb),0.35)]'
                  : 'bg-brand-surface text-brand-cream/70 hover:text-brand-cream border border-brand-border hover:border-brand-yellow/50'
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading && <LoadingSpinner />}

        {!loading && filtered.length === 0 && (
          <EmptyState
            icon={<ImageIcon className="w-12 h-12" />}
            title="No gallery photos found"
            description="Photos in this category will appear here soon."
          />
        )}

        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {filtered.map((img, idx) => (
              <div
                key={img._id}
                className="card-bb relative aspect-square overflow-hidden group cursor-pointer"
                onClick={() => {
                  setLightboxIndex(idx);
                  setLightboxOpen(true);
                }}
              >
                <Image
                  src={img.image}
                  alt={img.title || "Brother's Bites photo"}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-brand-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-brand-cream text-xs sm:text-sm font-semibold truncate">
                    {img.title || "Brother's Bites"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modern Lightbox Modal */}
      <ImageLightboxModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={filtered.map((img) => img.image)}
        initialIndex={lightboxIndex}
        title={filtered[lightboxIndex]?.title || "Brother's Bites Gallery"}
      />
    </div>
  );
}
