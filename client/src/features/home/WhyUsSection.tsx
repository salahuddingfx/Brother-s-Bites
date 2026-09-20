'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Utensils, MapPin, Users, Sparkles, Star, Heart, Shield, Zap } from 'lucide-react';
import SectionHeader from '@/components/common/SectionHeader';
import { CardGridSkeleton } from '@/components/skeletons/SectionSkeletons';
import api from '@/lib/api';
import { Settings } from '@/types';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Utensils,
  MapPin,
  Users,
  Sparkles,
  Star,
  Heart,
  Shield,
  Zap,
};

const defaultSection: Settings['whyUs'] = {
  isEnabled: true,
  eyebrow: 'The Standard',
  title: "WHY BROTHER'S BITES",
  subtitle: 'Committed to great quality, honest pricing, and genuine coastal vibes.',
  features: [
    { icon: 'Utensils', title: 'Fresh & Honest Flavors', description: 'Every single plate is cooked to order using quality spices, fresh meat, and coastal produce.' },
    { icon: 'MapPin', title: 'Marine Drive Location', description: 'Situated at Sonar Para Beach, enjoy bites right with the ocean breeze and golden sunset.' },
    { icon: 'Users', title: 'Warm Brotherhood', description: 'A welcoming space for friends, families, and travelers. Where good food builds community.' },
    { icon: 'Sparkles', title: 'Fast & Hygienic', description: 'Spotless preparation standards ensuring you get fresh, hot, and hygienic food every visit.' },
  ],
};

export default function WhyUsSection() {
  const [section, setSection] = useState<Settings['whyUs']>(defaultSection);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await api.get('/settings');
        const settings: Settings = res.data.data || res.data;
        if (mounted && settings.whyUs) setSection(settings.whyUs);
      } catch {}
      if (mounted) setLoading(false);
    };
    load();
    return () => { mounted = false; };
  }, []);

  if (!section.isEnabled) return null;

  if (loading) {
    return (
      <section className="section-padding bg-brand-surface border-t border-white/5">
        <div className="container-bb">
          <CardGridSkeleton count={4} cols={4} />
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-brand-surface border-t border-white/5">
      <div className="container-bb">
        <SectionHeader
          eyebrow={section.eyebrow}
          title={section.title}
          subtitle={section.subtitle}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {section.features.map((feature, index) => {
            const Icon = iconMap[feature.icon] || Sparkles;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-bb p-6 flex flex-col items-start"
              >
                <div className="w-11 h-11 rounded-lg bg-brand-yellow/10 border border-brand-yellow/20 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-brand-yellow" />
                </div>
                <h3 className="font-bold text-brand-cream text-base mb-2">
                  {feature.title}
                </h3>
                <p className="text-brand-cream/60 text-xs sm:text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
