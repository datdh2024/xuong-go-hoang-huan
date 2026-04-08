# TC-02 — Professional SEO & Social Sharing

**Linked Story:** [US-02 — Professional SEO & Social Sharing](../../user-stories/seo/US-02-professional-seo.md)

---

## Happy Path

### TC-02-01: Homepage has complete Open Graph tags

- **test-result:** PASS
- **test-result-note:** All OG tags present: og:title, og:description, og:image (absolute URL), og:url, og:type="website", og:site_name, og:locale="vi_VN"
- **type:** happy_path
- **description:** Verify the homepage includes all required OG meta tags
- **precondition:** Site is deployed/running
- **steps:**
  1. Navigate to the homepage
  2. Inspect the page source or use a meta tag checker
- **expected_result:** The following OG tags are present with non-empty values: og:title, og:description, og:image (absolute URL), og:url, og:type ("website"), og:site_name, og:locale ("vi_VN")

### TC-02-02: Sub-pages have page-specific Open Graph tags

- **test-result:** PASS
- **test-result-note:** /gioi-thieu, /cong-trinh, /lien-he each have unique og:title, og:description, og:url matching page content
- **type:** happy_path
- **description:** Verify /gioi-thieu, /cong-trinh, and /lien-he each have their own OG title, description, and URL
- **precondition:** Site is deployed/running
- **steps:**
  1. Navigate to /gioi-thieu
  2. Check og:title, og:description, og:url meta tags
  3. Repeat for /cong-trinh and /lien-he
- **expected_result:** Each page has unique og:title and og:description matching the page content; og:url matches the page's canonical URL

### TC-02-03: Twitter Card tags present with large image format

- **test-result:** PASS
- **test-result-note:** twitter:card="summary_large_image", twitter:title, twitter:description, twitter:image all present with non-empty values
- **type:** happy_path
- **description:** Verify Twitter Card tags are present and configured for large image preview
- **precondition:** Site is deployed/running
- **steps:**
  1. Navigate to the homepage
  2. Check for twitter:card, twitter:title, twitter:description, twitter:image meta tags
- **expected_result:** twitter:card is set to "summary_large_image"; twitter:title, twitter:description, and twitter:image are present with non-empty values

### TC-02-04: Canonical URL present on every page

- **test-result:** PASS
- **test-result-note:** All 4 pages (/, /gioi-thieu, /cong-trinh, /lien-he) have canonical link with absolute URL
- **type:** happy_path
- **description:** Verify each page has a canonical link tag pointing to itself
- **precondition:** Site is deployed/running
- **steps:**
  1. Navigate to homepage, check for `<link rel="canonical">`
  2. Repeat for /gioi-thieu, /cong-trinh, /lien-he
- **expected_result:** Each page has a `<link rel="canonical" href="...">` with the absolute URL of that page

### TC-02-05: robots.txt is accessible and correctly configured

- **test-result:** PASS
- **test-result-note:** Returns valid robots.txt with User-Agent: *, Allow: /, Disallow: /studio and /api/, references sitemap URL
- **type:** happy_path
- **description:** Verify robots.txt exists and allows crawling
- **precondition:** Site is deployed/running
- **steps:**
  1. Navigate to /robots.txt
- **expected_result:** Returns a valid robots.txt file (not a 404 page); contains "User-agent: *" and "Allow: /"; references the sitemap URL

### TC-02-06: sitemap.xml is accessible and lists all public pages

- **test-result:** PASS
- **test-result-note:** Valid XML sitemap includes /, /gioi-thieu, /cong-trinh, /lien-he plus 7 project detail pages, all with lastmod dates
- **type:** happy_path
- **description:** Verify sitemap.xml exists and includes all public routes
- **precondition:** Site is deployed/running
- **steps:**
  1. Navigate to /sitemap.xml
- **expected_result:** Returns valid XML sitemap; includes URLs for /, /gioi-thieu, /cong-trinh, /lien-he; each URL has a lastmod date

### TC-02-07: JSON-LD structured data on homepage

- **test-result:** PASS
- **test-result-note:** Valid JSON-LD with @type "LocalBusiness" including name, address, telephone, image, email, url
- **type:** happy_path
- **description:** Verify the homepage includes LocalBusiness structured data
- **precondition:** Site is deployed/running
- **steps:**
  1. Navigate to the homepage
  2. Check for `<script type="application/ld+json">` in the page source
- **expected_result:** A valid JSON-LD script exists with @type "LocalBusiness" (or "Organization") including name, address, telephone, and image properties

### TC-02-08: OG image is accessible and correct dimensions

- **test-result:** PASS
- **test-result-note:** Image loads successfully (HTTP 200), dimensions 2048x1536 exceed minimum 1200x630
- **type:** happy_path
- **description:** Verify the default OG image file exists and meets minimum size requirements
- **precondition:** Site is deployed/running
- **steps:**
  1. Check the og:image URL from the homepage meta tags
  2. Load the image URL directly in the browser
