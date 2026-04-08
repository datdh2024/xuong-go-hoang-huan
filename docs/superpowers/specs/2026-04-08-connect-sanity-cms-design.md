# US-01 — Connect Sanity CMS to All Pages: Design Spec

**Date:** 2026-04-08
**Story:** [US-01](../../user-stories/cms/US-01-connect-sanity-cms.md)
**Test Cases:** [TC-01](../../test-cases/cms/TC-01-connect-sanity-cms.md)

---

## Approach

**Page-level fetching with fallbacks.** Each page's Server Component fetches data via helper functions that wrap `client.fetch()` with try/catch and fall back to static data from `src/lib/data.ts`. This extends the existing pattern used for `siteSettings` in the site layout.

---

## 1. Type Definitions

**New file: `src/sanity/lib/types.ts`**

TypeScript interfaces for all Sanity document response types:

- `SanityHeroSlide` — image (string URL after normalization), headline, subheadline, ctaLabel, ctaLink, order
- `SanityHighlight` — icon (Lucide icon name string), title, description, order
- `SanityProject` — title, slug (string), location, category (object with name and slug), thumbnail (string URL), images (string URL array), description, completedYear, featured
- `SanityProjectCategory` — name, slug (string)
- `SanityHouseTemplate` — name, thumbnail (string URL), specs (object with area, bays, columns), description, featured
- `SanityAboutPage` — heroImage (string URL), story (PortableText blocks), highlights (array of {number, label}), teamDescription
- `SanityFaqItem` — question, answer, orderRank

`SiteSettingsData` already exists in `Header.tsx` and is reused as-is.

---

## 2. Fetch Helpers

**New file: `src/sanity/lib/fetchers.ts`**

Each function follows this pattern:

```typescript
export async function getHeroSlides(): Promise<SanityHeroSlide[]> {
  try {
    const slides = await client.fetch(heroSlidesQuery);
    // Normalize Sanity image refs to CDN URLs via urlFor()
    return normalizeSlides(slides);
  } catch {
    return HERO_SLIDES; // fallback from data.ts
  }
}
```

Functions:

| Function | Returns | Query | Fallback |
|----------|---------|-------|----------|
| `getHeroSlides()` | `SanityHeroSlide[]` | `heroSlidesQuery` | `HERO_SLIDES` |
| `getHighlights()` | `SanityHighlight[]` | `highlightsQuery` | `HIGHLIGHTS` |
| `getFeaturedProjects()` | `SanityProject[]` | `featuredProjectsQuery` | `FEATURED_PROJECTS` |
| `getAllProjects()` | `SanityProject[]` | `allProjectsQuery` | `FEATURED_PROJECTS` |
| `getProjectBySlug(slug)` | `SanityProject \| null` | `projectBySlugQuery` | Find in `FEATURED_PROJECTS` |
| `getProjectCategories()` | `SanityProjectCategory[]` | `projectCategoriesQuery` | Derived from static data |
| `getFeaturedTemplates()` | `SanityHouseTemplate[]` | `featuredTemplatesQuery` | `HOUSE_TEMPLATES` |
| `getAboutPage()` | `SanityAboutPage \| null` | `aboutPageQuery` | Static about data |
| `getFaqItems()` | `SanityFaqItem[]` | `faqItemsQuery` | `[]` |

**Image normalization:** Each fetcher calls `urlFor(imageRef).url()` (from `src/sanity/lib/image.ts`) to convert Sanity image asset references into CDN URLs before returning. The normalization happens inside each fetcher's mapping logic — no separate utility needed. Components receive plain string URLs only — no Sanity-specific types leak into components.

---

## 3. Component Refactoring

Components that currently import static data directly will be refactored to accept data as props.

| Component | Current | After |
|-----------|---------|-------|
| `HeroSlider` | Imports `HERO_SLIDES` from `data.ts` | Receives `slides: SanityHeroSlide[]` prop |
| `Highlights` | Imports `HIGHLIGHTS` from `data.ts` | Receives `highlights: SanityHighlight[]` prop |
| `ProjectsGrid` | Imports `FEATURED_PROJECTS` from `data.ts` | Receives `projects: SanityProject[]` prop |
| `HouseTemplates` | Imports `HOUSE_TEMPLATES` from `data.ts` | Receives `templates: SanityHouseTemplate[]` prop |
| `FaqSection` | Already receives props | No change |
| `QuoteForm` | Imports `HOUSE_TYPES` from `data.ts` | Receives `houseTypes: string[]` prop (derived from templates) |

All these components remain Client Components (`"use client"`) since they use interactivity (slider, accordion, filter state). The **pages** (Server Components) do the fetching and pass data down.

---

## 4. Page-by-Page Wiring

