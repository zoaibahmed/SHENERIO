import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const base = process.env.PREVIEW_URL || 'http://127.0.0.1:3000';
const output = process.env.QA_OUTPUT || 'docs/implementation/evidence/direction/after';
const browser = await chromium.launch({ channel: 'chrome' });
const results = {};
await mkdir(output, { recursive: true });

async function capture(name, viewport, walkthrough) {
  const phone = name === 'phone';
  const context = await browser.newContext({
    viewport, isMobile: phone, hasTouch: phone,
    recordVideo: { dir: 'tmp/direction-video', size: viewport },
  });
  const page = await context.newPage();
  await page.addInitScript(() => {
    window.campaignEvents = [];
    for (const type of ['animationstart', 'animationend']) {
      document.addEventListener(type, event => {
        if (event.animationName === 'campaign-aperture') {
          window.campaignEvents.push({ event: type, time: Math.round(performance.now()), duration: event.elapsedTime });
        }
      });
    }
  });
  const issues = [];
  const pause = (ms = 540) => page.waitForTimeout(ms);
  const still = scene => page.screenshot({ path: `${output}/${name}-${scene}.jpg`, quality: 87 });
  const position = (selector, offset) => page.locator(selector).evaluate((element, top) => Math.min(
    scrollY + element.getBoundingClientRect().top - top,
    document.scrollingElement.scrollHeight - innerHeight,
  ), offset);
  const scroll = async (target, step = 140) => {
    if (phone) {
      await page.evaluate(top => scrollTo({ top, behavior: 'smooth' }), target);
      await pause(740);
      return;
    }
    await page.mouse.move(550, 730);
    let remaining = target - await page.evaluate(() => scrollY);
    for (let attempt = 0; Math.abs(remaining) > 4 && attempt < 64; attempt++) {
      await page.mouse.wheel(0, Math.sign(remaining) * Math.min(step, Math.abs(remaining)));
      await pause(Math.abs(remaining) <= step ? 400 : 80);
      remaining = target - await page.evaluate(() => scrollY);
    }
    assert(Math.abs(remaining) < 16, `Wheel stopped ${Math.round(remaining)}px from destination`);
  };
  const go = async (selector, offset = 110, step) => scroll(await position(selector, offset), step);
  const open = async path => {
    const response = await page.goto(base + path, { waitUntil: 'domcontentloaded' });
    assert.equal(response.status(), 200);
    await page.waitForFunction(mode => document.documentElement.dataset.scrollEngine === mode, phone ? 'native' : 'smooth');
  };

  page.on('pageerror', error => issues.push(error.message));
  page.on('console', entry => { if (entry.type() === 'error') issues.push(entry.text()); });
  try {
    await open('/');
    await page.waitForFunction(() => document.documentElement.dataset.motionReady === 'true');
    await page.waitForFunction(() => window.campaignEvents.some(event => event.event === 'animationend'));
    await pause(380);
    const entrance = await page.evaluate(() => window.campaignEvents.slice(0, 2));
    assert.deepEqual(entrance.map(event => event.event), ['animationstart', 'animationend']);
    await still('hero');
    results[name] = { entrance, ...await walkthrough({ page, context, pause, still, scroll, go, open }), consoleErrors: issues };
    assert.deepEqual(issues, []);
    const video = page.video();
    await context.close();
    await video.saveAs(`${output}/direction-${name}.webm`);
    await writeFile(`${output}/motion-evidence.json`, JSON.stringify(results, null, 2));
  } finally {
    await context.close();
  }
}

