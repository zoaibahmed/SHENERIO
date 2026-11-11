import { CareDocumentPage, careMetadata } from '@/components/care-page';

export const metadata = careMetadata('tracking');

export default function OrderTrackingPage() {
  return <CareDocumentPage documentKey="tracking" />;
}
