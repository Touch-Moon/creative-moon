import { defineType, defineField } from "sanity";

// ── Story / Insight Module Object Types ──────────────────────────────
// Work와 동일한 Media/Spacer 구조 + Story 전용 Text 디자인 구조

// Media Block — 이미지/영상 통합 모듈 (Work.mediaBlock와 동일 구조)
// 1/2/3 컬럼, 비대칭 비율, guttered/full-bleed, 간격 조절
const storyMediaBlock = defineType({
  name: "storyMediaBlock",
  title: "Media Block",
  type: "object",
  fields: [
    defineField({
      name: "layout",
      title: "Layout (Frame)",
      type: "string",
      options: {
        list: [
          { title: "1 Column (2688px)",                      value: "1col" },
          { title: "2 Columns — Equal (1340px each)",        value: "2col" },
          { title: "2 Columns — Narrow:Wide (900 / 1800px)", value: "2col-narrow-wide" },
          { title: "2 Columns — Wide:Narrow (1800 / 900px)", value: "2col-wide-narrow" },
          { title: "3 Columns (900px each)",                 value: "3col" },
        ],
        layout: "radio",
      },
      initialValue: "1col",
    }),
    defineField({
      name: "spacing",
      title: "Gap Spacing",
      type: "string",
      options: {
        list: [
          { title: "Default", value: "default" },
          { title: "Tight",   value: "tight" },
          { title: "None",    value: "none" },
          { title: "No Gap",  value: "no-gap" },
        ],
      },
      initialValue: "default",
    }),
    defineField({
      name: "fullBleed",
      title: "Full Bleed (no side padding)",
      type: "boolean",
      description: "OFF → Guttered (2688px) / ON → Full Bleed (2560px)",
      initialValue: false,
    }),
    defineField({
      name: "narrow",
      title: "Narrow Layout (Reduce Height)",
      type: "boolean",
      initialValue: false,
      description: "1col 전용. 세로 비율을 줄여 좁게 표시",
      hidden: ({ parent }) => parent?.layout !== "1col",
    }),
    // ── Slot 1
    defineField({
      name: "image1",
      title: "Image 1",
      type: "image",
      options: { hotspot: true },
      description: "이미지 또는 영상 중 하나만 등록 | 1col guttered: 2688px · full-bleed: 2560px · 2col equal: 1340px · 2col 1:2 narrow: 900px · 2col 2:1 wide: 1800px",
    }),
    defineField({
      name: "video1",
      title: "Video 1 (overrides Image 1)",
      type: "file",
      options: { accept: "video/*" },
      description: "등록 시 Image 1 대신 영상 표시 | 권장 1920×1080 (FHD) · 8~15MB 이하",
    }),
    // ── Slot 2
    defineField({
      name: "image2",
      title: "Image 2",
      type: "image",
      options: { hotspot: true },
      description: "2col equal: 1340px · 2col narrow:wide → wide: 1800px · 2col wide:narrow → narrow: 900px · 3col: 900px",
      hidden: ({ parent }) => !parent?.layout || parent.layout === "1col",
    }),
    defineField({
      name: "video2",
      title: "Video 2 (overrides Image 2)",
      type: "file",
      options: { accept: "video/*" },
      description: "등록 시 Image 2 대신 영상 표시 | 권장 1920×1080 (FHD)",
      hidden: ({ parent }) => !parent?.layout || parent.layout === "1col",
    }),
    // ── Slot 3
    defineField({
      name: "image3",
      title: "Image 3",
      type: "image",
      options: { hotspot: true },
      description: "3col: 900px",
      hidden: ({ parent }) => parent?.layout !== "3col",
    }),
    defineField({
      name: "video3",
      title: "Video 3 (overrides Image 3)",
      type: "file",
      options: { accept: "video/*" },
      description: "등록 시 Image 3 대신 영상 표시 | 권장 1920×1080 (FHD)",
      hidden: ({ parent }) => parent?.layout !== "3col",
    }),
  ],
  preview: {
    select: { media: "image1", layout: "layout" },
    prepare({ media, layout }) {
      const labels: Record<string, string> = {
        "1col": "1 Column",
        "2col": "2 Columns",
        "2col-narrow-wide": "2 Col (1:2)",
        "2col-wide-narrow": "2 Col (2:1)",
        "3col": "3 Columns",
      };
      return { title: `Media — ${labels[layout] || layout}`, media };
    },
  },
});

