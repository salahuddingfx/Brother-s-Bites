import type { Metadata } from 'next';
import { Phone, MapPin, MessageSquare, Clock } from 'lucide-react';
import CustomMapEmbed from '@/components/common/CustomMapEmbed';
import InstagramIcon from '@/components/icons/InstagramIcon';
import FacebookIcon from '@/components/icons/FacebookIcon';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: "Get in touch with Brother's Bites at Marine Drive, Sonar Para Beach, Cox's Bazar. Call or chat with us.",
};

const contactMethods = [
  {
    icon: Phone,
    label: 'Primary Phone',
    value: '+880 1627-817436',
    actionText: 'Call Now',
    href: 'tel:+8801627817436',
    external: false,
  },
  {
    icon: MessageSquare,
    label: 'WhatsApp',
    value: '+880 1627-817436',
    actionText: 'Start Chat',
    href: 'https://wa.me/8801627817436',
    external: true,
  },
  {
    icon: FacebookIcon,
    label: 'Facebook',
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
    icon: Phone,
    label: 'Secondary Phone',
    value: '+880 1838-971544',
    actionText: 'Call Now',
    href: 'tel:+8801838971544',
    external: false,
  },
];

export default function ContactPage() {
  return (
    <div className="pb-16 sm:pb-20 pt-4 sm:pt-6">
      {/* Header */}
      <div className="container-bb text-center mb-10 sm:mb-14">
        <p className="eyebrow-bb mb-2">We Are Here For You</p>
        <h1 className="heading-page text-brand-cream uppercase mb-3">GET IN TOUCH</h1>
        <p className="text-brand-cream/60 text-sm sm:text-base max-w-xl mx-auto">
          Have a question, catering inquiry, or want to reserve a table for your group? Reach out anytime.
        </p>
      </div>

      <div className="container-bb">
        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5 mb-12 sm:mb-16">
          {contactMethods.map((item) => (
            <div key={item.label + item.value} className="card-bb p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-brand-yellow/10 flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-brand-yellow" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-cream/50 mb-1">
                  {item.label}
                </p>
                <p className="text-brand-cream font-bold text-base mb-4 break-words">
                  {item.value}
                </p>
              </div>
              <a
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                className="btn-secondary w-full justify-center !h-9 text-xs"
              >
                {item.actionText}
              </a>
            </div>
          ))}
        </div>

        {/* Location & Map Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center card-bb p-6 sm:p-10 bg-brand-surface">
          <div className="lg:col-span-5 space-y-6">
            <div>
              <p className="eyebrow-bb mb-2">Physical Location</p>
              <h2 className="heading-section text-brand-cream mb-4">Visit Our Kitchen</h2>
              <div className="flex items-start gap-3 text-brand-cream/80 text-sm sm:text-base">
                <MapPin className="w-5 h-5 text-brand-yellow shrink-0 mt-1" />
                <p>Marine Drive, Sonar Para Beach, Cox&apos;s Bazar, Bangladesh</p>
              </div>
            </div>

            <div className="border-t border-white/5 pt-6">
              <h3 className="font-bold text-brand-cream text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-yellow" />
                <span>Operating Hours</span>
              </h3>
              <div className="space-y-1.5 text-xs sm:text-sm text-brand-cream/70">
                <div className="flex justify-between">
                  <span>Sunday — Thursday</span>
                  <span className="font-medium text-brand-cream">3:00 PM — 12:00 AM</span>
                </div>
                <div className="flex justify-between">
                  <span>Friday — Saturday</span>
                  <span className="font-medium text-brand-cream">10:00 AM — 12:00 AM</span>
                </div>
              </div>
            </div>

            <a
              href="https://www.google.com/maps/search/?api=1&query=21.290302964726862,92.04676015661319"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full justify-center"
            >
              OPEN IN GOOGLE MAPS
            </a>
          </div>

          <div className="lg:col-span-7">
            <CustomMapEmbed
              embedUrl="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d232.34524772674902!2d92.04676015661319!3d21.290302964726862!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30adc5b2179fe74d%3A0xc66fab6f23703d96!2sBrother%27s%20Bites!5e0!3m2!1sen!2sbd!4v1789874032852!5m2!1sen!2sbd"
              directionsUrl="https://www.google.com/maps/search/?api=1&query=21.290302964726862,92.04676015661319"
              aspectRatio="aspect-[16/10] min-h-[340px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
