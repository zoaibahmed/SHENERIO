import type { Metadata } from 'next';
import { CollectionPage } from '@/components/commerce-pages';

export const metadata: Metadata = {
  title: { absolute: 'SHENERIO | Luxury Skincare Collection' },
  description: 'Explore the SHENERIO LUMICLEAR collection, featuring thoughtfully formulated skincare essentials including our Target Serum and Radiance Cream.',
  alternates: { canonical: '/collections' },
};

export default function Collections() {
  return <CollectionPage />;
}
