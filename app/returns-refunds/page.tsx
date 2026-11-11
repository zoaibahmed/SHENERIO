import { CareDocumentPage, careMetadata } from '@/components/care-page';

export const metadata = careMetadata('returns');

export default function ReturnsRefundsPage() {
  return <CareDocumentPage documentKey="returns" />;
}