try {
  await capture('desktop', { width: 1440, height: 900 }, async ({ page, pause, still, scroll, go, open }) => {
    const crop = () => page.locator('.hero-art').evaluate(element => getComputedStyle(element).clipPath);
    const heroBefore = await crop();
    await scroll(350, 65);
    const heroDuring = await crop();
    assert.notEqual(heroBefore, heroDuring, 'Hero aperture did not respond to scroll');
    await still('campaign-handoff');
    await go('.manifesto-text', 230, 65);
    await still('manifesto');

    const bounds = await page.locator('.collection-optics-track').evaluate(track => {
      const stage = track.querySelector('.collection-optics');
      const top = parseFloat(getComputedStyle(stage).top);
      return { start: Math.round(scrollY + track.getBoundingClientRect().top - top), distance: track.clientHeight - stage.offsetHeight, top };
    });
    assert(bounds.distance >= 300 && bounds.distance <= 500);
    const stage = () => page.locator('.collection-optics').evaluate(element => ({
      y: Math.round(element.getBoundingClientRect().top),
      phase: element.parentElement.dataset.phase,
      aperture: getComputedStyle(element.querySelector('.optics-study-1 .optics-material')).clipPath,
      creamMask: getComputedStyle(element.querySelector('.optics-study-1 .optics-object')).clipPath,
      rose: Number(getComputedStyle(element.querySelector('.optics-rose')).opacity),
      meter: Number(element.querySelector('.optics-meter').style.getPropertyValue('--optics-progress')),
      notes: Array.from(element.querySelectorAll('.optics-note'), note => Math.round(
        (note.getBoundingClientRect().top - note.parentElement.getBoundingClientRect().top) / note.offsetHeight * 100,
      )),
    }));
    const target = async (progress, step) => {
      const offset = Math.round(bounds.start + bounds.distance * progress);
      for (let attempt = 0; attempt < 4; attempt++) {
        await scroll(offset, step);
        await pause(420);
        if (Math.abs(await page.evaluate(() => scrollY) - offset) <= 4) return;
      }
      throw new Error(`Wheel did not settle at stage progress ${progress}`);
    };
    await target(.02);
    assert(await page.locator('.optics-visual img').evaluateAll(images => images.every(img => img.complete && img.naturalWidth > 1)), 'Stage assets were not ready at the first stop');
    const serum = await stage();
    await still('stage-serum');
    const shop = page.getByRole('navigation', { name: 'LUMICLEAR stage products' });
    const serumLink = shop.getByRole('link', { name: 'View Target Serum, £26.00 GBP' });
    const creamLink = shop.getByRole('link', { name: 'View Radiance Cream, £36.00 GBP' });
    await serumLink.focus();
    await target(.53, 42);
    const transfer = await stage();
    await still('stage-transfer');
    await target(.98, 42);
    const cream = await stage();
    await still('stage-cream');
    assert(await serumLink.evaluate(link => link === document.activeElement), 'Scrub moved keyboard focus');
    assert.equal(await creamLink.getAttribute('href'), '/products/lumiclear-radiance-cream');
    await target(.53, 38);
    const reverse = await stage();
    await still('stage-reverse');
    await target(.02, 38);
    const restored = await stage();
    assert.deepEqual(serum.notes, [0, 100]);
    assert.deepEqual(cream.notes, [-100, 0]);
    assert.equal(serum.phase, 'treat');
    assert.equal(cream.phase, 'nourish');
    assert(serum.rose < transfer.rose && transfer.rose < cream.rose);
    assert(Math.abs(transfer.meter - reverse.meter) < .035 && restored.meter < .07, `Forward ${transfer.meter}, reverse ${reverse.meter}, restored ${restored.meter}`);
    assert(transfer.aperture !== serum.aperture && transfer.aperture !== cream.aperture);
    assert(Math.abs(transfer.y - bounds.top) < 3 && Math.abs(cream.y - bounds.top) < 3);

    await go('.formulation-plate', 145);
    await still('home-texture');
    await go('#ingredient-index', 130, 60);
    await still('home-index');
    await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Formulation', exact: true }).click();
    await page.waitForURL('**/formulation');
    const plate = page.locator('.ed-formulation-plate');
    await page.waitForFunction(() => document.querySelector('.ed-formulation-plate').style.clipPath);
    const atlasStart = await plate.evaluate(element => getComputedStyle(element).clipPath);
    await go('.atlas-figure', 150, 52);
    await still('atlas-aperture');
    await go('.atlas-reading-slip', 165, 52);
    await still('atlas-introduction');
    await go('.atlas-index-card', 116, 52);
    const atlasFinish = await plate.evaluate(element => getComputedStyle(element).clipPath);
    assert.notEqual(atlasStart, atlasFinish);
    await still('atlas-index');
    await page.getByRole('tab', { name: 'Hydration', exact: true }).focus();
    await page.keyboard.press('End');
    assert.equal(await page.getByRole('tab', { name: 'Botanical ingredients' }).getAttribute('aria-selected'), 'true');
    await pause(650);
    await still('atlas-botanicals');
    await page.getByRole('tab', { name: 'Nourishment and moisturisation' }).click();
    await pause(670);
    await still('atlas-nourishment');
    const indexScroll = await page.evaluate(() => scrollY);
    await page.getByRole('tabpanel').getByRole('link', { name: 'Read the chapter' }).click();
    await page.waitForURL(url => url.hash === '#nourishment');
    await pause(750);
    await still('atlas-chapter');
    await page.goBack();
    assert(!new URL(page.url()).hash);
    await page.waitForFunction(y => Math.abs(scrollY - y) < 12, indexScroll);
    await open('/our-house');
    await pause(850);
    await still('house');
    await go('.house-location:first-child', 106);
    await still('house-london');
    await go('.house-location:last-child', 106, 95);
    await still('house-seoul');
    await go('.house-signoff', 155);
    await still('house-signoff');
    await open('/the-ritual');
    await go('.ed-ritual-study');
    await still('ritual-treat');
    await page.getByRole('tab', { name: 'Treat', exact: true }).focus();
    await page.keyboard.press('ArrowRight');
    await pause(720);
    await still('ritual');
    await go('#morning-ritual');
    await pause();
    await open('/journal');
    await go('.ed-journal-feature', 112, 65);
    await still('journal-feature');
    await go('.journal-reading-room', 132);
    await still('journal-reading-room');
    await open('/collections');
    await page.getByRole('link', { name: 'Explore LUMICLEAR' }).click();
    await page.waitForURL('**/collections/lumiclear');
    await pause(870);
    await still('collection');
    await go('.commerce-card-grid', 105, 75);
    await still('collection-products');
    for (const [product, price] of [['target-serum', '£26.00 GBP'], ['radiance-cream', '£36.00 GBP']]) {
      await open(`/products/lumiclear-${product}`);
      await pause(770);
      assert(await page.getByText(price, { exact: true }).isVisible());
      await page.getByRole('button', { name: 'Show studio view' }).click();
      await pause(750);
      await page.getByRole('button', { name: 'Next gallery image' }).click();
      await pause(740);
      await page.getByRole('button', { name: 'Increase quantity' }).click();
      await still(`product-${product}`);
    }
    return { heroBefore, heroDuring, stage: { bounds, serum, transfer, cream, reverse, restored }, atlasStart, atlasFinish };
  });

  await capture('phone', { width: 390, height: 844 }, async ({ page, context, pause, still, go, open }) => {
    const cdp = await context.newCDPSession(page);
    async function swipe(x, y, dx, dy) {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y, id: 1 }] });
      for (let move = 1; move <= 9; move++) {
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + dx * move / 9, y: y + dy * move / 9, id: 1 }] });
        await pause(26);
      }
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await pause(440);
    }
    await swipe(180, 670, 0, -415);
    const touchDistance = await page.evaluate(() => scrollY);
    assert(touchDistance > 200);
    await page.getByRole('button', { name: 'Menu', exact: true }).tap();
    await page.getByRole('button', { name: 'Formulation', exact: true }).tap();
    await pause(750);
    await still('menu');
    await page.getByRole('link', { name: 'Explore Formulation', exact: true }).tap();
    await page.waitForURL('**/formulation');
    await go('.atlas-index-card');
    await still('atlas-index');
    await page.getByRole('tab', { name: 'Botanical ingredients' }).tap();
    await go('.atlas-selector-panels', 100);
    await still('atlas-botanicals');
    await page.goBack();
    await go('.serum-chapter', 88);
    await still('serum-chapter');
    await go('.cream-chapter', 88);
    await still('cream-chapter');
    await page.getByRole('button', { name: 'Discover Radiance Cream', exact: true }).tap();
    await pause(650);
    const dialog = page.getByRole('dialog');
    await dialog.getByRole('link', { name: 'View full product' }).tap();
    await page.waitForURL('**/products/lumiclear-radiance-cream');
    await page.waitForLoadState('networkidle');
    const studio = page.getByRole('button', { name: 'Show studio view' });
    await studio.tap();
    assert.equal(await studio.getAttribute('aria-pressed'), 'true');
    const gallery = page.locator('.commerce-gallery-images');
    await gallery.scrollIntoViewIfNeeded();
    await pause(620);
    const box = await gallery.boundingBox();
    await swipe(box.x + box.width * .76, box.y + box.height * .48, -box.width * .47, 0);
    assert.equal(await page.getByRole('button', { name: 'Show texture study' }).getAttribute('aria-pressed'), 'true');
    await still('product-gallery');
    await open('/the-ritual');
    await go('.ed-ritual-study', 92);
    await page.getByRole('tab', { name: 'Nourish', exact: true }).tap();
    await pause(730);
    await still('ritual');
    return { touchDistance, gallerySwipe: 'Texture study' };
  });
} finally {
  await browser.close();
}
