import Image from 'next/image';
import { ProductGallery, ProductPurchase } from '@/components/product-controls';
import { lumiclearCollection, products, productHref, productPrice, type Product } from '@/lib/products';
import './commerce-pages.css';

type Crumb = { label: string; href?: string };

function ShopBreadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className="commerce-breadcrumb" aria-label="Breadcrumb">
      <ol>
        <li><a href="/">Home</a></li>
        {items.map(item => <li key={item.label}>{item.href ? <a href={item.href}>{item.label}</a> : <span aria-current="page">{item.label}</span>}</li>)}
      </ol>
    </nav>
  );
}

function ProductCard({ product }: { product: Product }) {
  const [pack, studio] = product.gallery;
  return (
    <article className="commerce-card" data-product={product.id}>
      <a className="commerce-card-link" href={productHref(product)}>
        <div className="commerce-card-art">
          <span className="commerce-card-art-step" aria-hidden="true">{product.step}</span>
          <span className="commerce-card-art-ring" aria-hidden="true" />
          <Image src={pack.src} alt={pack.alt} fill sizes="(max-width: 700px) 90vw, 43vw" className="commerce-card-pack" />
          <Image src={studio.src} alt="" fill sizes="(max-width: 700px) 90vw, 43vw" className="commerce-card-studio" />
          <span className="commerce-card-art-caption">{product.step === 'Treat' ? '01' : '02'} / {product.step}</span>
        </div>
        <div className="commerce-card-content">
          <div>
            <h3>{product.name}</h3>
            <p>{productPrice(product.price)}</p>
          </div>
          <p className="commerce-card-role">{product.roles[0]}</p>
          <p>{product.description}</p>
          <span className="commerce-card-action">Discover {product.shortName.toLowerCase()} <span aria-hidden="true">↗</span></span>
        </div>
      </a>
    </article>
  );
}

export function CollectionPage({ feature = false }: { feature?: boolean }) {
  return (
    <div className="commerce-root commerce-collection" data-collection-view={feature ? 'lumiclear' : 'index'}>
      <div className="commerce-inset">
        <ShopBreadcrumb items={feature ? [{ label: 'Collections', href: '/collections' }, { label: 'LUMICLEAR' }] : [{ label: 'Collections' }]} />
      </div>
      {feature ? (
        <section className="commerce-collection-feature" aria-labelledby="lumiclear-heading">
          <div className="commerce-collection-feature-inner commerce-inset">
            <div className="commerce-collection-copy" data-reveal="stagger">
              <p className="commerce-kicker">The inaugural collection</p>
              <h1 id="lumiclear-heading">LUMICLEAR.</h1>
              <p>{lumiclearCollection.introduction}</p>
              <a href="#lumiclear-products" className="button button-dark">Explore the two steps <span aria-hidden="true">↓</span></a>
            </div>
            <figure className="commerce-collection-pair" data-reveal="image">
              {products.map(product => (
                <div className="commerce-collection-pack" key={product.id}>
                  <Image src={product.gallery[0].src} alt={product.gallery[0].alt} fill sizes="(max-width: 760px) 45vw, 38vw" loading="eager" />
                </div>
              ))}
              <figcaption>
                {products.map(product => <span key={product.id}><strong>{product.shortName}</strong><span>{productPrice(product.price)}</span></span>)}
              </figcaption>
            </figure>
          </div>
        </section>
      ) : (
        <section className="commerce-collection-index commerce-inset" aria-labelledby="collections-heading">
          <div className="commerce-collection-copy" data-reveal="stagger">
            <p className="commerce-kicker">SHENERIO / LUMICLEAR</p>
            <h1 id="collections-heading">The collections.</h1>
            <p>{lumiclearCollection.introduction}</p>
            <a href={lumiclearCollection.href} className="button button-dark">Explore LUMICLEAR <span aria-hidden="true">↗</span></a>
          </div>
          <figure className="commerce-collection-portrait" data-reveal="image">
            {products.map((product, index) => (
              <div className="commerce-collection-study" key={product.id}>
                <Image src={product.gallery[1].src} alt={product.gallery[1].alt} fill fetchPriority={index === 0 ? 'high' : undefined} loading="eager" sizes={index === 0 ? '58vw' : '32vw'} />
              </div>
            ))}
            <figcaption>LUMICLEAR / Target Serum and Radiance Cream</figcaption>
          </figure>
        </section>
      )}
      <section className="commerce-lineup commerce-inset" id="lumiclear-products" aria-labelledby="commerce-lineup-heading">
        <div className="commerce-lineup-title" data-reveal="heading">
          <h2 id="commerce-lineup-heading">Two complementary steps.</h2>
          <p>Each product reflects our appreciation for thoughtful ingredient selection and the beauty of everyday skincare.</p>
        </div>
        <div className="commerce-card-grid" data-reveal="stagger">{products.map(product => <ProductCard key={product.id} product={product} />)}</div>
      </section>
      <aside className="commerce-collection-closing commerce-inset">
        <p>The beginning of a considered approach to modern skincare.</p>
        <a className="text-link" href="/the-ritual">Discover the ritual <span aria-hidden="true">↗</span></a>
      </aside>
    </div>
  );
}

