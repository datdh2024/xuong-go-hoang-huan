import { defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Công trình",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Tên công trình", type: "string", validation: (R) => R.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (R) => R.required() }),
    defineField({ name: "location", title: "Địa điểm (tỉnh/thành)", type: "string" }),
    defineField({
      name: "category",
      title: "Loại công trình",
      type: "reference",
      to: [{ type: "projectCategory" }],
    }),
    defineField({
      name: "thumbnail",
      title: "Ảnh đại diện",
      type: "image",
      options: { hotspot: true },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "images",
      title: "Thư viện ảnh",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({ name: "description", title: "Mô tả", type: "text", rows: 4 }),
    defineField({ name: "completedYear", title: "Năm hoàn thành", type: "number" }),
    defineField({ name: "featured", title: "Hiển thị trên trang chủ", type: "boolean", initialValue: false }),
    defineField({ name: "order", title: "Thứ tự hiển thị", type: "number", initialValue: 0 }),
  ],
  preview: {
    select: { title: "title", subtitle: "location", media: "thumbnail" },
  },
});
