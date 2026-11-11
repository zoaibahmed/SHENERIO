import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
const browser = await chromium.launch({ channel: 'chrome' });
const runs = [];
try {
  for (const [name, width, height] of [['desktop', 1440, 900], ['phone', 390, 844]]) {
    const context = await browser.newContext({ viewport: { width, height }, isMobile: name === 'phone', hasTouch: name === 'phone' });
    const page = await context.newPage();
    await page.addInitScript(() => {
      window.openingSample = { cls: 0, lcp: 0, frames: [], tasks: [] };
      new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.openingSample.cls += entry.value; }).observe({ type: 'layout-shift', buffered: true });
      new PerformanceObserver(list => { for (const entry of list.getEntries()) window.openingSample.lcp = entry.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver(list => { window.openingSample.tasks.push(...list.getEntries().map(entry => ({ at: entry.startTime, duration: entry.duration }))); }).observe({ type: 'longtask', buffered: true });
      let previous;
      function frame(time) {
        if (document.documentElement.dataset.homeIntro === 'active') {
          if (previous) window.openingSample.frames.push(time - previous);
          previous = time;
        } else previous = undefined;
        if (time < 7000) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    });
    await page.goto('http://127.0.0.1:3000', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.documentElement.dataset.homeIntro === 'done');
    await page.waitForTimeout(400);
    const value = await page.evaluate(() => {
      const frames = window.openingSample.frames.sort((a, b) => a - b);
      const marks = performance.getEntriesByType('mark').filter(entry => entry.name.startsWith('shenerio:'));
      const time = name => marks.find(entry => entry.name === name)?.startTime;
      const start = time('shenerio:intro-start');
      const end = time('shenerio:intro-end');
      return {
        reason: document.documentElement.dataset.homeIntroReason,
        activeMs: end - start,
        firstStyledEntryMs: Number(document.documentElement.dataset.homeIntroAt),
        endMs: end,
        lcpMs: window.openingSample.lcp,
        cls: window.openingSample.cls,
        frames: { count: frames.length, median: frames[Math.floor(frames.length * .5)], p95: frames[Math.floor(frames.length * .95)], over50: frames.filter(value => value > 50).length },
        startupLongTasks: window.openingSample.tasks.filter(task => task.at < start),
        activeLongTasks: window.openingSample.tasks.filter(task => task.at >= start && task.at < end),
        transferredBytes: performance.getEntriesByType('resource').reduce((bytes, entry) => bytes + entry.transferSize, 0),
      };
    });
    runs.push({ name, width, height, ...value });
    await page.reload({ waitUntil: 'networkidle' });
    runs.push({ name: name + '-refresh', introReplayed: await page.evaluate(() => performance.getEntriesByName('shenerio:intro-start').length > 0) });
    await context.close();
  }
} finally {
  await browser.close();
  const report = { protocol: 'Fresh Chrome contexts, local production server, no video or screenshots during sampling. rAF intervals while intro timeline is active; startup tasks reported separately. Emulated phone viewport/touch, not physical hardware or field data.', runs };
  await writeFile('docs/implementation/evidence/opening-editorial/after/opening-performance.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
}
