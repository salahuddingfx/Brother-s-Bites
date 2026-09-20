'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTop from '@/components/common/ScrollToTop';
import CartDrawer from '@/components/cart/CartDrawer';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col bg-brand-black text-brand-cream relative">
          <Navbar />
          <main className={isHome ? 'flex-1 w-full min-w-0' : 'flex-1 pt-14 sm:pt-16 md:pt-20 w-full min-w-0'}>
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <ScrollToTop />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
