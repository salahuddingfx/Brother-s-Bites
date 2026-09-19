'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, UtensilsCrossed, ShoppingCart, Check, Loader2 } from 'lucide-react';
import { MenuItem } from '@/types';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

interface MenuCardProps {
  item: MenuItem;
  featured?: boolean;
  className?: string;
}

export default function MenuCard({ item, featured = false, className }: MenuCardProps) {
  const { addItem, openCart } = useCart();
  const [added, setAdded] = useState(false);
  const [adding, setAdding] = useState(false);
  const [orderingNow, setOrderingNow] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (adding || !item.isAvailable) return;

    setAdding(true);
    try {
      await addItem(item);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch {
      // silent fail
    } finally {
      setAdding(false);
    }
  };

  const handleOrderNow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (orderingNow || !item.isAvailable) return;

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

  return (
    <Link
      href={`/menu/${item.slug || item._id}`}
      className={cn(
        'card-bb group relative overflow-hidden flex flex-col cursor-pointer transition-all duration-300 hover:-translate-y-1',
        featured && 'border-brand-yellow/30',
        className
      )}
    >
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-3 right-3 z-10 bg-brand-yellow text-black px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider rounded flex items-center gap-1 shadow-md">
          <Star size={11} fill="currentColor" />
          <span>Featured</span>
        </div>
      )}

      {/* Image Container */}
      <div className="aspect-[4/3] bg-brand-surface relative overflow-hidden rounded-t-[11px]">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className={cn(
              'object-cover transition-transform duration-500 group-hover:scale-105',
              !item.isAvailable && 'grayscale contrast-75'
            )}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-brand-surface">
            <UtensilsCrossed className="w-10 h-10 text-brand-yellow/20" />
          </div>
        )}

        {/* Multi-image count badge */}
        {item.images && item.images.length > 1 && (
          <div className="absolute bottom-2.5 right-2.5 z-10">
            <span className="bg-brand-black/80 backdrop-blur-md text-brand-cream/90 border border-white/10 px-2 py-0.5 text-[11px] font-semibold rounded shadow-md flex items-center gap-1">
              <span>📷</span>
              <span>{item.images.length} photos</span>
            </span>
          </div>
        )}

        {!item.isAvailable && (
          <div className="absolute inset-0 bg-brand-black/75 backdrop-blur-[2px] flex items-center justify-center p-3 text-center">
            <span className="text-brand-cream/90 text-xs font-semibold uppercase tracking-wider px-3 py-1 bg-brand-surface-light/90 border border-white/10 rounded">
              Currently Unavailable
            </span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <h3 className="font-bold text-brand-cream text-base group-hover:text-brand-yellow transition-colors line-clamp-1">
              {item.name}
            </h3>
            <span className="text-brand-yellow font-bold text-base sm:text-lg whitespace-nowrap tabular-nums">
              ৳{item.price}
            </span>
          </div>

          {item.servingSize && (
            <p className="text-brand-cream/40 text-xs font-medium mb-1.5">
              {item.servingSize}
            </p>
          )}

          {item.description && (
            <p className="text-brand-cream/60 text-xs sm:text-sm line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>

        {/* Action Buttons: Quick Add to Cart + Direct ORDER NOW */}
        {item.isAvailable && (
          <div className="mt-3.5 flex items-center gap-2">
            {/* Quick Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={adding}
              title="Add to Cart"
              className={cn(
                'h-9 px-3 rounded-lg text-xs font-bold border transition-all flex items-center justify-center shrink-0',
                added
                  ? 'bg-green-500/20 text-green-400 border-green-500/30'
                  : 'bg-brand-surface-light border-brand-border text-brand-cream/80 hover:text-brand-yellow hover:border-brand-yellow/50'
              )}
            >
              {added ? (
                <Check size={15} className="text-green-400" />
              ) : (
                <ShoppingCart size={15} />
              )}
            </button>

            {/* Direct ORDER NOW */}
            <button
              onClick={handleOrderNow}
              disabled={orderingNow}
              className="flex-1 btn-primary !h-9 text-xs font-extrabold uppercase tracking-wider justify-center gap-1.5 shadow-md hover:scale-[1.02] transition-transform"
            >
              {orderingNow ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <UtensilsCrossed size={13} />
              )}
              <span>ORDER NOW</span>
            </button>
          </div>
        )}
      </div>
    </Link>
  );
}
