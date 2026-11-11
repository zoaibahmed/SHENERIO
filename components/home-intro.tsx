'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
type IntroContext = ReturnType<typeof import('gsap')['gsap']['context']>;
type IntroTimeline = ReturnType<typeof import('gsap')['gsap']['timeline']>;

export function HomeIntro() {
  const curtain = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const hero = document.querySelector<HTMLElement>('.light-hero');
    const image = hero?.querySelector<HTMLImageElement>('.hero-art img');
    if (root.dataset.homeIntro !== 'pending' || !hero || !image || !curtain.current) return;

    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const readiness = new AbortController();
    let context: IntroContext | undefined;
    let readinessDeadline = 0;
    let ended = false;
    let started = false;
    let handingOff = false;

    function finish(reason: string) {
      if (ended) return;
      ended = true;
      clearTimeout(readinessDeadline);
      readiness.abort();
      context?.revert();
      root.dataset.homeIntro = 'done';
      root.dataset.homeIntroReason = reason;
      performance.mark('shenerio:intro-end');
      window.dispatchEvent(new Event('shenerio:intro-end'));
      window.removeEventListener('shenerio:intro-cancel', interrupt);
      preference.removeEventListener('change', reduce);
    }
    function interrupt() { finish(root.dataset.homeIntroReason || 'input'); }
    function reduce() { if (preference.matches) finish('reduced-motion'); }
    window.addEventListener('shenerio:intro-cancel', interrupt);
    preference.addEventListener('change', reduce);

    queueMicrotask(() => {
      try {
        if (ended) return;
        started = true;
        if (scrollY > 4 || preference.matches) { finish('position-or-preference'); return; }
        const compact = matchMedia('(max-width: 767px)').matches;
        const main = hero.closest('#main');
        let opening: IntroTimeline;
        context = gsap.context(() => {
          opening = gsap.timeline({ defaults: { ease: 'power3.out' } });
          opening
            .fromTo('.intro-wordmark', { y: 0, yPercent: 106, opacity: .65, letterSpacing: '.095em' }, { yPercent: 0, opacity: 1, letterSpacing: '.065em', duration: compact ? .54 : .66, ease: 'power2.out' }, 0)
            .fromTo('.intro-signature span', { yPercent: 105, opacity: 0 }, { yPercent: 0, opacity: 1, duration: compact ? .4 : .46, stagger: compact ? .065 : .075, ease: 'power2.out' }, compact ? .26 : .32);
          gsap.set('.light-hero .hero-art picture', { clipPath: compact ? 'inset(0% 0% 8% 0%)' : 'inset(0% 8% 0% 0%)' });
          gsap.set('.light-hero .hero-art img', { scale: compact ? 1.025 : 1.055 });
          gsap.set('.light-hero .reveal-line > span, .light-hero .hero-mark > span', { yPercent: 106 });
          gsap.set('.light-hero .hero-description', { opacity: 0, y: 7 });
          gsap.set('.light-hero .hero-copy .button', { opacity: 0, y: 5 });
        }, main || undefined);
        performance.mark('shenerio:intro-start');
        root.dataset.homeIntro = 'active';

        const reveal = () => {
          if (ended || handingOff) return;
          handingOff = true;
          clearTimeout(readinessDeadline);
          performance.mark('shenerio:intro-handoff');
          const at = opening.time();
          const remainingMs = 2050 - (performance.now() - Number(root.dataset.homeIntroAt || 0));
          if (remainingMs < 500) { finish('late-readiness'); return; }
          // Append at the current playhead: there is no minimum brand-animation hold.
          // Nested targets leave the existing scroll-driven outer hero frame independent.
          context?.add(() => {
            opening
              .to('.intro-curtain', { yPercent: -100, duration: compact ? .82 : 1, ease: 'power4.inOut' }, at)
              .to('.intro-composition', { y: compact ? -32 : -42, opacity: 0, duration: compact ? .26 : .3, ease: 'power2.in' }, at + (compact ? .82 : 1))
              .to('.light-hero .hero-art picture', { clipPath: 'inset(0% 0% 0% 0%)', duration: compact ? .72 : .94, ease: 'power3.out' }, at + .12)
              .to('.light-hero .hero-art img', { scale: 1, duration: compact ? .8 : 1.1 }, at + .1)
              .to('.light-hero .hero-mark > span', { yPercent: 0, duration: .4 }, at + (compact ? .98 : 1.2))
              .to('.light-hero .reveal-line > span', { yPercent: 0, duration: compact ? .48 : .6, stagger: compact ? .055 : .075 }, at + (compact ? 1.13 : 1.35))
              .to('.light-hero .hero-description', { opacity: 1, y: 0, duration: .36 }, at + (compact ? 1.32 : 1.58))
              .to('.light-hero .hero-copy .button', { opacity: 1, y: 0, duration: .32 }, at + (compact ? 1.45 : 1.75))
              .eventCallback('onComplete', () => finish('complete'));
            // A late hydration shortens the continuation instead of extending the opening.
            opening.timeScale(Math.max(1, (opening.duration() - at) * 1000 / remainingMs)).play();
          });
        };
        const elapsed = performance.now() - Number(root.dataset.homeIntroAt || 0);
        readinessDeadline = window.setTimeout(reveal, Math.max(0, 900 - elapsed));
        const readyImage = image.complete ? (image.naturalWidth ? image.decode() : Promise.resolve()) : new Promise<void>(resolve => {
          image.addEventListener('load', () => resolve(), { once: true, signal: readiness.signal });
          image.addEventListener('error', () => resolve(), { once: true, signal: readiness.signal });
        });
        void Promise.allSettled([readyImage, document.fonts.ready]).then(reveal);
      } catch {
        finish('fallback');
      }
    });
    return () => {
      // Strict Mode replays passive effects before this microtask. Leave the bootstrap
      // pending for the real mount while still removing the discarded mount's listeners.
      if (started) finish('unmount');
      else {
        ended = true;
        readiness.abort();
        window.removeEventListener('shenerio:intro-cancel', interrupt);
        preference.removeEventListener('change', reduce);
      }
    };
  }, []);

  return <div className="campaign-intro" ref={curtain} aria-hidden="true">
    <div className="intro-curtain" />
    <div className="intro-composition">
      <div className="intro-word-window"><span className="intro-wordmark">SHENERIO</span></div>
      <p className="intro-signature"><span>ADVANCED SKINCARE.</span> <span>REFINED BY DESIGN.</span></p>
    </div>
  </div>;
}
