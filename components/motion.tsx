'use client';

import { useEffect } from 'react';

const mobileScenes = '.manifesto-text, .closing';

export function MotionDirector() {
  useEffect(() => {
    const desktop = matchMedia('(min-width: 1024px)');
    const stageViewport = matchMedia('(min-height: 680px) and (pointer: fine)');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const root = document.documentElement;
    const header = document.querySelector('.site-header');
    const hero = document.querySelector('.hero');
    const main = document.querySelector('#main');
    const track = main?.querySelector<HTMLElement>('.collection-optics-track');
    const stage = track?.querySelector<HTMLElement>('.collection-optics');
    const ritualTrack = main?.querySelector<HTMLElement>('.home-ritual-track');
    const ritualScene = ritualTrack?.querySelector<HTMLElement>('.home-ritual-scene');
    if (!main || !track || !stage) return;
    let revision = 0;
    let release = () => {};

    // A visibility boundary is enough to switch navigation contrast.
    const navigation = new IntersectionObserver(([entry]) => {
      header?.classList.toggle('is-scrolled', !entry.isIntersecting && entry.boundingClientRect.bottom <= 70);
    }, { rootMargin: '-70px 0px 0px 0px' });
    if (hero) navigation.observe(hero);

    const update = async () => {
      const current = ++revision;
      release();
      release = () => {};
      if (reduced.matches) {
        root.dataset.motionReady = 'true';
        return;
      }
      if (!desktop.matches) {
        // Compact layouts use finite CSS reveals in place of these GSAP scenes.
        const observer = new IntersectionObserver(entries => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.setAttribute('data-mobile-entered', '');
            observer.unobserve(entry.target);
          }
        }, { rootMargin: '0px 0px 40px 0px' });
        document.querySelectorAll(mobileScenes).forEach(el => observer.observe(el));
        const formulation = document.querySelectorAll('.formulation-plate-media, .formulation-index-frame');
        const nearby = new IntersectionObserver(entries => {
          for (const entry of entries) entry.target.toggleAttribute('data-formulation-near', entry.isIntersecting);
        }, { rootMargin: '160px 0px' });
        formulation.forEach(el => nearby.observe(el));
        release = () => {
          observer.disconnect();
          nearby.disconnect();
          formulation.forEach(el => el.removeAttribute('data-formulation-near'));
        };
        root.dataset.motionReady = 'true';
        return;
      }

      try {
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([
          import('gsap'),
          import('gsap/ScrollTrigger'),
        ]);
        await document.fonts.ready;
        if (current !== revision) return;
        gsap.registerPlugin(ScrollTrigger);
        const context = gsap.context(() => {}, main);
        release = () => {
          context.revert();
          delete track.dataset.active;
          track.dataset.phase = 'treat';
          if (ritualTrack) {
            delete ritualTrack.dataset.active;
            ritualTrack.dataset.phase = 'treat';
          }
        };
        context.add(() => {
          // The wheel already eases the scroll position. Avoid adding a second delay to the scenes.
          const scene = (trigger: string | HTMLElement, start: string, end: string) => ({ trigger, start, end, scrub: true });
          gsap.timeline({
            scrollTrigger: { ...scene('.hero', 'bottom 99%', 'top 52%'), endTrigger: '.manifesto-text' },
            defaults: { ease: 'none' },
          })
            .fromTo('.hero-art', { clipPath: 'inset(0 0% 0 0%)', yPercent: 0 }, { clipPath: 'inset(0 5.2% 0 5.2%)', yPercent: 8, duration: .64 }, 0)
            .to('.hero-copy', { y: -78, duration: .69 }, 0)
            .fromTo('.hero-seam', { scaleX: .48 }, { scaleX: 1, duration: .62 }, .02)
            .from('.manifesto h2 .reveal-line>span', { yPercent: 104, stagger: .12, duration: .38 }, .35)
            .from('.manifesto-statement span', { y: 11, stagger: .055, duration: .27 }, .64);
          gsap.timeline({ scrollTrigger: scene('.manifesto-image', 'top 90%', 'top 41%') })
            .from('.manifesto-image', { y: 44, opacity: .45, duration: 1 })
            .fromTo('.manifesto-wipe', { scaleY: 1 }, { scaleY: 0, duration: .88 }, .04)
            .from('.manifesto-image img', { scale: 1.12, yPercent: 4, duration: 1 }, 0);
          if (stageViewport.matches) {
            track.dataset.active = '';
            // Clear the pixel translation parsed from the pre-hydration percentage transform.
            gsap.set('.optics-note-1', { y: 0, yPercent: 100 });
            gsap.timeline({
              scrollTrigger: {
                trigger: track,
                start: () => `top top+=${parseFloat(getComputedStyle(stage).top)}`,
                end: () => `+=${track.clientHeight - stage.offsetHeight}`,
                scrub: true,
                invalidateOnRefresh: true,
                onUpdate: ({ progress }) => {
                  const phase = progress < .53 ? 'treat' : 'nourish';
                  if (track.dataset.phase !== phase) track.dataset.phase = phase;
                },
              },
              defaults: { ease: 'none' },
            })
              .to('.optics-meter', { '--optics-progress': 1, duration: 1 }, 0)
              .to('.optics-rose', { opacity: 1, duration: .78 }, .10)
              .to('.optics-study-0 .optics-object', { xPercent: -34, yPercent: -3, scale: .82, duration: .58 }, .12)
              .to('.optics-study-0 .optics-object', { opacity: 0, duration: .24, ease: 'power1.inOut' }, .50)
              .to('.optics-study-0 .optics-word span', { yPercent: -115, duration: .24, ease: 'power1.inOut' }, .23)
              .to('.optics-study-1 .optics-material', { clipPath: 'inset(0 0 0 0%)', duration: .66 }, .16)
              .to('.optics-study-1 .optics-object', { clipPath: 'inset(0 0 0 0%)', duration: .42, ease: 'power1.inOut' }, .30)
              .from('.optics-study-1 .optics-object', { xPercent: 28, yPercent: 7, scale: .94, duration: .56 }, .30)
              .from('.optics-study-1 .optics-material img', { xPercent: 10, scale: 1.17, duration: .68 }, .16)
              .from('.optics-study-1 .optics-word span', { yPercent: 115, duration: .31, ease: 'power1.inOut' }, .49)
              .fromTo('.optics-seam', { xPercent: 100 }, { xPercent: 0, duration: .66 }, .16)
              .to('.optics-note-0', { yPercent: -100, duration: .29 }, .39)
              .to('.optics-note-1', { yPercent: 0, duration: .29 }, .39);

            if (ritualTrack && ritualScene) {
              ritualTrack.dataset.active = '';
              gsap.timeline({
                scrollTrigger: {
                  trigger: ritualTrack,
                  start: () => `top top+=${parseFloat(getComputedStyle(ritualScene).top)}`,
                  end: () => `+=${ritualTrack.clientHeight - ritualScene.offsetHeight}`,
                  scrub: true,
                  invalidateOnRefresh: true,
                  onUpdate: ({ progress }) => {
                    const phase = progress < .53 ? 'treat' : 'nourish';
                    if (ritualTrack.dataset.phase !== phase) ritualTrack.dataset.phase = phase;
                  },
                },
                defaults: { ease: 'none' },
              })
                .to('.home-ritual-progress', { '--ritual-progress': 1, duration: 1 }, 0)
                .fromTo('.home-ritual-application-0 .home-ritual-photo img', { scale: 1 }, { scale: 1.035, xPercent: -1.5, duration: .8 }, .1)
                .to('.home-ritual-application-1 .home-ritual-photo', { clipPath: 'inset(0 0 0 0% round var(--radius-editorial))', duration: .72, ease: 'power1.inOut' }, .15)
                .fromTo('.home-ritual-application-1 .home-ritual-photo img', { scale: 1.055, xPercent: 3 }, { scale: 1, xPercent: 0, duration: .76 }, .14)
                .to('.home-ritual-application-0 h3 > span', { yPercent: -105, duration: .16, ease: 'power1.in' }, .36)
                .from('.home-ritual-application-1 h3 > span', { yPercent: 105, duration: .2, ease: 'power1.out' }, .53);
            }
          }

          gsap.timeline({
            scrollTrigger: { ...scene('.formulation-plate', 'top 86%', 'top 54%'), endTrigger: '.formulation-index-frame' },
            defaults: { ease: 'none' },
          })
            .from('.formulation-plate-media img', { scale: 1.15, yPercent: -6, duration: .74 }, 0)
            .fromTo('.formulation-plate-media', { clipPath: 'inset(0 0% 0 0% round var(--radius-editorial))' }, { clipPath: 'inset(0 5.2% 0 5.2% round var(--radius-editorial))', duration: .8 }, .11)
            .from('.formulation-index', { y: 64, duration: .51 }, .46);
          gsap.timeline({ scrollTrigger: scene('.formulation-editorial', 'top 90%', 'top 52%') })
            .from('.formulation-title-line > span', { yPercent: 105, stagger: .1, duration: .55 }, .12);
          gsap.timeline({ scrollTrigger: scene('.origin-diptych', 'top 90%', 'top 18%') })
            .from('.origin-diptych figure:first-child .origin-image img', { scale: 1.12, yPercent: 5, duration: 1 })
            .from('.origin-diptych figure:last-child .origin-image img', { scale: 1.12, yPercent: -5, duration: 1 }, 0);
          gsap.fromTo('.everyday-image img', { yPercent: -4, scale: 1.12 }, { yPercent: 4, scale: 1.12, ease: 'none', scrollTrigger: scene('.everyday', 'top bottom', 'bottom top') });
          gsap.from('.closing-wordmark', { clipPath: 'inset(0 100% 0 0)', duration: 1.3, ease: 'power3.inOut', scrollTrigger: { trigger: '.closing', start: 'top 80%', once: true } });
        });
        ScrollTrigger.refresh();
        root.dataset.motionReady = 'true';
      } catch {
        release();
        release = () => {};
        root.dataset.motionReady = 'fallback';
      }
    };

    desktop.addEventListener('change', update);
    stageViewport.addEventListener('change', update);
    reduced.addEventListener('change', update);
    void update();
    return () => {
      revision++;
      release();
      navigation.disconnect();
      header?.classList.remove('is-scrolled');
      desktop.removeEventListener('change', update);
      stageViewport.removeEventListener('change', update);
      reduced.removeEventListener('change', update);
      delete root.dataset.motionReady;
    };
  }, []);
  return null;
}
