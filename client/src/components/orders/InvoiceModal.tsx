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
  Tag,
  Lock,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';

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

export type ThermalFormat = 'thermal_2inch' | 'thermal_mini';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: InvoiceOrderData | null;
  canPrint?: boolean; // Only true for staff/admin, false for customers
}

export default function InvoiceModal({
  isOpen,
  onClose,
  order,
  canPrint = false,
}: InvoiceModalProps) {
  const [copied, setCopied] = useState(false);
  const [thermalFormat, setThermalFormat] = useState<ThermalFormat>('thermal_2inch');

  if (!order) return null;

  const handlePrint = (format: ThermalFormat) => {
    if (!canPrint) return;

    // Inject dynamic @page rule for thermal printer
    let styleEl = document.getElementById('dynamic-thermal-page-style') as HTMLStyleElement;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'dynamic-thermal-page-style';
      document.head.appendChild(styleEl);
    }

    if (format === 'thermal_mini') {
      styleEl.innerHTML = `@page { size: 1.75in 2in; margin: 0mm; }`;
    } else {
      styleEl.innerHTML = `@page { size: 58mm auto; margin: 0mm; }`;
    }

    window.print();
  };

  const handleCopySummary = () => {
    const text = `*** BROTHER'S BITES ***
Order: #${order.orderNumber}
Date: ${new Date(order.createdAt).toLocaleString()}
Customer: ${order.customer.name} (${order.customer.phone})
Type: ${order.orderType.toUpperCase()}
Status: ${order.status.toUpperCase()}
Total: ৳${order.totalAmount}
Payment: ${order.paymentMethod.toUpperCase()}

Items:
${order.items.map((it) => `- ${it.name} x${it.quantity} = ৳${it.price * it.quantity}`).join('\n')}

Marine Drive, Sonar Para Beach, Cox's Bazar
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
    : 'Beachside Counter / Pickup';

  const subtotal = Math.max(0, order.totalAmount - (order.deliveryFee || 0));

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
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl bg-brand-surface border border-white/10 text-brand-cream rounded-2xl shadow-2xl z-10 overflow-hidden my-auto print:border-none print:shadow-none print:m-0 print:p-0 print:w-auto print:bg-white print:text-black"
          >
            {/* Top Toolbar (Hidden when printing) */}
            <div className="bg-brand-surface-light px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 print:hidden">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-brand-yellow" />
                <span className="font-bold text-sm tracking-wide text-brand-cream">
                  {canPrint ? 'Thermal POS Cashier Invoice' : 'Customer Digital Receipt'}
                </span>
                <span className="text-xs bg-brand-yellow/15 text-brand-yellow font-mono font-bold px-2 py-0.5 rounded border border-brand-yellow/30 ml-1">
                  #{order.orderNumber}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Format Switcher (Staff / Admin Only) */}
                {canPrint && (
                  <div className="flex items-center bg-black/40 p-1 rounded-lg border border-white/10 text-xs">
                    <button
                      type="button"
                      onClick={() => setThermalFormat('thermal_2inch')}
                      className={cn(
                        'px-2.5 py-1 rounded font-medium transition-colors flex items-center gap-1.5',
                        thermalFormat === 'thermal_2inch'
                          ? 'bg-brand-yellow text-slate-950 font-bold'
                          : 'text-brand-cream/60 hover:text-brand-cream'
                      )}
                    >
                      <Receipt size={12} />
                      <span>2&quot; POS (58mm)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setThermalFormat('thermal_mini')}
                      className={cn(
                        'px-2.5 py-1 rounded font-medium transition-colors flex items-center gap-1.5',
                        thermalFormat === 'thermal_mini'
                          ? 'bg-brand-yellow text-slate-950 font-bold'
                          : 'text-brand-cream/60 hover:text-brand-cream'
                      )}
                    >
                      <Tag size={12} />
                      <span>1.75&quot; × 2&quot; Label</span>
                    </button>
                  </div>
                )}

                <button
                  onClick={handleCopySummary}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-brand-cream text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/10"
                  title="Copy invoice summary"
                >
                  {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                {/* Print Button - Only for Staff / Admin */}
                {canPrint ? (
                  <>
                    <a
                      href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/orders/${order.orderNumber}/thermal?format=${thermalFormat === 'thermal_mini' ? 'mini' : '2inch'}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-brand-cream/80 hover:text-brand-cream text-xs font-semibold flex items-center gap-1 transition-colors border border-white/10"
                      title="Open Server Thermal Print View"
                    >
                      <ExternalLink size={13} />
                      <span className="hidden sm:inline">Server URL</span>
                    </a>
                    <button
                      onClick={() => handlePrint(thermalFormat)}
                      className="px-3.5 py-1.5 rounded-lg bg-brand-yellow hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 transition-colors shadow-sm"
                      title="Print to Thermal POS Printer"
                    >
                      <Printer size={14} />
                      <span>Print ({thermalFormat === 'thermal_2inch' ? '2" POS' : '1.75" Label'})</span>
                    </button>
                  </>
                ) : (
                  <div
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] text-brand-cream/50"
                    title="Customer Digital View"
                  >
                    <Lock size={11} className="text-amber-400" />
                    <span>Digital View</span>
                  </div>
                )}

                <button
                  onClick={onClose}
                  className="p-1.5 text-brand-cream/60 hover:text-brand-cream rounded-lg hover:bg-white/5 transition-colors ml-1"
                  aria-label="Close invoice modal"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body Container */}
            <div className="p-4 sm:p-6 max-h-[75vh] overflow-y-auto flex flex-col items-center">
              {/* Customer View Notice Banner if customer */}
              {!canPrint && (
                <div className="w-full mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs text-brand-cream/80">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-brand-yellow shrink-0" />
                    <span>
                      Official Digital Customer Invoice. <em>(Thermal paper receipt printed at restaurant counter)</em>
                    </span>
                  </div>
                </div>
              )}

              {/* Thermal Paper Simulation Container */}
              <div
                id="printable-thermal-receipt"
                className={cn(
                  'bg-white text-black p-4 font-mono shadow-2xl rounded-sm transition-all duration-200 border border-slate-300 relative',
                  thermalFormat === 'thermal_2inch' ? 'thermal-receipt-2in w-[320px] max-w-full' : 'thermal-receipt-mini w-[260px] max-w-full'
                )}
                style={{
                  fontFamily: '"JetBrains Mono", "Courier New", Courier, monospace',
                }}
              >
                {/* 2" Thermal Receipt Template */}
                {thermalFormat === 'thermal_2inch' ? (
                  <div className="space-y-2 text-[11px] leading-tight select-text text-black">
                    {/* Header */}
                    <div className="text-center pb-1 border-b border-dashed border-black">
                      <p className="font-black text-sm tracking-tighter uppercase">*** BROTHER&apos;S BITES ***</p>
                      <p className="text-[10px]">Marine Drive, Sonar Para Beach</p>
                      <p className="text-[10px]">Cox&apos;s Bazar · 01627-817436</p>
                      <p className="text-[10px] font-bold mt-0.5">** CASHIER TAX INVOICE **</p>
                    </div>

                    {/* Order Meta */}
                    <div className="text-[10px] space-y-0.5 pt-1 border-b border-dashed border-black pb-1">
                      <div className="flex justify-between">
                        <span>ORDER: <strong className="font-bold">#{order.orderNumber}</strong></span>
                        <span className="font-bold uppercase">[{order.orderType}]</span>
                      </div>
                      <div className="flex justify-between text-[9px] text-gray-700">
                        <span>DATE: {formattedDate}</span>
                        <span>STATUS: {order.status.toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between text-[10px] pt-0.5">
                        <span>CUSTOMER:</span>
                        <span className="font-bold truncate max-w-[150px]">{order.customer.name}</span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span>PHONE:</span>
                        <span>{order.customer.phone}</span>
                      </div>
                      {order.customer.address?.street && (
                        <p className="text-[9px] text-gray-600 truncate">
                          ADDR: {fullAddress}
                        </p>
                      )}
                    </div>

                    {/* Items Table */}
                    <div className="pt-1 pb-1 border-b border-dashed border-black">
                      <div className="flex justify-between text-[10px] font-bold pb-1 border-b border-black">
                        <span className="w-1/2 text-left">ITEM</span>
                        <span className="w-1/6 text-center">QTY</span>
                        <span className="w-1/3 text-right">TOTAL</span>
                      </div>
                      <div className="space-y-1 pt-1">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="text-[10px]">
                            <div className="flex justify-between items-start">
                              <span className="w-1/2 font-semibold truncate pr-1">{item.name}</span>
                              <span className="w-1/6 text-center">x{item.quantity}</span>
                              <span className="w-1/3 text-right font-bold">৳{item.price * item.quantity}</span>
                            </div>
                            {item.specialInstructions && (
                              <p className="text-[9px] italic text-gray-700 pl-1">
                                &gt; {item.specialInstructions}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Total Summary */}
                    <div className="space-y-0.5 text-[10px] pt-1">
                      <div className="flex justify-between">
                        <span>SUBTOTAL:</span>
                        <span>৳{subtotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>DELIVERY FEE:</span>
                        <span>{order.deliveryFee && order.deliveryFee > 0 ? `৳${order.deliveryFee}` : '৳0 (FREE)'}</span>
                      </div>
                      <div className="flex justify-between text-xs font-black pt-1 border-t border-black">
                        <span>GRAND TOTAL:</span>
                        <span className="text-sm">৳{order.totalAmount}</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold pt-0.5">
                        <span>PAYMENT:</span>
                        <span className="uppercase">{order.paymentMethod} {order.paymentStatus ? `(${order.paymentStatus})` : ''}</span>
                      </div>
                    </div>

                    {/* Barcode & Footer */}
                    <div className="text-center pt-2 border-t border-dashed border-black space-y-1">
                      <div className="font-mono text-[9px] tracking-widest bg-gray-100 py-0.5 border border-gray-300">
                        * {order.orderNumber} *
                      </div>
                      <p className="text-[9px] font-bold">*** THANK YOU! VISIT AGAIN ***</p>
                      <p className="text-[8px] text-gray-600">Taste the Brotherhood by the Beach</p>
                    </div>
                  </div>
                ) : (
                  /* 1.75" x 2" Compact Sticker / Label Template */
                  <div className="space-y-1 text-[9px] leading-tight select-text text-black">
                    <div className="text-center border-b border-black pb-0.5">
                      <p className="font-black text-[11px] uppercase tracking-tighter">BROTHER&apos;S BITES</p>
                      <div className="flex justify-between text-[8px] font-bold">
                        <span>#{order.orderNumber}</span>
                        <span className="uppercase">[{order.orderType}]</span>
                      </div>
                    </div>

                    <div className="text-[8px] space-y-0.5 py-0.5 border-b border-dashed border-black">
                      <div className="flex justify-between">
                        <span className="font-bold truncate max-w-[130px]">{order.customer.name}</span>
                        <span>{order.customer.phone}</span>
                      </div>
                    </div>

                    {/* Compact Item List */}
                    <div className="space-y-0.5 text-[8.5px] py-0.5 border-b border-black font-semibold">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span className="truncate max-w-[160px]">{item.name}</span>
                          <span>x{item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {/* Bottom Total */}
                    <div className="flex justify-between items-baseline text-[10px] font-black pt-0.5">
                      <span>TOTAL:</span>
                      <span>৳{order.totalAmount} ({order.paymentMethod.toUpperCase()})</span>
                    </div>

                    <p className="text-[7.5px] text-center text-gray-600 pt-0.5 border-t border-dashed border-gray-400">
                      Sonar Para Beach • Marine Drive
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="bg-brand-surface-light px-6 py-3.5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
              <p className="text-xs text-brand-cream/60">
                {canPrint ? (
                  <span>
                    Format: <strong>{thermalFormat === 'thermal_2inch' ? '2" POS Standard (58mm)' : '1.75" × 2" Mini Label'}</strong>
                  </span>
                ) : (
                  <span>Official Brother&apos;s Bites Digital Receipt</span>
                )}
              </p>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={onClose}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-brand-cream text-xs font-bold transition-colors border border-white/10"
                >
                  Close
                </button>
                {canPrint && (
                  <button
                    onClick={() => handlePrint(thermalFormat)}
                    className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-brand-yellow hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 transition-colors shadow"
                  >
                    <Printer size={14} />
                    <span>Print Thermal Receipt</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
