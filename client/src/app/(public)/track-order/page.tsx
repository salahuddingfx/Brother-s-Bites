'use client';

import dynamic from 'next/dynamic';
import Skeleton from '@/components/ui/skeleton';

const TrackOrderContent = dynamic(() => import('./TrackOrderContent'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-brand-black pt-24 pb-16">
      <div className="container-bb max-w-2xl mx-auto px-4 space-y-6">
        <Skeleton className="h-6 w-48 rounded mx-auto" />
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    </div>
  ),
});

export default function TrackOrderPage() {
  return <TrackOrderContent />;
}
