# US-02 — Professional SEO & Social Sharing — Design Spec

**Date:** 2026-04-08
**Story:** [US-02](../../user-stories/seo/US-02-professional-seo.md)
**Test Cases:** [TC-02](../../test-cases/seo/TC-02-professional-seo.md)

---

## Overview

Add complete SEO metadata, Open Graph tags, Twitter Cards, structured data (JSON-LD), `robots.txt`, and `sitemap.xml` to every page on the site. The goal is to ensure rich previews on social platforms and proper indexing by search engines.

## Decisions

- **Base URL:** Hardcoded as `https://xuong-go-hoang-huan.vercel.app`
- **OG Image:** Static file in `/public/og-image.jpg` (1200x630px minimum). Project detail pages override with their Sanity thumbnail.
- **Sitemap:** Dynamic via `src/app/sitemap.ts`, fetches project slugs from Sanity.
- **JSON-LD:** Inline `<script>` tags in page components. Small helper for BreadcrumbList to avoid repetition.

---

## 1. SEO Config Constant

**File:** `src/lib/data.ts`

Add a `SITE_URL` constant:

```ts
export const SITE_URL = "https://xuong-go-hoang-huan.vercel.app";
```

All metadata and structured data reference this for absolute URL construction.

---

## 2. Root Layout Metadata

**File:** `src/app/layout.tsx`

Enhance the existing `metadata` export:

- `metadataBase: new URL(SITE_URL)` — Next.js resolves all relative OG/twitter image URLs to absolute using this
- `openGraph.url: SITE_URL`
- `openGraph.siteName: "Xưởng Gỗ Hoàng Huân"`
- `openGraph.images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Xưởng Gỗ Hoàng Huân" }]`
- `twitter.card: "summary_large_image"`
- `twitter.title` and `twitter.description` matching existing OG values
- `twitter.images: ["/og-image.jpg"]`
- `alternates.canonical: "/"`

These serve as defaults. Sub-pages override `openGraph.url`, `openGraph.title`, `openGraph.description`, and `alternates.canonical`.

---

## 3. Per-Page Metadata

### Homepage (`src/app/(site)/page.tsx`)

Currently has no metadata export. Add one:

```ts
export const metadata: Metadata = {
  openGraph: {
    url: "/",
  },
  alternates: {
    canonical: "/",
  },
};
```

Title/description/OG image inherit from root layout defaults (which already match homepage content).

### About (`src/app/(site)/gioi-thieu/page.tsx`)

Enhance existing metadata:

```ts
export const metadata: Metadata = {
  title: "Giới thiệu",
  description: "Xưởng Gỗ Hoàng Huân - 40 năm tâm huyết...",
  openGraph: {
    title: "Giới thiệu",
    description: "Xưởng Gỗ Hoàng Huân - 40 năm tâm huyết...",
    url: "/gioi-thieu",
  },
  alternates: {
    canonical: "/gioi-thieu",
  },
};
```

### Projects Listing (`src/app/(site)/cong-trinh/page.tsx`)

Same pattern — add `openGraph` and `alternates.canonical` with `/cong-trinh`.

### Contact (`src/app/(site)/lien-he/page.tsx`)

Same pattern — add `openGraph` and `alternates.canonical` with `/lien-he`.

### Project Detail (`src/app/(site)/cong-trinh/[slug]/page.tsx`)

Enhance existing `generateMetadata` to include:

- `openGraph.title`, `openGraph.description` from project data
- `openGraph.url: /cong-trinh/${slug}`
- `openGraph.images`: Use project's Sanity `thumbnail` URL if available, otherwise fall back to default `/og-image.jpg`
- `alternates.canonical: /cong-trinh/${slug}`

---

## 4. Static OG Image

**File:** `public/og-image.jpg`

A placeholder image (1200x630px) will be created. The user should replace it with a branded image featuring the company name/logo. This file is referenced by all pages as the default `og:image`.

---

## 5. robots.txt

**File:** `src/app/robots.ts` (new)

Next.js App Router convention for dynamic robots generation:

```ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/studio", "/api/"],
      },
    ],
    sitemap: "https://xuong-go-hoang-huan.vercel.app/sitemap.xml",
  };
}
```

