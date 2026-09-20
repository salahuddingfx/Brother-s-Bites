import Skeleton from '@/components/ui/skeleton';

export default function MenuItemDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      {/* Left: Image */}
      <div className="lg:col-span-6 space-y-3.5">
        <Skeleton className="card-bb aspect-[4/3] rounded-xl" />
        <div className="flex items-center gap-2.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="w-20 h-16 rounded-lg shrink-0" />
          ))}
        </div>
      </div>

      {/* Right: Info */}
      <div className="lg:col-span-6 space-y-6">
        <div className="space-y-3">
          <Skeleton className="h-3 w-20 rounded-full" />
          <Skeleton className="h-8 w-3/4 rounded" />
        </div>

        <div className="flex items-center gap-4 pb-6 mb-6 border-b border-brand-cream/10">
          <Skeleton className="h-10 w-20 rounded" />
          <Skeleton className="h-6 w-px" />
          <Skeleton className="h-5 w-28 rounded-full" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-3 w-28 rounded" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-2/3 rounded" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card-bb p-3 flex items-center gap-2.5">
              <Skeleton className="w-4 h-4 rounded" />
              <Skeleton className="h-3 w-20 rounded" />
            </div>
          ))}
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row gap-3">
            <Skeleton className="h-12 flex-1 rounded-xl" />
            <Skeleton className="h-12 w-32 rounded-xl" />
            <Skeleton className="h-12 w-28 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
