'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Coffee, CupSoda } from 'lucide-react';
import SectionHeader from '@/components/common/SectionHeader';
import { DrinksSectionSkeleton } from '@/components/skeletons/SectionSkeletons';
import api from '@/lib/api';
import { Settings } from '@/types';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Coffee,
  CupSoda,
};

const defaultSection: Settings['drinks'] = {
  isEnabled: true,
  eyebrow: 'Chilled & Warm Sips',
  title: 'REFRESHING DRINKS',
  subtitle: 'All handcrafted drink servings are standardized to 100g for optimal flavor.',
  items: [
    { name: 'Signature Caramel Tea', description: 'Slow-cooked sugar caramel infused with creamy cow milk and rich tea leaves. The ultimate beachside warmer.', servingSize: '100g serving', price: 40, icon: 'CupSoda' },
    { name: 'Creamy Milk Coffee', description: 'Smooth coffee blend brewed with fresh whole milk. Warm, rich, and comforting as the ocean breeze rolls in.', servingSize: '100g serving', price: 50, icon: 'Coffee' },
  ],
  ctaLabel: 'EXPLORE ALL DRINKS',
  ctaLink: '/menu',
};

export default function DrinksSection() {
  const [section, setSection] = useState<Settings['drinks']>(defaultSection);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await api.get('/settings');
        const settings: Settings = res.data.data || res.data;
        if (mounted && settings.drinks) setSection(settings.drinks);
      } catch {}
      if (mounted) setLoading(false);
    };
    load();
    return () => { mounted = false; };
  }, []);

  if (!section.isEnabled) return null;

  if (loading) {
    return (
      <section className="section-padding bg-brand-black border-t border-white/5">
        <div className="container-bb">
          <DrinksSectionSkeleton />
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-brand-black border-t border-white/5">
      <div className="container-bb">
        <SectionHeader
          eyebrow={section.eyebrow}
          title={section.title}
          subtitle={section.subtitle}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {section.items.map((drink, index) => {
            const Icon = iconMap[drink.icon] || Coffee;
            return (
              <motion.div
                key={drink.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="card-bb p-6 sm:p-8 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-brand-yellow/10 border border-brand-yellow/20 flex items-center justify-center shrink-0 group-hover:bg-brand-yellow/20 transition-colors">
                      <Icon className="w-6 h-6 text-brand-yellow" />
                    </div>
                    <div>
                      <h3 className="heading-card text-brand-cream group-hover:text-brand-yellow transition-colors mb-1">
                        {drink.name}
                      </h3>
                      <p className="text-brand-cream/60 text-xs sm:text-sm leading-relaxed">
                        {drink.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-brand-cream/10">
                  <span className="text-xs font-semibold uppercase tracking-wider text-brand-cream/60 px-2.5 py-1 rounded bg-brand-surface border border-brand-cream/10">
                    {drink.servingSize}
                  </span>
                  <span className="text-brand-yellow font-bold text-xl tabular-nums">
                    ৳{drink.price}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link href={section.ctaLink} className="btn-secondary">
            {section.ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
