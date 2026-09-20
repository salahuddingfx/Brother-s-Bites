'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import api from '@/lib/api';

export default function VisitorTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    // Avoid double counting same path in rapid re-renders
    if (!pathname || pathname === lastTrackedPath.current) return;
    
    // Ignore internal admin panel visits from customer analytics
    if (pathname.startsWith('/admin')) return;

    lastTrackedPath.current = pathname;

    // Send async pageview beacon
    const track = async () => {
      try {
        await api.post('/analytics/track', {
          path: pathname,
          referrer: typeof document !== 'undefined' ? document.referrer : '',
        });
      } catch {
        // Fire and forget, don't interrupt user
      }
    };

    track();
  }, [pathname]);

  return null;
}
