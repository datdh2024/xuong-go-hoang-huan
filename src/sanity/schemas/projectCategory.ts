import { defineField, defineType } from "sanity";

export const projectCategory = defineType({
  name: "projectCategory",
  title: "Danh mục công trình",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Tên danh mục", type: "string", validation: (R) => R.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" }, validation: (R) => R.required() }),
  ],
  preview: { select: { title: "name" } },
});
