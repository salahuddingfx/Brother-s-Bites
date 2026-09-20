'use client';

import dynamic from 'next/dynamic';
import MenuItemDetailSkeleton from '@/components/skeletons/MenuItemDetailSkeleton';

const MenuDetailContent = dynamic(() => import('./MenuDetailContent'), {
  ssr: false,
  loading: () => (
    <div className="pt-24 pb-16 sm:pb-24">
      <div className="container-bb">
        <MenuItemDetailSkeleton />
      </div>
    </div>
  ),
});

export default function SingleMenuItemPage() {
  return <MenuDetailContent />;
}
