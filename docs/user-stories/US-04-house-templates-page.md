# US-04 — Create dedicated House Templates page (/mau-nha)

**Status:** pending
**Category:** New Page
**Task ID:** #4

---

## User Story

As a **visitor**, I want to browse a dedicated catalog of pre-designed house templates so that I can get inspiration and understand the range of styles and sizes the workshop offers before requesting a quote.

---

## Background

House templates (mẫu nhà) are shown briefly on the homepage via the `HouseTemplates` section, but there is no dedicated page. The Sanity `houseTemplate` schema includes: name, thumbnail, specs (area, bays, columns), description, featured. There is also no nav link for this page.

---

## Acceptance Criteria

- [ ] New page at `/mau-nha` showing all house templates in a grid
- [ ] Each template card shows: thumbnail, name, specs (area, number of bays/columns), description, and a "Yêu cầu báo giá" CTA button linking to `/lien-he`
- [ ] Page has a hero banner with title "Mẫu Nhà Gỗ" consistent with other page headers
- [ ] Navigation in `Header.tsx` includes a link to `/mau-nha`
- [ ] Footer navigation also links to `/mau-nha`
- [ ] New Sanity page route added for fetching all templates
- [ ] Templates can be filtered by number of bays (3 gian, 5 gian)
- [ ] SEO metadata (title, description) defined with `generateMetadata`

---

## Files to Create/Touch

- Create `src/app/(site)/mau-nha/page.tsx`
- Create `src/components/ui/TemplateCard.tsx` (or reuse/extend `ProjectCard`)
- `src/components/layout/Header.tsx` — add nav link
- `src/components/layout/Footer.tsx` — add nav link
- `src/sanity/lib/queries.ts` — add `allTemplatesQuery`
