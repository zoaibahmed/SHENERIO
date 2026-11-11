// Runs before the first body paint. The overlay is opt-in; without scripting the site is visible.
export const homeIntroBootstrap = `(()=>{
  const root=document.documentElement;
  const nav=performance.getEntriesByType('navigation')[0];
  let visited=false;
  try { visited=sessionStorage.getItem('shenerio:entry')==='1'; sessionStorage.setItem('shenerio:entry','1'); } catch {}
  const localReferrer=document.referrer && new URL(document.referrer).origin===location.origin;
  if(location.pathname!=='/' || location.hash || visited || localReferrer ||
    nav?.type!=='navigate' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  root.dataset.homeIntro='pending';
  root.dataset.homeIntroAt=String(performance.now());
  const inputs=['pointerdown','touchstart','wheel','keydown','pagehide'];
  let timer;
  function detach(){
    clearTimeout(timer);
    inputs.forEach(type=>window.removeEventListener(type,cancel,true));
    document.removeEventListener('visibilitychange',hidden);
    window.removeEventListener('shenerio:intro-end',detach);
  }
  function cancel(event){
    root.dataset.homeIntro='done';
    root.dataset.homeIntroReason=event?.type==='timeout'?'deadline':'input';
    window.dispatchEvent(new Event('shenerio:intro-cancel'));
    detach();
  }
  function hidden(){if(document.hidden)cancel();}
  inputs.forEach(type=>window.addEventListener(type,cancel,{capture:true,passive:true}));
  document.addEventListener('visibilitychange',hidden);
  window.addEventListener('shenerio:intro-end',detach,{once:true});
  timer=setTimeout(()=>cancel({type:'timeout'}),2200);
})();`;
