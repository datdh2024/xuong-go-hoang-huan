# US-02 Professional SEO & Social Sharing — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add complete SEO metadata, Open Graph tags, Twitter Cards, structured data (JSON-LD), robots.txt, and sitemap.xml so every page is optimized for Google and social sharing.

**Architecture:** Centralize the site URL in `src/lib/data.ts`, set `metadataBase` in root layout so Next.js resolves all relative URLs to absolute, enhance per-page metadata exports, create `robots.ts` and `sitemap.ts` using Next.js App Router conventions, and inject JSON-LD structured data via inline `<script>` tags.

**Tech Stack:** Next.js 16 (App Router metadata API), Sanity GROQ queries, TypeScript

---

## File Map

| Action | File | Responsibility |
|--------|------|---------------|
| Edit | `src/lib/data.ts` | Add `SITE_URL` constant |
| Create | `src/lib/seo.ts` | `generateBreadcrumbJsonLd` helper + `generateLocalBusinessJsonLd` helper |
| Edit | `src/app/layout.tsx` | Root metadata: `metadataBase`, OG, twitter, canonical defaults |
| Edit | `src/app/(site)/page.tsx` | Homepage metadata export + LocalBusiness JSON-LD |
| Edit | `src/app/(site)/gioi-thieu/page.tsx` | OG overrides, canonical, BreadcrumbList JSON-LD |
| Edit | `src/app/(site)/cong-trinh/page.tsx` | OG overrides, canonical, BreadcrumbList JSON-LD |
| Edit | `src/app/(site)/cong-trinh/[slug]/page.tsx` | OG image from thumbnail, canonical, BreadcrumbList JSON-LD |
| Edit | `src/app/(site)/lien-he/page.tsx` | OG overrides, canonical, BreadcrumbList JSON-LD |
| Create | `src/app/robots.ts` | robots.txt generation |
| Create | `src/app/sitemap.ts` | sitemap.xml generation with Sanity project slugs |
| Create | `public/og-image.jpg` | Default OG image placeholder (1200x630) |
| Create | `tests/e2e/seo.spec.ts` | E2E tests for all SEO acceptance criteria |

---

### Task 1: Add SITE_URL constant and SEO helpers

**Files:**
- Modify: `src/lib/data.ts:1` (add constant at top)
- Create: `src/lib/seo.ts`

- [ ] **Step 1: Add SITE_URL to data.ts**

Add at line 1 of `src/lib/data.ts`, before the existing `SITE_SETTINGS`:

```ts
export const SITE_URL = "https://xuong-go-hoang-huan.vercel.app";
```

- [ ] **Step 2: Create src/lib/seo.ts with JSON-LD helpers**

```ts
import { SITE_URL, SITE_SETTINGS } from "@/lib/data";

export function generateBreadcrumbJsonLd(
  items: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function generateLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE_SETTINGS.companyName,
    image: `${SITE_URL}/og-image.jpg`,
    telephone: SITE_SETTINGS.phone,
    email: SITE_SETTINGS.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE_SETTINGS.address,
      addressCountry: "VN",
    },
    url: SITE_URL,
  };
}
```

- [ ] **Step 3: Verify no TypeScript errors**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors related to `seo.ts` or `data.ts`

- [ ] **Step 4: Commit**

```bash
git add src/lib/data.ts src/lib/seo.ts
git commit -m "feat(seo): add SITE_URL constant and JSON-LD helper functions"
```

---

### Task 2: Create default OG image placeholder

**Files:**
- Create: `public/og-image.jpg`

- [ ] **Step 1: Generate a 1200x630 placeholder OG image**

Use ImageMagick (or any available tool) to create a simple placeholder:

