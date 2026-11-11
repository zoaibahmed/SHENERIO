import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const base = process.env.PREVIEW_URL || 'http://127.0.0.1:3000';
const output = process.env.QA_OUTPUT || 'docs/implementation/evidence/photography-refinement';
const routes = ['/', '/collections', '/collections/lumiclear', '/products/lumiclear-target-serum',
  '/products/lumiclear-radiance-cream', '/the-ritual', '/formulation', '/our-house', '/journal/niacinamide', '/search?q=LUMICLEAR'];
const browser = await chromium.launch({ channel: 'chrome' });
const results = [];
await mkdir(output, { recursive: true });

try {
  for (const [name, width, height] of [['desktop', 1440, 900], ['tablet', 820, 1000], ['phone', 390, 844]]) {
    const page = await browser.newPage({ viewport: { width, height }, isMobile: name === 'phone', hasTouch: name === 'phone' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const route of routes) {
      const response = await page.goto(base + route);
      assert.equal(response.status(), 200);
      const pictures = await page.locator('img, source').evaluateAll(elements => elements.map(element => ({
        url: [element.getAttribute('src'), element.getAttribute('srcset')].filter(Boolean).join(' '),
        pack: element.dataset.pack,
        mask: element.tagName === 'IMG' ? getComputedStyle(element).maskImage : null,
        fit: element.tagName === 'IMG' ? getComputedStyle(element).objectFit : null,
      })));
      const outdated = pictures.filter(({ url }) => /(?:serum|cream)(?:-isolated)?\.webp/.test(url));
      assert.deepEqual(outdated, [], `${name} ${route} uses an older pack`);
      const supplied = pictures.filter(({ mask, pack, url }) => mask !== null && (pack || /lumiclear-(?:serum|cream)-pack\.webp/.test(url)));
      for (const image of supplied) {
        assert.match(image.mask, /lumiclear-(?:serum|cream)-mask\.svg/, `${name} ${route}`);
        assert.equal(image.fit, 'contain', `${name} ${route} would crop the product`);
      }
      if (name === 'desktop' && route === '/collections') {
        await page.locator('.commerce-card-link').first().hover();
        await page.waitForFunction(() => getComputedStyle(document.querySelector('.commerce-card-studio')).opacity === '1');
      }
      results.push({ name, route, suppliedPackImages: supplied.length });
    }

    await page.goto(base);
    if (name === 'desktop') {
      const track = page.locator('.collection-optics-track[data-active]');
      await track.waitFor();
      const { start, travel } = await track.evaluate(element => {
        const stage = element.querySelector('.collection-optics');
        return {
          start: scrollY + element.getBoundingClientRect().top - parseFloat(getComputedStyle(stage).top),
          travel: element.clientHeight - stage.offsetHeight,
        };
      });
      for (const [fraction, phase] of [[.15, 'treat'], [.94, 'nourish'], [.15, 'treat']]) {
        await page.evaluate(top => scrollTo({ top, behavior: 'instant' }), start + travel * fraction);
        await page.waitForFunction(expected => document.querySelector('.collection-optics-track').dataset.phase === expected, phase);
        const product = track.locator(`.optics-object img[data-pack="${phase === 'treat' ? 'target-serum' : 'radiance-cream'}"]`);
        await product.evaluate(image => image.decode());
        assert.match(await product.evaluate(image => image.currentSrc), /lumiclear-(?:serum|cream)-pack/);
        await page.screenshot({ path: `${output}/desktop-stage-${phase}.jpg`, quality: 87 });
      }
    }
    const button = page.getByRole('button', { name: 'Discover Target Serum', exact: true });
    await button.click();
    const dialog = page.getByRole('dialog');
    await dialog.waitFor();
    assert((await dialog.evaluate(panel => parseFloat(getComputedStyle(panel).borderTopLeftRadius))) >= 20);
    await dialog.getByRole('button', { name: 'Show packaging detail' }).click();
    await page.waitForTimeout(640);
    assert.equal(await dialog.getByRole('button', { name: 'Show packaging detail' }).getAttribute('aria-pressed'), 'true');
    const pack = dialog.locator('.preview-alternate img');
    await pack.evaluate(image => image.decode());
    assert.match(await pack.getAttribute('src'), /lumiclear-serum-pack/);
    await page.screenshot({ path: `${output}/${name}-quick-view.jpg`, quality: 87 });
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'hidden' });
    assert.deepEqual(errors, []);
    await page.close();
  }
  await writeFile(`${output}/product-image-checks.json`, JSON.stringify(results, null, 2));
  console.log(`Verified current pack sources and responsive masks across ${results.length} route and viewport combinations.`);
} finally {
  await browser.close();
}
