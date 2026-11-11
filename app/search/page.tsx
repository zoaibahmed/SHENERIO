import type { Metadata } from 'next';
import Image from 'next/image';
import { CareArrow, CarePage } from '@/components/care-page';
import { productHref, productPrice } from '@/lib/products';
import { searchSite } from '@/lib/site-search';

export const metadata: Metadata = {
  title: 'Search SHENERIO',
  description: 'Find SHENERIO products and explore the House, formulation, routines and Journal.',
  robots: { index: false, follow: false },
};

const suggestions = ['LUMICLEAR', 'Niacinamide', 'Ritual'];

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const { q } = await searchParams;
  const query = (Array.isArray(q) ? q[0] ?? '' : q ?? '').trim().slice(0, 160);
  const { products, editorial } = searchSite(query);
  const resultCount = products.length + editorial.length;

  return (
    <CarePage label="Explore the House" title="Search SHENERIO">
      <div className="care-search">
        <form action="/search" method="get" role="search" className="care-search-form">
          <label htmlFor="site-search-query">Search SHENERIO</label>
          <div className="care-search-input">
            <input id="site-search-query" type="search" name="q" defaultValue={query} placeholder="Try Target Serum or niacinamide" maxLength={160} required />
            <button className="button button-dark" type="submit">Search <CareArrow /></button>
          </div>
        </form>
        {query ? (
          <div className="care-search-results">
            <p className="care-search-count">{resultCount} {resultCount === 1 ? 'result' : 'results'} for <strong>“{query}”</strong></p>
            {products.length > 0 && (
              <section aria-labelledby="search-products">
                <h2 id="search-products">Products</h2>
                <ul className="care-result-list">
                  {products.map(product => (
                    <li key={product.id}>
                      <a href={productHref(product)} className="care-result care-product-result">
                        <span className="care-result-image"><Image src={product.gallery[0].src} alt="" fill sizes="84px" /></span>
                        <span className="care-result-copy">
                          <strong>{product.name}</strong>
                          <span>{product.description}</span>
                          <span className="care-result-price">{productPrice(product.price)}</span>
                        </span>
                        <CareArrow />
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {editorial.length > 0 && (
              <section aria-labelledby="search-editorial">
                <h2 id="search-editorial">Explore SHENERIO</h2>
                <ul className="care-result-list">
                  {editorial.map(result => (
                    <li key={result.href}>
                      <a href={result.href} className="care-result">
                        <span className="care-result-copy"><span className="care-result-kind">{result.kind}</span><strong>{result.title}</strong><span>{result.description}</span></span>
                        <CareArrow />
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {resultCount === 0 && (
              <div className="care-search-empty">
                <h2>Try a different search.</h2>
                <p>Try a product name, an ingredient or a section of the site.</p>
                <a className="text-link" href="/collections">Discover Collections <CareArrow /></a>
              </div>
            )}
          </div>
        ) : (
          <nav className="care-search-suggestions" aria-label="Suggested searches">
            <h2>Start with</h2>
            <ul>
              {suggestions.map(suggestion => <li key={suggestion}><a href={`/search?q=${encodeURIComponent(suggestion)}`}>{suggestion}</a></li>)}
            </ul>
          </nav>
        )}
      </div>
    </CarePage>
  );
}
