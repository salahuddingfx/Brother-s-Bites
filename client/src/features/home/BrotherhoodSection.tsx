'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { Settings } from '@/types';
import Skeleton from '@/components/ui/skeleton';

const defaultSection: Settings['brotherhood'] = {
  isEnabled: true,
  eyebrow: 'Our Core Spirit',
  title: 'MORE THAN JUST A BITE.',
  titleAccent: "IT'S A BROTHERHOOD.",
  description: "Born from friendship and a love for great street food, Brother's Bites is designed to be a welcoming gathering spot along Marine Drive. Where locals and travelers share conversations, authentic recipes, and beachside memories.",
  ctaLabel: 'READ OUR FULL STORY',
  ctaLink: '/about',
};

export default function BrotherhoodSection() {
  const [section, setSection] = useState<Settings['brotherhood']>(defaultSection);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await api.get('/settings');
        const settings: Settings = res.data.data || res.data;
        if (mounted && settings.brotherhood) setSection(settings.brotherhood);
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
          <div className="max-w-3xl mx-auto text-center py-6 sm:py-10 space-y-4">
            <Skeleton className="h-3 w-28 rounded-full mx-auto" />
            <Skeleton className="h-7 w-64 rounded mx-auto" />
            <Skeleton className="h-4 w-80 rounded mx-auto" />
            <Skeleton className="h-4 w-64 rounded mx-auto" />
            <Skeleton className="h-10 w-36 rounded-lg mx-auto mt-4" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-brand-black border-t border-white/5">
      <div className="container-bb">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center py-6 sm:py-10"
        >
          <p className="eyebrow-bb mb-3">{section.eyebrow}</p>
          <h2 className="heading-section text-brand-cream mb-6">
            {section.title} <br />
            <span className="text-brand-yellow">{section.titleAccent}</span>
          </h2>

          <p className="text-brand-cream/70 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
            {section.description}
          </p>

          <Link href={section.ctaLink} className="btn-secondary">
            {section.ctaLabel}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
