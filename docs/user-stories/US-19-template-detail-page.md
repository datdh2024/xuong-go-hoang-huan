# US-19 — Add "Mẫu nhà" detail page (/mau-nha/[slug])

**Status:** pending
**Category:** New Page
**Task ID:** #19

---

## User Story

As a **customer interested in a specific house template**, I want to see a detailed page for that template including floor plan diagrams, 3D renders (if available), full specifications, and examples of completed projects using that template — so I can fully visualize the final result before committing.

---

## Background

The `houseTemplate` schema currently only has: name, thumbnail, specs (area, bays, columns), description, featured. There is no detail page for individual templates — they only appear as cards on the homepage and the `/mau-nha` listing page (US-04). This is a high-value conversion page.

---

## Acceptance Criteria

- [ ] `houseTemplate` schema is extended with:
  - `slug` (required, for routing)
  - `floorPlanImage` (image)
  - `renders` (array of images for 3D views or construction photos)
  - `longDescription` (rich text blocks)
  - `woodOptions` (array of strings)
  - `priceRange` (string, e.g., "800 triệu - 1.5 tỷ")
  - `relatedProjects` (array of references to `project`)
- [ ] Detail page at `/mau-nha/[slug]` shows: hero image, specs table, floor plan, renders gallery, long description, related completed projects, and a prominent quote CTA
- [ ] Template cards on `/mau-nha` listing page link to the detail page
- [ ] `generateStaticParams` and `generateMetadata` implemented for SEO
- [ ] Breadcrumb navigation: Trang chủ > Mẫu nhà > [Template name]

---

## Files to Create/Touch

- `src/sanity/schemas/houseTemplate.ts` — extend schema
- `src/sanity/lib/queries.ts` — add `templateBySlugQuery`, `allTemplatesQuery`
- Create `src/app/(site)/mau-nha/[slug]/page.tsx`
- `src/app/(site)/mau-nha/page.tsx` — update template cards to link to detail

---

## Dependencies

- US-04 (House Templates listing page) should be created first or implemented together
