import Skeleton from '@/components/ui/skeleton';

export default function OrderDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Skeleton className="w-5 h-5 rounded" />
        <div className="space-y-1.5">
          <Skeleton className="h-7 w-36 rounded" />
          <Skeleton className="h-4 w-40 rounded" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Info */}
        <div className="bg-brand-surface-light rounded-xl border border-white/10 p-6 space-y-4">
          <Skeleton className="h-5 w-32 rounded" />
          <Skeleton className="h-4 w-28 rounded" />
          <Skeleton className="h-4 w-36 rounded" />
          <Skeleton className="h-4 w-48 rounded" />
        </div>

        {/* Order Info */}
        <div className="bg-brand-surface-light rounded-xl border border-white/10 p-6 space-y-4">
          <Skeleton className="h-5 w-24 rounded" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex justify-between">
              <Skeleton className="h-3.5 w-20 rounded" />
              <Skeleton className="h-3.5 w-16 rounded" />
            </div>
          ))}
        </div>

        {/* Status */}
        <div className="bg-brand-surface-light rounded-xl border border-white/10 p-6 space-y-4">
          <Skeleton className="h-5 w-16 rounded" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-9 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Items */}
        <div className="bg-brand-surface-light rounded-xl border border-white/10 p-6 space-y-4">
          <Skeleton className="h-5 w-12 rounded" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-brand-surface rounded-lg">
              <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-24 rounded" />
                <Skeleton className="h-2.5 w-16 rounded" />
              </div>
              <div className="text-right space-y-1">
                <Skeleton className="h-3.5 w-6 rounded ml-auto" />
                <Skeleton className="h-3.5 w-10 rounded ml-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
