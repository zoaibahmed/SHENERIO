import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const base = process.env.PREVIEW_URL || 'http://127.0.0.1:3000';
const out = 'docs/implementation/evidence/opening-editorial/after';
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome' });
const report = { browser: browser.version(), at: new Date().toISOString(), opening: [], editorial: [], errors: [] };
const metrics = () => {
  window.introMetrics = { cls: 0, lcp: 0, frames: [], longTasks: [] };
  new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.introMetrics.cls += entry.value; }).observe({ type: 'layout-shift', buffered: true });
  new PerformanceObserver(list => { for (const entry of list.getEntries()) window.introMetrics.lcp = entry.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
  new PerformanceObserver(list => { window.introMetrics.longTasks.push(...list.getEntries().map(entry => entry.duration)); }).observe({ type: 'longtask', buffered: true });
  let previous;
  function frame(time) {
    if (previous && document.documentElement.dataset.homeIntro === 'active') window.introMetrics.frames.push(time - previous);
    previous = time;
    if (time < 5000) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
};
const settled = page => page.waitForFunction(() => !['pending', 'active'].includes(document.documentElement.dataset.homeIntro));
const staticHero = async page => {
  assert.equal(await page.locator('.campaign-intro').isVisible(), false);
  assert.equal(await page.locator('.hero-art picture').evaluate(element => getComputedStyle(element).animationName), 'none');
  assert.equal(await page.locator('.hero-description').evaluate(element => getComputedStyle(element).opacity), '1');
  assert.equal(await page.locator('.hero-copy .button').evaluate(element => getComputedStyle(element).opacity), '1');
  assert(await page.evaluate(() => !['hidden', 'clip'].includes(getComputedStyle(document.documentElement).overflowY)));
};

try {
  for (const [name, width, height] of [['desktop', 1440, 900], ['phone', 390, 844]]) {
    const context = await browser.newContext({ viewport: { width, height }, isMobile: name === 'phone', hasTouch: name === 'phone', recordVideo: { dir: 'tmp/opening-final-video', size: { width, height } } });
    const page = await context.newPage();
    page.on('pageerror', error => report.errors.push(`${name}: ${error.message}`));
    page.on('console', entry => { if (entry.type() === 'error') report.errors.push(`${name}: ${entry.text()}`); });
    await page.addInitScript(metrics);
    await page.goto(base, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.documentElement.dataset.homeIntro === 'active');
    await page.waitForTimeout(name === 'phone' ? 300 : 380);
    const wordmark = await page.locator('.intro-wordmark').evaluate(element => {
      const rect = element.getBoundingClientRect();
      const clip = element.parentElement.getBoundingClientRect();
      return { top: rect.top, bottom: rect.bottom, clipTop: clip.top, clipBottom: clip.bottom, opacity: Number(getComputedStyle(element).opacity), compositionOpacity: Number(getComputedStyle(element.parentElement.parentElement).opacity) };
    });
    assert(wordmark.opacity > .95 && wordmark.compositionOpacity > .9 && wordmark.top >= wordmark.clipTop - 2 && wordmark.bottom <= wordmark.clipBottom + 3, 'Wordmark failed to reveal inside its mask');
    assert.equal((await page.locator('.intro-signature').innerText()).replace(/\s+/g, ' '), 'ADVANCED SKINCARE. REFINED BY DESIGN.');
    await page.screenshot({ path: `${out}/${name}-introduction.jpg`, quality: 90 });
    await settled(page);
    await staticHero(page);
    await page.waitForTimeout(550);
    await page.screenshot({ path: `${out}/${name}-hero.jpg`, quality: 90 });
    const measurement = await page.evaluate(() => {
      const values = window.introMetrics.frames.sort((a, b) => a - b);
      return { reason: document.documentElement.dataset.homeIntroReason, enteredAt: Number(document.documentElement.dataset.homeIntroAt), cls: window.introMetrics.cls, lcp: window.introMetrics.lcp, longTasks: window.introMetrics.longTasks, frames: { count: values.length, median: values[Math.floor(values.length / 2)], p95: values[Math.floor(values.length * .95)], over50: values.filter(value => value > 50).length }, marks: performance.getEntriesByType('mark').filter(entry => entry.name.startsWith('shenerio:')).map(entry => ({ name: entry.name, time: entry.startTime })) };
    });
    assert.equal(measurement.reason, 'complete');
    report.opening.push({ name, width, height, ...measurement });
    const video = page.video();
    await context.close();
    await video.saveAs(`${out}/opening-${name}.webm`);

    const history = await browser.newPage({ viewport: { width, height } });
    await history.goto(base); await settled(history);
    await history.reload({ waitUntil: 'networkidle' });
    assert.equal(await history.evaluate(() => performance.getEntriesByName('shenerio:intro-start').length), 0, 'Refresh replayed introduction');
    await staticHero(history);
    const house = history.locator('.primary-nav').getByRole('link', { name: 'Our House', exact: true });
    if (name === 'desktop') await house.click();
    else await history.goto(base + '/our-house');
    await history.waitForURL('**/our-house');
    assert.equal(await history.locator('.campaign-intro').count(), 0);
    await history.goBack({ waitUntil: 'networkidle' }); await settled(history); await staticHero(history);
    assert.equal(await history.evaluate(() => performance.getEntriesByName('shenerio:intro-start').length), 0, 'Browser Back replayed introduction');
    await history.goForward({ waitUntil: 'networkidle' });
    assert.equal(await history.locator('.campaign-intro').count(), 0);
    await history.close();
    report.opening.push({ name: `${name}-refresh-history`, passed: true });
    console.log(`${name}: fresh recording, refresh and Back/Forward passed`);
  }

  for (const target of ['/products/lumiclear-target-serum', '/journal/niacinamide', '/faq']) {
    const page = await browser.newPage();
    await page.goto(base + target, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('.campaign-intro').count(), 0);
    assert(await page.locator('h1').isVisible());
    await page.goto(base); await settled(page); await staticHero(page);
    assert.equal(await page.evaluate(() => performance.getEntriesByName('shenerio:intro-start').length), 0, 'Internal entry triggered a cinematic introduction');
    await page.close();
  }
  report.directEntries = true;

  for (const mode of ['keyboard', 'pointer', 'wheel', 'preference', 'route']) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(base, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.documentElement.dataset.homeIntro === 'active');
    const start = Date.now();
    if (mode === 'keyboard') await page.keyboard.press('Tab');
    if (mode === 'pointer') await page.mouse.click(740, 350);
    if (mode === 'wheel') await page.mouse.wheel(0, 400);
    if (mode === 'preference') await page.emulateMedia({ reducedMotion: 'reduce' });
    if (mode === 'route') {
      await page.locator('.primary-nav').getByRole('link', { name: 'Our House', exact: true }).click();
      await page.waitForURL('**/our-house');
      await page.goBack({ waitUntil: 'networkidle' });
    }
    await settled(page); await staticHero(page);
    const reason = await page.evaluate(() => document.documentElement.dataset.homeIntroReason);
    if (mode !== 'route') assert.equal(reason, mode === 'preference' ? 'reduced-motion' : 'input');
    if (mode === 'keyboard') assert(await page.locator('.skip-link').evaluate(element => element === document.activeElement));
    if (mode === 'wheel') { await page.waitForTimeout(350); assert(await page.evaluate(() => scrollY > 200)); }
    report.opening.push({ name: `interruption-${mode}`, reason, toolRoundTripMs: Date.now() - start });
    await page.close();
  }

  const slowContext = await browser.newContext({ recordVideo: { dir: 'tmp/opening-final-video', size: { width: 1440, height: 900 } }, viewport: { width: 1440, height: 900 } });
  const slow = await slowContext.newPage();
  await slow.route('**/images/campaign-daylight*.webp', async route => { await new Promise(resolve => setTimeout(resolve, 1600)); await route.continue(); });
  await slow.goto(base, { waitUntil: 'domcontentloaded' });
  await settled(slow);
  await staticHero(slow);
  await slow.waitForTimeout(1400);
  report.slowHero = await slow.evaluate(() => ({ reason: document.documentElement.dataset.homeIntroReason, heroDecoded: document.querySelector('.hero-art img').naturalWidth > 0 }));
  assert(report.slowHero.heroDecoded);
  const slowVideo = slow.video(); await slowContext.close(); await slowVideo.saveAs(`${out}/opening-delayed-photo.webm`);

  const network = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await network.addInitScript(metrics);
  const networkCDP = await network.context().newCDPSession(network);
  await networkCDP.send('Network.enable');
  await networkCDP.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 200000, uploadThroughput: 93750 });
  await network.goto(base, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await settled(network); await staticHero(network);
  await network.waitForLoadState('networkidle', { timeout: 60000 });
  report.throttledNetwork = await network.evaluate(() => ({ reason: document.documentElement.dataset.homeIntroReason || 'skipped', cls: window.introMetrics.cls, lcp: window.introMetrics.lcp, heroDecoded: document.querySelector('.hero-art img').naturalWidth > 0 }));
  await network.close();

  const reduced = await browser.newPage({ reducedMotion: 'reduce' });
  await reduced.goto(base, { waitUntil: 'networkidle' }); await staticHero(reduced);
  assert.equal(await reduced.evaluate(() => performance.getEntriesByName('shenerio:intro-start').length), 0);
  await reduced.close(); report.reducedMotion = true;
  const noScript = await browser.newPage({ javaScriptEnabled: false });
  await noScript.goto(base); await staticHero(noScript); await noScript.close(); report.noScript = true;
  const failedScript = await browser.newPage();
  await failedScript.route('**/_next/static/**/*.js', route => route.abort());
  await failedScript.goto(base, { waitUntil: 'domcontentloaded' }); await settled(failedScript); await staticHero(failedScript);
  assert.equal(await failedScript.evaluate(() => document.documentElement.dataset.homeIntroReason), 'deadline');
  await failedScript.close(); report.failedJavaScriptFallback = true;

  for (const [width, height] of [[1440, 900], [1024, 768], [768, 1024], [390, 844], [320, 740]]) {
    const editorialContext = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
    const page = await editorialContext.newPage();
    page.on('pageerror', error => report.errors.push(`${width}: ${error.message}`));
    page.on('console', entry => { if (entry.type() === 'error') report.errors.push(`${width}: ${entry.text()}`); });
    for (const [label, route, selectors] of [
      ['ritual', '/the-ritual', ['.ed-ritual-hero-photo', '.ed-ritual-study', '#morning-ritual', '#evening-ritual']],
      ['journal', '/journal', ['.ed-journal-feature', '.ed-journal-photo', '.journal-guide-photo']],
      ['article', '/journal/niacinamide', ['.ed-article-photo', '.ed-publication-note']],
    ]) {
      await page.goto(base + route, { waitUntil: 'networkidle' });
      assert(!await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), `${route} overflows at ${width}`);
      for (const selector of selectors) {
        assert(await page.locator(selector).first().evaluate(element => parseFloat(getComputedStyle(element).borderTopLeftRadius) >= 14), `${selector} sharp corner`);
      }
      if (label === 'ritual') {
        const nourish = page.getByRole('tab', { name: 'Nourish', exact: true });
        await nourish.click(); assert.equal(await nourish.getAttribute('aria-selected'), 'true');
        await page.keyboard.press('ArrowLeft'); assert.equal(await page.getByRole('tab', { name: 'Treat', exact: true }).getAttribute('aria-selected'), 'true');
        assert.match(await page.locator('#morning-ritual').innerText(), /sunscreen/i);
      }
      if (label === 'journal') {
        assert((await page.locator('.journal-guide-photo img').first().getAttribute('src')).includes('journal-serum-macro'));
        assert(await page.getByRole('link', { name: /Niacinamide: an essential/ }).isVisible());
      }
      if (label === 'article') {
        assert.match(await page.locator('.ed-draft-notice').innerText(), /Private editorial draft/);
        assert.match(await page.locator('meta[name="robots"]').getAttribute('content'), /noindex/);
        assert.equal(await page.locator('.ed-article-section > p').count(), 3, 'Unreviewed article content changed');
      }
      const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      assert.deepEqual(axe.violations.map(violation => ({ id: violation.id, nodes: violation.nodes.map(node => node.target) })), []);
      report.editorial.push({ route, width, passed: true });
    }
    await editorialContext.close();
  }
  const hover = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await hover.goto(base + '/journal', { waitUntil: 'networkidle' });
  const atlas = hover.locator('.journal-guide-spread a').first();
  await atlas.hover(); await hover.waitForTimeout(750);
  assert.notEqual(await atlas.locator('img').evaluate(image => getComputedStyle(image).transform), 'none');
  await hover.screenshot({ path: `${out}/desktop-atlas-hover.jpg`, quality: 89 });
  await atlas.click(); await hover.waitForURL('**/formulation'); await hover.goBack();
  const feature = hover.locator('.ed-journal-feature-link');
  await feature.focus(); await hover.keyboard.press('Enter'); await hover.waitForURL('**/journal/niacinamide');
  await hover.close(); report.hoverAndNavigation = true;
  console.log('Opening lifecycle, interruption, slow-photo fallback and 15 editorial layout checks passed');
} catch (error) {
  report.errors.push(error.stack || String(error)); process.exitCode = 1;
} finally {
  await browser.close();
  await writeFile(`${out}/opening-editorial-qa.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
}
