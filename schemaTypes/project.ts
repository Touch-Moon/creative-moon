import { defineType, defineField } from "sanity";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",

  fields: [
    // Title
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    // Slug
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
      },
      validation: (Rule) => Rule.required(),
    }),

    // Thumbnail
    defineField({
      name: "thumbnail",
      title: "Thumbnail Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),

    // Header Image
    defineField({
      name: "headerImage",
      title: "Header Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),

    // Description
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    }),

    // Client
    defineField({
      name: "client",
      title: "Client",
      type: "string",
    }),

    // Project URL
    defineField({
      name: "url",
      title: "Project URL",
      type: "url",
    }),

    // Content (Flexible Layout)
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [
        { type: "block" }, // text

        {
          type: "image",
          options: { hotspot: true },
        },
      ],
    }),

    // Publish Date
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),

    defineField({
      name: "bodyHtml",
      title: "Body (HTML)",
      type: "text",
    }),

    // 로컬 이미지 쓰는 경우(지금 Moon 선택)
    defineField({
      name: "localImage",
      title: "Local Image Path",
      type: "string",
      description: "예: /images/portfolio/nu-era-seeds.jpg",
    }),

    // WP 추적용(원하면 나중에 삭제 가능)
    defineField({ name: "featuredMediaUrl", title: "Featured Media URL (legacy)", type: "url" }),
    defineField({
      name: "wp",
      title: "WP Meta",
      type: "object",
      fields: [
        defineField({ name: "id", title: "WP ID", type: "number" }),
        defineField({ name: "link", title: "WP Link", type: "url" }),
        defineField({ name: "status", title: "WP Status", type: "string" }),
      ],
    }),

    defineField({
      name: "excerptHtml",
      title: "Excerpt (HTML)",
      type: "text",
    }),

    defineField({
      name: "mainImage",
      title: "Main Image",
      type: "image",
      options: { hotspot: true },
    }),
  ],
});
