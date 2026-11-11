import type { Metadata } from 'next';
import { AtlasMotion } from '@/components/atlas-motion';
import { EditorialArrow, EditorialPhoto } from '@/components/editorial-photo';
import { IngredientAtlas } from '@/components/ingredient-atlas';
import '../editorial-pages.css';

export const metadata: Metadata = {
  title: 'Formulation | SHENERIO',
  description: 'Explore the roles of humectants, emollients and conditioning ingredients in SHENERIO’s LUMICLEAR skincare.',
};

// Ingredient roles and product associations follow TIL.pdf, pp. 15–17.
const ingredients = [
  { id: 'hydration', title: 'Hydration', names: ['Glycerin', 'Sodium hyaluronate'], text: 'Humectants attract and retain moisture. Glycerin and sodium hyaluronate contribute to the hydration-focused character of our LUMICLEAR formulations.', image: { src: '/images/atlas-hydration-skin.webp', alt: 'A close-up of natural cheek texture and a fingertip with a small amount of moisturiser.', caption: 'Skincare application study / Greta Hoffman' } },
  { id: 'skin-conditioning', title: 'Skin conditioning', names: ['Panthenol', 'Allantoin'], text: 'Panthenol and allantoin are recognised for their skin-conditioning properties. They contribute to the moisturising and conditioning character of our formulations.', study: '/images/serum-touch.webp' },
  { id: 'nourishment', title: 'Nourishment and moisturisation', names: ['Squalane', 'Shea butter'], text: 'Squalane and shea butter are emollients used to soften and condition the skin. They contribute to the nourishing character of LUMICLEAR RADIANCE CREAM.', study: '/images/cream-fold.webp' },
  { id: 'niacinamide', title: 'Niacinamide', names: ['Vitamin B3'], text: 'Also known as vitamin B3, niacinamide is a multifunctional cosmetic ingredient used in formulations for the appearance of uneven skin tone and to support the skin’s moisture barrier. It features in both LUMICLEAR formulations.', study: '/images/serum-fluid.webp' },
  { id: 'botanicals', title: 'Botanical ingredients', names: ['Aloe-derived extract', 'Centella asiatica extract'], text: 'Selected botanical ingredients, including aloe-derived extract and Centella asiatica extract, contribute to the ingredient composition of our moisturiser.', image: { src: '/images/atlas-botanical.webp', alt: 'Fine leaf veins in soft, transmitted daylight.', caption: 'Illustrative botanical study' } },
];

export default function FormulationPage() {
  return (
    <div className="ed-page ed-formulation">
      <section className="ed-wrap ed-formulation-hero" aria-labelledby="formulation-page-title">
        <div className="ed-formulation-masthead">
          <div>
            <p className="ed-kicker">A closer look</p>
            <h1 id="formulation-page-title">The formulation.</h1>
          </div>
          <div className="ed-formulation-lead">
            <p className="ed-hero-deck">Understanding the ingredients behind your skincare.</p>
            <a className="text-link" href="#ingredient-study">Browse all five chapters <EditorialArrow down /></a>
          </div>
        </div>
        <figure className="atlas-figure">
          <div className="atlas-plate-spread">
            <EditorialPhoto className="ed-formulation-plate" src="/images/atlas-plate.webp" alt="Glass dishes with illustrative cosmetic textures on warm limestone." sizes="(max-width: 767px) 80vw, 73vw" eager />
            <EditorialPhoto className="atlas-plate-inset" src="/images/serum-fluid.webp" alt="Light passing through a clear cosmetic texture." sizes="(max-width: 767px) 24vw, 20vw" />
          </div>
          <figcaption className="atlas-reading-slip">
            <p className="ed-kicker">Illustrative material study</p>
            <p className="atlas-reading-headline">What each ingredient contributes.</p>
            <p>Our approach brings together established cosmetic ingredients, selected for their roles in hydration, moisturisation and skin conditioning.</p>
          </figcaption>
        </figure>
      </section>

      <section className="ed-wrap ed-ingredient-study" id="ingredient-study" aria-labelledby="ingredient-study-title">
        <header className="ed-ingredient-rail">
          <IngredientAtlas topics={ingredients} />
          <noscript><nav className="ed-ingredient-nav" aria-label="Ingredient chapters">
            {ingredients.map(ingredient => <a key={ingredient.id} href={`#${ingredient.id}`}>{ingredient.title}</a>)}
          </nav></noscript>
        </header>
        <div className="ed-ingredient-entries">
          {ingredients.map((ingredient, index) => (
            <section key={ingredient.id} id={ingredient.id} className="ed-ingredient-entry" data-topic={ingredient.id} aria-labelledby={`${ingredient.id}-heading`}>
              {ingredient.image && <figure className="atlas-ingredient-figure">
                <EditorialPhoto className="atlas-ingredient-photo" src={ingredient.image.src} alt={ingredient.image.alt} sizes="(max-width: 767px) 92vw, 62vw" reveal />
                <figcaption>{ingredient.image.caption}</figcaption>
              </figure>}
              <div className="atlas-ingredient-copy">
                <span aria-hidden="true" className="atlas-number">0{index + 1}</span>
                <h3 id={`${ingredient.id}-heading`}>{ingredient.title}</h3>
                <ul className="ed-ingredient-names" aria-label="Ingredient highlights">{ingredient.names.map(name => <li key={name}>{name}</li>)}</ul>
                <p>{ingredient.text}</p>
                {ingredient.id === 'niacinamide' && <a className="text-link" href="/journal/niacinamide">Read the Journal introduction <EditorialArrow /></a>}
                {ingredient.id === 'nourishment' && <a className="text-link" href="/products/lumiclear-radiance-cream">Explore Radiance Cream <EditorialArrow /></a>}
              </div>
            </section>
          ))}
          <section id="formulation-commitment" className="ed-ingredient-entry ed-ingredient-commitment" aria-labelledby="formulation-commitment-title">
            <h3 id="formulation-commitment-title">Our commitment</h3>
            <p>Formulation is part of the experience. We value thoughtful ingredients and clear communication about the skincare people choose for their daily routines.</p>
            <a className="text-link" href="/collections">Discover the formulations <EditorialArrow /></a>
          </section>
        </div>
      </section>
      <AtlasMotion />
    </div>
  );
}
