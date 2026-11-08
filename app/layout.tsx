import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const display = localFont({ src: '../node_modules/@fontsource/bodoni-moda/files/bodoni-moda-latin-400-normal.woff2', variable: '--font-display', display: 'swap' });
const body = localFont({ src: [
  { path: '../node_modules/@fontsource/manrope/files/manrope-latin-400-normal.woff2', weight: '400' },
  { path: '../node_modules/@fontsource/manrope/files/manrope-latin-500-normal.woff2', weight: '500' },
], variable: '--font-body', display: 'swap' });

export const metadata: Metadata = {
  title: 'SHENERIO | The Art of Elevated Skincare — Private Preview',
  description: 'A private creative study for SHENERIO. Discover the LUMICLEAR collection.',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-GB" className={`${display.variable} ${body.variable}`}><body>{children}</body></html>;
}
