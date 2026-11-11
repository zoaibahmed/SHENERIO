import Image from 'next/image';

const applications = [
  {
    step: 'Treat',
    product: 'LUMICLEAR TARGET SERUM',
    instruction: 'Apply an appropriate amount to freshly cleansed face and neck. Gently distribute over the skin and allow it to settle.',
    src: '/images/ritual-application-serum.webp',
    alt: 'Close-up of a woman applying a clear serum to her cheek with a pipette.',
  },
  {
    step: 'Nourish',
    product: 'LUMICLEAR RADIANCE CREAM',
    instruction: 'Follow with an appropriate amount of moisturiser to the face and neck. Gently massage and allow it to settle.',
    src: '/images/ritual-application-cream.webp',
    alt: 'Close-up of a woman gently spreading moisturiser across her face with her fingertips.',
  },
];

export function HomeRitual() {
  return <section className="home-ritual wrap" id="ritual" aria-labelledby="ritual-title">
    <div className="chapter-label"><span>The SHENERIO ritual</span><span>A considered daily practice</span></div>
    <div className="home-ritual-heading">
      <h2 id="ritual-title">Make everyday<br />care a ritual.</h2>
      <p>We believe a considered skincare routine does not need to be complicated. The LUMICLEAR collection introduces two complementary essentials designed to be incorporated into your daily skincare routine.</p>
    </div>
    <div className="home-ritual-track" data-phase="treat">
      <div className="home-ritual-scene">
        <div className="home-ritual-applications">
          {applications.map((application, index) => <article className={`home-ritual-application home-ritual-application-${index}`} id={`ritual-step-${index + 1}`} key={application.step} aria-labelledby={`application-title-${index}`}>
            <figure className="home-ritual-photo">
              <Image src={application.src} alt={application.alt} fill sizes="(min-width: 1024px) 58vw, (min-width: 768px) 70vw, 88vw" quality={85} loading="eager" fetchPriority="low" />
              <figcaption><span>0{index + 1}</span><span>{application.step}</span></figcaption>
            </figure>
            <div className="home-ritual-copy">
              <p className="home-ritual-step">Step 0{index + 1} / The daily ritual</p>
              <h3 id={`application-title-${index}`}><span>{application.step}.</span></h3>
              <p className="home-ritual-product">{application.product}</p>
              <p className="home-ritual-instruction">{application.instruction}</p>
            </div>
          </article>)}
        </div>
        <div className="home-ritual-progress" aria-hidden="true"><span>01</span><i /><span>02</span></div>
      </div>
    </div>
    <div className="home-ritual-ending">
      <p>Two steps. A moment of your own.</p>
      <a className="button button-dark" href="/the-ritual">DISCOVER THE RITUAL <span aria-hidden="true">↗</span></a>
    </div>
  </section>;
}
