import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile, writeFile } from 'node:fs/promises';

// This validation deliberately creates no screenshots, recordings or design reports.
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:3000';
const fixture = 'tmp/targeted-content-baseline.json';
const browser = await chromium.launch({ channel: 'chrome' });
const normalise = text => text.replace(/\s+/g, ' ').trim();
const result = { layouts: [], openings: [], errors: [] };
const completeIntro = page => page.waitForFunction(() => !['pending', 'active'].includes(document.documentElement.dataset.homeIntro));
const observe = (page, label) => {
  page.on('pageerror', error => result.errors.push(`${label}: ${error.message}`));
  page.on('console', message => { if (message.type() === 'error') result.errors.push(`${label}: ${message.text()}`); });
  page.on('response', response => { if (response.status() >= 400) result.errors.push(`${label}: ${response.status()} ${response.url()}`); });
};
const waitImages = locator => locator.evaluate(async element => {
  const images = [...element.querySelectorAll('img')];
  images.forEach(image => { image.loading = 'eager'; });
  await Promise.all(images.map(image => image.decode().catch(() => {})));
  return images.every(image => image.complete && image.naturalWidth > 0);
});

async function corners(page, edge) {
  const study = page.locator('.ed-ritual-study');
  await study.evaluate((element, side) => element.scrollIntoView({ block: side === 'top' ? 'start' : 'end', behavior: 'instant' }), edge);
  return study.evaluate((element, side) => {
    const style = getComputedStyle(element);
    const bounds = element.getBoundingClientRect();
    const y = side === 'top' ? bounds.top + 1 : bounds.bottom - 1;
    const outside = [bounds.left + 1, bounds.right - 1].every(x => {
      const hit = document.elementFromPoint(x, y);
      return !hit || !element.contains(hit);
    });
    const x = bounds.left + parseFloat(style.borderTopLeftRadius) + 3;
    const inside = element.contains(document.elementFromPoint(x, y + (side === 'top' ? 2 : -2)));
    const radius = ['borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomLeftRadius', 'borderBottomRightRadius'].map(key => parseFloat(style[key]));
    return { outside, inside, radius, clip: style.clipPath, overflow: style.overflow };
  }, edge);
}
function checkCorners(value) {
  assert(value.outside && value.inside, 'Rendered corner hit-testing does not follow the outer rounded mask');
  assert(value.radius.every(radius => radius >= 20 && radius <= 24));
  assert(new Set(value.radius).size === 1, 'Outer corner radii differ');
  assert(value.clip.includes('round') && value.overflow === 'hidden');
}

