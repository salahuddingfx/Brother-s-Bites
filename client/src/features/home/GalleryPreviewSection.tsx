'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ImageIcon } from 'lucide-react';
import SectionHeader from '@/components/common/SectionHeader';
import GalleryGridSkeleton from '@/components/skeletons/GalleryGridSkeleton';
import api from '@/lib/api';
import { GalleryImage } from '@/types';

const DEFAULT_PREVIEW_IMAGES: GalleryImage[] = [
  { _id: 'def-prev-1', title: 'Main Chef Ahammad Bin Kashem', category: 'vibe', image: '/images/team/chef-ahammad.jpg', isActive: true, sortOrder: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: 'def-prev-2', title: 'Assistant Chef Sahed Mostafa', category: 'vibe', image: '/images/team/assistant-chef-sahed.jpg', isActive: true, sortOrder: 2, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: 'def-prev-3', title: 'Live Beach Cooking', category: 'food', image: '/images/team/kitchen-action.jpg', isActive: true, sortOrder: 3, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: 'def-prev-4', title: 'Marine Drive Shop Stand', category: 'place', image: '/images/shop/shop-7.jpg', isActive: true, sortOrder: 4, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: 'def-prev-5', title: 'Crispy Street Delicacies', category: 'food', image: '/images/shop/shop-1.jpg', isActive: true, sortOrder: 5, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: 'def-prev-6', title: 'The Brotherhood Gathering', category: 'vibe', image: '/images/team/team-brotherhood.jpg', isActive: true, sortOrder: 6, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export default function GalleryPreviewSection() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { data } = await api.get('/gallery?limit=6');
        const list = data.data || [];
        setImages(list.length > 0 ? list : DEFAULT_PREVIEW_IMAGES);
      } catch {
        setImages(DEFAULT_PREVIEW_IMAGES);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  return (
    <section className="section-padding bg-brand-black border-t border-white/5">
      <div className="container-bb">
        <SectionHeader
          eyebrow="Visual Moments"
          title="THE GALLERY"
          subtitle="A glimpse into the food, atmosphere, and beachside vibe at Brother's Bites."
        />

        {loading ? (
          <GalleryGridSkeleton count={6} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
            {images.length > 0 ? (
              images.slice(0, 6).map((img, index) => (
                <motion.div
                  key={img._id}
                  initial={{ opacity: 0, scale: 0.97 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  viewport={{ once: true }}
                  className="card-bb relative aspect-square overflow-hidden group cursor-pointer"
                >
                  <Image
                    src={img.image}
                    alt={img.title || 'Brother\'s Bites moment'}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-brand-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <p className="text-brand-cream text-xs sm:text-sm font-semibold truncate">
                      {img.title || "Brother's Bites"}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              [...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="card-bb aspect-square flex flex-col items-center justify-center p-4 bg-brand-surface-light"
                >
                  <ImageIcon className="w-8 h-8 text-brand-yellow/30 mb-2" />
                  <span className="text-xs text-brand-cream/50">Beach Moment</span>
                </div>
              ))
            )}
          </div>
        )}

        <div className="text-center mt-10 sm:mt-12">
          <Link href="/gallery" className="btn-secondary">
            VIEW FULL GALLERY
          </Link>
        </div>
      </div>
    </section>
  );
}
