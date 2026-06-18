import { client } from "./client";
import { createImageUrlBuilder } from "@sanity/image-url";
import type { PortableTextBlock } from "@portabletext/react";

// SanityImageSource: extract argument type for builder.image() via Parameters helper
type SanityImageSource = Parameters<ReturnType<typeof createImageUrlBuilder>['image']>[0];

// ── Image URL builder ────────────────────────────────────────────
const builder = createImageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

/**
 * Adds transform parameters to a Sanity CDN image URL.
 * - auto=format  → serves WebP/AVIF automatically based on browser support
 * - fit=max      → never upscales beyond original dimensions
 * - w, q         → width + quality per layout
 *
 * Applying this to images that also pass through next/image gives a first-pass
 * transform by Sanity CDN and a second-pass cache by Next.js — double optimization.
 * For cases that bypass next/image (e.g. WaveImage canvas), this is required.
 */
export function sanityImg(url: string | null | undefined, width: number, quality = 80): string | null {
  if (!url) return null;
  if (!url.includes('cdn.sanity.io')) return url;
  const u = new URL(url);
  u.searchParams.set('auto', 'format');
  u.searchParams.set('fit', 'max');
  u.searchParams.set('w', String(width));
  u.searchParams.set('q', String(quality));
  return u.toString();
}

/**
 * Sanity CDN URL transform for Canvas (WaveImage).
 * Transforms directly via Sanity CDN without going through the /_next/image proxy.
 * Removes all existing params and sets them fresh.
 * @param crop true → fit=crop + crop=center + h=w*(9/16) (16:9 landscape)
 */
export function buildCanvasSrc(
  url: string | null | undefined,
  width: number,
  quality = 80,
  crop = false,
): string | null {
  if (!url || !url.includes('cdn.sanity.io')) return url ?? null;
  const u = new URL(url);
  // Remove all existing params before re-setting (prevents duplicates/conflicts)
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
  /** Portrait — Work 50% vertical card + Selected Works (optional, Landscape fallback) */
  thumbnailPortrait?: SanityImageSource;
  /** Landscape — Work 100% horizontal card (required) */
  thumbnailLandscape?: SanityImageSource;
  /** Actual aspect ratio (width÷height) of the Portrait image. CSS padding-top = (1/ratio)*100% */
  portraitAspectRatio?: number;
  listDescription?: string;
  categories?: { _id: string; title: string; slug: string }[] | string[];
  tags?: string[];
  order?: number;
};

// Type for Selected Works carousel (home + single Related)
export type SelectedWorkSanity = {
  _id: string;
  title: string;
  slug: { current: string };
  thumbnailPortrait?: SanityImageSource;  // 1762×1309 — takes priority when registered directly
  thumbnailLandscape?: SanityImageSource; // 3584×2016 — center-crop fallback when Portrait is absent
  cardSize?: 'large' | 'wide' | 'compact' | 'tall';
  order?: number;
};

// ── Thumbnail URL helpers ─────────────────────────────────────────

// Portrait: served at natural ratio (no forced height → preserves uploaded image ratio)
// Falls back to Landscape at natural ratio when Portrait is not registered
// Used by: Work page 50% vertical card, Home Selected Works
// w=1440 → covers 2x retina for a 720px column (reduced from original 1762)
export function getThumbPortrait(
  thumbnailPortrait?: SanityImageSource,
  thumbnailLandscape?: SanityImageSource,
): string | null {
  const src = thumbnailPortrait ?? thumbnailLandscape;
  if (!src) return null;
  // omit quality/format — /_next/image handles secondary transform (duplicate params → 400 error)
  return urlFor(src).width(1440).url();
}

// Landscape: fixed 16:9 ratio
// Used by: Work page 100% horizontal card
// w=1920 → significantly reduced from original 3584 (1920px is the max display width)
export function getThumbLandscape(thumbnailLandscape?: SanityImageSource): string | null {
  if (!thumbnailLandscape) return null;
  // omit quality/format — /_next/image handles secondary transform (duplicate params → 400 error)
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
  tools?: string[];
  siteUrl?: string;
  githubUrl?: string;
  tags?: string[];
  categories?: { _id: string; title: string; slug: string }[];
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
// thumbnailPortrait/Wide — fetched as raw image objects (asset ref + hotspot/crop)
// → front-end builds crop URLs via urlFor() (using getThumbPortrait/Wide helpers)
export const WORKS_LIST_QUERY = `
  *[_type == "work" && !(_id in path("drafts.**"))] | order(order asc) {
    _id,
    title,
    slug,
    thumbnailPortrait,
    thumbnailLandscape,
    "portraitAspectRatio": thumbnailPortrait.asset->metadata.dimensions.aspectRatio,
    listDescription,
    tags,
    "categories": categories[]->{ _id, title, "slug": slug.current },
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
    tools,
    siteUrl,
    githubUrl,
    tags,
    "categories": categories[]->{ _id, title, "slug": slug.current },
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

// Selected Works: for home carousel & single Related Works
// thumbnailPortrait takes priority; falls back to auto center-crop from thumbnailLandscape (getThumbPortrait helper)
export const SELECTED_WORKS_QUERY = `
  *[_type == "work" && !(_id in path("drafts.**"))] | order(order asc) {
    _id,
    title,
    slug,
    thumbnailPortrait,
    thumbnailLandscape,
    cardSize,
    order
  }
`;

// All workCategory titles with counts
export const CATEGORIES_QUERY = `
  *[_type == "workCategory"] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    "count": count(*[_type == "work" && references(^._id)])
  }
