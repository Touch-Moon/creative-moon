import { client } from "./client";
import { createImageUrlBuilder } from "@sanity/image-url";
import type { PortableTextBlock } from "@portabletext/react";

// SanityImageSource: Parameters 헬퍼로 builder.image() 인자 타입 추출
type SanityImageSource = Parameters<ReturnType<typeof createImageUrlBuilder>['image']>[0];

// ── Image URL builder ────────────────────────────────────────────
const builder = createImageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

/**
 * Sanity CDN 이미지 URL에 변환 파라미터 추가
 * - auto=format  → 브라우저 지원에 따라 WebP/AVIF 자동 서빙
 * - fit=max      → 원본보다 크게 확대 안 함
 * - w, q         → 레이아웃별 너비 + 품질
 *
 * next/image 를 거치는 이미지에도 적용하면 Sanity CDN에서 1차 변환,
 * Next.js에서 2차 캐시 → 이중 최적화.
 * WaveImage(canvas)처럼 next/image 를 안 거치는 경우엔 필수.
 */
export function sanityImg(url: string | null | undefined, width: number, quality = 80): string | null {
  if (!url || !url.includes('cdn.sanity.io')) return url ?? null;
  const u = new URL(url);
  u.searchParams.set('auto', 'format');
  u.searchParams.set('fit', 'max');
  u.searchParams.set('w', String(width));
  u.searchParams.set('q', String(quality));
  return u.toString();
}

/**
 * Canvas(WaveImage)용 Sanity CDN URL 변환.
 * /_next/image 프록시를 거치지 않고 Sanity CDN에서 직접 변환.
 * 기존 파라미터를 모두 제거하고 새로 설정함.
 * @param crop true → fit=crop + crop=center + h=w*(9/16) (16:9 가로형)
 */
export function buildCanvasSrc(
  url: string | null | undefined,
  width: number,
  quality = 80,
  crop = false,
): string | null {
  if (!url || !url.includes('cdn.sanity.io')) return url ?? null;
  const u = new URL(url);
  // 기존 파라미터 전부 제거 후 재설정 (중복/충돌 방지)
  Array.from(u.searchParams.keys()).forEach(k => u.searchParams.delete(k));
  u.searchParams.set('auto', 'format');
  u.searchParams.set('w', String(width));
  u.searchParams.set('q', String(quality));
  if (crop) {
    u.searchParams.set('fit', 'crop');
    u.searchParams.set('crop', 'center');
    u.searchParams.set('h', String(Math.round(width * 9 / 16)));
  } else {
    u.searchParams.set('fit', 'max');
  }
  return u.toString();
}

// ── Type definitions ──────────────────────────────────────────────

export type WorkListItem = {
  _id: string;
  title: string;
  slug: { current: string };
  /** Portrait — Work 50% 세로형 + Selected Works (optional, Landscape 폴백) */
  thumbnailPortrait?: SanityImageSource;
  /** Landscape — Work 100% 가로형 (required) */
  thumbnailLandscape?: SanityImageSource;
  /** Portrait 이미지의 실제 가로÷세로 비율. CSS padding-top = (1/ratio)*100% */
  portraitAspectRatio?: number;
  listDescription?: string;
  categories?: string[];
  order?: number;
};

// Selected Works 캐러셀용 타입 (홈 + 싱글 Related)
export type SelectedWorkSanity = {
  _id: string;
  title: string;
  slug: { current: string };
  thumbnailPortrait?: SanityImageSource;  // 1762×1309 — 직접 등록 시 우선 사용
  thumbnailLandscape?: SanityImageSource; // 3584×2016 — Portrait 미등록 시 센터 크롭 폴백
  cardSize?: 'large' | 'wide' | 'compact' | 'tall';
  order?: number;
};

// ── Thumbnail URL helpers ─────────────────────────────────────────

// Portrait: 자연 비율 그대로 서빙 (height 강제 X → 업로드 이미지 비율 보존)
// Portrait 미등록 시 Landscape에서 자연 비율로 폴백
// 사용처: Work 페이지 50% 세로형, 홈 Selected Works
// w=1440 → 720px 컬럼 기준 2x retina 대응 (기존 1762 → 절감)
export function getThumbPortrait(
  thumbnailPortrait?: SanityImageSource,
  thumbnailLandscape?: SanityImageSource,
): string | null {
  const src = thumbnailPortrait ?? thumbnailLandscape;
  if (!src) return null;
  // quality/format 제거 — /_next/image가 2차 변환 담당 (중복 파라미터 → 400 방지)
  return urlFor(src).width(1440).url();
}

// Landscape: 16:9 비율 고정
// 사용처: Work 페이지 100% 가로형
// w=1920 → 기존 3584에서 대폭 축소 (1920px이 최대 디스플레이 기준)
export function getThumbLandscape(thumbnailLandscape?: SanityImageSource): string | null {
  if (!thumbnailLandscape) return null;
  // quality/format 제거 — /_next/image가 2차 변환 담당 (중복 파라미터 → 400 방지)
  return urlFor(thumbnailLandscape).width(1920).height(1080).fit('crop').crop('center').url();
}