Output:
```
User-agent: *
Allow: /
Disallow: /studio
Disallow: /api/
Sitemap: https://xuong-go-hoang-huan.vercel.app/sitemap.xml
```

---

## 6. sitemap.xml

**File:** `src/app/sitemap.ts` (new)

Dynamic sitemap using Next.js convention:

```ts
import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://xuong-go-hoang-huan.vercel.app";

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/gioi-thieu`, lastModified: new Date() },
    { url: `${baseUrl}/cong-trinh`, lastModified: new Date() },
    { url: `${baseUrl}/lien-he`, lastModified: new Date() },
  ];

  // Dynamic project routes from Sanity
  const slugs = await client.fetch<{ slug: string }[]>(
    `*[_type == "project" && defined(slug.current)]{ "slug": slug.current }`
  );

  const projectRoutes: MetadataRoute.Sitemap = slugs.map((s) => ({
    url: `${baseUrl}/cong-trinh/${s.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...projectRoutes];
}
```

---

## 7. JSON-LD Structured Data

### BreadcrumbList Helper

**Location:** `src/lib/seo.ts` (new file). Shared across all pages:

```ts
function generateBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
```

### Homepage — LocalBusiness

Rendered as `<script type="application/ld+json">` in the homepage component:

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Xưởng Gỗ Hoàng Huân",
  "image": "https://xuong-go-hoang-huan.vercel.app/og-image.jpg",
  "telephone": "+84 (phone from SITE_SETTINGS)",
  "email": "(email from SITE_SETTINGS)",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "(from SITE_SETTINGS)",
    "addressLocality": "(city)",
    "addressCountry": "VN"
  },
  "url": "https://xuong-go-hoang-huan.vercel.app"
}
```

Values sourced from the existing `SITE_SETTINGS` object in `src/lib/data.ts`.

### Sub-pages — BreadcrumbList

Each sub-page renders a BreadcrumbList JSON-LD:

- `/gioi-thieu`: Home > Giới thiệu
- `/cong-trinh`: Home > Công trình
- `/lien-he`: Home > Liên hệ
- `/cong-trinh/[slug]`: Home > Công trình > {Project Title}

---

## 8. Files Summary

| Action | File | What changes |
|--------|------|-------------|
| Edit | `src/lib/data.ts` | Add `SITE_URL` constant |
| Edit | `src/app/layout.tsx` | Add `metadataBase`, complete OG tags, twitter card, canonical |
| Edit | `src/app/(site)/page.tsx` | Add metadata export, LocalBusiness JSON-LD |
| Edit | `src/app/(site)/gioi-thieu/page.tsx` | Add OG overrides, canonical, BreadcrumbList JSON-LD |
| Edit | `src/app/(site)/cong-trinh/page.tsx` | Add OG overrides, canonical, BreadcrumbList JSON-LD |
| Edit | `src/app/(site)/cong-trinh/[slug]/page.tsx` | Enhance generateMetadata with OG image + canonical, add BreadcrumbList JSON-LD |
| Edit | `src/app/(site)/lien-he/page.tsx` | Add OG overrides, canonical, BreadcrumbList JSON-LD |
| Create | `src/app/robots.ts` | robots.txt generation |
| Create | `src/app/sitemap.ts` | sitemap.xml generation with Sanity project slugs |
| Create | `public/og-image.jpg` | Default OG image placeholder (1200x630) |

---

## 9. What This Does NOT Include

- No Sanity schema changes (no custom SEO fields in CMS)
- No dynamic OG image generation (`@vercel/og`)
- No `keywords` meta tag beyond what already exists in root layout
- No redirect rules or trailing slash handling
- No performance/Core Web Vitals optimizations

---

## 10. Acceptance Criteria Mapping

| AC | Covered by |
|----|-----------|
| 1. Complete OG tags on every page | Sections 2, 3 |
| 2. Twitter Card tags | Section 2 (root layout defaults) |
| 3. Canonical URL on every page | Sections 2, 3 |
| 4. robots.txt | Section 5 |
| 5. sitemap.xml | Section 6 |
| 6. JSON-LD (LocalBusiness + BreadcrumbList) | Section 7 |
| 7. Default OG image with fallback | Section 4, project detail in Section 3 |
| 8. Social share preview | All OG/twitter tags combined |
| 9. No regressions | Existing titles/descriptions preserved, only enhanced |
