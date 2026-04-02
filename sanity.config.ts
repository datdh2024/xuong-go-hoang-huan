import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import { schemaTypes } from "./src/sanity/schemas";

export default defineConfig({
  name: "xuong-go-hoang-huan",
  title: "Xưởng Gỗ Hoàng Huân",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  plugins: [
    structureTool({
      structure: (S, context) =>
        S.list()
          .title("Nội dung")
          .items([
            ...S.documentTypeListItems().filter(
              (item) => item.getId() !== "faqItem"
            ),
            orderableDocumentListDeskItem({
              type: "faqItem",
              title: "Câu hỏi thường gặp",
              S,
              context,
            }),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
  basePath: "/studio",
});