function ProductTexture({ product, className }: { product: Product; className: string }) {
  const texture = product.gallery[2];
  return <figure className={`commerce-product-macro ${className}`} data-reveal="depth">
    <Image src={texture.src} alt={texture.alt} fill sizes="100vw" />
    <figcaption>Illustrative texture study</figcaption>
  </figure>;
}

function IngredientNotes({ ingredients }: { ingredients: Product['ingredientHighlights'] }) {
  return <dl className="pdp-ingredient-notes">
    {ingredients.map(ingredient => <div key={ingredient.name}>
      <dt>{ingredient.name}</dt><dd>{ingredient.role}</dd>
    </div>)}
  </dl>;
}

function ProductEditorial({ product }: { product: Product }) {
  if (product.step === 'Treat') {
    return <>
      <section className="serum-material" id="product-texture" aria-labelledby="product-formulation-heading">
        <div className="commerce-inset pdp-material-heading" data-reveal="heading">
          <p className="commerce-kicker">A study in fluidity</p>
          <h2 id="product-formulation-heading">A lighter touch.</h2>
          <p>{product.texture}</p>
        </div>
        <ProductTexture product={product} className="serum-fluid-plate" />
        <div className="commerce-inset pdp-material-notes">
          <p>{product.formulation}</p>
          <IngredientNotes ingredients={product.ingredientHighlights.slice(0, 3)} />
          <a className="text-link" href="/formulation">Explore the ingredient atlas <span aria-hidden="true">↗</span></a>
        </div>
      </section>
      <section className="commerce-inset serum-application" aria-labelledby="serum-application-title">
        <figure className="pdp-touch-image" data-reveal="image">
          <Image src="/images/serum-touch.webp" alt="A clear cosmetic liquid held on a fingertip above an open palm." fill sizes="(max-width: 767px) 85vw, 35vw" />
          <figcaption>Illustrative application study</figcaption>
        </figure>
        <div><p className="commerce-kicker">01 / Treat</p><h2 id="serum-application-title">Begin with serum.</h2><p>{product.useSteps[0]}</p><a className="text-link" href="#product-details">How to use <span aria-hidden="true">↓</span></a></div>
      </section>
    </>;
  }

  return <section className="cream-material" id="product-texture" aria-labelledby="product-formulation-heading">
    <div className="commerce-inset cream-intimate">
      <div className="cream-intimate-heading" data-reveal="heading">
        <p className="commerce-kicker">02 / Nourish</p>
        <h2 id="product-formulation-heading">A moment of softness.</h2>
        <p>{product.formulation}</p>
        <a className="text-link" href="#product-details">How to use <span aria-hidden="true">↓</span></a>
      </div>
      <figure className="pdp-touch-image" data-reveal="image">
        <Image src="/images/cream-touch.webp" alt="A woman applying a small touch of moisturiser to her cheek in soft light." fill sizes="(max-width: 767px) 85vw, 34vw" />
        <figcaption>Illustrative application study</figcaption>
      </figure>
      <ProductTexture product={product} className="cream-fold-plate" />
    </div>
    <div className="commerce-inset pdp-material-notes">
      <p>{product.texture}</p>
      <IngredientNotes ingredients={product.ingredientHighlights.filter(ingredient => ['Squalane', 'Shea butter'].includes(ingredient.name))} />
      <a className="text-link" href="/formulation#nourishment">Explore nourishment and moisturisation <span aria-hidden="true">↗</span></a>
    </div>
  </section>;
}

