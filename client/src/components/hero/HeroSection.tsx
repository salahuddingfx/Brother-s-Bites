'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ArrowRight, Utensils, Star, Sparkles } from 'lucide-react';
import api from '@/lib/api';
import { MenuItem, Category, Settings } from '@/types';
import { HeroSectionSkeleton } from '@/components/skeletons/SectionSkeletons';

const defaultSlides: MenuItem[] = [
  {
    _id: 'sig-1',
    name: 'Chicken Momos',
    slug: 'chicken-momos',
    description: 'Juicy minced chicken dumplings steamed to perfection, served with fiery chili garlic sauce.',
    price: 180,
    category: 'Momos' as unknown as Category,
    servingSize: '6 Pcs',
    image: '/images/hero-platter.jpg',
    isAvailable: true,
    isFeatured: true,
    sortOrder: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'sig-2',
    name: 'Yogurt Fuchka',
    slug: 'yogurt-fuchka',
    description: 'Crispy shells filled with spiced potato masala, cool sweetened yogurt, and tangy tamarind drizzle.',
    price: 120,
    category: 'Fuchka' as unknown as Category,
    servingSize: '8 Pcs',
    image: '/images/hero-platter.jpg',
    isAvailable: true,
    isFeatured: true,
    sortOrder: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'sig-3',
    name: 'Crispy Shrimp Fry',
    slug: 'crispy-shrimp-fry',
    description: 'Fresh local coastal shrimp, lightly spiced and batter-fried golden crisp with signature dip.',
    price: 260,
    category: 'Seafood' as unknown as Category,
    servingSize: '6 Pcs',
    image: '/images/hero-platter.jpg',
    isAvailable: true,
    isFeatured: true,
    sortOrder: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'sig-4',
    name: 'Thai Spicy Chicken',
    slug: 'thai-spicy-chicken',
    description: 'Wok-tossed chicken chunks glazed in sweet chili, garlic, and fresh green herbs.',
    price: 220,
    category: 'Chicken' as unknown as Category,
    servingSize: '1 Plate',
    image: '/images/hero-platter.jpg',
    isAvailable: true,
    isFeatured: true,
    sortOrder: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const defaultHeroSettings: Settings['hero'] = {
  isEnabled: true,
  locationPill: "Marine Drive • Cox's Bazar",
  headline: 'FRESH BITES. CHILLED SIPS. TRUE BROTHERHOOD.',
  subtitle: 'Savor steamed chicken momos, crunchy yogurt fuchka, golden shrimp fry...',
  ctaPrimaryLabel: 'EXPLORE MENU',
  ctaPrimaryLink: '/menu',
  ctaSecondaryLabel: 'FIND OUR SPOT',
  ctaSecondaryLink: '/location',
  trustBadges: [{ label: 'Freshly Made' }, { label: 'Standard Portions' }, { label: 'Beachside Vibe' }],
  image: '/images/hero-platter.jpg',
  bottomBadgeTitle: 'Coastal Beachside Kitchen',
  bottomBadgeSubtitle: 'Open Sun-Thu 3PM-12AM · Fri-Sat 10AM-12AM',
  ctaBottomLabel: 'Order Now',
  ctaBottomLink: '/menu',
  floatingBadge: 'Top Favorites: Momos, Fuchka, Tea',
};

export default function HeroSection() {
  const [slides, setSlides] = useState<MenuItem[]>(defaultSlides);
  const [hero, setHero] = useState<Settings['hero']>(defaultHeroSettings);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/menu/featured');
        const items = Array.isArray(res.data?.data)
          ? res.data.data
          : res.data?.data?.items || [];
        if (isMounted && items.length > 0) {
          setSlides(items);
        }
      } catch {}
      if (isMounted) setLoading(false);
    };
    fetchFeatured();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchHero = async () => {
      try {
        const res = await api.get('/settings');
        const data: Settings = res.data.data || res.data;
        if (isMounted && data.hero) {
          setHero(data.hero);
        }
      } catch {}
    };
    fetchHero();
    return () => { isMounted = false; };
  }, []);

  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;
    timerRef.current = setInterval(() => { nextSlide(); }, 4500);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPaused, nextSlide, totalSlides]);

  const currentItem = slides[currentIndex] || slides[0];

  const getCategoryTitle = (cat: Category | string | undefined) => {
    if (!cat) return 'Signature Bite';
    if (typeof cat === 'object' && cat.name) return cat.name;
    return String(cat);
  };

  if (loading && slides === defaultSlides) {
    return <HeroSectionSkeleton />;
  }

  return (
    <section
      aria-label="Hero Showcase"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative overflow-hidden bg-brand-black border-b border-brand-cream/10 h-[550px] max-h-[550px] flex flex-col justify-center select-none"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full bg-[radial-gradient(ellipse_60%_50%_at_50%_15%,rgba(var(--brand-yellow-rgb),0.15),transparent_70%)] pointer-events-none" />
      <div className="absolute -bottom-10 right-10 w-72 h-72 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container-bb relative z-10 w-full h-full flex flex-col justify-center pt-16 sm:pt-14 pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentItem._id || currentIndex}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center my-auto"
          >
            <div className="lg:col-span-6 flex flex-col items-start text-left">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-surface border border-brand-border shadow-sm">
                  <MapPin className="w-3.5 h-3.5 text-brand-yellow shrink-0" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-cream/80">
                    {hero.locationPill}
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-yellow/15 border border-brand-yellow/30 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-brand-yellow shrink-0" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-yellow">
                    {getCategoryTitle(currentItem.category)}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-baseline gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase text-brand-cream tracking-tight leading-tight">
                  {currentItem.name}
                </h1>
                <span className="text-xl sm:text-2xl font-extrabold text-brand-yellow">
                  ৳{currentItem.price}
                </span>
              </div>

              <p className="text-brand-cream/75 text-xs sm:text-sm md:text-base leading-relaxed line-clamp-2 max-w-xl mb-5">
                {currentItem.description || hero.subtitle}
              </p>

              <div className="flex flex-wrap items-center gap-3 mb-4 sm:mb-5">
                <Link
                  href={`/menu/${currentItem.slug || currentItem._id}`}
                  className="btn-primary gap-2 py-2 sm:py-2.5 px-5 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-md"
                >
                  <span>{hero.ctaPrimaryLabel}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href={hero.ctaSecondaryLink}
                  className="btn-secondary py-2 sm:py-2.5 px-4 text-xs sm:text-sm font-bold uppercase tracking-wider"
                >
                  {hero.ctaSecondaryLabel}
                </Link>
              </div>

              <div className="flex items-center gap-4 sm:gap-6 pt-3 border-t border-brand-border w-full text-brand-cream/80">
                {hero.trustBadges.map((badge, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-brand-yellow" />
                    <span>{badge.label}</span>
                  </div>
                ))}
                {currentItem.servingSize && (
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider">
                    <Utensils className="w-3.5 h-3.5 text-brand-yellow" />
                    <span>{currentItem.servingSize}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-6 relative w-full flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[420px] sm:max-w-[460px] h-[220px] sm:h-[260px] lg:h-[280px] rounded-2xl overflow-hidden card-bb border-brand-border shadow-2xl bg-brand-surface group">
                <Image
                  src={currentItem.image || hero.image || '/images/hero-platter.jpg'}
                  alt={currentItem.name}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                <div className="absolute top-3 right-3 bg-brand-surface/90 backdrop-blur-md border border-brand-yellow/40 rounded-lg px-2.5 py-1 shadow-lg flex items-center gap-1.5 z-20">
                  <Star className="w-3.5 h-3.5 text-brand-yellow fill-brand-yellow" />
                  <span className="text-[10px] font-bold text-brand-yellow uppercase tracking-wider">
                    Featured Item
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between p-2.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/15">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold text-white uppercase tracking-wide">
                      {currentItem.name}
                    </span>
                  </div>
                  <span className="text-xs font-black text-brand-yellow">
                    ৳{currentItem.price}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {totalSlides > 1 && (
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2 z-30">
          {slides.map((_, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  isActive
                    ? 'w-8 h-2.5 bg-brand-yellow shadow-[0_0_12px_rgb(var(--brand-yellow-rgb)/0.8)]'
                    : 'w-2.5 h-2.5 bg-brand-cream/30 hover:bg-brand-cream/60'
                }`}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
