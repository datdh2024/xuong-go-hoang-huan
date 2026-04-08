# US-01 — Connect Sanity CMS to All Pages (Replace Static Data)

**Jira:** [SR-873](https://synctrackreturns.atlassian.net/browse/SR-873)

## User Story

As a **content manager**, I want all website content to be fetched from Sanity CMS so that I can update text, images, and settings without touching the codebase.

## Background

- All pages currently display hardcoded/static data (from `src/lib/data.ts`)
- Sanity schemas and GROQ queries are already written but not yet wired to pages
- Before replacing with CMS data, hardcoded data must be pushed to Sanity first as sample data

## Goal

Replace all static placeholder content across the website with live data fetched from Sanity CMS, so content managers can edit everything from the Sanity Studio.

## Pages Affected

1. **Homepage** (`/`) — Hero slider, highlights section, projects grid, house templates catalogue, FAQ accordion, quote form options
2. **About page** (`/gioi-thieu`) — Stats, story text, team section
3. **Projects listing** (`/cong-trinh`) — Project cards with category filter
4. **Project detail** (`/cong-trinh/[slug]`) — Project description, image gallery, project info
5. **Contact page** (`/lien-he`) — Contact info (phone, email, address, hours), social links
6. **Shared layout** — Header (logo, nav, phone), Footer (contact info, nav links, social links, copyright)

## Acceptance Criteria

1. All text content visible on every page comes from Sanity CMS, not hardcoded data
2. All images visible on every page are served from Sanity's CDN
3. Content managers can edit any text, image, or setting from Sanity Studio and see the change on the website
4. The website renders correctly even when Sanity has minimal or empty data (graceful fallbacks)
5. Page load performance is not degraded (server-side fetching, no client-side data loading for initial render)
6. Category filter on projects page still works with CMS data
7. Hero slider cycles through CMS-managed slides
8. FAQ accordion displays CMS-managed questions and answers
9. Project detail pages are generated from CMS slugs (dynamic routes)
10. Contact information (phone, email, address, hours) is consistent across all pages (single source in CMS)

## Steps (High-Level)

1. Push all current hardcoded data from `src/lib/data.ts` into Sanity as sample documents
2. Wire GROQ queries from `src/sanity/lib/queries.ts` into each Server Component
3. Replace static data references with Sanity-fetched data on each page
4. Update shared layout components (Header, Footer) to use CMS data
5. Verify all pages render correctly with CMS data
6. Test that editing content in Sanity Studio reflects on the website

## Notes

- Use Server Components with `client.fetch(query)` — no client-side fetching for initial data
- The Sanity client reads from env vars: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`
- Existing Sanity schemas and queries are ready; this story is about wiring them up
