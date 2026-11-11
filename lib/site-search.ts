import { journalEntries } from '@/lib/journal';
import { productPrice, products } from '@/lib/products';

type SearchItem = { title: string; description: string; href: string; keywords: string; kind: 'Page' | 'Collection' | 'Article' };

const editorialPages: SearchItem[] = [
  {
    title: 'LUMICLEAR collection',
    description: 'Two complementary formulations for a considered daily skincare ritual.',
    href: '/collections/lumiclear',
    keywords: 'collection target serum radiance cream skincare',
    kind: 'Collection',
  },
  {
    title: 'Our House',
    description: 'Discover the philosophy behind SHENERIO and the story of our London-founded House.',
    href: '/our-house',
    keywords: 'purposeful formulation korean skincare innovation brand vision',
    kind: 'Page',
  },
  {
    title: 'Formulation',
    description: 'Explore the ingredients behind the LUMICLEAR collection.',
    href: '/formulation',
    keywords: 'ingredient niacinamide panthenol hyaluronic acid sodium hyaluronate squalane shea butter hydration',
    kind: 'Page',
  },
  {
    title: 'The Ritual',
    description: 'Discover the SHENERIO morning and evening skincare routines.',
    href: '/the-ritual',
    keywords: 'cleanser sunscreen serum cream moisturiser moisturizer daily am pm',
    kind: 'Page',
  },
  {
    title: 'The Journal',
    description: 'Explore skincare knowledge, ingredient education and contemporary beauty perspectives.',
    href: '/journal',
    keywords: 'editorial articles publication',
    kind: 'Page',
  },
];

function normalise(text: string) {
  return text.toLowerCase().normalize('NFKD').replace(/\p{M}/gu, '');
}

const publishedArticles: SearchItem[] = journalEntries
  .filter(entry => entry.status === 'published')
  .map(entry => ({
    title: entry.title,
    description: entry.description,
    href: `/journal/${entry.slug}`,
    keywords: 'journal article',
    kind: 'Article',
  }));

export function searchSite(query: string) {
  const words = normalise(query).match(/[\p{L}\p{N}]+/gu) ?? [];
  const matches = (content: string) => words.length > 0 && words.every(word => normalise(content).includes(word));

  return {
    products: products.filter(product => matches([
      product.name,
      product.description,
      ...product.ingredientHighlights.map(ingredient => ingredient.name),
      product.tagline,
      productPrice(product.price),
      product.id === 'radiance-cream' ? 'moisturiser moisturizer' : '',
    ].join(' '))),
    editorial: [...editorialPages, ...publishedArticles].filter(page => matches(`${page.title} ${page.description} ${page.keywords}`)),
  };
}
