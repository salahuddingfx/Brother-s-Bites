'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Star,
  Sparkles,
  Quote,
  Utensils,
  ShieldCheck,
  Search,
  MessageSquarePlus,
  Loader2,
  Heart,
  Calendar,
} from 'lucide-react';
import api from '@/lib/api';
import { Review, ReviewStats } from '@/types';
import StarRating from '@/components/common/StarRating';
import ReviewCardSkeleton from '@/components/skeletons/ReviewCardSkeleton';
import ReviewModal from '@/components/reviews/ReviewModal';
import { cn } from '@/lib/utils';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    average: 5.0,
    total: 0,
    breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reviews?limit=50');
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

  const filteredReviews = reviews.filter((rev) => {
    const matchesSearch =
      rev.customerName.toLowerCase().includes(search.toLowerCase()) ||
      rev.comment.toLowerCase().includes(search.toLowerCase()) ||
      (rev.dishRecommended && rev.dishRecommended.toLowerCase().includes(search.toLowerCase()));

    if (ratingFilter === 'all') return matchesSearch;
    const filterNum = parseFloat(ratingFilter);
    return matchesSearch && rev.rating >= filterNum && rev.rating < filterNum + 1;
  });

  return (
    <div className="min-h-screen bg-brand-black pt-24 pb-16">
      <div className="container-bb">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-yellow/10 border border-brand-yellow/30 text-brand-yellow text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles size={13} />
            <span>Voices of The Brotherhood</span>
          </div>
          <h1 className="heading-page text-brand-cream uppercase mb-3">
            CUSTOMER REVIEWS & EXPERIENCES
          </h1>
          <p className="text-brand-cream/60 text-sm sm:text-base leading-relaxed">
            Read real feedback from verified diners, beach tourists, and foodies at Brother&apos;s Bites, Marine Drive, Cox&apos;s Bazar.
          </p>
        </div>

        {/* Rating Breakdown & Highlights Card */}
        <div className="card-bb p-6 sm:p-8 bg-brand-surface border-brand-border mb-10 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Average Score */}
            <div className="text-center md:text-left border-b md:border-b-0 md:border-r border-brand-border/60 pb-6 md:pb-0 md:pr-8">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-cream/50 mb-1">
                Overall Customer Satisfaction
              </p>
              <div className="flex items-baseline justify-center md:justify-start gap-2">
                <span className="text-4xl sm:text-5xl font-black text-brand-yellow tracking-tight">
                  {stats.total > 0 ? stats.average.toFixed(1) : '5.0'}
                </span>
                <span className="text-brand-cream/40 text-sm font-bold">/ 5.0</span>
              </div>
              <div className="mt-2 flex justify-center md:justify-start">
                <StarRating rating={stats.total > 0 ? stats.average : 5} size={20} />
              </div>
              <p className="text-xs text-brand-cream/60 mt-2">
                Based on <strong className="text-brand-cream">{stats.total || reviews.length}</strong> verified customer reviews
              </p>
            </div>

            {/* Star Distribution Breakdown */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = (stats.breakdown as any)?.[stars] || 0;
                const percent = stats.total > 0 ? Math.round((count / stats.total) * 100) : stars === 5 ? 100 : 0;

                return (
                  <div key={stars} className="flex items-center gap-3 text-xs">
                    <span className="w-12 text-brand-cream/70 font-semibold">{stars} Star</span>
                    <div className="flex-1 h-2 bg-brand-surface-light rounded-full overflow-hidden border border-white/5">
                      <div
                        className="h-full bg-brand-yellow rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-brand-cream/40 font-mono">{count}</span>
                  </div>
                );
              })}
            </div>

            {/* Write Review CTA Box */}
            <div className="bg-brand-surface-light p-5 rounded-2xl border border-brand-border text-center flex flex-col justify-center items-center">
              <ShieldCheck className="w-8 h-8 text-green-400 mb-2" />
              <h4 className="text-sm font-bold text-brand-cream uppercase mb-1">
                Ordered From Us?
              </h4>
              <p className="text-xs text-brand-cream/50 mb-3.5 max-w-xs">
                Enter your order ID or phone number to submit your verified review.
              </p>
              <button
                onClick={() => setModalOpen(true)}
                className="btn-primary !h-10 px-5 text-xs gap-2 shadow-md w-full justify-center"
              >
                <MessageSquarePlus size={15} />
                <span>RATE YOUR ORDER</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="card-bb p-4 bg-brand-surface border-brand-border mb-8 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-cream/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reviews by dish or comments (e.g. Momos, Tea, Fuchka)..."
              className="w-full bg-brand-surface-light border border-brand-border rounded-xl pl-10 pr-4 py-2.5 text-brand-cream text-xs placeholder-brand-cream/35 focus:outline-none focus:border-brand-yellow transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {[
              { label: 'All', value: 'all' },
              { label: '5 ★', value: '5' },
              { label: '4 ★', value: '4' },
              { label: '3 ★', value: '3' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setRatingFilter(tab.value)}
                className={cn(
                  'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border',
                  ratingFilter === tab.value
                    ? 'bg-brand-yellow text-brand-black border-brand-yellow shadow-sm'
                    : 'bg-brand-surface-light text-brand-cream/70 border-brand-border hover:border-brand-yellow/40 hover:text-brand-cream'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews Grid */}
        {loading ? (
          <ReviewCardSkeleton count={6} />
        ) : filteredReviews.length === 0 ? (
          <div className="card-bb p-16 text-center bg-brand-surface-light border-dashed border-brand-border">
            <Heart size={40} className="text-brand-yellow/40 mx-auto mb-3" />
            <h3 className="text-brand-cream font-bold text-lg mb-1">No Reviews Found</h3>
            <p className="text-brand-cream/60 text-xs sm:text-sm max-w-sm mx-auto mb-5">
              Be the first to share your coastal dining experience!
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="btn-primary !h-10 px-6 text-xs gap-2 inline-flex"
            >
              <MessageSquarePlus size={15} />
              <span>SUBMIT A REVIEW</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.map((rev, idx) => (
              <motion.div
                key={rev._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="card-bb p-6 bg-brand-surface-light border-brand-border flex flex-col justify-between relative group hover:border-brand-yellow/40 transition-all duration-300"
              >
                {/* Quote Watermark */}
                <Quote
                  size={48}
                  className="absolute top-4 right-4 text-white/[0.03] pointer-events-none group-hover:text-brand-yellow/5 transition-colors"
                />

                <div>
                  {/* Rating Stars & Date */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <StarRating rating={rev.rating} size={15} />
                      <span className="text-xs font-bold text-brand-yellow">
                        {rev.rating.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-[11px] text-brand-cream/40 flex items-center gap-1">
                      <Calendar size={11} />
                      <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                    </span>
                  </div>

                  {/* Comment */}
                  <p className="text-brand-cream/90 text-sm leading-relaxed mb-4">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-brand-border/60 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-brand-yellow text-brand-black font-extrabold text-xs flex items-center justify-center shrink-0 uppercase shadow-sm">
                      {rev.customerName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-brand-cream font-bold text-xs truncate">
                        {rev.customerName}
                      </p>
                      <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                        <ShieldCheck size={11} />
                        <span>Verified Diner</span>
                      </span>
                    </div>
                  </div>

                  {rev.dishRecommended && (
                    <div
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-brand-surface border border-brand-border text-[11px] text-brand-cream/75 shrink-0 max-w-[150px] truncate"
                      title={`Loved: ${rev.dishRecommended}`}
                    >
                      <Utensils size={10} className="text-brand-yellow shrink-0" />
                      <span className="truncate">{rev.dishRecommended}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Review Modal */}
        <ReviewModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={fetchReviews}
        />
      </div>
    </div>
  );
}
