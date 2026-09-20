import Skeleton from '@/components/ui/skeleton';

export default function GalleryGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="card-bb aspect-square rounded-xl" />
      ))}
    </div>
  );
}
