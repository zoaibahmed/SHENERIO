import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const output = 'docs/implementation/evidence/home-story/after';
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:3000';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome' });
const results = [];

try {
  for (const [name, width, height] of [['desktop', 1440, 900], ['phone', 390, 844]]) {
    const phone = name === 'phone';
    const context = await browser.newContext({ viewport: { width, height }, isMobile: phone, hasTouch: phone, recordVideo: { dir: 'tmp/home-story-video', size: { width, height } } });
    const page = await context.newPage();
    const issues = [];
    page.on('pageerror', error => issues.push(error.message));
    page.on('console', entry => { if (entry.type() === 'error') issues.push(entry.text()); });
    const pause = (time = 900) => page.waitForTimeout(time);
    const still = label => page.screenshot({ path: `${output}/${name}-${label}.jpg`, quality: 90 });
    const position = (selector, offset = 102) => page.locator(selector).first().evaluate((element, top) => scrollY + element.getBoundingClientRect().top - top, offset);
    const scroll = async (requested, step = 140) => {
      const destination = await page.evaluate(target => Math.max(0, Math.min(target, document.documentElement.scrollHeight - innerHeight)), requested);
      if (phone) {
        // Native browser scrolling; touch gestures are tested separately by home-story-qa.
        await page.evaluate(target => scrollTo({ top: target, behavior: 'smooth' }), destination);
        await pause(1050);
        return;
      }
      await page.mouse.move(600, 740);
      for (let attempt = 0; attempt < 150; attempt++) {
        const remaining = destination - await page.evaluate(() => scrollY);
        if (Math.abs(remaining) < 4) break;
        await page.mouse.wheel(0, Math.sign(remaining) * Math.min(step, Math.abs(remaining)));
        await pause(Math.abs(remaining) <= step ? 400 : 85);
      }
      assert(Math.abs(destination - await page.evaluate(() => scrollY)) < 18);
    };
    const go = async (selector, offset, step) => scroll(await position(selector, offset), step);
    const phase = async (selector, progress) => {
      const top = await page.locator(selector).evaluate((track, value) => {
        const stage = track.firstElementChild;
        return scrollY + track.getBoundingClientRect().top - parseFloat(getComputedStyle(stage).top) + (track.clientHeight - stage.clientHeight) * value;
      }, progress);
      await scroll(top, 38);
      await pause(950);
      if (selector === '.collection-optics-track' && (progress === 0 || progress === 1)) {
        assert(await page.locator(`.optics-note-${progress}`).evaluate(note => {
          const clip = note.parentElement.getBoundingClientRect();
          return [...note.querySelectorAll('h3, .optics-price')].every(element => {
            const bounds = element.getBoundingClientRect();
            return bounds.top >= clip.top - 1 && bounds.bottom <= clip.bottom + 1;
          });
        }), 'Selected product caption is outside its mask');
      }
    };

    await page.goto(base, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => document.documentElement.dataset.motionReady === 'true');
    await pause(1800);
    await still('hero');
    const menu = page.getByRole('button', { name: phone ? 'Menu' : 'The collection', exact: true });
    await menu.click(); await pause(850);
    await page.getByRole('button', { name: 'Preview LUMICLEAR TARGET SERUM', exact: true }).click();
    await page.getByRole('dialog').waitFor(); await pause(900);
    await page.getByRole('button', { name: 'Show packaging detail', exact: true }).click(); await pause(850);
    await page.keyboard.press('Escape'); await pause(350); await page.keyboard.press('Escape'); await pause(400);
    await page.locator('.hero-description').click();
    await go('#house'); await pause(1000);
    await go('.manifesto-layout'); await pause(1100);
    await go('#collection'); await pause(800);
    if (!phone) {
      await phase('.collection-optics-track', 0); await still('collection-treat');
      await phase('.collection-optics-track', .5); await still('collection-transition');
      await phase('.collection-optics-track', 1); await still('collection-nourish');
      await phase('.collection-optics-track', 0);
      await phase('.collection-optics-track', 1);
    } else {
      await go('#target-serum'); await pause(1000); await still('collection-treat');
      await go('#radiance-cream'); await pause(1100); await still('collection-nourish');
    }
    await go('#formulation', 165, 110); await pause(900); await still('collection-to-formulation');
    await go('.formulation-index-frame'); await pause(700);
    await page.getByRole('tab', { name: 'Niacinamide', exact: true }).click(); await pause(900);
    await go('#origins'); await pause(700);
    await go('.origin-diptych'); await pause(1400);
    await go('#everyday'); await pause(1300);
    await go('#ritual'); await pause(1000);
    if (!phone) {
      await phase('.home-ritual-track', 0); await still('ritual-treat');
      await phase('.home-ritual-track', .5); await still('ritual-transition');
      await phase('.home-ritual-track', 1); await still('ritual-nourish');
      await phase('.home-ritual-track', 0);
      await phase('.home-ritual-track', 1);
    } else {
      await go('#ritual-step-1'); await pause(1400); await still('ritual-treat');
      await go('#ritual-step-2'); await pause(1500); await still('ritual-nourish');
    }
    await go('.home-ritual-ending', 390); await pause(1000); await still('ritual-ending');
    await go('#journal'); await pause(1000);
    await go('.journal-feature'); await pause(1200);
    await go('#newsletter'); await pause(1000);
    await go('.closing'); await pause(1500);
    await go('#footer'); await pause(1100);
    await still('footer');
    assert.deepEqual(issues, []);
    results.push({ name, input: phone ? 'Native browser smooth-scroll traversal; touch gesture verified in separate QA' : 'Real wheel events through the complete homepage, including forward and reverse scenes', viewport: { width, height }, errors: issues });
    const video = page.video();
    await context.close();
    await video.saveAs(`${output}/homepage-${name}.webm`);

    const layout = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce', isMobile: phone, hasTouch: phone });
    await layout.goto(base, { waitUntil: 'networkidle' });
    await layout.evaluate(async () => {
      await document.fonts.ready;
      const images = [...document.images].filter(image => image.getClientRects().length);
      images.forEach(image => { image.loading = 'eager'; });
      await Promise.all(images.map(image => image.decode().catch(() => {})));
    });
    await layout.screenshot({ path: `${output}/${name}-full-page.jpg`, fullPage: true, quality: 88 });
    await layout.close();
    console.log(`${name}: continuous capture saved`);
  }
} finally {
  await browser.close();
  await writeFile(`${output}/recording-notes.json`, JSON.stringify(results, null, 2));
}
