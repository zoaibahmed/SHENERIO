'use client';

import Image from 'next/image';
import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { EditorialArrow } from './editorial-photo';
import { products, productHref } from '@/lib/products';

export function RitualStudy() {
  const [active, setActive] = useState(0);
  const id = useId();
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);

  function onTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    switch (event.key) {
      case 'ArrowRight': next = (index + 1) % products.length; break;
      case 'ArrowLeft': next = (index + products.length - 1) % products.length; break;
      case 'Home': next = 0; break;
      case 'End': next = products.length - 1; break;
      default: return;
    }
    event.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  }

  return (
    <section className="ed-ritual-study" aria-labelledby={`${id}-heading`} data-active={active === 0 ? 'treat' : 'nourish'}>
      <header className="ed-ritual-study-head">
        <div><p className="ed-kicker">The LUMICLEAR ritual</p><h2 id={`${id}-heading`}>Treat. Nourish.</h2></div>
        <div className="ed-ritual-tabs" role="tablist" aria-label="Discover the two LUMICLEAR steps">
          {products.map((product, index) => (
            <button
              key={product.id}
              type="button"
              role="tab"
              id={`${id}-tab-${index}`}
              aria-controls={`${id}-panel-${index}`}
              aria-selected={active === index}
              tabIndex={active === index ? 0 : -1}
              ref={element => { tabs.current[index] = element; }}
              onKeyDown={event => onTabKey(event, index)}
              onClick={() => setActive(index)}
            >
              <span aria-hidden="true">0{index + 1}</span> {product.step}
            </button>
          ))}
        </div>
      </header>
      <div className="ed-ritual-stage" aria-hidden="true">
        {products.map((product, index) => (
          <div className={`ed-ritual-layer ed-ritual-layer-${index}`} key={product.id}>
            <div className="ed-ritual-texture"><Image src={product.gallery[2].src} alt="" fill sizes="(max-width: 760px) 35vw, 24vw" /></div>
            <div className="ed-ritual-word"><span>{product.step}.</span></div>
            <div className="ed-ritual-object"><Image src={product.gallery[0].src} alt="" fill sizes="(max-width: 760px) 68vw, 31vw" quality={80} /></div>
          </div>
        ))}
        <span className="ed-ritual-stage-note">LUMICLEAR · Illustrative textures</span>
      </div>
      <div className="ed-ritual-study-copy">
        <div className="ed-ritual-panels">{products.map((product, index) => (
          <div key={product.id} role="tabpanel" id={`${id}-panel-${index}`} aria-labelledby={`${id}-tab-${index}`} inert={active !== index} aria-hidden={active !== index} data-active={active === index}>
            <p className="ed-kicker">Step 0{index + 1} / {product.step}</p>
            <h3>{product.shortName}</h3>
            <p>{product.description}</p>
            <p className="ed-ritual-use">{product.use}</p>
            <a className="text-link" href={productHref(product)}>Explore {product.step === 'Treat' ? 'the serum' : 'the cream'} <EditorialArrow /></a>
          </div>
        ))}</div>
      </div>
    </section>
  );
}
