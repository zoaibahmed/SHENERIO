import { CareDocumentPage, careMetadata } from '@/components/care-page';

export const metadata = careMetadata('terms');

export default function TermsConditionsPage() {
  return <CareDocumentPage documentKey="terms" />;
}
