'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search,
  CheckCircle2,
  Clock,
  ChefHat,
  Truck,
  PackageCheck,
  XCircle,
  Phone,
  MessageSquare,
  MapPin,
  Utensils,
  Copy,
  Check,
  Loader2,
  RefreshCw,
  Hash,
  Star,
  Receipt,
} from 'lucide-react';
import api from '@/lib/api';
import { cn } from '@/lib/utils';
import ReviewModal from '@/components/reviews/ReviewModal';
import InvoiceModal from '@/components/orders/InvoiceModal';

interface OrderItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  specialInstructions?: string;
}

interface OrderData {
  _id: string;
  orderNumber: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
  paymentStatus: string;
  paymentMethod: string;
  orderType: 'delivery' | 'pickup';
  items: OrderItem[];
  deliveryFee?: number;
  totalAmount: number;
  totalItems: number;
  customer: {
    name: string;
    phone: string;
    email?: string;
    address?: {
      street?: string;
      city?: string;
      area?: string;
      landmark?: string;
    };
  };
  specialNotes?: string;
  createdAt: string;
  updatedAt: string;
}

const statusSteps = [
  {
    key: 'pending',
    label: 'Order Placed',
    desc: 'Received & sent to kitchen',
    icon: Clock,
  },
  {
    key: 'preparing',
    label: 'Preparing Food',
    desc: 'Freshly cooking by our chefs',
    icon: ChefHat,
  },
  {
    key: 'out_for_delivery',
    label: 'Out for Delivery / Ready',
    desc: 'On its way or ready for pickup',
    icon: Truck,
  },
  {
    key: 'delivered',
    label: 'Delivered',
    desc: 'Delivered to your hands!',
    icon: PackageCheck,
  },
];

