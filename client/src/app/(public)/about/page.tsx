import type { Metadata } from 'next';
import Link from 'next/link';
import { Heart, Utensils, MapPin, Coffee } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Story',
  description: "Learn about Brother's Bites — how a shared passion for food and friendship grew into Marine Drive's favorite coastal spot.",
};

const pillars = [
  {
    icon: Utensils,
    title: 'Honest Street Cooking',
    description: 'Fresh ingredients, genuine spices, and bold flavors prepared cleanly without shortcuts.',
  },
  {
    icon: MapPin,
    title: 'Cox’s Bazar Heritage',
    description: 'Grounded on Marine Drive, Sonar Para Beach. Ocean views, golden sunsets, and sea breeze.',
  },
  {
    icon: Coffee,
    title: 'Beachside Sips',
    description: 'Standardized warm Caramel Tea and rich Milk Coffee to complement every beach walk.',
  },
  {
    icon: Heart,
    title: 'The Brotherhood',
    description: 'A genuine gathering place where strangers become friends and friends become family.',
  },
];

export default function AboutPage() {
  return (
    <div className="pb-16 sm:pb-20 pt-4 sm:pt-6">
      {/* Editorial Story Header */}
      <div className="container-bb text-center mb-12 sm:mb-16">
        <p className="eyebrow-bb mb-2">Our Origins & Vision</p>
        <h1 className="heading-page text-brand-cream uppercase mb-4">
          THE BROTHER&apos;S BITES STORY
        </h1>
        <p className="text-brand-cream/70 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          What started as a dream between brothers who loved good food and beach gatherings has grown into a coastal destination along Marine Drive.
        </p>
      </div>

      {/* Main Narrative Section */}
      <section className="container-bb mb-16 sm:mb-20">
        <div className="card-bb bg-brand-surface p-6 sm:p-10 md:p-12 max-w-4xl mx-auto">
          <div className="prose-bb mx-auto space-y-6 text-brand-cream/80 text-sm sm:text-base leading-relaxed">
            <h2 className="heading-section text-brand-cream text-center mb-6">
              Born By The Sea, Built On Brotherhood
            </h2>
            <p>
              Brother&apos;s Bites was founded along the scenic stretch of <strong className="text-brand-yellow font-semibold">Marine Drive at Sonar Para Beach, Cox&apos;s Bazar</strong>. We noticed that while Cox&apos;s Bazar had countless places to eat, finding a spot that combined fresh, authentic street bites, comforting warm beverages, and genuine warmth was rare.
            </p>
            <p>
              We set out to create a place we would want to hang out at every single evening. A kitchen that takes pride in juicy chicken momos with fiery sauces, crispy yogurt fuchka bursting with tangy sweetness, and coastal seafood fried golden crisp.
            </p>
            <p>
              More than the menu, <strong className="text-brand-cream">Brother&apos;s Bites is a feeling</strong>. It is the laughter shared over a steaming cup of Caramel Tea, the sunset watched from the beach side, and the welcoming hospitality extended to every single guest.
            </p>
          </div>
        </div>
      </section>

      {/* Four Core Values */}
      <section className="container-bb mb-16 sm:mb-20">
        <div className="text-center mb-10">
          <p className="eyebrow-bb mb-2">What Drives Us</p>
          <h2 className="heading-section text-brand-cream uppercase">Our Core Values</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div key={pillar.title} className="card-bb p-6 flex flex-col items-start">
                <div className="w-10 h-10 rounded-lg bg-brand-yellow/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-brand-yellow" />
                </div>
                <h3 className="heading-card text-brand-cream mb-2">{pillar.title}</h3>
                <p className="text-brand-cream/60 text-xs sm:text-sm leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Invitation CTA */}
      <section className="container-bb text-center">
        <div className="card-bb bg-brand-surface-light p-8 sm:p-12 max-w-3xl mx-auto border-brand-yellow/20">
          <h2 className="heading-section text-brand-cream mb-3">Come Experience It Yourself</h2>
          <p className="text-brand-cream/60 text-sm sm:text-base max-w-xl mx-auto mb-8">
            Whether you are visiting Cox&apos;s Bazar for the weekend or live locally, our doors are open.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/menu" className="btn-primary">
              EXPLORE OUR MENU
            </Link>
            <Link href="/location" className="btn-secondary">
              GET LOCATION
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
