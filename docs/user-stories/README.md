# User Stories — Xưởng Gỗ Hoàng Huân

Website for a Vietnamese traditional woodworking company specializing in hand-crafted wooden houses (nhà gỗ cổ truyền).

**Stack:** Next.js 16.2, React 19, Sanity CMS, TailwindCSS 4, TypeScript

---

## Status Overview

| # | User Story | Category | Status |
|---|-----------|----------|--------|
| 01 | [Connect Sanity CMS to all pages](./US-01-connect-sanity-cms.md) | Core | pending |
| 02 | [Functional category filter on Projects page](./US-02-project-category-filter.md) | Core | pending |
| 03 | [Real project image gallery on Project Detail](./US-03-project-image-gallery.md) | Core | pending |
| 04 | [Dedicated House Templates page /mau-nha](./US-04-house-templates-page.md) | New Page | pending |
| 05 | [SEO sitemap, robots.txt, OpenGraph meta tags](./US-05-seo-sitemap-opengraph.md) | Infrastructure | pending |
| 06 | [Embed Google Maps on Contact page](./US-06-google-maps-embed.md) | Feature | pending |
| 07 | [Customer testimonials/reviews section](./US-07-testimonials.md) | Feature | pending |
| 08 | [Blog/News section (tin tức)](./US-08-blog-news.md) | New Page | pending |
| 09 | [Custom 404 Not Found page](./US-09-custom-404.md) | Feature | pending |
| 10 | [Loading skeleton UI (Suspense boundaries)](./US-10-loading-skeletons.md) | UX | pending |
| 11 | [Google Analytics 4 integration](./US-11-google-analytics.md) | Infrastructure | pending |
| 12 | [Project detail specs and materials info](./US-12-project-specs-schema.md) | CMS Schema | pending |
| 13 | [Zalo OA notifications and contact API hardening](./US-13-contact-api-hardening.md) | Infrastructure | pending |
| 14 | [Services page /dich-vu](./US-14-services-page.md) | New Page | pending |
| 15 | [Image lightbox/zoom viewer](./US-15-image-lightbox.md) | UX | pending |
| 16 | [Artisan Profiles section on About page](./US-16-artisan-profiles.md) | Feature | pending |
| 17 | [Dark mode support](./US-17-dark-mode.md) | UX | pending |
| 18 | [FAQ section (Câu hỏi thường gặp)](./US-18-faq-section.md) | Feature | pending |
| 19 | [House Template detail page /mau-nha/[slug]](./US-19-template-detail-page.md) | New Page | pending |

---

## Categories

- **Core** — Must-do to make the existing UI functional (data from Sanity)
- **New Page** — New routes/pages not yet built
- **Feature** — New components or sections on existing pages
- **CMS Schema** — Sanity schema extensions
- **Infrastructure** — SEO, analytics, API hardening
- **UX** — Loading states, dark mode, lightbox interactions

## Recommended Priority Order

1. US-01 Connect Sanity CMS (unblocks everything else)
2. US-12 Project detail specs (extend schema before connecting)
3. US-02 Category filter
4. US-03 Project gallery + US-15 Lightbox (do together)
5. US-04 House Templates page + US-19 Template detail (do together)
6. US-07 Testimonials
7. US-18 FAQ
8. US-05 SEO
9. US-06 Google Maps
10. US-09 Custom 404
11. US-14 Services page
12. US-08 Blog/News
13. US-16 Artisan profiles
14. US-10 Loading skeletons
15. US-11 GA4 analytics
16. US-13 Contact API hardening
17. US-17 Dark mode
