import React from 'react';
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
  GitBranch,
  CheckCircle2,
  FileCode2,
  Mail,
  MapPin,
  Briefcase,
} from 'lucide-react';
import SectionHeader from '@/components/common/SectionHeader';

export const metadata = {
  title: "Developer & System Architecture | Brother's Bites",
  description: "Explore the technical architecture, tech stack, REST API structure, and engineering details behind Brother's Bites digital platform.",
};

export default function DeveloperPage() {
  const stack = [
    {
      category: 'Frontend Architecture',
      icon: Layers,
      items: [
        { name: 'Next.js 16 (App Router)', desc: 'Turbopack-powered React framework for high-speed SSR & static rendering' },
        { name: 'React 19 & TypeScript', desc: 'Modern component lifecycle with full end-to-end type safety' },
        { name: 'Tailwind CSS & Vanilla Design System', desc: 'Custom tailored dark/light theme tokens with smooth micro-interactions' },
        { name: 'Framer Motion', desc: 'Physics-based animations, layout transitions, and interactive cues' },
      ],
    },
    {
      category: 'Backend & APIs',
      icon: Server,
      items: [
        { name: 'Node.js & Express REST API', desc: 'Modular micro-controller architecture mounted at /api/v1' },
        { name: 'TypeScript & tsx', desc: 'Strict typing across models, validators, controllers, and middlewares' },
        { name: 'JWT Cookie Auth & RBAC', desc: 'HTTP-only secure session cookies with 4-tier Role-Based Access Control' },
        { name: 'Zod Data Validation', desc: 'Strict runtime schema validation for requests and payloads' },
      ],
    },
    {
      category: 'Database & Cloud Storage',
      icon: Database,
      items: [
        { name: 'MongoDB Atlas', desc: 'High-availability document database with Mongoose ODM schemas & indexes' },
        { name: 'Cloudinary CDN', desc: 'Automated image optimization, lazy loading, and cloud media management' },
        { name: 'Vercel Serverless Hosting', desc: 'Edge CDN routing, zero-downtime deployments, and lambda functions' },
        { name: 'Local & Cloud Seed Engine', desc: 'One-shot database population with pre-configured admin and menu data' },
      ],
    },
  ];

  const endpoints = [
    { method: 'POST', path: '/api/v1/auth/login', desc: 'Dual login with Username or Email + Password' },
    { method: 'GET', path: '/api/v1/auth/me', desc: 'Get active session details and user role' },
    { method: 'PUT', path: '/api/v1/auth/profile', desc: 'Update logged-in admin profile credentials' },
    { method: 'GET', path: '/api/v1/menu', desc: 'List active food items with category filtering' },
    { method: 'POST', path: '/api/v1/orders', desc: 'Real-time order creation with automated invoice generator' },
    { method: 'GET', path: '/api/v1/reviews', desc: 'Public approved reviews with aggregated rating stats' },
    { method: 'GET', path: '/api/v1/users', desc: 'Staff & multi-admin management (Super Admin only)' },
  ];

  return (
    <div className="min-h-screen bg-brand-black text-brand-cream selection:bg-brand-yellow selection:text-brand-black pb-20">
      {/* Hero Header */}
      <section className="section-padding-hero bg-gradient-to-b from-brand-surface-light via-brand-surface to-brand-black border-b border-brand-border relative overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-brand-yellow/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="container-bb relative z-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-yellow/10 border border-brand-yellow/30 text-brand-yellow text-xs font-bold uppercase tracking-wider mb-4">
            <Terminal size={14} />
            <span>Engineering & Architecture</span>
          </div>

          <h1 className="heading-page text-brand-cream uppercase mb-4">
            BUILT WITH <span className="text-brand-yellow">PRECISION</span> & PASSION
          </h1>

          <p className="text-sm sm:text-base text-brand-cream/70 leading-relaxed max-w-2xl mx-auto mb-8">
            Brother&apos;s Bites is engineered as a modern, decoupled full-stack platform. Built for blazing speed,
            flawless reliability, and delightful dining experiences.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
            <a
              href="https://github.com/salahuddingfx"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary !h-10 px-5 flex items-center gap-2"
            >
              <Code2 size={15} />
              <span>Lead Developer Portfolio</span>
              <ExternalLink size={13} />
            </a>

            <Link
              href="/offline"
              className="btn-secondary !h-10 px-5 flex items-center gap-2"
            >
              <Zap size={15} className="text-brand-yellow" />
              <span>Offline System</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Developer Card */}
      <section className="container-bb py-12">
        <div className="bg-brand-surface-light border border-brand-border rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-brand-yellow text-brand-black font-black text-4xl flex items-center justify-center shadow-xl border-2 border-brand-yellow/50">
                S
              </div>
              <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                Engineer
              </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="flex flex-col md:flex-row md:items-center gap-3 justify-center md:justify-start">
                <h2 className="text-2xl font-extrabold text-brand-cream">Salah Uddin Kader</h2>
                <span className="text-xs bg-brand-yellow/15 text-brand-yellow px-2.5 py-1 rounded-full font-bold border border-brand-yellow/30">
                  Full-Stack Software Architect
                </span>
              </div>
              <p className="text-xs sm:text-sm text-brand-cream/70 max-w-xl">
                Specialized in building high-performance web applications, scalable REST APIs, and bespoke digital experiences.
                Designed and developed the entire Brother&apos;s Bites digital infrastructure.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-brand-cream/60">
                <a
                  href="https://salahuddin.codes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-brand-yellow transition-colors"
                >
                  <Globe className="w-3.5 h-3.5 text-brand-yellow" />
                  <span>salahuddin.codes</span>
                </a>
                <a
                  href="mailto:info.salahuddindev@gmail.com"
                  className="flex items-center gap-1.5 hover:text-brand-yellow transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-brand-yellow" />
                  <span>info.salahuddindev@gmail.com</span>
                </a>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-yellow" />
                  <span>Cox&apos;s Bazar, Bangladesh</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Production Ready v1.0.0</span>
                </span>
              </div>
              <div className="pt-3 flex flex-wrap items-center justify-center md:justify-start gap-3">
                <a
                  href="https://github.com/salahuddingfx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-surface border border-brand-border text-[11px] font-semibold text-brand-cream/70 hover:border-brand-yellow/40 hover:text-brand-yellow transition-colors"
                >
                  <Briefcase className="w-3 h-3" />
                  <span>GitHub</span>
                </a>
                <a
                  href="https://linkedin.com/in/salahuddingfx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-surface border border-brand-border text-[11px] font-semibold text-brand-cream/70 hover:border-brand-yellow/40 hover:text-brand-yellow transition-colors"
                >
                  <Briefcase className="w-3 h-3" />
                  <span>LinkedIn</span>
                </a>
                <a
                  href="https://wa.me/8801851075537"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-surface border border-brand-border text-[11px] font-semibold text-brand-cream/70 hover:border-brand-yellow/40 hover:text-brand-yellow transition-colors"
                >
                  <Mail className="w-3 h-3" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Breakdown */}
      <section className="container-bb py-6 space-y-8">
        <SectionHeader
          eyebrow="Technology Foundation"
          title="Full-Stack Technical Stack"
          subtitle="Engineered with modern tools for optimal performance, accessibility, and high developer velocity."
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stack.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="bg-brand-surface-light border border-brand-border rounded-3xl p-6 hover:border-brand-yellow/40 transition-all duration-300 shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-brand-yellow/15 border border-brand-yellow/30 flex items-center justify-center text-brand-yellow mb-5 shadow-inner">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-lg font-bold text-brand-cream mb-4">{s.category}</h3>

                  <ul className="space-y-3.5">
                    {s.items.map((item, i) => (
                      <li key={i} className="text-xs space-y-1">
                        <p className="font-bold text-brand-cream flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow shrink-0" />
                          <span>{item.name}</span>
                        </p>
                        <p className="text-brand-cream/60 pl-3 leading-relaxed">{item.desc}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* API Overview Section */}
      <section className="container-bb py-12">
        <div className="bg-brand-surface border border-brand-border rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-brand-border">
            <div>
              <h3 className="text-xl font-extrabold text-brand-cream flex items-center gap-2">
                <FileCode2 className="w-5 h-5 text-brand-yellow" />
                <span>REST API Specification</span>
              </h3>
              <p className="text-xs text-brand-cream/60 mt-0.5">
                Clean, predictable HTTP endpoints with standardized JSON responses.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-black text-[11px] font-mono text-brand-yellow border border-white/10 self-start sm:self-auto">
              <span>Base: /api/v1</span>
            </div>
          </div>

          <div className="divide-y divide-white/5">
            {endpoints.map((ep, idx) => (
              <div key={idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-3 font-mono">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-black ${
                      ep.method === 'GET'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : ep.method === 'POST'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}
                  >
                    {ep.method}
                  </span>
                  <span className="text-brand-cream font-bold">{ep.path}</span>
                </div>
                <span className="text-brand-cream/60 text-[11px]">{ep.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
