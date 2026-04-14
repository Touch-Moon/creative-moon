/**
 * SELECTED_WORKS — shared data for the home Selected Works section and the single-page Related section
 * Imported by both HomeWorks.tsx and WorkRelated.tsx
 */

export type CardSize = 'large' | 'wide' | 'tall' | 'compact';

export type SelectedWork = {
  id: string;
  title: string;
  slug: string;
  src: string;
  size: CardSize;
};

export const SELECTED_WORKS: SelectedWork[] = [
  { id: '01', title: 'Hyundai Annual Convention.', slug: 'hyundai',         src: '/images/work-01.webp', size: 'large'   },
  { id: '02', title: 'Brand Identity System.',     slug: 'brand-identity',  src: '/images/work-02.webp', size: 'compact' },
  { id: '03', title: 'Digital Experience Platform.', slug: 'digital-platform', src: '/images/work-03.webp', size: 'wide' },
  { id: '04', title: 'E-Commerce Redesign.',       slug: 'ecommerce',       src: '/images/work-04.webp', size: 'tall'    },
  { id: '05', title: 'Mobile App Interface.',      slug: 'mobile-app',      src: '/images/work-05.webp', size: 'large'   },
];
