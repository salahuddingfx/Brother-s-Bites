import Skeleton from '@/components/ui/skeleton';

export default function AdminTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-brand-surface-light rounded-xl border border-white/10 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              {['w-20', 'w-24', 'w-14', 'w-14', 'w-16', 'w-20', 'w-16', 'w-14'].map((w, i) => (
                <th key={i} className="text-left px-5 py-3">
                  <Skeleton className={`h-3 ${w} rounded`} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, row) => (
              <tr key={row} className="border-b border-white/5 last:border-0">
                <td className="px-5 py-3"><Skeleton className="h-4 w-16 rounded" /></td>
                <td className="px-5 py-3 hidden sm:table-cell">
                  <Skeleton className="h-4 w-24 rounded mb-1" />
                  <Skeleton className="h-3 w-20 rounded" />
                </td>
                <td className="px-5 py-3"><Skeleton className="h-4 w-10 rounded" /></td>
                <td className="px-5 py-3"><Skeleton className="h-4 w-12 rounded" /></td>
                <td className="px-5 py-3 hidden md:table-cell"><Skeleton className="h-4 w-16 rounded" /></td>
                <td className="px-5 py-3"><Skeleton className="h-5 w-16 rounded-full" /></td>
                <td className="px-5 py-3 hidden lg:table-cell"><Skeleton className="h-3 w-20 rounded" /></td>
                <td className="px-5 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Skeleton className="h-6 w-16 rounded" />
                    <Skeleton className="h-7 w-7 rounded" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
