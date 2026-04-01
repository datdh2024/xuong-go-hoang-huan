import { defineField, defineType } from "sanity";

export const houseTemplate = defineType({
  name: "houseTemplate",
  title: "Mẫu nhà",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Tên mẫu", type: "string", validation: (R) => R.required() }),
    defineField({
      name: "thumbnail",
      title: "Ảnh đại diện",
      type: "image",
      options: { hotspot: true },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "specs",
      title: "Thông số kỹ thuật",
      type: "object",
      fields: [
        defineField({ name: "area", title: "Diện tích", type: "string" }),
        defineField({ name: "bays", title: "Số gian", type: "number" }),
        defineField({ name: "columns", title: "Số cột", type: "number" }),
      ],
    }),
    defineField({ name: "description", title: "Mô tả", type: "text", rows: 3 }),
    defineField({ name: "featured", title: "Hiển thị trên trang chủ", type: "boolean", initialValue: false }),
  ],
  preview: {
    select: { title: "name", media: "thumbnail" },
  },
});
