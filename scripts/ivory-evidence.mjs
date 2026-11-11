import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const base = process.env.PREVIEW_URL || 'http://127.0.0.1:3000';
const output = process.env.QA_OUTPUT || 'docs/implementation/evidence/ivory/motion';
const browser = await chromium.launch({ channel: 'chrome' });
const results = {};
await mkdir(output, { recursive: true });

async function record(name, viewport, run) {
  const phone = name === 'phone';
  const context = await browser.newContext({
    viewport,
    isMobile: phone,
    hasTouch: phone,
    recordVideo: { dir: 'tmp/ivory-video', size: viewport },
  });
  const page = await context.newPage();
  const issues = [];
  page.on('pageerror', error => issues.push(error.message));
  page.on('console', entry => { if (entry.type() === 'error') issues.push(entry.text()); });
  const pause = (ms = 520) => page.waitForTimeout(ms);
  const still = scene => page.screenshot({ path: `${output}/${name}-${scene}.png` });
  const go = async (selector, offset = 86) => {
    const target = await page.locator(selector).evaluate((element, top) => (
      Math.max(0, Math.min(document.documentElement.scrollHeight - innerHeight, scrollY + element.getBoundingClientRect().top - top))
    ), offset);
    if (phone) {
      await page.evaluate(top => scrollTo({ top, behavior: 'smooth' }), target);
      await pause(710);
      return;
    }
    await page.mouse.move(650, 710);
    let remaining = target - await page.evaluate(() => scrollY);
    for (let attempt = 0; Math.abs(remaining) > 5 && attempt < 27; attempt++) {
      await page.mouse.wheel(0, Math.sign(remaining) * Math.min(570, Math.abs(remaining)));
      await pause(350);
      remaining = target - await page.evaluate(() => scrollY);
    }
    assert(Math.abs(remaining) < 24, `Wheel input stopped ${Math.round(remaining)}px from ${selector}`);
    await pause();
  };

  try {
    await page.goto(base, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.documentElement.dataset.motionReady === 'true');
    await pause(1400);
    await still('hero');
    results[name] = { ...await run({ page, context, pause, still, go }), consoleErrors: issues };
    assert.deepEqual(issues, []);
    const video = page.video();
    await context.close();
    await video.saveAs(`${output}/ivory-${name}.webm`);
  } finally {
    await context.close();
  }
}

try {
  await record('desktop', { width: 1440, height: 900 }, async ({ page, pause, still, go }) => {
    await page.getByRole('button', { name: 'The collection', exact: true }).click();
    await pause();
    await still('navigation');
    await page.keyboard.press('Escape');
    await go('#house');
    await still('manifesto');
    await go('#collection');
    const stage = '.collection-optics';
    const readStage = () => page.locator(stage).evaluate(element => Array.from(
      element.querySelectorAll('.optics-study, .optics-veil'),
      node => Number(getComputedStyle(node).opacity),
    ));
    await go(stage, 391);
    const initial = await readStage();
    await still('serum-stage');
    await go(stage, 245);
    const transfer = await readStage();
    await still('product-transfer');
    await go(stage, 105);
    const final = await readStage();
    await still('cream-stage');
    assert(initial[0] > .97 && initial[1] < .03, `Serum start ${initial}`);
    assert(transfer[0] > .04 && transfer[1] > .04 && transfer[2] > .15, `Transfer ${transfer}`);
    assert(final[0] < .03 && final[1] > .97, `Cream end ${final}`);

    await go('.serum-chapter', 130);
    await still('product-chapters');
    await page.getByRole('button', { name: 'Discover Target Serum', exact: true }).click();
    const dialog = page.getByRole('dialog');
    await dialog.getByRole('button', { name: 'Show packaging detail' }).click();
    await pause();
    await still('quick-view');
    await page.keyboard.press('Escape');
    await go('#formulation');
    await still('formulation');
    await go('#ingredient-index');
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

    await page.goto(`${base}/products/lumiclear-target-serum`);
    await page.getByRole('button', { name: 'Show studio view' }).click();
    await pause(700);
    await still('pdp-gallery');
    await go('.serum-material');
    await still('serum-editorial');
    await page.goto(`${base}/products/lumiclear-radiance-cream`);
    await go('.cream-material');
    await still('cream-editorial');
    return { stageOpacities: { initial, transfer, final } };
  });

  await record('phone', { width: 390, height: 844 }, async ({ page, context, pause, still, go }) => {
    await page.getByRole('button', { name: 'Menu', exact: true }).tap();
    await page.getByRole('button', { name: 'Formulation', exact: true }).tap();
    await pause();
    await still('navigation');
    await page.getByRole('link', { name: 'Explore Formulation', exact: true }).tap();
    await page.waitForURL('**/formulation');
    await pause();
    await still('atlas');
    await page.goBack();
    await page.getByRole('link', { name: 'Discover the collection', exact: true }).waitFor();
    await pause();
    const cdp = await context.newCDPSession(page);
    const before = await page.evaluate(() => scrollY);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 180, y: 670, id: 1 }] });
    for (let move = 1; move <= 9; move++) {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 180, y: 670 - move * 48, id: 1 }] });
      await pause(25);
    }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await pause();
    const touchDistance = await page.evaluate(start => scrollY - start, before);
    assert(touchDistance > 150, `Touch input scrolled only ${touchDistance}px`);
    await go('#collection');
    await go('.serum-chapter', 142);
    await go('.cream-chapter', 95);
    await still('cream-chapter');
    await page.getByRole('button', { name: 'Discover Radiance Cream', exact: true }).tap();
    const dialog = page.getByRole('dialog');
    await pause();
    await still('quick-view');
    await dialog.getByRole('link', { name: 'View full product' }).tap();
    await page.waitForURL('**/products/lumiclear-radiance-cream');
    await page.getByRole('button', { name: 'Show studio view' }).tap();
    await page.getByRole('button', { name: 'Next gallery image' }).tap();
    await pause();
    await still('pdp-gallery');
    await page.getByRole('button', { name: 'Increase quantity' }).tap();
    await page.goto(`${base}/the-ritual`);
    await page.getByRole('tab', { name: 'Nourish', exact: true }).tap();
    await pause();
    await still('ritual');
    return { touchDistance };
  });
  await writeFile(`${output}/motion-evidence.json`, JSON.stringify(results, null, 2));
} finally {
  await browser.close();
}
