import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { AdminPage } from '../pages/AdminPage';
import { credentials } from '../fixtures/test-data';
import * as allure from 'allure-js-commons';

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
    await allure.epic('Authentication');
    await allure.feature('Login');
    await allure.story('Valid Login');

    await allure.step('Enter valid credentials', async () => {
      await loginPage.login(credentials.valid.username, credentials.valid.password);
    });

    await allure.step('Verify redirect to dashboard', async () => {
      await expect(page).toHaveURL(/dashboard/);
    });
  });

  test('should show error with invalid credentials', async () => {
    await allure.epic('Authentication');
    await allure.feature('Login');
    await allure.story('Invalid Login');
    await allure.severity('critical');

    await allure.step('Enter invalid credentials', async () => {
      await loginPage.login(credentials.invalid.username, credentials.invalid.password);
    });

    await allure.step('Verify error message is displayed', async () => {
      await expect(loginPage.errorMessage).toBeVisible();
    });
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
    await expect(dashboard.adminMenuItem).toBeVisible();
    await expect(dashboard.pimMenuItem).toBeVisible();
  });

  test('should navigate to admin section', async ({ page }) => {
    await allure.epic('Navigation');
    await allure.feature('Admin Panel');

    await allure.step('Click on Admin menu item', async () => {
      await dashboard.navigateToAdmin();
    });

    await allure.step('Verify URL contains /admin/', async () => {
      await expect(page).toHaveURL(/admin/);
    });
  });

  test('should navigate to PIM section', async ({ page }) => {
    await dashboard.navigateToPIM();
    await expect(page).toHaveURL(/pim/);
  });

  test('should logout successfully', async ({ page }) => {
    await allure.epic('Authentication');
    await allure.feature('Logout');

    await allure.step('Click user profile and logout', async () => {
      await dashboard.logout();
    });

    await allure.step('Verify redirect to login page', async () => {
      await expect(page).toHaveURL(/login/);
    });
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
    await allure.epic('Admin');
    await allure.feature('User Management');
    await allure.story('Search Users');

    await allure.step('Enter username in search field', async () => {
      await adminPage.searchByUsername('Admin');
    });

    await allure.step('Verify results are displayed', async () => {
      const count = await adminPage.getResultsCount();
      expect(count).toBeGreaterThan(0);
    });
  });

  test('should display add user button', async () => {
    await expect(adminPage.addButton).toBeVisible();
  });

  test('should navigate to add user form', async ({ page }) => {
    await adminPage.clickAdd();
    await expect(page).toHaveURL(/saveSystemUser/);
  });
});