`;

// Story categories with counts
export const STORY_CATEGORIES_QUERY = `
  *[_type == "storyCategory"] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    "count": count(*[_type == "story" && references(^._id)])
  }
`;

// ── Story Types ───────────────────────────────────────────────────

export type StoryListItem = {
  _id: string;
  title: string;
  slug: { current: string };
  /** Legacy single-string category (kept for backward compat) */
  category?: string;
  categories?: { _id: string; title: string; slug: string }[];
  tags?: string[];
  publishedAt?: string;
  thumbnailUrl?: string;
  thumbnailVideoUrl?: string;
  excerpt?: string;
  order?: number;
};

export type StoryModuleType =
  | StoryMediaBlock
  | StoryTextBlock
  | StorySpacerBlock
  | StoryTechStack
  // Legacy modules (existing documents)
  | LegacyStoryMediaModule
  | LegacyStoryTwoColImageModule
  | LegacyStoryTextModule;

export type StoryTechStack = {
  _type: "storyTechStack";
  _key: string;
  heading?: string;
  items?: string[];
  paddingTop?: number;
};

// ── Legacy Module Types (backward compat) ──────────────────────────
export type LegacyStoryMediaModule = {
  _type: "storyMediaModule";
  _key: string;
  mediaType?: "image" | "video";
  image?: { asset: { url: string } };
  video?: { asset: { url: string } };
  narrow?: boolean;
};

export type LegacyStoryTwoColImageModule = {
  _type: "storyTwoColImageModule";
  _key: string;
  leftImage?: { asset: { url: string } };
  rightImage?: { asset: { url: string } };
};

export type LegacyStoryTextModule = {
  _type: "storyTextModule";
  _key: string;
  paddingTop?: number;
  centered?: boolean;
  offsetCols?: number;
  colWidth?: number;
  heading?: string;
  headingInSeparateCol?: boolean;
  headingColWidth?: number;
  body?: PortableTextBlock[];
};

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
  image?: { asset: { url: string }; posterUrl?: string };
  video?: { asset: { url: string }; posterUrl?: string };
};

export type StorySingleData = {
  _id: string;
  title: string;
  slug: { current: string };
  /** Legacy single-string category (kept for backward compat) */
  category?: string;
  categories?: { _id: string; title: string; slug: string }[];
  tags?: string[];
  githubUrl?: string;
  stackblitzUrl?: string;
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

// Stories list — manual drag order from Sanity (orderRank ascending)
export const STORIES_LIST_QUERY = `
  *[_type == "story" && !(_id in path("drafts.**"))] | order(orderRank) {
    _id,
    title,
    slug,
    "category": coalesce(categories[0]->title, category),
    "categories": categories[]->{ _id, title, "slug": slug.current },
    tags,
    publishedAt,
    "thumbnailUrl": coalesce(thumbnail.asset->url, thumbnailPortrait.asset->url, thumbnailLandscape.asset->url),
    "thumbnailLandscapeUrl": coalesce(thumbnailLandscape.asset->url, thumbnail.asset->url),
    "thumbnailPortraitUrl": coalesce(thumbnailPortrait.asset->url, thumbnail.asset->url),
    "thumbnailVideoUrl": thumbnailVideo.asset->url,
    excerpt,
    listDescription
  }
`;

// Story single by slug
export const STORY_BY_SLUG_QUERY = `
  *[_type == "story" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    "category": coalesce(categories[0]->title, category),
    "categories": categories[]->{ _id, title, "slug": slug.current },
    tags,
    githubUrl,
    stackblitzUrl,
    publishedAt,
    "thumbnailUrl": coalesce(thumbnail.asset->url, thumbnailPortrait.asset->url, thumbnailLandscape.asset->url),
    "thumbnailLandscapeUrl": coalesce(thumbnailLandscape.asset->url, thumbnail.asset->url),
    "thumbnailPortraitUrl": coalesce(thumbnailPortrait.asset->url, thumbnail.asset->url),
    subtitle,
    excerpt,
    listDescription,
    heroMedia {
      type,
      fullBleed,
      "image": image {
        asset->{ url },
        "posterUrl": asset->metadata.image.dominantColor
      },
      "video": video {
        asset->{ url },
        "posterUrl": coalesce(posterImage.asset->url, null)
      }
    },
    "modules": modules[] {
      ...,
      // New module fields
      "image1": image1 { asset->{ url } },
      "video1": video1 { asset->{ url } },
      "image2": image2 { asset->{ url } },
      "video2": video2 { asset->{ url } },
      "image3": image3 { asset->{ url } },
      "video3": video3 { asset->{ url } },
      // Legacy module fields (storyMediaModule / storyTwoColImageModule / storyTextModule)
      "image": image { asset->{ url } },
      "video": video { asset->{ url } },
      "leftImage": leftImage { asset->{ url } },
      "rightImage": rightImage { asset->{ url } }
    }
  }
`;

// Stories for HomeStories carousel (manual drag order — orderRank ascending)
export const STORIES_CAROUSEL_QUERY = `
  *[_type == "story" && !(_id in path("drafts.**"))] | order(orderRank) [0...8] {
    _id,
    title,
    slug,
    "category": coalesce(categories[0]->title, category),
    "thumbnailUrl": coalesce(thumbnail.asset->url, thumbnailPortrait.asset->url, thumbnailLandscape.asset->url),
    "thumbnailVideoUrl": thumbnailVideo.asset->url
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
