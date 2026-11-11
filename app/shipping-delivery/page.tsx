import { CareDocumentPage, careMetadata } from '@/components/care-page';

export const metadata = careMetadata('shipping');

export default function ShippingDeliveryPage() {
  return <CareDocumentPage documentKey="shipping" />;
}
