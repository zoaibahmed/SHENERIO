import type { Metadata } from 'next';
import { EditorialArrow, EditorialPhoto } from '@/components/editorial-photo';
import { journalEntries } from '@/lib/journal';
import '../editorial-pages.css';

export const metadata: Metadata = {
  title: 'The Journal | SHENERIO',
  description: 'A considered perspective on skincare ingredients, everyday care and modern beauty.',
};

export default function JournalPage() {
  return (
    <div className="ed-page ed-journal">
      <header className="ed-wrap ed-journal-masthead">
        <div><p className="ed-kicker">SHENERIO / Editorial</p><h1>The Journal.</h1></div>
        <div><p className="ed-hero-deck">A considered perspective on skincare.</p><p>Explore the ingredients behind modern skincare, the place of everyday care and the world of South Korean formulation.</p></div>
      </header>
      <nav className="ed-wrap ed-journal-nav" aria-label="Journal topics">
        <a href="#journal-ingredients" aria-current="location">Featured reading</a>
        <a href="#journal-guides">Skincare guides <EditorialArrow down /></a>
      </nav>
      <section className="ed-wrap ed-journal-entries" id="journal-ingredients" aria-label="Ingredient perspectives">
        {journalEntries.map(entry => (
          <article className="ed-journal-feature" key={entry.slug}>
            <a className="ed-journal-feature-link" href={`/journal/${entry.slug}`} aria-labelledby={`journal-${entry.slug}-title`}>
              <EditorialPhoto className="ed-journal-photo" src={entry.image.src} alt={entry.image.alt} sizes="(max-width: 767px) 88vw, 64vw" eager reveal />
              <div className="ed-journal-feature-copy">
                <p className="ed-kicker">{entry.category} / {entry.status === 'preview' ? 'Private draft' : 'Article'}</p>
                <h2 id={`journal-${entry.slug}-title`}>{entry.title}</h2>
                <p>{entry.description}</p>
                <span className="text-link">{entry.status === 'preview' ? 'Read the private draft' : 'Read the article'} <EditorialArrow /></span>
              </div>
            </a>
          </article>
        ))}
      </section>
      <section className="ed-wrap journal-reading-room" id="journal-guides" aria-labelledby="journal-guide-title">
        <p className="ed-kicker">Further reading</p>
        <h2 id="journal-guide-title">The reading room.</h2>
        <div className="journal-guide-spread">
          <a href="/formulation">
            <EditorialPhoto className="journal-guide-photo" src="/images/journal-serum-macro.webp" alt="A clear cosmetic serum and glass dropper resting on a warm ivory reflective surface." sizes="(max-width: 767px) 88vw, 52vw" reveal />
            <span className="journal-guide-title">The ingredient atlas <EditorialArrow /></span>
          </a>
          <a href="/the-ritual">
            <EditorialPhoto className="journal-guide-photo" src="/images/serum-touch.webp" alt="A cosmetic texture being considered in the hand." sizes="(max-width: 767px) 88vw, 34vw" reveal />
            <span className="journal-guide-title">Morning and evening care <EditorialArrow /></span>
          </a>
        </div>
      </section>
      <section className="ed-wrap ed-footer-bridge" aria-label="Explore the collection">
        <p>From ingredient to ritual.</p>
        <a className="button button-dark" href="/collections/lumiclear">Explore the LUMICLEAR collection <EditorialArrow /></a>
      </section>
    </div>
  );
}
