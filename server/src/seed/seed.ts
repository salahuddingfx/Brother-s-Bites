import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { config } from '../config';
import User from '../models/User';
import Settings from '../models/Settings';
import Category from '../models/Category';
import MenuItem from '../models/MenuItem';
import Offer from '../models/Offer';
import Review from '../models/Review';
import Order from '../models/Order';
import Cart from '../models/Cart';
import Gallery from '../models/Gallery';

const seed = async (): Promise<void> => {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Settings.deleteMany({}),
      Category.deleteMany({}),
      MenuItem.deleteMany({}),
      Offer.deleteMany({}),
      Review.deleteMany({}),
      Order.deleteMany({}),
      Cart.deleteMany({}),
      Gallery.deleteMany({}),
    ]);
    console.log('Cleared existing data');

    // Create super admin user
    const admin = await User.create({
      name: 'Super Admin',
      username: 'admin',
      email: 'admin@brothersbites.com',
      password: 'admin123',
      role: 'super_admin',
      isActive: true,
    });
    console.log(`Admin user created: ${admin.email} (Username: admin)`);

    // Create default settings
    await Settings.create({
      businessName: "Brother's Bites",
      tagline: 'BITES • SIPS • BROTHERHOOD',
      phone: ['+8801712345678'],
      whatsapp: '+8801712345678',
      instagram: 'brothersbites',
      address: {
        street: '123 Food Street',
        city: 'Dhaka',
        state: 'Dhaka',
        country: 'Bangladesh',
        zip: '1200',
      },
      googleMapsUrl: 'https://maps.google.com/?q=23.8103,90.4125',
      openingHours: [
        { day: 'Sunday', open: '3:00 PM', close: '12:00 AM', isClosed: false },
        { day: 'Monday', open: '3:00 PM', close: '12:00 AM', isClosed: false },
        { day: 'Tuesday', open: '3:00 PM', close: '12:00 AM', isClosed: false },
        { day: 'Wednesday', open: '3:00 PM', close: '12:00 AM', isClosed: false },
        { day: 'Thursday', open: '3:00 PM', close: '12:00 AM', isClosed: false },
        { day: 'Friday', open: '10:00 AM', close: '12:00 AM', isClosed: false },
        { day: 'Saturday', open: '10:00 AM', close: '12:00 AM', isClosed: false },
      ],
      grandOpening: {
        isEnabled: true,
        title: 'Grand Opening',
        date: '2024-01-01',
        description: 'Brother\'s Bites is now open! Come and taste the difference.',
        ctaText: 'Visit Us Now',
      },
      socialLinks: {
        facebook: 'https://facebook.com/brothersbites.bd',
        instagram: 'https://instagram.com/brothersbites.bd',
        tiktok: 'https://tiktok.com/@brothersbites.bd',
      },
      hero: {
        isEnabled: true,
        locationPill: "Marine Drive • Cox's Bazar",
        headline: 'FRESH BITES. CHILLED SIPS. TRUE BROTHERHOOD.',
        subtitle: 'Savor steamed chicken momos, crunchy yogurt fuchka, golden shrimp fry...',
        ctaPrimaryLabel: 'EXPLORE MENU',
        ctaPrimaryLink: '/menu',
        ctaSecondaryLabel: 'FIND OUR SPOT',
        ctaSecondaryLink: '/location',
        trustBadges: [{ label: 'Made to Order' }, { label: 'Standard Portions' }, { label: 'Beachside Vibe' }],
        image: '/images/hero-platter.jpg',
        bottomBadgeTitle: 'Coastal Beachside Kitchen',
        bottomBadgeSubtitle: 'Open Sun-Thu 3PM-12AM · Fri-Sat 10AM-12AM',
        ctaBottomLabel: 'Order Now',
        ctaBottomLink: '/menu',
        floatingBadge: 'Top Favorites: Momos, Fuchka, Tea',
      },
      signatureBites: {
        isEnabled: true,
        eyebrow: "Chef's Selection",
        title: 'OUR SIGNATURE BITES',
        subtitle: "The crowd favorites that define the Brother's Bites experience.",
        ctaLabel: 'EXPLORE FULL MENU',
        ctaLink: '/menu',
      },
      drinks: {
        isEnabled: true,
        eyebrow: 'Chilled & Warm Sips',
        title: 'REFRESHING DRINKS',
        subtitle: 'All handcrafted drink servings are standardized to 100g for optimal flavor.',
        items: [
          { name: 'Signature Caramel Tea', description: 'Slow-cooked sugar caramel infused with creamy cow milk and rich tea leaves. The ultimate beachside warmer.', servingSize: '100g serving', price: 40, icon: 'CupSoda' },
          { name: 'Creamy Milk Coffee', description: 'Smooth coffee blend brewed with fresh whole milk. Warm, rich, and comforting as the ocean breeze rolls in.', servingSize: '100g serving', price: 50, icon: 'Coffee' },
        ],
        ctaLabel: 'EXPLORE ALL DRINKS',
        ctaLink: '/menu',
      },
      whyUs: {
        isEnabled: true,
        eyebrow: 'The Standard',
        title: "WHY BROTHER'S BITES",
        subtitle: 'Committed to great quality, honest pricing, and genuine coastal vibes.',
        features: [
          { icon: 'Utensils', title: 'Fresh & Honest Flavors', description: 'Every single plate is cooked to order using quality spices, fresh meat, and coastal produce.' },
          { icon: 'MapPin', title: 'Marine Drive Location', description: 'Situated at Sonar Para Beach, enjoy bites right with the ocean breeze and golden sunset.' },
          { icon: 'Users', title: 'Warm Brotherhood', description: 'A welcoming space for friends, families, and travelers. Where good food builds community.' },
          { icon: 'Sparkles', title: 'Fast & Hygienic', description: 'Spotless preparation standards ensuring you get fresh, hot, and hygienic food every visit.' },
        ],
      },
      brotherhood: {
        isEnabled: true,
        eyebrow: 'Our Core Spirit',
        title: 'MORE THAN JUST A BITE.',
        titleAccent: "IT'S A BROTHERHOOD.",
        description: "Born from friendship and a love for great street food, Brother's Bites is designed to be a welcoming gathering spot along Marine Drive. Where locals and travelers share conversations, authentic recipes, and beachside memories.",
        ctaLabel: 'READ OUR FULL STORY',
        ctaLink: '/about',
      },
      location: {
        isEnabled: true,
        eyebrow: "Marine Drive, Cox's Bazar",
        title: 'FIND OUR RESTAURANT',
        subtitle: 'Located right by the scenic coastal stretch of Sonar Para Beach.',
        embedMapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3686.0!2d91.9!3d21.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDI0JzAwLjAiTiA5McKwNTQnMDAuMCJF!5e0!3m2!1sen!2sbd!4v1234567890',
        directionsUrl: "https://www.google.com/maps/search/Marine+Drive+Sonar+Para+Beach+Cox's+Bazar",
      },
      contactCTA: {
        isEnabled: true,
        eyebrow: 'Visit Us Today',
        title: 'Ready to Taste The Brotherhood?',
        description: "Marine Drive, Sonar Para Beach, Cox's Bazar. Stop by for fresh food and sea breeze.",
      },
    });
    console.log('Default settings created');

    // Create categories
    const categories = await Category.create([
      { name: 'Bites', slug: 'bites', sortOrder: 1 },
      { name: 'Momos', slug: 'momos', sortOrder: 2 },
      { name: 'Fuchka', slug: 'fuchka', sortOrder: 3 },
      { name: 'Chicken', slug: 'chicken', sortOrder: 4 },
      { name: 'Seafood', slug: 'seafood', sortOrder: 5 },
      { name: 'Drinks', slug: 'drinks', sortOrder: 6 },
      { name: 'Tea', slug: 'tea', sortOrder: 7 },
      { name: 'Coffee', slug: 'coffee', sortOrder: 8 },
      { name: 'Specials', slug: 'specials', sortOrder: 9 },
    ]);
    console.log('Categories created');

    // Create sample menu items
    const menuItems = [
      {
        name: 'Chicken Momos',
        slug: 'chicken-momos',
        description: 'Steamed chicken momos served with spicy chili garlic chutney and hot broth.',
        price: 180,
        category: categories.find((c) => c.slug === 'momos')?._id,
        servingSize: '6 pieces',
        image: '/images/Steam Momo.png',
        isAvailable: true,
        isFeatured: true,
        sortOrder: 1,
      },
      {
        name: 'Yogurt Fuchka',
        slug: 'yogurt-fuchka',
        description: 'Crispy puchka filled with spiced potatoes, sweet tangy yogurt, coriander, and tamarind glaze.',
        price: 80,
        category: categories.find((c) => c.slug === 'fuchka')?._id,
        servingSize: '8 pieces',
        image: '/images/Steam Momo.png',
        isAvailable: true,
        isFeatured: true,
        sortOrder: 2,
      },
      {
        name: 'Shrimp Fry',
        slug: 'shrimp-fry',
        description: 'Crispy batter fried coastal prawns tossed with aromatic spices and homemade tartar dip.',
        price: 250,
        category: categories.find((c) => c.slug === 'seafood')?._id,
        servingSize: '1 plate',
        image: '/images/Steam Momo.png',
        isAvailable: true,
        isFeatured: true,
        sortOrder: 3,
      },
      {
        name: 'Thai Spicy Chicken',
        slug: 'thai-spicy-chicken',
        description: 'Tender chicken bites stir-fried with bird eye chili, fresh basil, and savory oyster reduction.',
        price: 220,
        category: categories.find((c) => c.slug === 'chicken')?._id,
        servingSize: '1 plate',
        image: '/images/Steam Momo.png',
        isAvailable: true,
        isFeatured: true,
        sortOrder: 4,
      },
      {
        name: 'Signature Caramel Tea',
        slug: 'signature-caramel-tea',
        description: 'Slow-cooked sugar caramel infused with creamy cow milk and rich tea leaves.',
        price: 40,
        category: categories.find((c) => c.slug === 'drinks')?._id,
        servingSize: '100g serving',
        image: '/images/Steam Momo.png',
        isAvailable: true,
        isFeatured: true,
        sortOrder: 5,
      },
      {
        name: 'Creamy Milk Coffee',
        slug: 'creamy-milk-coffee',
        description: 'Smooth coffee blend brewed with fresh whole milk. Warm, rich, and comforting.',
        price: 50,
        category: categories.find((c) => c.slug === 'drinks')?._id,
        servingSize: '100g serving',
        image: '/images/Steam Momo.png',
        isAvailable: true,
        isFeatured: false,
        sortOrder: 6,
      },
    ];

    await MenuItem.create(menuItems);
    console.log('Menu items created');

    // Create default grand opening offer
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    await Offer.create({
      title: 'Grand Opening Offer',
      description: 'Celebrate our grand opening with special discounts on all items!',
      discount: '20% OFF on all items',
      startDate: today,
      endDate: nextMonth,
      isActive: true,
      sortOrder: 1,
    });
    console.log('Default offer created');

    console.log('\n✅ Seed completed successfully!');
    console.log(`Admin login: admin@brothersbites.com / admin123`);

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
