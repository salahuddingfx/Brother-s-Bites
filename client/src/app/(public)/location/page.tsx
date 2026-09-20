import type { Metadata } from 'next';
import { MapPin, Phone, Clock, Navigation } from 'lucide-react';
import InstagramIcon from '@/components/icons/InstagramIcon';
import FacebookIcon from '@/components/icons/FacebookIcon';
import CustomMapEmbed from '@/components/common/CustomMapEmbed';

export const metadata: Metadata = {
  title: 'Location & Hours',
  description: "Find Brother's Bites on Marine Drive, Sonar Para Beach, Cox's Bazar. Get directions, contact info, and operating hours.",
};

const hours = [
  { days: 'Sunday — Thursday', time: '3:00 PM — 12:00 AM' },
  { days: 'Friday — Saturday', time: '10:00 AM — 12:00 AM' },
];

export default function LocationPage() {
  return (
    <div className="pb-16 sm:pb-20 pt-4 sm:pt-6">
      {/* Header */}
      <div className="container-bb text-center mb-10 sm:mb-14">
        <p className="eyebrow-bb mb-2">Marine Drive • Sonar Para Beach</p>
        <h1 className="heading-page text-brand-cream uppercase mb-3">HOW TO FIND US</h1>
        <p className="text-brand-cream/60 text-sm sm:text-base max-w-xl mx-auto">
          Conveniently located along the Marine Drive coastline at Sonar Para Beach, Cox&apos;s Bazar.
        </p>
      </div>

      <div className="container-bb space-y-12">
        {/* Full-width Custom Dark-Themed Map Container */}
        <CustomMapEmbed
          embedUrl="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d232.34524772674902!2d92.04676015661319!3d21.290302964726862!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30adc5b2179fe74d%3A0xc66fab6f23703d96!2sBrother%27s%20Bites!5e0!3m2!1sen!2sbd!4v1789874032852!5m2!1sen!2sbd"
          directionsUrl="https://maps.app.goo.gl/Xni3a5YXNXsCe5zz5"
          aspectRatio="aspect-[21/9] min-h-[380px]"
        />

        {/* 1-Tap Google Maps Review Callout */}
        <div className="rounded-2xl bg-gradient-to-r from-amber-500/15 via-brand-surface-light to-brand-surface-light border border-amber-500/30 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <MapPin size={24} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-brand-cream">
                Visited Brother&apos;s Bites on Marine Drive?
              </h3>
              <p className="text-xs text-brand-cream/70 mt-0.5">
                Share your moments, food photos, and rate us 5 stars on Google Maps.
              </p>
            </div>
          </div>
          <a
            href="https://g.page/r/CZY9cCNvq2_GEAE/review"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary !h-10 px-5 text-xs gap-2 shrink-0 shadow-md"
          >
            <span>⭐ Write a Google Review</span>
          </a>
        </div>

        {/* Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Address */}
          <div className="card-bb p-6 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-brand-yellow/10 flex items-center justify-center mb-4">
                <MapPin className="w-5 h-5 text-brand-yellow" />
              </div>
              <h3 className="heading-card text-brand-cream mb-1">Address</h3>
              <p className="text-brand-cream/70 text-sm leading-relaxed mb-4">
                Marine Drive, Sonar Para Beach, Cox&apos;s Bazar, Bangladesh
              </p>
            </div>
            <a
              href="https://maps.app.goo.gl/Xni3a5YXNXsCe5zz5"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full justify-center !h-9 text-xs gap-1.5"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Get Directions</span>
            </a>
          </div>

          {/* Operating Hours */}
          <div className="card-bb p-6 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-brand-yellow/10 flex items-center justify-center mb-4">
                <Clock className="w-5 h-5 text-brand-yellow" />
              </div>
              <h3 className="heading-card text-brand-cream mb-2">Hours</h3>
              <div className="space-y-2 text-xs text-brand-cream/70">
                {hours.map((h) => (
                  <div key={h.days}>
                    <p className="text-brand-cream/40">{h.days}</p>
                    <p className="font-semibold text-brand-cream text-sm">{h.time}</p>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[11px] text-brand-yellow/80 font-semibold uppercase tracking-wider pt-2">
              Open 7 Days a Week
            </span>
          </div>

          {/* Direct Phone */}
          <div className="card-bb p-6 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-brand-yellow/10 flex items-center justify-center mb-4">
                <Phone className="w-5 h-5 text-brand-yellow" />
              </div>
              <h3 className="heading-card text-brand-cream mb-1">Phone</h3>
              <p className="text-brand-cream/70 text-sm leading-relaxed mb-4">
                Call for table reservations, pre-orders, and catering inquiries.
              </p>
            </div>
            <a href="tel:+8801627817436" className="btn-secondary w-full justify-center !h-9 text-xs gap-1.5">
              <Phone className="w-3.5 h-3.5" />
              <span>+880 1627-817436</span>
            </a>
          </div>

          {/* Social */}
          <div className="card-bb p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-brand-yellow/10 flex items-center justify-center">
                  <InstagramIcon className="w-5 h-5 text-brand-yellow" />
                </div>
                <div className="w-10 h-10 rounded-lg bg-brand-yellow/10 flex items-center justify-center">
                  <FacebookIcon className="w-5 h-5 text-brand-yellow" />
                </div>
              </div>
              <h3 className="heading-card text-brand-cream mb-1">Socials</h3>
              <p className="text-brand-cream/70 text-sm leading-relaxed mb-4">
                Follow our official Facebook & Instagram pages for updates & food photos.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <a
                href="https://facebook.com/brothersbites.bd"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary w-full justify-center !h-9 text-xs"
              >
                Facebook
              </a>
              <a
                href="https://instagram.com/brothersbites.bd"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary w-full justify-center !h-9 text-xs"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
