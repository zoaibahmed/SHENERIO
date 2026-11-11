'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const nativeScrollKeys = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ']);

export function ScrollEngine() {
  const pathname = usePathname();
  const interrupt = useRef(() => {});
  const refreshRoute = useRef(() => {});

  useEffect(() => {
    const root = document.documentElement;
    const wheel = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let revision = 0;
    let anchorFrame = 0;
    let release = () => {};

    const stopWheel = () => interrupt.current();
    const onKey = (event: KeyboardEvent) => { if (nativeScrollKeys.has(event.key)) stopWheel(); };
    function onClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest('a[href]');
      if (link || event.target.closest('.menu-toggle, [aria-haspopup="dialog"]')) stopWheel();
      if (!(link instanceof HTMLAnchorElement) || !link.hash || link.origin !== location.origin ||
          link.pathname !== location.pathname || link.search !== location.search || reduced.matches ||
          event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      // Keep the browser's fragment navigation, focus and history semantics.
      root.dataset.anchorScroll = '';
      cancelAnimationFrame(anchorFrame);
      anchorFrame = requestAnimationFrame(() => delete root.dataset.anchorScroll);
    }

    async function configure() {
      const current = ++revision;
      release();
      release = () => {};
      root.dataset.scrollEngine = 'native';
      if (!wheel.matches) return;

      try {
        const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
          import('lenis'), import('gsap'), import('gsap/ScrollTrigger'),
        ]);
        if (revision !== current) return;
        gsap.registerPlugin(ScrollTrigger);

        const lenis = new Lenis({
          autoRaf: false, lerp: .18, syncTouch: false, anchors: false,
          virtualScroll: ({ event }) => {
            // A native position change can coincide with Lenis ignoring its own final scroll event.
            if (event.type === 'wheel' && lenis.isScrolling !== 'smooth' && Math.abs(lenis.actualScroll - lenis.animatedScroll) > 2) {
              lenis.resize();
            }
            return true;
          },
        });
        const tick = () => lenis.raf(performance.now());
        const offScroll = lenis.on('scroll', () => ScrollTrigger.update());
        gsap.ticker.add(tick, false, true);

        let frame = 0;
        const refresh = () => {
          if (frame) return;
          frame = requestAnimationFrame(() => {
            frame = 0;
            ScrollTrigger.refresh();
          });
        };
        const resize = new ResizeObserver(refresh);
        interrupt.current = () => {
          if (lenis.isScrolling === 'smooth') lenis.scrollTo(window.scrollY, { immediate: true });
        };
        refreshRoute.current = refresh;
        release = () => {
          resize.disconnect();
          cancelAnimationFrame(frame);
          interrupt.current = () => {};
          refreshRoute.current = () => {};
          gsap.ticker.remove(tick);
          offScroll();
          lenis.destroy();
        };
        const main = document.getElementById('main');
        if (main) resize.observe(main);
        void document.fonts.ready.then(() => { if (revision === current) refresh(); });
        root.dataset.scrollEngine = 'smooth';
      } catch {
        if (revision === current) {
          release();
          release = () => {};
          root.dataset.scrollEngine = 'native';
        }
      }
    }

    const nativeEvents = ['popstate', 'hashchange', 'pageshow', 'pointerdown', 'touchstart'] as const;
    nativeEvents.forEach(event => window.addEventListener(event, stopWheel, { capture: true, passive: true }));
    window.addEventListener('keydown', onKey, true);
    window.addEventListener('click', onClick, true);
    wheel.addEventListener('change', configure);
    void configure();

    return () => {
      revision++;
      release();
      wheel.removeEventListener('change', configure);
      nativeEvents.forEach(event => window.removeEventListener(event, stopWheel, true));
      window.removeEventListener('keydown', onKey, true);
      window.removeEventListener('click', onClick, true);
      cancelAnimationFrame(anchorFrame);
      delete root.dataset.anchorScroll;
      delete root.dataset.scrollEngine;
    };
  }, []);

  useEffect(() => {
    interrupt.current();
    refreshRoute.current();
  }, [pathname]);

  return null;
}
