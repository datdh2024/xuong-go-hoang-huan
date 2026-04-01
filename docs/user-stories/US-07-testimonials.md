# US-07 — Add customer testimonials/reviews section

**Status:** pending
**Category:** Feature
**Task ID:** #7

---

## User Story

As a **potential customer**, I want to read reviews and testimonials from previous clients so that I can feel confident about the quality and reliability of the workshop before making a large investment.

---

## Background

There is currently no testimonials or customer review section anywhere on the site. For a high-ticket product (custom wooden houses costing hundreds of millions VND), social proof is critical for conversion. The site needs a `testimonial` Sanity schema and a display section.

---

## Acceptance Criteria

- [ ] New Sanity schema `testimonial` is created with fields: `customerName` (string), `location` (string), `houseType` (string), `rating` (number 1–5), `quote` (text), `avatar` (image, optional), `featured` (boolean)
- [ ] Schema is registered in `src/sanity/schemas/index.ts`
- [ ] GROQ query `featuredTestimonialsQuery` is added to `src/sanity/lib/queries.ts`
- [ ] New `Testimonials` section component at `src/components/sections/Testimonials.tsx` renders testimonials as cards with star ratings, quote, and customer name/location
- [ ] Section is added to the homepage between `ProjectsGrid` and `HouseTemplates` OR between `HouseTemplates` and `QuoteForm`
- [ ] On mobile, testimonials are horizontally scrollable (carousel or scroll snap)
- [ ] Section heading: label "Khách hàng nói gì", title "Đánh Giá Từ Khách Hàng"

---

## Files to Create/Touch

- Create `src/sanity/schemas/testimonial.ts`
- `src/sanity/schemas/index.ts` — register schema
- `src/sanity/lib/queries.ts` — add query
- Create `src/components/sections/Testimonials.tsx`
- `src/app/(site)/page.tsx` — add `<Testimonials />` to homepage
