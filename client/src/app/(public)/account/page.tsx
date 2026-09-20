import dynamic from 'next/dynamic';
import Skeleton from '@/components/ui/skeleton';

const AccountContent = dynamic(() => import('./AccountContent'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-brand-black flex items-center justify-center pt-24 pb-16">
      <div className="space-y-4 w-full max-w-6xl mx-auto px-4">
        <div className="bg-brand-surface-light border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-2xl shrink-0" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-40 rounded" />
              <Skeleton className="h-3 w-56 rounded" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
        <Skeleton className="h-64 rounded-3xl" />
      </div>
    </div>
  ),
});

export default function CustomerAccountPage() {
  return <AccountContent />;
}
