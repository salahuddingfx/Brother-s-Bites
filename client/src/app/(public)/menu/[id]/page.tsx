'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Star,
  UtensilsCrossed,
  Phone,
  MessageCircle,
  Share2,
  CheckCircle2,
  MapPin,
  Clock,
  Sparkles,
  Maximize2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import api from '@/lib/api';
import { MenuItem } from '@/types';
import MenuCard from '@/components/menu/MenuCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ImageLightboxModal from '@/components/common/ImageLightboxModal';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SingleMenuItemPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [item, setItem] = useState<MenuItem | null>(null);
  const [relatedItems, setRelatedItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [added, setAdded] = useState(false);
  const [adding, setAdding] = useState(false);
  const [orderingNow, setOrderingNow] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const { addItem, openCart } = useCart();

  useEffect(() => {
    if (!id) return;

    const fetchItemAndRelated = async () => {
      setLoading(true);
      try {
        const itemRes = await api.get(`/menu/${id}`);
        const currentItem = itemRes.data.data;
        setItem(currentItem);

        // Fetch related items from the same category or general menu
        const menuRes = await api.get('/menu');
        const allItems: MenuItem[] = Array.isArray(menuRes.data.data)
          ? menuRes.data.data
          : menuRes.data.data?.items || [];
        const categoryId = typeof currentItem?.category === 'object'
          ? currentItem.category._id
          : currentItem?.category;

        const filtered = allItems
          .filter((i) => i._id !== id && (typeof i.category === 'object' ? i.category._id : i.category) === categoryId)
          .slice(0, 3);

        // If not enough related items from same category, fill with others
        if (filtered.length < 3) {
          const others = allItems.filter(
            (i) => i._id !== id && !filtered.some((f) => f._id === i._id)
          ).slice(0, 3 - filtered.length);
          setRelatedItems([...filtered, ...others]);
        } else {
          setRelatedItems(filtered);
        }
      } catch (err) {
        console.error('Failed to load item:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchItemAndRelated();
  }, [id]);

  const handleAddToCart = async () => {
    if (!item || adding || !item.isAvailable) return;
    setAdding(true);
    try {
      await addItem(item);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch {
      // silent fail
    } finally {
      setAdding(false);
    }
  };

  const handleOrderNow = async () => {
    if (!item || orderingNow || !item.isAvailable) return;
    setOrderingNow(true);
    try {
      await addItem(item);
      openCart();
    } catch {
      // silent fail
    } finally {
      setOrderingNow(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${item?.name} | Brother's Bites`,
          text: `Check out ${item?.name} at Brother's Bites!`,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="heading-md text-brand-cream mb-2">Item Not Found</h2>
        <p className="text-brand-cream/60 text-sm mb-6 max-w-sm">
          The requested menu item could not be found or may have been removed.
        </p>
        <Link href="/menu" className="btn-primary">
          BACK TO MENU
        </Link>
      </div>
    );
  }

  const categoryName =
    typeof item.category === 'object' && item.category !== null
      ? item.category.name
      : 'Menu Item';

  return (
    <div className="pt-24 pb-16 sm:pb-24">
      <div className="container-bb">
        {/* Breadcrumb & Back Nav */}
        <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-cream/70 hover:text-brand-yellow transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Menu</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-brand-cream/40 hidden sm:flex">
            <Link href="/" className="hover:text-brand-cream transition-colors">Home</Link>
            <span>/</span>
            <Link href="/menu" className="hover:text-brand-cream transition-colors">Menu</Link>
            <span>/</span>
            <span className="text-brand-yellow font-semibold truncate max-w-[180px]">{item.name}</span>
          </div>
        </div>

        {/* Main Product Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Big Image Display & Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-6"
          >
            {(() => {
              const itemImages =
                item.images && item.images.length > 0
                  ? item.images
                  : item.image
                  ? [item.image]
                  : [];
              const displayImage = itemImages[activeImageIdx] || item.image;
              const hasMultiple = itemImages.length > 1;

              return (
                <div className="space-y-3.5">
                  {/* Main Preview Container */}
                  <div
                    onClick={() => displayImage && setLightboxOpen(true)}
                    className={cn(
                      'card-bb relative aspect-[4/3] overflow-hidden rounded-xl border border-brand-cream/10 bg-brand-surface group',
                      displayImage ? 'cursor-zoom-in' : ''
                    )}
                  >
                    {displayImage ? (
                      <>
                        <Image
                          src={displayImage}
                          alt={item.name}
                          fill
                          priority
                          className={cn(
                            'object-cover transition-transform duration-500 group-hover:scale-105',
                            !item.isAvailable && 'grayscale contrast-75'
                          )}
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />

                        {/* Hover Overlay with Zoom Icon */}
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                          <span className="bg-brand-black/85 backdrop-blur-md text-brand-yellow px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xl border border-brand-yellow/30">
                            <Maximize2 size={13} />
                            <span>Click for Fullscreen View</span>
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full bg-brand-surface text-brand-cream/30">
                        <UtensilsCrossed className="w-16 h-16 mb-2 text-brand-yellow/20" />
                        <span className="text-xs uppercase tracking-wider">No Image Available</span>
                      </div>
                    )}

                    {/* Status Badges */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10 pointer-events-none">
                      <span className="bg-brand-black/80 backdrop-blur-md text-brand-cream border border-brand-cream/15 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded">
                        {categoryName}
                      </span>
                      {item.isFeatured && (
                        <span className="bg-brand-yellow text-black px-3 py-1 text-xs font-extrabold uppercase tracking-wider rounded flex items-center gap-1 shadow-md">
                          <Star size={12} fill="currentColor" />
                          <span>Featured Bite</span>
                        </span>
                      )}
                    </div>

                    {/* Multi-image indicator badge */}
                    {hasMultiple && (
                      <div className="absolute bottom-4 right-4 z-10 pointer-events-none">
                        <span className="bg-brand-black/80 backdrop-blur-md text-brand-cream/90 border border-white/10 px-2.5 py-1 text-xs font-semibold rounded-md shadow-lg">
                          📷 {activeImageIdx + 1} / {itemImages.length}
                        </span>
                      </div>
                    )}

                    {/* Next / Prev Quick Arrows on Main Card */}
                    {hasMultiple && (
                      <>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveImageIdx((prev) => (prev - 1 + itemImages.length) % itemImages.length);
                          }}
                          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/60 hover:bg-brand-yellow hover:text-black text-white backdrop-blur-md border border-white/20 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <ChevronLeft size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveImageIdx((prev) => (prev + 1) % itemImages.length);
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/60 hover:bg-brand-yellow hover:text-black text-white backdrop-blur-md border border-white/20 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </>
                    )}

                    {!item.isAvailable && (
                      <div className="absolute inset-0 bg-brand-black/80 backdrop-blur-[2px] flex items-center justify-center p-4">
                        <span className="text-brand-cream text-sm font-bold uppercase tracking-wider px-4 py-1.5 bg-brand-surface-light border border-white/10 rounded">
                          Currently Sold Out
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Selector Strip (for multiple images) */}
                  {hasMultiple && (
                    <div className="flex items-center gap-2.5 overflow-x-auto pb-1 custom-scrollbar">
                      {itemImages.map((imgUrl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveImageIdx(idx)}
                          className={cn(
                            'relative w-20 h-16 sm:w-24 sm:h-18 rounded-lg overflow-hidden border-2 transition-all shrink-0 bg-brand-surface',
                            idx === activeImageIdx
                              ? 'border-brand-yellow ring-2 ring-brand-yellow/40 scale-[1.02]'
                              : 'border-brand-border opacity-60 hover:opacity-100 hover:border-brand-border-hover'
                          )}
                        >
                          <Image
                            src={imgUrl}
                            alt={`${item.name} view ${idx + 1}`}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}
          </motion.div>

          {/* Right Column: Information & Actions */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="eyebrow-bb">{categoryName}</span>
                {item.servingSize && (
                  <>
                    <span className="text-brand-cream/30">•</span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-brand-cream/60">
                      {item.servingSize}
                    </span>
                  </>
                )}
              </div>

              <h1 className="heading-page text-brand-cream mb-4">
                {item.name}
              </h1>

              {/* Price & Availability */}
              <div className="flex items-center gap-4 pb-6 mb-6 border-b border-brand-cream/10">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-brand-yellow tabular-nums">
                    ৳{item.price}
                  </span>
                </div>

                <div className="h-6 w-px bg-brand-cream/10" />

                <div>
                  {item.isAvailable ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Available Fresh
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-400 bg-rose-950/40 border border-rose-500/30 px-2.5 py-1 rounded">
                      Currently Sold Out
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-brand-cream/60 mb-2">
                  About This Dish
                </h3>
                <p className="text-brand-cream/80 text-sm sm:text-base leading-relaxed">
                  {item.description ||
                    'Crafted with premium coastal spices and fresh ingredients. Cooked to perfection at Brother’s Bites Marine Drive.'}
                </p>
              </div>

              {/* Dish Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                <div className="card-bb p-3 flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-brand-yellow shrink-0" />
                  <span className="text-xs font-semibold text-brand-cream/80">Made to Order</span>
                </div>
                <div className="card-bb p-3 flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-brand-yellow shrink-0" />
                  <span className="text-xs font-semibold text-brand-cream/80">Beachside Vibe</span>
                </div>
                <div className="card-bb p-3 flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-brand-yellow shrink-0" />
                  <span className="text-xs font-semibold text-brand-cream/80">Fast Service</span>
                </div>
              </div>

              {/* Order & Contact CTAs */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row gap-3">
                  {item.isAvailable && (
                    <>
                      <button
                        onClick={handleOrderNow}
                        disabled={orderingNow}
                        className="btn-primary flex-1 !h-12 text-sm font-black uppercase tracking-wider justify-center gap-2 shadow-lg shadow-brand-yellow/15 hover:scale-[1.02] transition-transform"
                      >
                        <UtensilsCrossed size={16} />
                        <span>ORDER NOW</span>
                      </button>

                      <button
                        onClick={handleAddToCart}
                        disabled={adding}
                        className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border ${
                          added
                            ? 'bg-green-500/20 text-green-400 border-green-500/30'
                            : 'bg-brand-surface border-brand-border text-brand-cream/80 hover:text-brand-yellow hover:border-brand-yellow/50'
                        }`}
                      >
                        {added ? (
                          <>
                            <Check className="w-4 h-4 text-green-400" />
                            <span>Added!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-4 h-4" />
                            <span>Add to Cart</span>
                          </>
                        )}
                      </button>
                    </>
                  )}
                  <a
                    href="tel:+8801627817436"
                    className="btn-secondary !h-12 px-4 gap-2 justify-center text-xs"
                  >
                    <Phone className="w-4 h-4 text-brand-yellow" />
                    <span>CALL US</span>
                  </a>
                </div>

                <div className="flex items-center justify-between pt-3">
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-cream/60 hover:text-brand-yellow transition-colors"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400">Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4" />
                        <span>Share This Bite</span>
                      </>
                    )}
                  </button>

                  <a
                    href="https://share.google/c3GkhEDd0hLvdo7Vm"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-brand-cream/60 hover:text-brand-cream transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Sonar Para Beach, Cox&apos;s Bazar</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Items Section */}
        {relatedItems.length > 0 && (
          <div className="mt-16 sm:mt-24 pt-12 border-t border-brand-cream/10">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="eyebrow-bb">Recommended Next</span>
                <h2 className="heading-section text-brand-cream mt-1">MORE FROM BROTHER&apos;S BITES</h2>
              </div>
              <Link href="/menu" className="btn-secondary hidden sm:inline-flex">
                VIEW FULL MENU
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedItems.map((relItem) => (
                <MenuCard key={relItem._id} item={relItem} />
              ))}
            </div>

            <div className="text-center mt-8 sm:hidden">
              <Link href="/menu" className="btn-secondary w-full">
                VIEW FULL MENU
              </Link>
            </div>
          </div>
        )}

        {/* Image Fullscreen Lightbox Modal */}
        {item && (
          <ImageLightboxModal
            isOpen={lightboxOpen}
            onClose={() => setLightboxOpen(false)}
            images={
              item.images && item.images.length > 0
                ? item.images
                : item.image
                ? [item.image]
                : []
            }
            initialIndex={activeImageIdx}
            title={item.name}
          />
        )}
      </div>
    </div>
  );
}