```bash
npx sharp-cli --input "create" --width 1200 --height 630 --channels 3 --background "#5C3D2E" --output public/og-image.jpg 2>/dev/null || node -e "
const { createCanvas } = require('canvas');
const fs = require('fs');
const c = createCanvas(1200, 630);
const ctx = c.getContext('2d');
ctx.fillStyle = '#5C3D2E';
ctx.fillRect(0, 0, 1200, 630);
ctx.fillStyle = '#D4A843';
ctx.font = 'bold 48px sans-serif';
ctx.textAlign = 'center';
ctx.fillText('Xuong Go Hoang Huan', 600, 300);
ctx.font = '24px sans-serif';
ctx.fillText('Giu Hon Kien Truc Viet', 600, 360);
fs.writeFileSync('public/og-image.jpg', c.toBuffer('image/jpeg'));
" 2>/dev/null || echo "PLACEHOLDER_NEEDED"
```

If neither tool is available, create a minimal valid JPEG using a base64 approach or note that the user must provide a real branded image. The file just needs to exist at `public/og-image.jpg` for metadata to reference it.

- [ ] **Step 2: Commit**

```bash
git add public/og-image.jpg
git commit -m "feat(seo): add default OG image placeholder (1200x630)"
```

---

### Task 3: Enhance root layout metadata

**Files:**
- Modify: `src/app/layout.tsx:1-44`

- [ ] **Step 1: Update the metadata export in layout.tsx**

Replace the existing `metadata` export (lines 21-44) with:

```ts
import { SITE_URL } from "@/lib/data";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Xưởng Gỗ Hoàng Huân - Giữ Hồn Kiến Trúc Việt",
    template: "%s | Xưởng Gỗ Hoàng Huân",
  },
  description:
    "Xưởng Gỗ Hoàng Huân - Chuyên thi công nhà gỗ cổ truyền, nhà thờ họ, đồ thờ gỗ cao cấp. 40 năm kinh nghiệm, hàng trăm công trình toàn quốc. Tư vấn miễn phí - Bảo hành dài hạn.",
  keywords: [
    "xưởng gỗ Hoàng Huân",
    "nhà gỗ cổ truyền Hà Nội",
    "thi công nhà gỗ",
    "nhà gỗ 3 gian 5 gian",
    "nhà thờ họ bằng gỗ",
    "đồ thờ gỗ cao cấp",
    "xưởng mộc Hà Nội",
  ],
  openGraph: {
    title: "Xưởng Gỗ Hoàng Huân - Giữ Hồn Kiến Trúc Việt",
    description:
      "Chuyên thi công nhà gỗ cổ truyền, nhà thờ họ, đồ thờ gỗ cao cấp. 40 năm kinh nghiệm.",
    type: "website",
    locale: "vi_VN",
    url: "/",
    siteName: "Xưởng Gỗ Hoàng Huân",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Xưởng Gỗ Hoàng Huân - Giữ Hồn Kiến Trúc Việt",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Xưởng Gỗ Hoàng Huân - Giữ Hồn Kiến Trúc Việt",
    description:
      "Chuyên thi công nhà gỗ cổ truyền, nhà thờ họ, đồ thờ gỗ cao cấp. 40 năm kinh nghiệm.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "/",
  },
};
```

