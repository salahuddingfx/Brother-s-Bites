'use client';

import dynamic from 'next/dynamic';
import Skeleton from '@/components/ui/skeleton';

const CheckoutContent = dynamic(() => import('./CheckoutContent'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-brand-black pt-24 pb-16">
      <div className="container-bb max-w-5xl mx-auto px-4 space-y-6">
        <Skeleton className="h-6 w-48 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
          </div>
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    </div>
  ),
});

export default function CheckoutPage() {
  return <CheckoutContent />;
}
