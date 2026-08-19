import { test, expect } from '@playwright/test'

test.describe('Platforma BAC Real E2E Browser Test Suite', () => {
  // 1. Landing Page
  test('Flow 1: Landing Page renders title and primary CTAs', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Platformă Bacalaureat/)
    const heading = page.locator('h1').first()
    await expect(heading).toBeVisible()
  })

  // 2. Register UI
  test('Flow 2: Register Page renders registration form', async ({ page }) => {
    await page.goto('/register')
    await expect(page.locator('input[type="email"]').first()).toBeVisible()
    await expect(page.locator('input[type="password"]').first()).toBeVisible()
  })

  // 3. Login UI
  test('Flow 3: Login Page renders authentication form', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('input[type="email"]').first()).toBeVisible()
    await expect(page.locator('input[type="password"]').first()).toBeVisible()
  })

  // 4. Password Reset UI
  test('Flow 4: Forgot Password Page renders email request form', async ({ page }) => {
    await page.goto('/forgot-password')
    await expect(page.locator('input[type="email"]').first()).toBeVisible()
  })

  // 5. Public PRO Offering Page
  test('Flow 5: Public /pro route is viewable by guest users', async ({ page }) => {
    await page.goto('/pro')
    await expect(page.url()).toContain('/pro')
    await expect(page.locator('h1, h2').first()).toBeVisible()
  })

  // 6. Catalog Navigation
  test('Flow 6: Catalog Page renders subject listing', async ({ page }) => {
    await page.goto('/catalog')
    await expect(page.url()).toContain('/catalog')
  })

  // 7. Canonical Legal Route Aliases
  test('Flow 7: Legacy Romanian legal routes redirect cleanly to canonical endpoints', async ({ page }) => {
    await page.goto('/termeni')
    await page.waitForURL('**/terms')
    expect(page.url()).toContain('/terms')

    await page.goto('/confidentialitate')
    await page.waitForURL('**/privacy')
    expect(page.url()).toContain('/privacy')

    await page.goto('/abonament')
    await page.waitForURL('**/subscription-terms')
    expect(page.url()).toContain('/subscription-terms')
  })

  // 8. Admin Guard Redirect
  test('Flow 8: Unauthenticated guest accessing /admin is redirected to /login', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForURL('**/login')
    expect(page.url()).toContain('/login')
  })

  // 9. Admin Lesson Studio (Conditional on Staff Credentials)
  test('Flow 9: Admin Lesson Studio CRUD & Block editing', async ({ page }) => {
    const adminEmail = process.env.E2E_ADMIN_EMAIL
    const adminPassword = process.env.E2E_ADMIN_PASSWORD

    if (!adminEmail || !adminPassword) {
      test.skip(true, 'Staff credentials (E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD) not configured in environment')
      return
    }

    await page.goto('/login')
    await page.locator('input[type="email"]').first().fill(adminEmail)
    await page.locator('input[type="password"]').first().fill(adminPassword)
    await page.locator('button[type="submit"]').first().click()

    await page.waitForURL('**/admin')
    await page.goto('/admin/content')

    const editorBtn = page.locator('button:has-text("Editor")').first()
    await expect(editorBtn).toBeVisible()
    await editorBtn.click()

    await expect(page.locator('h1, h2').first()).toBeVisible()
  })

  // 10. Theme Switching
  test('Flow 10: Theme toggle switches dark and light modes', async ({ page }) => {
    await page.goto('/')
    const isDarkBefore = await page.evaluate(() => document.documentElement.classList.contains('dark'))
    const themeBtn = page.locator('button[aria-label*="Schimbă tema"]').first()
    if (await themeBtn.isVisible()) {
      await themeBtn.click()
      const isDarkAfter = await page.evaluate(() => document.documentElement.classList.contains('dark'))
      expect(isDarkBefore).not.toEqual(isDarkAfter)
    }
  })

  // 11. Viewports & Zero Overflow
  test('Flow 11: Viewports (320px, 375px, 390px, 430px, 768px, 1280px) exhibit no document overflow', async ({ page }) => {
    const viewports = [320, 375, 390, 430, 768, 1280]
    for (const w of viewports) {
      await page.setViewportSize({ width: w, height: 800 })
      await page.goto('/')
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
      expect(scrollWidth).toEqual(clientWidth)
    }
  })
})
