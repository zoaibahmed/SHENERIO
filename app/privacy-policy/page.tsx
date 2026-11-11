import { CareDocumentPage, careMetadata } from '@/components/care-page';

export const metadata = careMetadata('privacy');

export default function PrivacyPolicyPage() {
  return <CareDocumentPage documentKey="privacy" />;
}
