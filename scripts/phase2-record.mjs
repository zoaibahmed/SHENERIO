import { mkdir } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const base = process.env.PREVIEW_URL || 'http://127.0.0.1:3000';
const out = 'docs/implementation/evidence/phase2';
const browser = await chromium.launch({ channel: 'chrome' });
await mkdir(out, { recursive: true });

async function record(name, viewport, journey) {
  const phone = name === 'phone';
  const context = await browser.newContext({ viewport, isMobile: phone, hasTouch: phone, recordVideo: { dir: 'tmp/phase2-video', size: viewport } });
  try {
    const page = await context.newPage();
    const pause = (ms = 780) => page.waitForTimeout(ms);
    const show = async (selector) => {
      await page.locator(selector).evaluate(element => element.scrollIntoView({ behavior: 'smooth', block: 'center' }));
      await pause(870);
    };
    const go = async path => {
      await page.goto(`${base}${path}`, { waitUntil: 'domcontentloaded' });
      await page.getByRole('heading', { level: 1 }).waitFor();
      await pause();
    };
    await journey({ page, pause, show, go });
    const video = page.video();
    await context.close();
    await video.saveAs(`tmp/phase2-video/${name}.webm`);
  } finally {
    await context.close();
  }
}

try {
  await record('desktop', { width: 1440, height: 900 }, async ({ page, pause, show, go }) => {
    await go('/');
    await page.waitForFunction(() => document.documentElement.dataset.motionReady === 'true');
    await pause(1000);
    await page.getByRole('button', { name: 'The collection', exact: true }).click();
    await pause();
    await page.getByRole('link', { name: 'Browse collections' }).click();
    await page.waitForURL('**/collections');
    await pause();
    await show('#lumiclear-products');
    await page.locator('main a[href="/products/lumiclear-target-serum"]').first().click();
    await page.waitForURL('**/products/lumiclear-target-serum');
    await pause(1150);
    await page.getByRole('button', { name: 'Show studio view' }).click();
    await pause();
    await page.getByRole('button', { name: 'Next gallery image' }).click();
    await pause();
    await page.getByRole('button', { name: 'Increase quantity' }).click();
    await pause();
    await show('#product-details');
    await page.locator('summary').filter({ hasText: 'How to use' }).click();
    await pause();
    await show('#product-pairing');
    await page.locator('#product-pairing a[href="/products/lumiclear-radiance-cream"]').click();
    await page.waitForURL('**/products/lumiclear-radiance-cream');
    await pause();
    await page.getByRole('button', { name: 'Show studio view' }).click();
    await pause();
    await go('/our-house');
    await go('/formulation');
    await show('#ingredient-study');
    await go('/the-ritual');
    await page.getByRole('tab', { name: 'Nourish', exact: true }).click();
    await pause();
    await show('#morning-ritual');
    await go('/journal');
    await page.getByRole('link', { name: 'Read the introduction' }).click();
    await page.waitForURL('**/journal/niacinamide');
    await pause(1100);
  });

  await record('phone', { width: 390, height: 844 }, async ({ page, pause, show, go }) => {
    await go('/');
    await page.getByRole('button', { name: 'Menu', exact: true }).tap();
    await pause();
    await page.getByRole('button', { name: 'Formulation', exact: true }).tap();
    await pause();
    await page.getByRole('link', { name: 'Explore Formulation' }).tap();
    await page.waitForURL('**/formulation');
    await pause();
    await go('/products/lumiclear-radiance-cream');
    await page.getByRole('button', { name: 'Show studio view' }).tap();
    await pause();
    await page.getByRole('button', { name: 'Increase quantity' }).tap();
    await pause();
    await go('/the-ritual');
    await page.getByRole('tab', { name: 'Nourish', exact: true }).tap();
    await pause();
    await show('#morning-ritual');
    await go('/search');
    await page.getByRole('searchbox', { name: 'Search SHENERIO' }).fill('lumiclear');
    await page.getByRole('button', { name: 'Search', exact: true }).tap();
    await page.waitForURL('**/search?q=lumiclear');
    await pause(1200);
  });
} finally {
  await browser.close();
}
