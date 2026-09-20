import Skeleton from '@/components/ui/skeleton';

export default function ReviewCardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card-bb p-6 border border-brand-border space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-20 rounded" />
              <Skeleton className="h-3 w-6 rounded" />
            </div>
            <Skeleton className="h-3 w-12 rounded" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-full rounded" />
            <Skeleton className="h-3 w-full rounded" />
            <Skeleton className="h-3 w-2/3 rounded" />
          </div>
          <div className="pt-3 border-t border-brand-border/60 flex items-center gap-3">
            <Skeleton className="w-7 h-7 rounded-full" />
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-20 rounded" />
              <Skeleton className="h-2.5 w-16 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
