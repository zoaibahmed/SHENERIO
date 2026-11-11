import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import AxeBuilder from '@axe-core/playwright';
import { chromium } from '@playwright/test';

const base = process.env.PREVIEW_URL || 'http://127.0.0.1:3000';
const evidence = process.env.QA_OUTPUT || 'docs/implementation/evidence/phase2';
const serum = '/products/lumiclear-target-serum';
const cream = '/products/lumiclear-radiance-cream';
const routes = [
  '/', '/collections', '/collections/lumiclear', serum, cream,
  '/our-house', '/formulation', '/the-ritual', '/journal', '/journal/niacinamide',
  '/contact', '/faq', '/shipping-delivery', '/returns-refunds', '/order-tracking',
  '/search', '/bag', '/account', '/privacy-policy', '/cookie-policy', '/terms-conditions', '/returns-policy',
];
const screenshotRoutes = new Set(routes.slice(0, 11).concat('/search'));
const accessTags = ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'];
const result = { viewportChecks: [], interactions: [], errors: [], accessibility: [], brokenLinks: [] };
const allLinks = new Set();
const ids = new Map();

await mkdir(evidence, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome' });

function collectErrors(page, label) {
  page.on('pageerror', error => result.errors.push(`${label}: ${error.message}`));
  page.on('console', message => {
    if (message.type() === 'error' && !message.text().includes('status of 404')) {
      result.errors.push(`${label}: ${message.text()}`);
    }
  });
  page.on('response', response => {
    if (response.status() >= 400 && response.request().resourceType() !== 'document') {
      result.errors.push(`${label}: ${response.status()} ${response.url()}`);
    }
  });
}

async function inspectRoutes(name, width, height) {
  const phone = width < 768;
  const context = await browser.newContext({ viewport: { width, height }, isMobile: phone, hasTouch: phone });
  const page = await context.newPage();
  collectErrors(page, name);
  console.log(`Inspecting ${routes.length} routes at ${width}px`);

  for (const route of routes) {
    const response = await page.goto(`${base}${route}`, { waitUntil: 'domcontentloaded' });
    assert.equal(response.status(), 200, route);
    assert.match(response.headers()['x-robots-tag'], /noindex/);
    const scrollEngine = phone ? 'native' : 'smooth';
    await page.waitForFunction(mode => document.documentElement.dataset.scrollEngine === mode, scrollEngine);
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.getByRole('main').count(), 1, `${route} main landmarks`);
    const heading = page.getByRole('heading', { level: 1 });
    assert.equal(await heading.count(), 1, `${route} primary heading`);
    assert(await heading.isVisible(), `${route} invisible heading`);
    const dimensions = await page.evaluate(() => {
      const header = document.querySelector('.site-header');
      const title = document.querySelector('h1');
      const main = document.querySelector('main');
      const range = document.createRange();
      range.selectNodeContents(title);
      const maxRight = Math.max(...Array.from(range.getClientRects(), rectangle => rectangle.right));
      const missingImages = [...main.querySelectorAll('img')]
        .filter(image => image.complete && image.currentSrc && !image.naturalWidth)
        .map(image => image.currentSrc);
      return { viewport: innerWidth, width: document.documentElement.scrollWidth, maxRight, headerBottom: header.getBoundingClientRect().bottom, titleTop: title.getBoundingClientRect().top, missingImages };
    });
    assert(dimensions.width <= dimensions.viewport + 1, `${route} horizontal overflow at ${width}px`);
    assert(dimensions.maxRight <= dimensions.viewport + 1, `${route} clipped heading at ${width}px`);
    assert(dimensions.titleTop >= dimensions.headerBottom - 1, `${route} heading under fixed header at ${width}px`);
    assert.deepEqual(dimensions.missingImages, []);

    if (name === 'desktop') {
      const inventory = await page.evaluate(() => ({
        ids: Array.from(document.querySelectorAll('[id]'), element => element.id),
        links: Array.from(document.querySelectorAll('a[href]'), element => element.href),
      }));
      ids.set(route, new Set(inventory.ids));
      inventory.links.forEach(link => allLinks.add(link));
      const axe = await new AxeBuilder({ page }).withTags(accessTags).analyze();
      axe.violations.forEach(violation => result.accessibility.push({ route, id: violation.id, nodes: violation.nodes.map(node => node.target) }));
    }

    if ((name === 'desktop' || name === 'phone') && screenshotRoutes.has(route)) {
      if (route === '/') {
        await page.waitForFunction(() => document.documentElement.dataset.motionReady === 'true');
        await page.waitForTimeout(1550);
      } else {
        await page.waitForTimeout(350);
      }
      const label = route === '/' ? 'home' : route.slice(1).replaceAll('/', '-');
      await page.screenshot({ path: `${evidence}/${name}-${label}.png` });
    }

    result.viewportChecks.push({ route, width, height, scrollEngine, title: await heading.innerText() });
  }

  await context.close();
}

