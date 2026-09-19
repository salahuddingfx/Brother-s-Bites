'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Tag, Calendar } from 'lucide-react';
import SectionHeader from '@/components/common/SectionHeader';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import api from '@/lib/api';
import { Offer } from '@/types';

export default function OffersSection() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const { data } = await api.get('/offers/active');
        setOffers(data.data || []);
      } catch {
        // silently fallback
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  if (loading) {
    return (
      <section className="section-padding bg-brand-surface border-t border-white/5">
        <div className="container-bb">
          <LoadingSpinner />
        </div>
      </section>
    );
  }

  if (!offers.length) return null;

  return (
    <section className="section-padding bg-brand-surface border-t border-white/5">
      <div className="container-bb">
        <SectionHeader
          eyebrow="Special Deals"
          title="LIMITED TIME OFFERS"
          subtitle="Exclusive discounts and combos available for our beachside visitors."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {offers.map((offer, index) => (
            <motion.div
              key={offer._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card-bb overflow-hidden flex flex-col justify-between border-brand-yellow/25"
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

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-brand-yellow/10 text-brand-yellow border border-brand-yellow/20">
                      <Tag size={12} />
                      Special Deal
                    </span>
                    {offer.discount && (
                      <span className="bg-brand-yellow text-black px-3 py-1 rounded text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-sm">
                        {offer.discount}
                      </span>
                    )}
                  </div>

                  <h3 className="heading-card text-brand-cream mb-2">{offer.title}</h3>
                  {offer.description && (
                    <p className="text-brand-cream/60 text-xs sm:text-sm leading-relaxed mb-4">
                      {offer.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-brand-cream/40 pt-4 border-t border-white/5">
                  <Calendar size={13} className="text-brand-yellow" />
                  <span>
                    Valid: {new Date(offer.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    {' – '}
                    {new Date(offer.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
