import { CareDocumentPage, careMetadata } from '@/components/care-page';

export const metadata = careMetadata('cookies');

export default function CookiePolicyPage() {
  return <CareDocumentPage documentKey="cookies" />;
}
