'use client';

import Image from 'next/image';
import { useId, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import type { Product } from '@/lib/products';

const indexLabel = (index: number) => String(index + 1).padStart(2, '0');

export function ProductGallery({ product }: { product: Pick<Product, 'gallery' | 'shortName'> }) {
  const [{ active, previous, direction }, setSelection] = useState({ active: 0, previous: -1, direction: 1 });
  const touch = useRef<{ x: number; y: number; id: number } | null>(null);
  const [failed, setFailed] = useState<ReadonlySet<number>>(() => new Set());
  const captionId = useId();
  const images = product.gallery;
  const count = images.length;

  function step(direction: number) {
    setSelection(({ active }) => ({ active: (active + direction + count) % count, previous: active, direction }));
  }

  function select(index: number) {
    setSelection(selection => index === selection.active ? selection : {
      active: index,
      previous: selection.active,
      direction: index > selection.active ? 1 : -1,
    });
  }

  function endSwipe(event: PointerEvent<HTMLDivElement>) {
    const start = touch.current;
    touch.current = null;
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) >= 42 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
  }

  function onGalleryKey(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    step(event.key === 'ArrowRight' ? 1 : -1);
  }

  function markFailed(index: number) {
    setFailed(previous => new Set(previous).add(index));
  }

  return (
    <section className="commerce-gallery" aria-label={`${product.shortName} gallery`} aria-describedby={captionId} onKeyDown={onGalleryKey}>
      <div
        className="commerce-gallery-images"
        data-direction={direction > 0 ? 'next' : 'previous'}
        onPointerDown={event => { if (event.pointerType === 'touch' && event.isPrimary) touch.current = { x: event.clientX, y: event.clientY, id: event.pointerId }; }}
        onPointerUp={endSwipe}
        onPointerCancel={() => { touch.current = null; }}
      >
        {images.map((image, index) => (
          <figure
            key={image.label}
            className="commerce-gallery-frame"
            data-kind={image.kind}
            data-active={index === active}
            data-previous={index === previous}
            data-opening={index === active && previous !== -1}
            aria-hidden={index !== active}
          >
            {image.kind === 'pack' && <span className="commerce-gallery-orbit" aria-hidden="true" />}
            {failed.has(index) ? (
              <p className="commerce-image-unavailable">{image.label} image unavailable</p>
            ) : (
              <Image
                src={image.src}
                alt={image.alt}
                fill
                fetchPriority={index === 0 ? 'high' : undefined}
                loading={index === 0 ? 'eager' : 'lazy'}
                sizes="(max-width: 760px) 96vw, (max-width: 1200px) 51vw, 700px"
                onError={() => markFailed(index)}
              />
            )}
          </figure>
        ))}
        <span className="commerce-gallery-badge">{images[active].kind === 'texture' ? 'Illustrative texture' : 'LUMICLEAR packaging'}</span>
      </div>
      <div className="commerce-gallery-tools">
        <div className="commerce-gallery-thumbnails" role="group" aria-label="Gallery thumbnails">
          {images.map((image, index) => (
            <button type="button" key={image.label} className="commerce-gallery-thumb" aria-pressed={index === active} aria-label={`Show ${image.label.toLowerCase()}`} onClick={() => select(index)}>
              <span className="commerce-gallery-thumb-media" data-kind={image.kind}>
                {!failed.has(index) && <Image src={image.src} alt="" fill sizes="70px" onError={() => markFailed(index)} />}
              </span>
              <span>{image.label}</span>
            </button>
          ))}
        </div>
        <div className="commerce-gallery-navigation">
          <p id={captionId} aria-live="polite" aria-atomic="true"><span>{indexLabel(active)} / {String(count).padStart(2, '0')}</span><span className="commerce-gallery-live-name">{images[active].label}</span></p>
          <div className="commerce-gallery-arrows">
            <button type="button" aria-label="Previous gallery image" onClick={() => step(-1)}><span aria-hidden="true">←</span></button>
            <button type="button" aria-label="Next gallery image" onClick={() => step(1)}><span aria-hidden="true">→</span></button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProductPurchase() {
  const [quantity, setQuantity] = useState(1);
  const limit = 99;

  return (
    <div className="commerce-purchase">
      <p>Quantity</p>
      <div className="commerce-purchase-controls">
        <div className="commerce-quantity" role="group" aria-label="Quantity">
          <button type="button" aria-label="Decrease quantity" disabled={quantity === 1} onClick={() => setQuantity(current => Math.max(1, current - 1))}>−</button>
          <output aria-label="Selected quantity">{quantity}</output>
          <button type="button" aria-label="Increase quantity" disabled={quantity === limit} onClick={() => setQuantity(current => Math.min(limit, current + 1))}>+</button>
        </div>
        <button type="button" className="button commerce-add" disabled aria-describedby="purchase-status">Add to Bag</button>
      </div>
      <p className="commerce-purchase-status" id="purchase-status">Purchasing is unavailable in this preview.</p>
    </div>
  );
}
