# US-01 Design: Connect Sanity CMS to All Pages

**Date:** 2026-04-01  
**Status:** Approved  
**Story:** [US-01](../../user-stories/US-01-connect-sanity-cms.md)

---

## Problem

All components import static placeholder data from `src/lib/data.ts`. Sanity schemas, the client, and GROQ queries are already written but are not wired to any page or component. Content managers cannot update the website without touching code.

---

## Architecture

### Pattern: Server Component data-fetching with prop drilling

Each page-level Server Component calls `client.fetch(query)` and passes the result as props to its child components. Client Components (those requiring browser APIs or interactivity) receive data via props rather than importing from `data.ts`.

```
(site)/layout.tsx          → fetch siteSettingsQuery → pass to Header, Footer
(site)/page.tsx            → fetch heroSlidesQuery, highlightsQuery,
                               featuredProjectsQuery, featuredTemplatesQuery
                             → pass to HeroSlider, Highlights, ProjectsGrid, HouseTemplates
(site)/gioi-thieu/page.tsx → fetch aboutPageQuery → render inline
(site)/cong-trinh/page.tsx → fetch allProjectsQuery + projectCategoriesQuery → pass to ProjectsGrid
(site)/cong-trinh/[slug]/page.tsx → fetch projectBySlugQuery($slug) → render inline
```

### Caching strategy

All `client.fetch()` calls use `{ next: { revalidate: 3600 } }` (1-hour ISR). This keeps pages fast while allowing content updates to propagate within an hour. On-demand revalidation via Sanity webhook can be added later.

### Fallback for missing Sanity credentials

A thin `fetchSanity<T>(query, params?)` helper in `src/sanity/lib/fetch.ts` wraps `client.fetch`. If `NEXT_PUBLIC_SANITY_PROJECT_ID` is falsy, the helper returns `null` without throwing. Each component receiving `null` falls back to the corresponding `data.ts` export. This keeps the dev experience intact when no Sanity project is configured.

---

## Component Changes

### Components that become prop-driven

| Component | New prop | Type |
|-----------|----------|------|
| `HeroSlider` | `slides` | `SanityHeroSlide[] \| null` |
| `Highlights` | `highlights` | `SanityHighlight[] \| null` |
| `ProjectsGrid` | `projects` | `SanityProject[] \| null` |
| `HouseTemplates` | `templates` | `SanityTemplate[] \| null` |
| `Header` | `siteSettings` | `SanitySiteSettings \| null` |
| `Footer` | `siteSettings` | `SanitySiteSettings \| null` |

`HeroSlider` remains a Client Component (needs `useState`/`useEffect` for the slider). All others can be Server Components since they have no browser-only logic.

### Types

A `src/sanity/lib/types.ts` file defines TypeScript interfaces matching the GROQ query shapes:
- `SanitySiteSettings`
- `SanityHeroSlide`
- `SanityHighlight`
- `SanityProject`
- `SanityTemplate`
- `SanityAboutPage`
- `SanityProjectCategory`

### Images

Sanity images (returned as `{ asset: { url, metadata } }`) are rendered using Next.js `<Image src={asset.url} />`. The `src/sanity/lib/image.ts` helper is available for URL builder usage but direct `asset.url` is sufficient for these queries.

---

## New Files

| File | Purpose |
|------|---------|
| `src/sanity/lib/fetch.ts` | `fetchSanity<T>()` helper with fallback logic |
| `src/sanity/lib/types.ts` | TypeScript interfaces for all Sanity document shapes |

---

## Files Modified

- `src/components/sections/HeroSlider.tsx` — accept `slides` prop, fall back to `HERO_SLIDES`
- `src/components/sections/Highlights.tsx` — accept `highlights` prop, fall back to `HIGHLIGHTS`
- `src/components/sections/ProjectsGrid.tsx` — accept `projects` prop, fall back to `FEATURED_PROJECTS`
- `src/components/sections/HouseTemplates.tsx` — accept `templates` prop, fall back to `HOUSE_TEMPLATES`
- `src/components/layout/Header.tsx` — accept `siteSettings` prop, fall back to `SITE_SETTINGS`
- `src/components/layout/Footer.tsx` — accept `siteSettings` prop, fall back to `SITE_SETTINGS`
- `src/app/(site)/layout.tsx` — fetch siteSettings, pass to Header + Footer
- `src/app/(site)/page.tsx` — fetch all homepage data, pass to sections
- `src/app/(site)/gioi-thieu/page.tsx` — fetch aboutPageQuery
- `src/app/(site)/cong-trinh/page.tsx` — fetch allProjectsQuery + projectCategoriesQuery
- `src/app/(site)/cong-trinh/[slug]/page.tsx` — fetch projectBySlugQuery

---

## Error Handling

- Missing Sanity credentials → `fetchSanity` returns `null` → components use `data.ts` fallbacks
- Sanity fetch error → Next.js will surface the error at the page level (default error boundary); no silent swallowing
- Missing slug → `projectBySlugQuery` returns `null` → project detail page calls `notFound()`

---

## Testing

- **Unit tests** (Vitest): test `fetchSanity` helper — returns null when no project ID, calls `client.fetch` with correct query/params/revalidate when configured
- **Component tests** (Vitest + RTL): test each component renders correctly with Sanity-shaped prop data and falls back to static data when prop is null
- **E2E tests** (Playwright): smoke test that homepage loads and displays content (works with static fallback, no live Sanity required)

---

## Out of Scope

- Sanity webhook for on-demand revalidation (future)
- Sanity Studio authentication / access control
- Image optimization beyond `next/image` with `asset.url`
