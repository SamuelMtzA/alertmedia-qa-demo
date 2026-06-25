import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { credentials } from '../../fixtures/test-data';

test.describe('Dashboard Functionality', () => {
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.valid.username, credentials.valid.password);
    dashboardPage = new DashboardPage(page);
  });

  test('should display dashboard after successful login', async () => {
    expect(await dashboardPage.isDashboardLoaded()).toBeTruthy();
  });

  test('should show welcome message with username', async () => {
    const welcomeText = await dashboardPage.getWelcomeText();
    expect(welcomeText).toBeTruthy();
  });

  test('should have navigation menu items', async ({ page }) => {
    const adminMenu = page.locator('a[href="/web/index.php/admin/viewAdminModule"]');
    const pimMenu = page.locator('a[href="/web/index.php/pim/viewPimModule"]');
    const leaveMenu = page.locator('a[href="/web/index.php/leave/viewLeaveModule"]');

    await expect(adminMenu).toBeVisible();
    await expect(pimMenu).toBeVisible();
    await expect(leaveMenu).toBeVisible();
  });

  test('should navigate to admin section', async ({ page }) => {
    await dashboardPage.navigateToAdmin();
    await expect(page).toHaveURL(/admin/);
  });

  test('should navigate to PIM section', async ({ page }) => {
    await dashboardPage.navigateToPIM();
    await expect(page).toHaveURL(/pim/);
  });

  test('should logout successfully', async ({ page }) => {
    await dashboardPage.logout();
    await expect(page).toHaveURL(/login/);
  });

  test('should display dashboard widgets', async ({ page }) => {
    const dashboardContent = page.locator('.oxd-layout-container, .oxd-main-content');
    await expect(dashboardContent.first()).toBeVisible();
  });
});
