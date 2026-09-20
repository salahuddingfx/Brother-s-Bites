import Skeleton from '@/components/ui/skeleton';

export default function OfferCardSkeleton({ count = 2 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card-bb overflow-hidden border border-brand-border">
          <Skeleton className="aspect-[16/9] rounded-none" />
          <div className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-24 rounded" />
              <Skeleton className="h-5 w-14 rounded" />
            </div>
            <Skeleton className="h-6 w-3/4 rounded" />
            <Skeleton className="h-3 w-full rounded" />
            <Skeleton className="h-3 w-2/3 rounded" />
            <div className="pt-4 border-t border-white/5">
              <Skeleton className="h-3 w-40 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