Note: The `import { SITE_URL }` line goes with the other imports at the top of the file (after line 1).

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat(seo): add complete OG, twitter card, and canonical to root layout"
```

---

### Task 4: Add homepage metadata and LocalBusiness JSON-LD

**Files:**
- Modify: `src/app/(site)/page.tsx:1-36`

- [ ] **Step 1: Add metadata export and JSON-LD to homepage**

Add imports and metadata at the top of the file, after the existing imports:

```ts
import type { Metadata } from "next";
import { generateLocalBusinessJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  openGraph: {
    url: "/",
  },
  alternates: {
    canonical: "/",
  },
};
```

Then inside the `HomePage` component, add the JSON-LD script as the first child inside the `<>` fragment (before `<HeroSlider>`):

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(generateLocalBusinessJsonLd()),
  }}
/>
```

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add "src/app/(site)/page.tsx"
git commit -m "feat(seo): add homepage metadata and LocalBusiness JSON-LD"
```

---

### Task 5: Add OG/canonical/BreadcrumbList to About page

**Files:**
- Modify: `src/app/(site)/gioi-thieu/page.tsx:1-9`

- [ ] **Step 1: Update metadata and add JSON-LD**

Replace the existing metadata export (lines 6-9) with:

```ts
import { generateBreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Giới thiệu",
  description:
    "Xưởng Gỗ Hoàng Huân - 40 năm tâm huyết với nghề mộc truyền thống, chuyên thi công nhà gỗ cổ truyền Bắc Bộ.",
  openGraph: {
    title: "Giới thiệu",
    description:
      "Xưởng Gỗ Hoàng Huân - 40 năm tâm huyết với nghề mộc truyền thống, chuyên thi công nhà gỗ cổ truyền Bắc Bộ.",
    url: "/gioi-thieu",
  },
  alternates: {
    canonical: "/gioi-thieu",
  },
};
```

Add the `generateBreadcrumbJsonLd` import at the top with other imports.

Then add the BreadcrumbList JSON-LD as the first child inside the return's `<div className="pt-24">`:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(
      generateBreadcrumbJsonLd([
        { name: "Trang chủ", path: "/" },
        { name: "Giới thiệu", path: "/gioi-thieu" },
      ])
    ),
  }}
/>
```

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add "src/app/(site)/gioi-thieu/page.tsx"
git commit -m "feat(seo): add OG, canonical, BreadcrumbList to about page"
```

---

### Task 6: Add OG/canonical/BreadcrumbList to Projects listing page

**Files:**
- Modify: `src/app/(site)/cong-trinh/page.tsx:1-9`

- [ ] **Step 1: Update metadata and add JSON-LD**

Replace the existing metadata export (lines 6-9) with:

```ts
import { generateBreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Công trình",
  description:
    "Các công trình nhà gỗ cổ truyền đã thi công của Xưởng Gỗ Hoàng Huân trên khắp cả nước.",
  openGraph: {
    title: "Công trình",
    description:
      "Các công trình nhà gỗ cổ truyền đã thi công của Xưởng Gỗ Hoàng Huân trên khắp cả nước.",
    url: "/cong-trinh",
  },
  alternates: {
    canonical: "/cong-trinh",
  },
};
```

Add the `generateBreadcrumbJsonLd` import at the top with other imports.

Then add BreadcrumbList JSON-LD as first child inside `<div className="pt-24">`:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(
      generateBreadcrumbJsonLd([
        { name: "Trang chủ", path: "/" },
        { name: "Công trình", path: "/cong-trinh" },
      ])
    ),
  }}
/>
```

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add "src/app/(site)/cong-trinh/page.tsx"
git commit -m "feat(seo): add OG, canonical, BreadcrumbList to projects page"
```

---

### Task 7: Add OG/canonical/BreadcrumbList to Contact page

**Files:**
- Modify: `src/app/(site)/lien-he/page.tsx:1-9`

- [ ] **Step 1: Update metadata and add JSON-LD**

Replace the existing metadata export (lines 6-9) with:

```ts
import { generateBreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Liên hệ",
  description:
    "Liên hệ với Xưởng Gỗ Hoàng Huân để được tư vấn và báo giá thi công nhà gỗ cổ truyền miễn phí.",
  openGraph: {
    title: "Liên hệ",
    description:
      "Liên hệ với Xưởng Gỗ Hoàng Huân để được tư vấn và báo giá thi công nhà gỗ cổ truyền miễn phí.",
    url: "/lien-he",
  },
  alternates: {
    canonical: "/lien-he",
  },
};
```

Add the `generateBreadcrumbJsonLd` import at the top with other imports.

Then add BreadcrumbList JSON-LD as first child inside `<div className="pt-24">`:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(
      generateBreadcrumbJsonLd([
        { name: "Trang chủ", path: "/" },
        { name: "Liên hệ", path: "/lien-he" },
      ])
    ),
  }}
/>
```

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add "src/app/(site)/lien-he/page.tsx"
git commit -m "feat(seo): add OG, canonical, BreadcrumbList to contact page"
```

---

### Task 8: Enhance project detail page with OG image and BreadcrumbList

**Files:**
- Modify: `src/app/(site)/cong-trinh/[slug]/page.tsx:1-18`

- [ ] **Step 1: Update generateMetadata to include OG and canonical**

Replace the existing `generateMetadata` function (lines 10-18) with:

```ts
import { generateBreadcrumbJsonLd } from "@/lib/seo";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      url: `/cong-trinh/${slug}`,
      images: project.thumbnail
        ? [{ url: project.thumbnail, alt: project.title }]
        : undefined,
    },
    alternates: {
      canonical: `/cong-trinh/${slug}`,
    },
  };
}
```

Add the `generateBreadcrumbJsonLd` import at the top with other imports.

- [ ] **Step 2: Add BreadcrumbList JSON-LD to the component**

In the `ProjectDetailPage` component, add as first child inside `<div className="pt-24">`:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(
      generateBreadcrumbJsonLd([
        { name: "Trang chủ", path: "/" },
        { name: "Công trình", path: "/cong-trinh" },
        { name: project.title, path: `/cong-trinh/${slug}` },
      ])
    ),
  }}
/>
```

