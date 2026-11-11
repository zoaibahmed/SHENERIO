import Image from 'next/image';
import { IngredientExplorer } from '@/components/experience';
import '@/app/formulation-journey.css';

export function FormulationJourney() {
  return (
    <section className="formulation-journey" id="formulation" aria-labelledby="formulation-title">
      <div className="formulation-folio">
        <div className="formulation-masthead">
          <span>Formulation</span>
          <span>From texture to ingredients</span>
        </div>
        <div className="formulation-spread">
          <figure className="formulation-plate">
            <div className="formulation-plate-media">
              <Image
                src="/images/texture.webp"
                alt="Cream folds and drops of translucent gel on frosted glass."
                fill
                sizes="100vw"
                quality={80}
              />
            </div>
            <figcaption>An editorial texture study</figcaption>
          </figure>
          <div className="formulation-editorial">
            <h2 id="formulation-title">
              <span className="formulation-title-line"><span>Thoughtful ingredients. </span></span>
              <span className="formulation-title-line"><span>Considered formulations.</span></span>
            </h2>
            <p>We believe that understanding your skincare should be part of the experience.</p>
            <a className="formulation-index-link" href="#ingredient-index">
              Explore the ingredients <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </div>
      <section className="formulation-index-frame" id="ingredient-index" aria-labelledby="ingredient-index-title" tabIndex={-1}>
        <div className="formulation-index formulation-story">
          <div className="formulation-index-copy">
            <h3 id="ingredient-index-title">The Ingredient Index</h3>
            <p>
              At SHENERIO, we appreciate the role that carefully selected ingredients play in modern skincare. Our formulations bring together established cosmetic ingredients selected for their roles in hydration, moisturisation and skin conditioning.
            </p>
          </div>
          <IngredientExplorer />
        </div>
      </section>
    </section>
  );
}
