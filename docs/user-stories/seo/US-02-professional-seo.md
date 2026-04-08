# US-02 — Professional SEO & Social Sharing

## Story

**As a** business owner,
**I want** my website to have professional SEO and look great when shared on social media,
**so that** more potential customers can discover the site through Google search and social sharing.

## Goal

Ensure every page on the site is fully optimized for search engines (Google) and social media platforms (Facebook, Zalo, Twitter/X) by providing complete metadata, structured data, sitemap, robots.txt, and Open Graph / Twitter Card tags.

## Current State (observed 2026-04-08)

- Title tags: Present on all pages
- Meta descriptions: Present on all pages
- og:title, og:description: Present on homepage (other pages not confirmed)
- og:image: **MISSING on all pages** — social shares show no preview image
- og:url: **MISSING** — social platforms may not resolve the canonical URL
- og:site_name: **MISSING**
- twitter:card: Set to "summary" (should be "summary_large_image" for visual impact)
- twitter:image: **MISSING**
- Canonical link: **MISSING on all pages**
- Structured data (JSON-LD): **MISSING** — no LocalBusiness, Organization, or BreadcrumbList schema
- robots.txt: **MISSING** (returns 404)
- sitemap.xml: **MISSING** (returns 404)
- Heading structure: OK (single H1, proper H2/H3 hierarchy)
- Image alt texts: All present
- lang attribute: "vi" (correct)
- og:locale: "vi_VN" (correct)
- Favicon: Present

## Acceptance Criteria

1. **Open Graph tags complete on every page**: og:title, og:description, og:image (with absolute URL, min 1200x630px), og:url, og:type, og:site_name, og:locale
2. **Twitter Card tags on every page**: twitter:card set to "summary_large_image", twitter:title, twitter:description, twitter:image
3. **Canonical URL**: Every page has a `<link rel="canonical">` pointing to its own absolute URL
4. **robots.txt**: Accessible at `/robots.txt`, allows all crawlers, references sitemap URL
5. **sitemap.xml**: Accessible at `/sitemap.xml`, lists all public pages with lastmod dates
6. **Structured data (JSON-LD)**: Homepage includes LocalBusiness schema with name, address, phone, opening hours, and image. All pages include BreadcrumbList schema.
7. **OG image**: A default OG image exists (e.g., `/og-image.jpg`) used as fallback; individual pages may override with specific images
8. **Social share preview**: When a page URL is pasted into Facebook/Zalo/Twitter, a rich preview with image, title, and description is displayed
9. **No regressions**: Existing title tags, meta descriptions, heading structure, and alt texts remain intact

## Steps

1. Add a default OG image to the `/public` directory (1200x630px minimum)
2. Update root layout metadata to include complete OG and Twitter Card tags with sensible defaults
3. Ensure each page's metadata exports override og:title, og:description, og:url, and canonical appropriately
4. Create `robots.txt` (static file or Next.js route) allowing all crawlers and pointing to sitemap
5. Create `sitemap.xml` (Next.js generateSitemap or static) listing all public routes
6. Add JSON-LD structured data for LocalBusiness on the homepage and BreadcrumbList on all pages
7. Update twitter:card from "summary" to "summary_large_image"
8. Verify social share previews using Facebook Sharing Debugger or similar tool

## Notes

- The site domain/base URL must be configured (e.g., via env variable or hardcoded) so absolute URLs in metadata are correct for production
- Project detail pages (`/cong-trinh/[slug]`) should use the project's featured image as og:image when available
- Consider adding `keywords` meta tag with Vietnamese keywords related to "nha go", "nha tho ho", "xuong go" for additional SEO signal

## Test Cases

- [TC-02 — Professional SEO & Social Sharing](../../test-cases/seo/TC-02-professional-seo.md) — 16/16 PASS

*Last synced: 2026-04-08*
