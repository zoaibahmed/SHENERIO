import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { careDocuments, type CareDocumentKey } from '@/lib/customer-care';
import './care.css';

export function CarePage({
  label,
  title,
  intro,
  children,
}: {
  label: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <div className="care-page">
      <header className="care-heading">
        <p className="care-kicker">{label}</p>
        <h1>{title}</h1>
        {intro && <p className="care-intro">{intro}</p>}
      </header>
      {children}
    </div>
  );
}

export function CareArrow() {
  return (
    <svg className="arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3.5 12h16m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export function careMetadata(key: CareDocumentKey): Metadata {
  const document = careDocuments[key];
  return {
    title: document.title,
    description: document.description,
    robots: { index: false, follow: false },
  };
}

export function CareDocumentPage({ documentKey }: { documentKey: CareDocumentKey }) {
  const document = careDocuments[documentKey];

  return (
    <CarePage label={document.category} title={document.title}>
      <div className="care-split care-document">
        <section className="care-panel" aria-labelledby="care-document-heading">
          <p className="care-status">{document.status}</p>
          <h2 id="care-document-heading">{document.heading}</h2>
          <p>{document.description}</p>
        </section>
        <nav className="care-side" aria-label="Related pages">
          <h2>Continue exploring</h2>
          <ul className="care-link-list">
            {document.links.map(({ href, label }) => (
              <li key={href}><a href={href}>{label}<CareArrow /></a></li>
            ))}
          </ul>
        </nav>
      </div>
    </CarePage>
  );
}
