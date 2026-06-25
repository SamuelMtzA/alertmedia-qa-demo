import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { credentials } from '../../fixtures/test-data';

test.describe('Login Functionality', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should display login form on page load', async () => {
    expect(await loginPage.isLoginFormVisible()).toBeTruthy();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await loginPage.login(credentials.valid.username, credentials.valid.password);
    await expect(page).toHaveURL(/dashboard/);
  });

  test('should show error with invalid credentials', async () => {
    await loginPage.login(credentials.invalid.username, credentials.invalid.password);
    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).toContain('Invalid credentials');
  });

  test('should show error when password is empty', async ({ page }) => {
    await loginPage.login(credentials.emptyPassword.username, credentials.emptyPassword.password);
    const requiredMessage = page.locator('.oxd-input-field-error-message');
    await expect(requiredMessage).toBeVisible();
  });

  test('should navigate to forgot password page', async ({ page }) => {
    await loginPage.clickForgotPassword();
    await expect(page).toHaveURL(/requestPasswordResetCode/);
  });

  test('should validate username field is required', async ({ page }) => {
    await loginPage.login('', credentials.valid.password);
    const requiredMessage = page.locator('.oxd-input-field-error-message');
    await expect(requiredMessage).toBeVisible();
  });
});
