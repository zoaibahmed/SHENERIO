import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const output = 'docs/design-audit/prototype-evidence';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = { checkedAt: new Date().toISOString(), browser: browser.version(), runs: [], errors: [] };
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:3000';
const check = (condition, label) => { if (!condition) throw new Error(label); };

try {
  for (const scenario of [
    { name: 'desktop', width: 1440, height: 1000, reducedMotion: 'no-preference' },
    { name: 'compact-desktop', width: 1024, height: 768, reducedMotion: 'no-preference' },
    { name: 'tablet', width: 820, height: 1180, reducedMotion: 'no-preference' },
    { name: 'mobile', width: 390, height: 844, reducedMotion: 'no-preference' },
    { name: 'mobile-reduced', width: 390, height: 844, reducedMotion: 'reduce' },
    { name: 'small-phone', width: 320, height: 740, reducedMotion: 'reduce' },
  ]) {
    const context = await browser.newContext({ viewport: { width: scenario.width, height: scenario.height }, reducedMotion: scenario.reducedMotion, ...(scenario.name === 'desktop' || scenario.name === 'mobile' ? { recordVideo: { dir: `${output}/motion`, size: { width: scenario.width, height: scenario.height } } } : {}) });
    const page = await context.newPage();
    await page.addInitScript(() => {
      window.__previewVitals = { lcp: null, cls: 0 };
      new PerformanceObserver(list => { for (const e of list.getEntries()) window.__previewVitals.lcp = Math.round(e.startTime); }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver(list => { for (const e of list.getEntries()) if (!e.hadRecentInput) window.__previewVitals.cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
    });
    page.setDefaultTimeout(15000);
    console.log(`Checking ${scenario.name}`);
    page.on('pageerror', error => results.errors.push(`${scenario.name}: ${error.message}`));
    const response = await page.goto(base, { waitUntil: 'networkidle' });
    check(response.ok(), 'Home response failed');
    check((await response.headerValue('x-robots-tag'))?.includes('noindex'), 'Private-preview header missing');
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1700);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    check(!overflow, `${scenario.name} horizontal overflow`);
    check(await page.locator('h1').count() === 1, 'Expected one main heading');
    check(await page.getByRole('heading', { name: 'LUMICLEAR TARGET SERUM', exact: true }).count() === 1, 'Serum missing');
    check(await page.getByRole('heading', { name: 'LUMICLEAR RADIANCE CREAM', exact: true }).count() === 1, 'Cream missing');
    await page.screenshot({ path: `${output}/${scenario.name}-hero.png` });
    if (scenario.name === 'desktop') {
      await page.evaluate(() => window.scrollTo({ top: 400, behavior: 'instant' }));
      await page.waitForTimeout(900);
      await page.screenshot({ path: `${output}/desktop-campaign-handoff.png` });
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await page.waitForTimeout(900);
    }
    const toggle = page.getByRole('button', { name: 'The collection', exact: true });
    await toggle.click();
    await page.waitForTimeout(450);
    check(await toggle.getAttribute('aria-expanded') === 'true', 'Menu did not open');
    await page.screenshot({ path: `${output}/${scenario.name}-menu.png` });
    await page.keyboard.press('Escape');
    check(await toggle.getAttribute('aria-expanded') === 'false', 'Escape failed to close menu');
    check(await toggle.evaluate(el => el === document.activeElement), 'Menu focus not restored');
    await page.getByRole('link', { name: 'Discover the collection', exact: true }).first().click();
    await page.waitForTimeout(1400);
    await page.screenshot({ path: `${output}/${scenario.name}-collection.png` });
    const stage = page.getByRole('button', { name: 'Explore LUMICLEAR TARGET SERUM', exact: true });
    console.log(`${scenario.name}: opening product`);
    await stage.click();
    const dialog = page.getByRole('dialog');
    await dialog.waitFor({ state: 'visible' });
    await page.waitForTimeout(600);
    check(await page.getByRole('heading', { name: 'Target Serum', exact: true }).isVisible(), 'Wrong preview');
    await page.getByRole('button', { name: 'Show packaging detail' }).click();
    console.log(`${scenario.name}: gallery detail`);
    await dialog.locator('summary').filter({ hasText: 'Ingredient highlights' }).click();
    check(await dialog.getByText('Niacinamide', { exact: true }).isVisible(), 'Ingredient disclosure failed');
    await page.waitForTimeout(850);
    await page.screenshot({ path: `${output}/${scenario.name}-preview.png` });
    // Native dialog must contain sequential keyboard focus.
    for (let i = 0; i < 15; i++) { await page.keyboard.press('Tab'); check(await dialog.evaluate(el => el.contains(document.activeElement)), 'Focus escaped modal'); }
    const dialogAxe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    await page.keyboard.press('Escape');
    check(!await dialog.isVisible(), 'Escape failed to close preview');
    check(await stage.evaluate(el => el === document.activeElement), 'Preview focus not restored');
    await page.getByRole('button', { name: 'Discover Radiance Cream', exact: true }).click();
    check(await page.getByRole('heading', { name: 'Radiance Cream', exact: true }).isVisible(), 'Cream preview failed');
    await page.getByRole('button', { name: 'Close product preview' }).click();
    await page.locator('#house').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.locator('summary').filter({ hasText: 'Our philosophy' }).click();
    await page.screenshot({ path: `${output}/${scenario.name}-house.png` });
    const pageAxe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    await page.evaluate(async () => { window.scrollTo(0,document.body.scrollHeight); });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${output}/${scenario.name}-full.png`, fullPage: true });
    const images = await page.locator('img').evaluateAll(els => els.filter(el => !el.complete || !el.naturalWidth).map(el => el.src));
    check(images.length === 0, 'Broken image');
    const run = { scenario, horizontalOverflow: overflow, imagesLoaded: true, menuAndFocus: true, galleryAndIngredients: true, modalFocusContainmentAndRestore: true, labVitals: await page.evaluate(() => window.__previewVitals), violations: [...pageAxe.violations, ...dialogAxe.violations].map(v => ({ id: v.id, impact: v.impact, description: v.description, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) })), assets: await page.evaluate(() => performance.getEntriesByType('resource').map(r => ({ name: r.name.replace(location.origin,''), bytes: r.transferSize, duration: Math.round(r.duration) }))) };
    results.runs.push(run);
    if (scenario.name === 'desktop') {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await page.waitForTimeout(700);
      const clip = await page.locator('.campaign-frame').evaluate(el => getComputedStyle(el).clipPath);
      check(clip === 'none', 'Runtime reduced-motion did not remove campaign clipping');
      run.runtimeReducedMotion = true;
      await page.screenshot({ path: `${output}/desktop-reduced.png` });
    }
    const video = page.video();
    await context.close();
    if (video) await video.saveAs(`${output}/${scenario.name}-interaction.webm`);
  }
} catch (error) { results.errors.push(error.stack || String(error)); }
await browser.close();
await writeFile(`${output}/browser-qa.json`, JSON.stringify(results, null, 2));
console.log(JSON.stringify({ runs: results.runs.map(x => ({ name: x.scenario.name, violations: x.violations.length })), errors: results.errors }, null, 2));
if (results.errors.length || results.runs.some(x => x.violations.length)) process.exitCode = 1;
