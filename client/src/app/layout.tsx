import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import OfflineDetector from "@/components/common/OfflineDetector";

const inter = Inter({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://brothers-bites.salahuddin.codes'),
  title: {
    default: "Brother's Bites | Bites • Sips • Brotherhood",
    template: "%s | Brother's Bites",
  },
  description: "Brother's Bites - Premium bites, chilled sips, and great vibes at Marine Drive, Sonar Para Beach, Cox's Bazar. Chicken Momos, Yogurt Fuchka, Shrimp Fry, and more.",
  keywords: ["Brother's Bites", "Cox's Bazar restaurant", "Marine Drive food", "Chicken Momos", "Yogurt Fuchka", "Shrimp Fry", "Thai Spicy Chicken", "beach restaurant", "Cox's Bazar food"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Brother's Bites",
    title: "Brother's Bites | Bites • Sips • Brotherhood",
    description: "Premium bites, chilled sips, and great vibes at Marine Drive, Sonar Para Beach, Cox's Bazar.",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Brother's Bites | Bites • Sips • Brotherhood",
    description: "Premium bites, chilled sips, and great vibes at Marine Drive, Sonar Para Beach, Cox's Bazar.",
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/images/logo-icon.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/logo-icon.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/images/logo-icon.png',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${inter.variable}`} suppressHydrationWarning data-scroll-behavior="smooth">
      <body className="bg-brand-black text-brand-cream antialiased transition-colors duration-200" suppressHydrationWarning>
        <ThemeProvider>
          <OfflineDetector />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
