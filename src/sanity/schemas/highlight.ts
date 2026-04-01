import { defineField, defineType } from "sanity";

export const highlight = defineType({
  name: "highlight",
  title: "Điểm mạnh (USP)",
  type: "document",
  fields: [
    defineField({ name: "icon", title: "Icon (Lucide name)", type: "string", description: "VD: Award, Warehouse, TreePine, PenTool, Shield, MapPin" }),
    defineField({ name: "title", title: "Tiêu đề", type: "string", validation: (R) => R.required() }),
    defineField({ name: "description", title: "Mô tả", type: "text", rows: 3 }),
    defineField({ name: "order", title: "Thứ tự", type: "number" }),
  ],
  preview: {
    select: { title: "title", subtitle: "description" },
  },
});
