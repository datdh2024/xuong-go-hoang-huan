import { defineField, defineType } from "sanity";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "Trang Giới thiệu",
  type: "document",
  fields: [
    defineField({
      name: "heroImage",
      title: "Ảnh banner",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "story",
      title: "Câu chuyện thương hiệu",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "highlights",
      title: "Số liệu nổi bật",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "number", title: "Con số", type: "string" }),
            defineField({ name: "label", title: "Nhãn", type: "string" }),
          ],
          preview: { select: { title: "number", subtitle: "label" } },
        },
      ],
    }),
    defineField({ name: "teamDescription", title: "Giới thiệu đội ngũ", type: "text", rows: 4 }),
  ],
  preview: { prepare: () => ({ title: "Trang Giới thiệu" }) },
});
