import Image, { getImageProps } from 'next/image';
import { products, productHref, productPrice } from '@/lib/products';

const mobileCampaign = '/images/campaign-daylight-phone.webp';
const campaignSources = '/images/campaign-daylight-1044.webp 1044w, /images/campaign-daylight.webp 1800w';

function Arrow({ down = false }: { down?: boolean }) {
  return <svg className="arrow" aria-hidden="true" viewBox="0 0 24 24" fill="none">
    <path d={down ? 'M12 4v15m-6-6 6 6 6-6' : 'M6 18 18 6M6 6h12v12'} stroke="currentColor" strokeWidth="1.3" />
  </svg>;
}

export function FlagshipHero() {
  return <>
    <link rel="preload" as="image" href={mobileCampaign} media="(max-width: 767px)" fetchPriority="high" />
    <link rel="preload" as="image" imageSrcSet={campaignSources} imageSizes="100vw" media="(min-width: 768px)" fetchPriority="high" />
    <section className="hero light-hero" aria-labelledby="hero-title">
      <div className="hero-art">
        <picture>
          <source media="(max-width: 767px)" srcSet={mobileCampaign} />
          <img src="/images/campaign-daylight.webp" srcSet={campaignSources} sizes="100vw" width={1800} height={1200} fetchPriority="high" alt="A woman with her eyes closed in soft daylight, holding a lock of hair beside her face." />
        </picture>
      </div>
      <div className="hero-shade" aria-hidden="true" />
      <div className="hero-copy">
        <p className="hero-mark"><span>Light. Texture. Ritual.</span></p>
        <h1 id="hero-title"><span className="reveal-line"><span>THE ART OF </span></span><span className="reveal-line"><span>ELEVATED </span></span><span className="reveal-line"><span>SKINCARE.</span></span></h1>
        <p className="hero-description">Thoughtful formulation meets contemporary luxury.</p>
        <a href="#collection" className="button button-dark">Discover the collection <Arrow /></a>
      </div>
      <div className="hero-bottom">
        <i className="hero-seam" aria-hidden="true" />
        <p>Founded in London.<br />Formulated and manufactured in South Korea.</p>
        <a href="#house">The world of SHENERIO <Arrow down /></a>
        <span>The inaugural collection</span>
      </div>
    </section>
  </>;
}

const steps = ['Treat', 'Nourish'];
const stageMedia = '(min-width: 1024px) and (min-height: 680px) and (pointer: fine) and (prefers-reduced-motion: no-preference)';
const emptyStageImage = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

function StagePhoto({ src, sizes, quality, pack }: { src: string; sizes: string; quality?: number; pack?: string }) {
  const { props } = getImageProps({ src, alt: '', fill: true, sizes, quality });
  return <picture>
    <source media={stageMedia} srcSet={props.srcSet} sizes={sizes} />
    <img src={emptyStageImage} alt="" decoding="async" fetchPriority="low" data-pack={pack} />
  </picture>;
}

export function LumiclearCollection() {
  return <section className="collection flagship-collection" id="collection" aria-labelledby="collection-title">
    <div className="collection-intro wrap">
      <div className="chapter-label"><span>The inaugural collection</span><span>01 Treat / 02 Nourish</span></div>
      <div className="collection-title-row">
        <h2 id="collection-title">The LUMICLEAR<br />collection.</h2>
        <div className="collection-intro-actions">
          <p>Two complementary essentials for everyday skincare.</p>
          <a className="text-link" href="/collections/lumiclear">Explore the collection <Arrow /></a>
        </div>
      </div>
    </div>
    <div className="collection-sequence wrap">
      <div className="collection-optics-track" data-phase="treat" id="collection-details">
        <div className="collection-optics">
          <div className="optics-visual" aria-hidden="true">
            <div className="optics-rose" />
            {products.map((product, index) => <div key={product.id} className={`optics-study optics-study-${index}`}>
              <div className="optics-material"><StagePhoto src={product.gallery[2].src} sizes="28vw" /></div>
              <div className="optics-word"><span>{steps[index]}.</span></div>
              <div className="optics-object"><StagePhoto src={product.gallery[0].src} sizes="36vw" quality={85} pack={product.id} /></div>
            </div>)}
            <div className="optics-seam" />
            <span className="optics-caption">LUMICLEAR · Illustrative textures</span>
          </div>
          <div className="optics-rail">
            <p>LUMICLEAR / The two-step ritual</p>
            <div className="optics-notes">
              {products.map((product, index) => <article id={product.id} key={product.id} className={`optics-note optics-note-${index}`} aria-labelledby={`${product.id}-title`}>
                <div className="optics-mobile-art">
                  <div className="optics-mobile-texture"><Image src={product.gallery[2].src} alt={product.gallery[2].alt} fill sizes="(max-width: 767px) 36vw, 20vw" /></div>
                  <span aria-hidden="true">{steps[index]}.</span>
                  <div className="optics-mobile-pack"><Image src={product.gallery[0].src} alt={product.gallery[0].alt} fill sizes="(max-width: 767px) 62vw, 36vw" quality={85} /></div>
                </div>
                <p className="optics-step">0{index + 1} / {steps[index]}</p>
                <h3 className="optics-name" id={`${product.id}-title`}><span>LUMICLEAR</span>{product.shortName}</h3>
                <p className="optics-price">{productPrice(product.price)}</p>
                <p className="optics-description">{product.description}</p>
                <a className="button button-dark optics-mobile-shop" href={productHref(product)}>Discover {product.step === 'Treat' ? 'the serum' : 'the cream'} <Arrow /></a>
              </article>)}
            </div>
            <div className="optics-rail-actions">
              <nav className="optics-shop" aria-label="LUMICLEAR stage products">
                {products.map(product => <a key={product.id} href={productHref(product)} aria-label={`View ${product.shortName}, ${productPrice(product.price)}`}>
                  {product.step === 'Treat' ? 'View serum' : 'View cream'} <Arrow />
                </a>)}
              </nav>
              <div className="optics-meter" aria-hidden="true"><span>01</span><i /><span>02</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>;
}
