import type { Metadata } from 'next';
import { CollectionPage } from '@/components/commerce-pages';

export const metadata: Metadata = {
  title: { absolute: 'LUMICLEAR Collection | SHENERIO' },
  description: 'Meet LUMICLEAR, the two-step SHENERIO skincare ritual with Target Serum and Radiance Cream.',
  alternates: { canonical: '/collections/lumiclear' },
};

export default function Lumiclear() {
  return <CollectionPage feature />;
}
