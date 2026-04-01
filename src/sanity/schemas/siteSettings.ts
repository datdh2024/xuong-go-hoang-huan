import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Cài đặt website",
  type: "document",
  fields: [
    defineField({ name: "companyName", title: "Tên công ty", type: "string" }),
    defineField({ name: "tagline", title: "Tagline", type: "string" }),
    defineField({ name: "phone", title: "Số điện thoại", type: "string" }),
    defineField({ name: "zaloNumber", title: "Số Zalo", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "address", title: "Địa chỉ", type: "text", rows: 2 }),
    defineField({ name: "workingHours", title: "Giờ làm việc", type: "string" }),
    defineField({ name: "facebookUrl", title: "Facebook URL", type: "url" }),
    defineField({ name: "youtubeUrl", title: "YouTube URL", type: "url" }),
  ],
  preview: { select: { title: "companyName" } },
});
