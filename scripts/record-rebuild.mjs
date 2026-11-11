import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const out='docs/implementation/evidence/after';
await mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1000},recordVideo:{dir:'tmp/rebuild-video',size:{width:1440,height:1000}}});
const page=await context.newPage();
const cdp=await context.newCDPSession(page);
page.setDefaultTimeout(16000);
const pause=(ms=650)=>page.waitForTimeout(ms);
const capture=name=>page.screenshot({path:`${out}/scene-${name}.png`});
async function travel(selector,offset=100){
 const target=await page.locator(selector).evaluate((el,y)=>Math.min(document.documentElement.scrollHeight-innerHeight,el.getBoundingClientRect().top+scrollY-y),offset);
 let remaining=target-await page.evaluate(()=>scrollY);
 for(let i=0;i<10 && Math.abs(remaining)>12;i++){
  const distance=Math.sign(remaining)*Math.min(Math.abs(remaining),1250);
  await cdp.send('Input.synthesizeScrollGesture',{x:700,y:560,yDistance:-distance,speed:700,gestureSourceType:'mouse'});
  await pause(120);remaining=target-await page.evaluate(()=>scrollY);
 }
 await pause();
}
try{
 await page.goto(process.env.PREVIEW_URL||'http://127.0.0.1:3000',{waitUntil:'domcontentloaded'});await pause(2600);await capture('hero');
 const menu=page.getByRole('button',{name:'The collection',exact:true});await menu.click();await pause(1050);await capture('navigation');await page.keyboard.press('Escape');await pause(400);
 await travel('#house');await capture('house');await travel('#collection');await capture('collection');await travel('.serum-chapter',150);await capture('serum');
 await page.getByRole('button',{name:'Explore LUMICLEAR TARGET SERUM',exact:true}).hover();await pause(900);await capture('alternate');await page.mouse.move(32,108);await pause(600);
 await page.getByRole('button',{name:'Discover Target Serum',exact:true}).click();await pause(800);await capture('quick-view');
 await page.getByRole('button',{name:'Show packaging detail'}).click();await pause(680);await page.getByRole('dialog').locator('summary').filter({hasText:'Ingredient highlights'}).click();await pause(780);await capture('gallery');
 await page.getByRole('dialog').getByRole('button',{name:'Explore Radiance Cream',exact:true}).click();await pause(1050);await page.keyboard.press('Escape');await pause(400);
 await travel('.cream-chapter');await capture('cream');await travel('#formulation');await capture('formulation');
 await travel('.formulation-story',280);await page.getByRole('tab',{name:'Squalane',exact:true}).click();await pause(760);await capture('ingredients');
 await travel('#origins');await capture('origins');await travel('#everyday');await capture('everyday');await travel('#ritual');await capture('ritual-intro');
 await travel('#ritual-step-1',125);await capture('ritual-serum');await travel('#ritual-step-2',155);await capture('ritual-cream');
 await travel('#journal');await capture('journal');
 await travel('#newsletter');await capture('newsletter');await travel('.closing',115);await capture('closing');await travel('#footer');await capture('footer');await pause(950);
 const video=page.video();await context.close();await video.saveAs(`${out}/SHENERIO-continuous-walkthrough.webm`);
 console.log('Saved continuous browser walkthrough and chapter captures.');
} finally {await browser.close()}
