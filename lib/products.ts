// Editorial source: TIL.pdf pp. 9–15. No stock, live variants or approved claims implied.
export type Product = {
  id: string; name: string; shortName: string; price: number; image: string;
  tagline: string; description: string; ingredients: string[]; use: string;
};
export const products: Product[] = [
  {
    id: 'target-serum', name: 'LUMICLEAR TARGET SERUM', shortName: 'Target Serum', price: 26,
    image: '/images/serum.webp', tagline: 'Targeted Care. Everyday Radiance.',
    description: 'A lightweight, hydration-focused serum featuring niacinamide, panthenol and sodium hyaluronate.',
    ingredients: ['Niacinamide', 'Panthenol', 'Sodium hyaluronate'],
    use: 'Apply an appropriate amount to freshly cleansed face and neck. Gently distribute, allow to settle, then follow with LUMICLEAR RADIANCE CREAM. Use according to the final product packaging.',
  },
  {
    id: 'radiance-cream', name: 'LUMICLEAR RADIANCE CREAM', shortName: 'Radiance Cream', price: 36,
    image: '/images/cream.webp', tagline: 'Nourishment. Hydration. Radiance.',
    description: 'A nourishing moisturising formulation featuring niacinamide, squalane, shea butter, panthenol and sodium hyaluronate.',
    ingredients: ['Niacinamide', 'Squalane', 'Shea butter'],
    use: 'After LUMICLEAR TARGET SERUM, apply an appropriate amount to the face and neck. Gently massage and allow to settle. Use according to the final product packaging.',
  },
];
export const price = (amount: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(amount);
