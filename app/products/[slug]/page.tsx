import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductPage } from '@/components/commerce-pages';
import { products, productHref } from '@/lib/products';

type ProductRoute = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map(product => ({ slug: `lumiclear-${product.id}` }));
}

function bySlug(slug: string) {
  return products.find(product => `lumiclear-${product.id}` === slug);
}

export async function generateMetadata({ params }: ProductRoute): Promise<Metadata> {
  const product = bySlug((await params).slug);
  if (!product) return { title: 'Product unavailable' };
  return {
    title: { absolute: `${product.name} | SHENERIO` },
    description: product.description,
    alternates: { canonical: productHref(product) },
  };
}

export default async function Product({ params }: ProductRoute) {
  const product = bySlug((await params).slug);
  if (!product) notFound();
  const pairing = products.find(item => item.id !== product.id);
  if (!pairing) notFound();
  return <ProductPage product={product} pairing={pairing} />;
}
