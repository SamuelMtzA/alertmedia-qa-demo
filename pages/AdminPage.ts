import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class AdminPage extends BasePage {
  readonly pageTitle: Locator;
  readonly addButton: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;
  readonly userTable: Locator;
  readonly tableRows: Locator;
  readonly usernameFilter: Locator;
  readonly roleFilter: Locator;
  readonly statusFilter: Locator;
  readonly noRecordsMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('.oxd-topbar-header-breadcrumb-module');
    this.addButton = page.locator('button:has-text("Add")').first();
    this.searchButton = page.locator('button[type="submit"]');
    this.resetButton = page.locator('button:has-text("Reset")');
    this.userTable = page.locator('.oxd-table');
    this.tableRows = page.locator('.oxd-table-body .oxd-table-row');
    this.usernameFilter = page.locator('.oxd-input').nth(1);
    this.roleFilter = page.locator('.oxd-select-wrapper').first();
    this.statusFilter = page.locator('.oxd-select-wrapper').nth(1);
    this.noRecordsMessage = page.locator('.oxd-text--span:has-text("No Records Found")');
  }

  async goto(): Promise<void> {
    await this.navigate('/web/index.php/admin/viewSystemUsers');
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(2000);
  }

  async isPageLoaded(): Promise<boolean> {
    return await this.isVisible(this.userTable);
  }

  async searchByUsername(username: string): Promise<void> {
    await this.fill(this.usernameFilter, username);
    await this.click(this.searchButton);
    await this.waitForPageLoad();
  }

  async getResultsCount(): Promise<number> {
    await this.page.waitForTimeout(1000);
    return await this.tableRows.count();
  }

  async getPageTitle(): Promise<string> {
    return await this.getText(this.pageTitle);
  }

  async resetFilters(): Promise<void> {
    await this.click(this.resetButton);
    await this.waitForPageLoad();
  }

  async clickAddUser(): Promise<void> {
    await this.click(this.addButton);
    await this.waitForPageLoad();
  }

  async getFirstRowUsername(): Promise<string> {
    const firstRow = this.tableRows.first();
    const usernameCell = firstRow.locator('.oxd-table-cell').nth(1);
    return await this.getText(usernameCell);
  }

  async deleteFirstRow(): Promise<void> {
    const firstRow = this.tableRows.first();
    const deleteButton = firstRow.locator('button:has(i.oxd-icon.bi-trash)');
    await this.click(deleteButton);
    const confirmButton = this.page.locator('button:has-text("Yes, Delete")');
    await this.click(confirmButton);
    await this.waitForPageLoad();
  }
}
