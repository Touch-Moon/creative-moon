/**
 * SELECTED_WORKS — 홈 Selected Works 섹션 + 싱글 페이지 Related 섹션 공유 데이터
 * HomeWorks.tsx / WorkRelated.tsx 양쪽에서 import하여 사용
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
