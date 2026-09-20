'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, MessageSquarePlus, Quote, Sparkles, Heart, Utensils, ShieldCheck, ArrowRight } from 'lucide-react';
import api from '@/lib/api';
import { Review, ReviewStats } from '@/types';
import dynamic from 'next/dynamic';
const ReviewModal = dynamic(() => import('@/components/reviews/ReviewModal'), { ssr: false });
import StarRating from '@/components/common/StarRating';
import ReviewCardSkeleton from '@/components/skeletons/ReviewCardSkeleton';
import { cn } from '@/lib/utils';

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    average: 5.0,
    total: 0,
    breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await api.get('/reviews?limit=12');
      const data = res.data.data;
      if (data) {
        setReviews(data.reviews || []);
        if (data.stats) setStats(data.stats);
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Duplicate reviews to create seamless infinite loop track
  const marqueeItems = reviews.length > 0 ? [...reviews, ...reviews, ...reviews] : [];

  return (
    <section className="section-padding bg-brand-surface relative overflow-hidden border-t border-brand-border">
      {/* Background Subtle Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-yellow/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="container-bb relative z-10 mb-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-yellow/10 border border-brand-yellow/30 text-brand-yellow text-xs font-bold uppercase tracking-wider mb-2.5">
              <Sparkles size={12} />
              <span>Voices of The Brotherhood</span>
            </div>
            <h2 className="heading-section text-brand-cream uppercase">
              WHAT OUR FOODIES SAY
            </h2>
            <p className="text-brand-cream/60 text-sm sm:text-base mt-2 max-w-xl">
              Authentic reviews from beach travelers, local regulars, and food lovers at Marine Drive, Cox&apos;s Bazar.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Average Rating Pill */}
            <div className="flex items-center gap-3 bg-brand-surface-light border border-brand-border px-4 py-2.5 rounded-xl shadow-sm">
              <div className="flex items-center text-brand-yellow">
                <Star size={20} className="fill-brand-yellow" />
              </div>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-brand-cream font-extrabold text-lg leading-none">
                    {stats.total > 0 ? stats.average.toFixed(1) : '5.0'}
                  </span>
                  <span className="text-xs text-brand-cream/50 font-semibold">/ 5.0</span>
                </div>
                <p className="text-[11px] text-brand-cream/50 mt-0.5">
                  {stats.total > 0 ? `${stats.total} verified reviews` : 'Top Rated Food'}
                </p>
              </div>
            </div>

            {/* View All Reviews Button */}
            <Link
              href="/reviews"
              className="btn-secondary !h-11 px-4 text-xs gap-1.5 shrink-0"
            >
              <span>View All</span>
              <ArrowRight size={13} />
            </Link>

            {/* Write Review Button */}
            <button
              onClick={() => setModalOpen(true)}
              className="btn-primary !h-11 px-5 text-xs gap-2 shrink-0 shadow-md"
            >
              <MessageSquarePlus size={16} />
              <span>RATE ORDER</span>
            </button>
          </div>
        </div>
      </div>

      {/* Infinite Linear Carousel Marquee Track */}
      {loading ? (
        <div className="container-bb">
          <ReviewCardSkeleton count={3} />
        </div>
      ) : reviews.length === 0 ? (
        <div className="container-bb">
          <div className="card-bb p-12 text-center bg-brand-surface-light border-dashed border-brand-border">
            <Heart size={36} className="text-brand-yellow/40 mx-auto mb-3" />
            <h3 className="text-brand-cream font-bold text-lg mb-1">Be the First to Review!</h3>
            <p className="text-brand-cream/60 text-xs sm:text-sm max-w-sm mx-auto mb-5">
              Enjoyed your momos, fuchka, or tea? Share your feedback with fellow foodies.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="btn-primary !h-10 px-6 text-xs gap-2"
            >
              <MessageSquarePlus size={15} />
              <span>WRITE FIRST REVIEW</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="relative w-full overflow-hidden py-4">
          {/* Side Fade Gradient Masks */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-brand-surface via-brand-surface/70 to-transparent z-20" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-brand-surface via-brand-surface/70 to-transparent z-20" />

          {/* Marquee Row 1 */}
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused] transition-all">
            {marqueeItems.map((rev, idx) => (
              <div
                key={`${rev._id}-${idx}`}
                className="w-[320px] sm:w-[380px] shrink-0 px-3"
              >
                <div className="card-bb p-5 sm:p-6 bg-brand-surface-light border-brand-border flex flex-col justify-between h-[210px] sm:h-[220px] relative group hover:border-brand-yellow/50 transition-all duration-300 shadow-lg hover:shadow-brand-yellow/5">
                  {/* Subtle quote icon */}
                  <Quote
                    size={42}
                    className="absolute top-4 right-4 text-white/[0.04] pointer-events-none group-hover:text-brand-yellow/10 transition-colors"
                  />

                  <div>
                    {/* Rating Stars & Date */}
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-1.5">
                        <StarRating rating={rev.rating} size={14} />
                        <span className="text-xs font-bold text-brand-yellow">
                          {rev.rating.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-[10px] text-brand-cream/40 font-medium">
                        {new Date(rev.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    {/* Review Quote */}
                    <p className="text-brand-cream/90 text-xs sm:text-sm leading-relaxed line-clamp-3">
                      &ldquo;{rev.comment}&rdquo;
                    </p>
                  </div>

                  {/* Customer Info Footer */}
                  <div className="pt-3 border-t border-brand-border/60 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-brand-yellow text-brand-black font-extrabold text-[11px] flex items-center justify-center shrink-0 uppercase shadow-sm">
                        {rev.customerName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-brand-cream font-bold text-xs truncate">
                          {rev.customerName}
                        </p>
                        <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                          <ShieldCheck size={10} />
                          <span>Verified Diner</span>
                        </span>
                      </div>
                    </div>

                    {rev.dishRecommended && (
                      <div
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-brand-surface border border-brand-border text-[10px] text-brand-cream/75 shrink-0 max-w-[140px] truncate"
                        title={`Loved: ${rev.dishRecommended}`}
                      >
                        <Utensils size={9} className="text-brand-yellow shrink-0" />
                        <span className="truncate">{rev.dishRecommended}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Write Review Modal */}
      <ReviewModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchReviews}
      />
    </section>
  );
}
