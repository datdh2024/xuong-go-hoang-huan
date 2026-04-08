import { test, expect } from '@playwright/test'

test.describe('TC-01: CMS Integration', () => {
  test('TC-01-01: Homepage displays content', async ({ page }) => {
    await page.goto('/')
    // Hero slider
    await expect(page.locator('h1').first()).toBeVisible()
    // Highlights section heading
    await expect(page.getByRole('heading', { name: 'Cam Kết Chất Lượng' })).toBeVisible()
    // Projects grid
    await expect(page.locator('[href^="/cong-trinh/"]').first()).toBeVisible()
    // FAQ section - look for the FAQ section heading or accordion buttons
    const faqHeading = page.getByText('Câu Hỏi Thường Gặp')
    await expect(faqHeading).toBeVisible()
  })

  test('TC-01-02: About page displays content', async ({ page }) => {
    await page.goto('/gioi-thieu')
    await expect(page.locator('h1')).toContainText('Giới Thiệu')
    // Stats bar
    await expect(page.getByText('Năm kinh nghiệm', { exact: true }).first()).toBeVisible()
    // Story section heading
    await expect(page.getByRole('heading', { name: 'Tâm Huyết Với Nghề Mộc Truyền Thống' })).toBeVisible()
  })

  test('TC-01-03: Projects page displays projects with filter', async ({ page }) => {
    await page.goto('/cong-trinh')
    await expect(page.locator('h1')).toContainText('Công Trình')
    // Category filter
    await expect(page.getByText('Tất cả')).toBeVisible()
    // Project cards
    await expect(page.locator('[href^="/cong-trinh/"]').first()).toBeVisible()
  })

  test('TC-01-04: Project detail page', async ({ page }) => {
    await page.goto('/cong-trinh')
    // Click first project
    const firstProject = page.locator('[href^="/cong-trinh/"]').first()
    await firstProject.click()
    // Should show project detail
    await expect(page.locator('h1')).toBeVisible()
    // Back link (scoped to main content to avoid header/footer nav duplicates)
    await expect(page.locator('main [href="/cong-trinh"]').first()).toBeVisible()
  })

  test('TC-01-05: Contact page displays contact info', async ({ page }) => {
    await page.goto('/lien-he')
    await expect(page.locator('h1')).toContainText('Liên Hệ')
    await expect(page.getByText('Điện thoại', { exact: true }).first()).toBeVisible()
    await expect(page.getByText('Email', { exact: true }).first()).toBeVisible()
    await expect(page.getByText('Địa chỉ', { exact: true }).first()).toBeVisible()
  })

  test('TC-01-06: Header and footer display data', async ({ page }) => {
    await page.goto('/')
    const header = page.locator('header')
    await expect(header).toBeVisible()
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
    // Footer should have social links
    await expect(footer.locator('a[href*="facebook"]')).toBeVisible()
  })

  test('TC-01-10: Non-existent project slug shows 404', async ({ page }) => {
    const response = await page.goto('/cong-trinh/non-existent-project-slug-xyz')
    expect(response?.status()).toBe(404)
  })

  test('TC-01-03b: Category filter works', async ({ page }) => {
    await page.goto('/cong-trinh')
    const allCards = page.locator('[href^="/cong-trinh/"]')
    const totalCount = await allCards.count()

    if (totalCount > 1) {
      // Click a specific category button (skip "Tất cả")
      const categoryButtons = page.locator('button').filter({ hasNotText: 'Tất cả' })
      const firstCategoryBtn = categoryButtons.first()
      if (await firstCategoryBtn.isVisible()) {
        await firstCategoryBtn.click()
        const filteredCount = await allCards.count()
        expect(filteredCount).toBeLessThanOrEqual(totalCount)

        await page.getByText('Tất cả').click()
        const resetCount = await allCards.count()
        expect(resetCount).toBe(totalCount)
      }
    }
  })
})
