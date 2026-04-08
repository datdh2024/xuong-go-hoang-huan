# UF-01 — Connect Sanity CMS to All Pages

- **Status:** TODO
- **Related task:** SR-873
- **Related flows:** UF-08 (FAQ Section — already wired to Sanity, serves as the pattern)

---

## Summary

As a content manager, all website content (text, images, settings) must be served from Sanity CMS so it can be updated without touching the codebase.

**Current state:** Every page except FaqSection reads from `src/lib/data.ts` (hardcoded). The Sanity schemas and GROQ queries are fully written and ready in `src/sanity/lib/queries.ts`; none are wired up (except `faqItemsQuery` in the homepage and `siteSettingsQuery` with fallback in the site layout).

---

## Pages & Data to Connect

### 1. Homepage — `src/app/(site)/page.tsx`

| Section | Query | Status |
|---|---|---|
| HeroSlider | `heroSlidesQuery` | Not wired |
| Highlights | `highlightsQuery` | Not wired |
| ProjectsGrid | `featuredProjectsQuery` | Not wired |
| HouseTemplates | `featuredTemplatesQuery` | Not wired |
| FaqSection | `faqItemsQuery` | ✅ Done |

**Implementation pattern:** Fetch all queries in the async Server Component (`HomePage`), pass data as props to each section component.

### 2. About Page — `src/app/(site)/gioi-thieu/page.tsx`

| Content | Query field | Status |
|---|---|---|
| Hero image | `aboutPageQuery.heroImage` | Not wired |
| Stats (number, label) | `aboutPageQuery.highlights[]` | Not wired |
| Story text | `aboutPageQuery.story` | Not wired |
| Team description | `aboutPageQuery.teamDescription` | Not wired |

> **Note:** Team member cards (role + description) are currently fully hardcoded in the component and have no Sanity counterpart. The `aboutPageQuery` fetches only `story`, `teamDescription`, `highlights[]`, and `heroImage`. Team cards should remain hardcoded until a `teamMember` schema is added.

### 3. Projects Listing — `src/app/(site)/cong-trinh/page.tsx`

| Content | Query | Status |
|---|---|---|
| Project cards | `allProjectsQuery` | Not wired |
| Category filter options | `projectCategoriesQuery` | Not wired |

> **Note:** The category filter is currently UI-only (no client interaction). After connecting Sanity, categories come from `projectCategoriesQuery`. The filter behavior requires a Client Component wrapper around the grid for interactive filtering.

### 4. Project Detail — `src/app/(site)/cong-trinh/[slug]/page.tsx`

| Content | Query | Status |
|---|---|---|
| Project data (title, location, year, description, thumbnail) | `projectBySlugQuery` | Not wired |
| Gallery images | `projectBySlugQuery.images[]` | Not wired (currently 4 hardcoded Unsplash URLs) |
| `generateStaticParams` | `allProjectsQuery` (slugs only) | Not wired (uses `FEATURED_PROJECTS`) |
| `generateMetadata` | `projectBySlugQuery` | Not wired |

### 5. Site Layout — `src/app/(site)/layout.tsx`

| Content | Query | Status |
|---|---|---|
| Header / Footer settings | `siteSettingsQuery` | ✅ Partially done (with fallback to `SITE_SETTINGS`) |

---

## User Flow (Content Manager)

1. Content manager logs into Sanity Studio at `/studio`.
2. Manager creates or edits a document (e.g., a hero slide, a project, site settings).
3. Manager publishes the document in Sanity.
4. After at most `revalidate = 3600` seconds (already set in site layout), the Next.js page cache refreshes and the new content appears on the public website.
5. Manager visits the public site to verify the change — no code deployment needed.

---

## Feasibility Assessment

**High feasibility.** All Sanity schemas and GROQ queries are already written. The implementation for each page follows a single pattern already demonstrated by FaqSection:

```ts
// In any async Server Component page:
import { client } from "@/sanity/lib/client";
import { heroSlidesQuery } from "@/sanity/lib/queries";

const slides = await client.fetch(heroSlidesQuery);
return <HeroSlider slides={slides ?? FALLBACK} />;
```

**Risks:**
- **Missing Sanity env vars** — If `NEXT_PUBLIC_SANITY_PROJECT_ID` is not set, `client.fetch()` will throw. Apply the same guard used in `(site)/layout.tsx` (check env var, fall back to static data) to every page fetch until the project is fully configured.
- **Component prop types** — Each section component currently reads from module-level constants; they need to accept data as props. Type definitions must align with the GROQ query shape (e.g., Sanity image references vs. plain URL strings — use `urlFor()` from `src/sanity/lib/image.ts`).
- **About page team cards** — No Sanity schema exists for team members. Keep hardcoded until a schema is added.
- **Project category filter** — Making it interactive requires extracting the filter grid into a `"use client"` component; the page itself can remain a Server Component that passes categories and projects as props.
- **`generateStaticParams`** — Must switch from `FEATURED_PROJECTS` to a Sanity fetch of all project slugs; requires `dynamicParams = false` or `true` based on whether new projects should auto-generate pages without a redeploy.

---

## Impact Analysis

| File | Change |
|---|---|
| `src/app/(site)/page.tsx` | Add 4 `client.fetch()` calls; pass data to HeroSlider, Highlights, ProjectsGrid, HouseTemplates |
| `src/app/(site)/gioi-thieu/page.tsx` | Add `aboutPageQuery` fetch; replace hardcoded hero image, stats, story |
| `src/app/(site)/cong-trinh/page.tsx` | Add `allProjectsQuery` + `projectCategoriesQuery` fetches; extract filter to Client Component |
| `src/app/(site)/cong-trinh/[slug]/page.tsx` | Replace `FEATURED_PROJECTS` lookup with `projectBySlugQuery`; use `images[]` for gallery |
| Section components (HeroSlider, Highlights, ProjectsGrid, HouseTemplates) | Accept data props instead of importing from `src/lib/data.ts` |
| `src/lib/data.ts` | `HERO_SLIDES`, `HIGHLIGHTS`, `FEATURED_PROJECTS`, `HOUSE_TEMPLATES` can be removed once all pages are wired. `PROVINCES` and `HOUSE_TYPES` (used by QuoteForm) remain. |

---

## Definition of Done

- [ ] All section components accept CMS data as props (no direct `src/lib/data.ts` import for page content).
- [ ] Homepage fetches hero slides, highlights, featured projects, and house templates from Sanity.
- [ ] About page fetches hero image, stats, and story text from Sanity.
- [ ] Projects listing fetches all projects and categories from Sanity.
- [ ] Project detail fetches project by slug and renders the Sanity image gallery.
- [ ] `generateStaticParams` uses Sanity slugs.
- [ ] All fetches have a fallback to static data when env vars are absent (dev safety).
- [ ] Unit tests updated for components that now receive props.
- [ ] E2E tests pass (`npm run test:e2e`).
