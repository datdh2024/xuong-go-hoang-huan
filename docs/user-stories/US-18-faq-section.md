# US-18 — Add FAQ section (Câu hỏi thường gặp)

**Status:** pending
**Category:** Feature
**Task ID:** #18

---

## User Story

As a **visitor considering commissioning a wooden house**, I want to find answers to common questions (cost, timeline, wood types, warranty, geographic coverage) directly on the website so that I don't have to call the workshop for every preliminary question.

---

## Background

There is no FAQ section. Common questions from customers include: pricing, construction timeline, wood types used, whether they work nationwide, warranty duration, and the design consultation process. An FAQ also helps with SEO — FAQ structured data can appear as rich results in Google.

---

## Acceptance Criteria

- [ ] New Sanity schema `faq` with fields: `question` (string), `answer` (text or rich text blocks), `category` (string: "Giá cả" | "Vật liệu" | "Thi công" | "Bảo hành"), `order` (number)
- [ ] Schema registered in `src/sanity/schemas/index.ts`
- [ ] GROQ query `faqQuery` fetching all FAQs ordered by category then order
- [ ] FAQ section component `src/components/sections/FAQ.tsx` with accordion expand/collapse behavior
- [ ] FAQ section added to the homepage (between HouseTemplates and QuoteForm) or as a section on the Contact page
- [ ] FAQ structured data (JSON-LD `FAQPage` schema) injected in the page `<head>` for Google rich results
- [ ] Questions grouped by category with category headers
- [ ] Initial 10–15 seed questions added in Sanity covering all categories

---

## Suggested Initial Questions

**Giá cả:** Chi phí làm nhà gỗ 3 gian hết bao nhiêu? Có thanh toán theo tiến độ không?
**Vật liệu:** Gỗ lim hay gỗ mít tốt hơn? Gỗ có được kiểm định nguồn gốc không?
**Thi công:** Thời gian thi công mất bao lâu? Có thi công ngoài Hà Nội không?
**Bảo hành:** Bảo hành bao nhiêu năm? Sau bảo hành có dịch vụ bảo trì không?

---

## Files to Create/Touch

- Create `src/sanity/schemas/faq.ts`
- `src/sanity/schemas/index.ts`
- `src/sanity/lib/queries.ts`
- Create `src/components/sections/FAQ.tsx`
- `src/app/(site)/page.tsx` or `src/app/(site)/lien-he/page.tsx`
