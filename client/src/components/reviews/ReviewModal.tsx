'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  X,
  CheckCircle,
  Loader2,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  Search,
  Utensils,
  Receipt,
  Phone,
} from 'lucide-react';
import api from '@/lib/api';
import { cn } from '@/lib/utils';
import StarRating from '@/components/common/StarRating';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialOrderNumber?: string;
  initialDish?: string;
}

const ratingPresets = [
  { value: 5.0, label: '5.0 ★ Outstanding' },
  { value: 4.5, label: '4.5 ★ Excellent' },
  { value: 4.0, label: '4.0 ★ Great' },
  { value: 3.5, label: '3.5 ★ Good' },
  { value: 3.0, label: '3.0 ★ Average' },
  { value: 2.5, label: '2.5 ★ Fair' },
];

export default function ReviewModal({
  isOpen,
  onClose,
  onSuccess,
  initialOrderNumber = '',
  initialDish = '',
}: ReviewModalProps) {
  const [orderQuery, setOrderQuery] = useState(initialOrderNumber);
  const [verifiedOrder, setVerifiedOrder] = useState<{
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    items: string[];
  } | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState('');

  const [rating, setRating] = useState<number>(5.0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [dish, setDish] = useState(initialDish);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Auto verify if initialOrderNumber is passed
  useEffect(() => {
    if (initialOrderNumber && isOpen) {
      setOrderQuery(initialOrderNumber);
      handleVerify(initialOrderNumber);
    }
  }, [initialOrderNumber, isOpen]);

  const handleVerify = async (queryToUse?: string) => {
    const q = (queryToUse || orderQuery).trim();
    if (!q) {
      setVerifyError('Please enter your Order ID (e.g. BB-XXXX) or Phone Number.');
      return;
    }

    setVerifying(true);
    setVerifyError('');

    try {
      const res = await api.get(`/reviews/verify-order/${encodeURIComponent(q)}`);
      const data = res.data.data;
      if (data) {
        setVerifiedOrder(data);
        setName(data.customerName || '');
        setPhone(data.customerPhone || '');
        if (data.items && data.items.length > 0) {
          setDish(data.items[0]);
        }
      }
    } catch (err: any) {
      setVerifiedOrder(null);
      setVerifyError(
        err.response?.data?.message ||
          'No matching order found. Reviews can only be submitted by verified customers who ordered food.'
      );
    } finally {
      setVerifying(false);
    }
  };

  const currentDisplayRating = hoverRating > 0 ? hoverRating : rating;

  const handleStarMouseMove = (e: React.MouseEvent<HTMLDivElement>, starIndex: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const isLeftHalf = e.clientX - rect.left < rect.width / 2;
    setHoverRating(isLeftHalf ? starIndex - 0.5 : starIndex);
  };

  const handleStarClick = (e: React.MouseEvent<HTMLDivElement>, starIndex: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const isLeftHalf = e.clientX - rect.left < rect.width / 2;
    setRating(isLeftHalf ? starIndex - 0.5 : starIndex);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifiedOrder && !orderQuery.trim()) {
      setSubmitError('Please verify your order number first.');
      return;
    }

    if (!name.trim() || !comment.trim()) {
      setSubmitError('Please provide your name and a review comment.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      await api.post('/reviews', {
        customerName: name.trim(),
        customerPhone: phone.trim() || verifiedOrder?.customerPhone,
        rating,
        comment: comment.trim(),
        dishRecommended: dish.trim() || undefined,
        orderNumber: verifiedOrder?.orderNumber || orderQuery.trim(),
      });

      setSubmitted(true);
      if (onSuccess) onSuccess();

      setTimeout(() => {
        setSubmitted(false);
        onClose();
        // Reset form
        setName('');
        setPhone('');
        setComment('');
        setDish('');
        setVerifiedOrder(null);
        setOrderQuery('');
        setRating(5.0);
      }, 2000);
    } catch (err: any) {
      setSubmitError(
        err.response?.data?.message || 'Failed to submit review. Only verified orders can be reviewed.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getRatingFeedback = (val: number) => {
    if (val >= 5.0) return 'Outstanding! (5.0 / 5.0)';
    if (val >= 4.5) return 'Excellent Experience! (4.5 / 5.0)';
    if (val >= 4.0) return 'Very Good (4.0 / 5.0)';
    if (val >= 3.5) return 'Good Food & Service (3.5 / 5.0)';
    if (val >= 3.0) return 'Average (3.0 / 5.0)';
    if (val >= 2.5) return 'Fair (2.5 / 5.0)';
    if (val >= 2.0) return 'Below Expectation (2.0 / 5.0)';
    return 'Poor (1.0 / 5.0)';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 overflow-y-auto" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg bg-brand-surface-light border border-brand-border rounded-2xl p-6 sm:p-8 shadow-2xl z-10 overflow-hidden my-auto"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-1 text-brand-cream/50 hover:text-brand-cream transition-colors"
              aria-label="Close review modal"
            >
              <X size={20} />
            </button>

            {submitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto text-green-400 shadow-md">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-xl font-black text-brand-cream">Thank You for Your Feedback!</h3>
                <p className="text-xs sm:text-sm text-brand-cream/60 max-w-xs mx-auto">
                  Your verified customer review has been published on Brother&apos;s Bites!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-center mb-5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-yellow/15 border border-brand-yellow/30 text-brand-yellow text-xs font-bold uppercase tracking-wider mb-2">
                    <ShieldCheck size={13} />
                    <span>Verified Customer Review</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-brand-cream uppercase">
                    RATE YOUR ORDER EXPERIENCE
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-cream/60 mt-1">
                    Only verified diners who ordered from Brother&apos;s Bites can leave a review.
                  </p>
                </div>

                {/* Step 1: Order Verification (If not verified yet) */}
                {!verifiedOrder ? (
                  <div className="space-y-3 p-4 bg-brand-surface rounded-xl border border-brand-border">
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-cream/70">
                      Enter Order ID or Mobile Phone <span className="text-brand-yellow">*</span>
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Receipt className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-cream/40" />
                        <input
                          type="text"
                          value={orderQuery}
                          onChange={(e) => setOrderQuery(e.target.value)}
                          placeholder="e.g. BB-20260917-2628 or 018XXXXXXXX"
                          className="w-full bg-brand-surface-light border border-brand-border rounded-lg pl-9 pr-3 py-2 text-brand-cream text-xs placeholder-brand-cream/35 focus:outline-none focus:border-brand-yellow"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleVerify()}
                        disabled={verifying || !orderQuery.trim()}
                        className="btn-primary !h-9 px-4 text-xs shrink-0 gap-1.5 disabled:opacity-50"
                      >
                        {verifying ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <Search size={13} />
                        )}
                        <span>Verify Order</span>
                      </button>
                    </div>

                    {verifyError && (
                      <p className="text-xs text-red-400 bg-red-500/10 p-2.5 rounded-lg border border-red-500/20">
                        {verifyError}
                      </p>
                    )}

                    <p className="text-[11px] text-brand-cream/40 leading-relaxed">
                      💡 Tip: You can find your Order Number on your SMS or order confirmation screen.
                    </p>
                  </div>
                ) : (
                  /* Verified Order Badge */
                  <div className="mb-4 p-3 bg-green-500/10 border border-green-500/25 rounded-xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <ShieldCheck size={18} className="text-green-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-green-300 truncate">
                          Verified Order #{verifiedOrder.orderNumber}
                        </p>
                        <p className="text-[11px] text-brand-cream/60 truncate">
                          Customer: {verifiedOrder.customerName} ({verifiedOrder.customerPhone})
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setVerifiedOrder(null)}
                      className="text-[10px] text-brand-cream/40 hover:text-brand-yellow underline shrink-0"
                    >
                      Change
                    </button>
                  </div>
                )}

                {/* Step 2: Review Form (Active only when verified) */}
                {verifiedOrder && (
                  <form onSubmit={handleSubmit} className="space-y-4 mt-3">
                    {submitError && (
                      <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                        {submitError}
                      </div>
                    )}

                    {/* Star Rating Selector */}
                    <div className="flex flex-col items-center justify-center py-3 px-4 bg-brand-surface rounded-xl border border-brand-border">
                      <div className="flex items-center justify-between w-full mb-2">
                        <span className="text-xs font-semibold text-brand-cream/60 uppercase tracking-wider">
                          Overall Rating
                        </span>
                        <span className="text-xs font-bold text-brand-yellow bg-brand-yellow/10 px-2 py-0.5 rounded border border-brand-yellow/20">
                          {rating.toFixed(1)} / 5.0
                        </span>
                      </div>

                      {/* Interactive Half/Full Star Selector */}
                      <div className="flex items-center gap-1.5 py-1" onMouseLeave={() => setHoverRating(0)}>
                        {[1, 2, 3, 4, 5].map((starIdx) => {
                          const isFull = currentDisplayRating >= starIdx;
                          const isHalf = !isFull && currentDisplayRating >= starIdx - 0.5;

                          return (
                            <div
                              key={starIdx}
                              onMouseMove={(e) => handleStarMouseMove(e, starIdx)}
                              onClick={(e) => handleStarClick(e, starIdx)}
                              className="p-1 cursor-pointer transition-transform hover:scale-110 relative"
                              title={`${starIdx} or ${starIdx - 0.5} Stars`}
                            >
                              <div className="relative w-7 h-7">
                                <Star size={28} className="text-brand-cream/20 absolute inset-0" />
                                {isFull && (
                                  <Star size={28} className="text-brand-yellow fill-brand-yellow absolute inset-0" />
                                )}
                                {isHalf && (
                                  <div className="overflow-hidden absolute inset-0 w-1/2">
                                    <Star size={28} className="text-brand-yellow fill-brand-yellow" />
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Feedback Text */}
                      <span className="text-xs font-bold text-brand-yellow mt-1">
                        {getRatingFeedback(currentDisplayRating)}
                      </span>

                      {/* Quick Preset Pills for 5.0, 4.5, 4.0, 3.5, 3.0 */}
                      <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2.5 pt-2.5 border-t border-brand-border/60 w-full">
                        {ratingPresets.map((preset) => (
                          <button
                            key={preset.value}
                            type="button"
                            onClick={() => setRating(preset.value)}
                            className={cn(
                              'text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all border',
                              rating === preset.value
                                ? 'bg-brand-yellow text-brand-black border-brand-yellow font-bold shadow-sm'
                                : 'bg-brand-surface-light text-brand-cream/70 border-brand-border hover:border-brand-yellow/40 hover:text-brand-cream'
                            )}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Dish Selection from Verified Order */}
                    {verifiedOrder.items && verifiedOrder.items.length > 0 && (
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-brand-cream/70 mb-1.5">
                          Dish You Loved / Reviewed
                        </label>
                        <select
                          value={dish}
                          onChange={(e) => setDish(e.target.value)}
                          className="w-full bg-brand-surface border border-brand-border rounded-lg px-3.5 py-2.5 text-brand-cream text-sm focus:outline-none focus:border-brand-yellow transition-colors"
                        >
                          {verifiedOrder.items.map((item, i) => (
                            <option key={i} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Review Text */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-brand-cream/70 mb-1.5">
                        Your Feedback <span className="text-brand-yellow">*</span>
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Tell us what you enjoyed about the food taste, portion, or delivery..."
                        className="w-full bg-brand-surface border border-brand-border rounded-lg p-3 text-brand-cream text-sm focus:outline-none focus:border-brand-yellow transition-colors placeholder-brand-cream/30 resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-primary w-full justify-center !h-11 text-xs gap-2 mt-2 disabled:opacity-50 shadow-lg"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>SUBMITTING REVIEW...</span>
                        </>
                      ) : (
                        <>
                          <MessageSquare size={16} />
                          <span>SUBMIT VERIFIED REVIEW ({rating.toFixed(1)} ★)</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
