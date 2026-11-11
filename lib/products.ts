// Product details follow TIL.pdf pp. 8–15. TIL 2.pdf p. 10 lists the pending approvals.
export type ProductImage = {
  src: string;
  label: string;
  alt: string;
  kind: 'pack' | 'studio' | 'texture';
};

export type IngredientHighlight = { name: string; role: string };

export type Product = {
  id: string;
  name: string;
  shortName: string;
  price: number;
  tagline: string;
  description: string;
  ingredients: string[];
  use: string;
  step: 'Treat' | 'Nourish';
  packLabelSize: string;
  approvedInci: readonly string[] | null;
  gallery: readonly ProductImage[];
  formulation: string;
  texture: string;
  roles: readonly string[];
  ingredientHighlights: readonly IngredientHighlight[];
  useSteps: readonly string[];
  makeupGuidance: string;
};

const niacinamide = { name: 'Niacinamide', role: 'A form of vitamin B3 used in cosmetic formulations.' };
const glycerin = { name: 'Glycerin', role: 'A humectant used to attract and retain moisture.' };
const panthenol = { name: 'Panthenol', role: 'Also known as pro-vitamin B5, a moisturising and skin-conditioning ingredient.' };
const hyaluronate = { name: 'Sodium hyaluronate', role: 'A form of hyaluronic acid used in skincare for its moisture-binding properties.' };
const allantoin = { name: 'Allantoin', role: 'A cosmetic ingredient used for skin conditioning.' };
const serumTexture: ProductImage = {
  src: '/images/serum-fluid.webp', label: 'Texture study',
  alt: 'Illustrative fluid serum ribbon and small beads on warm frosted glass.', kind: 'texture',
};
const creamTexture: ProductImage = {
  src: '/images/cream-fold.webp', label: 'Texture study',
  alt: 'Illustrative fold of rich cream on a matte blush surface.', kind: 'texture',
};

export const lumiclearCollection = {
  name: 'LUMICLEAR',
  href: '/collections/lumiclear',
  introduction: 'Our inaugural collection brings together two complementary formulations, created to become part of a considered daily skincare ritual.',
};

export const products: Product[] = [
  {
    id: 'target-serum',
    name: 'LUMICLEAR TARGET SERUM',
    shortName: 'Target Serum',
    price: 26,
    tagline: 'Targeted Care. Everyday Radiance.',
    description: 'A lightweight, hydration-focused serum featuring niacinamide, panthenol and sodium hyaluronate.',
    ingredients: ['Niacinamide', 'Panthenol', 'Sodium hyaluronate'],
    use: 'Apply an appropriate amount to freshly cleansed face and neck. Gently distribute, allow to settle, then follow with LUMICLEAR RADIANCE CREAM. Use according to the final product packaging.',
    step: 'Treat',
    packLabelSize: '30 ml',
    approvedInci: null,
    gallery: [
      { src: '/images/lumiclear-serum-pack.webp', label: 'Front pack', alt: 'LUMICLEAR TARGET SERUM in a tall pink glass bottle with a silver cap.', kind: 'pack' },
      { src: '/images/lumiclear-serum-pack.webp', label: 'Studio view', alt: 'Front view of the LUMICLEAR TARGET SERUM bottle in a wider studio frame.', kind: 'studio' },
      serumTexture,
    ],
    formulation: 'The serum brings together niacinamide, panthenol, glycerin and sodium hyaluronate. Its lightweight composition combines moisture-binding and skin-conditioning ingredients in the first step of the LUMICLEAR ritual.',
    texture: 'A lightweight serum designed for a straightforward application between cleansing and moisturising.',
    roles: ['A lightweight first step', 'A hydration-focused formulation', 'Moisture-binding and skin-conditioning ingredients'],
    ingredientHighlights: [
      niacinamide, glycerin, panthenol, hyaluronate, allantoin,
      { name: 'Propanediol', role: 'A multifunctional ingredient used as a humectant and solvent.' },
      { name: 'Butylene glycol', role: 'A cosmetic ingredient used in formulations for moisture retention.' },
    ],
    useSteps: ['Begin with freshly cleansed skin.', 'Apply an appropriate amount of serum to the face and neck.', 'Gently distribute over the skin and allow it to settle.', 'Follow with LUMICLEAR RADIANCE CREAM.'],
    makeupGuidance: 'The product brief places the serum before moisturiser and makeup. Makeup-layering compatibility is awaiting testing.',
  },
  {
    id: 'radiance-cream',
    name: 'LUMICLEAR RADIANCE CREAM',
    shortName: 'Radiance Cream',
    price: 36,
    tagline: 'Nourishment. Hydration. Radiance.',
    description: 'A nourishing moisturising formulation featuring niacinamide, squalane, shea butter, panthenol and sodium hyaluronate.',
    ingredients: ['Niacinamide', 'Squalane', 'Shea butter'],
    use: 'After LUMICLEAR TARGET SERUM, apply an appropriate amount to the face and neck. Gently massage and allow to settle. Use according to the final product packaging.',
    step: 'Nourish',
    packLabelSize: '50 g',
    approvedInci: null,
    gallery: [
      { src: '/images/lumiclear-cream-pack.webp', label: 'Front pack', alt: 'LUMICLEAR RADIANCE CREAM in a square pink glass jar with a silver lid.', kind: 'pack' },
      { src: '/images/lumiclear-cream-pack.webp', label: 'Studio view', alt: 'Front view of the LUMICLEAR RADIANCE CREAM jar in a wider studio frame.', kind: 'studio' },
      creamTexture,
    ],
    formulation: 'Squalane, shea butter, glycerin, niacinamide and sodium hyaluronate are among the moisturising and skin-conditioning ingredients in this formulation. The cream is the second step of the LUMICLEAR ritual, following the Target Serum.',
    texture: 'A nourishing moisturising cream combining emollient and humectant ingredients in the final LUMICLEAR step.',
    roles: ['A nourishing moisturising step', 'An emollient and humectant formulation', 'Designed to follow the Target Serum'],
    ingredientHighlights: [
      niacinamide,
      { name: 'Squalane', role: 'An emollient used for skin conditioning and a supple feel.' },
      { name: 'Shea butter', role: 'A rich emollient used to soften and condition the skin.' },
      glycerin, panthenol, hyaluronate, allantoin,
      { name: 'Tocopherol', role: 'A form of vitamin E used as an antioxidant in cosmetic formulations and for skin conditioning.' },
      { name: 'Aloe barbadensis flower extract', role: 'A botanical ingredient used for skin conditioning.' },
      { name: 'Saccharomyces ferment filtrate', role: 'A ferment-derived ingredient used in cosmetic formulations.' },
      { name: 'Centella asiatica extract', role: 'A botanical ingredient used for skin conditioning.' },
    ],
    useSteps: ['Cleanse the face.', 'Apply LUMICLEAR TARGET SERUM.', 'Follow with an appropriate amount of Radiance Cream over the face and neck.', 'Gently massage and allow the cream to settle.'],
    makeupGuidance: 'The product brief places the cream after serum and before makeup. Makeup-layering compatibility is awaiting testing.',
  },
];

const shortPrice = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 });
const precisePrice = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 2 });

export const price = (amount: number) => shortPrice.format(amount);
export const productPrice = (amount: number) => `${precisePrice.format(amount)} GBP`;
export const productHref = (product: Pick<Product, 'id'>) => `/products/lumiclear-${product.id}`;
