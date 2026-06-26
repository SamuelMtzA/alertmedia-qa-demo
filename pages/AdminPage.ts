import { Page, Locator } from '@playwright/test';

export class AdminPage {
  readonly page: Page;
  readonly userTable: Locator;
  readonly addButton: Locator;
  readonly searchButton: Locator;
  readonly usernameFilter: Locator;
  readonly tableRows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userTable = page.getByRole('table');
    this.addButton = page.getByRole('button', { name: 'Add' });
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.usernameFilter = page.getByRole('textbox').nth(1);
    this.tableRows = page.getByRole('row');
  }

  async searchByUsername(username: string) {
    await this.usernameFilter.fill(username);
    await this.searchButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getResultsCount() {
    return this.tableRows.count();
  }

  async clickAdd() {
    await this.addButton.click();
  }
}
