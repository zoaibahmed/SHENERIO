'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import { products, price } from '@/lib/products';

const previewEvent = 'shenerio:preview';

export function ProductButton({ productId, className, children, label }: { productId: string; className: string; children: ReactNode; label: string }) {
  return <button type="button" className={className} aria-label={label} aria-haspopup="dialog" onClick={() => window.dispatchEvent(new CustomEvent(previewEvent, { detail: { id: productId, trigger: document.activeElement } }))}>{children}</button>;
}

export function Header() {
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const outside = (e: PointerEvent) => { if (!wrapper.current?.contains(e.target as Node)) setOpen(false); };
    const escape = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); toggle.current?.focus(); } };
    document.addEventListener('pointerdown', outside); document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); };
  }, [open]);
  return <header className="site-header" ref={wrapper}>
    <a href="#main" className="brand" aria-label="SHENERIO home">SHENERIO</a>
    <nav aria-label="Main navigation" className="primary-nav">
      <button ref={toggle} type="button" className="collection-toggle" aria-expanded={open} aria-controls="collection-menu" onClick={() => setOpen(!open)}>The collection <span aria-hidden="true" className={open ? 'toggle-plus expanded' : 'toggle-plus'}>+</span></button>
      <a href="#house" className="house-nav" onClick={() => setOpen(false)}>Our House</a>
    </nav>
    <a href="#collection" className="header-link" onClick={() => setOpen(false)}>Explore LUMICLEAR <span aria-hidden="true">↗</span></a>
    <div id="collection-menu" className="collection-menu" hidden={!open} onBlur={e => { if (e.relatedTarget && !wrapper.current?.contains(e.relatedTarget as Node)) setOpen(false); }}>
      <div className="menu-intro"><p>The LUMICLEAR collection</p><h2>Everyday care,<br />considered.</h2><a href="#collection" onClick={() => setOpen(false)}>Discover the collection <span aria-hidden="true">↗</span></a></div>
      {products.map(product => <div className="menu-product" key={product.id}><ProductButton productId={product.id} className="menu-product-button" label={`Preview ${product.name}`}><Image src={product.image} alt="" width={480} height={600} sizes="(max-width: 767px) 45vw, 30vw" /><span>{product.shortName}</span><span>{price(product.price)}</span></ProductButton></div>)}
      <a href="#house" className="mobile-house-link" onClick={() => setOpen(false)}>Discover our House <span aria-hidden="true">↗</span></a>
      <button className="menu-close" onClick={() => setOpen(false)} aria-label="Close collection menu">×</button>
    </div>
  </header>;
}

export function ProductPreview() {
  const dialog = useRef<HTMLDialogElement>(null);
  const launcher = useRef<HTMLElement | null>(null);
  const [productId, setProductId] = useState(products[0].id);
  const [detail, setDetail] = useState(false);
  const product = products.find(p => p.id === productId) ?? products[0];
  useEffect(() => {
    const open = (event: Event) => {
      const { id, trigger } = (event as CustomEvent).detail;
      setProductId(id); setDetail(false); launcher.current = trigger;
      dialog.current?.showModal();
      document.body.style.overflow = 'hidden';
    };
    window.addEventListener(previewEvent, open);
    return () => { window.removeEventListener(previewEvent, open); document.body.style.overflow = ''; };
  }, []);
  const close = () => dialog.current?.close();
  return <dialog className="product-dialog" ref={dialog} aria-labelledby="preview-title" onKeyDown={e => {
    if (e.key !== 'Tab') return;
    const focusable = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], summary, [tabindex="0"]')).filter(el => el.getClientRects().length > 0);
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
  }} onClose={() => { document.body.style.overflow = ''; launcher.current?.focus(); }} onClick={e => { if (e.target === dialog.current) close(); }}>
    <div className="preview-layout">
      <div className={`preview-gallery ${detail ? 'show-detail' : ''}`}>
        <div className="preview-photo" key={product.id}><Image src={product.image} alt={`Concept packaging of ${product.name}${detail ? ', closer view of glass and label' : ''}.`} fill sizes="(max-width: 767px) 100vw, 50vw" quality={85} /></div>
        <span className="gallery-caption">{detail ? 'Material & detail' : 'The product study'}</span>
        <div className="gallery-controls"><button aria-label="Show full product" aria-pressed={!detail} onClick={() => setDetail(false)}>01</button><button aria-label="Show packaging detail" aria-pressed={detail} onClick={() => setDetail(true)}>02</button></div>
      </div>
      <div className="preview-copy"><p className="section-label">The LUMICLEAR collection</p><h2 id="preview-title">{product.shortName}</h2><p className="preview-exact-name">{product.name}</p><p className="preview-price">{price(product.price)} <span>GBP</span></p><p>{product.description}</p>
        <details className="preview-accordion" key={`${product.id}-ingredients`}><summary>Ingredient highlights <span aria-hidden="true">+</span></summary><ul>{product.ingredients.map(x => <li key={x}>{x}</li>)}</ul></details>
        <details className="preview-accordion" key={`${product.id}-use`}><summary>The considered ritual <span aria-hidden="true">+</span></summary><p>{product.use}</p></details>
        <div className="preview-status"><span className="status-dot" aria-hidden="true" /><p>Collection preview</p><small>Concept packaging. Product details are subject to final approval. Shopping will be introduced in a later phase.</small></div>
        <button className="text-action" onClick={() => {setProductId(products.find(p => p.id !== productId)!.id); setDetail(false);}}>Explore {products.find(p => p.id !== productId)!.shortName}<span aria-hidden="true">↗</span></button>
      </div>
      <button className="preview-close" autoFocus aria-label="Close product preview" onClick={close}>×</button>
    </div>
  </dialog>;
}

export function MotionDirector() {
  useEffect(() => {
    let disposed = false;
    let revert: (() => void) | undefined;
    // Load choreography after hydration; useful server-rendered content is never hidden behind JS.
    async function setup() {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const collection = gsap.timeline({ scrollTrigger: { trigger: '.product-pair', start: 'top 83%', once: true }, defaults: { ease: 'power3.out' } });
        collection.from('.product-0 .product-media', { clipPath: 'inset(10% 0 0 0)', scale: 1.04, duration: 1.1 })
          .from('.product-1 .product-media', { clipPath: 'inset(14% 0 0 0)', scale: 1.05, duration: 1.1 }, .18);
        return () => { collection.kill(); };
      });
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.to('.campaign-frame', { clipPath: 'inset(3% 3% 3% 3%)', ease: 'none', scrollTrigger: { trigger: '.campaign', start: 'top top', end: 'bottom top', scrub: .45 } });
        gsap.to('.campaign-content', { y: -50, ease: 'none', scrollTrigger: { trigger: '.campaign', start: 'top top', end: 'bottom top', scrub: .5 } });
        gsap.fromTo('.house-portrait-window img', { scale: 1.16, yPercent: -3 }, { scale: 1.12, yPercent: 3, ease: 'none', scrollTrigger: { trigger: '.house', start: 'top bottom', end: 'bottom top', scrub: .7 } });
        gsap.fromTo('.house-portrait', { y: 70 }, { y: -25, ease: 'none', scrollTrigger: { trigger: '.house', start: 'top bottom', end: 'bottom top', scrub: .7 } });
      });
      revert = () => mm.revert();
      await document.fonts.ready;
      if (!disposed) ScrollTrigger.refresh();
    }
    setup();
    return () => { disposed = true; revert?.(); };
  }, []);
  return null;
}