export function ProductPage({ product, pairing }: { product: Product; pairing: Product }) {
  const step = product.step === 'Treat' ? '01' : '02';

  return (
    <div className="commerce-root commerce-pdp" data-product={product.id}>
      <div className="commerce-inset">
        <ShopBreadcrumb items={[{ label: 'Collections', href: '/collections' }, { label: 'LUMICLEAR', href: lumiclearCollection.href }, { label: product.shortName }]} />
        <section className="commerce-product-intro" aria-labelledby="product-title">
          <ProductGallery product={product} />
          <div className="commerce-product-summary" data-reveal="stagger">
            <p className="commerce-kicker">{step} / {product.step}</p>
            <h1 id="product-title"><span>LUMICLEAR</span>{product.name.slice('LUMICLEAR'.length)}</h1>
            <div className="commerce-product-facts">
              <p className="commerce-price">{productPrice(product.price)}</p>
              <p>{product.packLabelSize} <small>As shown on the pack</small></p>
            </div>
            <p className="commerce-product-tagline">{product.tagline}</p>
            <p className="commerce-product-description">{product.description}</p>
            <ProductPurchase />
            <nav className="commerce-product-jumps" aria-label="Explore this product">
              <a href="#product-texture">Texture <span aria-hidden="true">↓</span></a>
              <a href="#product-details">Ingredients and use <span aria-hidden="true">↓</span></a>
              <a href="#product-pairing">Complete the ritual <span aria-hidden="true">↓</span></a>
            </nav>
          </div>
        </section>
      </div>

      <ProductEditorial product={product} />

      <section id="product-details" className="commerce-product-details commerce-inset" aria-labelledby="product-details-heading">
        <div>
          <p className="commerce-kicker">Product details</p>
          <h2 id="product-details-heading">Considered in every detail.</h2>
          <p>Formulated and manufactured in South Korea.</p>
        </div>
        <div className="commerce-accordions">
          <details>
            <summary>Ingredient highlights <span aria-hidden="true">+</span></summary>
            <dl className="commerce-ingredient-list">{product.ingredientHighlights.map(ingredient => <div key={ingredient.name}><dt>{ingredient.name}</dt><dd>{ingredient.role}</dd></div>)}</dl>
          </details>
          <details>
            <summary>How to use <span aria-hidden="true">+</span></summary>
            <ol>{product.useSteps.map(instruction => <li key={instruction}>{instruction}</li>)}</ol>
            <p>Follow the directions on the final packaging. In the morning, complete your routine with a suitable broad-spectrum sunscreen.</p>
            <a className="text-link" href="/the-ritual">View the full morning and evening ritual <span aria-hidden="true">↗</span></a>
          </details>
          <details>
            <summary>Texture, suitability and makeup <span aria-hidden="true">+</span></summary>
            <p>{product.texture}</p>
            <p>{product.makeupGuidance}</p>
            <p>Skin suitability is awaiting final assessment.</p>
          </details>
          <details>
            <summary>Full ingredient list <span aria-hidden="true">+</span></summary>
            <p>{product.approvedInci ? product.approvedInci.join(', ') : 'The full INCI list is awaiting manufacturer approval.'}</p>
          </details>
          <details>
            <summary>Delivery and returns <span aria-hidden="true">+</span></summary>
            <p>Delivery and returns details are awaiting confirmation.</p>
            <div className="commerce-detail-links"><a className="text-link" href="/shipping-delivery">Shipping &amp; delivery</a><a className="text-link" href="/returns-refunds">Returns &amp; refunds</a></div>
          </details>
        </div>
      </section>

      <section className="commerce-product-pairing commerce-inset" id="product-pairing" aria-labelledby="pairing-heading">
        <div className="commerce-pairing-image" data-product={pairing.id} data-reveal="image">
          <Image src={pairing.gallery[0].src} alt={pairing.gallery[0].alt} fill sizes="(max-width: 760px) 78vw, 24vw" />
        </div>
        <div className="commerce-pairing-copy" data-reveal="stagger">
          <h2 id="pairing-heading">Complete your ritual.</h2>
          <p className="commerce-kicker">{pairing.step === 'Treat' ? '01' : '02'} / {pairing.step}</p>
          <h3>{pairing.name}</h3>
          <p>{pairing.description}</p>
          <p>{productPrice(pairing.price)}</p>
          <a className="button button-dark" href={productHref(pairing)}>Discover {pairing.shortName.toLowerCase()} <span aria-hidden="true">↗</span></a>
        </div>
      </section>
    </div>
  );
}
