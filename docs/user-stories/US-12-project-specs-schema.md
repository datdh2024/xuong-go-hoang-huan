# US-12 — Add project detail specs and materials info to Sanity schema

**Status:** pending
**Category:** CMS Schema
**Task ID:** #12

---

## User Story

As a **visitor reading about a specific project**, I want to see detailed technical information (wood type used, number of bays/columns, construction duration, client budget range) so that I can make an informed decision about commissioning a similar project.

---

## Background

The current `project` Sanity schema (`src/sanity/schemas/project.ts`) only has: title, slug, location, category, thumbnail, images, description, completedYear, featured. There is no information about materials, technical specs, or construction details — all of which are key selling information for high-value wooden house projects.

---

## Acceptance Criteria

- [ ] `project` schema is extended with new optional fields:
  - `woodType` (string): type of wood used (e.g., "Gỗ lim Lào", "Gỗ mít")
  - `specs` (object): `{ bays: number, columns: number, area: string }`
  - `constructionDuration` (string): e.g., "6 tháng"
  - `client` (string): client name or alias (optional, for privacy)
  - `testimonial` (text): short quote from the client about this project
- [ ] Project detail page sidebar is updated to display these new fields when present
- [ ] Fields are optional so existing projects without this data are not broken
- [ ] Sanity Studio groups the new fields under "Thông số kỹ thuật"

---

## Files to Touch

- `src/sanity/schemas/project.ts`
- `src/sanity/lib/queries.ts` — update `projectBySlugQuery` to include new fields
- `src/app/(site)/cong-trinh/[slug]/page.tsx` — display new fields in sidebar

---

## Notes

Best done before US-01 (Connect Sanity CMS) so the extended schema is in place before wiring up the pages.
