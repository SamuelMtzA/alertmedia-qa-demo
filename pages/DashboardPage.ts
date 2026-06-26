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
    this.sideMenu = page.getByRole('navigation', { name: 'Sidepanel' });
    this.adminMenuItem = page.getByRole('link', { name: 'Admin' });
    this.pimMenuItem = page.getByRole('link', { name: 'PIM' });
    this.userProfile = page.getByAltText(/profile/i).first();
    this.logoutButton = page.getByRole('menuitem', { name: 'Logout' });
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
