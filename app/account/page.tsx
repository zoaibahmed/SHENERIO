import { CareDocumentPage, careMetadata } from '@/components/care-page';

export const metadata = careMetadata('account');

export default function AccountPage() {
  return <CareDocumentPage documentKey="account" />;
}
