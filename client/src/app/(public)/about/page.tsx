import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Utensils, MapPin, Coffee, ChefHat, Sparkles, Flame, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Story & Kitchen Masters',
  description: "Meet Main Chef Ahammad Bin Kashem, Assistant Chef Sahed Mostafa, and the story behind Brother's Bites on Marine Drive.",
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

const teamMembers = [
  {
    name: 'Ahammad Bin Kashem',
    role: 'Main Chef & Culinary Lead',
    badge: 'Head Chef',
    image: '/images/team/chef-ahammad.jpg',
    bio: 'The creative culinary force behind Brother’s Bites signature recipes. From crafting our secret spicy chili chutneys to perfecting tender chicken momos and coastal delicacies, Chef Ahammad ensures every single plate is cooked to perfection.',
    specialties: ['Signature Chicken Momos', 'Secret Chili Chutney', 'Authentic Spice Blends'],
  },
  {
    name: 'Sahed Mostafa',
    role: 'Assistant Chef',
    badge: 'Assistant Chef',
    image: '/images/team/assistant-chef-sahed.jpg',
    bio: 'Bringing dedication, precision, and passion to the kitchen line. Chef Sahed masters the grill and fry stations, serving up golden crisp seafood, mouth-watering street bites, and keeping the kitchen in harmonious rhythm.',
    specialties: ['Crispy Shrimp & Seafood', 'Yogurt Fuchka Prep', 'Fresh Station Management'],
  },
];

const kitchenMoments = [
  {
    image: '/images/team/kitchen-action.jpg',
    title: 'Fresh Preparation',
    desc: 'Cooked fresh on order with strict hygiene and pure passion.',
  },
  {
    image: '/images/team/team-brotherhood.jpg',
    title: 'The Brotherhood Spirit',
    desc: 'A united team crafting memorable beachside experiences.',
  },
  {
    image: '/images/shop/shop-7.jpg',
    title: 'Marine Drive Stall',
    desc: 'Located at Sonar Para Beach, right where the waves crash.',
  },
  {
    image: '/images/shop/shop-1.jpg',
    title: 'Street Cooking Art',
    desc: 'Real coastal flavors cooked in front of your eyes.',
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
          What started as a dream between brothers who loved good food and beach gatherings has grown into a vibrant coastal destination along Marine Drive.
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

      {/* Meet The Kitchen Masters Section */}
      <section className="container-bb mb-16 sm:mb-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-yellow/10 border border-brand-yellow/20 text-brand-yellow text-xs font-bold uppercase tracking-wider mb-3">
            <ChefHat className="w-4 h-4" />
            Culinary Craftsmanship
          </div>
          <h2 className="heading-section text-brand-cream uppercase mb-3">
            MEET THE KITCHEN MASTERS
          </h2>
          <p className="text-brand-cream/60 text-sm sm:text-base max-w-2xl mx-auto">
            The hands and hearts behind every dish served at Brother&apos;s Bites.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="card-bb bg-gradient-to-b from-brand-surface to-brand-surface-light p-6 sm:p-8 flex flex-col justify-between border-brand-border/60 hover:border-brand-yellow/40 transition-all duration-300 group shadow-xl"
            >
              <div>
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-6 border border-white/10 group-hover:border-brand-yellow/30 transition-colors">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute top-3 left-3 bg-brand-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-brand-yellow/30 flex items-center gap-1.5 shadow-lg">
                    <Sparkles className="w-3.5 h-3.5 text-brand-yellow" />
                    <span className="text-xs font-bold text-brand-yellow uppercase tracking-wide">
                      {member.badge}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-brand-cream tracking-tight mb-1">
                  {member.name}
                </h3>
                <p className="text-brand-yellow text-xs sm:text-sm font-semibold uppercase tracking-wider mb-4">
                  {member.role}
                </p>
                <p className="text-brand-cream/70 text-xs sm:text-sm leading-relaxed mb-6">
                  {member.bio}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5">
                <p className="text-[11px] font-bold text-brand-cream/50 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-brand-yellow" />
                  Key Specialties:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {member.specialties.map((spec) => (
                    <span
                      key={spec}
                      className="px-2.5 py-1 rounded-md bg-brand-black/60 border border-brand-border text-brand-cream/80 text-[11px] font-medium"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Kitchen & Stand In Action Showcase */}
      <section className="container-bb mb-16 sm:mb-20">
        <div className="text-center mb-10">
          <p className="eyebrow-bb mb-2">Behind The Scenes</p>
          <h2 className="heading-section text-brand-cream uppercase mb-3">
            IN THE HEAT OF THE KITCHEN
          </h2>
          <p className="text-brand-cream/60 text-sm sm:text-base max-w-xl mx-auto">
            Real moments from our beachside shop, live cooking prep, and brotherhood camaraderie.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {kitchenMoments.map((item, idx) => (
            <div
              key={idx}
              className="card-bb relative aspect-square overflow-hidden group border-brand-border/60 hover:border-brand-yellow/40 transition-all"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-brand-black/30 to-transparent flex flex-col justify-end p-4">
                <span className="text-brand-yellow text-xs font-bold uppercase tracking-wider mb-0.5">
                  {item.title}
                </span>
                <p className="text-brand-cream/80 text-xs line-clamp-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
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
          <div className="w-12 h-12 rounded-full bg-brand-yellow/10 border border-brand-yellow/30 flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-brand-yellow" />
          </div>
          <h2 className="heading-section text-brand-cream mb-3">Come Experience The Brotherhood</h2>
          <p className="text-brand-cream/60 text-sm sm:text-base max-w-xl mx-auto mb-8">
            Whether you are visiting Cox&apos;s Bazar for the weekend or live locally on Marine Drive, Chef Ahammad, Chef Sahed, and our whole team are ready to welcome you.
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