async function inspectInteractions() {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  page.setDefaultTimeout(14000);
  collectErrors(page, 'interactions');
  await page.goto(base);
  await page.getByRole('button', { name: 'Menu', exact: true }).tap();
  await page.getByRole('button', { name: 'Formulation', exact: true }).tap();
  await page.screenshot({ path: `${evidence}/phone-expanded-navigation.png`, animations: 'disabled' });
  await page.getByRole('link', { name: 'Explore Formulation', exact: true }).tap();
  await page.waitForURL(`${base}/formulation`);
  await page.goBack();
  await page.waitForURL(`${base}/`);
  result.interactions.push('Mobile navigation disclosure, route link and browser Back');

  await page.goto(base);
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  const quickView = page.getByRole('button', { name: 'Preview LUMICLEAR TARGET SERUM', exact: true });
  await quickView.click();
  const dialog = page.getByRole('dialog');
  await dialog.waitFor();
  await dialog.getByRole('button', { name: 'Show packaging detail' }).tap();
  assert.equal(await dialog.getByRole('button', { name: 'Show packaging detail' }).getAttribute('aria-pressed'), 'true');
  const modalAxe = await new AxeBuilder({ page }).withTags(accessTags).analyze();
  modalAxe.violations.forEach(violation => result.accessibility.push({ route: '/ (quick view)', id: violation.id, nodes: violation.nodes.map(node => node.target) }));
  await page.keyboard.press('Escape');
  assert(await quickView.evaluate(element => element === document.activeElement));
  await quickView.click();
  await dialog.getByRole('link', { name: 'View full product' }).tap();
  await page.waitForURL(`${base}${serum}`);
  result.interactions.push('Homepage quick view, gallery, Escape, focus return and PDP link');

  for (const [route, amount] of [[serum, '£26.00'], [cream, '£36.00']]) {
    await page.goto(`${base}${route}`);
    assert((await page.getByRole('main').innerText()).includes(amount), `Price missing on ${route}`);
    const studio = page.getByRole('button', { name: 'Show studio view' });
    await studio.tap();
    assert.equal(await studio.getAttribute('aria-pressed'), 'true');
    await page.getByRole('button', { name: 'Next gallery image' }).tap();
    assert.equal(await studio.getAttribute('aria-pressed'), 'false');
    await page.getByRole('button', { name: 'Increase quantity' }).tap();
    assert.match(await page.getByLabel('Selected quantity').innerText(), /2/);
    assert(await page.getByRole('button', { name: 'Add to Bag', exact: true }).isDisabled());
    await page.locator('summary').filter({ hasText: 'Full ingredient list' }).click();
    assert(await page.locator('details[open]').filter({ hasText: 'Full ingredient list' }).isVisible());
  }
  result.interactions.push('Both PDP prices, galleries, quantities, accordions and unavailable purchase controls');

  await page.goto(`${base}/the-ritual`);
  const treat = page.getByRole('tab', { name: 'Treat', exact: true });
  await treat.focus();
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.getByRole('tab', { name: 'Nourish', exact: true }).getAttribute('aria-selected'), 'true');
  assert.match(await page.locator('#morning-ritual').innerText(), /sunscreen/i);
  assert.match(await page.locator('#evening-ritual').innerText(), /radiance cream/i);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  result.interactions.push('Ritual keyboard tabs and complete morning and evening guidance');

  await page.goto(`${base}/contact`);
  const requests = [];
  page.on('request', request => { if (request.method() !== 'GET') requests.push(request.url()); });
  await page.getByLabel('Full Name').fill('Preview Tester');
  await page.getByLabel('Email Address').fill('preview@example.test');
  await page.getByLabel('Enquiry Subject').fill('Product enquiry');
  await page.getByLabel('Your Message').fill('This is a local frontend test.');
  await page.getByRole('button', { name: 'Send Enquiry' }).tap();
  assert.match(await page.getByRole('status').innerText(), /not been sent or saved/);
  assert.deepEqual(requests, []);
  await page.goto(`${base}/faq`);
  assert.equal(await page.locator('.care-faq details').count(), 17);
  await page.getByText('What is SHENERIO?', { exact: true }).tap();
  assert.equal(await page.locator('.care-faq details[open]').count(), 1);
  result.interactions.push('Exact contact fields, local-only validation and all 17 FAQ entries');

  await page.goto(`${base}/search`);
  await page.getByRole('searchbox', { name: 'Search SHENERIO' }).fill('niacinamide');
  await page.getByRole('button', { name: 'Search', exact: true }).tap();
  await page.waitForURL('**/search?q=niacinamide');
  assert.equal(await page.locator('.care-product-result').count(), 2);
  assert.equal(await page.locator('.care-search-results a[href="/journal/niacinamide"]').count(), 0);
  await page.screenshot({ path: `${evidence}/phone-search-results.png` });
  await page.goto(`${base}/search?q=zzzz-no-result`);
  assert(await page.getByRole('heading', { name: 'Try a different search.' }).isVisible());
  result.interactions.push('Search by ingredient and no-result state, preview manuscript excluded');

  for (const route of ['/does-not-exist', '/products/lumiclear-missing', '/journal/missing']) {
    const response = await page.goto(`${base}${route}`);
    assert.equal(response.status(), 404, route);
    assert(await page.getByRole('heading', { level: 1 }).isVisible());
  }
  result.interactions.push('General, unavailable-product and article 404s');
  await context.close();
}

try {
  await inspectRoutes('desktop', 1440, 900);
  await inspectRoutes('compact', 1024, 768);
  await inspectRoutes('tablet', 768, 1024);
  await inspectRoutes('phone', 390, 844);
  await inspectRoutes('narrow', 320, 740);
  for (const href of allLinks) {
    const link = new URL(href);
    if (link.origin !== base) continue;
    if (!ids.has(link.pathname) || (link.hash && !ids.get(link.pathname).has(decodeURIComponent(link.hash.slice(1))))) {
      result.brokenLinks.push(href);
    }
  }
  await inspectInteractions();
} catch (error) {
  result.errors.push(error.stack);
} finally {
  await browser.close();
  await writeFile(`${evidence}/browser-qa.json`, JSON.stringify(result, null, 2));
}

console.log(JSON.stringify({ ...result, viewportChecks: result.viewportChecks.length }, null, 2));
if (result.errors.length || result.accessibility.length || result.brokenLinks.length) process.exitCode = 1;