try {
  if (process.argv.includes('--baseline')) {
    const page = await browser.newPage({ reducedMotion: 'reduce' });
    const copy = {};
    for (const path of ['/the-ritual', '/our-house']) {
      await page.goto(base + path, { waitUntil: 'networkidle' });
      copy[path] = normalise(await page.locator('#main').innerText());
    }
    await writeFile(fixture, JSON.stringify(copy));
    console.log('Stored existing brand copy for preservation checks. No media captured.');
    await page.close();
  } else {
    const copy = JSON.parse(await readFile(fixture, 'utf8'));
    for (const [width, height] of [[1440, 900], [1024, 768], [768, 1024], [390, 844], [320, 740]]) {
      const context = await browser.newContext({ viewport: { width, height }, isMobile: width < 768, hasTouch: width < 768 });
      const page = await context.newPage(); observe(page, String(width));
      await page.goto(base + '/the-ritual', { waitUntil: 'networkidle' });
      assert.equal(normalise(await page.locator('#main').innerText()), copy['/the-ritual'], 'Ritual brand copy changed');
      assert(await waitImages(page.locator('.ed-ritual')));
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(750);
      const hero = await page.locator('.ed-ritual-hero').evaluate(element => {
        const image = element.querySelector('.ed-ritual-hero-photo');
        const panel = element.querySelector('.ed-ritual-hero-copy');
        const title = element.querySelector('h1');
        const header = document.querySelector('.site-header').getBoundingClientRect();
        return { image: image.getBoundingClientRect().toJSON(), panel: panel.getBoundingClientRect().toJSON(), title: title.getBoundingClientRect().toJSON(), headerBottom: header.bottom, imageRadius: getComputedStyle(image).borderTopLeftRadius, panelRadius: getComputedStyle(panel).borderTopLeftRadius };
      });
      assert(hero.image.top >= hero.headerBottom && hero.title.top >= hero.headerBottom);
      assert(hero.panel.top < hero.image.bottom && hero.panel.top > hero.image.top + hero.image.height * .6, 'Hero overlap is disproportionate');
      assert.equal(hero.imageRadius, hero.panelRadius);
      if (width >= 1024) assert(hero.panel.height < hero.image.height * .7, 'Desktop content panel remains too tall');
      assert(!await page.evaluate(() => document.documentElement.scrollWidth > innerWidth));
      await page.locator('#ritual-page-title').evaluate(element => element.scrollIntoView({ block: 'start', behavior: 'instant' }));
      assert(await page.locator('#ritual-page-title').evaluate(element => element.getBoundingClientRect().top >= document.querySelector('.site-header').getBoundingClientRect().bottom), 'Header covers the anchored title');

      const treat = page.getByRole('tab', { name: 'Treat', exact: true });
      const nourish = page.getByRole('tab', { name: 'Nourish', exact: true });
      for (const tab of [treat, nourish]) {
        await tab.click(); await page.waitForTimeout(720);
        assert.equal(await tab.getAttribute('aria-selected'), 'true');
        for (const edge of ['top', 'bottom']) checkCorners(await corners(page, edge));
      }
      await treat.click(); await page.waitForTimeout(720);
      await corners(page, 'top');
      await nourish.click(); await page.waitForTimeout(110);
      const mask = await page.locator('.ed-ritual-layer-1').evaluate(element => getComputedStyle(element).clipPath);
      assert(!['inset(0px)', 'inset(0px 0px 0px 100%)'].includes(mask), 'Product image transition did not interpolate');
      checkCorners(await corners(page, 'top'));
      await treat.click(); await nourish.click(); await treat.click();
      await page.waitForTimeout(750);
      assert.equal(await treat.getAttribute('aria-selected'), 'true');
      await treat.focus(); await page.keyboard.press('ArrowRight'); await page.waitForTimeout(750);
      assert.equal(await nourish.getAttribute('aria-selected'), 'true');
      const internalRadii = await page.locator('.ed-ritual-study-head,.ed-ritual-stage,.ed-ritual-study-copy,.ed-ritual-texture').evaluateAll(elements => elements.map(element => getComputedStyle(element).borderRadius));
      assert(internalRadii.every(radius => radius === '0px'), 'An internal dividing edge is rounded');
      const packSources = await page.locator('.ed-ritual-object img').evaluateAll(images => images.map(image => image.getAttribute('src')));
      assert(packSources[0].includes('lumiclear-serum-pack') && packSources[1].includes('lumiclear-cream-pack'));

      await page.goto(base + '/our-house', { waitUntil: 'networkidle' });
      assert.equal(normalise(await page.locator('#main').innerText()), copy['/our-house'], 'Our House brand copy changed');
      assert(await waitImages(page.locator('.ed-house')));
      assert(!await page.evaluate(() => document.documentElement.scrollWidth > innerWidth));
      const handoff = await page.locator('.ed-house-story').evaluate(element => ({ storyTop: element.getBoundingClientRect().top, heroBottom: document.querySelector('.ed-house-hero').getBoundingClientRect().bottom, radius: parseFloat(getComputedStyle(element).borderTopLeftRadius) }));
      assert(handoff.storyTop < handoff.heroBottom && handoff.radius >= 24);
      for (const scene of ['.house-story-introduction', '.house-location-reel', '.ed-principles']) {
        await page.locator(scene).evaluate(element => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
        await page.waitForFunction(selector => document.querySelector(selector).hasAttribute('data-reveal-entered'), scene);
        assert(await page.locator(scene).evaluate(element => element.getAnimations({ subtree: true }).some(animation => animation.effect.getTiming().duration > 0)), 'Coordinated House scene did not animate');
        await page.waitForTimeout(1250);
        const hidden = await page.locator(scene).evaluate(element => [...element.querySelectorAll('h2, li, .ed-photo')].some(child => getComputedStyle(child).visibility === 'hidden' || getComputedStyle(child).opacity === '0'));
        assert(!hidden, 'A House scene left content hidden');
      }
      assert.equal(await page.locator('.ed-principles-grid > li').count(), 4);
      await page.getByRole('link', { name: 'Our philosophy', exact: true }).click();
      await page.waitForTimeout(900);
      assert(await page.locator('#house-philosophy-title').evaluate(element => element.getBoundingClientRect().bottom > document.querySelector('.site-header').getBoundingClientRect().bottom));
      await page.emulateMedia({ reducedMotion: 'reduce' });
      assert(await page.locator('.ed-house').evaluate(element => element.getAnimations({ subtree: true }).filter(animation => animation.playState === 'running').length === 0));
      const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      assert.deepEqual(axe.violations.map(violation => ({ id: violation.id, targets: violation.nodes.map(node => node.target) })), []);
      result.layouts.push({ width, ritualHero: true, bothProductStates: true, transition: true, corners: true, internalEdgesStraight: true, houseScenes: true, copyPreserved: true });
      await context.close();
      console.log(`Ritual and Our House passed at ${width}px`);
    }

    for (const [name, width, height, reduced] of [['desktop', 1440, 900, false], ['phone', 390, 844, false], ['narrow', 320, 740, false], ['reduced', 390, 844, true]]) {
      const context = await browser.newContext({ viewport: { width, height }, isMobile: width < 768, hasTouch: width < 768, reducedMotion: reduced ? 'reduce' : 'no-preference' });
      const page = await context.newPage(); observe(page, name);
      await page.goto(base, { waitUntil: 'domcontentloaded' });
      if (!reduced) {
        await page.waitForFunction(() => document.documentElement.dataset.homeIntro === 'active');
        const timing = await page.evaluate(() => new Promise(resolve => {
          const sample = { word: null, signature: null, brandExit: null, heading: null };
          const start = performance.now();
          function tick() {
            const css = selector => getComputedStyle(document.querySelector(selector));
            if (sample.word === null && Number(css('.intro-wordmark').opacity) > .99) sample.word = performance.now() - start;
            if (sample.signature === null && [...document.querySelectorAll('.intro-signature span')].every(element => Number(getComputedStyle(element).opacity) > .99)) sample.signature = performance.now() - start;
            if (sample.brandExit === null && Number(css('.intro-composition').opacity) < .95) sample.brandExit = performance.now() - start;
            if (sample.heading === null && css('.light-hero .reveal-line > span').transform === 'matrix(1, 0, 0, 1, 0, 0)') sample.heading = performance.now() - start;
            if (document.documentElement.dataset.homeIntro === 'done') resolve(sample); else requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        }));
        await completeIntro(page);
        assert(timing.signature !== null && timing.brandExit > timing.signature, 'The brand signature has no readable beat before exit');
        const value = await page.evaluate(() => {
          const marks = performance.getEntriesByType('mark');
          const start = marks.find(mark => mark.name === 'shenerio:intro-start')?.startTime;
          const end = marks.find(mark => mark.name === 'shenerio:intro-end')?.startTime;
          return { activeMs: end - start, reason: document.documentElement.dataset.homeIntroReason };
        });
        assert.equal(value.reason, 'complete');
        assert(value.activeMs >= 1450 && value.activeMs <= 2250, 'Opening timing is outside the refined short sequence');
        result.openings.push({ name, ...value, beats: timing });
      } else {
        await completeIntro(page);
        assert.equal(await page.evaluate(() => performance.getEntriesByName('shenerio:intro-start').length), 0);
        result.openings.push({ name, immediate: true });
      }
      assert(!await page.locator('.campaign-intro').isVisible());
      assert.equal(await page.locator('.hero-copy .button').evaluate(element => getComputedStyle(element).opacity), '1');
      await page.reload({ waitUntil: 'networkidle' });
      assert.equal(await page.evaluate(() => performance.getEntriesByName('shenerio:intro-start').length), 0, 'Refresh replayed intro');
      await page.locator('.hero-copy .button').click(); await page.waitForTimeout(900);
      assert.equal(await page.evaluate(() => location.hash), '#collection');
      const product = width >= 1024 ? page.getByRole('link', { name: 'View Target Serum, £26.00 GBP' }) : page.getByRole('link', { name: 'Discover the serum', exact: true });
      await product.click(); await page.waitForURL('**/products/lumiclear-target-serum');
      assert((await page.locator('#main').innerText()).includes('£26.00'));
      await page.goBack({ waitUntil: 'networkidle' }); await completeIntro(page);
      assert(!await page.locator('.campaign-intro').isVisible());
      assert.equal(await page.evaluate(() => performance.getEntriesByName('shenerio:intro-start').length), 0, 'Back replayed intro');
      await context.close();
    }
    const input = await browser.newPage(); observe(input, 'input');
    await input.goto(base, { waitUntil: 'domcontentloaded' });
    await input.waitForFunction(() => document.documentElement.dataset.homeIntro === 'active');
    await input.keyboard.press('Tab'); await completeIntro(input);
    assert.equal(await input.evaluate(() => document.documentElement.dataset.homeIntroReason), 'input');
    assert(await input.locator('.skip-link').evaluate(element => element === document.activeElement));
    await input.mouse.wheel(0, 450); await input.waitForTimeout(550);
    assert(await input.evaluate(() => scrollY > 200));
    assert(!await input.evaluate(() => ['hidden', 'clip'].includes(getComputedStyle(document.documentElement).overflowY)));
    await input.close();
    assert.deepEqual(result.errors, []);
    console.log(JSON.stringify(result, null, 2));
  }
} finally { await browser.close(); }
