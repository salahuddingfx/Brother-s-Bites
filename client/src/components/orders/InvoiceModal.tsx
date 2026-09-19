'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Printer,
  X,
  Check,
  Copy,
  Receipt,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  ShieldCheck,
} from 'lucide-react';

export interface InvoiceOrderData {
  orderNumber: string;
  createdAt: string | Date;
  status: string;
  paymentMethod: string;
  paymentStatus?: string;
  orderType: string;
  deliveryFee?: number;
  totalAmount: number;
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
  items: Array<{
    _id?: string;
    name: string;
    price: number;
    quantity: number;
    specialInstructions?: string;
  }>;
  specialNotes?: string;
}

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: InvoiceOrderData | null;
}

export default function InvoiceModal({ isOpen, onClose, order }: InvoiceModalProps) {
  const [copied, setCopied] = useState(false);

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const text = `BROTHER'S BITES - OFFICIAL INVOICE
Order ID: #${order.orderNumber}
Date: ${new Date(order.createdAt).toLocaleString()}
Customer: ${order.customer.name} (${order.customer.phone})
Status: ${order.status.toUpperCase()}
Total: ৳${order.totalAmount}
Payment: ${order.paymentMethod.toUpperCase()}

Items:
${order.items.map((it) => `- ${it.name} x${it.quantity} = ৳${it.price * it.quantity}`).join('\n')}

Sonar Para Beach, Marine Drive, Cox's Bazar
Phone: +880 1627-817436`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-BD', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const fullAddress = order.customer.address
    ? [
        order.customer.address.street,
        order.customer.address.area,
        order.customer.address.city,
        order.customer.address.landmark ? `(Near: ${order.customer.address.landmark})` : '',
      ]
        .filter(Boolean)
        .join(', ')
    : 'Beachside Delivery / Pickup';

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm print:hidden"
          />

          {/* Modal Container */}
          <motion.div
            id="printable-invoice-container"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl bg-white text-slate-900 rounded-2xl shadow-2xl z-10 overflow-hidden my-auto border border-slate-200 print:border-none print:shadow-none print:m-0 print:p-0 print:w-full print:max-w-full"
          >
            {/* Top Toolbar (Hidden when printing) */}
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800 print:hidden">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-sm tracking-wide">Customer Invoice & Receipt</span>
                <span className="text-xs bg-amber-400/20 text-amber-300 font-semibold px-2 py-0.5 rounded ml-1">
                  #{order.orderNumber}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopySummary}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  title="Copy invoice text"
                >
                  {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                  title="Print or Save as PDF"
                >
                  <Printer size={14} />
                  <span>Print / Save PDF</span>
                </button>

                <button
                  onClick={onClose}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors ml-1"
                  aria-label="Close invoice"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Printable Receipt Body */}
            <div id="printable-invoice" className="p-6 sm:p-8 bg-white text-slate-800 print:p-4 print:text-black">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-400 flex items-center justify-center font-black text-slate-950 text-xl shadow-sm">
                    BB
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-950 tracking-tight uppercase">
                      Brother&apos;s Bites
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Beachside Flavors & Fast Food Restaurant
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin size={11} className="text-amber-500" />
                      <span>Sonar Para Beach, Marine Drive, Cox&apos;s Bazar</span>
                    </p>
                  </div>
                </div>

                <div className="sm:text-right">
                  <div className="inline-block bg-slate-100 text-slate-800 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider mb-1">
                    OFFICIAL INVOICE
                  </div>
                  <p className="text-xs font-bold text-slate-950">
                    Order ID: <span className="font-mono text-amber-600">#{order.orderNumber}</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center sm:justify-end gap-1">
                    <Calendar size={11} />
                    <span>{formattedDate}</span>
                  </p>
                </div>
              </div>

              {/* Customer & Order Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-5 border-b border-slate-200 text-xs">
                {/* Customer Information */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Billed To / Customer
                  </p>
                  <p className="font-bold text-slate-900 text-sm">{order.customer.name}</p>
                  <p className="text-slate-600 flex items-center gap-1 mt-1 font-mono">
                    <Phone size={11} className="text-amber-600" />
                    <span>{order.customer.phone}</span>
                  </p>
                  {order.customer.email && (
                    <p className="text-slate-500 text-[11px] mt-0.5">{order.customer.email}</p>
                  )}
                  <p className="text-slate-600 mt-1 leading-relaxed text-[11px]">
                    <strong>Destination:</strong> {fullAddress}
                  </p>
                </div>

                {/* Order Status & Payment */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Order & Payment Details
                  </p>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Order Type:</span>
                      <span className="font-bold text-slate-800 uppercase bg-white px-2 py-0.5 rounded border border-slate-200">
                        {order.orderType}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Order Status:</span>
                      <span className="font-bold uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {order.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Payment:</span>
                      <span className="font-bold text-slate-800 uppercase flex items-center gap-1">
                        <CreditCard size={11} className="text-slate-500" />
                        <span>{order.paymentMethod}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Itemized Table */}
              <div className="py-4">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b-2 border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-2.5 text-left">Item Description</th>
                      <th className="py-2.5 text-center w-16">Qty</th>
                      <th className="py-2.5 text-right w-24">Unit Price</th>
                      <th className="py-2.5 text-right w-24">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {order.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-3 text-left">
                          <p className="font-bold text-slate-900">{item.name}</p>
                          {item.specialInstructions && (
                            <p className="text-[10px] text-slate-500 italic mt-0.5">
                              Note: {item.specialInstructions}
                            </p>
                          )}
                        </td>
                        <td className="py-3 text-center font-bold text-slate-700">
                          {item.quantity}
                        </td>
                        <td className="py-3 text-right text-slate-600 font-mono">
                          ৳{item.price}
                        </td>
                        <td className="py-3 text-right font-bold text-slate-900 font-mono">
                          ৳{item.price * item.quantity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total Calculation Card */}
              <div className="border-t-2 border-slate-200 pt-4 flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="text-xs text-slate-500 max-w-xs space-y-1">
                  <p className="flex items-center gap-1 font-semibold text-slate-700">
                    <ShieldCheck size={14} className="text-emerald-600" />
                    <span>Verified Brother&apos;s Bites Order</span>
                  </p>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Thank you for dining with Brother&apos;s Bites at Marine Drive! For any queries or repeat orders, please call +880 1627-817436.
                  </p>
                </div>

                <div className="w-full sm:w-64 bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-mono">৳{Math.max(0, order.totalAmount - (order.deliveryFee || 0))}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Delivery Charge:</span>
                    {order.deliveryFee && order.deliveryFee > 0 ? (
                      <span className="font-mono text-slate-900 font-bold">৳{order.deliveryFee}</span>
                    ) : (
                      <span className="font-mono text-emerald-600 font-bold">FREE / Pickup</span>
                    )}
                  </div>
                  <div className="border-t border-slate-200 pt-2 flex justify-between items-baseline font-black text-slate-950 text-base">
                    <span>Grand Total:</span>
                    <span className="text-amber-600 font-mono text-lg">৳{order.totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* Receipt Footer */}
              <div className="mt-8 pt-4 border-t border-dashed border-slate-200 text-center text-[10px] text-slate-400">
                <p className="font-semibold text-slate-600">BROTHER&apos;S BITES • COX&apos;S BAZAR</p>
                <p className="mt-0.5">Marine Drive, Sonar Para Beach • Hotline: +880 1627-817436</p>
                <p className="mt-1">Computer-generated official digital tax receipt & invoice</p>
              </div>
            </div>

            {/* Bottom Modal Actions (Hidden when printing) */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
              <p className="text-xs text-slate-500 text-center sm:text-left">
                Need a paper copy? Click <strong>Print / Save PDF</strong> above or below.
              </p>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={onClose}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={handlePrint}
                  className="flex-1 sm:flex-none px-5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 transition-colors shadow"
                >
                  <Printer size={14} />
                  <span>Print Invoice</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
