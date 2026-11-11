import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const base = process.env.PREVIEW_URL || 'http://127.0.0.1:3000';
const output = process.env.QA_OUTPUT || 'docs/implementation/evidence/atlas-followup';
const browser = await chromium.launch({ channel: 'chrome' });
await mkdir(output, { recursive: true });
const results = {};

try {
  for (const [name, width, height] of [['desktop', 1440, 900], ['phone', 390, 740], ['narrow', 320, 650], ['short', 320, 620]]) {
    const phone = width < 768;
    const viewport = { width, height };
    const context = await browser.newContext({
      viewport, isMobile: phone, hasTouch: phone,
      recordVideo: phone ? undefined : { dir: 'tmp/atlas-followup-video', size: viewport },
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(base + '/formulation');
    const track = page.locator('.atlas-scroll-track[data-atlas-ready]');
    await track.waitFor();
    const bounds = await track.evaluate(runway => {
      const stage = runway.querySelector('.atlas-index-card');
      const top = parseFloat(getComputedStyle(stage).top);
      const start = scrollY + runway.getBoundingClientRect().top - top;
      return { start, travel: runway.offsetHeight - stage.offsetHeight, top, stageHeight: stage.offsetHeight };
    });
    assert(bounds.travel > 500);
    assert(bounds.top + bounds.stageHeight <= height, `${name} sticky card extends below the screen`);
    await page.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), Math.ceil(bounds.start));
    await page.waitForFunction(() => [...document.querySelectorAll('.atlas-visual img')].every(image => image.complete && image.naturalWidth));
    const state = () => track.evaluate(runway => {
      const stage = runway.querySelector('.atlas-index-card');
      const layer = stage.querySelector('.atlas-visual[data-topic="skin-conditioning"]');
      const matrix = new DOMMatrix(getComputedStyle(layer).transform);
      return {
        selected: stage.querySelector('[role="tabpanel"][data-current]').dataset.topic,
        imageOffset: Math.round(matrix.m41 / layer.clientWidth * 100),
        stageTop: Math.round(stage.getBoundingClientRect().top),
      };
    });
    const step = bounds.travel / 4;
    const scroll = async distance => {
      if (!phone) {
        await page.mouse.move(770, 604);
        await page.mouse.wheel(0, distance);
        await page.waitForTimeout(460);
        return;
      }
      await page.evaluate(delta => scrollBy({ top: delta, behavior: 'instant' }), distance);
      await page.waitForTimeout(100);
    };
    assert.equal((await state()).selected, 'hydration');
    await page.screenshot({ path: `${output}/${name}-hydration.jpg`, quality: 86 });
    await scroll(Math.round(step * .33));
    const beforeHalf = await state();
    assert.equal(beforeHalf.selected, 'hydration');
    assert(beforeHalf.imageOffset > 50 && beforeHalf.imageOffset < 82, JSON.stringify(beforeHalf));
    await scroll(Math.round(step * .34));
    const afterHalf = await state();
    assert.equal(afterHalf.selected, 'skin-conditioning');
    assert(afterHalf.imageOffset > 15 && afterHalf.imageOffset < 50, JSON.stringify(afterHalf));
    assert.equal(afterHalf.stageTop, Math.round(bounds.top));
    await page.screenshot({ path: `${output}/${name}-conditioning-incoming.jpg`, quality: 86 });
    await scroll(-Math.round(step * .34));
    const reversed = await state();
    assert.equal(reversed.selected, 'hydration');
    assert(Math.abs(reversed.imageOffset - beforeHalf.imageOffset) <= 5);

    const tabs = page.getByRole('tablist', { name: 'Ingredient index.' });
    const topics = ['hydration', 'skin-conditioning', 'nourishment', 'niacinamide', 'botanicals'];
    if (!phone) {
      for (const [index, topic] of topics.entries()) {
        if (index === 0) continue;
        const destination = bounds.start + index * step;
        for (let remaining = 3; remaining > 0; remaining--) {
          const distance = destination - await page.evaluate(() => scrollY);
          await scroll(Math.round(distance / remaining));
        }
        assert.equal((await state()).selected, topic);
      }
    }
    if (phone) {
      await tabs.getByRole('tab', { name: 'Hydration', exact: true }).tap();
      const picture = await page.locator('.atlas-visuals').boundingBox();
      const cdp = await context.newCDPSession(page);
      const x = Math.round(picture.x + picture.width / 2);
      const y = Math.round(picture.y + picture.height * .8);
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
      for (let move = 1; move <= 14; move++) {
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y - step * .81 * move / 14 }] });
        await page.waitForTimeout(33);
      }
      await page.waitForTimeout(150);
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await page.waitForFunction(() => document.querySelector('[role="tabpanel"][data-current]')?.getAttribute('data-topic') === 'skin-conditioning');
    }
    for (const [index, topic] of topics.entries()) {
      await tabs.getByRole('tab').nth(index).click();
      assert.equal((await state()).selected, topic);
      assert.equal(await page.getByRole('tabpanel').getByRole('link', { name: 'Read the chapter' }).getAttribute('href'), `#${topic}`);
    }
    await scroll(170);
    const released = await state();
    assert(released.stageTop < bounds.top - 100);
    assert.deepEqual(errors, []);
    results[name] = { bounds, beforeHalf, afterHalf, reversed, released, touchGesture: phone };

    if (!phone) {
      const video = page.video();
      await context.close();
      await video.saveAs(`${output}/atlas-scroll.webm`);
    } else {
      await page.goto(base);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1000);
      const hero = await page.locator('.hero').evaluate(section => {
        const headline = section.querySelector('h1').getBoundingClientRect();
        const art = section.querySelector('.hero-art').getBoundingClientRect();
        const cta = section.querySelector('.hero-copy .button').getBoundingClientRect();
        return { headlineOverlapsPhoto: headline.top < art.bottom, ctaInViewport: cta.bottom <= innerHeight };
      });
      assert.deepEqual(hero, { headlineOverlapsPhoto: true, ctaInViewport: true });
      await page.screenshot({ path: `${output}/${name}-home-hero.jpg`, quality: 87 });
      if (name === 'phone') {
        await page.goto(base + '/our-house');
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(1150);
        await page.screenshot({ path: `${output}/phone-our-house.jpg`, quality: 87 });
      }
      await context.close();
    }
  }

  const reduced = await browser.newPage({ viewport: { width: 390, height: 740 }, reducedMotion: 'reduce' });
  await reduced.goto(base + '/formulation');
  const atlas = reduced.locator('.atlas-scroll-track');
  assert.equal(await atlas.locator('.atlas-index-card').evaluate(element => getComputedStyle(element).position), 'relative');
  await reduced.getByRole('tab', { name: 'Skin conditioning' }).click();
  assert.equal(await reduced.getByRole('tab', { name: 'Skin conditioning' }).getAttribute('aria-selected'), 'true');
  assert.equal(await atlas.locator('.atlas-visual[data-current]').getAttribute('data-topic'), 'skin-conditioning');
  results.reducedMotion = 'Static card with working ingredient tabs and images';
  await reduced.close();

  const house = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await house.goto(base + '/our-house');
  await house.evaluate(() => document.fonts.ready);
  await house.waitForTimeout(1200);
  await house.screenshot({ path: `${output}/desktop-our-house.jpg`, quality: 87 });
  await house.locator('.house-location-reel').scrollIntoViewIfNeeded();
  await house.waitForTimeout(800);
  await house.screenshot({ path: `${output}/desktop-our-house-origins.jpg`, quality: 87 });
  await house.close();
  await writeFile(`${output}/atlas-scroll-qa.json`, JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
} finally {
  await browser.close();
}
