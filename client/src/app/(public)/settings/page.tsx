'use client';

import dynamic from 'next/dynamic';
import Skeleton from '@/components/ui/skeleton';

const SettingsContent = dynamic(() => import('./SettingsContent'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-brand-black pt-24 pb-16">
      <div className="container-bb max-w-2xl mx-auto px-4 space-y-6">
        <Skeleton className="h-6 w-32 rounded" />
        <Skeleton className="h-4 w-64 rounded" />
        <div className="space-y-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3.5 w-24 rounded" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ))}
        </div>
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
    </div>
  ),
});

export default function SettingsPage() {
  return <SettingsContent />;
}
