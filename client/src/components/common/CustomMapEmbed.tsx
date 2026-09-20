'use client';

import { useState } from 'react';
import { Navigation, Moon, Sun, Globe, MapPin, Sparkles, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

type MapMode = 'satellite' | 'dark' | 'standard';

interface CustomMapEmbedProps {
  embedUrl?: string;
  directionsUrl?: string;
  className?: string;
  title?: string;
  aspectRatio?: string;
}

const DEFAULT_STANDARD_EMBED =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d232.34524772674902!2d92.04676015661319!3d21.290302964726862!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30adc5b2179fe74d%3A0xc66fab6f23703d96!2sBrother%27s%20Bites!5e0!3m2!1sen!2sbd!4v1789874032852!5m2!1sen!2sbd';

// Satellite Hybrid (Real Earth satellite imagery + Beach & Road overlay)
const SATELLITE_EMBED =
  'https://maps.google.com/maps?q=21.290302964726862,92.04676015661319+(Brother%27s+Bites)&t=k&z=19&ie=UTF8&iwloc=B&output=embed';

const DEFAULT_DIRECTIONS =
  'https://maps.app.goo.gl/Xni3a5YXNXsCe5zz5';

export default function CustomMapEmbed({
  embedUrl = DEFAULT_STANDARD_EMBED,
  directionsUrl = DEFAULT_DIRECTIONS,
  className,
  title = "Brother's Bites Location Map",
  aspectRatio = 'aspect-[21/9] min-h-[380px]',
}: CustomMapEmbedProps) {
  const [mode, setMode] = useState<MapMode>('satellite');

  const currentSrc = mode === 'satellite' ? SATELLITE_EMBED : embedUrl;

  const iframeFilter =
    mode === 'dark'
      ? 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(92%)'
      : mode === 'satellite'
      ? 'contrast(108%) saturate(115%) brightness(100%)'
      : 'none';

  return (
    <div
      className={cn(
        'card-bb relative overflow-hidden rounded-2xl border border-brand-yellow/30 shadow-[0_12px_40px_rgba(0,0,0,0.5)] group transition-all duration-300',
        aspectRatio,
        className
      )}
    >
      {/* Live Map Iframe */}
      <iframe
        key={mode}
        src={currentSrc}
        width="100%"
        height="100%"
        style={{
          border: 0,
          filter: iframeFilter,
          transition: 'filter 0.4s ease-in-out',
        }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        title={title}
        className="w-full h-full"
      />

      {/* Top Floating Bar: Location Tag + Multi-Mode Switcher + Direction CTA */}
      <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none z-10">
        {/* Left: Live Location & Coastal Badge */}
        <div className="pointer-events-auto bg-brand-black/90 backdrop-blur-md border border-brand-yellow/35 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-xl">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-yellow opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-yellow"></span>
          </span>
          <MapPin className="w-3.5 h-3.5 text-brand-yellow shrink-0" />
          <span className="text-[11px] sm:text-xs font-bold text-brand-cream uppercase tracking-wide truncate max-w-[150px] sm:max-w-none">
            Marine Drive • Sonar Para Beach
          </span>
          <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold text-brand-yellow/90 bg-brand-yellow/10 border border-brand-yellow/20 px-1.5 py-0.5 rounded-md">
            <Sparkles className="w-2.5 h-2.5" />
            Beachside
          </span>
        </div>

        {/* Right: Satellite / Dark / Standard View Mode Buttons + Directions */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Mode Selector Segmented Pill */}
          <div className="bg-brand-black/90 backdrop-blur-md border border-brand-border p-0.5 rounded-full flex items-center shadow-xl">
            <button
              onClick={() => setMode('satellite')}
              className={cn(
                'px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 transition-all',
                mode === 'satellite'
                  ? 'bg-brand-yellow text-black shadow-md'
                  : 'text-brand-cream/70 hover:text-brand-cream'
              )}
              title="Real Satellite & Beach View"
            >
              <Globe className="w-3 h-3" />
              <span>Satellite</span>
            </button>

            <button
              onClick={() => setMode('dark')}
              className={cn(
                'px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 transition-all',
                mode === 'dark'
                  ? 'bg-brand-yellow text-black shadow-md'
                  : 'text-brand-cream/70 hover:text-brand-cream'
              )}
              title="Sleek Dark Night Map"
            >
              <Moon className="w-3 h-3" />
              <span>Dark</span>
            </button>

            <button
              onClick={() => setMode('standard')}
              className={cn(
                'px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 transition-all',
                mode === 'standard'
                  ? 'bg-brand-yellow text-black shadow-md'
                  : 'text-brand-cream/70 hover:text-brand-cream'
              )}
              title="Standard Roadmap"
            >
              <Sun className="w-3 h-3" />
              <span className="hidden sm:inline">Map</span>
            </button>
          </div>

          {/* Quick 1-Tap Directions */}
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-brand-yellow hover:bg-brand-yellow-dark text-black font-extrabold px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs shadow-[0_2px_12px_rgba(var(--brand-yellow-rgb),0.4)] transition-all"
            title="Open in Google Maps App"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Directions</span>
            <ExternalLink className="w-3 h-3 sm:hidden" />
          </a>
        </div>
      </div>

      {/* Bottom Subtle Overlay Note */}
      {mode === 'satellite' && (
        <div className="absolute bottom-2 left-3 pointer-events-none bg-brand-black/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 text-[10px] text-brand-cream/70 hidden sm:flex items-center gap-1.5">
          <span>🛰️ Live Satellite View of Sonar Para Coastline & Stand</span>
        </div>
      )}
    </div>
  );
}
