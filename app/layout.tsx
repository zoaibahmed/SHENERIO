import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Header, ProductPreview } from '@/components/experience';
import { SiteFooter } from '@/components/site-footer';
import { RouteMotion } from '@/components/route-motion';
import { ScrollEngine } from '@/components/scroll-engine';
import { homeIntroBootstrap } from '@/lib/home-intro';
import 'lenis/dist/lenis.css';
import './globals.css';
import './flagship.css';
import './flagship-navigation.css';
import './site-shell.css';
import './ivory.css';
import './photography.css';
import './home-intro.css';
import './editorial-refinement.css';

const display = localFont({ src: '../node_modules/@fontsource/bodoni-moda/files/bodoni-moda-latin-400-normal.woff2', variable: '--font-display', display: 'swap' });
const body = localFont({ src: [
  { path: '../node_modules/@fontsource/manrope/files/manrope-latin-400-normal.woff2', weight: '400' },
  { path: '../node_modules/@fontsource/manrope/files/manrope-latin-500-normal.woff2', weight: '500' },
], variable: '--font-body', display: 'swap' });

export const metadata: Metadata = {
  title: 'SHENERIO | The Art of Elevated Skincare — Private Preview',
  description: 'A private creative study for SHENERIO. Discover the LUMICLEAR collection.',
  robots: { index: false, follow: false },
  metadataBase: new URL(process.env.SHENERIO_SITE_URL || 'http://127.0.0.1:3000'),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-GB" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
    <head><script id="shenerio-entry" dangerouslySetInnerHTML={{ __html: homeIntroBootstrap }} /></head>
    <body className="ivory-site">
      <a href="#main" className="skip-link">Skip to content</a>
      <Header />
      <main id="main" tabIndex={-1}>{children}</main>
      <SiteFooter />
      <ProductPreview />
      <ScrollEngine />
      <RouteMotion />
    </body>
  </html>;
}
