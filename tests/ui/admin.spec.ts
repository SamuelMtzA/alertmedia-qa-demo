import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { AdminPage } from '../../pages/AdminPage';
import { credentials } from '../../fixtures/test-data';

test.describe('Admin Panel Functionality', () => {
  let adminPage: AdminPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.valid.username, credentials.valid.password);

    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigateToAdmin();

    adminPage = new AdminPage(page);
  });

  test('should display admin page with user table', async () => {
    expect(await adminPage.isPageLoaded()).toBeTruthy();
  });

  test('should display page title', async () => {
    const title = await adminPage.getPageTitle();
    expect(title).toBeTruthy();
  });

  test('should search users by username', async () => {
    await adminPage.searchByUsername('Admin');
    const count = await adminPage.getResultsCount();
    expect(count).toBeGreaterThan(0);
  });

  test('should show no records for non-existent user', async () => {
    await adminPage.searchByUsername('nonexistentuser12345');
    const count = await adminPage.getResultsCount();
    expect(count).toBe(0);
  });

  test('should reset search filters', async () => {
    await adminPage.searchByUsername('Admin');
    await adminPage.resetFilters();
    expect(await adminPage.isPageLoaded()).toBeTruthy();
  });

  test('should display add user button', async ({ page }) => {
    const addButton = page.locator('button:has-text("Add")').first();
    await expect(addButton).toBeVisible();
  });

  test('should navigate to add user form', async ({ page }) => {
    await adminPage.clickAddUser();
    await expect(page).toHaveURL(/saveSystemUser/);
  });
});
