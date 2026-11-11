export type JournalEntry = {
  slug: string;
  title: string;
  description: string;
  status: 'published' | 'preview';
  category: string;
  image: { src: string; alt: string; caption: string };
  sections: { heading?: string; paragraphs: string[] }[];
  ingredientPath?: string;
  relatedProductIds?: string[];
};

// TIL 2.pdf, pp. 1–2 supplies an introduction, with no approved full manuscripts.
export const journalEntries: JournalEntry[] = [
  {
    slug: 'niacinamide',
    title: 'Niacinamide: an essential ingredient in modern skincare.',
    description: 'A closer look at vitamin B3 and its place in both LUMICLEAR formulations.',
    status: 'preview',
    category: 'Ingredients',
    image: {
      src: '/images/ritual-application-serum.webp',
      alt: 'Close-up of a woman applying a transparent serum to her cheek, with natural skin texture visible.',
      caption: 'Illustrative serum application. Stock photography; not the SHENERIO formulation.',
    },
    sections: [{
      paragraphs: [
        'Niacinamide, also known as vitamin B3, is one of the most widely recognised ingredients in contemporary skincare.',
        'Its versatility makes it a popular inclusion in cosmetic formulations designed to improve the appearance of uneven skin tone and support the skin’s moisture barrier.',
        'At SHENERIO, niacinamide features in both LUMICLEAR formulations, making it an important part of the collection’s ingredient story.',
      ],
    }],
    ingredientPath: '/formulation#niacinamide',
    relatedProductIds: ['target-serum', 'radiance-cream'],
  },
];
