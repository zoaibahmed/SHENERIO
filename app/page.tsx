import Image from 'next/image';
import { MotionDirector } from '@/components/motion';
import { Newsletter, JournalFeature } from '@/components/experience';
import { HomeRitual } from '@/components/home-ritual';
import { HomeIntro } from '@/components/home-intro';
import { FlagshipHero, LumiclearCollection } from '@/components/flagship';
import { FormulationJourney } from '@/components/formulation-journey';
import { originPhotography } from '@/lib/editorial-imagery';
import './home-story.css';

export default function Home() {
  return <>
    <HomeIntro />
    <FlagshipHero />

    <section className="manifesto wrap" id="house" aria-labelledby="house-title">
      <div className="chapter-label"><span>Our House</span><span>A contemporary vision of skincare</span></div>
      <div className="manifesto-text">
        <h2 id="house-title"><span className="reveal-line"><span>A house built around </span></span><span className="reveal-line"><span>the art of skincare.</span></span></h2>
        <p className="manifesto-statement"><span>Thoughtful ingredients.</span> <span>Considered formulations.</span> <span>Everyday rituals.</span></p>
      </div>
      <div className="manifesto-layout">
        <figure className="manifesto-image image-mask">
          <Image src="/images/house-daylight.webp" alt="A woman touches her cheek during a skincare routine in soft daylight." fill sizes="(max-width: 767px) 87vw, 36vw" quality={80} />
          <span className="manifesto-wipe" aria-hidden="true" />
          <figcaption>Considered in every detail.</figcaption>
        </figure>
        <div className="manifesto-reading">
          <div className="manifesto-prose">
            <p>SHENERIO represents a contemporary vision of luxury skincare. Founded in London, our brand brings together an appreciation for modern beauty, thoughtful ingredient selection and the formulation innovation of South Korea.</p>
            <p>We believe skincare should be considered in every detail, from the ingredients within each formulation to the experience of incorporating it into your daily routine.</p>
          </div>
          <details className="quiet-details">
            <summary>Discover our House <span aria-hidden="true">+</span></summary>
            <p>Our philosophy is centred on creating skincare essentials that make everyday care feel exceptional. Thoughtful formulation. Inspired by Korean innovation. Refined simplicity. The beauty of everyday rituals.</p>
          </details>
          <a className="text-link home-chapter-link" href="/our-house">Read the House story <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </section>

    <LumiclearCollection />
    <FormulationJourney />

    <section className="origin wrap" id="origins" aria-labelledby="origin-title">
      <div className="chapter-label"><span>Two perspectives. One House.</span><span>London / South Korea</span></div>
      <div className="origin-top">
        <h2 id="origin-title">A London vision.<br />South Korean formulation expertise.</h2>
        <p>SHENERIO was founded in London, United Kingdom, with a vision to create a distinctive expression of modern luxury skincare. Our products are formulated and manufactured in South Korea.</p>
      </div>
      <div className="origin-diptych">
        <figure>
          <div className="origin-image image-mask"><Image src={originPhotography.london.src} alt={originPhotography.london.alt} fill sizes="(max-width: 767px) 88vw, 29vw" quality={80} /></div>
          <figcaption><span>London.<small>Regent Street, London.</small></span><small className="origin-credit"><a href={originPhotography.london.source}>{originPhotography.london.credit}</a> · <a href={originPhotography.london.license}>CC BY-SA 4.0</a> · Cropped</small></figcaption>
        </figure>
        <figure>
          <div className="origin-image image-mask"><Image src={originPhotography.laboratory.src} alt={originPhotography.laboratory.alt} fill sizes="(max-width: 767px) 88vw, 57vw" quality={80} /></div>
          <figcaption><span>South Korea.<small>Formulation and manufacturing.</small></span><small className="origin-credit">{originPhotography.laboratory.caption}</small></figcaption>
        </figure>
      </div>
      <p className="origin-closing">This connection brings together our London-founded brand identity and our appreciation for Korean skincare development.</p>
    </section>

    <section className="everyday" id="everyday" aria-labelledby="everyday-title">
      <div className="everyday-image"><Image src="/images/everyday.webp" alt="An original campaign study of a man pausing during his morning skincare routine." fill sizes="100vw" quality={80} /></div>
      <div className="everyday-copy">
        <p className="eyebrow">Skincare that fits your everyday</p>
        <h2 id="everyday-title">A moment to return to yourself.</h2>
        <p>We believe that exceptional skincare should be uncomplicated and inclusive.</p>
        <p>From lightweight hydration to nourishing moisturisation, discover skincare designed to complement your personal beauty routine.</p>
        <a href="#ritual" className="text-link">Make everyday care a ritual <span aria-hidden="true">↗</span></a>
      </div>
    </section>

    <HomeRitual />

    <section className="journal wrap" id="journal" aria-labelledby="journal-title">
      <div className="journal-heading"><div><span className="eyebrow">A considered perspective</span><h2 id="journal-title">The Journal.</h2></div><p>Skincare, ingredients and modern beauty.</p></div>
      <JournalFeature />
    </section>

    <section className="newsletter wrap" id="newsletter" aria-labelledby="newsletter-title">
      <div className="newsletter-copy"><p className="eyebrow">The world of SHENERIO</p><h2 id="newsletter-title">Stay connected with SHENERIO.</h2><p>Discover new collections, skincare insights and selected updates from the world of SHENERIO. Be among the first to experience what comes next.</p></div>
      <Newsletter />
    </section>

    <section className="closing wrap" aria-label="Closing brand statement">
      <p>Light. Texture. Ritual.<br />A more considered skincare experience.</p>
      <span className="closing-wordmark" aria-hidden="true">SHENERIO</span>
      <p className="closing-signature">THE ART OF ELEVATED SKINCARE.</p>
    </section>
    <MotionDirector />
  </>;
}
