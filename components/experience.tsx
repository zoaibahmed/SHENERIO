'use client';
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type KeyboardEvent } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { products, price, productHref } from '@/lib/products';
import { chapters as navigationChapters, utilities } from '@/lib/site-navigation';

const previewEvent = 'shenerio:preview';
type PreviewRequest = { id: string; trigger: HTMLButtonElement };
function emitPreview(detail: PreviewRequest) {
  window.dispatchEvent(new CustomEvent<PreviewRequest>(previewEvent, { detail }));
}
const Arrow = () => <svg className="arrow" aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M6 18 18 6M6 6h12v12" stroke="currentColor" strokeWidth="1.25" /></svg>;

export function ProductButton({productId,className,children,label}:{productId:string;className:string;children:ReactNode;label:string}) {
 return <button type="button" className={className} aria-label={label} aria-haspopup="dialog" onClick={event => emitPreview({ id: productId, trigger: event.currentTarget })}>{children}</button>;
}
const utilityPaths = {
  Search: 'M16 16l5 5M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13Z',
  Account: 'M4 21c0-4.2 3.6-7 8-7s8 2.8 8 7M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
  Bag: 'M5 8h14l1 13H4L5 8ZM9 9V6a3 3 0 0 1 6 0v3',
};

function MobileChapters({onNavigate}: {onNavigate: () => void}) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <nav className="mobile-navigation" aria-label="Explore SHENERIO">
      {navigationChapters.map(({ label, href, image, description }) => {
        const expanded = active === href;
        const id = `menu-${href.slice(1)}`;
        return (
          <div className="mobile-chapter" data-expanded={expanded} key={href}>
            <button type="button" className="mobile-chapter-toggle" aria-expanded={expanded} aria-controls={id} onClick={() => setActive(expanded ? null : href)}>
              <span>{label}</span><span className="mobile-chapter-symbol" aria-hidden="true" />
            </button>
            <div className="mobile-chapter-expand" id={id} inert={!expanded} aria-hidden={!expanded}>
              <div className="mobile-chapter-clip">
                <div className="mobile-chapter-story">
                  {expanded && <Image src={image} alt="" fill sizes="100vw" />}
                  <div className="mobile-chapter-copy">
                    <p>{description}</p>
                    <a href={href} onClick={onNavigate}>Explore {label}<Arrow /></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </nav>
  );
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!document.querySelector('dialog[open]') && !wrapper.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape' && !document.querySelector('dialog[open]')) {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', escape);
    };
  }, [open]);

  return (
    <header className={`site-header${pathname === '/' ? '' : ' is-interior'}`} ref={wrapper}>
      <a href="/" className="brand" aria-label="SHENERIO home" onClick={() => setOpen(false)}>SHENERIO</a>
      <nav className="primary-nav" aria-label="Main navigation">
        {navigationChapters.map(({ label, href }) => <a key={href} href={href} aria-current={pathname === href ? 'page' : undefined} onClick={() => setOpen(false)}>{label}</a>)}
      </nav>
      <div className="header-actions">
        <button className="menu-toggle" type="button" ref={toggle} aria-expanded={open} aria-controls="collection-menu" onClick={() => setOpen(!open)}>
          <span className="desktop-menu-label">The collection</span><span className="phone-menu-label">Menu</span>
          <span className={`menu-symbol ${open ? 'open' : ''}`} aria-hidden="true"><i /><i /></span>
        </button>
        <nav className="header-utilities" aria-label="Store tools">
          {utilities.map(({ label, href }) => <a key={href} href={href} aria-label={label} aria-current={pathname === href ? 'page' : undefined}>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d={utilityPaths[label]} stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </a>)}
        </nav>
      </div>
      <div
        id="collection-menu" className="collection-menu" data-lenis-prevent hidden={!open}
        onBlur={event => {
          if (event.relatedTarget && !document.querySelector('dialog[open]') && !wrapper.current?.contains(event.relatedTarget as Node)) setOpen(false);
        }}
      >
        <div className="menu-editorial">
          <p className="eyebrow">The LUMICLEAR collection</p>
          <h2>Two essentials.<br /> One considered ritual.</h2>
          <a href="/collections" className="text-link" onClick={() => setOpen(false)}>Browse collections <Arrow /></a>
          {open && <MobileChapters onNavigate={() => setOpen(false)} />}
          <a href="/account" className="menu-account">Account <Arrow /></a>
        </div>
        {products.map((product, index) => (
          <div className="menu-product" data-ritual={index ? 'nourish' : 'treat'} key={product.id}>
            <ProductButton productId={product.id} className="menu-product-button" label={`Preview ${product.name}`}>
              <div><Image src={product.gallery[0].src} alt="" width={420} height={420} sizes="(max-width:767px) 45vw, 25vw" /></div>
              <span>{product.shortName}</span><span>{price(product.price)}</span>
            </ProductButton>
            <a className="menu-pdp-link" href={productHref(product)}>View {product.shortName}</a>
          </div>
        ))}
        <button type="button" className="menu-close icon-button" aria-label="Close navigation" onClick={() => { setOpen(false); toggle.current?.focus(); }}>×</button>
      </div>
    </header>
  );
}

