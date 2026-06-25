import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  readonly welcomeMessage: Locator;
  readonly quickAccessMenu: Locator;
  readonly timeAtWorkWidget: Locator;
  readonly sideMenu: Locator;
  readonly adminMenuItem: Locator;
  readonly pimMenuItem: Locator;
  readonly leaveMenuItem: Locator;
  readonly userProfile: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.welcomeMessage = page.locator('.oxd-topbar-header-breadcrumb h6');
    this.quickAccessMenu = page.locator('.oxd-quick-actions');
    this.timeAtWorkWidget = page.locator('.orangehrm-timeatwork');
    this.sideMenu = page.locator('.oxd-main-menu').first();
    this.adminMenuItem = page.locator('a[href="/web/index.php/admin/viewAdminModule"]').first();
    this.pimMenuItem = page.locator('a[href="/web/index.php/pim/viewPimModule"]').first();
    this.leaveMenuItem = page.locator('a[href="/web/index.php/leave/viewLeaveModule"]').first();
    this.userProfile = page.locator('.oxd-userdropdown');
    this.logoutButton = page.locator('a:has-text("Logout")');
  }

  async goto(): Promise<void> {
    await this.navigate('/web/index.php/dashboard/index');
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(2000);
  }

  async getWelcomeText(): Promise<string> {
    await this.waitForElement(this.welcomeMessage);
    return await this.getText(this.welcomeMessage);
  }

  async navigateToAdmin(): Promise<void> {
    await this.click(this.adminMenuItem);
    await this.waitForPageLoad();
  }

  async navigateToPIM(): Promise<void> {
    await this.click(this.pimMenuItem);
    await this.waitForPageLoad();
  }

  async navigateToLeave(): Promise<void> {
    await this.click(this.leaveMenuItem);
    await this.waitForPageLoad();
  }

  async isDashboardLoaded(): Promise<boolean> {
    await this.page.waitForTimeout(2000);
    return await this.isVisible(this.sideMenu);
  }

  async logout(): Promise<void> {
    await this.click(this.userProfile);
    await this.click(this.logoutButton);
  }

  async getQuickActionsCount(): Promise<number> {
    const actions = this.page.locator('.oxd-quick-actions').locator('a, button, li');
    return await actions.count();
  }
}