- [ ] **Step 3: Verify build**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add "src/app/(site)/cong-trinh/[slug]/page.tsx"
git commit -m "feat(seo): add OG image, canonical, BreadcrumbList to project detail"
```

---

### Task 9: Create robots.ts

**Files:**
- Create: `src/app/robots.ts`

- [ ] **Step 1: Create the robots.ts file**

```ts
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/data";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/studio", "/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
```

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/app/robots.ts
git commit -m "feat(seo): add robots.txt via Next.js robots.ts"
```

---

### Task 10: Create sitemap.ts

**Files:**
- Create: `src/app/sitemap.ts`

- [ ] **Step 1: Create the sitemap.ts file**

```ts
import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { SITE_URL } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date() },
    { url: `${SITE_URL}/gioi-thieu`, lastModified: new Date() },
    { url: `${SITE_URL}/cong-trinh`, lastModified: new Date() },
    { url: `${SITE_URL}/lien-he`, lastModified: new Date() },
  ];

  let projectRoutes: MetadataRoute.Sitemap = [];
  try {
    const slugs = await client.fetch<{ slug: string }[]>(
      `*[_type == "project" && defined(slug.current)]{ "slug": slug.current }`
    );
    projectRoutes = slugs.map((s) => ({
      url: `${SITE_URL}/cong-trinh/${s.slug}`,
      lastModified: new Date(),
    }));
  } catch {
    // If Sanity is unreachable, return static routes only
  }

  return [...staticRoutes, ...projectRoutes];
}
```

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/app/sitemap.ts
git commit -m "feat(seo): add sitemap.xml with dynamic project routes from Sanity"
```

---

### Task 11: Write E2E tests for SEO

**Files:**
- Create: `tests/e2e/seo.spec.ts`

- [ ] **Step 1: Write the E2E test file**

```ts
import { test, expect } from "@playwright/test";

