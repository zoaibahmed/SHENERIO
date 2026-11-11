import type { Metadata } from 'next';
import { EditorialArrow, EditorialPhoto } from '@/components/editorial-photo';
import { housePhilosophyPhotography, originPhotography } from '@/lib/editorial-imagery';
import '../editorial-pages.css';

export const metadata: Metadata = {
  title: 'Our House | SHENERIO',
  description: 'A London-founded skincare house inspired by South Korean formulation and a considered approach to everyday care.',
};

// The four headings and brand narrative are sourced from TIL.pdf, pp. 7–8.
const principles = [
  { title: 'Purposeful formulation', text: 'We appreciate the role of carefully selected ingredients and what they contribute to the skincare experience.' },
  { title: 'Inspired by innovation', text: 'Our products are formulated and manufactured in South Korea. Its formulation expertise shapes the LUMICLEAR collection.' },
  { title: 'Refined simplicity', text: 'We believe a considered skincare routine can be uncomplicated and exceptional.' },
  { title: 'A long-term vision', text: 'We are building a luxury skincare house with a commitment to consistency in quality, identity and experience.' },
];

export default function OurHousePage() {
  return (
    <div className="ed-page ed-house">
      <section className="ed-house-hero" aria-labelledby="house-page-title">
        <div className="ed-house-portrait">
          <EditorialPhoto className="ed-house-photo" src="/images/portrait.webp" alt="An editorial portrait with a narrow beam of light falling across a woman’s face." sizes="(max-width: 767px) 100vw, 56vw" eager />
        </div>
        <div className="ed-house-intro">
          <p className="ed-kicker">London / South Korea</p>
          <h1 id="house-page-title">Our House.</h1>
          <p className="ed-hero-deck">A contemporary vision of skincare.</p>
          <a className="text-link" href="#house-philosophy">Our philosophy <EditorialArrow down /></a>
        </div>
      </section>

      <section className="ed-wrap ed-house-story" aria-labelledby="house-story-title">
        <div className="house-story-introduction" data-reveal="house-statement">
          <div className="ed-house-story-lead">
            <p className="ed-kicker">Our story</p>
            <h2 id="house-story-title"><span className="house-type-mask"><span>Two perspectives. </span></span><span className="house-type-mask"><span>One house.</span></span></h2>
          </div>
          <div className="ed-house-story-copy">
            <p>SHENERIO was founded in London to create a distinctive expression of modern luxury skincare.</p>
            <p>Our products are formulated and manufactured in South Korea. Its formulation expertise shapes LUMICLEAR, two complementary essentials created to fit into everyday routines.</p>
          </div>
        </div>
        <div className="house-location-reel" data-reveal="house-origins">
          <figure className="house-location">
            <EditorialPhoto className="house-location-photo" src={originPhotography.london.src} alt={originPhotography.london.alt} sizes="(max-width: 767px) 88vw, 36vw" />
            <figcaption>
              <div><p className="ed-kicker">01 / The brand perspective</p><h3>London.</h3><p>Where SHENERIO’s vision began.</p></div>
              <small>Regent Street · <a href={originPhotography.london.source}>{originPhotography.london.credit}</a> · <a href={originPhotography.london.license}>CC BY-SA 4.0</a> · Cropped</small>
            </figcaption>
          </figure>
          <figure className="house-location">
            <EditorialPhoto className="house-location-photo" src={originPhotography.laboratory.src} alt={originPhotography.laboratory.alt} sizes="(max-width: 767px) 88vw, 52vw" />
            <figcaption>
              <div><p className="ed-kicker">02 / The formulation perspective</p><h3>South Korea.</h3><p>Where the LUMICLEAR products are formulated and manufactured.</p></div>
              <small>{originPhotography.laboratory.caption}</small>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="ed-wrap ed-principles" id="house-philosophy" aria-labelledby="house-philosophy-title" data-reveal="house-principles">
        <div className="ed-principles-intro">
          <p className="ed-kicker">Our philosophy</p>
          <h2 id="house-philosophy-title"><span className="house-type-mask"><span>Attention to </span></span><span className="house-type-mask"><span>every detail.</span></span></h2>
        </div>
        <figure className="house-philosophy-figure">
          <EditorialPhoto className="house-philosophy-photo" src={housePhilosophyPhotography.src} alt={housePhilosophyPhotography.alt} sizes="(max-width: 1023px) 90vw, (max-width: 1199px) 68vw, 43vw" />
          <figcaption>{housePhilosophyPhotography.caption} · <a href={housePhilosophyPhotography.source}>{housePhilosophyPhotography.credit}</a></figcaption>
        </figure>
        <ul className="ed-principles-grid">
          {principles.map(principle => <li key={principle.title}><h3>{principle.title}</h3><p>{principle.text}</p></li>)}
        </ul>
        <a className="text-link" href="/formulation">Explore our formulation <EditorialArrow /></a>
      </section>

      <section className="ed-wrap ed-footer-bridge house-signoff" aria-label="Discover the collection">
        <p>The art of elevated skincare.</p>
        <a className="button button-dark" href="/collections">Discover LUMICLEAR <EditorialArrow /></a>
      </section>
    </div>
  );
}
