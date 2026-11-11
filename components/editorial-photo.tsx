import Image from 'next/image';

type PhotoProps = {
  src: string;
  alt: string;
  sizes: string;
  className: string;
  eager?: boolean;
  reveal?: boolean;
};

export function EditorialPhoto({ src, alt, sizes, className, eager, reveal }: PhotoProps) {
  return (
    <div className={`ed-photo ${className}`} data-reveal={reveal ? 'image' : undefined}>
      <Image src={src} alt={alt} fill sizes={sizes} quality={80} loading={eager ? 'eager' : 'lazy'} />
    </div>
  );
}

export function EditorialArrow({ down = false }: { down?: boolean }) {
  return (
    <svg className="arrow" aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d={down ? 'M12 4v15m-5-5 5 5 5-5' : 'M6 18 18 6M6 6h12v12'} stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}
