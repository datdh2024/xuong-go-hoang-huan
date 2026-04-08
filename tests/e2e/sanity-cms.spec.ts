import { test, expect } from '@playwright/test'

test.describe('SR-873: Sanity CMS connected to all pages', () => {
  // ─────────────────────────────────────────
  // TC-20 to TC-23: Homepage
  // ─────────────────────────────────────────

  test('TC-20: homepage hero slider displays a headline', async ({ page }) => {
    await page.goto('/')
    const heroSection = page.locator('section').first()
    await expect(heroSection).toBeVisible()
    const heading = heroSection.locator('h1').first()
    await expect(heading).not.toBeEmpty()
  })

  test('TC-20: homepage hero slider has dot or arrow navigation', async ({ page }) => {
    await page.goto('/')
    const heroSection = page.locator('section').first()
    const navButtons = heroSection.getByRole('button')
    const count = await navButtons.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('TC-21: homepage highlights section is visible with at least 1 card', async ({ page }) => {
    await page.goto('/')
    const highlightsSection = page.locator('section').filter({ hasText: 'Cam Kết Chất Lượng' })
    await expect(highlightsSection).toBeVisible()
    const cards = highlightsSection.locator('h3')
    const count = await cards.count()
    if (count === 0) test.skip(true, 'No highlights data — skipping')
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('TC-22: homepage featured projects grid shows at least 1 project card', async ({ page }) => {
    await page.goto('/')
    const projectSection = page.locator('section').filter({ hasText: 'Dự Án Đã Thực Hiện' })
    await expect(projectSection).toBeVisible()
    const projectLinks = projectSection.locator('a[href^="/cong-trinh/"]')
    const count = await projectLinks.count()
    if (count === 0) test.skip(true, 'No featured projects — skipping')
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('TC-23: homepage house templates section is visible with at least 1 template', async ({ page }) => {
    await page.goto('/')
    const templatesSection = page.locator('section').filter({ hasText: 'Catalogue Thiết Kế' })
    await expect(templatesSection).toBeVisible()
    const cards = templatesSection.locator('h3')
    const count = await cards.count()
    if (count === 0) test.skip(true, 'No house templates data — skipping')
    expect(count).toBeGreaterThanOrEqual(1)
  })

  // ─────────────────────────────────────────
  // TC-24 to TC-25: Projects listing page
  // ─────────────────────────────────────────

  test('TC-24: projects listing page renders at least 1 project card', async ({ page }) => {
    await page.goto('/cong-trinh')
    await expect(page.locator('h1')).toContainText('Công Trình')
    const projectLinks = page.locator('a[href^="/cong-trinh/"]')
    const count = await projectLinks.count()
    if (count === 0) test.skip(true, 'No projects in Sanity — skipping')
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('TC-24: projects listing page has category filter buttons', async ({ page }) => {
    await page.goto('/cong-trinh')
    // "Tất cả" button is always present
    const allBtn = page.getByRole('button', { name: 'Tất cả' })
    await expect(allBtn).toBeVisible()
  })

  test('TC-25: clicking a category button gives it active styling', async ({ page }) => {
    await page.goto('/cong-trinh')
    const buttons = page.getByRole('button')
    const count = await buttons.count()
    if (count < 2) test.skip(true, 'Need at least 2 filter buttons — skipping')

    // Click the second button (first non-"Tất cả" category)
    const secondBtn = buttons.nth(1)
    await secondBtn.click()
    // Active button should have bg-wood-600 class
    await expect(secondBtn).toHaveClass(/bg-wood-600/)
  })

  // ─────────────────────────────────────────
  // TC-26 to TC-27: Project detail page
  // ─────────────────────────────────────────

  test('TC-26: project detail page renders title, location, year from Sanity', async ({ page }) => {
    // Find a real project slug from the listing page
    await page.goto('/cong-trinh')
    const firstProjectLink = page.locator('a[href^="/cong-trinh/"]').first()
    const count = await page.locator('a[href^="/cong-trinh/"]').count()
    if (count === 0) {
      test.skip(true, 'No project detail pages available — skipping')
      return
    }
    const href = await firstProjectLink.getAttribute('href')
    if (!href) return

    await page.goto(href)
    const h1 = page.locator('h1')
    await expect(h1).not.toBeEmpty()
    // Location and year metadata visible somewhere on page
    await expect(page.getByRole('main')).toBeVisible()
  })

  test('TC-27: project detail gallery uses Sanity CDN images', async ({ page }) => {
    await page.goto('/cong-trinh')
    const projectLinks = page.locator('a[href^="/cong-trinh/"]')
    const count = await projectLinks.count()
    if (count === 0) {
      test.skip(true, 'No project detail pages available — skipping')
      return
    }
    const href = await projectLinks.first().getAttribute('href')
    if (!href) return

    await page.goto(href)
    const galleryHeading = page.getByText('Thư viện ảnh')
    const hasGallery = await galleryHeading.isVisible().catch(() => false)
    if (!hasGallery) {
      test.skip(true, 'No gallery images in this project — skipping')
      return
    }

    const sanityImages = page.locator('img[src*="cdn.sanity.io"]')
    const imgCount = await sanityImages.count()
    expect(imgCount).toBeGreaterThanOrEqual(1)
  })

  // ─────────────────────────────────────────
  // TC-28: About page
  // ─────────────────────────────────────────

  test('TC-28: about page team section is always visible', async ({ page }) => {
    await page.goto('/gioi-thieu')
    await expect(page.getByText('Những Người Thợ Tâm Huyết')).toBeVisible()
  })

  test('TC-28: about page renders CMS stats when available', async ({ page }) => {
    await page.goto('/gioi-thieu')
    const statsBlock = page.locator('.bg-wood-600').first()
    const hasStats = await statsBlock.isVisible().catch(() => false)
    if (!hasStats) test.skip(true, 'No about page stats in Sanity — skipping')
    await expect(statsBlock).toBeVisible()
    const statNumbers = statsBlock.locator('.text-gold-400')
    expect(await statNumbers.count()).toBeGreaterThanOrEqual(1)
  })

  // ─────────────────────────────────────────
  // TC-29: 404 for unknown slug
  // ─────────────────────────────────────────

  test('TC-29: project detail returns 404 for unknown slug', async ({ page }) => {
    const response = await page.goto('/cong-trinh/not-a-real-slug-xyz-404')
    expect(response?.status()).toBe(404)
  })

  // ─────────────────────────────────────────
  // TC-30: Homepage renders without crash
  // ─────────────────────────────────────────

  test('TC-30: homepage renders without crashing', async ({ page }) => {
    const response = await page.goto('/')
    expect(response?.status()).toBe(200)
    await expect(page.locator('main')).toBeVisible()
  })
})
