import Skeleton from '@/components/ui/skeleton';

export function HeroSectionSkeleton() {
  return (
    <section className="relative overflow-hidden bg-brand-black border-b border-brand-cream/10 h-[550px] max-h-[550px] flex flex-col justify-center">
      <div className="container-bb relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="flex items-center gap-2">
              <Skeleton className="h-7 w-36 rounded-full" />
              <Skeleton className="h-7 w-24 rounded-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-8 w-3/4 rounded" />
              <Skeleton className="h-8 w-1/2 rounded" />
            </div>
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-2/3 rounded" />
            <div className="flex gap-3">
              <Skeleton className="h-10 w-32 rounded-lg" />
              <Skeleton className="h-10 w-28 rounded-lg" />
            </div>
            <div className="flex gap-6 pt-3 border-t border-brand-border">
              <Skeleton className="h-3 w-20 rounded" />
              <Skeleton className="h-3 w-24 rounded" />
              <Skeleton className="h-3 w-20 rounded" />
            </div>
          </div>
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <Skeleton className="w-full max-w-[460px] h-[280px] rounded-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function SectionContentSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-full rounded" />
      ))}
    </div>
  );
}

export function CardGridSkeleton({ count = 4, cols = 4 }: { count?: number; cols?: number }) {
  const colClass = {
    2: 'md:grid-cols-2',
    4: 'lg:grid-cols-4',
  }[cols] || 'lg:grid-cols-4';

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${colClass} gap-6`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card-bb p-6 space-y-4">
          <Skeleton className="w-11 h-11 rounded-lg" />
          <Skeleton className="h-5 w-2/3 rounded" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-full rounded" />
            <Skeleton className="h-3 w-full rounded" />
            <Skeleton className="h-3 w-1/2 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DrinksSectionSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="card-bb p-6 sm:p-8 space-y-4">
          <div className="flex items-start gap-4">
            <Skeleton className="w-12 h-12 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-2/3 rounded" />
              <Skeleton className="h-3 w-full rounded" />
              <Skeleton className="h-3 w-3/4 rounded" />
            </div>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-brand-cream/10">
            <Skeleton className="h-6 w-24 rounded" />
            <Skeleton className="h-6 w-12 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function LocationSectionSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
      <div className="lg:col-span-6 order-2 lg:order-1">
        <Skeleton className="aspect-[4/3] min-h-[320px] rounded-xl" />
      </div>
      <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-3 w-32 rounded-full" />
          <Skeleton className="h-7 w-48 rounded" />
          <Skeleton className="h-4 w-64 rounded" />
        </div>
        <div className="card-bb p-5 flex items-start gap-4">
          <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-3 w-24 rounded" />
            <Skeleton className="h-4 w-full rounded" />
          </div>
        </div>
        <div className="card-bb p-5 flex items-start gap-4">
          <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-3 w-24 rounded" />
            <Skeleton className="h-3 w-full rounded" />
            <Skeleton className="h-3 w-3/4 rounded" />
          </div>
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-36 rounded-lg" />
          <Skeleton className="h-10 w-36 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function ContactCTASkeleton() {
  return (
    <div className="max-w-2xl mx-auto text-center space-y-4">
      <Skeleton className="h-3 w-24 rounded-full mx-auto" />
      <Skeleton className="h-7 w-64 rounded mx-auto" />
      <Skeleton className="h-4 w-80 rounded mx-auto" />
      <div className="flex justify-center gap-3 pt-4">
        <Skeleton className="h-11 w-24 rounded-lg" />
        <Skeleton className="h-11 w-24 rounded-lg" />
        <Skeleton className="h-11 w-24 rounded-lg" />
        <Skeleton className="h-11 w-24 rounded-lg" />
      </div>
    </div>
  );
}

export function GrandOpeningSkeleton() {
  return (
    <div className="max-w-3xl mx-auto text-center space-y-6">
      <Skeleton className="h-6 w-32 rounded-full mx-auto" />
      <Skeleton className="h-3 w-36 rounded mx-auto" />
      <Skeleton className="h-8 w-48 rounded mx-auto" />
      <div className="grid grid-cols-4 gap-4 max-w-lg mx-auto">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card-bb p-4 text-center space-y-2">
            <Skeleton className="h-10 w-12 rounded mx-auto" />
            <Skeleton className="h-3 w-12 rounded mx-auto" />
          </div>
        ))}
      </div>
      <Skeleton className="h-4 w-full rounded mx-auto max-w-xl" />
      <Skeleton className="h-4 w-2/3 rounded mx-auto max-w-xl" />
      <div className="flex justify-center gap-4">
        <Skeleton className="h-10 w-32 rounded-lg" />
        <Skeleton className="h-10 w-40 rounded-lg" />
      </div>
    </div>
  );
}
