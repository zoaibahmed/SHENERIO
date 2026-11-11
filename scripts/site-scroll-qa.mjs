import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const base = process.env.PREVIEW_URL || 'http://127.0.0.1:3000';
const output = process.env.QA_OUTPUT || 'docs/implementation/evidence/site-scroll/site';
const browser = await chromium.launch({ channel: 'chrome' });
const report = {};

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const engine = mode => page.waitForFunction(value => document.documentElement.dataset.scrollEngine === value, mode);
  const position = () => page.evaluate(() => scrollY);
  const at = y => page.waitForFunction(value => Math.abs(scrollY - value) < 10, y);
  const scrollTo = y => page.evaluate(top => window.scrollTo({ top, behavior: 'instant' }), y);

  await page.addInitScript(() => {
    window.layoutShift = 0;
    new PerformanceObserver(entries => {
      for (const entry of entries.getEntries()) if (!entry.hadRecentInput) window.layoutShift += entry.value;
    }).observe({ type: 'layout-shift', buffered: true });
  });

  await page.goto(base);
  await engine('smooth');
  await page.waitForFunction(() => document.documentElement.dataset.motionReady === 'true');
  await scrollTo(620);
  await at(620);
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Our House' }).click();
  await page.waitForURL('**/our-house');
  await engine('smooth');
  await at(0);
  await scrollTo(440);
  await at(440);
  await page.goBack();
  await engine('smooth');
  await at(620);
  await page.goForward();
  await engine('smooth');
  await at(440);
  assert(!await page.locator('.collection-optics-track').count());
  report.history = 'New navigation starts at top. Back and Forward restore both route positions.';

  await page.locator('a[href="#house-philosophy"]').click();
  await page.waitForURL('**/our-house#house-philosophy');
  await page.waitForFunction(() => {
    const header = document.querySelector('.site-header').getBoundingClientRect();
    const target = document.getElementById('house-philosophy').getBoundingClientRect();
    return target.top >= header.bottom && target.top <= header.bottom + 25;
  });
  report.fragment = 'Native fragment navigation clears the fixed header.';

  await scrollTo(0);
  await page.mouse.move(610, 550);
  await page.mouse.wheel(0, 900);
  await page.waitForFunction(() => scrollY > 15);
  await page.keyboard.press('Home');
  await at(0);
  await page.waitForTimeout(400);
  assert((await position()) < 10, 'In-flight wheel target overtook the Home key');
  await page.keyboard.press('PageDown');
  await page.waitForFunction(() => scrollY > 500);
  report.keyboard = 'Home interrupts wheel easing. Page Down scrolls natively.';

  await page.setViewportSize({ width: 1140, height: 350 });
  await page.locator('.menu-toggle').click();
  const menu = page.locator('.collection-menu');
  await menu.waitFor();
  await page.waitForTimeout(520);
  const menuY = await position();
  await page.mouse.move(260, 220);
  await page.mouse.wheel(0, 680);
  await page.waitForFunction(() => document.querySelector('.collection-menu').scrollTop > 0);
  assert.equal(await position(), menuY);
  await menu.getByRole('button', { name: 'Preview LUMICLEAR TARGET SERUM' }).click();
  const dialog = page.getByRole('dialog');
  await dialog.waitFor();
  await page.waitForTimeout(500);
  const previewY = await position();
  assert.equal(await page.locator('html').evaluate(element => getComputedStyle(element).overflowY), 'hidden');
  await page.mouse.move(350, 215);
  await page.mouse.wheel(0, 420);
  await page.waitForFunction(() => document.querySelector('.product-dialog').scrollTop > 0);
  assert.equal(await position(), previewY);
  await page.keyboard.press('Escape');
  await dialog.waitFor({ state: 'hidden' });
  assert.notEqual(await page.locator('html').evaluate(element => getComputedStyle(element).overflowY), 'hidden');
  assert.equal(await page.locator('body').evaluate(element => element.style.overflow), '');
  await page.keyboard.press('Escape');
  await menu.waitFor({ state: 'hidden' });
  await page.mouse.move(620, 220);
  await page.mouse.wheel(0, 180);
  await page.waitForFunction(y => scrollY > y, previewY);
  report.overlays = 'Menu and dialog consume nested wheel input. Escape releases modal lock and page wheel works.';

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(base + '/formulation');
  await engine('smooth');
  await page.waitForFunction(() => document.querySelector('.ed-formulation-plate').style.clipPath);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await engine('native');
  await page.waitForFunction(() => !document.querySelector('.ed-formulation-plate').style.clipPath);
  assert(!await page.locator('html.lenis').count());
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await engine('smooth');
  await page.waitForFunction(() => document.querySelector('.ed-formulation-plate').style.clipPath);
  report.motionPreference = 'Runtime reduced motion removes Lenis and reverts scoped atlas styles; re-enabling restores both.';

  const layoutShift = {};
  for (const route of ['/', '/our-house', '/formulation', '/the-ritual', '/journal', '/collections/lumiclear', '/products/lumiclear-target-serum', '/products/lumiclear-radiance-cream']) {
    await page.goto(base + route, { waitUntil: 'networkidle' });
    await engine('smooth');
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(900);
    layoutShift[route] = await page.evaluate(() => +window.layoutShift.toFixed(4));
  }
  report.layoutShift = layoutShift;

  async function navigate(link, path) {
    await link.click();
    await page.waitForURL(url => url.pathname === path && !url.hash);
    await engine('smooth');
    await at(0);
  }
  await navigate(page.locator('.site-header .brand'), '/');
  for (const route of ['/our-house', '/formulation', '/the-ritual', '/journal']) {
    await scrollTo(340);
    await navigate(page.locator(`.primary-nav a[href="${route}"]`), route);
  }
  await page.locator('.menu-toggle').click();
  await navigate(page.getByRole('link', { name: 'Browse collections', exact: true }), '/collections');
  await navigate(page.getByRole('link', { name: 'Explore LUMICLEAR', exact: true }), '/collections/lumiclear');
  const serum = '/products/lumiclear-target-serum';
  const cream = '/products/lumiclear-radiance-cream';
  await navigate(page.locator(`.commerce-card-link[href="${serum}"]`), serum);
  await navigate(page.locator(`#product-pairing a[href="${cream}"]`), cream);
  report.journey = 'Campaign, all four editorial routes, both collection routes and both products navigated by their real controls.';

  await mkdir(output, { recursive: true });
  await writeFile(`${output}/scroll-interactions.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
