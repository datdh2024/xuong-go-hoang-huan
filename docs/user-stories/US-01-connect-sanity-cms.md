# US-01 — Connect Sanity CMS to all pages (replace static data)

**Status:** pending
**Category:** Core
**Task ID:** #1

---

## User Story

As a **content manager**, I want all website content to be fetched from Sanity CMS so that I can update text, images, and settings without touching the codebase.

---

## Background

Currently all pages use hardcoded data from `src/lib/data.ts` (SITE_SETTINGS, HERO_SLIDES, HIGHLIGHTS, FEATURED_PROJECTS, HOUSE_TEMPLATES). Sanity schemas and GROQ queries are already written in `src/sanity/lib/queries.ts` and `src/sanity/lib/client.ts` but are not yet wired to any page or component.

---

## Acceptance Criteria

- [ ] `HeroSlider` fetches slides from Sanity using `heroSlidesQuery`
- [ ] `Highlights` section fetches items from Sanity using `highlightsQuery`
- [ ] `ProjectsGrid` on homepage fetches featured projects using `featuredProjectsQuery`
- [ ] `HouseTemplates` section fetches featured templates using `featuredTemplatesQuery`
- [ ] `Header` and `Footer` fetch company info using `siteSettingsQuery`
- [ ] About page (`/gioi-thieu`) fetches content using `aboutPageQuery`
- [ ] Projects page (`/cong-trinh`) fetches all projects using `allProjectsQuery` + `projectCategoriesQuery`
- [ ] Project detail page fetches by slug using `projectBySlugQuery`
- [ ] `src/lib/data.ts` is kept only for fallback/development until Sanity project ID is configured
- [ ] All Sanity fetches use ISR (revalidate) or `cache: 'no-store'` as appropriate
- [ ] Images use `@sanity/image-url` helper already configured in `src/sanity/lib/image.ts`

---

## Files to Touch

- `src/components/sections/HeroSlider.tsx`
- `src/components/sections/Highlights.tsx`
- `src/components/sections/ProjectsGrid.tsx`
- `src/components/sections/HouseTemplates.tsx`
- `src/components/layout/Header.tsx`
- `src/components/layout/Footer.tsx`
- `src/app/(site)/gioi-thieu/page.tsx`
- `src/app/(site)/cong-trinh/page.tsx`
- `src/app/(site)/cong-trinh/[slug]/page.tsx`
