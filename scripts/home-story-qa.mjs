import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const base = process.env.PREVIEW_URL || 'http://127.0.0.1:3000';
const output = process.env.QA_OUTPUT || 'docs/implementation/evidence/home-story/after';
const browser = await chromium.launch({ channel: 'chrome' });
await mkdir(output, { recursive: true });
const report = { browser: browser.version(), testedAt: new Date().toISOString(), runs: [], errors: [] };
const chapters = ['house', 'collection', 'formulation', 'origins', 'everyday', 'ritual', 'journal', 'newsletter'];

async function atProgress(page, selector, progress) {
  const position = await page.locator(selector).evaluate((track, value) => {
    const stage = track.firstElementChild;
    const top = parseFloat(getComputedStyle(stage).top);
    const travel = track.clientHeight - stage.clientHeight;
    return { y: scrollY + track.getBoundingClientRect().top - top + travel * value, top, travel };
  }, progress);
  await page.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), position.y);
  await page.waitForTimeout(120);
  return position;
}

try {
  for (const [name, width, height, reduced] of [
    ['desktop', 1440, 900, false], ['compact', 1024, 768, false],
    ['tablet', 768, 1024, false], ['phone', 390, 844, false],
    ['narrow', 320, 740, false], ['short-desktop', 1440, 620, false],
    ['reduced-desktop', 1440, 900, true], ['reduced-phone', 390, 844, true],
  ]) {
    const context = await browser.newContext({ viewport: { width, height }, isMobile: width < 768, hasTouch: width < 768, reducedMotion: reduced ? 'reduce' : 'no-preference' });
    const page = await context.newPage();
    page.on('pageerror', error => report.errors.push(`${name}: ${error.message}`));
    page.on('console', entry => { if (entry.type() === 'error') report.errors.push(`${name}: ${entry.text()}`); });
    page.on('response', response => { if (response.status() >= 400) report.errors.push(`${name}: ${response.status()} ${response.url()}`); });
    await page.addInitScript(() => {
      window.storyCLS = 0;
      new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.storyCLS += entry.value; }).observe({ type: 'layout-shift', buffered: true });
    });
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => document.documentElement.dataset.motionReady === 'true');
    await page.waitForTimeout(1400);
    const result = { name, width, height, reduced };
    result.cls = await page.evaluate(() => window.storyCLS);
    result.pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    assert(!await page.evaluate(() => document.documentElement.scrollWidth > innerWidth));
    assert.equal(await page.locator('.collection-chapters, .collection-bridge, .ritual-packshot, .ritual-steps').count(), 0);
    assert.equal(await page.locator('#collection .optics-note').count(), 2);
    assert.equal(await page.locator('#ritual a').count(), 1);
    assert.equal(await page.locator('#ritual a').getAttribute('href'), '/the-ritual');
    assert.equal((await page.locator('#ritual a').innerText()).replace('↗', '').trim(), 'DISCOVER THE RITUAL');
    assert(!/£|discover the serum|view cream/i.test(await page.locator('#ritual').innerText()));
    assert.equal(await page.locator('#ritual img').count(), 2);
    assert.equal(await page.locator('#ritual img[src*="lumiclear-"]').count(), 0);
    const order = await page.evaluate(ids => ids.map(id => document.getElementById(id).getBoundingClientRect().top), chapters);
    assert(order.every((y, index) => index === 0 || y > order[index - 1]));
    assert.equal(await page.locator('#collection + section').getAttribute('id'), 'formulation');
    assert((await page.locator('#collection').innerText()).includes('£26.00 GBP'));
    assert((await page.locator('#collection').innerText()).includes('£36.00 GBP'));
    const ritualImages = await page.locator('#ritual img').evaluateAll(async images => { await Promise.all(images.map(image => image.decode())); return images.every(image => image.naturalWidth > 0); });
    assert(ritualImages, 'Application imagery did not decode');

    if (width >= 1024 && height >= 680 && !reduced) {
      for (const [scene, selector] of [['collection', '.collection-optics-track'], ['ritual', '.home-ritual-track']]) {
        const forward = [];
        for (const progress of [0, .25, .5, .75, 1]) {
          const position = await atProgress(page, selector, progress);
          assert(position.travel > 0 && position.travel <= 500, `${scene} travel exceeds its bound`);
          const stage = page.locator(selector + ' > div');
          const actualTop = await stage.evaluate(element => element.getBoundingClientRect().top);
          assert(Math.abs(actualTop - position.top) < 2, `${scene} does not stick at ${progress}`);
          forward.push(await page.locator(selector).getAttribute('data-phase'));
          if (scene === 'collection' && (progress === 0 || progress === 1)) {
            const visibleCaption = await page.locator(`.optics-note-${progress}`).evaluate(note => {
              const clip = note.parentElement.getBoundingClientRect();
              return [...note.querySelectorAll('h3, .optics-price, .optics-description')].every(element => {
                const bounds = element.getBoundingClientRect();
                return bounds.top >= clip.top - 1 && bounds.bottom <= clip.bottom + 1;
              });
            });
            assert(visibleCaption, 'Selected product name, price or description is outside the text mask');
          }
          if (scene === 'ritual') {
            const opacity = await page.locator('.home-ritual-copy').evaluateAll(elements => elements.map(element => Number(getComputedStyle(element).opacity)));
            assert.deepEqual(opacity, progress < .53 ? [1, 0] : [0, 1], 'Application copy mixes guidance between steps');
          }
          if (name === 'desktop') await page.screenshot({ path: `${output}/desktop-${scene}-${Math.round(progress * 100)}.jpg`, quality: 88 });
        }
        assert.deepEqual(forward, ['treat', 'treat', 'treat', 'nourish', 'nourish']);
        const endPosition = await atProgress(page, selector, 1);
        await page.evaluate(y => scrollTo({ top: y + 160, behavior: 'instant' }), endPosition.y);
        assert(await page.locator(selector + ' > div').evaluate(element => element.getBoundingClientRect().top) < endPosition.top - 145);
        await atProgress(page, selector, 0);
        assert.equal(await page.locator(selector).getAttribute('data-phase'), 'treat');
        const reset = await page.locator(scene === 'ritual' ? '.home-ritual-application-1 .home-ritual-photo' : '.optics-study-1 .optics-material').evaluate(element => getComputedStyle(element).clipPath);
        assert(reset.includes('100%'), `${scene} reverse did not restore its reveal mask`);
        result[scene] = { forward, reverse: true, release: true, travel: endPosition.travel };
      }
      // The desktop shopping controls remain outside the animated text masks.
      await atProgress(page, '.collection-optics-track', 1);
      const serum = page.getByRole('link', { name: 'View Target Serum, £26.00 GBP' });
      const cream = page.getByRole('link', { name: 'View Radiance Cream, £36.00 GBP' });
      await serum.focus();
      await page.keyboard.press('Tab');
      assert(await cream.evaluate(link => link === document.activeElement));
      const previous = await page.evaluate(() => scrollY);
      await page.keyboard.press('Enter');
      await page.waitForURL('**/products/lumiclear-radiance-cream');
      await page.goBack({ waitUntil: 'networkidle' });
      await page.waitForFunction(() => document.documentElement.dataset.motionReady === 'true');
      await page.waitForFunction(value => Math.abs(scrollY - value) < 25, previous);
      result.productNavigation = 'Keyboard navigation and Back restoration passed';
    } else {
      assert.equal(await page.locator('.collection-optics').evaluate(element => getComputedStyle(element).position), 'static');
      assert.equal(await page.locator('.home-ritual-scene').evaluate(element => getComputedStyle(element).position), 'static');
      for (const selector of ['.optics-note-0', '.optics-note-1', '#ritual-step-1', '#ritual-step-2']) {
        await page.locator(selector).evaluate(element => element.scrollIntoView({ block: 'start', behavior: 'instant' }));
        await page.waitForTimeout(100);
        assert(await page.locator(selector).isVisible());
        const image = page.locator(selector + ' img').first();
        await image.evaluate(element => element.decode());
        if (['phone', 'narrow', 'tablet', 'reduced-desktop'].includes(name)) await page.screenshot({ path: `${output}/${name}-${selector.replace(/[^a-z0-9-]/g, '')}.jpg`, quality: 87 });
      }
      const sources = await page.locator('.optics-visual img').evaluateAll(images => images.map(image => image.currentSrc || image.src));
      assert(sources.every(source => source.startsWith('data:')), 'Compact/reduced stage fetched hidden desktop imagery');
      result.staticFlow = true;
    }

    if (name === 'desktop') {
      await page.setViewportSize({ width: 900, height: 780 });
      assert.equal(await page.locator('.home-ritual-scene').evaluate(element => getComputedStyle(element).position), 'static');
      await page.setViewportSize({ width, height });
      await page.waitForFunction(() => document.querySelector('.home-ritual-track').hasAttribute('data-active'));
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.waitForFunction(() => !document.querySelector('.home-ritual-track').hasAttribute('data-active'));
      assert.equal(await page.locator('.home-ritual-application-1 .home-ritual-copy').evaluate(element => getComputedStyle(element).clipPath), 'none');
      result.livePreferenceChanges = true;
    }
    if (name === 'phone') {
      await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
      const cdp = await context.newCDPSession(page);
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 180, y: 680, id: 1 }] });
      for (let step = 1; step <= 10; step++) {
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 180, y: 680 - step * 48, id: 1 }] });
        await page.waitForTimeout(25);
      }
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await page.waitForTimeout(350);
      assert(await page.evaluate(() => scrollY > 250));
      result.touchScrolling = true;
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    result.violations = axe.violations.map(violation => ({ id: violation.id, nodes: violation.nodes.map(node => node.target) }));
    assert.deepEqual(result.violations, []);
    assert(!await page.evaluate(() => document.documentElement.scrollWidth > innerWidth));
    report.runs.push(result);
    console.log(`${name}: passed`);
    await context.close();
  }
  // No scripting must leave both product links and complete application steps in normal flow.
  const noScript = await browser.newPage({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  await noScript.goto(base);
  assert.equal(await noScript.locator('.home-ritual-scene').evaluate(element => getComputedStyle(element).position), 'static');
  assert(await noScript.getByRole('link', { name: 'Discover the serum', exact: true }).isVisible());
  assert(await noScript.getByRole('link', { name: 'Discover the cream', exact: true }).isVisible());
  report.noScript = true;
  await noScript.close();
} catch (error) {
  report.errors.push(error.stack || String(error));
  process.exitCode = 1;
} finally {
  await browser.close();
  await writeFile(`${output}/home-story-qa.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ runs: report.runs.length, errors: report.errors }, null, 2));
}
