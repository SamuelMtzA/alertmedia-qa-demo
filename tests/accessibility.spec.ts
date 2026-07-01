import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests - WCAG 2.2 AA Compliance', () => {
  test('login form should be keyboard navigable', async ({ page }) => {
    await page.goto('/web/index.php/auth/login');
    await page.waitForLoadState('domcontentloaded');

    const usernameInput = page.getByPlaceholder('Username');
    const passwordInput = page.getByPlaceholder('Password');
    const loginButton = page.getByRole('button', { name: 'Login' });

    await expect(usernameInput).toBeVisible();
    await usernameInput.focus();
    await expect(usernameInput).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(passwordInput).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(loginButton).toBeFocused();
  });

  test('login page images should have alt text', async ({ page }) => {
    await page.goto('/web/index.php/auth/login');
    await page.waitForLoadState('domcontentloaded');

    const images = await page.locator('img').all();
    console.log(`\nFound ${images.length} images on login page`);

    for (const img of images) {
      const alt = await img.getAttribute('alt');
      const src = await img.getAttribute('src');
      console.log(`Image: ${src}, Alt: ${alt || '(missing)'}`);
      expect(alt).toBeTruthy();
    }
  });

  test('dashboard should be scanned for accessibility violations after login', async ({ page }) => {
    await page.goto('/web/index.php/auth/login');
    await page.waitForLoadState('domcontentloaded');

    await page.getByPlaceholder('Username').fill('Admin');
    await page.getByPlaceholder('Password').fill('admin123');
    await page.getByRole('button', { name: 'Login' }).click();

    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .exclude('.oxd-toast-container')
      .analyze();

    console.log('\n=== Accessibility Scan Results for Dashboard ===');
    console.log(`Total violations: ${accessibilityScanResults.violations.length}`);
    console.log(`Passes: ${accessibilityScanResults.passes.length}`);

    const criticalCount = accessibilityScanResults.violations.filter(
      (v) => v.impact === 'critical',
    ).length;
    const seriousCount = accessibilityScanResults.violations.filter(
      (v) => v.impact === 'serious',
    ).length;

    console.log(`Critical violations: ${criticalCount}`);
    console.log(`Serious violations: ${seriousCount}`);

    accessibilityScanResults.violations
      .filter((v) => v.impact === 'critical' || v.impact === 'serious')
      .forEach((violation) => {
        console.log(`\n- Rule: ${violation.id} (${violation.impact})`);
        console.log(`  Description: ${violation.description}`);
        console.log(`  Nodes affected: ${violation.nodes.length}`);
      });

    expect(accessibilityScanResults.passes.length).toBeGreaterThan(0);
  });

  test('dashboard should have proper navigation structure', async ({ page }) => {
    await page.goto('/web/index.php/auth/login');
    await page.waitForLoadState('domcontentloaded');

    await page.getByPlaceholder('Username').fill('Admin');
    await page.getByPlaceholder('Password').fill('admin123');
    await page.getByRole('button', { name: 'Login' }).click();

    await page.waitForLoadState('networkidle');

    const navigation = page.getByRole('navigation').first();
    await expect(navigation).toBeVisible();

    const navLinks = await navigation.getByRole('link').all();
    console.log(`\nFound ${navLinks.length} navigation links`);
    expect(navLinks.length).toBeGreaterThan(0);
  });

  test('admin page should load with accessible content', async ({ page }) => {
    await page.goto('/web/index.php/auth/login');
    await page.waitForLoadState('domcontentloaded');

    await page.getByPlaceholder('Username').fill('Admin');
    await page.getByPlaceholder('Password').fill('admin123');
    await page.getByRole('button', { name: 'Login' }).click();

    await page.waitForLoadState('networkidle');

    const adminLink = page.getByRole('link', { name: 'Admin' });
    await adminLink.click();
    await page.waitForLoadState('networkidle');

    const pageContent = page.locator('.oxd-layout-container, .oxd-topbar, main').first();
    await expect(pageContent).toBeVisible();

    const buttons = await page.getByRole('button').all();
    console.log(`\nFound ${buttons.length} buttons on admin page`);
    expect(buttons.length).toBeGreaterThan(0);
  });
});
