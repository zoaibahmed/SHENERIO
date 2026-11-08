import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';

// A repeatable local lab sample, not field Core Web Vitals or real-device certification.
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const page = await context.newPage();
const cdp = await context.newCDPSession(page);
await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
await cdp.send('Network.enable');
await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1600000 / 8, uploadThroughput: 750000 / 8 });
await page.addInitScript(() => {
  window.__lab = { lcp: null, cls: 0 };
  new PerformanceObserver(list => { for (const entry of list.getEntries()) { window.__lab.lcp = Math.round(entry.startTime); window.__lab.lcpElement = entry.element?.tagName; window.__lab.lcpLoadTime = entry.loadTime; } }).observe({ type: 'largest-contentful-paint', buffered: true });
  new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__lab.cls += entry.value; }).observe({ type: 'layout-shift', buffered: true });
});
await page.goto(process.env.PREVIEW_URL || 'http://127.0.0.1:3000', { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(1800);
const initial = await page.evaluate(() => ({ ...window.__lab, resources: performance.getEntriesByType('resource').map(r => ({ name: r.name.replace(location.origin, ''), type: r.initiatorType, transferBytes: r.transferSize, duration: Math.round(r.duration) })) }));
const frames = await page.evaluate(() => new Promise(resolve => {
  const times = []; let start, previous;
  function frame(t) {
    start ??= t;
    if (previous) times.push(t - previous);
    previous = t;
    window.scrollTo({ top: Math.min((t - start) * 1.4, document.body.scrollHeight - innerHeight), behavior: 'instant' });
    if (t - start < 2400) requestAnimationFrame(frame);
    else { times.sort((a,b) => a-b); resolve({ count: times.length, medianMs: times[Math.floor(times.length*.5)], p95Ms: times[Math.floor(times.length*.95)], over50Ms: times.filter(x=>x>50).length }); }
  }
  requestAnimationFrame(frame);
}));
const result = { testedAt: new Date().toISOString(), conditions: 'Local production server; fresh browser context; 390×844 @2x; simulated 4x CPU slowdown; 1.6 Mbps down / 0.75 Mbps up / 150ms latency. Server image cache may be warm. Single lab sample.', browser: browser.version(), initial, scrollFrameSample: frames, limitations: 'Not physical mobile hardware, real network, INP field measurement, Safari testing or proof of performance superiority over reference recordings.' };
await writeFile('docs/design-audit/prototype-evidence/performance-lab.json', JSON.stringify(result, null, 2));
console.log(JSON.stringify({ lcpMs: initial.lcp, cls: initial.cls, transferredBytes: initial.resources.reduce((sum,r)=>sum+r.transferBytes,0), scrollFrames: frames }, null, 2));
await browser.close();
