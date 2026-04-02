import { defineField, defineType } from "sanity";
import { orderRankField } from "@sanity/orderable-document-list";

export const faqItem = defineType({
  name: "faqItem",
  title: "Câu hỏi thường gặp",
  type: "document",
  fields: [
    orderRankField({ type: "faqItem" }),
    defineField({
      name: "question",
      title: "Câu hỏi",
      type: "string",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "answer",
      title: "Trả lời",
      type: "text",
      rows: 4,
      validation: (R) => R.required(),
    }),
  ],
  preview: {
    select: { title: "question", subtitle: "answer" },
  },
});
