import { Page, Locator } from '@playwright/test';

export class ContentPage {
  readonly page: Page;
  readonly navigation: Locator;
  readonly heroSection: Locator;
  readonly activityCards: Locator;
  readonly productCards: Locator;
  readonly eventCards: Locator;
  readonly blogPosts: Locator;
  readonly contactForm: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navigation = page.getByRole('navigation').first();
    this.heroSection = page.locator('h2').filter({ hasText: 'Explore the World' });
    this.activityCards = page.locator('a[href*="/activities/"]');
    this.productCards = page.locator('a[href*="/store/products/"]');
    this.eventCards = page.locator('a[href*="/events/"]');
    this.blogPosts = page.locator('a[href*="/blog/post/"]');
    this.contactForm = page.locator('form').filter({ hasText: 'Name' });
  }

  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getNavigationItems() {
    return this.navigation.getByRole('link').all();
  }

  async getActivityCount() {
    return this.activityCards.count();
  }

  async getProductCount() {
    return this.productCards.count();
  }

  async getEventCount() {
    return this.eventCards.count();
  }

  async getBlogPostCount() {
    return this.blogPosts.count();
  }

  async navigateToSection(section: string) {
    await this.navigation.getByRole('link', { name: section }).click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}
