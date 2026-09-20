'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Star,
  MapPin,
  Phone,
  MessageSquare,
  Globe,
  Share2,
  Check,
  Copy,
  ExternalLink,
  Utensils,
  Truck,
  Sparkles,
  Camera,
  Heart,
  Clock,
  Navigation,
  ShieldCheck,
  Send,
  HelpCircle,
} from 'lucide-react';
import dynamic from 'next/dynamic';

const ReviewModal = dynamic(() => import('@/components/reviews/ReviewModal'), { ssr: false });

export default function ConnectLandingPage() {
  const [copied, setCopied] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [activeSocialTab, setActiveSocialTab] = useState<'facebook' | 'instagram'>('facebook');

  const instagramPosts = [
    {
      image: '/images/steam-momo.png',
      caption: 'Hot juicy Chicken Steamed Momos served with our signature red spicy chutney 🥟🔥',
      likes: '482',
      comments: '38',
      type: 'Reel',
    },
    {
      image: '/images/shop/shop-1.jpg',
      caption: 'Golden hour sunset rituals right on Sonar Para Beach, Marine Drive 🌅🏖️',
      likes: '620',
      comments: '54',
      type: 'Photo',
    },
    {
      image: '/images/shop/shop-7.jpg',
      caption: 'Freshly brewed Special Masala Caramel Matka Tea by the ocean breeze ☕✨',
      likes: '395',
      comments: '29',
      type: 'Reel',
    },
    {
      image: '/images/shop/shop-10.jpg',
      caption: 'Crispy street Naga Fuchka & Dahi Fuchka prepared fresh on order 🌶️👌',
      likes: '512',
      comments: '43',
      type: 'Photo',
    },
    {
      image: '/images/team/chef-ahammad.jpg',
      caption: 'Head Chef Ahammad Bin Kashem curating coastal perfection at Brother&apos;s Bites 👨‍🍳✨',
      likes: '740',
      comments: '67',
      type: 'Photo',
    },
    {
      image: '/images/shop/shop-14.jpg',
      caption: 'Midnight crowd & brotherhood vibes under the starry coastal sky 🌙❤️',
      likes: '890',
      comments: '82',
      type: 'Reel',
    },
  ];

  const handleShare = async () => {
    const shareData = {
      title: "Brother's Bites — Beachside Bites & Sips",
      text: "Check out Brother's Bites on Marine Drive, Sonar Para Beach, Cox's Bazar!",
      url: typeof window !== 'undefined' ? window.location.href : 'https://bbites.salahuddin.codes/connect',
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {}
    } else {
      navigator.clipboard.writeText(shareData.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const reviewPortals = [
    {
      title: 'Review on Google Maps',
      subtitle: 'Rate our food, beach ambience & service (5 Stars ⭐)',
      badge: 'Google Maps Verified',
      url: 'https://g.page/r/CZY9cCNvq2_GEAE/review',
      icon: MapPin,
      gradient: 'from-amber-500/20 via-amber-500/10 to-transparent',
      borderColor: 'border-amber-500/40 hover:border-amber-400',
      iconColor: 'text-amber-400 bg-amber-500/15',
      btnText: 'Write Google Review',
    },
    {
      title: 'Recommend on Meta (Facebook)',
      subtitle: 'Leave a recommendation on our official Facebook Page',
      badge: 'Meta / Facebook',
      url: 'https://facebook.com/brothersbites.bd/reviews',
      icon: Globe,
      gradient: 'from-blue-500/20 via-blue-500/10 to-transparent',
      borderColor: 'border-blue-500/40 hover:border-blue-400',
      iconColor: 'text-blue-400 bg-blue-500/15',
      btnText: 'Recommend on Facebook',
    },
  ];

  const socialChannels = [
    {
      name: 'Facebook Page',
      handle: '@brothersbites.bd',
      url: 'https://facebook.com/brothersbites.bd',
      desc: 'Daily photos, customer stories & opening updates',
      color: 'hover:border-blue-500/50 hover:bg-blue-500/5',
      badge: 'Official Page',
    },
    {
      name: 'Instagram',
      handle: '@brothersbites.bd',
      url: 'https://instagram.com/brothersbites.bd',
      desc: 'Sunset vibes, food reels & beach stories',
      color: 'hover:border-pink-500/50 hover:bg-pink-500/5',
      badge: 'Reels & Photos',
    },
    {
      name: 'WhatsApp Direct Chat',
      handle: '+880 1627-817436',
      url: 'https://wa.me/8801627817436?text=Hi%20Brother%27s%20Bites!%20I%20would%20like%20to%20place%20an%20order%20or%20inquire.',
      desc: 'Instant direct messaging & food preorder hotline',
      color: 'hover:border-emerald-500/50 hover:bg-emerald-500/5',
      badge: 'Instant Reply',
    },
    {
      name: 'Direct Phone Hotline',
      handle: '+880 1627-817436',
      url: 'tel:+8801627817436',
      desc: 'Call for table inquiries & beach directions',
      color: 'hover:border-brand-yellow/50 hover:bg-brand-yellow/5',
      badge: 'Hotline',
    },
  ];

  const quickLinks = [
    {
      title: 'Digital Food Menu',
      desc: 'Explore chicken momos, crunchy fuchka, seafood & teas',
      href: '/menu',
      icon: Utensils,
      color: 'text-brand-yellow',
    },
    {
      title: 'Track Your Live Order',
      desc: 'Real-time SSE order preparation & delivery progress',
      href: '/track-order',
      icon: Truck,
      color: 'text-cyan-400',
    },
    {
      title: 'Marine Drive GPS Directions',
      desc: 'Find us right on Sonar Para Beach, Marine Drive',
      href: '/location',
      icon: Navigation,
      color: 'text-emerald-400',
    },
    {
      title: 'Beachside Photo Gallery',
      desc: 'Browse sunset moments, stall photos & food art',
      href: '/gallery',
      icon: Camera,
      color: 'text-purple-400',
    },
    {
      title: 'Our Story & Kitchen Masters',
      desc: 'Meet Head Chef Ahammad Bin Kashem & our crew',
      href: '/about',
      icon: Heart,
      color: 'text-rose-400',
    },
  ];

  return (
    <div className="min-h-screen bg-brand-black text-brand-cream selection:bg-brand-yellow selection:text-brand-black pb-24 pt-6 sm:pt-10">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-brand-yellow/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[140px]" />
      </div>

      <div className="container-bb max-w-2xl mx-auto relative z-10 space-y-8">
        {/* Profile Card Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center space-y-4 pt-4"
        >
          {/* Logo with Animated Glow */}
          <div className="relative inline-block mx-auto">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden p-1 bg-gradient-to-br from-brand-yellow via-amber-400 to-brand-black shadow-[0_0_35px_rgba(251,191,36,0.25)] mx-auto">
              <div className="w-full h-full rounded-[22px] bg-brand-black flex items-center justify-center p-3 relative overflow-hidden">
                <Image
                  src="/images/logo-icon.png"
                  alt="Brother's Bites"
                  width={96}
                  height={96}
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <div className="absolute -bottom-2 -right-1 px-2.5 py-0.5 rounded-full bg-brand-yellow text-brand-black text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1">
              <Sparkles size={11} />
              <span>Verified</span>
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-brand-cream tracking-tight uppercase">
              Brother&apos;s Bites
            </h1>
            <p className="text-xs sm:text-sm text-brand-yellow font-semibold tracking-wide mt-1">
              Bites • Sips • Brotherhood
            </p>
            <p className="text-xs text-brand-cream/60 max-w-md mx-auto mt-2 leading-relaxed">
              Coastal street culinary stop right on Marine Drive, Sonar Para Beach, Cox&apos;s Bazar.
            </p>
          </div>

          {/* Status & Open Hours Pill */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Open: Sun–Thu 3PM–12AM • Fri–Sat 10AM–12AM</span>
            </div>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-brand-cream/80 text-xs font-semibold transition-all"
            >
              {copied ? <Check size={13} className="text-emerald-400" /> : <Share2 size={13} />}
              <span>{copied ? 'Link Copied!' : 'Share Page'}</span>
            </button>
          </div>
        </motion.div>

        {/* 🌟 1-Tap Review Portals (Automated Google Maps & Meta) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-yellow flex items-center gap-1.5">
              <Star size={14} className="fill-brand-yellow" />
              <span>Leave Us a Review</span>
            </span>
            <span className="text-[11px] text-brand-cream/50">Your feedback helps us grow</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {reviewPortals.map((portal, idx) => {
              const Icon = portal.icon;
              return (
                <a
                  key={idx}
                  href={portal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${portal.gradient} bg-brand-surface-light border ${portal.borderColor} p-4 sm:p-5 flex items-center justify-between gap-4 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl group`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${portal.iconColor}`}>
                      <Icon size={22} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm sm:text-base font-bold text-brand-cream group-hover:text-brand-yellow transition-colors">
                          {portal.title}
                        </h3>
                      </div>
                      <p className="text-xs text-brand-cream/65 mt-0.5 leading-snug">
                        {portal.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl bg-brand-black/60 border border-white/10 text-xs font-bold text-brand-cream group-hover:border-brand-yellow/40 group-hover:text-brand-yellow transition-all">
                    <span>{portal.btnText}</span>
                    <ExternalLink size={12} />
                  </div>
                </a>
              );
            })}

            {/* Direct In-App Review Trigger */}
            <button
              onClick={() => setReviewModalOpen(true)}
              className="w-full rounded-2xl bg-brand-surface border border-brand-border hover:border-brand-yellow/40 p-4 flex items-center justify-between gap-4 text-left transition-all group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-brand-yellow/15 text-brand-yellow flex items-center justify-center shrink-0">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-brand-cream group-hover:text-brand-yellow transition-colors">
                    Write Direct Website Review
                  </h3>
                  <p className="text-xs text-brand-cream/65 mt-0.5">
                    Share your experience directly on our official customer wall
                  </p>
                </div>
              </div>
              <span className="shrink-0 text-xs font-bold text-brand-yellow px-3 py-1.5 rounded-xl bg-brand-yellow/10 border border-brand-yellow/20">
                Write Review
              </span>
            </button>
          </div>
        </div>

        {/* 📱 Social Media Channels */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-cream/60 flex items-center gap-1.5">
              <Globe size={14} className="text-brand-yellow" />
              <span>Connect & Follow</span>
            </span>
            <span className="text-[11px] text-brand-cream/40">Official Channels</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {socialChannels.map((soc, idx) => (
              <a
                key={idx}
                href={soc.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`rounded-2xl bg-brand-surface-light border border-brand-border p-4 transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between ${soc.color} group shadow-md`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-brand-cream group-hover:text-brand-yellow transition-colors">
                      {soc.name}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-brand-cream/60 border border-white/10">
                      {soc.badge}
                    </span>
                  </div>
                  <p className="text-xs font-mono font-semibold text-brand-yellow mb-1">{soc.handle}</p>
                  <p className="text-[11px] text-brand-cream/60 leading-relaxed">{soc.desc}</p>
                </div>

                <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-end text-xs text-brand-cream/40 group-hover:text-brand-cream transition-colors">
                  <span className="flex items-center gap-1 text-[11px] font-semibold">
                    <span>Open Channel</span>
                    <ExternalLink size={12} />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* 🌟 Live Social Feed & Auto-Preview Section (Facebook & Instagram Embeds) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-yellow flex items-center gap-1.5">
              <Camera size={14} className="text-brand-yellow" />
              <span>Live Social Feed & Stories</span>
            </span>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Updates</span>
            </span>
          </div>

          <div className="rounded-3xl bg-brand-surface-light border border-brand-border overflow-hidden p-4 sm:p-6 space-y-5 shadow-2xl">
            {/* Social Tab Switcher */}
            <div className="flex items-center p-1 rounded-2xl bg-brand-black/70 border border-white/10">
              <button
                type="button"
                onClick={() => setActiveSocialTab('facebook')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  activeSocialTab === 'facebook'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-brand-cream/60 hover:text-brand-cream hover:bg-white/5'
                }`}
              >
                <Globe size={14} />
                <span>Facebook Live Feed</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSocialTab('instagram')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  activeSocialTab === 'instagram'
                    ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white shadow-lg shadow-pink-600/30'
                    : 'text-brand-cream/60 hover:text-brand-cream hover:bg-white/5'
                }`}
              >
                <Camera size={14} />
                <span>Instagram Visual Feed</span>
              </button>
            </div>

            {/* Tab 1: Facebook Page Live Embed */}
            {activeSocialTab === 'facebook' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shrink-0">
                      f
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-brand-cream">
                        Brother&apos;s Bites Official Facebook Page
                      </h4>
                      <p className="text-[11px] text-blue-300">
                        @brothersbites.bd • Daily posts, customer photos & updates
                      </p>
                    </div>
                  </div>
                  <a
                    href="https://facebook.com/brothersbites.bd"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shrink-0"
                  >
                    <span>Follow Page</span>
                    <ExternalLink size={12} />
                  </a>
                </div>

                {/* Facebook Iframe Container with Auto-adapt & styling */}
                <div className="relative w-full rounded-2xl overflow-hidden bg-brand-black border border-white/10 flex flex-col items-center justify-center min-h-[480px]">
                  <iframe
                    src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fbrothersbites.bd&tabs=timeline&width=500&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
                    width="100%"
                    height="500"
                    style={{ border: 'none', overflow: 'hidden' }}
                    scrolling="no"
                    frameBorder="0"
                    allowFullScreen={true}
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    className="w-full max-w-[500px] rounded-2xl"
                    title="Brother's Bites Facebook Page Live Feed"
                  />
                  
                  <div className="w-full p-2.5 bg-brand-surface border-t border-white/10 text-center">
                    <a
                      href="https://facebook.com/brothersbites.bd"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-brand-cream/60 hover:text-brand-yellow font-medium inline-flex items-center gap-1"
                    >
                      <span>Can&apos;t load feed? View live on Facebook</span>
                      <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tab 2: Instagram Visual Preview & Reels Grid */}
            {activeSocialTab === 'instagram' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-amber-500/10 border border-pink-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 text-white flex items-center justify-center shrink-0">
                      <Camera size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-brand-cream">
                        @brothersbites.bd on Instagram
                      </h4>
                      <p className="text-[11px] text-pink-300">
                        Momos, tea rituals, beach sunsets & culinary vibes
                      </p>
                    </div>
                  </div>
                  <a
                    href="https://instagram.com/brothersbites.bd"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-90 text-white text-xs font-bold transition-all shadow-md shrink-0"
                  >
                    <span>Follow on Insta</span>
                    <ExternalLink size={12} />
                  </a>
                </div>

                {/* Visual Instagram Feed Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  {instagramPosts.map((post, idx) => (
                    <a
                      key={idx}
                      href="https://instagram.com/brothersbites.bd"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative aspect-square rounded-2xl overflow-hidden bg-brand-surface border border-white/10 hover:border-pink-500/50 transition-all duration-300 block shadow-md"
                    >
                      <Image
                        src={post.image}
                        alt={post.caption}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 640px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-brand-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-2.5 text-white">
                        <div className="flex justify-end">
                          <span className="px-2 py-0.5 rounded-full bg-pink-500/80 text-[10px] font-bold backdrop-blur-sm">
                            {post.type}
                          </span>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold line-clamp-2 leading-snug">
                            {post.caption}
                          </p>
                          <div className="flex items-center gap-3 mt-1 text-[10px] text-brand-cream/80">
                            <span className="flex items-center gap-1">
                              <Heart size={10} className="fill-rose-500 text-rose-500" />
                              <span>{post.likes}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare size={10} />
                              <span>{post.comments}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-brand-black/60 backdrop-blur-md flex items-center justify-center text-white/80 group-hover:opacity-0 transition-opacity">
                        <Camera size={12} />
                      </div>
                    </a>
                  ))}
                </div>

                <div className="p-3 rounded-2xl bg-brand-black/60 border border-white/10 text-center">
                  <a
                    href="https://instagram.com/brothersbites.bd"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-400 hover:text-pink-300 transition-colors"
                  >
                    <span>View all reels, stories and posts on Instagram @brothersbites.bd</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* ⚡ Quick Navigation Links */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-cream/60 flex items-center gap-1.5">
              <Sparkles size={14} className="text-brand-yellow" />
              <span>Quick Actions</span>
            </span>
          </div>

          <div className="space-y-2.5">
            {quickLinks.map((link, idx) => {
              const Icon = link.icon;
              return (
                <Link
                  key={idx}
                  href={link.href}
                  className="rounded-2xl bg-brand-surface-light border border-brand-border/80 hover:border-brand-yellow/50 p-4 flex items-center justify-between gap-4 transition-all duration-200 hover:translate-x-1 group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 ${link.color}`}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-brand-cream group-hover:text-brand-yellow transition-colors">
                        {link.title}
                      </h4>
                      <p className="text-xs text-brand-cream/60">{link.desc}</p>
                    </div>
                  </div>
                  <span className="text-brand-cream/30 group-hover:text-brand-yellow transition-colors shrink-0">
                    →
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom Location & Footer Note */}
        <div className="text-center pt-4 pb-2 text-xs text-brand-cream/50 space-y-2">
          <p className="flex items-center justify-center gap-1.5">
            <MapPin size={13} className="text-brand-yellow" />
            <span>Marine Drive, Sonar Para Beach, Cox&apos;s Bazar</span>
          </p>
          <p className="text-[11px] text-brand-cream/35">
            © {new Date().getFullYear()} Brother&apos;s Bites. All rights reserved.
          </p>
        </div>
      </div>

      {/* Review Submission Modal */}
      {reviewModalOpen && (
        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          onSuccess={() => {
            setReviewModalOpen(false);
            alert('🎉 Thank you! Your review has been submitted.');
          }}
        />
      )}
    </div>
  );
}
