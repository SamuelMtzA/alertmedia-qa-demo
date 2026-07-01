import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { AdminPage } from '../pages/AdminPage';
import { credentials } from '../fixtures/test-data';

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
    await loginPage.login(credentials.valid.username, credentials.valid.password);
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/dashboard/);
  });

  test('should show error with invalid credentials', async () => {
    await loginPage.login(credentials.invalid.username, credentials.invalid.password);
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('should show error when password is empty', async () => {
    await loginPage.login(credentials.valid.username, '');
    await expect(loginPage.requiredError).toBeVisible();
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
    await loginPage.login(credentials.valid.username, credentials.valid.password);
    dashboard = new DashboardPage(page);
  });

  test('should display dashboard after login', async () => {
    await expect(dashboard.sideMenu).toBeVisible();
  });

  test('should have navigation menu items', async () => {
    await dashboard.sideMenu.waitFor({ state: 'visible', timeout: 10000 });
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
  let adminPage: AdminPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.valid.username, credentials.valid.password);
    const dashboard = new DashboardPage(page);
    await dashboard.navigateToAdmin();
    adminPage = new AdminPage(page);
  });

  test('should display admin page with user table', async () => {
    await expect(adminPage.userTable).toBeVisible();
  });

  test('should search users by username', async () => {
    await adminPage.searchByUsername('Admin');
    const count = await adminPage.getResultsCount();
    expect(count).toBeGreaterThan(0);
  });

  test('should display add user button', async () => {
    await expect(adminPage.addButton).toBeVisible();
  });

  test('should navigate to add user form', async ({ page }) => {
    await adminPage.clickAdd();
    await expect(page).toHaveURL(/saveSystemUser/);
  });
});
