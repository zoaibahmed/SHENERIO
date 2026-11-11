import { CareDocumentPage, careMetadata } from '@/components/care-page';

export const metadata = careMetadata('returnsPolicy');

export default function ReturnsPolicyPage() {
  return <CareDocumentPage documentKey="returnsPolicy" />;
}
