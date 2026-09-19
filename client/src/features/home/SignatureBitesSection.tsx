'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import SectionHeader from '@/components/common/SectionHeader';
import MenuCard from '@/components/menu/MenuCard';
import api from '@/lib/api';
import { MenuItem, Settings } from '@/types';

const defaultSection: Settings['signatureBites'] = {
  isEnabled: true,
  eyebrow: "Chef's Selection",
  title: 'OUR SIGNATURE BITES',
  subtitle: "The crowd favorites that define the Brother's Bites experience.",
  ctaLabel: 'EXPLORE FULL MENU',
  ctaLink: '/menu',
};

export default function SignatureBitesSection() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [section, setSection] = useState<Settings['signatureBites']>(defaultSection);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [menuRes, settingsRes] = await Promise.all([
          api.get('/menu/featured'),
          api.get('/settings'),
        ]);
        if (!mounted) return;
        const menuData = menuRes.data?.data;
        const menuItems = Array.isArray(menuData) ? menuData : menuData?.items || [];
        if (menuItems.length > 0) setItems(menuItems);

        const settings: Settings = settingsRes.data.data || settingsRes.data;
        if (settings.signatureBites) setSection(settings.signatureBites);
      } catch {}
    };
    load();
    return () => { mounted = false; };
  }, []);

  if (!section.isEnabled) return null;

  return (
    <section className="section-padding bg-brand-black">
      <div className="container-bb">
        <SectionHeader
          eyebrow={section.eyebrow}
          title={section.title}
          subtitle={section.subtitle}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {items.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <MenuCard item={item} featured={item.isFeatured} />
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10 sm:mt-12">
          <Link href={section.ctaLink} className="btn-secondary">
            {section.ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