- **expected_result:** Image loads successfully; dimensions are at least 1200x630px

### TC-02-09: BreadcrumbList structured data on sub-pages

- **test-result:** PASS
- **test-result-note:** All 3 sub-pages have BreadcrumbList JSON-LD with correct hierarchy (Trang chủ > Page Name)
- **type:** happy_path
- **description:** Verify sub-pages include BreadcrumbList JSON-LD schema
- **precondition:** Site is deployed/running
- **steps:**
  1. Navigate to /gioi-thieu
  2. Check for `<script type="application/ld+json">` with BreadcrumbList
  3. Repeat for /cong-trinh, /lien-he
- **expected_result:** Each sub-page has a BreadcrumbList JSON-LD with correct hierarchy (Home > Page Name)

---

## Edge Cases

### TC-02-10: Project detail page uses project-specific OG image

- **test-result:** PASS
- **test-result-note:** /cong-trinh/nha-tho-ho-dai-tao uses Sanity CDN image (cdn.sanity.io), not default og-image.jpg
- **type:** edge_case
- **description:** Verify that a project detail page (/cong-trinh/[slug]) uses the project's featured image as og:image instead of the default
- **precondition:** At least one project with a featured image exists
- **steps:**
  1. Navigate to a project detail page (e.g., /cong-trinh/nha-tho-ho)
  2. Check the og:image meta tag
- **expected_result:** og:image points to the project's specific featured image, not the site-wide default OG image

### TC-02-11: OG tags use absolute URLs (not relative)

- **test-result:** PASS
- **test-result-note:** All og:image, og:url, and canonical URLs are absolute (https://xuong-go-hoang-huan.vercel.app/...)
- **type:** edge_case
- **description:** Verify all URL-based OG tags use absolute URLs starting with https://
- **precondition:** Site is deployed/running
- **steps:**
  1. Navigate to any page
  2. Check og:image, og:url, and canonical href values
- **expected_result:** All URLs are absolute (start with https://domain.com/...), not relative paths

### TC-02-12: Heading structure remains correct after SEO changes

- **test-result:** PASS
- **test-result-note:** Exactly 1 H1 tag on homepage; headings follow logical H1 > H2 > H3 order, no skipped levels
- **type:** edge_case
- **description:** Verify that SEO implementation does not break the existing heading hierarchy
- **precondition:** Site is deployed/running with SEO changes applied
- **steps:**
  1. Navigate to the homepage
  2. Count H1 tags and check heading hierarchy
- **expected_result:** Exactly one H1 tag per page; headings follow logical order (H1 > H2 > H3); no skipped levels

### TC-02-13: Existing meta descriptions are preserved

- **test-result:** PASS
- **test-result-note:** All 4 pages retain unique title and meta description content
- **type:** edge_case
- **description:** Verify that existing title tags and meta descriptions are not overwritten or broken
- **precondition:** Site is deployed/running with SEO changes applied
- **steps:**
  1. Navigate to each page (/, /gioi-thieu, /cong-trinh, /lien-he)
  2. Check the title tag and meta description
- **expected_result:** Each page retains its existing unique title and meta description content

---

## Error Cases

### TC-02-14: robots.txt does not block public pages

- **test-result:** PASS
- **test-result-note:** Only /studio and /api/ are disallowed; all public pages (/, /gioi-thieu, /cong-trinh, /lien-he) are allowed
- **type:** error_case
- **description:** Verify robots.txt does not accidentally disallow important public pages
- **precondition:** robots.txt is deployed
- **steps:**
  1. Navigate to /robots.txt
  2. Check for any "Disallow" rules
- **expected_result:** No "Disallow" rules that would block /, /gioi-thieu, /cong-trinh, /lien-he, or /cong-trinh/* ; /studio may be disallowed

### TC-02-15: sitemap.xml does not include private routes

- **test-result:** PASS
- **test-result-note:** Sitemap only contains public routes; no /studio, /api, or non-public routes present
- **type:** error_case
- **description:** Verify sitemap.xml does not expose admin or API routes
- **precondition:** sitemap.xml is deployed
- **steps:**
  1. Navigate to /sitemap.xml
  2. Check all listed URLs
- **expected_result:** sitemap.xml does not include /studio, /api/*, or any non-public routes

### TC-02-16: Missing OG image fallback

- **test-result:** PASS
- **test-result-note:** Sub-pages without specific OG image (e.g. /gioi-thieu) correctly fall back to site-wide default og-image.jpg
- **type:** error_case
- **description:** Verify that if a page-specific OG image is unavailable, the default OG image is used as fallback
- **precondition:** Site is deployed/running
- **steps:**
  1. Navigate to a page that does not have a specific OG image override
  2. Check the og:image meta tag
- **expected_result:** og:image falls back to the site-wide default OG image rather than being empty or missing