// Text Block — Story 전용 텍스트 디자인 구조
// (Work의 textBlock과 다르게 centered/colWidth/offsetCols/heading-in-separate-col 등
//  에세이/아티클형 레이아웃에 맞춘 유연한 그리드 구성)
const storyTextBlock = defineType({
  name: "storyTextBlock",
  title: "Text Block",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Section Heading",
      type: "string",
    }),
    defineField({
      name: "body",
      title: "Body Text",
      type: "array",
      of: [{ type: "block" }, { type: "image" }],
      description: "Rich text. 문단/이미지 혼합 가능",
    }),
    defineField({
      name: "theme",
      title: "Background",
      type: "string",
      options: {
        list: [
          { title: "White (Light)", value: "light" },
          { title: "Black (Dark)",  value: "dark" },
        ],
        layout: "radio",
      },
      initialValue: "light",
      description: "배경색. Dark 선택 시 텍스트 자동 화이트",
    }),
    defineField({
      name: "paddingTop",
      title: "Padding Top (px)",
      type: "number",
      initialValue: 160,
      description: "이 모듈 위 여백 (fvw 기반 px)",
    }),
    defineField({
      name: "centered",
      title: "Center Text",
      type: "boolean",
      initialValue: true,
      description: "ON: 가운데 정렬 · OFF: 12-column 그리드 기반 배치",
    }),
    defineField({
      name: "colWidth",
      title: "Column Width (1–12)",
      type: "number",
      initialValue: 6,
      description: "centered=true 전용. 12-column 그리드에서의 가로폭",
      hidden: ({ parent }) => parent?.centered === false,
    }),
    defineField({
      name: "offsetCols",
      title: "Offset Columns (0–12)",
      type: "number",
      initialValue: 0,
      description: "centered=false 전용. 왼쪽 컬럼 offset",
      hidden: ({ parent }) => parent?.centered === true,
    }),
    defineField({
      name: "headingInSeparateCol",
      title: "Heading in Separate Column",
      type: "boolean",
      initialValue: false,
      description: "centered=false 전용. ON: 헤딩을 좌측 별도 컬럼으로",
      hidden: ({ parent }) => parent?.centered === true,
    }),
    defineField({
      name: "headingColWidth",
      title: "Heading Column Width (1–12)",
      type: "number",
      initialValue: 5,
      description: "headingInSeparateCol=true 전용. 헤딩 컬럼 가로폭",
      hidden: ({ parent }) =>
        parent?.centered === true || parent?.headingInSeparateCol !== true,
    }),
  ],
  preview: {
    select: { heading: "heading" },
    prepare({ heading }) {
      return { title: heading || "Text Block" };
    },
  },
});

// Spacer — 모듈 사이 여백 조절 (Work.spacerBlock와 동일)
const storySpacerBlock = defineType({
  name: "storySpacerBlock",
  title: "Spacer",
  type: "object",
  fields: [
    defineField({
      name: "size",
      title: "Size",
      type: "string",
      options: {
        list: [
          { title: "Small",  value: "small" },
          { title: "Medium", value: "medium" },
          { title: "Large",  value: "large" },
        ],
        layout: "radio",
      },
      initialValue: "medium",
    }),
  ],
  preview: {
    select: { size: "size" },
    prepare({ size }) {
      return { title: `Spacer — ${size || "medium"}` };
    },
  },
});

// Hero Media Module — 타이틀 아래 Hero 영역 (Work와 동일 구조: type/image/video)
const storyHeroModule = defineType({
  name: "storyHeroModule",
  title: "Hero Media",
  type: "object",
  fields: [
    defineField({
      name: "type",
      title: "Media Type",
      type: "string",
      options: { list: ["image", "video"] },
      initialValue: "image",
    }),
    defineField({
      name: "fullBleed",
      title: "Full Bleed (no side gutter)",
      type: "boolean",
      initialValue: true,
      description: "ON → 좌우 여백 없이 꽉 차게 · OFF → 다른 섹션과 동일한 gutter 적용",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      description: "권장 2880px wide (1440 @2x) · 비율 자유",
    }),
    defineField({
      name: "video",
      title: "Video File",
      type: "file",
      options: { accept: "video/*" },
      description: "권장 1920×1080 (FHD) · 8~15MB 이하",
    }),
  ],
});

// ── Story / Insight Document Type ────────────────────────────────────

export const story = defineType({
  name: "story",
  title: "Story / Insight",
  type: "document",
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [
        { field: "order", direction: "asc" },
        { field: "publishedAt", direction: "desc" },
      ],
    },
  ],
  fields: [
    // ── Basic Info
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: 'e.g. "We review a decade of experience in retail."',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      description: 'e.g. "Insights"',
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "text",
      rows: 2,
      description: "타이틀 아래 짧은 한 줄 설명 (Single 페이지)",
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      description: "리스트 뷰의 짧은 요약",
    }),

    // ── Thumbnails (Work와 동일한 2종 구조)
    defineField({
      name: "thumbnailLandscape",
      title: "Thumbnail image — Landscape ★ 필수",
      type: "image",
      options: { hotspot: true },
      description: "★ 필수. 권장 3584×2016 (16:9). Stories List 100% Landscape + Portrait 미등록 시 자동 센터 크롭 폴백.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "thumbnailPortrait",
      title: "Thumbnail image — Portrait (선택)",
      type: "image",
      options: { hotspot: true },
      description: "선택. 권장 1762×1309. 홈/리스트 50% 세로형. 미등록 시 Landscape에서 자동 센터 크롭.",
    }),

    // ── List Page Fields
    defineField({
      name: "listDescription",
      title: "List Description",
      type: "string",
      description: "리스트 페이지 썸네일 아래 노출 (선택)",
    }),

    // ── Hero Media
    defineField({
      name: "heroMedia",
      title: "Hero Media (After Title)",
      type: "storyHeroModule",
      description: "타이틀 이후, 콘텐츠 모듈 이전에 표시되는 이미지/영상",
    }),

    // ── Content Modules
    defineField({
      name: "modules",
      title: "Content Modules",
      type: "array",
      of: [
        { type: "storyMediaBlock" },
        { type: "storyTextBlock" },
        { type: "storySpacerBlock" },
      ],
      description: "미디어(1/2/3컬럼 + 이미지/영상) · 텍스트 · 스페이서 자유 조합",
    }),

    // ── Display Order
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "리스트 정렬 순서. 낮을수록 먼저. 비워두면 publishedAt 기준.",
    }),
  ],

  preview: {
    select: { title: "title", media: "thumbnailLandscape", category: "category" },
    prepare({ title, media, category }) {
      return {
        title: title || "Untitled Story",
        media,
        subtitle: category || "No category",
      };
    },
  },
});

// Export module types
export { storyMediaBlock, storyTextBlock, storySpacerBlock, storyHeroModule };
