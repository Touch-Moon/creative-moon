import { client } from "./client";
import imageUrlBuilder from "@sanity/image-url";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SanityImageSource = any;

// ── Image URL builder ────────────────────────────────────────────
const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
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
export function getThumbPortrait(
  thumbnailPortrait?: SanityImageSource,
  thumbnailLandscape?: SanityImageSource,
): string | null {
  const src = thumbnailPortrait ?? thumbnailLandscape;
  if (!src) return null;
  return urlFor(src).width(1762).auto('format').url();
}

// Landscape: 16:9 비율 고정 (3584×2016)
// 사용처: Work 페이지 100% 가로형
export function getThumbLandscape(thumbnailLandscape?: SanityImageSource): string | null {
  if (!thumbnailLandscape) return null;
  return urlFor(thumbnailLandscape).width(3584).height(2016).fit('crop').crop('center').auto('format').url();
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
  spacing?: "default" | "tight" | "none";
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

export type StoryModuleType = StoryMediaModule | StoryTwoColImageModule | StoryTextModule;

export type StoryMediaModule = {
  _type: "storyMediaModule";
  _key: string;
  mediaType: "image" | "video";
  image?: { asset: { url: string } };
  video?: { asset: { url: string } };
  narrow?: boolean;
};

export type StoryTwoColImageModule = {
  _type: "storyTwoColImageModule";
  _key: string;
  leftImage?: { asset: { url: string } };
  rightImage?: { asset: { url: string } };
};

export type StoryTextModule = {
  _type: "storyTextModule";
  _key: string;
  paddingTop?: number;
  centered?: boolean;
  offsetCols?: number;
  colWidth?: number;
  heading?: string;
  headingInSeparateCol?: boolean;
  headingColWidth?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any[];
};

export type StoryHeroMedia = {
  mediaType: "image" | "video";
  image?: { asset: { url: string } };
  video?: { asset: { url: string } };
};

export type StorySingleData = {
  _id: string;
  title: string;
  slug: { current: string };
  category?: string;
  publishedAt?: string;
  thumbnail?: SanityImageSource;
  thumbnailUrl?: string;
  excerpt?: string;
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
    "thumbnailUrl": thumbnail.asset->url,
    excerpt,
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
    "thumbnailUrl": thumbnail.asset->url,
    excerpt,
    heroMedia {
      mediaType,
      "image": image { asset->{ url } },
      "video": video { asset->{ url } }
    },
    "modules": modules[] {
      ...,
      "image": image { asset->{ url } },
      "video": video { asset->{ url } },
      "leftImage": leftImage { asset->{ url } },
      "rightImage": rightImage { asset->{ url } }
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
    "thumbnailUrl": thumbnail.asset->url
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
