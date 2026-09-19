'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Tag, Calendar, Percent } from 'lucide-react';
import api from '@/lib/api';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import type { Offer } from '@/types';

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOffers() {
      try {
        setLoading(true);
        const res = await api.get('/offers/active');
        setOffers(res.data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load offers');
      } finally {
        setLoading(false);
      }
    }
    fetchOffers();
  }, []);

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  return (
    <div className="pb-16 sm:pb-20 pt-4 sm:pt-6">
      {/* Header */}
      <div className="container-bb text-center mb-10 sm:mb-14">
        <p className="eyebrow-bb mb-2">Exclusive Deals</p>
        <h1 className="heading-page text-brand-cream uppercase mb-3">SPECIAL OFFERS</h1>
        <p className="text-brand-cream/60 text-sm sm:text-base max-w-xl mx-auto">
          Save on your favorite bites, combos, and beverages with our ongoing promotions.
        </p>
      </div>

      <div className="container-bb">
        {loading && <LoadingSpinner />}

        {error && <ErrorState message={error} onRetry={() => window.location.reload()} />}

        {!loading && !error && offers.length === 0 && (
          <EmptyState
            icon={<Percent className="w-12 h-12" />}
            title="No active offers currently"
            description="We update our specials frequently. Follow our Instagram or check back soon!"
          />
        )}

        {!loading && !error && offers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {offers.map((offer) => (
              <div
                key={offer._id}
                className="card-bb overflow-hidden flex flex-col justify-between border-brand-yellow/20"
              >
                {offer.image && (
                  <div className="relative aspect-[16/9] w-full bg-brand-surface">
                    <Image
                      src={offer.image}
                      alt={offer.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                )}

                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-brand-yellow/10 text-brand-yellow border border-brand-yellow/20">
                        <Tag size={12} />
                        Active Deal
                      </span>
                      {offer.discount && (
                        <span className="bg-brand-yellow text-black px-3 py-1 rounded text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-sm">
                          {offer.discount}
                        </span>
                      )}
                    </div>

                    <h2 className="heading-card text-brand-cream mb-2">{offer.title}</h2>
                    {offer.description && (
                      <p className="text-brand-cream/70 text-xs sm:text-sm leading-relaxed mb-4">
                        {offer.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-brand-cream/40 pt-4 border-t border-white/5">
                    <Calendar size={13} className="text-brand-yellow" />
                    <span>
                      Valid: {formatDate(offer.startDate)} — {formatDate(offer.endDate)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
