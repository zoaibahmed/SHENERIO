'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function RouteMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const wide = matchMedia('(min-width: 1024px) and (pointer: fine)');
    const targets = document.querySelectorAll<HTMLElement>('#main [data-reveal]');
    let observer: IntersectionObserver | undefined;

    function configure() {
      observer?.disconnect();
      targets.forEach(target => target.removeAttribute('data-depth-near'));
      if (preference.matches || !('IntersectionObserver' in window)) return;
      const hasScrollDepth = wide.matches && CSS.supports('animation-timeline: view()');
      observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (hasScrollDepth && entry.target.getAttribute('data-reveal') === 'depth') {
            entry.target.toggleAttribute('data-depth-near', entry.isIntersecting);
            continue;
          }
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.revealEntered = '';
          observer?.unobserve(entry.target);
        }
      }, { rootMargin: '0px 0px 10% 0px' });
      targets.forEach(target => {
        if (!target.hasAttribute('data-reveal-entered') || target.dataset.reveal === 'depth') observer?.observe(target);
      });
    }

    configure();
    preference.addEventListener('change', configure);
    wide.addEventListener('change', configure);
    return () => {
      observer?.disconnect();
      preference.removeEventListener('change', configure);
      wide.removeEventListener('change', configure);
      targets.forEach(target => target.removeAttribute('data-depth-near'));
    };
  }, [pathname]);

  return null;
}
