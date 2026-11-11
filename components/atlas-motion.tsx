'use client';

import { useEffect } from 'react';

export function AtlasMotion() {
  useEffect(() => {
    const atlas = document.querySelector('.ed-formulation');
    if (!atlas) return;
    const scope = atlas;
    const media = matchMedia('(min-width: 1024px) and (prefers-reduced-motion: no-preference)');
    let revision = 0;
    let release = () => {};

    async function configure() {
      const version = ++revision;
      release();
      release = () => {};
      if (!media.matches) return;

      try {
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
        await document.fonts.ready;
        if (version !== revision) return;
        gsap.registerPlugin(ScrollTrigger);
        const context = gsap.context(() => {}, scope);
        release = () => context.revert();
        context.add(() => {
          gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: '.atlas-figure',
              start: 'top 63%',
              endTrigger: '.ed-ingredient-rail',
              end: 'top 58%',
              scrub: true,
            },
          })
            .fromTo('.ed-formulation-plate', { clipPath: 'inset(0% 0% 0% 0% round var(--radius-editorial))' }, { clipPath: 'inset(0% 11% 0% 0% round var(--radius-editorial))', duration: .92 }, .08)
            .fromTo('.ed-formulation-plate img', { scale: 1.05 }, { scale: 1.18, xPercent: -5, duration: .93 }, .07)
            .fromTo('.atlas-plate-inset', { yPercent: 4, clipPath: 'inset(0% 0% 20% 0% round var(--radius-editorial))' }, { yPercent: -4, clipPath: 'inset(0% 0% 0% 0% round var(--radius-editorial))', duration: .7 }, .18)
            .from('.atlas-reading-slip', { y: 24, duration: .58 }, .42);
        });
      } catch {
        // The server-rendered plate and index are available without enhancement.
        release();
        release = () => {};
      }
    }

    media.addEventListener('change', configure);
    void configure();
    return () => {
      revision++;
      media.removeEventListener('change', configure);
      release();
    };
  }, []);
  return null;
}