test.describe("TC-02: Professional SEO & Social Sharing", () => {
  // TC-02-01
  test("homepage has complete Open Graph tags", async ({ page }) => {
    await page.goto("/");
    const ogTitle = page.locator('meta[property="og:title"]');
    const ogDesc = page.locator('meta[property="og:description"]');
    const ogImage = page.locator('meta[property="og:image"]');
    const ogUrl = page.locator('meta[property="og:url"]');
    const ogType = page.locator('meta[property="og:type"]');
    const ogSiteName = page.locator('meta[property="og:site_name"]');
    const ogLocale = page.locator('meta[property="og:locale"]');

    await expect(ogTitle).toHaveAttribute("content", /.+/);
    await expect(ogDesc).toHaveAttribute("content", /.+/);
    await expect(ogImage).toHaveAttribute("content", /https?:\/\/.+/);
    await expect(ogUrl).toHaveAttribute("content", /.+/);
    await expect(ogType).toHaveAttribute("content", "website");
    await expect(ogSiteName).toHaveAttribute("content", /.+/);
    await expect(ogLocale).toHaveAttribute("content", "vi_VN");
  });

  // TC-02-02
  test("sub-pages have page-specific OG tags", async ({ page }) => {
    for (const path of ["/gioi-thieu", "/cong-trinh", "/lien-he"]) {
      await page.goto(path);
      const ogTitle = page.locator('meta[property="og:title"]');
      const ogDesc = page.locator('meta[property="og:description"]');
      const ogUrl = page.locator('meta[property="og:url"]');
      await expect(ogTitle).toHaveAttribute("content", /.+/);
      await expect(ogDesc).toHaveAttribute("content", /.+/);
      await expect(ogUrl).toHaveAttribute("content", new RegExp(path));
    }
  });

  // TC-02-03
  test("Twitter Card tags present with large image", async ({ page }) => {
    await page.goto("/");
    const card = page.locator('meta[name="twitter:card"]');
    const title = page.locator('meta[name="twitter:title"]');
    const desc = page.locator('meta[name="twitter:description"]');
    const image = page.locator('meta[name="twitter:image"]');
    await expect(card).toHaveAttribute("content", "summary_large_image");
    await expect(title).toHaveAttribute("content", /.+/);
    await expect(desc).toHaveAttribute("content", /.+/);
    await expect(image).toHaveAttribute("content", /https?:\/\/.+/);
  });

  // TC-02-04
  test("canonical URL present on every page", async ({ page }) => {
    const pages = [
      { path: "/", pattern: /\/$/ },
      { path: "/gioi-thieu", pattern: /\/gioi-thieu$/ },
      { path: "/cong-trinh", pattern: /\/cong-trinh$/ },
      { path: "/lien-he", pattern: /\/lien-he$/ },
    ];
    for (const { path, pattern } of pages) {
      await page.goto(path);
      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical).toHaveAttribute("href", pattern);
    }
  });

  // TC-02-05
  test("robots.txt is accessible and correct", async ({ page }) => {
    const response = await page.goto("/robots.txt");
    expect(response?.status()).toBe(200);
    const body = await page.textContent("body");
    expect(body).toContain("User-agent: *");
    expect(body).toContain("Allow: /");
    expect(body).toContain("Disallow: /studio");
    expect(body).toContain("sitemap");
  });

  // TC-02-06
  test("sitemap.xml is accessible and lists pages", async ({ page }) => {
    const response = await page.goto("/sitemap.xml");
    expect(response?.status()).toBe(200);
    const body = await page.content();
    expect(body).toContain("<loc>");
    expect(body).toContain("/gioi-thieu");
    expect(body).toContain("/cong-trinh");
    expect(body).toContain("/lien-he");
  });

  // TC-02-07
  test("homepage has LocalBusiness JSON-LD", async ({ page }) => {
    await page.goto("/");
    const jsonLd = page.locator('script[type="application/ld+json"]');
    const count = await jsonLd.count();
    expect(count).toBeGreaterThan(0);

    let foundLocalBusiness = false;
    for (let i = 0; i < count; i++) {
      const text = await jsonLd.nth(i).textContent();
      if (text && text.includes("LocalBusiness")) {
        const data = JSON.parse(text);
        expect(data["@type"]).toBe("LocalBusiness");
        expect(data.name).toBeTruthy();
        expect(data.telephone).toBeTruthy();
        expect(data.address).toBeTruthy();
        foundLocalBusiness = true;
        break;
      }
    }
    expect(foundLocalBusiness).toBe(true);
  });

  // TC-02-08
  test("OG image URL is accessible", async ({ page, request }) => {
    await page.goto("/");
    const ogImage = page.locator('meta[property="og:image"]');
    const imageUrl = await ogImage.getAttribute("content");
    expect(imageUrl).toBeTruthy();
    const response = await request.get(imageUrl!);
    expect(response.status()).toBe(200);
  });

  // TC-02-09
  test("sub-pages have BreadcrumbList JSON-LD", async ({ page }) => {
    for (const path of ["/gioi-thieu", "/cong-trinh", "/lien-he"]) {
      await page.goto(path);
      const jsonLd = page.locator('script[type="application/ld+json"]');
      const count = await jsonLd.count();
      let foundBreadcrumb = false;
      for (let i = 0; i < count; i++) {
        const text = await jsonLd.nth(i).textContent();
        if (text && text.includes("BreadcrumbList")) {
          const data = JSON.parse(text);
          expect(data["@type"]).toBe("BreadcrumbList");
          expect(data.itemListElement.length).toBeGreaterThanOrEqual(2);
          foundBreadcrumb = true;
          break;
        }
      }
      expect(foundBreadcrumb).toBe(true);
    }
  });

  // TC-02-11
  test("OG tags use absolute URLs", async ({ page }) => {
    await page.goto("/");
    const ogImage = page.locator('meta[property="og:image"]');
    const ogUrl = page.locator('meta[property="og:url"]');
    const canonical = page.locator('link[rel="canonical"]');

    const imageContent = await ogImage.getAttribute("content");
    const urlContent = await ogUrl.getAttribute("content");
    const canonicalHref = await canonical.getAttribute("href");

    expect(imageContent).toMatch(/^https?:\/\//);
    expect(urlContent).toMatch(/^https?:\/\//);
    expect(canonicalHref).toMatch(/^https?:\/\//);
  });

  // TC-02-12
  test("heading structure correct after SEO changes", async ({ page }) => {
    await page.goto("/");
    const h1Count = await page.locator("h1").count();
    expect(h1Count).toBe(1);
  });

  // TC-02-13
  test("existing meta descriptions preserved", async ({ page }) => {
    const pages = [
      { path: "/", desc: /nhà gỗ cổ truyền/i },
      { path: "/gioi-thieu", desc: /40 năm/i },
      { path: "/cong-trinh", desc: /công trình/i },
      { path: "/lien-he", desc: /tư vấn/i },
    ];
    for (const { path, desc } of pages) {
      await page.goto(path);
      const metaDesc = page.locator('meta[name="description"]');
      await expect(metaDesc).toHaveAttribute("content", desc);
    }
  });

  // TC-02-14
  test("robots.txt does not block public pages", async ({ page }) => {
    await page.goto("/robots.txt");
    const body = await page.textContent("body");
    // Should not disallow root or public pages
    expect(body).not.toMatch(/Disallow:\s*\/\s*$/m);
    expect(body).not.toContain("Disallow: /gioi-thieu");
    expect(body).not.toContain("Disallow: /cong-trinh");
    expect(body).not.toContain("Disallow: /lien-he");
  });

  // TC-02-15
  test("sitemap.xml does not include private routes", async ({ page }) => {
    await page.goto("/sitemap.xml");
    const body = await page.content();
    expect(body).not.toContain("/studio");
    expect(body).not.toContain("/api/");
  });
});
```

- [ ] **Step 2: Run the E2E tests to verify they pass**

Run: `npx playwright test tests/e2e/seo.spec.ts --reporter=list`
Expected: All tests pass

- [ ] **Step 3: Commit**

```bash
git add tests/e2e/seo.spec.ts
git commit -m "test(seo): add E2E tests for SEO metadata, robots, sitemap, JSON-LD"
```

---

### Task 12: Final verification — build and full E2E suite

**Files:** None (verification only)

- [ ] **Step 1: Run production build**

Run: `npm run build`
Expected: Build succeeds with no errors

- [ ] **Step 2: Run full E2E test suite**

Run: `npx playwright test --reporter=list`
Expected: All tests pass including new SEO tests and existing tests (no regressions)

- [ ] **Step 3: Verify dev server manually**

Run: `npm run dev` then check:
- `http://localhost:3000` — view source, confirm og:image, og:url, og:site_name, twitter:card present
- `http://localhost:3000/robots.txt` — returns valid robots.txt
- `http://localhost:3000/sitemap.xml` — returns valid XML sitemap

- [ ] **Step 4: Final commit if any fixes needed**

```bash
git add -A
git commit -m "feat(seo): US-02 Professional SEO & Social Sharing complete"
```
