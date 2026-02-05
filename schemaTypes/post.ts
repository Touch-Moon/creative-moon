import {defineType, defineField} from "sanity";

export const post = defineType({
  name: "post",
  title: "Post",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
    }),
    defineField({ name: "publishedAt", title: "Published At", type: "datetime" }),
    defineField({ name: "excerptHtml", title: "Excerpt (HTML)", type: "text" }),
    defineField({ name: "bodyHtml", title: "Body (HTML)", type: "text" }),
    defineField({ name: "featuredMediaUrl", title: "Featured Media URL", type: "url" }),
  ],
});