export type ModuleType = MediaBlock | TextBlock | SpacerBlock;

export type DeviceSkin = "none" | "desktop" | "tablet" | "mobile";
export type DeviceBg   = "transparent" | "dark" | "light" | "white" | "image";

export type MediaBlock = {
  _type: "mediaBlock";
  _key: string;
  layout: "1col" | "2col" | "2col-narrow-wide" | "2col-wide-narrow" | "3col";
  fullBleed?: boolean;
  image1?: { asset: { url: string } };
  video1?: { asset: { url: string } };
  skin1?: DeviceSkin;
  skinBg1?: DeviceBg;
  skinBgImage1?: { asset: { url: string } };
  image2?: { asset: { url: string } };
  video2?: { asset: { url: string } };
  skin2?: DeviceSkin;
  skinBg2?: DeviceBg;
  skinBgImage2?: { asset: { url: string } };
  image3?: { asset: { url: string } };
  video3?: { asset: { url: string } };
  skin3?: DeviceSkin;
  skinBg3?: DeviceBg;
  skinBgImage3?: { asset: { url: string } };
  spacing?: "default" | "tight" | "none" | "no-gap";
};

export type TextBlock = {
  _type: "textBlock";
  _key: string;
  layout?: "default" | "split";
  heading?: string;
  body?: string;
  columnWidth?: number;
  offsetCols?: number;
  centered?: boolean;
  theme?: "light" | "dark";
  paddingTop?: "default" | "large" | "none";
};

export type SpacerBlock = {
  _type: "spacerBlock";
  _key: string;
  size?: "small" | "medium" | "large";
};

export type WorkSingleData = {
  _id: string;
  title: string;
  slug: { current: string };
  year?: string;
  subtitle?: string;
  overview?: string;
  services?: string[];
  externalUrl?: string;
  categories?: string[];
  heroMedia?: {
    type: "image" | "video";
    fullBleed?: boolean;
    image?: SanityImageSource;
    video?: { asset: { url: string } };
  };
  modules?: ModuleType[];
};

// ── GROQ Queries ─────────────────────────────────────────────────

// Work list: all works ordered by `order`
// thumbnailPortrait/Wide — raw image objects (asset ref + hotspot/crop)으로 fetch
// → 프론트에서 urlFor()로 크롭 URL 생성 (getThumbPortrait/Wide 헬퍼 사용)
export const WORKS_LIST_QUERY = `
  *[_type == "work"] | order(order asc) {
    _id,
    title,
    slug,
    thumbnailPortrait,
    thumbnailLandscape,
    "portraitAspectRatio": thumbnailPortrait.asset->metadata.dimensions.aspectRatio,
    listDescription,
    "categories": categories[]->title,
    order
  }
`;

// Work single by slug
export const WORK_BY_SLUG_QUERY = `
  *[_type == "work" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    year,
    subtitle,
    overview,
    services,
    externalUrl,
    "categories": categories[]->title,
    heroMedia {
      type,
      fullBleed,
      "image": image { asset->{ url } },
      "video": video { asset->{ url } }
    },
    "modules": modules[] {
      ...,
      "image1": image1 { asset->{ url } },
      "video1": video1 { asset->{ url } },
      skin1, skinBg1,
      "skinBgImage1": skinBgImage1 { asset->{ url } },
      "image2": image2 { asset->{ url } },
      "video2": video2 { asset->{ url } },
      skin2, skinBg2,
      "skinBgImage2": skinBgImage2 { asset->{ url } },
      "image3": image3 { asset->{ url } },
      "video3": video3 { asset->{ url } },
      skin3, skinBg3,
      "skinBgImage3": skinBgImage3 { asset->{ url } }
    }
  }
`;

// Selected Works: 홈 캐러셀 & 싱글 Related Works용
// thumbnailPortrait 우선, 없으면 thumbnailLandscape 에서 자동 센터 크롭 (getThumbPortrait 헬퍼)
export const SELECTED_WORKS_QUERY = `
  *[_type == "work"] | order(order asc) {
    _id,
    title,
    slug,
    thumbnailPortrait,
    thumbnailLandscape,
    cardSize,
    order
  }
`;

// All category titles with counts
export const CATEGORIES_QUERY = `
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    "count": count(*[_type == "work" && references(^._id)])
  }
`;

// ── Story Types ───────────────────────────────────────────────────

export type StoryListItem = {
  _id: string;
  title: string;
  slug: { current: string };
  category?: string;
  publishedAt?: string;
  thumbnailUrl?: string;
  excerpt?: string;
  order?: number;
};

export type StoryModuleType = StoryMediaBlock | StoryTextBlock | StorySpacerBlock;

export type StoryMediaLayout =
  | "1col"
  | "2col"
  | "2col-narrow-wide"
  | "2col-wide-narrow"
  | "3col";

