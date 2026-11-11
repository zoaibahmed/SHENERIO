'use client';

import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { EditorialArrow, EditorialPhoto } from './editorial-photo';

type IngredientTopic = {
  id: string;
  title: string;
  names: string[];
  text: string;
} & ({ image: { src: string }; study?: never } | { study: string; image?: never });

const scrollMedia = '(min-height: 620px) and (prefers-reduced-motion: no-preference) and (scripting: enabled)';

export function IngredientAtlas({ topics }: { topics: IngredientTopic[] }) {
  const [active, setActive] = useState(0);
  const id = useId();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const track = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const selected = useRef(0);
  const seek = useRef<((index: number) => void) | null>(null);
  const steps = topics.length - 1;

  useEffect(() => {
    const runway = track.current;
    const stage = card.current;
    if (!runway || !stage) return;
    const media = matchMedia(scrollMedia);
    let revision = 0;
    let revert: (() => void) | undefined;

    function selectFromScroll(progress: number) {
      const index = Math.round(progress * steps);
      if (selected.current === index) return;
      selected.current = index;
      setActive(index);
    }

    const configure = async () => {
      const current = ++revision;
      revert?.();
      seek.current = null;
      delete runway.dataset.atlasFallback;
      if (!media.matches) return;
      try {
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
        await document.fonts.ready;
        if (current !== revision) return;
        gsap.registerPlugin(ScrollTrigger);
        const layers = Array.from(stage.querySelectorAll('.atlas-visual')).slice(1);
        const context = gsap.context(() => {}, stage);
        revert = () => {
          delete runway.dataset.atlasReady;
          context.revert();
        };
        context.add(() => {
          gsap.set(layers, { xPercent: 100 });
          const timeline = gsap.timeline({ defaults: { ease: 'none' }, paused: true });
          layers.forEach((layer, index) => timeline.to(layer, { xPercent: 0, duration: 1 }, index));
          const trigger = ScrollTrigger.create({
            animation: timeline,
            trigger: runway,
            start: () => `top top+=${parseFloat(getComputedStyle(stage).top)}`,
            end: () => `+=${runway.offsetHeight - stage.offsetHeight}`,
            scrub: true,
            onUpdate: self => selectFromScroll(self.progress),
            onRefresh: self => selectFromScroll(self.progress),
          });
          seek.current = index => {
            const top = trigger.start + (trigger.end - trigger.start) * index / steps;
            window.scrollTo({ top, behavior: 'instant' });
            ScrollTrigger.update();
          };
        });
        runway.dataset.atlasReady = '';
      } catch {
        if (current !== revision) return;
        revert?.();
        seek.current = null;
        runway.dataset.atlasFallback = '';
      }
    };

    media.addEventListener('change', configure);
    void configure();
    return () => {
      revision++;
      media.removeEventListener('change', configure);
      revert?.();
      seek.current = null;
    };
  }, [steps]);

  function select(index: number) {
    selected.current = index;
    setActive(index);
    seek.current?.(index);
  }

  function move(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    switch (event.key) {
      case 'ArrowDown': next = (index + 1) % topics.length; break;
      case 'ArrowUp': next = (index + topics.length - 1) % topics.length; break;
      case 'Home': next = 0; break;
      case 'End': next = topics.length - 1; break;
      default: return;
    }
    event.preventDefault();
    select(next);
    buttons.current[next]?.focus({ preventScroll: true });
  }

  return <div className="atlas-scroll-track" ref={track} style={{ '--atlas-steps': steps } as CSSProperties}>
    <div className="atlas-index-card" ref={card}>
      <div className="atlas-index-menu">
        <p className="ed-kicker">The sensory atlas</p>
        <h2 id="ingredient-study-title">Ingredient index.</h2>
        <p className="atlas-scroll-hint">Scroll through the ingredient studies <span aria-hidden="true">↓</span></p>
        <div className="atlas-tabs" role="tablist" aria-labelledby="ingredient-study-title" aria-orientation="vertical">
          {topics.map((topic, index) => <button
            key={topic.id}
            ref={button => { buttons.current[index] = button; }}
            type="button" role="tab" id={`${id}-tab-${index}`} aria-controls={`${id}-panel-${index}`}
            tabIndex={index === active ? 0 : -1} aria-selected={index === active}
            onClick={() => select(index)} onKeyDown={event => move(event, index)}
          >
            <span aria-hidden="true">0{index + 1}</span>{topic.title}<span aria-hidden="true">↗</span>
          </button>)}
        </div>
      </div>
      <div className="atlas-selector">
        <div className="atlas-visuals" aria-hidden="true">
          {topics.map((topic, index) => <div key={topic.id} className="atlas-visual" data-topic={topic.id} data-current={index === active ? '' : undefined}>
            <EditorialPhoto className="atlas-selector-photo" src={topic.image ? topic.image.src : topic.study} alt="" sizes="(max-width: 767px) 92vw, 54vw" />
          </div>)}
        </div>
        <div className="atlas-selector-panels">
          {topics.map((topic, index) => <section
            key={topic.id} className="atlas-selector-panel" role="tabpanel" data-topic={topic.id} data-current={index === active ? '' : undefined}
            id={`${id}-panel-${index}`} aria-labelledby={`${id}-tab-${index}`} inert={index !== active} aria-hidden={index !== active}
          >
            <div className="atlas-selector-copy">
              <p className="ed-kicker">0{index + 1} / {topic.title} <span>Illustrative study</span></p>
              <p className="atlas-selector-names">{topic.names.join(' · ')}</p>
              <p className="atlas-selector-summary">{topic.text.split('. ')[0].replace(/\.$/, '')}.</p>
              <a className="text-link" href={`#${topic.id}`}>Read the chapter <EditorialArrow down /></a>
            </div>
          </section>)}
        </div>
      </div>
    </div>
  </div>;
}
