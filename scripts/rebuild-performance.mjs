import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const stage = process.argv[2] === 'before' ? 'before' : 'after';
const folder = process.env.PERFORMANCE_OUTPUT || `docs/implementation/evidence/${stage}`;
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:3000';
const route = process.env.PERFORMANCE_ROUTE || '/';
const startSelector = process.env.PERFORMANCE_START_SELECTOR;
const distance = Number(process.env.PERFORMANCE_DISTANCE || 2640);
const browser = await chromium.launch({channel:'chrome',headless:true});
const runs=[];
try {
 for(const scenario of [{name:'desktop',width:1440,height:1000,dpr:1,cpu:1},{name:'throttled-phone',width:390,height:844,dpr:2,cpu:4}]){
  const context=await browser.newContext({viewport:{width:scenario.width,height:scenario.height},deviceScaleFactor:scenario.dpr});
  const page=await context.newPage();const cdp=await context.newCDPSession(page);
  await cdp.send('Performance.enable');
  if(scenario.cpu>1){await cdp.send('Emulation.setCPUThrottlingRate',{rate:scenario.cpu});await cdp.send('Network.enable');await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200000,uploadThroughput:93750})}
  await page.addInitScript(()=>{window.__measure={lcp:0,cls:0,longTasks:[]};new PerformanceObserver(l=>{for(const e of l.getEntries()){window.__measure.lcp=Math.round(e.startTime);window.__measure.lcpImage=e.element?.currentSrc}}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)window.__measure.cls+=e.value}).observe({type:'layout-shift',buffered:true});new PerformanceObserver(l=>{window.__measure.longTasks.push(...l.getEntries().map(e=>Math.round(e.duration)))}).observe({type:'longtask',buffered:true})});
  await page.goto(new URL(route, base).href,{waitUntil:'networkidle',timeout:60000});await page.waitForTimeout(1700);
  const load=await page.evaluate(()=>({...window.__measure,resourceBytes:performance.getEntriesByType('resource').reduce((s,e)=>s+e.transferSize,0),height:document.documentElement.scrollHeight}));
  const origin = startSelector ? await page.locator(startSelector).evaluate(element => Math.max(0, Math.round(scrollY + element.getBoundingClientRect().top - 95))) : 0;
  if (origin) {
   await page.evaluate(top => scrollTo({ top, behavior: 'instant' }), origin);
   await page.waitForTimeout(550);
  }
  const metrics=async()=>Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map(x=>[x.name,x.value]));const start=await metrics();
  const frames=await page.evaluate(({ origin, distance })=>new Promise(resolve=>{const ts=[];let start,prev;function tick(t){start??=t;if(prev!=null)ts.push(t-prev);prev=t;scrollTo({top:origin+Math.min((t-start)*distance/2400,distance),behavior:'instant'});if(t-start<2400)requestAnimationFrame(tick);else{ts.sort((a,b)=>a-b);resolve({count:ts.length,median:ts[Math.floor(ts.length*.5)],p95:ts[Math.floor(ts.length*.95)],over50:ts.filter(x=>x>50).length})}}requestAnimationFrame(tick)}), { origin, distance });
  const end=await metrics();const delta=Object.fromEntries(['LayoutCount','RecalcStyleCount','LayoutDuration','ScriptDuration','TaskDuration'].map(x=>[x,+(end[x]-start[x]).toFixed(4)]));
  runs.push({scenario,load,origin,frames,delta});console.log(JSON.stringify({name:scenario.name,lcp:load.lcp,cls:load.cls,origin,frames,delta}));await context.close();
 }
 await mkdir(folder,{recursive:true});await writeFile(`${folder}/performance.json`,JSON.stringify({stage,route,browser:browser.version(),timestamp:new Date().toISOString(),protocol:`Cold browser context, local production server. ${distance} CSS px over 2.4s rAF scroll, starting at ${startSelector || 'the top'}. Phone: 4x CPU, 1.6 Mbps down, 0.75 Mbps up, 150ms. Not field or physical-device data.`,runs},null,2));
} finally {await browser.close()}
