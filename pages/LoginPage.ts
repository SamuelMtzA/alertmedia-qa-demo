import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly forgotPasswordLink: Locator;
  readonly errorMessage: Locator;
  readonly requiredError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.forgotPasswordLink = page.getByText('Forgot your password?');
    this.errorMessage = page.locator('.oxd-alert-content-text');
    this.requiredError = page.locator('.oxd-input-field-error-message');
  }

  async goto() {
    await this.page.goto('/web/index.php/auth/login');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async isErrorVisible() {
    return this.errorMessage.isVisible();
  }

  async isRequiredErrorVisible() {
    return this.requiredError.isVisible();
  }
}
