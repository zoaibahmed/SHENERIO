import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const base = process.env.PREVIEW_URL || 'http://127.0.0.1:3000';
const output = process.env.QA_OUTPUT || 'docs/implementation/evidence/site-scroll/after';
const routes = ['/', '/our-house', '/formulation', '/the-ritual', '/journal', '/collections/lumiclear', '/products/lumiclear-target-serum', '/faq'];
const browser = await chromium.launch({ channel: 'chrome' });
const results = [];

try {
  for (const route of routes) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(base + route, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(600);
    const mode = await page.evaluate(() => document.documentElement.dataset.scrollEngine || (document.documentElement.classList.contains('lenis') ? 'smooth' : 'native'));
    await page.mouse.move(640, 665);
    for (const [name, pulses, amount, interval] of [['wheel', 6, 120, 63], ['small-delta', 12, 22, 21]]) {
      await page.waitForFunction(() => !document.documentElement.classList.contains('lenis-smooth'));
      await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
      await page.waitForFunction(() => scrollY === 0);
      await page.waitForTimeout(180);
      await page.evaluate(() => {
        window.wheelSample = new Promise(resolve => {
          const frames = [];
          let first;
          let wheelAt;
          function onWheel() { wheelAt ??= performance.now(); }
          window.addEventListener('wheel', onWheel, { capture: true, passive: true, once: true });
          function frame(time) {
            first ??= time;
            frames.push({ time, y: scrollY });
            if (time - first < 1120) requestAnimationFrame(frame);
            else {
              window.removeEventListener('wheel', onWheel, true);
              resolve({ frames, wheelAt });
            }
          }
          requestAnimationFrame(frame);
        });
      });
      await page.waitForTimeout(55);
      for (let pulse = 0; pulse < pulses; pulse++) {
        await page.mouse.wheel(0, amount);
        await page.waitForTimeout(interval);
      }
      const sample = await page.evaluate(() => window.wheelSample);
      const { frames, wheelAt } = sample;
      const increments = frames.slice(1).map((frame, i) => ({
        time: frame.time,
        dt: frame.time - frames[i].time,
        move: frame.y - frames[i].y,
      })).filter(frame => frame.time >= wheelAt);
      const movement = increments.filter(frame => frame.move !== 0);
      const intervals = increments.map(frame => frame.dt).sort((a, b) => a - b);
      const distance = frames.at(-1).y - frames[0].y;
      if (!movement.length || Math.abs(distance - pulses * amount) > 12) {
        throw new Error(`${route} ${name}: expected ${pulses * amount}px of input, sampled ${distance}px`);
      }
      const metric = {
        route, mode, input: name,
        distance,
        movementFrames: movement.length,
        peakStep: Math.max(0, ...movement.map(frame => Math.abs(frame.move))),
        responseMs: +(movement[0].time - wheelAt).toFixed(1),
        p95Ms: +intervals[Math.floor(intervals.length * .95)].toFixed(1),
        intervalsOver50Ms: intervals.filter(time => time > 50).length,
      };
      results.push(metric);
      console.log(JSON.stringify(metric));
    }
    await page.close();
  }
  await mkdir(output, { recursive: true });
  await writeFile(`${output}/wheel-profile.json`, JSON.stringify({
    browser: browser.version(), protocol: '1440 × 900, real Chrome wheel events. Six 120 px pulses 63 ms apart and twelve 22 px pulses 21 ms apart. Small-delta input approximates a trackpad. Movement is sampled at requestAnimationFrame.',
    results,
  }, null, 2));
} finally {
  await browser.close();
}
