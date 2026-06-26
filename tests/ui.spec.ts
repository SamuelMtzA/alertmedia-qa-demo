import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

test.describe('Login Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should display login form', async () => {
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('should login with valid credentials', async ({ page }) => {
    await loginPage.login('Admin', 'admin123');
    await expect(page).toHaveURL(/dashboard/);
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await loginPage.login('invalidUser', 'wrongPassword');
    const error = page.locator('.oxd-alert-content-text');
    await expect(error).toContainText('Invalid credentials');
  });

  test('should show error when password is empty', async ({ page }) => {
    await loginPage.login('Admin', '');
    const error = page.locator('.oxd-input-field-error-message');
    await expect(error).toBeVisible();
  });

  test('should navigate to forgot password', async ({ page }) => {
    await loginPage.forgotPasswordLink.click();
    await expect(page).toHaveURL(/requestPasswordResetCode/);
  });
});

test.describe('Dashboard Tests', () => {
  let dashboard: DashboardPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('Admin', 'admin123');
    dashboard = new DashboardPage(page);
  });

  test('should display dashboard after login', async () => {
    await expect(dashboard.sideMenu).toBeVisible();
  });

  test('should have navigation menu items', async ({ page }) => {
    await expect(dashboard.adminMenuItem).toBeVisible();
    await expect(dashboard.pimMenuItem).toBeVisible();
  });

  test('should navigate to admin section', async ({ page }) => {
    await dashboard.navigateToAdmin();
    await expect(page).toHaveURL(/admin/);
  });

  test('should navigate to PIM section', async ({ page }) => {
    await dashboard.navigateToPIM();
    await expect(page).toHaveURL(/pim/);
  });

  test('should logout successfully', async ({ page }) => {
    await dashboard.logout();
    await expect(page).toHaveURL(/login/);
  });
});

test.describe('Admin Panel Tests', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('Admin', 'admin123');
    const dashboard = new DashboardPage(page);
    await dashboard.navigateToAdmin();
  });

  test('should display admin page with user table', async ({ page }) => {
    const table = page.locator('.oxd-table');
    await expect(table).toBeVisible();
  });

  test('should search users by username', async ({ page }) => {
    const usernameFilter = page.locator('.oxd-input').nth(1);
    const searchButton = page.locator('button[type="submit"]');

    await usernameFilter.fill('Admin');
    await searchButton.click();
    await page.waitForLoadState('networkidle');

    const rows = page.locator('.oxd-table-body .oxd-table-row');
    await expect(rows).toHaveCount(await rows.count());
  });

  test('should display add user button', async ({ page }) => {
    const addButton = page.locator('button:has-text("Add")').first();
    await expect(addButton).toBeVisible();
  });

  test('should navigate to add user form', async ({ page }) => {
    const addButton = page.locator('button:has-text("Add")').first();
    await addButton.click();
    await expect(page).toHaveURL(/saveSystemUser/);
  });
});
