export const originPhotography = {
  london: {
    src: '/images/london-regent-street.webp',
    alt: 'The curved stone façades of Regent Street in London, with black cabs and red double-decker buses.',
    source: 'https://commons.wikimedia.org/wiki/File:Regent_Street_2025-08-10.jpg',
    credit: 'Amanda Slater',
    license: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  laboratory: {
    src: '/images/korean-formulation-study.webp',
    alt: 'An illustrative scene of Korean cosmetic researchers working with an emulsion, a pipette and a laboratory mixer.',
    caption: 'Illustrative Korean formulation scene',
  },
} as const;

// Real still-life photography, used illustratively rather than as a SHENERIO facility.
// Source and Pexels License checked 11 November 2026. Local WebP resized from 2667 × 4000.
export const housePhilosophyPhotography = {
  src: '/images/house-glassware-study.webp',
  alt: 'Clear liquid in glass vessels on a warm wooden surface, with a pipette and a shallow glass dish.',
  source: 'https://www.pexels.com/photo/dropper-on-a-beaker-with-water-8392541/',
  credit: 'Anna Tarazevich / Pexels',
  license: 'https://www.pexels.com/license/',
  caption: 'Illustrative glassware study',
} as const;
