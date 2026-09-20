'use client';

import React, { useState, FormEvent } from 'react';
import {
  Phone,
  MapPin,
  MessageSquare,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import CustomMapEmbed from '@/components/common/CustomMapEmbed';
import InstagramIcon from '@/components/icons/InstagramIcon';
import FacebookIcon from '@/components/icons/FacebookIcon';
import api from '@/lib/api';

const contactMethods = [
  {
    icon: Phone,
    label: 'Primary Hotline',
    value: '+880 1627-817436',
    actionText: 'Call Now',
    href: 'tel:+8801627817436',
    external: false,
  },
  {
    icon: MessageSquare,
    label: 'WhatsApp Chat',
    value: '+880 1627-817436',
    actionText: 'Chat on WhatsApp',
    href: 'https://wa.me/8801627817436',
    external: true,
  },
  {
    icon: FacebookIcon,
    label: 'Facebook Page',
    value: '@brothersbites.bd',
    actionText: 'Follow Page',
    href: 'https://facebook.com/brothersbites.bd',
    external: true,
  },
  {
    icon: InstagramIcon,
    label: 'Instagram',
    value: '@brothersbites.bd',
    actionText: 'Follow Page',
    href: 'https://instagram.com/brothersbites.bd',
    external: true,
  },
  {
    icon: HelpCircle,
    label: 'Help & FAQ',
    value: 'Instant Answers',
    actionText: 'View FAQ',
    href: '/faq',
    external: false,
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Please fill in your name, email, and message.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/contact', form);
      if (res.data?.success) {
        setSubmitted(true);
        setForm({
          name: '',
          email: '',
          phone: '',
          subject: 'General Inquiry',
          message: '',
        });
      } else {
        setError(res.data?.message || 'Failed to submit message.');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Failed to send message. You can also contact us directly via WhatsApp (+880 1627-817436).'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-16 sm:pb-20 pt-3 sm:pt-6 text-brand-cream selection:bg-brand-yellow selection:text-brand-black">
      {/* Header */}
      <div className="container-bb text-center mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-yellow/15 border border-brand-yellow/30 text-brand-yellow text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles size={12} />
          <span>We Are Here For You</span>
        </div>
        <h1 className="heading-page text-brand-cream uppercase mb-2">GET IN TOUCH</h1>
        <p className="text-brand-cream/65 text-xs sm:text-base max-w-xl mx-auto leading-relaxed">
          Have a question, catering inquiry, food pre-order, or want to reserve a table by the beach? Reach out anytime.
        </p>
      </div>

      <div className="container-bb space-y-10 sm:space-y-14">
        {/* Contact Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {contactMethods.map((item) => (
            <div
              key={item.label + item.value}
              className="card-bb p-4 sm:p-5 flex flex-col justify-between bg-brand-surface border-brand-border hover:border-brand-yellow/40 transition-all group"
            >
              <div>
                <div className="w-9 h-9 rounded-xl bg-brand-yellow/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <item.icon className="w-4 h-4 text-brand-yellow" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-brand-cream/50 mb-0.5">
                  {item.label}
                </p>
                <p className="text-brand-cream font-bold text-xs sm:text-sm mb-3 break-words">
                  {item.value}
                </p>
              </div>
              <a
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                className="btn-secondary w-full justify-center !h-8 text-[11px] font-bold"
              >
                {item.actionText}
              </a>
            </div>
          ))}
        </div>

        {/* Contact Form & Live Map Split Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Contact Form */}
          <div className="lg:col-span-6 card-bb p-6 sm:p-8 bg-brand-surface-light border-brand-border shadow-2xl rounded-3xl space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-brand-yellow text-xs font-bold uppercase tracking-wider mb-1">
                <MessageSquare size={13} />
                <span>Send Us a Direct Message</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-brand-cream uppercase tracking-tight">
                Send Inquiry or Pre-order
              </h2>
              <p className="text-xs text-brand-cream/60 mt-1 leading-relaxed">
                Fill out this form and our team will get back to you with confirmation via email and phone.
              </p>
            </div>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3 animate-in fade-in duration-300">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-base font-bold text-brand-cream">Message Sent Successfully!</h3>
                <p className="text-xs text-brand-cream/70 max-w-sm mx-auto leading-relaxed">
                  Thank you! We have sent a confirmation to your email. Our team will get in touch with you shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="btn-secondary !h-9 text-xs px-4 mt-2"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {error && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center gap-2 text-xs">
                    <AlertCircle size={15} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="text-brand-cream/70 font-semibold block">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Tanvir Ahmed"
                      className="w-full bg-brand-surface border border-brand-border rounded-xl px-3.5 py-2.5 text-brand-cream placeholder-brand-cream/30 focus:outline-none focus:border-brand-yellow"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-brand-cream/70 font-semibold block">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="e.g. tanvir@example.com"
                      className="w-full bg-brand-surface border border-brand-border rounded-xl px-3.5 py-2.5 text-brand-cream placeholder-brand-cream/30 focus:outline-none focus:border-brand-yellow"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="text-brand-cream/70 font-semibold block">Phone / WhatsApp</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="e.g. +880 1812-345678"
                      className="w-full bg-brand-surface border border-brand-border rounded-xl px-3.5 py-2.5 text-brand-cream placeholder-brand-cream/30 focus:outline-none focus:border-brand-yellow"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-brand-cream/70 font-semibold block">Subject</label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full bg-brand-surface border border-brand-border rounded-xl px-3.5 py-2.5 text-brand-cream focus:outline-none focus:border-brand-yellow"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Food Pre-order Request">Food Pre-order Request</option>
                      <option value="Group Tour / Catering Booking">Group Tour / Catering Booking</option>
                      <option value="Customer Feedback & Praise">Customer Feedback & Praise</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-brand-cream/70 font-semibold block">Your Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us what you'd like to ask or arrange..."
                    className="w-full bg-brand-surface border border-brand-border rounded-xl px-3.5 py-2.5 text-brand-cream placeholder-brand-cream/30 focus:outline-none focus:border-brand-yellow resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary !h-11 justify-center text-xs font-black shadow-lg uppercase tracking-wider disabled:opacity-50 gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      <span>SUBMIT MESSAGE</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Physical Location & Live Google Map */}
          <div className="lg:col-span-6 card-bb p-6 sm:p-8 bg-brand-surface border-brand-border rounded-3xl shadow-xl space-y-6">
            <div>
              <p className="eyebrow-bb mb-1">Physical Kitchen & Stall</p>
              <h2 className="heading-section text-brand-cream mb-3">Visit Us by the Waves</h2>
              <div className="flex items-start gap-2.5 text-brand-cream/80 text-xs sm:text-sm">
                <MapPin className="w-4 h-4 text-brand-yellow shrink-0 mt-0.5" />
                <p>Marine Drive, Sonar Para Beach, Cox&apos;s Bazar, Bangladesh</p>
              </div>
            </div>

            <div className="border-t border-white/5 pt-4">
              <h3 className="font-bold text-brand-cream text-xs uppercase tracking-wider mb-2.5 flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-yellow" />
                <span>Operating Hours</span>
              </h3>
              <div className="space-y-1.5 text-xs text-brand-cream/70">
                <div className="flex justify-between">
                  <span>Sunday — Thursday</span>
                  <span className="font-bold text-brand-cream">3:00 PM — 12:00 AM</span>
                </div>
                <div className="flex justify-between">
                  <span>Friday — Saturday</span>
                  <span className="font-bold text-brand-cream">10:00 AM — 12:00 AM</span>
                </div>
              </div>
            </div>

            <CustomMapEmbed
              embedUrl="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d232.34524772674902!2d92.04676015661319!3d21.290302964726862!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30adc5b2179fe74d%3A0xc66fab6f23703d96!2sBrother%27s%20Bites!5e0!3m2!1sen!2sbd!4v1789874032852!5m2!1sen!2sbd"
              directionsUrl="https://maps.app.goo.gl/Xni3a5YXNXsCe5zz5"
              aspectRatio="aspect-[16/10] min-h-[260px]"
            />

            <a
              href="https://maps.app.goo.gl/Xni3a5YXNXsCe5zz5"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full justify-center !h-10 text-xs font-bold gap-1.5"
            >
              <span>OPEN LIVE GPS NAVIGATION</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