function getStepIndex(status: string): number {
  switch (status) {
    case 'pending':
      return 0;
    case 'confirmed':
    case 'preparing':
      return 1;
    case 'ready':
    case 'out_for_delivery':
      return 2;
    case 'delivered':
      return 3;
    case 'cancelled':
      return -1;
    default:
      return 0;
  }
}

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialOrderParam = searchParams.get('order') || searchParams.get('phone') || '';

  const [searchInput, setSearchInput] = useState(initialOrderParam);
  const [activeOrder, setActiveOrder] = useState<OrderData | null>(null);
  const [ordersList, setOrdersList] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);

  const fetchOrder = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/orders/track/${encodeURIComponent(query.trim())}`);
      const data = res.data.data;
      if (data.orders && Array.isArray(data.orders)) {
        setOrdersList(data.orders);
        setActiveOrder(data.order || data.orders[0]);
      } else if (data.order) {
        setActiveOrder(data.order);
        setOrdersList([data.order]);
      } else {
        setActiveOrder(data);
        setOrdersList([data]);
      }
    } catch (err: any) {
      setActiveOrder(null);
      setOrdersList([]);
      setError(err.response?.data?.message || 'No order found with this order number or phone number.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderParam) {
      setSearchInput(initialOrderParam);
      fetchOrder(initialOrderParam);
    }
  }, [initialOrderParam]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    router.replace(`/track-order?order=${encodeURIComponent(searchInput.trim())}`);
    fetchOrder(searchInput.trim());
  };

  const handleCopy = () => {
    if (!activeOrder?.orderNumber) return;
    navigator.clipboard.writeText(activeOrder.orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentStep = activeOrder ? getStepIndex(activeOrder.status) : 0;
  const isCancelled = activeOrder?.status === 'cancelled';

  return (
    <div className="min-h-screen bg-brand-black pt-24 pb-16">
      <div className="container-bb max-w-3xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <p className="eyebrow-bb mb-2">Live Order Status</p>
          <h1 className="heading-page text-brand-cream uppercase mb-3">TRACK YOUR ORDER</h1>
          <p className="text-brand-cream/60 text-sm sm:text-base max-w-lg mx-auto">
            Search by your <strong className="text-brand-yellow font-medium">Order Number</strong> or your{' '}
            <strong className="text-brand-yellow font-medium">Phone Number</strong> to track live progress.
          </p>
        </div>

        {/* Search Input Bar */}
        <div className="card-bb p-4 sm:p-5 mb-8 bg-brand-surface border-brand-border">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-cream/40" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter Order Number (e.g. BB-20260917-2628) or Phone (e.g. 01838971544)"
                className="w-full bg-brand-surface-light border border-brand-border rounded-lg pl-10 pr-4 py-3 text-brand-cream text-sm placeholder-brand-cream/35 focus:outline-none focus:border-brand-yellow transition-colors font-medium"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !searchInput.trim()}
              className="btn-primary !h-11 px-6 text-xs gap-2 shrink-0 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>TRACK</span>
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-brand-border/60 text-xs text-brand-cream/40">
            <span className="flex items-center gap-1">
              <Hash size={12} className="text-brand-yellow" />
              <span>Order Number: <strong>BB-XXXX</strong></span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Phone size={12} className="text-brand-yellow" />
              <span>Mobile Phone: <strong>01XXXXXXXXX</strong></span>
            </span>
          </div>
        </div>

        {/* Multi-Order Selector Pills (if phone search found multiple orders) */}
        {ordersList.length > 1 && (
          <div className="card-bb p-4 mb-6 bg-brand-surface border-brand-border">
            <p className="text-xs text-brand-cream/60 font-semibold mb-2">
              Found {ordersList.length} orders for this search. Select one to view:
            </p>
            <div className="flex flex-wrap gap-2">
              {ordersList.map((ord) => (
                <button
                  key={ord._id}
                  onClick={() => setActiveOrder(ord)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 border',
                    activeOrder?._id === ord._id
                      ? 'bg-brand-yellow text-brand-black border-brand-yellow font-bold'
                      : 'bg-brand-surface-light text-brand-cream/70 border-brand-border hover:border-brand-yellow/40 hover:text-brand-cream'
                  )}
                >
                  <span>#{ord.orderNumber}</span>
                  <span
                    className={cn(
                      'text-[10px] uppercase px-1.5 py-0.2 rounded font-extrabold',
                      ord.status === 'delivered' ? 'bg-green-500/20 text-green-700' : 'bg-black/20 text-black'
                    )}
                  >
                    {ord.status}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="card-bb p-6 text-center border-red-500/20 bg-red-500/5 mb-8">
            <XCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <h3 className="text-brand-cream font-bold text-base mb-1">No Orders Found</h3>
            <p className="text-brand-cream/60 text-xs sm:text-sm max-w-md mx-auto mb-4">{error}</p>
            <p className="text-brand-cream/40 text-xs">
              Need assistance? Call our direct hotline at{' '}
              <a href="tel:+8801627817436" className="text-brand-yellow underline">
                +880 1627-817436
              </a>
            </p>
          </div>
        )}

        {/* Order Details Card */}
        {activeOrder && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="space-y-6"
          >
            {/* Status Highlight Banner */}
            <div className="card-bb p-6 sm:p-8 bg-brand-surface-light border-brand-border">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-border">
                <div>
                  <p className="text-xs text-brand-cream/50 uppercase tracking-wider font-semibold">Order ID</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-brand-yellow font-extrabold text-xl sm:text-2xl tracking-wide">
                      #{activeOrder.orderNumber}
                    </span>
                    <button
                      onClick={handleCopy}
                      className="p-1 text-brand-cream/50 hover:text-brand-yellow transition-colors"
                      title="Copy Order Number"
                      aria-label="Copy order number"
                    >
                      {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => setInvoiceModalOpen(true)}
                    className="btn-secondary !h-9 px-3 text-xs gap-1.5 border-brand-yellow/30 hover:border-brand-yellow text-brand-yellow"
                    title="View & Print Official Invoice"
                  >
                    <Receipt size={13} />
                    <span>View Invoice</span>
                  </button>

                  <button
                    onClick={() => fetchOrder(activeOrder.orderNumber)}
                    className="btn-secondary !h-9 px-3 text-xs gap-1.5"
                    title="Refresh status"
                  >
                    <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                    <span>Refresh</span>
                  </button>

                  <div className="text-right sm:text-right">
                    <span
                      className={cn(
                        'inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider',
                        activeOrder.status === 'delivered' && 'bg-green-500/15 text-green-400 border border-green-500/30',
                        activeOrder.status === 'cancelled' && 'bg-red-500/15 text-red-400 border border-red-500/30',
                        activeOrder.status !== 'delivered' &&
                          activeOrder.status !== 'cancelled' &&
                          'bg-brand-yellow/15 text-brand-yellow border border-brand-yellow/30'
                      )}
                    >
                      {activeOrder.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stepper Progress */}
              {!isCancelled ? (
                <div className="py-8">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-2 relative">
                    {statusSteps.map((step, idx) => {
                      const Icon = step.icon;
                      const isPassed = currentStep >= idx;
                      const isCurrent = currentStep === idx;

                      return (
                        <div key={step.key} className="flex flex-col items-center text-center relative z-10">
                          <div
                            className={cn(
                              'w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all duration-300',
                              isPassed
                                ? 'bg-brand-yellow text-brand-black shadow-md font-bold'
                                : 'bg-brand-surface border border-brand-border text-brand-cream/30',
                              isCurrent && 'ring-4 ring-brand-yellow/20 animate-pulse'
                            )}
                          >
                            {isPassed && !isCurrent && currentStep > idx ? (
                              <CheckCircle2 size={22} />
                            ) : (
                              <Icon size={22} />
                            )}
                          </div>
                          <p
                            className={cn(
                              'text-xs font-bold uppercase tracking-wider mb-0.5',
                              isPassed ? 'text-brand-cream' : 'text-brand-cream/40'
                            )}
                          >
                            {step.label}
                          </p>
                          <p className="text-[11px] text-brand-cream/40 max-w-[140px] leading-tight hidden sm:block">
                            {step.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center bg-red-500/5 rounded-xl border border-red-500/20 my-4">
                  <p className="text-red-400 font-bold text-sm">This order was cancelled.</p>
                  <p className="text-xs text-brand-cream/50 mt-1">
                    Please contact our support hotline for any questions or re-orders.
                  </p>
                </div>
              )}

              {/* Order Meta Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-brand-border text-xs">
                <div className="p-3 rounded-lg bg-brand-surface border border-brand-border">
                  <span className="text-brand-cream/50 block mb-0.5">Order Type</span>
                  <span className="text-brand-cream font-semibold uppercase">{activeOrder.orderType}</span>
                </div>
                <div className="p-3 rounded-lg bg-brand-surface border border-brand-border">
                  <span className="text-brand-cream/50 block mb-0.5">Payment</span>
                  <span className="text-brand-cream font-semibold uppercase">
                    {activeOrder.paymentMethod} ({activeOrder.paymentStatus || 'Pending'})
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-brand-surface border border-brand-border">
                  <span className="text-brand-cream/50 block mb-0.5">Placed At</span>
                  <span className="text-brand-cream font-semibold">
                    {new Date(activeOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })},{' '}
                    {new Date(activeOrder.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Ordered Items List */}
            <div className="card-bb p-6 sm:p-8 bg-brand-surface-light border-brand-border">
              <h3 className="text-sm font-bold uppercase tracking-wider text-brand-cream mb-4 flex items-center gap-2">
                <Utensils className="w-4 h-4 text-brand-yellow" />
                <span>Items in this Order ({activeOrder.items.length})</span>
              </h3>

              <div className="divide-y divide-brand-border">
                {activeOrder.items.map((item) => (
                  <div key={item._id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover bg-brand-surface shrink-0 border border-white/5"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-brand-surface flex items-center justify-center shrink-0 text-brand-cream/20">
                          <Utensils size={18} />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-brand-cream text-sm font-semibold truncate">{item.name}</p>
                        <p className="text-xs text-brand-cream/50">
                          Qty: <span className="text-brand-cream font-bold">{item.quantity}</span> × ৳{item.price}
                        </p>
                        {item.specialInstructions && (
                          <p className="text-brand-cream/40 text-[11px] italic truncate mt-0.5">
                            Note: {item.specialInstructions}
                          </p>
                        )}
                      </div>
                    </div>

                    <span className="text-brand-yellow font-bold text-sm shrink-0">
                      ৳{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 mt-4 border-t border-brand-border space-y-1.5 text-xs">
                <div className="flex justify-between text-brand-cream/60">
                  <span>Subtotal</span>
                  <span className="text-brand-cream font-medium">৳{Math.max(0, activeOrder.totalAmount - (activeOrder.deliveryFee || 0))}</span>
                </div>
                <div className="flex justify-between text-brand-cream/60">
                  <span>Delivery Fee</span>
                  {activeOrder.deliveryFee && activeOrder.deliveryFee > 0 ? (
                    <span className="text-brand-cream font-medium">৳{activeOrder.deliveryFee}</span>
                  ) : (
                    <span className="text-emerald-400 font-bold">Free</span>
                  )}
                </div>
                <div className="pt-2 border-t border-brand-border/60 flex justify-between items-baseline">
                  <span className="text-sm font-bold uppercase tracking-wider text-brand-cream">Total Amount</span>
                  <span className="text-brand-yellow font-extrabold text-xl">৳{activeOrder.totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Destination & Live Support */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Destination */}
              <div className="card-bb p-5 bg-brand-surface border-brand-border flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-cream/60 mb-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-brand-yellow" />
                    <span>{activeOrder.orderType === 'delivery' ? 'Delivery Destination' : 'Pickup Kitchen'}</span>
                  </h4>
                  <p className="text-brand-cream font-semibold text-sm">{activeOrder.customer.name}</p>
                  <p className="text-brand-cream/70 text-xs mt-1">Phone: {activeOrder.customer.phone}</p>
                  {activeOrder.customer.address && (
                    <p className="text-brand-cream/60 text-xs mt-1 leading-relaxed">
                      {[
                        activeOrder.customer.address.street,
                        activeOrder.customer.address.area,
                        activeOrder.customer.address.city,
                        activeOrder.customer.address.landmark ? `(Near: ${activeOrder.customer.address.landmark})` : '',
                      ]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  )}
                </div>
              </div>

              {/* Live Support */}
              <div className="card-bb p-5 bg-brand-surface border-brand-border flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-cream/60 mb-2">Need Help?</h4>
                  <p className="text-xs text-brand-cream/60 mb-4 leading-relaxed">
                    Have any questions regarding food preparation, delivery time, or location?
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="tel:+8801627817436"
                    className="btn-secondary !h-9 text-xs justify-center gap-1.5"
                  >
                    <Phone size={13} />
                    <span>Call Us</span>
                  </a>
                  <a
                    href="https://wa.me/8801627817436"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary !h-9 text-xs justify-center gap-1.5"
                  >
                    <MessageSquare size={13} />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Rate & Review Experience Banner */}
            <div className="card-bb p-6 bg-brand-surface-light border-brand-yellow/30 text-center space-y-3">
              <div className="inline-flex items-center gap-1 text-brand-yellow">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={16} className="fill-brand-yellow" />
                ))}
              </div>
              <h4 className="text-base font-bold text-brand-cream uppercase">
                How was your Brother&apos;s Bites Experience?
              </h4>
              <p className="text-xs text-brand-cream/60 max-w-md mx-auto">
                Loved your food or have feedback for our kitchen? Rate your meal and let other beach foodies know!
              </p>
              <div>
                <button
                  onClick={() => setReviewModalOpen(true)}
                  className="btn-primary !h-10 px-6 text-xs gap-2 inline-flex"
                >
                  <Star size={14} />
                  <span>WRITE A QUICK REVIEW</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Review Modal */}
        {activeOrder && (
          <ReviewModal
            isOpen={reviewModalOpen}
            onClose={() => setReviewModalOpen(false)}
            initialOrderNumber={activeOrder.orderNumber}
            initialDish={activeOrder.items?.[0]?.name || ''}
          />
        )}

        {/* Invoice Modal */}
        {activeOrder && (
          <InvoiceModal
            isOpen={invoiceModalOpen}
            onClose={() => setInvoiceModalOpen(false)}
            order={activeOrder}
          />
        )}
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-black pt-24 text-center text-brand-cream/50">Loading order tracker...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
