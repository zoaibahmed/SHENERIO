import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const url = process.env.PREVIEW_URL || 'http://127.0.0.1:3000';
const output = 'docs/implementation/evidence/flagship/after';
const browser = await chromium.launch({ channel: 'chrome' });
const evidence = {};
await mkdir(output, { recursive: true });

async function captureExperience(name, viewport, run) {
  const isPhone = name === 'phone';
  const context = await browser.newContext({
    viewport,
    isMobile: isPhone,
    hasTouch: isPhone,
    recordVideo: { dir: 'tmp/flagship-video', size: viewport },
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', entry => { if (entry.type() === 'error') errors.push(entry.text()); });
  const pause = (ms = 550) => page.waitForTimeout(ms);
  const still = scene => page.screenshot({ path: `${output}/${name}-${scene}.png` });
  const position = (selector, offset) => page.locator(selector).evaluate((element, top) => (
    Math.max(0, Math.min(document.documentElement.scrollHeight - innerHeight, scrollY + element.getBoundingClientRect().top - top))
  ), offset);
  const go = async (selector, offset = 94) => {
    const target = await position(selector, offset);
    if (isPhone) {
      await page.evaluate(top => scrollTo({ top, behavior: 'smooth' }), target);
      await pause(1050);
      return;
    }

    await page.mouse.move(680, 730);
    let remaining = target - await page.evaluate(() => scrollY);
    for (let attempts = 0; Math.abs(remaining) > 6 && attempts < 24; attempts++) {
      const distance = Math.sign(remaining) * Math.min(540, Math.abs(remaining));
      await page.mouse.wheel(0, distance);
      await pause(410);
      remaining = target - await page.evaluate(() => scrollY);
    }
    assert(Math.abs(remaining) < 25, `Wheel navigation stalled ${Math.round(remaining)}px from ${selector}`);
    await pause();
  };

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.documentElement.dataset.motionReady === 'true');
    await pause(1650);
    await still('hero');
    evidence[name] = await run({ page, pause, still, go });
    assert.deepEqual(errors, []);
    await pause(650);
    const video = page.video();
    await context.close();
    await video.saveAs(`${output}/flagship-${name}.webm`);
  } finally {
    await context.close();
  }
}

try {
  await captureExperience('desktop', { width: 1440, height: 900 }, async ({ page, pause, still, go }) => {
    await page.getByRole('button', { name: 'The collection', exact: true }).click();
    await pause();
    await still('menu');
    await page.getByRole('button', { name: 'Close navigation' }).click();
    await go('#house');
    await still('house');
    await go('#collection');
    await still('collection');
    await go('.collection-sequence');
    const serum = page.locator('.optics-study-0');
    const cream = page.locator('.optics-study-1');
    const opacity = locator => locator.evaluate(el => Number(getComputedStyle(el).opacity));
    const initial = [await opacity(serum), await opacity(cream)];
    assert(initial[0] > .97 && initial[1] < .03, `Unexpected serum state: ${initial}`);
    await still('serum');
    await go('.cream-chapter', 510);
    const middle = [await opacity(serum), await opacity(cream)];
    assert(middle.every(value => value > .02 && value < .98), `Expected both objects during transfer: ${middle}`);
    await still('transfer');
    await go('.cream-chapter');
    const end = [await opacity(serum), await opacity(cream)];
    assert(end[0] < .03 && end[1] > .97, `Unexpected cream state: ${end}`);
    await still('cream');
    await page.getByRole('button', { name: 'Discover Radiance Cream', exact: true }).click();
    const dialog = page.getByRole('dialog');
    await dialog.waitFor();
    await pause();
    await dialog.getByRole('button', { name: 'Show packaging detail' }).click();
    await pause(730);
    await still('gallery');
    await page.keyboard.press('Escape');
    await go('#formulation');
    await still('formulation');
    await page.getByRole('link', { name: 'Explore the ingredients' }).click();
    await pause(1050);
    await page.getByRole('tab', { name: 'Squalane', exact: true }).click();
    await pause();
    await still('ingredients');
    await go('#origins');
    await go('#everyday');
    await go('#ritual');
    await go('#journal');
    await go('#newsletter');
    await go('.closing');
    await still('closing');
    return { stageOpacities: { initial, middle, end }, consoleErrors: [] };
  });

  await captureExperience('phone', { width: 390, height: 844 }, async ({ page, pause, still, go }) => {
    await page.getByRole('button', { name: 'Menu', exact: true }).tap();
    await pause();
    await page.getByRole('button', { name: 'Formulation', exact: true }).tap();
    await pause();
    await still('menu');
    const formulation = page.getByRole('link', { name: 'Explore Formulation', exact: true });
    await formulation.tap();
    await pause(1050);
    assert.equal(new URL(page.url()).pathname, '/formulation');
    await page.goBack();
    await go('#formulation');
    await still('formulation');
    await go('#collection');
    await still('collection');
    await go('.serum-chapter');
    await still('serum');
    await go('.cream-chapter');
    await still('cream');
    await page.getByRole('button', { name: 'Discover Radiance Cream', exact: true }).tap();
    const dialog = page.getByRole('dialog');
    await dialog.waitFor();
    await pause();
    await still('gallery');
    return { sectionLink: '/formulation', consoleErrors: [] };
  });
  await writeFile(`${output}/motion-evidence.json`, JSON.stringify(evidence, null, 2));
} finally {
  await browser.close();
}