### Homepage (`src/app/(site)/page.tsx`)
- Async Server Component
- Fetches: `getHeroSlides()`, `getHighlights()`, `getFeaturedProjects()`, `getFeaturedTemplates()`, `getFaqItems()`
- Derives `houseTypes: string[]` from template names
- Passes all data as props to section components

### About page (`src/app/(site)/gioi-thieu/page.tsx`)
- Async Server Component
- Fetches: `getAboutPage()`
- Renders stats from `aboutPage.highlights`, story from `aboutPage.story`, team from `aboutPage.teamDescription`

### Projects listing (`src/app/(site)/cong-trinh/page.tsx`)
- Async Server Component
- Fetches: `getAllProjects()`, `getProjectCategories()`
- Passes both to a client component that handles category filtering

### Project detail (`src/app/(site)/cong-trinh/[slug]/page.tsx`)
- Async Server Component
- Fetches: `getProjectBySlug(params.slug)`
- Returns `notFound()` if no project found
- Gallery uses `project.images` array

### Contact page (`src/app/(site)/lien-he/page.tsx`)
- Async Server Component
- Fetches: `getSiteSettings()` (reuse existing fetcher from site layout)
- Renders phone, email, address, hours, social links

### Site layout (`src/app/(site)/layout.tsx`)
- **No change needed** — already fetches `siteSettings` and passes to Header/Footer

---

## 5. Error Handling & Edge Cases

### Fallback strategy
- Every fetcher wraps `client.fetch()` in try/catch and returns static data from `data.ts` on failure
- `data.ts` is kept as a fallback source, not deleted
- If Sanity is unreachable, the site renders with static data — never a white screen

### Empty/missing data
- Components use optional chaining and guard against empty arrays
- Sections with zero items: hide the section entirely (e.g., FAQ with no items → section hidden)
- Optional fields (description, subheadline) render nothing when absent — no "undefined" text

### Single-item edge cases
- HeroSlider with 1 slide: renders the slide, hides navigation dots/arrows

### Non-existent slug
- `getProjectBySlug()` returns `null` → page calls `notFound()` → Next.js 404 page

---

## 6. Data Decisions

- **HOUSE_TYPES:** Derived from Sanity house template names (fetched via `getFeaturedTemplates()`)
- **PROVINCES:** Stays hardcoded in `data.ts` — rarely changes, no CMS management needed
- **`data.ts`:** Retained as fallback source. Not deleted.

---

## 7. Testing Strategy

### Unit tests (Vitest)
- Test each fetcher: mock `client.fetch` success → verify return shape; mock throw → verify fallback
- Test components render correctly with props (no internal data imports)
- Test image URL normalization

### E2E tests (Playwright)
- Aligned with TC-01 test cases (14 cases)
- Happy path: verify pages render CMS content
- Edge cases: single slide, empty FAQ, non-existent slug → 404
- Manual QA only: Sanity Studio editing (TC-01-07), API unreachable (TC-01-13)

### TDD cycle per component
1. RED — Write test for fetcher → fails
2. GREEN — Implement fetcher → passes
3. RED — Write test for component with new props → fails
4. GREEN — Refactor component → passes
5. E2E — Verify full page integration

---

## Files Changed Summary

### New files
- `src/sanity/lib/types.ts` — TypeScript interfaces
- `src/sanity/lib/fetchers.ts` — Fetch helper functions

### Modified files
- `src/app/(site)/page.tsx` — Async, fetch + pass props
- `src/app/(site)/gioi-thieu/page.tsx` — Async, fetch aboutPage
- `src/app/(site)/cong-trinh/page.tsx` — Async, fetch projects + categories
- `src/app/(site)/cong-trinh/[slug]/page.tsx` — Async, fetch by slug, notFound()
- `src/app/(site)/lien-he/page.tsx` — Async, fetch siteSettings
- `src/components/home/HeroSlider.tsx` — Props-based, remove data.ts import
- `src/components/home/Highlights.tsx` — Props-based, remove data.ts import
- `src/components/home/ProjectsGrid.tsx` — Props-based, remove data.ts import
- `src/components/home/HouseTemplates.tsx` — Props-based, remove data.ts import
- `src/components/home/QuoteForm.tsx` — Accept `houseTypes` prop

### Unchanged files
- `src/sanity/lib/queries.ts` — Already complete
- `src/sanity/schemas/*` — Already complete
- `src/sanity/lib/client.ts` — Already complete
- `src/sanity/lib/image.ts` — Already complete
- `src/components/home/FaqSection.tsx` — Already props-based
- `src/components/layout/Header.tsx` — Already props-based
- `src/components/layout/Footer.tsx` — Already props-based
- `src/app/(site)/layout.tsx` — Already fetches siteSettings
- `src/lib/data.ts` — Retained as fallback
