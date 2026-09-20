import Skeleton from '@/components/ui/skeleton';

export default function AdminLayoutSkeleton() {
  return (
    <div className="min-h-screen bg-brand-black flex">
      {/* Sidebar Skeleton */}
      <aside className="fixed top-0 left-0 h-full w-64 bg-brand-surface-light border-r border-brand-border z-50 flex flex-col">
        {/* Brand Header */}
        <div className="p-4 sm:p-5 border-b border-brand-border flex items-center gap-3">
          <Skeleton className="w-9 h-9 rounded-xl shrink-0" />
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-24 rounded" />
            <Skeleton className="h-2.5 w-16 rounded" />
          </div>
        </div>

        {/* CTA Button */}
        <div className="px-3.5 pt-3.5">
          <Skeleton className="h-9 w-full rounded-xl" />
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-3.5 space-y-1 overflow-y-auto">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl">
              <Skeleton className="w-[18px] h-[18px] rounded shrink-0" />
              <Skeleton className="h-3.5 w-24 rounded" />
            </div>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-brand-border bg-brand-surface/40">
          <div className="flex items-center gap-2.5 mb-3 px-2.5 py-2 rounded-xl bg-brand-surface border border-brand-border">
            <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3 w-20 rounded" />
              <Skeleton className="h-2.5 w-12 rounded" />
            </div>
          </div>
          <Skeleton className="h-8 w-full rounded-xl" />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-brand-surface-light/90 backdrop-blur-md border-b border-brand-border shadow-sm">
          <div className="flex items-center justify-between px-4 sm:px-6 h-16">
            <div className="flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded-lg lg:hidden" />
              <Skeleton className="h-3.5 w-44 rounded hidden lg:block" />
            </div>
            <div className="flex items-center gap-2.5">
              <Skeleton className="h-8 w-28 rounded-lg" />
              <Skeleton className="w-8 h-8 rounded-lg" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-brand-black">
          <div className="space-y-6">
            <Skeleton className="h-6 w-48 rounded" />
            <Skeleton className="h-4 w-72 rounded" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
