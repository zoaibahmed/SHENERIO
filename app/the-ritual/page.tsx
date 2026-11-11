import type { Metadata } from 'next';
import { EditorialArrow, EditorialPhoto } from '@/components/editorial-photo';
import { RitualStudy } from '@/components/ritual-study';
import '../editorial-pages.css';

export const metadata: Metadata = {
  title: 'The Ritual | SHENERIO',
  description: 'Explore the SHENERIO morning and evening rituals and discover how the two LUMICLEAR essentials fit into everyday care.',
};

// Complete AM/PM sequences from TIL.pdf, pp. 17–18. Frequency and pack guidance from TIL 2.pdf, p. 3.
const routines = [
  {
    id: 'morning-ritual',
    title: 'Morning ritual',
    window: 'AM',
    overview: 'Cleanse, treat, moisturise and protect.',
    steps: [
      { title: 'Cleanse', detail: 'Begin with a suitable facial cleanser to prepare your skin.' },
      { title: 'Treat', detail: 'Apply LUMICLEAR TARGET SERUM to clean skin. Niacinamide, panthenol and sodium hyaluronate feature in this lightweight, hydration-focused step.' },
      { title: 'Moisturise', detail: 'Follow with LUMICLEAR RADIANCE CREAM to help maintain hydration and leave skin feeling soft and comfortable.' },
      { title: 'Protect', detail: 'Complete your morning skincare routine with a suitable broad-spectrum sunscreen.' },
      { title: 'Your makeup routine', detail: 'If you wear makeup, allow your skincare to settle before applying your preferred makeup products.' },
    ],
  },
  {
    id: 'evening-ritual',
    title: 'Evening ritual',
    window: 'PM',
    overview: 'Cleanse, treat and nourish.',
    steps: [
      { title: 'Cleanse', detail: 'Use a suitable facial cleanser to remove daily impurities and prepare your skin.' },
      { title: 'Treat', detail: 'Apply LUMICLEAR TARGET SERUM.' },
      { title: 'Nourish', detail: 'Follow with LUMICLEAR RADIANCE CREAM.' },
    ],
  },
];

export default function RitualPage() {
  return (
    <div className="ed-page ed-ritual">
      <section className="ed-ritual-hero" aria-labelledby="ritual-page-title">
        <EditorialPhoto className="ed-ritual-hero-photo" src="/images/light-campaign-1536.webp" alt="A woman pauses with her fingertips against her cheek in a warm beam of light." sizes="100vw" eager reveal />
        <div className="ed-ritual-hero-copy" data-reveal="heading">
          <div className="ritual-hero-heading">
            <p className="ed-kicker">Everyday care</p>
            <h1 id="ritual-page-title">The ritual.</h1>
          </div>
          <div className="ritual-hero-reading">
            <p className="ed-hero-deck">A more considered approach to everyday skincare.</p>
            <p>Two complementary LUMICLEAR essentials are designed to work together within a routine that is easy to understand and enjoyable to maintain.</p>
            <nav className="ed-routine-jump" aria-label="Jump to a routine">
              <a className="text-link" href="#morning-ritual">Morning <EditorialArrow down /></a>
              <a className="text-link" href="#evening-ritual">Evening <EditorialArrow down /></a>
            </nav>
          </div>
        </div>
      </section>

      <div className="ed-wrap ed-ritual-study-wrap"><RitualStudy /></div>

      <div className="ed-wrap ed-routine-wrap">
        <div className="ed-routine-grid">
          {routines.map(routine => (
            <section className="ed-routine" key={routine.id} id={routine.id} aria-labelledby={`${routine.id}-title`}>
              <header><span aria-hidden="true">{routine.window}</span><h2 id={`${routine.id}-title`}>{routine.title}.</h2><p>{routine.overview}</p></header>
              <ol>
                {routine.steps.map(step => <li key={step.title}><div><h3>{step.title}</h3><p>{step.detail}</p></div></li>)}
              </ol>
            </section>
          ))}
        </div>
        <p className="ed-routine-note">Choose your own cleanser and sunscreen. The LUMICLEAR collection consists of the serum and cream. Use morning and evening where suitable and follow the directions on the final packaging.</p>
      </div>

      <section className="ed-wrap ed-footer-bridge" aria-labelledby="ritual-philosophy-title">
        <div>
          <h2 id="ritual-philosophy-title">The art of everyday care.</h2>
          <p>Two carefully selected essentials can form the foundation of a considered daily skincare routine.</p>
        </div>
        <a className="button button-dark" href="/collections/lumiclear">Discover LUMICLEAR <EditorialArrow /></a>
      </section>
    </div>
  );
}
