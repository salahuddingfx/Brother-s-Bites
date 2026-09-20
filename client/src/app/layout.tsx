import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import OfflineDetector from "@/components/common/OfflineDetector";
import VisitorTracker from "../components/common/VisitorTracker";
import ProductionGuard from "@/components/common/ProductionGuard";
import { MASTER_SEO_KEYWORDS } from "@/lib/seoKeywords";

const inter = Inter({ subsets: ["latin"], variable: "--font-body" });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bbites.salahuddin.codes';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "Brother's Bites",
  appleWebApp: {
    title: "Brother's Bites",
    statusBarStyle: 'default',
    capable: true,
  },
  title: {
    default: "Brother's Bites | Fast Food Restaurant & Beachside Bites | Marine Drive, Cox's Bazar",
    template: "%s | Brother's Bites",
  },
  description:
    "Brother's Bites is a premier beachside fast food restaurant at Marine Drive, Sonar Para Beach, Cox's Bazar. Savor signature steamed chicken momos, wave momos, fried momos, crispy yogurt fuchka, golden shrimp fry, and handcrafted caramel tea.",
  keywords: MASTER_SEO_KEYWORDS,
  authors: [{ name: "Brother's Bites" }],
  creator: "Brother's Bites",
  publisher: "Brother's Bites",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Brother's Bites",
    title: "Brother's Bites | Fast Food Restaurant & Beachside Bites | Cox's Bazar",
    description:
      "Signature Steamed Chicken Momos, Wave Momos, Crispy Fuchka, Golden Shrimp Fry & Caramel Tea on Marine Drive, Sonar Para Beach, Cox's Bazar.",
    images: [
      {
        url: "/images/hero-platter.jpg",
        width: 1200,
        height: 630,
        alt: "Brother's Bites Fast Food Platter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Brother's Bites | Fast Food Restaurant & Beachside Bites",
    description:
      "Signature Steamed Chicken Momos, Wave Momos, Crispy Fuchka & Caramel Tea on Marine Drive, Cox's Bazar.",
    images: ["/images/hero-platter.jpg"],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// Google Search Console Site Name + Restaurant Schema
const jsonLdSchemas = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      "url": SITE_URL,
      "name": "Brother's Bites",
      "alternateName": [
        "Brothers Bites",
        "Brother's Bites Cox's Bazar",
        "Brother's Bites Marine Drive",
        "BBites"
      ],
      "publisher": {
        "@id": `${SITE_URL}/#restaurant`
      }
    },
    {
      "@type": "FastFoodRestaurant",
      "@id": `${SITE_URL}/#restaurant`,
      "name": "Brother's Bites",
      "image": `${SITE_URL}/images/hero-platter.jpg`,
      "url": SITE_URL,
      "telephone": "+8801627817436",
      "priceRange": "৳40 - ৳350",
      "menu": `${SITE_URL}/menu`,
      "servesCuisine": ["Fast Food", "Street Food", "Momos", "Asian", "Beverages"],
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Marine Drive, Sonar Para Beach",
        "addressLocality": "Cox's Bazar",
        "addressRegion": "Chittagong",
        "postalCode": "4700",
        "addressCountry": "BD"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 21.290303,
        "longitude": 92.046760
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
          "opens": "15:00",
          "closes": "00:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Friday", "Saturday"],
          "opens": "10:00",
          "closes": "00:00"
        }
      ],
      "sameAs": [
        "https://facebook.com/brothersbites.bd",
        "https://instagram.com/brothersbites.bd",
        "https://tiktok.com/@brothersbites.bd"
      ],
      "knowsAbout": MASTER_SEO_KEYWORDS.slice(0, 50),
      "keywords": MASTER_SEO_KEYWORDS.join(', ')
    }
  ]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${inter.variable}`} suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchemas) }}
        />
      </head>
      <body className="bg-brand-black text-brand-cream antialiased transition-colors duration-200" suppressHydrationWarning>
        <ThemeProvider>
          <OfflineDetector />
          <VisitorTracker />
          <ProductionGuard />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
