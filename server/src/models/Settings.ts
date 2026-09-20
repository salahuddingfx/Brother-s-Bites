import mongoose, { Document, Schema } from 'mongoose';

export interface ISettings extends Document {
  businessName: string;
  tagline: string;
  phone: string[];
  whatsapp?: string;
  instagram?: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zip: string;
  };
  googleMapsUrl?: string;
  openingHours: {
    day: string;
    open: string;
    close: string;
    isClosed: boolean;
  }[];
  grandOpening: {
    isEnabled: boolean;
    title: string;
    date: string;
    description: string;
    ctaText: string;
  };
  socialLinks: {
    facebook: string;
    instagram: string;
    tiktok: string;
  };
  hero: {
    isEnabled: boolean;
    locationPill: string;
    headline: string;
    subtitle: string;
    ctaPrimaryLabel: string;
    ctaPrimaryLink: string;
    ctaSecondaryLabel: string;
    ctaSecondaryLink: string;
    trustBadges: { label: string }[];
    image?: string;
    bottomBadgeTitle: string;
    bottomBadgeSubtitle: string;
    ctaBottomLabel: string;
    ctaBottomLink: string;
    floatingBadge: string;
  };
  signatureBites: {
    isEnabled: boolean;
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaLabel: string;
    ctaLink: string;
  };
  drinks: {
    isEnabled: boolean;
    eyebrow: string;
    title: string;
    subtitle: string;
    items: {
      name: string;
      description: string;
      servingSize: string;
      price: number;
      icon: string;
    }[];
    ctaLabel: string;
    ctaLink: string;
  };
  whyUs: {
    isEnabled: boolean;
    eyebrow: string;
    title: string;
    subtitle: string;
    features: {
      icon: string;
      title: string;
      description: string;
    }[];
  };
  brotherhood: {
    isEnabled: boolean;
    eyebrow: string;
    title: string;
    titleAccent: string;
    description: string;
    ctaLabel: string;
    ctaLink: string;
  };
  location: {
    isEnabled: boolean;
    eyebrow: string;
    title: string;
    subtitle: string;
    embedMapUrl: string;
    directionsUrl: string;
  };
  contactCTA: {
    isEnabled: boolean;
    eyebrow: string;
    title: string;
    description: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const settingsSchema = new Schema<ISettings>(
  {
    businessName: { type: String, default: "Brother's Bites" },
    tagline: { type: String, default: 'BITES • SIPS • BROTHERHOOD' },
    phone: { type: [String], default: [] },
    whatsapp: { type: String },
    instagram: { type: String },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      country: { type: String, default: '' },
      zip: { type: String, default: '' },
    },
    googleMapsUrl: { type: String, default: 'https://www.google.com/maps/search/?api=1&query=21.290302964726862,92.04676015661319' },
    openingHours: [
      {
        day: { type: String },
        open: { type: String },
        close: { type: String },
        isClosed: { type: Boolean, default: false },
      },
    ],
    grandOpening: {
      isEnabled: { type: Boolean, default: false },
      title: { type: String, default: '' },
      date: { type: String, default: '' },
      description: { type: String, default: '' },
      ctaText: { type: String, default: '' },
    },
    socialLinks: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      tiktok: { type: String, default: '' },
    },
    hero: {
      isEnabled: { type: Boolean, default: true },
      locationPill: { type: String, default: 'Marine Drive • Cox\'s Bazar' },
      headline: { type: String, default: 'FRESH BITES. CHILLED SIPS. TRUE BROTHERHOOD.' },
      subtitle: { type: String, default: 'Savor steamed chicken momos, crunchy yogurt fuchka, golden shrimp fry...' },
      ctaPrimaryLabel: { type: String, default: 'EXPLORE MENU' },
      ctaPrimaryLink: { type: String, default: '/menu' },
      ctaSecondaryLabel: { type: String, default: 'FIND OUR SPOT' },
      ctaSecondaryLink: { type: String, default: '/location' },
      trustBadges: {
        type: [{ label: { type: String, default: '' } }],
        default: [{ label: 'Made to Order' }, { label: 'Standard Portions' }, { label: 'Beachside Vibe' }],
      },
      image: { type: String, default: '/images/hero-platter.jpg' },
      bottomBadgeTitle: { type: String, default: 'Coastal Beachside Kitchen' },
      bottomBadgeSubtitle: { type: String, default: 'Open Sun-Thu 3PM-12AM · Fri-Sat 10AM-12AM' },
      ctaBottomLabel: { type: String, default: 'Order Now' },
      ctaBottomLink: { type: String, default: '/menu' },
      floatingBadge: { type: String, default: 'Top Favorites: Momos, Fuchka, Tea' },
    },
    signatureBites: {
      isEnabled: { type: Boolean, default: true },
      eyebrow: { type: String, default: "Chef's Selection" },
      title: { type: String, default: 'OUR SIGNATURE BITES' },
      subtitle: { type: String, default: "The crowd favorites that define the Brother's Bites experience." },
      ctaLabel: { type: String, default: 'EXPLORE FULL MENU' },
      ctaLink: { type: String, default: '/menu' },
    },
    drinks: {
      isEnabled: { type: Boolean, default: true },
      eyebrow: { type: String, default: 'Chilled & Warm Sips' },
      title: { type: String, default: 'REFRESHING DRINKS' },
      subtitle: { type: String, default: 'All handcrafted drink servings are standardized to 100g for optimal flavor.' },
      items: {
        type: [
          {
            name: { type: String, default: '' },
            description: { type: String, default: '' },
            servingSize: { type: String, default: '100g serving' },
            price: { type: Number, default: 0 },
            icon: { type: String, default: 'Coffee' },
          },
        ],
        default: [
          { name: 'Signature Caramel Tea', description: 'Slow-cooked sugar caramel infused with creamy cow milk and rich tea leaves. The ultimate beachside warmer.', servingSize: '100g serving', price: 40, icon: 'CupSoda' },
          { name: 'Creamy Milk Coffee', description: 'Smooth coffee blend brewed with fresh whole milk. Warm, rich, and comforting as the ocean breeze rolls in.', servingSize: '100g serving', price: 50, icon: 'Coffee' },
        ],
      },
      ctaLabel: { type: String, default: 'EXPLORE ALL DRINKS' },
      ctaLink: { type: String, default: '/menu' },
    },
    whyUs: {
      isEnabled: { type: Boolean, default: true },
      eyebrow: { type: String, default: 'The Standard' },
      title: { type: String, default: "WHY BROTHER'S BITES" },
      subtitle: { type: String, default: 'Committed to great quality, honest pricing, and genuine coastal vibes.' },
      features: {
        type: [
          {
            icon: { type: String, default: 'Utensils' },
            title: { type: String, default: '' },
            description: { type: String, default: '' },
          },
        ],
        default: [
          { icon: 'Utensils', title: 'Fresh & Honest Flavors', description: 'Every single plate is cooked to order using quality spices, fresh meat, and coastal produce.' },
          { icon: 'MapPin', title: 'Marine Drive Location', description: 'Situated at Sonar Para Beach, enjoy bites right with the ocean breeze and golden sunset.' },
          { icon: 'Users', title: 'Warm Brotherhood', description: 'A welcoming space for friends, families, and travelers. Where good food builds community.' },
          { icon: 'Sparkles', title: 'Fast & Hygienic', description: 'Spotless preparation standards ensuring you get fresh, hot, and hygienic food every visit.' },
        ],
      },
    },
    brotherhood: {
      isEnabled: { type: Boolean, default: true },
      eyebrow: { type: String, default: 'Our Core Spirit' },
      title: { type: String, default: 'MORE THAN JUST A BITE.' },
      titleAccent: { type: String, default: "IT'S A BROTHERHOOD." },
      description: { type: String, default: "Born from friendship and a love for great street food, Brother's Bites is designed to be a welcoming gathering spot along Marine Drive. Where locals and travelers share conversations, authentic recipes, and beachside memories." },
      ctaLabel: { type: String, default: 'READ OUR FULL STORY' },
      ctaLink: { type: String, default: '/about' },
    },
    location: {
      isEnabled: { type: Boolean, default: true },
      eyebrow: { type: String, default: "Marine Drive, Cox's Bazar" },
      title: { type: String, default: 'FIND OUR RESTAURANT' },
      subtitle: { type: String, default: 'Located right by the scenic coastal stretch of Sonar Para Beach.' },
      embedMapUrl: { type: String, default: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d232.34524772674902!2d92.04676015661319!3d21.290302964726862!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30adc5b2179fe74d%3A0xc66fab6f23703d96!2sBrother%27s%20Bites!5e0!3m2!1sen!2sbd!4v1789874032852!5m2!1sen!2sbd' },
      directionsUrl: { type: String, default: 'https://www.google.com/maps/search/?api=1&query=21.290302964726862,92.04676015661319' },
    },
    contactCTA: {
      isEnabled: { type: Boolean, default: true },
      eyebrow: { type: String, default: 'Visit Us Today' },
      title: { type: String, default: 'Ready to Taste The Brotherhood?' },
      description: { type: String, default: "Marine Drive, Sonar Para Beach, Cox's Bazar. Stop by for fresh food and sea breeze." },
    },
  },
  { timestamps: true }
);

settingsSchema.statics.getInstance = async function (): Promise<ISettings> {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

export default mongoose.model<ISettings>('Settings', settingsSchema);