export type StoryMediaSpacing = "default" | "tight" | "none" | "no-gap";

export type StoryMediaBlock = {
  _type: "storyMediaBlock";
  _key: string;
  layout?: StoryMediaLayout;
  spacing?: StoryMediaSpacing;
  fullBleed?: boolean;
  narrow?: boolean;
  image1?: { asset: { url: string } };
  video1?: { asset: { url: string } };
  image2?: { asset: { url: string } };
  video2?: { asset: { url: string } };
  image3?: { asset: { url: string } };
  video3?: { asset: { url: string } };
};

export type StoryTextBlock = {
  _type: "storyTextBlock";
  _key: string;
  paddingTop?: number;
  theme?: "light" | "dark";
  centered?: boolean;
  offsetCols?: number;
  colWidth?: number;
  heading?: string;
  headingInSeparateCol?: boolean;
  headingColWidth?: number;
  body?: PortableTextBlock[];
};

export type StorySpacerBlock = {
  _type: "storySpacerBlock";
  _key: string;
  size?: "small" | "medium" | "large";
};

export type StoryHeroMedia = {
  type: "image" | "video";
  fullBleed?: boolean;
  image?: { asset: { url: string } };
  video?: { asset: { url: string } };
};

export type StorySingleData = {
  _id: string;
  title: string;
  slug: { current: string };
  category?: string;
  publishedAt?: string;
  thumbnailUrl?: string;
  thumbnailLandscape?: SanityImageSource;
  thumbnailLandscapeUrl?: string;
  thumbnailPortrait?: SanityImageSource;
  thumbnailPortraitUrl?: string;
  subtitle?: string;
  excerpt?: string;
  listDescription?: string;
  heroMedia?: StoryHeroMedia;
  modules?: StoryModuleType[];
};

// ── Story GROQ Queries ────────────────────────────────────────────

// Stories list
export const STORIES_LIST_QUERY = `
  *[_type == "story"] | order(order asc, publishedAt desc) {
    _id,
    title,
    slug,
    category,
    publishedAt,
    "thumbnailUrl": coalesce(thumbnailPortrait.asset->url, thumbnailLandscape.asset->url),
    "thumbnailLandscapeUrl": thumbnailLandscape.asset->url,
    "thumbnailPortraitUrl": thumbnailPortrait.asset->url,
    excerpt,
    listDescription,
    order
  }
`;

// Story single by slug
export const STORY_BY_SLUG_QUERY = `
  *[_type == "story" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    category,
    publishedAt,
    "thumbnailUrl": coalesce(thumbnailPortrait.asset->url, thumbnailLandscape.asset->url),
    "thumbnailLandscapeUrl": thumbnailLandscape.asset->url,
    "thumbnailPortraitUrl": thumbnailPortrait.asset->url,
    subtitle,
    excerpt,
    listDescription,
    heroMedia {
      type,
      fullBleed,
      "image": image { asset->{ url } },
      "video": video { asset->{ url } }
    },
    "modules": modules[] {
      ...,
      "image1": image1 { asset->{ url } },
      "video1": video1 { asset->{ url } },
      "image2": image2 { asset->{ url } },
      "video2": video2 { asset->{ url } },
      "image3": image3 { asset->{ url } },
      "video3": video3 { asset->{ url } }
    }
  }
`;

// Stories for HomeStories carousel (ordered)
export const STORIES_CAROUSEL_QUERY = `
  *[_type == "story"] | order(order asc, publishedAt desc) [0...8] {
    _id,
    title,
    slug,
    category,
    "thumbnailUrl": coalesce(thumbnailPortrait.asset->url, thumbnailLandscape.asset->url)
  }
`;

// ── Fetch helpers (for server components) ────────────────────────

export async function getStoriesList(): Promise<StoryListItem[]> {
  return client.fetch<StoryListItem[]>(STORIES_LIST_QUERY);
}

export async function getStoryBySlug(slug: string): Promise<StorySingleData | null> {
  return client.fetch<StorySingleData>(STORY_BY_SLUG_QUERY, { slug });
}

export async function getStoriesCarousel(): Promise<StoryListItem[]> {
  return client.fetch<StoryListItem[]>(STORIES_CAROUSEL_QUERY);
}

export async function getWorksList(): Promise<WorkListItem[]> {
  return client.fetch<WorkListItem[]>(WORKS_LIST_QUERY);
}

export async function getWorkBySlug(slug: string): Promise<WorkSingleData | null> {
  return client.fetch<WorkSingleData>(WORK_BY_SLUG_QUERY, { slug });
}

export async function getCategories(): Promise<
  { _id: string; title: string; slug: string; count: number }[]
> {
  return client.fetch(CATEGORIES_QUERY);
}

export async function getSelectedWorks(): Promise<SelectedWorkSanity[]> {
  return client.fetch<SelectedWorkSanity[]>(SELECTED_WORKS_QUERY);
}
