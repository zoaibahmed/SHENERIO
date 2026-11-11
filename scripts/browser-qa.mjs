import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const out=process.env.QA_OUTPUT || 'docs/implementation/evidence/after';
const base=process.env.PREVIEW_URL || 'http://127.0.0.1:3000';
const browser=await chromium.launch({channel:'chrome',headless:true});
const report={testedAt:new Date().toISOString(),browser:browser.version(),runs:[],errors:[]};
const check=(value,message)=>{if(!value)throw new Error(message)};
const chapters=['house','collection','formulation','origins','everyday','ritual','journal','newsletter','footer'];
await mkdir(out,{recursive:true});
const selected=process.env.QA_SCENARIOS?.split(',');
if(selected){const previous=JSON.parse(await readFile(`${out}/browser-qa.json`,'utf8'));report.runs=previous.runs.filter(run=>!selected.includes(run.name))}

try {
 for(const [name,width,height,reduced] of [['desktop',1440,1000,false],['compact',1024,768,false],['tablet',768,1024,false],['phone',390,844,false],['narrow',320,740,false],['reduced',390,844,true]]){
  if(selected&&!selected.includes(name))continue;
  console.log(`Checking ${name}`);
  const context=await browser.newContext({viewport:{width,height},reducedMotion:reduced?'reduce':'no-preference',hasTouch:width<768,isMobile:width<768});
  const page=await context.newPage();page.setDefaultTimeout(15000);
  page.on('pageerror',e=>report.errors.push(`${name} page: ${e.message}`));
  page.on('console',m=>{if(m.type()==='error')report.errors.push(`${name} console: ${m.text()}`)});
  page.on('response',r=>{if(r.status()>=400)report.errors.push(`${name} ${r.status()}: ${r.url()}`)});
  await page.addInitScript(()=>{window.__layoutShift=0;new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)window.__layoutShift+=e.value}).observe({type:'layout-shift',buffered:true})});
  const response=await page.goto(base,{waitUntil:'networkidle',timeout:60000});
  check(response.ok()&&(await response.headerValue('x-robots-tag'))?.includes('noindex'),'Preview status missing');
  await page.waitForFunction(()=>document.documentElement.dataset.motionReady==='true');await page.waitForTimeout(1700);
  const campaignAnimation=await page.locator('.hero-art picture').evaluate(el=>getComputedStyle(el).animationName);
  check(campaignAnimation==='none','A duplicate CSS hero entrance is active');
  check(await page.locator('h1').textContent()==='THE ART OF ELEVATED SKINCARE.','Wrong hero headline');
  check(await page.locator('h1').count()===1,'Expected a single H1');
  check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${name} horizontal overflow`);
  for(const chapter of chapters)check(await page.locator(`#${chapter}`).count()===1,`Missing ${chapter}`);
  const cls=await page.evaluate(()=>window.__layoutShift);
  await page.screenshot({path:`${out}/${name}-hero.png`});
  const toggle=page.getByRole('button',{name:width<768?'Menu':'The collection',exact:true});
  await toggle.click();await page.waitForTimeout(550);check(await toggle.getAttribute('aria-expanded')==='true','Menu not open');
  if(name==='desktop'||name==='phone')await page.screenshot({path:`${out}/${name}-menu.png`});
  const menuSerum=page.locator('#collection-menu').getByRole('button',{name:'Preview LUMICLEAR TARGET SERUM',exact:true});
  await menuSerum.click();const dialog=page.getByRole('dialog');await dialog.waitFor();await page.keyboard.press('Escape');await dialog.waitFor({state:'hidden'});
  check(await menuSerum.evaluate(el=>el===document.activeElement),'Focus not restored to menu product');
  await page.keyboard.press('Escape');check(await toggle.getAttribute('aria-expanded')==='false','Escape did not close menu');check(await toggle.evaluate(el=>el===document.activeElement),'Menu focus not restored');
  if(name==='desktop'){
   const before=await page.locator('.hero-art').evaluate(el=>getComputedStyle(el).transform);await page.mouse.move(710,500);await page.mouse.wheel(0,410);await page.waitForTimeout(720);
   check(await page.evaluate(()=>scrollY>300),'Wheel did not scroll');check(await page.locator('.hero-art').evaluate(el=>getComputedStyle(el).transform)!==before,'Scroll-linked hero transform did not change');
   await page.screenshot({path:`${out}/desktop-handoff.png`});
  }
  let touchScrolled=null;
  if(name==='phone'){
   const cdp=await context.newCDPSession(page);
   await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:180,y:670,id:1}]});
   for(let i=1;i<=9;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:180,y:670-i*48,id:1}]});await page.waitForTimeout(25)}
   await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(300);
   touchScrolled=await page.evaluate(()=>scrollY>200);check(touchScrolled,'Emulated touch gesture failed to scroll');
  }
  await page.getByRole('link',{name:'Discover the collection',exact:true}).first().click();await page.waitForTimeout(1000);
  check(await page.evaluate(()=>location.hash)==='#collection','Collection anchor failed');
  if(name==='desktop'){await page.goBack();check(await page.evaluate(()=>location.hash)!=='#collection','Browser Back did not restore fragment');await page.goForward();check(await page.evaluate(()=>location.hash)==='#collection','Browser Forward did not restore fragment');await page.waitForTimeout(600)}
  await page.screenshot({path:`${out}/${name}-collection.png`});
  await toggle.click();await menuSerum.click();await dialog.waitFor();await page.waitForTimeout(550);
  check(await dialog.getByRole('heading',{name:'Target Serum',exact:true}).isVisible(),'Wrong product preview');
  const detail=dialog.getByRole('button',{name:'Show packaging detail'});await detail.click();check(await detail.getAttribute('aria-pressed')==='true','Gallery did not switch');
  await page.waitForFunction(()=>{const image=document.querySelector('.product-dialog[open] .preview-alternate img');return image?.complete&&image.naturalWidth>0});await page.waitForTimeout(620);
  await dialog.locator('summary').filter({hasText:'Ingredient highlights'}).click();check(await dialog.getByText('Niacinamide',{exact:true}).isVisible(),'Ingredient accordion failed');
  for(let i=0;i<14;i++){await page.keyboard.press('Tab');check(await dialog.evaluate(el=>el.contains(document.activeElement)),'Tab escaped dialog')}
  await page.keyboard.press('Shift+Tab');check(await dialog.evaluate(el=>el.contains(document.activeElement)),'Reverse Tab escaped dialog');
  if(name==='desktop'||name==='phone')await page.screenshot({path:`${out}/${name}-quickview.png`});
  const modalAxe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
  await dialog.getByRole('button',{name:'Explore Radiance Cream',exact:true}).click();check(await dialog.getByRole('heading',{name:'Radiance Cream',exact:true}).isVisible(),'Companion product switch failed');
  await page.keyboard.press('Escape');await dialog.waitFor({state:'hidden'});
  check(await menuSerum.evaluate(el=>el===document.activeElement),'Quick-view focus not restored');await page.keyboard.press('Escape');
  await page.getByRole('tab',{name:'Niacinamide',exact:true}).focus();await page.keyboard.press('ArrowRight');check(await page.getByRole('tab',{name:'Panthenol',exact:true}).getAttribute('aria-selected')==='true','Ingredient keyboard tabs failed');
  await page.locator('#ritual-step-2').evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}));await page.waitForTimeout(650);
  const ritualStepsVisible=await page.locator('#ritual-step-1').isVisible()&&await page.locator('#ritual-step-2').isVisible();
  check(ritualStepsVisible,'Both homepage ritual steps should be in normal flow');
  if(name==='desktop')await page.screenshot({path:`${out}/desktop-ritual.png`});
  check(await page.getByRole('link',{name:'Explore the Journal',exact:true}).getAttribute('href')==='/journal','Journal route missing');
  await page.getByLabel('Your email address',{exact:true}).fill('preview@example.test');await page.getByRole('button',{name:'Join the SHENERIO community'}).click();check(await page.getByRole('status').getByText(/not been submitted or saved/).isVisible(),'Newsletter preview status missing');
  check(await page.getByRole('link',{name:'Order Tracking',exact:true}).getAttribute('href')==='/order-tracking','Footer care route missing');
  // Scan settled content and preserve a full-page layout view without scroll-position masks.
  await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(300);
  check(await page.locator('.hero-art').evaluate(el=>getComputedStyle(el).transform)==='none','Reduced motion did not clear hero transform');
  check(await page.locator('.collection-optics').evaluate(el=>getComputedStyle(el).position)==='static','Reduced motion kept sticky panel');
  const pageAxe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
  if(name==='desktop'||name==='phone'){
   await page.evaluate(async()=>{scrollTo(0,0);const images=[...document.images].filter(i=>i.getClientRects().length);images.forEach(i=>i.loading='eager');await Promise.all(images.map(i=>i.decode().catch(()=>null)))});
   await page.screenshot({path:`${out}/${name}-full.png`,fullPage:true});
  }
  const violations=[...modalAxe.violations,...pageAxe.violations].map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));
  report.runs.push({name,width,height,reduced,cls,menu:true,quickView:true,ingredientTabs:true,journal:true,newsletterPreview:true,footerCare:true,runtimeReducedMotion:true,ritualStepsVisible,touchScrolled,violations});
  await context.close();
 }
} catch(error){report.errors.push(error.stack||String(error))}
await browser.close();await writeFile(`${out}/browser-qa.json`,JSON.stringify(report,null,2));
console.log(JSON.stringify({runs:report.runs.map(r=>({name:r.name,violations:r.violations.length,cls:r.cls})),errors:report.errors},null,2));
if(report.errors.length||report.runs.some(r=>r.violations.length))process.exitCode=1;
