export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  category: Category | string;
  servingSize?: string;
  image?: string;
  images?: string[];
  isAvailable: boolean;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Offer {
  _id: string;
  title: string;
  description?: string;
  discount?: string;
  image?: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  sortOrder: number;
  isExpired?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryImage {
  _id: string;
  title?: string;
  image: string;
  category: 'all' | 'food' | 'place' | 'vibe';
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface OpeningHours {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
}

export interface Settings {
  _id: string;
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
  openingHours: OpeningHours[];
  grandOpening: {
    isEnabled: boolean;
    title: string;
    date: string;
    description: string;
    ctaText: string;
  };
  socialLinks: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
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
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'super_admin' | 'admin' | 'manager' | 'staff' | 'customer';

export interface UserAddress {
  street?: string;
  city?: string;
  area?: string;
  landmark?: string;
}

export interface User {
  _id: string;
  name: string;
  username?: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: UserAddress;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  _id: string;
  menuItem: MenuItem | string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  specialInstructions?: string;
}

export interface Cart {
  _id: string;
  sessionId: string;
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  menuItem: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  specialInstructions?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user?: string | User;
  customer: {
    name: string;
    phone: string;
    email?: string;
    address?: {
      street: string;
      city: string;
      area?: string;
      landmark?: string;
    };
  };
  items: OrderItem[];
  deliveryFee?: number;
  totalAmount: number;
  totalItems: number;
  orderType: 'delivery' | 'pickup';
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
  paymentMethod: 'cash' | 'counter';
  paymentStatus: 'pending' | 'paid' | 'cancelled';
  specialNotes?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  todayOrders: number;
  todayRevenue: number;
}

export interface Review {
  _id: string;
  customerName: string;
  customerPhone?: string;
  rating: number;
  comment: string;
  dishRecommended?: string;
  menuItem?: MenuItem | string;
  orderNumber?: string;
  isApproved: boolean;
  isFeatured: boolean;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewStats {
  average: number;
  total: number;
  breakdown: Record<number, number>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
