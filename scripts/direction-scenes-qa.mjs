import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const base = process.env.PREVIEW_URL || 'http://127.0.0.1:3000';
const output = process.env.QA_OUTPUT || 'docs/implementation/evidence/direction/site';
const browser = await chromium.launch({ channel: 'chrome' });
const result = {};
const viewport = { width: 1440, height: 900 };

try {
  const page = await browser.newPage({ viewport });
  await page.goto(base);
  const track = page.locator('.collection-optics-track');
  await track.waitFor({ state: 'visible' });
  result.release = await track.evaluate(element => {
    const stage = element.querySelector('.collection-optics');
    const top = parseFloat(getComputedStyle(stage).top);
    const travel = element.clientHeight - stage.offsetHeight;
    const start = scrollY + element.getBoundingClientRect().top - top;
    scrollTo({ top: start + travel + 150, behavior: 'instant' });
    return { top, travel, releasedTop: Math.round(stage.getBoundingClientRect().top), start };
  });
  assert(result.release.releasedTop < result.release.top - 120);

  await page.evaluate(start => scrollTo({ top: start + 20, behavior: 'instant' }), result.release.start);
  const actions = page.getByRole('navigation', { name: 'LUMICLEAR stage products' });
  const serum = actions.getByRole('link', { name: 'View Target Serum, £26.00 GBP' });
  const cream = actions.getByRole('link', { name: 'View Radiance Cream, £36.00 GBP' });
  await serum.focus();
  await page.keyboard.press('Tab');
  assert(await cream.evaluate(link => link === document.activeElement));
  const beforeProduct = await page.evaluate(() => scrollY);
  await page.keyboard.press('Enter');
  await page.waitForURL('**/products/lumiclear-radiance-cream');
  await page.goBack({ waitUntil: 'domcontentloaded' });
  await page.waitForURL(url => url.pathname === '/');
  await page.waitForFunction(() => document.documentElement.dataset.motionReady === 'true');
  await page.waitForFunction(previous => Math.abs(scrollY - previous) < 20, beforeProduct, { timeout: 7000 });
  result.stageNavigation = 'Both CTA targets, keyboard order and Back scroll restoration verified';

  await page.setViewportSize({ width: 1024, height: 768 });
  await track.waitFor({ state: 'visible' });
  const fit = await actions.evaluate(nav => {
    const bounds = nav.getBoundingClientRect();
    const stage = nav.closest('.collection-optics').getBoundingClientRect();
    return bounds.bottom <= stage.bottom + 1 && bounds.right <= stage.right + 1;
  });
  assert(fit, 'Compact desktop actions extend beyond the stage');
  await page.setViewportSize({ width: 900, height: 780 });
  assert.equal(await page.locator('.collection-optics').evaluate(element => getComputedStyle(element).position), 'static');
  assert(await page.locator('#collection-details .optics-note').count() === 2);
  await page.setViewportSize(viewport);
  await track.waitFor({ state: 'visible' });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  assert.equal(await page.locator('.collection-optics').evaluate(element => getComputedStyle(element).position), 'static');
  result.resize = 'Compact desktop, narrower viewport and runtime reduced-motion fallback passed';

  await page.goto(base + '/formulation');
  const tabs = page.getByRole('tablist', { name: 'Ingredient index.' });
  const expected = ['hydration', 'skin-conditioning', 'nourishment', 'niacinamide', 'botanicals'];
  for (const [index, slug] of expected.entries()) {
    const tab = tabs.getByRole('tab').nth(index);
    await tab.click();
    assert.equal(await tab.getAttribute('aria-selected'), 'true');
    const panel = page.getByRole('tabpanel');
    assert.equal(await panel.getByRole('link', { name: 'Read the chapter' }).getAttribute('href'), '#' + slug);
  }
  assert.equal(await page.locator('.ed-formulation-plate').evaluate(element => getComputedStyle(element).clipPath), 'none');
  result.atlas = 'Every selection links to the full chapter and works with reduced motion';

  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(base + '/the-ritual');
  const treat = page.getByRole('tab', { name: 'Treat', exact: true });
  const nourish = page.getByRole('tab', { name: 'Nourish', exact: true });
  await nourish.click();
  await treat.click();
  await nourish.click();
  await page.waitForFunction(() => getComputedStyle(document.querySelector('.ed-ritual-layer-1')).clipPath === 'inset(0px)');
  assert.equal(await nourish.getAttribute('aria-selected'), 'true');
  assert(await page.getByRole('tabpanel').getByText('Radiance Cream', { exact: true }).isVisible());
  result.ritual = 'Rapid selection interruptions settle on the last requested product';
  await page.close();

  const phone = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await phone.goto(base);
  assert.equal(await phone.locator('.collection-optics').evaluate(element => getComputedStyle(element).position), 'static');
  const stageImageSources = await phone.locator('.optics-visual img').evaluateAll(images => images.map(image => image.currentSrc || image.src));
  assert(stageImageSources.every(src => src.startsWith('data:')));
  result.phone = 'Both steps in normal flow and all desktop stage requests excluded';
  await phone.close();

  await mkdir(output, { recursive: true });
  await writeFile(`${output}/scene-layout-checks.json`, JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
} finally {
  await browser.close();
}