const ingredients=[
 {name:'Niacinamide',role:'Vitamin B3',text:'A multifunctional cosmetic ingredient, featured in both LUMICLEAR formulations. Understanding your skincare should be part of the experience.'},
 {name:'Panthenol',role:'Skin conditioning',text:'Known for its moisturising and skin-conditioning properties. Featured in the serum and cream ingredient stories.'},
 {name:'Sodium hyaluronate',role:'Hydration',text:'A form of hyaluronic acid widely used in skincare for its moisture-binding properties.'},
 {name:'Squalane',role:'Nourishment',text:'An emollient ingredient selected for the nourishing character of LUMICLEAR RADIANCE CREAM.'},
];
export function IngredientExplorer() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function select(index: number) {
    setActive(index);
    refs.current[index]?.focus({ preventScroll: true });
  }

  function move(event: KeyboardEvent<HTMLDivElement>) {
    let next: number;
    switch (event.key) {
      case 'ArrowRight': next = (active + 1) % ingredients.length; break;
      case 'ArrowLeft': next = (active + ingredients.length - 1) % ingredients.length; break;
      case 'Home': next = 0; break;
      case 'End': next = ingredients.length - 1; break;
      default: return;
    }
    event.preventDefault();
    select(next);
  }

  return <div className="ingredient-explorer">
    <div role="tablist" aria-label="Explore ingredients" className="ingredient-tablist" onKeyDown={move}>
      {ingredients.map((item, index) => <button
        key={item.name} role="tab" type="button"
        ref={element => { refs.current[index] = element; }}
        id={`ingredient-${index}`} aria-controls={`ingredient-panel-${index}`}
        aria-selected={active === index} tabIndex={active === index ? 0 : -1}
        onClick={() => select(index)}
      >{item.name}<span aria-hidden="true">↗</span></button>)}
    </div>
    <div className="ingredient-content">
      {ingredients.map((item, index) => <div
        key={item.name} role="tabpanel" id={`ingredient-panel-${index}`}
        aria-labelledby={`ingredient-${index}`} aria-hidden={active !== index} inert={active !== index}
        data-active={active === index} className="ingredient-panel" tabIndex={active === index ? 0 : -1}
      ><span>{item.role}</span><p>{item.text}</p></div>)}
    </div>
  </div>;
}

export function Newsletter(){const[status,setStatus]=useState('');return <form className="newsletter-form" onSubmit={e=>{e.preventDefault();setStatus('Preview complete. Your email has not been submitted or saved.')}}><p className="newsletter-preview">Subscription preview — no email is submitted.</p><label htmlFor="newsletter-email">Your email address</label><div className="newsletter-input"><input id="newsletter-email" type="email" autoComplete="email" placeholder="Email address" required/><button aria-label="Join the SHENERIO community" type="submit"><Arrow/></button></div><p>By subscribing, you agree to receive marketing communications from SHENERIO. You may unsubscribe at any time. <a href="/privacy-policy" className="newsletter-policy">Privacy Policy</a></p><p className="form-status" role="status">{status}</p></form>}

export function JournalFeature() {
  return <div className="journal-feature">
    <a href="/journal/niacinamide" className="journal-image" aria-label="Read the niacinamide editorial introduction">
      <Image src="/images/journal-light.webp" alt="An open paper folio and optical glass in window light." fill sizes="94vw" quality={80} />
      <span>Ingredient perspectives <Arrow /></span>
    </a>
    <div className="journal-feature-copy">
      <span className="eyebrow">Featured editorial introduction</span>
      <h3>NIACINAMIDE:<br />AN ESSENTIAL INGREDIENT<br />IN MODERN SKINCARE.</h3>
      <p>Niacinamide, also known as vitamin B3, is one of the most widely recognised ingredients in contemporary skincare.</p>
      <a className="text-link" href="/journal">Explore the Journal <Arrow /></a>
      <small>Editorial introduction supplied in the brand brief.<br />Full articles are in preparation.</small>
    </div>
  </div>;
}

