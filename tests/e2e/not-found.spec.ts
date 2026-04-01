import { test, expect } from '@playwright/test'

test.describe('US-09: Custom 404 Not Found page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/trang-khong-ton-tai-xyz-404-test')
  })

  test('shows Vietnamese 404 heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /trang không tồn tại/i })).toBeVisible()
  })

  test('displays 404 status text', async ({ page }) => {
    await expect(page.getByText(/404/)).toBeVisible()
  })

  test('has navigation link back to homepage (Trang chủ)', async ({ page }) => {
    const link = page.getByRole('link', { name: /trang chủ/i }).first()
    await expect(link).toBeVisible()
    await expect(link).toHaveAttribute('href', '/')
  })

  test('has navigation link to projects (Công trình)', async ({ page }) => {
    const link = page.getByRole('link', { name: /công trình/i }).first()
    await expect(link).toBeVisible()
    await expect(link).toHaveAttribute('href', '/cong-trinh')
  })

  test('has navigation link to contact (Liên hệ)', async ({ page }) => {
    const contactLink = page.getByRole('main').getByRole('link', { name: /liên hệ/i })
    await expect(contactLink).toBeVisible()
    await expect(contactLink).toHaveAttribute('href', '/lien-he')
  })

  test('has a phone CTA link', async ({ page }) => {
    const phoneLink = page.getByRole('main').getByRole('link', { name: /0985.?241.?204/i })
    await expect(phoneLink).toBeVisible()
    await expect(phoneLink).toHaveAttribute('href', 'tel:0985241204')
  })

  test('page has site Header with logo', async ({ page }) => {
    // Header is rendered by (site) layout automatically
    await expect(page.getByText(/xưởng gỗ hoàng huân/i).first()).toBeVisible()
  })

  test('page has site Footer', async ({ page }) => {
    // Footer is rendered by (site) layout
    await expect(page.locator('footer')).toBeVisible()
  })

  test('clicking Trang chủ link navigates to homepage', async ({ page }) => {
    // Find the CTA link inside the 404 content (not header nav)
    const ctaLink = page.getByRole('main').getByRole('link', { name: /trang chủ/i })
    await ctaLink.click()
    await expect(page).toHaveURL('/')
  })
})
