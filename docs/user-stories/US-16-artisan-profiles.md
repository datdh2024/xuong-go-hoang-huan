# US-16 — Add "Nghệ nhân" (Artisan Profiles) section on About page

**Status:** pending
**Category:** Feature
**Task ID:** #16

---

## User Story

As a **potential customer**, I want to learn about the individual craftsmen and artisans behind the workshop so that I can feel a personal connection and trust in the people who will be building my home.

---

## Background

`src/app/(site)/gioi-thieu/page.tsx` has a hardcoded "Team" section with 3 generic role cards ("Thợ chạm khắc", "Thợ mộc kết cấu", "Kiến trúc tư vấn") with no real photos or names. The `aboutPage` Sanity schema has `teamDescription` as a plain text field but no individual member profiles.

---

## Acceptance Criteria

- [ ] New Sanity schema `artisan` with fields: `name`, `role` (string), `yearsExperience` (number), `bio` (text), `photo` (image), `specialty` (string, e.g., "Chạm khắc hoa văn"), `order` (number)
- [ ] Schema registered in `src/sanity/schemas/index.ts`
- [ ] GROQ query `artisansQuery` added to `src/sanity/lib/queries.ts`
- [ ] About page team section is replaced with dynamic artisan profile cards showing: photo, name, role, years of experience, specialty
- [ ] Each card has a warm wood-toned design consistent with the site aesthetic
- [ ] Section is labelled "Đội Ngũ Nghệ Nhân" with the standard `SectionHeading` component
- [ ] Fallback to current generic role cards if no artisans are in Sanity yet

---

## Files to Create/Touch

- Create `src/sanity/schemas/artisan.ts`
- `src/sanity/schemas/index.ts`
- `src/sanity/lib/queries.ts` — add `artisansQuery`
- `src/app/(site)/gioi-thieu/page.tsx` — replace hardcoded team section
- Optionally create `src/components/ui/ArtisanCard.tsx`