export function ProductPreview() {
  const dialog = useRef<HTMLDialogElement>(null);
  const launcher = useRef<HTMLElement | null>(null);
  const [selection, setSelection] = useState(products[0].id);
  const [view, setView] = useState(0);
  const [shown, setShown] = useState(false);
  const product = products.find(item => item.id === selection) ?? products[0];
  const isSerum = product.id === 'target-serum';
  const companion = isSerum ? products[1] : products[0];

  useEffect(() => {
    const panel = dialog.current;
    const open = (event: Event) => {
      if (!panel || panel.open) return;
      const detail = (event as CustomEvent<PreviewRequest>).detail;
      setSelection(detail.id);
      setView(0);
      setShown(true);
      launcher.current = detail.trigger;
    };
    window.addEventListener(previewEvent, open);
    return () => window.removeEventListener(previewEvent, open);
  }, []);

  useLayoutEffect(() => {
    const panel = dialog.current;
    if (!shown || !panel || panel.open) return;
    panel.showModal();
    panel.scrollTop = 0;
  }, [shown]);

  function trap(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== 'Tab') return;
    const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]),a[href],summary,input,[tabindex="0"]'));
    const visible = controls.filter(control => control.getClientRects().length > 0);
    const first = visible[0];
    const last = visible.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  return (
    <dialog
      ref={dialog} data-lenis-prevent className="product-dialog"
      aria-labelledby="preview-title" onKeyDown={trap}
      onClick={event => { if (event.target === dialog.current) dialog.current?.close(); }}
      onClose={() => {
        setShown(false);
        launcher.current?.focus({ preventScroll: true });
      }}
    >
      <div className="preview-layout">
        <button type="button" className="preview-close icon-button" autoFocus aria-label="Close product preview" onClick={() => dialog.current?.close()}>×</button>
        {shown && (
          <>
            <div className={`preview-gallery ${view ? 'show-detail' : ''}`} data-ritual={isSerum ? 'treat' : 'nourish'}>
              <div className="preview-photo preview-base" aria-hidden={!!view}>
                <Image src={product.gallery[0].src} alt={product.gallery[0].alt} loading="eager" fill sizes="(max-width:767px) 100vw, 50vw" quality={85} />
              </div>
              <div className="preview-photo preview-alternate" aria-hidden={!view}>
                <Image src={product.gallery[1].src} alt={product.gallery[1].alt} loading="eager" fill sizes="(max-width:767px) 100vw, 50vw" quality={85} />
              </div>
              <span className="gallery-caption">{isSerum ? '01 / Treat' : '02 / Nourish'}</span>
              <div className="gallery-controls" role="group" aria-label="Product photography">
                <button type="button" aria-label="Show full product" aria-pressed={!view} onClick={() => setView(0)}>Pack</button>
                <button type="button" aria-label="Show packaging detail" aria-pressed={!!view} onClick={() => setView(1)}>Studio</button>
                <button type="button" aria-label="Next product image" onClick={() => setView(view ? 0 : 1)}>↗</button>
              </div>
            </div>
            <div className="preview-copy">
              <span className="eyebrow">The LUMICLEAR collection</span>
              <h2 id="preview-title">{product.shortName}</h2>
              <p className="preview-exact-name">{product.name}</p>
              <p className="preview-price">{price(product.price)} <span>GBP</span></p>
              <p>{product.description}</p>
              <details className="preview-accordion" key={`${product.id}-ingredients`}>
                <summary>Ingredient highlights <span aria-hidden="true">+</span></summary>
                <ul>{product.ingredients.map(ingredient => <li key={ingredient}>{ingredient}</li>)}</ul>
              </details>
              <details className="preview-accordion" key={`${product.id}-ritual`}>
                <summary>The considered ritual <span aria-hidden="true">+</span></summary>
                <p>{product.use}</p>
              </details>
              <p className="preview-status">Online shopping is unavailable in this preview.</p>
              <a className="button button-dark" href={productHref(product)}>View full product <Arrow /></a>
              <button type="button" className="text-link" onClick={() => { setSelection(companion.id); setView(0); dialog.current?.scrollTo(0, 0); }}>
                Explore {companion.shortName}<Arrow />
              </button>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}
