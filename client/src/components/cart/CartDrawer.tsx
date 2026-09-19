'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, Plus, Minus, Trash2, ArrowRight, Utensils } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

export function CartNavButton({ className }: { className?: string }) {
  const { cartCount, toggleCart } = useCart();

  return (
    <button
      onClick={toggleCart}
      className={cn(
        'relative p-2 rounded-lg text-brand-cream/80 hover:text-brand-yellow hover:bg-white/5 transition-all focus:outline-none flex items-center justify-center',
        className
      )}
      aria-label={`Open shopping cart (${cartCount} items)`}
    >
      <ShoppingCart size={20} strokeWidth={2.2} />
      {cartCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 bg-brand-yellow text-brand-black text-[10px] font-extrabold rounded-full flex items-center justify-center min-w-[18px] h-[18px] px-1 shadow-md border border-brand-black">
          {cartCount > 99 ? '99+' : cartCount}
        </span>
      )}
    </button>
  );
}

export default function CartDrawer() {
  const { cart, cartCount, cartTotal, updateQuantity, removeItem, isCartOpen, closeCart } = useCart();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Mount check for client portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-close on route change
  useEffect(() => {
    closeCart();
  }, [pathname, closeCart]);

  // Lock body scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  if (!mounted) return null;

  const drawerContent = (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-[99999] flex justify-end" aria-modal="true" role="dialog">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            onClick={closeCart}
          />

          {/* Drawer Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative w-full max-w-md h-full bg-brand-surface-light border-l border-brand-border flex flex-col shadow-2xl z-10"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border bg-brand-surface">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-yellow/15 flex items-center justify-center text-brand-yellow">
                  <ShoppingCart size={18} strokeWidth={2.2} />
                </div>
                <div>
                  <h2 className="text-brand-cream font-bold text-base leading-tight">Your Order</h2>
                  <p className="text-xs text-brand-cream/50">Brother&apos;s Bites Coastal Kitchen</p>
                </div>
                {cartCount > 0 && (
                  <span className="ml-1.5 bg-brand-yellow/20 text-brand-yellow text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-brand-yellow/30">
                    {cartCount}
                  </span>
                )}
              </div>

              <button
                onClick={closeCart}
                className="p-1.5 rounded-lg text-brand-cream/60 hover:text-brand-cream hover:bg-white/5 transition-colors"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar space-y-3.5">
              {!cart?.items?.length ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16 px-4">
                  <div className="w-20 h-20 rounded-full bg-brand-surface border border-brand-border flex items-center justify-center mb-5 text-brand-cream/25">
                    <Utensils size={36} />
                  </div>
                  <h3 className="text-brand-cream font-bold text-lg mb-1">Your cart is empty</h3>
                  <p className="text-brand-cream/50 text-xs sm:text-sm max-w-xs mb-6">
                    Looks like you haven&apos;t added any coastal bites or sips yet.
                  </p>
                  <Link
                    href="/menu"
                    onClick={closeCart}
                    className="btn-primary !h-10 px-6 text-xs"
                  >
                    EXPLORE OUR MENU
                  </Link>
                </div>
              ) : (
                cart.items.map((item) => (
                  <div
                    key={item._id}
                    className="bg-brand-surface rounded-xl border border-brand-border p-3.5 flex gap-3.5 transition-all hover:border-brand-border-hover"
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover shrink-0 bg-brand-surface-light border border-white/5"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-brand-surface-light border border-white/5 flex items-center justify-center shrink-0 text-brand-cream/20">
                        <Utensils size={20} />
                      </div>
                    )}

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-brand-cream text-sm font-semibold truncate leading-tight">
                            {item.name}
                          </h4>
                          <span className="text-brand-yellow font-bold text-sm shrink-0">
                            ৳{item.price * item.quantity}
                          </span>
                        </div>
                        <p className="text-xs text-brand-cream/40 mt-0.5">৳{item.price} each</p>
                        {item.specialInstructions && (
                          <p className="text-brand-cream/50 text-[11px] italic truncate mt-1">
                            &ldquo;{item.specialInstructions}&rdquo;
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
                        <div className="flex items-center gap-2 bg-brand-surface-light rounded-lg border border-brand-border p-0.5">
                          <button
                            onClick={() => updateQuantity(item._id, Math.max(0, item.quantity - 1))}
                            className="w-6 h-6 rounded flex items-center justify-center text-brand-cream/60 hover:text-brand-yellow hover:bg-white/5 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-brand-cream text-xs font-bold w-5 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="w-6 h-6 rounded flex items-center justify-center text-brand-cream/60 hover:text-brand-yellow hover:bg-white/5 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item._id)}
                          className="text-brand-cream/40 hover:text-red-400 p-1 transition-colors"
                          title="Remove item"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Footer / Checkout CTA */}
            {cart?.items && cart.items.length > 0 && (
              <div className="p-5 border-t border-brand-border bg-brand-surface space-y-4">
                <div className="space-y-1.5 text-xs text-brand-cream/60">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-brand-cream font-semibold text-sm">৳{cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span>Delivery</span>
                    <span className="text-brand-yellow/80 font-medium">Calculated at checkout</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-brand-border flex items-baseline justify-between">
                  <span className="text-sm font-bold uppercase tracking-wider text-brand-cream">
                    Estimated Total
                  </span>
                  <span className="text-brand-yellow font-extrabold text-xl">৳{cartTotal}</span>
                </div>

                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="btn-primary w-full justify-center gap-2 !h-12 text-sm shadow-xl"
                >
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <p className="text-[11px] text-center text-brand-cream/40">
                  Freshly made to order • Cash on Delivery / Pickup
                </p>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(drawerContent, document.body);
}
