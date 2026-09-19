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
        setImages(res.data.data || []);
      } catch {
        // fallback
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
