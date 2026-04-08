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
      { path: "/", pattern: /xuong-go-hoang-huan\.vercel\.app\/?$/ },
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
    expect(body).toMatch(/User-[Aa]gent: \*/);
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
    // Extract path from absolute URL and test against dev server
    const path = new URL(imageUrl!).pathname;
    const response = await request.get(path);
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
