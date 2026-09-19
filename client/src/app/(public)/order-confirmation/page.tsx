'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, MapPin, Phone, Receipt, Loader2, Navigation } from 'lucide-react';
import api from '@/lib/api';
import InvoiceModal, { InvoiceOrderData } from '@/components/orders/InvoiceModal';

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order');
  const [order, setOrder] = useState<InvoiceOrderData | null>(null);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!orderNumber) return;
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/orders/track/${encodeURIComponent(orderNumber)}`);
        const data = res.data.data;
        if (data.order) setOrder(data.order);
        else if (data.orders?.[0]) setOrder(data.orders[0]);
        else if (data._id || data.orderNumber) setOrder(data);
      } catch {
        // silent fallback
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [orderNumber]);

  if (!orderNumber) {
    return (
      <div className="min-h-screen bg-brand-black pt-24 pb-16">
        <div className="container-bb max-w-2xl mx-auto text-center py-20">
          <p className="text-brand-cream/50">No order found</p>
          <Link href="/menu" className="btn-primary mt-4 inline-flex">Browse Menu</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-black pt-24 pb-16">
      <div className="container-bb max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-brand-cream mb-2">Order Placed!</h1>
          <p className="text-brand-cream/50 mb-6">Your order has been received successfully</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-brand-surface-light rounded-xl border border-white/10 p-6 sm:p-8"
        >
          <div className="text-center mb-6">
            <p className="text-brand-cream/50 text-sm mb-1">Order Number</p>
            <p className="text-brand-yellow font-bold text-2xl tracking-wider">#{orderNumber}</p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3 p-3 bg-brand-surface rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-brand-cream text-sm font-medium">Order Received!</p>
                <p className="text-brand-cream/50 text-xs mt-1">
                  We will confirm your order shortly via phone. Please keep your phone accessible.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-brand-surface rounded-lg">
              <MapPin className="w-5 h-5 text-brand-yellow shrink-0 mt-0.5" />
              <div>
                <p className="text-brand-cream text-sm font-medium">Payment</p>
                <p className="text-brand-cream/50 text-xs mt-1">
                  Cash on delivery/pickup. Please keep the exact amount ready.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-brand-surface rounded-lg">
              <Phone className="w-5 h-5 text-brand-yellow shrink-0 mt-0.5" />
              <div>
                <p className="text-brand-cream text-sm font-medium">Need help?</p>
                <p className="text-brand-cream/50 text-xs mt-1">
                  Call us at +880 1627-817436 for any order-related queries.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Invoice Receipt Action */}
          {order && (
            <div className="p-3.5 bg-brand-surface rounded-lg border border-brand-yellow/20 flex items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-yellow/10 text-brand-yellow flex items-center justify-center shrink-0">
                  <Receipt size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-brand-cream">Tax Invoice & Receipt Ready</p>
                  <p className="text-[11px] text-brand-cream/50">Official receipt with item breakdown (৳{order.totalAmount})</p>
                </div>
              </div>
              <button
                onClick={() => setInvoiceOpen(true)}
                className="btn-primary !h-8 px-3 text-[11px] gap-1.5 shrink-0"
              >
                <Receipt size={13} />
                <span>View Invoice</span>
              </button>
            </div>
          )}

          <p className="text-brand-cream/40 text-xs text-center">
            You will receive a delivery confirmation notification & invoice once your order is safely delivered to your hands.
          </p>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center">
          <Link
            href={`/track-order?order=${encodeURIComponent(orderNumber)}`}
            className="btn-primary justify-center gap-2"
          >
            <Navigation size={15} />
            <span>TRACK YOUR ORDER LIVE</span>
          </Link>
          {order && (
            <button
              onClick={() => setInvoiceOpen(true)}
              className="btn-secondary justify-center gap-2 border-brand-yellow/30 text-brand-yellow"
            >
              <Receipt size={15} />
              <span>PRINT INVOICE</span>
            </button>
          )}
          <Link href="/menu" className="btn-secondary justify-center">
            ORDER MORE
          </Link>
        </div>

        {/* Invoice Modal */}
        {order && (
          <InvoiceModal
            isOpen={invoiceOpen}
            onClose={() => setInvoiceOpen(false)}
            order={order}
          />
        )}
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-black pt-24 text-center text-brand-cream/50">Loading...</div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
