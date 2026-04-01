import { defineField, defineType } from "sanity";

export const heroSlide = defineType({
  name: "heroSlide",
  title: "Hero Slider",
  type: "document",
  fields: [
    defineField({
      name: "image",
      title: "Hình ảnh",
      type: "image",
      options: { hotspot: true },
      validation: (R) => R.required(),
    }),
    defineField({ name: "headline", title: "Tiêu đề", type: "string", validation: (R) => R.required() }),
    defineField({ name: "subheadline", title: "Mô tả", type: "text", rows: 2 }),
    defineField({ name: "ctaLabel", title: "Nút CTA (text)", type: "string" }),
    defineField({ name: "ctaLink", title: "Nút CTA (link)", type: "string" }),
    defineField({ name: "order", title: "Thứ tự", type: "number" }),
  ],
  preview: {
    select: { title: "headline", media: "image" },
  },
});
