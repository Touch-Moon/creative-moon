import { defineType, defineField } from "sanity";

// ── Story Module Object Types ─────────────────────────────────────────

// Media module (image or video)
const storyMediaModule = defineType({
  name: "storyMediaModule",
  title: "Media (Full Width)",
  type: "object",
  fields: [
    defineField({
      name: "mediaType",
      title: "Media Type",
      type: "string",
      options: { list: ["image", "video"] },
      initialValue: "image",
    }),
    defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "video", title: "Video File", type: "file", options: { accept: "video/*" } }),
    defineField({
      name: "narrow",
      title: "Narrow Layout (Reduce Height)",
      type: "boolean",
      initialValue: false,
    }),
  ],
});

// Two-column image module
const storyTwoColImageModule = defineType({
  name: "storyTwoColImageModule",
  title: "2-Column Images",
  type: "object",
  fields: [
    defineField({ name: "leftImage", title: "Left Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "rightImage", title: "Right Image", type: "image", options: { hotspot: true } }),
  ],
});

// Text module with flexible layout
const storyTextModule = defineType({
  name: "storyTextModule",
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
    }),
    defineField({
      name: "paddingTop",
      title: "Padding Top (px)",
      type: "number",
      initialValue: 160,
      description: "Space above this module in pixels (fvw-based)",
    }),
    defineField({
      name: "centered",
      title: "Center Text",
      type: "boolean",
      initialValue: true,
      description: "If true, text is centered. If false, uses grid layout.",
    }),
    defineField({
      name: "colWidth",
      title: "Column Width (1-12)",
      type: "number",
      initialValue: 6,
      description: "Only used when centered=true. Width as fraction of 12-column grid.",
    }),
    defineField({
      name: "offsetCols",
      title: "Offset Columns (0-12)",
      type: "number",
      initialValue: 0,
      description: "Only used when centered=false. Left padding in columns.",
    }),
    defineField({
      name: "headingInSeparateCol",
      title: "Heading in Separate Column",
      type: "boolean",
      initialValue: false,
      description: "Only used when centered=false. If true, heading goes in left column.",
    }),
    defineField({
      name: "headingColWidth",
      title: "Heading Column Width (1-12)",
      type: "number",
      initialValue: 5,
      description: "Width of heading column when headingInSeparateCol=true",
    }),
  ],
});

// Hero Media Module (right after title, before content modules)
const storyHeroModule = defineType({
  name: "storyHeroModule",
  title: "Hero Media",
  type: "object",
  fields: [
    defineField({
      name: "mediaType",
      title: "Media Type",
      type: "string",
      options: { list: ["image", "video"] },
      initialValue: "image",
      description: "Choose either image or video for the hero section",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.mediaType === "video",
    }),
    defineField({
      name: "video",
      title: "Video File",
      type: "file",
      options: { accept: "video/*" },
      hidden: ({ parent }) => parent?.mediaType === "image",
    }),
  ],
});

// ── Story Document Type ────────────────────────────────────────────

export const story = defineType({
  name: "story",
  title: "Story / Insight",
  type: "document",
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }, { field: "publishedAt", direction: "desc" }],
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
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      description: "Short summary shown in list views",
    }),

    // ── List Page Fields
    defineField({
      name: "thumbnail",
      title: "Thumbnail — Stories List",
      type: "image",
      options: { hotspot: true },
      description: "Used on stories list page. Portrait orientation recommended.",
    }),

    // ── Hero Media (new field for hero section)
    defineField({
      name: "heroMedia",
      title: "Hero Media (After Title)",
      type: "storyHeroModule",
      description: "Image or video displayed after the title, before content modules",
    }),

    // ── Content Modules
    defineField({
      name: "modules",
      title: "Content Modules",
      type: "array",
      of: [
        { type: "storyMediaModule" },
        { type: "storyTwoColImageModule" },
        { type: "storyTextModule" },
      ],
      description: "Flexible content blocks. Can be images, 2-column images, or text.",
    }),

    // ── Display Order
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Controls order in the list. Lower = first. Leave blank to use publishedAt.",
    }),
  ],

  preview: {
    select: { title: "title", media: "thumbnail", category: "category" },
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
export { storyMediaModule, storyTwoColImageModule, storyTextModule, storyHeroModule };
