'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  Search,
  ChevronDown,
  Phone,
  MessageSquare,
  Sparkles,
  Utensils,
  MapPin,
  Clock,
  CreditCard,
  Truck,
  Heart,
  ExternalLink,
  Share2,
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: 'food' | 'location' | 'orders' | 'payment' | 'dining';
  icon: any;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "Where exactly is Brother's Bites located on Marine Drive?",
    answer: "We are situated directly along the scenic Marine Drive highway right at Sonar Para Beach, Cox's Bazar (towards the Inani coastal route). Look for our glowing Brother's Bites beachside stand overlooking the ocean sunset! You can open live GPS navigation directly via Google Maps.",
    category: 'location',
    icon: MapPin,
  },
  {
    question: "What are your operating hours throughout the week?",
    answer: "We are open 7 days a week for beach lovers: Sunday through Thursday from 3:00 PM to 12:00 AM (Midnight), and Friday through Saturday from 10:00 AM to 12:00 AM (Midnight) for morning and daytime beach crowds.",
    category: 'dining',
    icon: Clock,
  },
  {
    question: "What are Brother's Bites' signature specialties?",
    answer: "Our crowd favorites include hot Steamed Chicken Momos with fiery red garlic chili chutney, crispy Fried Momos, Crunchy Naga & Dahi Fuchka, Golden Chicken Popcorn, Crispy Shrimp Fries, and our authentic Special Masala Caramel Matka Tea brewed fresh by the coastal breeze.",
    category: 'food',
    icon: Utensils,
  },
  {
    question: "Is all the food 100% Halal and hygienically prepared?",
    answer: "Yes, absolutely! All our poultry, meats, and seafood are 100% Halal certified, and we follow strict kitchen hygiene standards with fresh ingredients sourced daily for pure taste and safety.",
    category: 'food',
    icon: Sparkles,
  },
  {
    question: "Can I preorder food or reserve food for large tour groups/picnics?",
    answer: "Yes! For tour groups, family gatherings, or beach sunset preorders, you can place an advance order directly through our website, WhatsApp hotline (+880 1627-817436), or by calling us. We will have your hot momos and snacks freshly prepared on time.",
    category: 'orders',
    icon: Truck,
  },
  {
    question: "What payment methods do you accept at the stall and online?",
    answer: "We accept Cash on Delivery / Counter, bKash Personal & Merchant, Nagad, and Rocket mobile banking. You can easily pay with QR scan or direct cash when receiving your food.",
    category: 'payment',
    icon: CreditCard,
  },
  {
    question: "Do you offer delivery to nearby Marine Drive resorts and hotels?",
    answer: "Yes, we provide coastal delivery to nearby beach resorts, guest houses, and hotels in the Sonar Para, Inani, and Marine Drive zone. Enter your delivery address during online checkout or WhatsApp our delivery team.",
    category: 'orders',
    icon: Truck,
  },
  {
    question: "Is there vehicle parking available near the stall?",
    answer: "Yes! There is ample open roadside parking space along Marine Drive right in front of our food stall for cars, motorcycles, microbuses, and auto-rickshaws (TomToms).",
    category: 'location',
    icon: MapPin,
  },
  {
    question: "Can I customize the spiciness level of momos and fuchka?",
    answer: "Certainly! If you prefer mild, medium, or extra fiery Naga spicy chutney for your momos and fuchka, simply let our kitchen team know in the order instructions or at the counter.",
    category: 'food',
    icon: Heart,
  },
  {
    question: "How can I leave a Google Maps review or share my feedback?",
    answer: "You can visit our Connect Page at /connect or directly tap our verified Google Maps review link (https://g.page/r/CZY9cCNvq2_GEAE/review) or leave a review on our official Facebook page.",
    category: 'dining',
    icon: Share2,
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Questions' },
  { id: 'food', label: 'Food & Menu' },
  { id: 'location', label: 'Location & Map' },
  { id: 'orders', label: 'Pre-orders & Delivery' },
  { id: 'payment', label: 'Payment Methods' },
  { id: 'dining', label: 'Beach Dining & Hours' },
];

