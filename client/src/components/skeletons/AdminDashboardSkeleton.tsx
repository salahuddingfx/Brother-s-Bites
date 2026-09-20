import Skeleton from '@/components/ui/skeleton';

export default function AdminDashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-brand-surface-light border border-brand-border p-5 sm:p-7">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-3">
            <Skeleton className="h-5 w-36 rounded-full" />
            <Skeleton className="h-8 w-64 rounded" />
            <Skeleton className="h-4 w-80 rounded" />
          </div>
          <div className="flex gap-2.5">
            <Skeleton className="h-9 w-24 rounded-lg" />
            <Skeleton className="h-9 w-28 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-brand-surface-light border border-brand-border p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-3 w-24 rounded" />
                <Skeleton className="h-8 w-16 rounded" />
              </div>
              <Skeleton className="w-11 h-11 rounded-xl" />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <Skeleton className="h-4 w-44 rounded mb-3.5" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card-bb p-4 border border-brand-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-3.5 w-20 rounded" />
                    <Skeleton className="h-2.5 w-16 rounded" />
                  </div>
                </div>
                <Skeleton className="w-4 h-4 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visitor Traffic */}
      <div className="card-bb p-5 sm:p-6 border border-brand-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-white/5 pb-4">
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-52 rounded" />
            <Skeleton className="h-3 w-72 rounded" />
          </div>
          <Skeleton className="h-8 w-56 rounded-lg" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card-bb p-4 bg-brand-black/40 border-brand-border/60 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-20 rounded" />
                <Skeleton className="w-7 h-7 rounded-lg" />
              </div>
              <Skeleton className="h-7 w-14 rounded" />
              <Skeleton className="h-2.5 w-24 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-40 rounded" />
            <Skeleton className="h-3 w-56 rounded" />
          </div>
          <Skeleton className="h-3 w-24 rounded" />
        </div>
        <div className="card-bb overflow-hidden border border-brand-border">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-brand-border bg-brand-surface/60">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <th key={i} className="text-left px-4 py-3">
                      <Skeleton className="h-3 w-16 rounded" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {Array.from({ length: 4 }).map((_, row) => (
                  <tr key={row}>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-14 rounded" /></td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-20 rounded mb-1" />
                      <Skeleton className="h-3 w-16 rounded" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-12 rounded mb-1" />
                      <Skeleton className="h-3 w-8 rounded" />
                    </td>
                    <td className="px-4 py-3"><Skeleton className="h-5 w-16 rounded-full" /></td>
                    <td className="px-4 py-3 text-right"><Skeleton className="h-6 w-20 rounded ml-auto" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
