'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Navigation } from 'lucide-react';
import SectionHeader from '@/components/common/SectionHeader';
import CustomMapEmbed from '@/components/common/CustomMapEmbed';
import { LocationSectionSkeleton } from '@/components/skeletons/SectionSkeletons';
import api from '@/lib/api';
import { Settings } from '@/types';

const defaultSection: Settings['location'] = {
  isEnabled: true,
  eyebrow: "Marine Drive, Cox's Bazar",
  title: 'FIND OUR RESTAURANT',
  subtitle: 'Located right by the scenic coastal stretch of Sonar Para Beach.',
  embedMapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d232.34524772674902!2d92.04676015661319!3d21.290302964726862!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30adc5b2179fe74d%3A0xc66fab6f23703d96!2sBrother%27s%20Bites!5e0!3m2!1sen!2sbd!4v1789874032852!5m2!1sen!2sbd',
  directionsUrl: 'https://www.google.com/maps/search/?api=1&query=21.290302964726862,92.04676015661319',
};

export default function LocationSection() {
  const [section, setSection] = useState<Settings['location']>(defaultSection);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await api.get('/settings');
        const data: Settings = res.data.data || res.data;
        if (!mounted) return;
        setSettings(data);
        if (data.location) setSection(data.location);
      } catch {}
      if (mounted) setLoading(false);
    };
    load();
    return () => { mounted = false; };
  }, []);

  if (!section.isEnabled) return null;

  if (loading) {
    return (
      <section className="section-padding bg-brand-surface border-t border-white/5" id="location">
        <div className="container-bb">
          <LocationSectionSkeleton />
        </div>
      </section>
    );
  }

  const formatHourRange = (hours: Settings['openingHours']) => {
    if (!hours || hours.length === 0) return [];
    const weekday = hours.filter(h => !['Friday', 'Saturday'].includes(h.day));
    const weekend = hours.filter(h => ['Friday', 'Saturday'].includes(h.day));

    const formatTime = (t: string) => {
      if (!t) return '';
      const [h, m] = t.split(':').map(Number);
      const period = h >= 12 ? 'PM' : 'AM';
      const hr = h % 12 || 12;
      return `${hr}:${m.toString().padStart(2, '0')} ${period}`;
    };

    const result: { days: string; hours: string }[] = [];
    if (weekday.length > 0) {
      const openTimes = [...new Set(weekday.filter(h => !h.isClosed).map(h => formatTime(h.open)))];
      const closeTimes = [...new Set(weekday.filter(h => !h.isClosed).map(h => formatTime(h.close)))];
      if (openTimes.length > 0) {
        result.push({ days: 'Sunday — Thursday', hours: `${openTimes[0]} — ${closeTimes[0]}` });
      }
    }
    if (weekend.length > 0) {
      const openTimes = [...new Set(weekend.filter(h => !h.isClosed).map(h => formatTime(h.open)))];
      const closeTimes = [...new Set(weekend.filter(h => !h.isClosed).map(h => formatTime(h.close)))];
      if (openTimes.length > 0) {
        result.push({ days: 'Friday — Saturday', hours: `${openTimes[0]} — ${closeTimes[0]}` });
      }
    }
    return result;
  };

  const formattedHours = settings?.openingHours ? formatHourRange(settings.openingHours) : [];
  const fullAddress = settings?.address
    ? [settings.address.street, settings.address.city, settings.address.state, settings.address.country].filter(Boolean).join(', ')
    : "Marine Drive, Sonar Para Beach, Cox's Bazar, Bangladesh";
  const phone = settings?.phone?.[0] || '+8801627817436';

  return (
    <section className="section-padding bg-brand-surface border-t border-white/5" id="location">
      <div className="container-bb">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="lg:col-span-6 order-2 lg:order-1"
          >
            <CustomMapEmbed
              embedUrl={section.embedMapUrl}
              directionsUrl={section.directionsUrl}
              aspectRatio="aspect-[4/3] min-h-[320px]"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            viewport={{ once: true }}
            className="lg:col-span-6 order-1 lg:order-2"
          >
            <SectionHeader
              eyebrow={section.eyebrow}
              title={section.title}
              subtitle={section.subtitle}
              centered={false}
              className="mb-6 sm:mb-8"
            />

            <div className="space-y-6">
              <div className="card-bb p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-brand-yellow/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-brand-yellow" />
                </div>
                <div>
                  <h3 className="font-bold text-brand-cream text-sm uppercase tracking-wider mb-1">
                    Exact Address
                  </h3>
                  <p className="text-brand-cream/80 text-sm">
                    {fullAddress}
                  </p>
                </div>
              </div>

              {formattedHours.length > 0 && (
                <div className="card-bb p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-yellow/10 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-brand-yellow" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-brand-cream text-sm uppercase tracking-wider mb-2">
                      Service Hours
                    </h3>
                    <div className="space-y-1 text-sm">
                      {formattedHours.map((sched) => (
                        <div key={sched.days} className="flex justify-between text-brand-cream/70 text-xs sm:text-sm">
                          <span>{sched.days}</span>
                          <span className="font-medium text-brand-cream">{sched.hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={section.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary gap-2"
                >
                  <Navigation className="w-4 h-4" />
                  <span>GET DIRECTIONS</span>
                </a>
                <a href={`tel:${phone}`} className="btn-secondary gap-2">
                  <Phone className="w-4 h-4" />
                  <span>CALL FOR INQUIRIES</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