export default function FAQPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFAQs = FAQ_ITEMS.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(search.toLowerCase()) ||
      item.answer.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-brand-black text-brand-cream pb-20 pt-4 sm:pt-6">
      <div className="container-bb max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-yellow/15 border border-brand-yellow/30 text-brand-yellow text-xs font-bold uppercase tracking-wider">
            <HelpCircle size={14} />
            <span>Help Center & FAQ</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-brand-cream uppercase tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-brand-cream/65 max-w-xl mx-auto leading-relaxed">
            Everything you need to know about Brother&apos;s Bites — food specialities, Marine Drive location, hours, preorders & beach hospitality.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-cream/40" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions e.g. momos, parking, hours, delivery..."
            className="w-full bg-brand-surface border border-brand-border rounded-2xl pl-11 pr-4 py-3 text-sm text-brand-cream placeholder-brand-cream/40 focus:outline-none focus:border-brand-yellow transition-colors shadow-lg"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-brand-cream/50 hover:text-brand-cream font-bold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar sm:flex-wrap justify-start sm:justify-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-brand-yellow text-brand-black shadow-md'
                  : 'bg-brand-surface text-brand-cream/60 hover:text-brand-cream border border-white/10 hover:bg-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Accordion FAQ List */}
        <div className="space-y-3">
          {filteredFAQs.length === 0 ? (
            <div className="card-bb p-12 text-center bg-brand-surface-light border-dashed border-brand-border space-y-3">
              <HelpCircle size={40} className="mx-auto text-brand-cream/20" />
              <h3 className="text-base font-bold text-brand-cream">No matching questions found</h3>
              <p className="text-xs text-brand-cream/50">
                Try searching for different keywords or chat with us on WhatsApp.
              </p>
            </div>
          ) : (
            filteredFAQs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              const Icon = faq.icon;

              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'bg-brand-surface border-brand-yellow/50 shadow-xl'
                      : 'bg-brand-surface-light border-brand-border hover:border-brand-yellow/30'
                  }`}
                >
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 select-none cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isOpen ? 'bg-brand-yellow text-brand-black' : 'bg-white/5 text-brand-yellow'
                      }`}>
                        <Icon size={18} />
                      </div>
                      <span className="text-sm sm:text-base font-bold text-brand-cream">
                        {faq.question}
                      </span>
                    </div>

                    <ChevronDown
                      size={18}
                      className={`text-brand-yellow shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-5 pb-5 pt-1 border-t border-white/5 text-xs sm:text-sm text-brand-cream/80 leading-relaxed pl-14 sm:pl-16">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Direct Assistance Card */}
        <div className="rounded-3xl bg-gradient-to-r from-brand-yellow/15 via-brand-surface-light to-brand-surface-light border border-brand-yellow/30 p-6 sm:p-8 shadow-2xl text-center space-y-4">
          <h3 className="text-lg sm:text-xl font-black text-brand-cream uppercase tracking-tight">
            Still Have Questions or Inquiries?
          </h3>
          <p className="text-xs sm:text-sm text-brand-cream/70 max-w-lg mx-auto">
            Our beachside team is available 7 days a week. Connect via WhatsApp for instant replies or call our hotline.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="https://wa.me/8801627817436?text=Hi%20Brother%27s%20Bites!%20I%20have%20a%20question."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md active:scale-95"
            >
              <MessageSquare size={15} />
              <span>Chat on WhatsApp</span>
            </a>

            <a
              href="tel:+8801627817436"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-yellow text-brand-black text-xs font-black hover:bg-brand-yellow-hover transition-all shadow-md active:scale-95"
            >
              <Phone size={15} />
              <span>Call +880 1627-817436</span>
            </a>

            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-brand-cream text-xs font-bold transition-all"
            >
              <span>Contact Page</span>
              <ExternalLink size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
