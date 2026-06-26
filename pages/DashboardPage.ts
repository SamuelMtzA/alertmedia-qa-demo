import { Page, Locator } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly sideMenu: Locator;
  readonly adminMenuItem: Locator;
  readonly pimMenuItem: Locator;
  readonly userProfile: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sideMenu = page.locator('.oxd-main-menu').first();
    this.adminMenuItem = page.locator('a[href="/web/index.php/admin/viewAdminModule"]').first();
    this.pimMenuItem = page.locator('a[href="/web/index.php/pim/viewPimModule"]').first();
    this.userProfile = page.locator('.oxd-userdropdown');
    this.logoutButton = page.locator('a:has-text("Logout")');
  }

  async navigateToAdmin() {
    await this.adminMenuItem.click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToPIM() {
    await this.pimMenuItem.click();
    await this.page.waitForLoadState('networkidle');
  }

  async logout() {
    await this.userProfile.click();
    await this.logoutButton.click();
  }
}
