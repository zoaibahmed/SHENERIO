import Image, { getImageProps } from 'next/image';
import { products, price } from '@/lib/products';
import { Header, ProductButton, ProductPreview, MotionDirector } from '@/components/experience';

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="arrow"><path d={diagonal ? 'M6 18 18 6M6 6h12v12' : 'M4 12h15m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.2" /></svg>;
}

export default function Home() {
  const campaignAlt = 'An original campaign study: warm sculptural light on natural skin, with fingertips framing the face.';
  const { props: wideCampaign } = getImageProps({ src: '/images/campaign.webp', alt: campaignAlt, fill: true, sizes: '100vw', quality: 85 });
  const { props: phoneCampaign } = getImageProps({ src: '/images/portrait.webp', alt: campaignAlt, fill: true, sizes: '(max-width: 767px) 600px, 100vw', quality: 85 });
  return <>
    <link rel="preload" as="image" imageSrcSet={phoneCampaign.srcSet} imageSizes={phoneCampaign.sizes} media="(max-width: 1023px)" fetchPriority="high" />
    <link rel="preload" as="image" imageSrcSet={wideCampaign.srcSet} imageSizes={wideCampaign.sizes} media="(min-width: 1024px)" fetchPriority="high" />
    <a href="#main" className="skip-link">Skip to content</a>
    <Header />
    <main id="main">
      <section className="campaign" aria-labelledby="campaign-title">
        <div className="campaign-frame">
          <div className="campaign-image">
            <picture><source media="(max-width: 1023px)" srcSet={phoneCampaign.srcSet} sizes={phoneCampaign.sizes} /><img {...wideCampaign} loading="eager" fetchPriority="high" alt={campaignAlt} /></picture>
          </div>
          <div className="campaign-content">
            <p className="campaign-origin">A contemporary vision<br />of luxury skincare.</p>
            <h1 id="campaign-title"><span className="line-mask"><span>The art of</span></span><span className="line-mask"><span>elevated skincare.</span></span></h1>
            <a href="#collection" className="campaign-cta"><span>Discover the collection</span><span className="circle"><Arrow diagonal /></span></a>
          </div>
          <div className="campaign-bottom">
            <p>Founded in London.<br />Formulated in South Korea.</p>
            <a href="#house" className="scroll-cue">Enter our world <span aria-hidden="true">↓</span></a>
          </div>
          <div className="campaign-wordmark" aria-hidden="true">{'SHENERIO'.split('').map((letter, i) => <span key={i}>{letter}</span>)}</div>
        </div>
      </section>

      <section className="house section-wrap" id="house" aria-labelledby="house-title">
        <div className="house-intro"><p className="section-label">Our House</p><span className="fine-note">Advanced skincare. Refined by design.</span></div>
        <div className="house-composition">
          <h2 id="house-title">A house built<br />around the art<br />of skincare.</h2>
          <figure className="house-portrait">
            <div className="house-portrait-window"><Image src="/images/portrait.webp" alt="A companion campaign portrait, a quiet downward gaze and fingertips resting against the cheek." fill sizes="(max-width: 767px) 100vw, 50vw" quality={85} /></div>
            <figcaption>A moment to pause. A ritual to return to.</figcaption>
          </figure>
          <div className="house-copy">
            <p className="house-lead">Born in London.<br />Considered in every detail.</p>
            <p>SHENERIO represents a contemporary vision of luxury skincare. Founded in London, our brand brings together an appreciation for modern beauty, thoughtful ingredient selection and the formulation innovation of South Korea.</p>
            <p>We believe skincare should be considered in every detail, from the ingredients within each formulation to the experience of incorporating it into your daily routine.</p>
            <details className="philosophy"><summary>Our philosophy <span aria-hidden="true">+</span></summary><div><p>Our philosophy is centred on creating skincare essentials that make everyday care feel exceptional.</p><p>Thoughtful formulation. Inspired by Korean innovation. Refined simplicity. The beauty of everyday rituals.</p></div></details>
          </div>
        </div>
        <div className="house-signature"><span>Thoughtful ingredients.</span><span>Considered formulations.</span></div>
      </section>

      <section className="collection section-wrap" id="collection" aria-labelledby="collection-title">
        <div className="collection-heading"><div><p className="section-label">Our inaugural collection</p><h2 id="collection-title">The LUMICLEAR<br />collection.</h2></div><p>Two complementary essentials.<br />A considered approach<br />to everyday skincare.</p></div>
        <div className="product-pair">
          {products.map((product, index) => <article className={`product product-${index}`} key={product.id} aria-labelledby={`${product.id}-title`}>
            <ProductButton productId={product.id} className="product-stage" label={`Explore ${product.name}`}>
              <div className="product-media"><Image src={product.image} alt={`Concept packaging for ${product.name}: frosted celadon glass with a brushed silver lid.`} fill sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 55vw" quality={85} /></div>
              <span className="stage-top"><span>LUMICLEAR</span><span className="stage-action">Explore <Arrow diagonal /></span></span>
              <span className="stage-bottom"><span>{index === 0 ? 'The hydration-focused essential' : 'The nourishing essential'}</span><span className="stage-circle"><Arrow diagonal /></span></span>
            </ProductButton>
            <div className="product-info"><div><p className="product-tagline">{product.tagline}</p><h3 id={`${product.id}-title`}>{product.name}</h3></div><span className="product-price">{price(product.price)}</span></div>
            <p className="product-description">{product.description}</p>
            <ProductButton productId={product.id} className="text-action" label={`Discover ${product.shortName}`}>Discover {product.shortName}<Arrow /></ProductButton>
          </article>)}
          <p className="pair-note">Two considered essentials.<br /><span>One elevated skincare ritual.</span></p>
        </div>
        <div className="collection-footnote"><p>Packaging shown is a creative concept.<br />Final product imagery and specifications are awaiting approval.</p><a href="#campaign-title">Back to the beginning <span aria-hidden="true">↑</span></a></div>
      </section>
    </main>
    <footer className="preview-footer"><a href="#main" className="footer-brand">SHENERIO</a><p>Private creative preview<br />Campaign imagery is AI-generated. No purchases are available.</p><span>London, United Kingdom</span></footer>
    <ProductPreview />
    <MotionDirector />
  </>;
}
