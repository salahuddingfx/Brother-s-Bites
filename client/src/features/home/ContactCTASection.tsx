'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, MessageSquare } from 'lucide-react';
import InstagramIcon from '@/components/icons/InstagramIcon';
import FacebookIcon from '@/components/icons/FacebookIcon';
import api from '@/lib/api';
import { Settings } from '@/types';

const defaultSection: Settings['contactCTA'] = {
  isEnabled: true,
  eyebrow: 'Visit Us Today',
  title: 'Ready to Taste The Brotherhood?',
  description: "Marine Drive, Sonar Para Beach, Cox's Bazar. Stop by for fresh food and sea breeze.",
};

export default function ContactCTASection() {
  const [section, setSection] = useState<Settings['contactCTA']>(defaultSection);
  const [contact, setContact] = useState<{ phone: string; whatsapp: string; instagram: string; facebook: string }>({
    phone: '+8801627817436',
    whatsapp: '+8801627817436',
    instagram: 'https://instagram.com/brothersbites.bd',
    facebook: 'https://facebook.com/brothersbites.bd',
  });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await api.get('/settings');
        const data: Settings = res.data.data || res.data;
        if (!mounted) return;
        if (data.contactCTA) setSection(data.contactCTA);
        setContact({
          phone: data.phone?.[0] || '+8801627817436',
          whatsapp: data.whatsapp || data.phone?.[0] || '+8801627817436',
          instagram: data.socialLinks?.instagram || 'https://instagram.com/brothersbites.bd',
          facebook: data.socialLinks?.facebook || 'https://facebook.com/brothersbites.bd',
        });
      } catch {}
    };
    load();
    return () => { mounted = false; };
  }, []);

  if (!section.isEnabled) return null;

  return (
    <section className="bg-brand-yellow py-12 sm:py-16 text-brand-black border-t border-brand-yellow/30">
      <div className="container-bb text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <p className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.2em] text-brand-black/70 mb-2">
            {section.eyebrow}
          </p>
          <h2 className="heading-section text-brand-black uppercase mb-3">
            {section.title}
          </h2>
          <p className="text-brand-black/80 text-sm sm:text-base leading-relaxed mb-8">
            {section.description}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <a
              href={`tel:${contact.phone}`}
              className="inline-flex items-center gap-2 h-11 px-5 rounded-lg bg-brand-black text-brand-yellow font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-brand-surface-hover transition-colors shadow-sm"
            >
              <Phone size={16} />
              <span>Call Us</span>
            </a>
            <a
              href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-11 px-5 rounded-lg bg-brand-black text-brand-yellow font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-brand-surface-hover transition-colors shadow-sm"
            >
              <MessageSquare size={16} />
              <span>WhatsApp</span>
            </a>
            <a
              href={contact.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-11 px-5 rounded-lg bg-brand-black text-brand-yellow font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-brand-surface-hover transition-colors shadow-sm"
            >
              <FacebookIcon className="w-4 h-4 text-brand-yellow" />
              <span>Facebook</span>
            </a>
            <a
              href={contact.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-11 px-5 rounded-lg bg-brand-black text-brand-yellow font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-brand-surface-hover transition-colors shadow-sm"
            >
              <InstagramIcon className="w-4 h-4 text-brand-yellow" />
              <span>Instagram</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
