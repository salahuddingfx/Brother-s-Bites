'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Code2,
  Terminal,
  Cpu,
  Database,
  Layers,
  ShieldCheck,
  Globe,
  ExternalLink,
  Sparkles,
  Server,
  Zap,
  Radio,
  CheckCircle2,
  FileCode2,
  Mail,
  MapPin,
  Briefcase,
  Copy,
  Check,
  Printer,
  ShieldAlert,
  ArrowUpRight,
} from 'lucide-react';
import SectionHeader from '@/components/common/SectionHeader';

export default function DeveloperPage() {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(text);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const stack = [
    {
      category: 'Frontend & UI Architecture',
      icon: Layers,
      gradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
      borderColor: 'border-amber-500/30',
      badge: 'Next.js 16',
      items: [
        { name: 'Next.js 16 + React 19', desc: 'Turbopack compiler, App Router, and server-side pre-rendering' },
        { name: 'TypeScript & Type Safety', desc: 'End-to-end schema models shared across components and services' },
        { name: 'Tailwind CSS & Glassmorphism', desc: 'Custom luxury color tokens, fluid dark/light themes, and CSS variables' },
        { name: 'Framer Motion & Micro-Interactions', desc: 'Physics-based layout springs, hover depth, and responsive states' },
      ],
    },
    {
      category: 'Backend & Live Microservices',
      icon: Server,
      gradient: 'from-cyan-500/10 via-cyan-500/5 to-transparent',
      borderColor: 'border-cyan-500/30',
      badge: 'Express + TS',
      items: [
        { name: 'Node.js & Modular Controllers', desc: 'Micro-controller routing architecture mounted cleanly at /api/v1' },
        { name: 'Real-Time SSE Live Gateway', desc: 'Server-Sent Events multi-channel broadcaster with instant order push' },
        { name: 'JWT Session Cookies & RBAC', desc: 'HTTP-only secure auth tokens with 4-tier Role-Based Access Control' },
        { name: 'Zod Runtime Validation', desc: 'Strict validation on incoming requests and payload sanitation' },
      ],
    },
    {
      category: 'Database & Cloud Media',
      icon: Database,
      gradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
      borderColor: 'border-emerald-500/30',
      badge: 'Atlas + CDN',
      items: [
        { name: 'MongoDB Atlas Cloud', desc: 'High-availability document database with optimized indexing and aggregation' },
        { name: 'Cloudinary Media CDN', desc: 'Edge image optimization, on-the-fly transformations, and instant delivery' },
        { name: 'Dual Thermal POS Engine', desc: 'Dedicated 58mm POS receipt and 1.75" sticker generation with print controls' },
        { name: 'Production DevGuard & Offline PWA', desc: 'Enterprise security guard, rate limiter bypass, and offline caching' },
      ],
    },
  ];

  const endpoints = [
    { method: 'POST', path: '/api/v1/auth/login', desc: 'Dual login with Username or Email + Password', access: 'Public' },
    { method: 'GET', path: '/api/v1/auth/me', desc: 'Get active session details and user role (guest-safe)', access: 'Public / Auth' },
    { method: 'GET', path: '/api/v1/menu', desc: 'List active food items with category filtering', access: 'Public' },
    { method: 'POST', path: '/api/v1/orders', desc: 'Real-time order creation with SSE push broadcast', access: 'Public' },
    { method: 'GET', path: '/api/v1/orders/:id/thermal', desc: 'Server-side Thermal POS receipt HTML rendering', access: 'Admin / Protected' },
    { method: 'GET', path: '/api/v1/live/admin', desc: 'Real-time SSE event stream for kitchen dashboard', access: 'Admin SSE' },
    { method: 'GET', path: '/api/v1/live/order/:orderNumber', desc: 'Live SSE status progression for customer tracking', access: 'Public SSE' },
    { method: 'GET', path: '/api/v1/analytics/visitors', desc: 'Visitor traffic analytics & device distribution', access: 'Super Admin' },
  ];

  const systemMetrics = [
    { label: 'Architecture', value: 'Decoupled Full-Stack', icon: Cpu, color: 'text-amber-400' },
    { label: 'Real-Time Engine', value: 'Native SSE Broadcast', icon: Radio, color: 'text-emerald-400' },
    { label: 'POS Printing', value: 'Dual Thermal 58mm', icon: Printer, color: 'text-cyan-400' },
    { label: 'Security Guard', value: 'Production Shield', icon: ShieldCheck, color: 'text-purple-400' },
  ];

  return (
    <div className="min-h-screen bg-brand-black text-brand-cream selection:bg-brand-yellow selection:text-brand-black pb-24 pt-4 sm:pt-8">
      {/* Hero Header */}
      <section className="relative overflow-hidden mb-12 sm:mb-16">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-brand-yellow/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="container-bb relative z-10 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-yellow/10 border border-brand-yellow/30 text-brand-yellow text-xs font-bold uppercase tracking-wider mb-4 shadow-lg backdrop-blur-md">
            <Terminal size={14} />
            <span>Digital Engineering & System Architecture</span>
          </div>

          <h1 className="heading-page text-brand-cream uppercase mb-4 text-3xl sm:text-5xl font-black tracking-tight">
            BUILT WITH <span className="text-brand-yellow">PRECISION</span> & PASSION
          </h1>

          <p className="text-sm sm:text-base text-brand-cream/70 leading-relaxed max-w-2xl mx-auto mb-8">
            Brother&apos;s Bites is engineered as a modern, decoupled full-stack platform. Built for blazing speed,
            flawless reliability, real-time kitchen orchestration, and delightful beachside dining experiences.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
            <a
              href="https://salahuddin.codes"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary !h-11 px-6 flex items-center gap-2 shadow-lg shadow-brand-yellow/10 hover:shadow-brand-yellow/20"
            >
              <Globe size={16} />
              <span>Explore Developer Portfolio</span>
              <ArrowUpRight size={15} />
            </a>

            <a
              href="https://github.com/salahuddingfx"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary !h-11 px-5 flex items-center gap-2"
            >
              <Code2 size={16} />
              <span>GitHub Repositories</span>
              <ExternalLink size={13} />
            </a>

            <Link
              href="/offline"
              className="btn-secondary !h-11 px-5 flex items-center gap-2 border-brand-yellow/30 hover:border-brand-yellow"
            >
              <Zap size={16} className="text-brand-yellow" />
              <span>Offline System</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Modern Developer Profile Card */}
      <section className="container-bb mb-16 sm:mb-20">
        <div className="relative rounded-3xl bg-gradient-to-br from-brand-surface-light via-brand-surface to-brand-surface-light border border-brand-yellow/30 p-6 sm:p-10 md:p-12 shadow-2xl overflow-hidden group">
          {/* Subtle Cyber Grid Glow */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-brand-yellow/10 rounded-full blur-[90px] pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-[90px] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-10">
            {/* Developer Photo with Glowing Frame */}
            <div className="relative shrink-0">
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden border-2 border-brand-yellow/60 shadow-[0_0_25px_rgba(251,191,36,0.2)] bg-brand-black/80">
                <Image
                  src="/images/developer/cv-images.png"
                  alt="Salah Uddin Kader (Saka Chowdhury)"
                  fill
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  sizes="176px"
                  priority
                />
              </div>

              {/* Status Pill Badge */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-black/90 backdrop-blur-md border border-emerald-500/40 text-emerald-400 text-[11px] font-bold shadow-lg">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Open for Projects</span>
              </div>
            </div>

            {/* Developer Details */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                  <h2 className="text-2xl sm:text-3xl font-black text-brand-cream tracking-tight">
                    Salah Uddin Kader
                  </h2>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-brand-yellow/15 text-brand-yellow border border-brand-yellow/30">
                    Lead Software Architect & Creative Developer
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-brand-yellow/90 font-mono font-medium">
                  @salahuddingfx • Saka Chowdhury
                </p>
              </div>

              <p className="text-xs sm:text-sm text-brand-cream/80 leading-relaxed max-w-2xl">
                Creative Full-Stack Developer & AI Engineer based in Cox&apos;s Bazar, Bangladesh.
                Architected and developed the entire <strong>Brother&apos;s Bites</strong> digital infrastructure — featuring Next.js 16,
                native Server-Sent Events (SSE) live order streaming, multi-tier RBAC authentication, and high-precision thermal POS receipts.
              </p>

              {/* Quick Info Pills */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-5 gap-y-2 pt-1 text-xs text-brand-cream/70">
                <a
                  href="https://salahuddin.codes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-brand-yellow hover:underline font-semibold"
                >
                  <Globe className="w-4 h-4 text-brand-yellow" />
                  <span>salahuddin.codes</span>
                </a>
                <a
                  href="mailto:salauddinkaderappy@gmail.com"
                  className="flex items-center gap-1.5 hover:text-brand-yellow transition-colors"
                >
                  <Mail className="w-4 h-4 text-brand-yellow" />
                  <span>salauddinkaderappy@gmail.com</span>
                </a>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-brand-yellow" />
                  <span>Cox&apos;s Bazar, Bangladesh</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Production Ready v1.0.0</span>
                </span>
              </div>

              {/* Social & Contact Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                <a
                  href="https://salahuddin.codes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-yellow text-brand-black text-xs font-bold hover:bg-brand-yellow-light transition-all shadow-md"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Live Portfolio</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>

                <a
                  href="https://github.com/salahuddingfx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-surface-light border border-white/10 text-xs font-semibold text-brand-cream hover:border-brand-yellow/50 hover:text-brand-yellow transition-all"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>

                <a
                  href="https://linkedin.com/in/salahuddingfx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-surface-light border border-white/10 text-xs font-semibold text-brand-cream hover:border-brand-yellow/50 hover:text-brand-yellow transition-all"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>LinkedIn</span>
                </a>

                <a
                  href="https://x.com/salahuddingfx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-surface-light border border-white/10 text-xs font-semibold text-brand-cream hover:border-brand-yellow/50 hover:text-brand-yellow transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Twitter / X</span>
                </a>

                <a
                  href="https://wa.me/8801851075537"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/25 transition-all"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>WhatsApp Chat</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* System Metrics Banner */}
      <section className="container-bb mb-16 sm:mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {systemMetrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div
                key={idx}
                className="card-bb bg-brand-surface-light border-brand-border/70 p-5 flex flex-col justify-between hover:border-brand-yellow/40 transition-all shadow-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-cream/50">
                    {m.label}
                  </span>
                  <div className={`p-2 rounded-xl bg-white/5 border border-white/10 ${m.color}`}>
                    <Icon size={18} />
                  </div>
                </div>
                <p className="text-base sm:text-lg font-black text-brand-cream tracking-tight">
                  {m.value}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tech Stack Breakdown */}
      <section className="container-bb mb-16 sm:mb-20 space-y-8">
        <SectionHeader
          eyebrow="Technology Foundation"
          title="Full-Stack Technical Stack"
          subtitle="Engineered with cutting-edge tools for maximum runtime speed, rock-solid security, and developer velocity."
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stack.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className={`rounded-3xl bg-gradient-to-br ${s.gradient} bg-brand-surface-light border ${s.borderColor} p-6 sm:p-7 flex flex-col justify-between shadow-xl hover:-translate-y-1 transition-all duration-300`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-brand-black/60 border border-white/10 flex items-center justify-center text-brand-yellow shadow-inner">
                      <Icon size={22} />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono font-bold text-brand-cream/80">
                      {s.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-brand-cream mb-4">{s.category}</h3>

                  <ul className="space-y-4">
                    {s.items.map((item, i) => (
                      <li key={i} className="text-xs space-y-1 bg-brand-black/40 p-3 rounded-xl border border-white/5">
                        <p className="font-bold text-brand-cream flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow shrink-0" />
                          <span>{item.name}</span>
                        </p>
                        <p className="text-brand-cream/65 pl-3 leading-relaxed text-[11px]">{item.desc}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive REST API Specification Section */}
      <section className="container-bb">
        <div className="rounded-3xl bg-brand-surface-light border border-brand-border p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-brand-border">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-yellow uppercase tracking-wider mb-1">
                <FileCode2 size={16} />
                <span>API Architecture</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-brand-cream tracking-tight">
                REST API Specification
              </h3>
              <p className="text-xs sm:text-sm text-brand-cream/60 mt-0.5">
                Standardized JSON payloads with real-time SSE streaming and role-based authorization.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-black font-mono text-xs text-brand-yellow border border-white/10 self-start sm:self-auto shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Base URL: /api/v1</span>
            </div>
          </div>

          <div className="divide-y divide-white/5 overflow-x-auto">
            {endpoints.map((ep, idx) => (
              <div
                key={idx}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-white/[0.02] px-2 rounded-lg transition-colors group"
              >
                <div className="flex items-center gap-3 font-mono">
                  <span
                    className={`px-2.5 py-1 rounded-md text-[10px] font-black tracking-wider uppercase ${
                      ep.method === 'GET'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : ep.method === 'POST'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : ep.method === 'PUT'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    }`}
                  >
                    {ep.method}
                  </span>
                  <span className="text-brand-cream font-bold group-hover:text-brand-yellow transition-colors">
                    {ep.path}
                  </span>
                  <button
                    onClick={() => handleCopy(ep.path)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 text-brand-cream/40 hover:text-brand-cream transition-all"
                    title="Copy Path"
                  >
                    {copiedEndpoint === ep.path ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-brand-cream/70 text-xs">{ep.desc}</span>
                  <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-brand-cream/50">
                    {ep.access}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
