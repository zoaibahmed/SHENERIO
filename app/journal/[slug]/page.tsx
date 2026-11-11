import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EditorialArrow, EditorialPhoto } from '@/components/editorial-photo';
import { journalEntries } from '@/lib/journal';
import { products } from '@/lib/products';
import '../../editorial-pages.css';

type ArticlePageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return journalEntries.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = journalEntries.find(item => item.slug === slug);
  if (!entry) return {};
  return { title: `${entry.status === 'preview' ? 'Private draft: ' : ''}${entry.title} | SHENERIO`, description: entry.description, ...(entry.status === 'preview' ? { robots: { index: false, follow: false } } : {}) };
}

export default async function JournalArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const entry = journalEntries.find(item => item.slug === slug);
  if (!entry) notFound();

  const related = journalEntries.filter(item => item.slug !== entry.slug && item.category === entry.category && item.status === 'published');
  const relatedProducts = products.filter(product => entry.relatedProductIds?.includes(product.id));

  return (
    <div className="ed-page ed-article">
      <article>
        <header className="ed-wrap ed-article-heading" data-reveal="heading">
          <a className="ed-back-link" href="/journal"><span aria-hidden="true">←</span> The Journal</a>
          <p className="ed-kicker">{entry.category} / {entry.status === 'preview' ? 'Editorial draft' : 'Article'}</p>
          {entry.status === 'preview' && <p className="ed-draft-notice">Private editorial draft · Awaiting review. This introduction is not a complete approved article.</p>}
          <h1>{entry.title}</h1>
          <p className="ed-hero-deck">{entry.description}</p>
        </header>
        <figure className="ed-wrap">
          <EditorialPhoto className="ed-article-photo" src={entry.image.src} alt={entry.image.alt} sizes="90vw" eager reveal />
          <figcaption className="ed-caption">
            <span>{entry.image.caption}</span>
            {entry.ingredientPath && <a href={entry.ingredientPath}>Explore formulation <EditorialArrow /></a>}
          </figcaption>
        </figure>
        <div className="ed-article-body">
          {entry.sections.map((section, index) => (
            <div className="ed-article-section" key={section.heading ?? index}>
              {section.heading && <h2>{section.heading}</h2>}
              {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
            </div>
          ))}
          {entry.status === 'preview' && <p className="ed-publication-note">Private editorial draft. The full manuscript is awaiting editorial and claims review. This introduction is not ready for public publication.</p>}
        </div>
      </article>
      {relatedProducts.length > 0 && <section className="ed-wrap ed-article-related" aria-labelledby="article-products-title">
        <div>
          <p className="ed-kicker">The collection</p>
          <h2 id="article-products-title">Explore LUMICLEAR.</h2>
        </div>
        <div className="ed-article-products">
          {relatedProducts.map(product => (
            <a key={product.id} href={`/products/lumiclear-${product.id}`}>
              <EditorialPhoto className="ed-article-product-photo" src={product.gallery[0].src} alt="" sizes="(max-width: 540px) 88vw, 33vw" />
              <span>{product.name}<EditorialArrow /></span>
            </a>
          ))}
        </div>
      </section>}
      <section className="ed-wrap ed-footer-bridge" aria-labelledby="related-reading-title">
        <div>
          <h2 id="related-reading-title">Related reading.</h2>
          {related.length > 0 ? <ul>{related.map(item => <li key={item.slug}><a className="text-link" href={`/journal/${item.slug}`}>{item.title} <EditorialArrow /></a></li>)}</ul> : <p>Continue into our ingredient index for more on the formulation.</p>}
        </div>
        <a className="button button-dark" href="/formulation#ingredient-study">Explore the ingredient index <EditorialArrow /></a>
      </section>
    </div>
  );
}
