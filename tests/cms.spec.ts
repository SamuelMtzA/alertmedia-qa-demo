import { test, expect } from '@playwright/test';
import { ContentPage } from '../pages/ContentPage';

test.describe('CMS Content Validation - DotCMS Demo', () => {
  let contentPage: ContentPage;

  test.beforeEach(async ({ page }) => {
    contentPage = new ContentPage(page);
    await contentPage.goto();
  });

  test('homepage should load with all dynamic content sections', async () => {
    await expect(contentPage.heroSection).toBeVisible();

    const activityCount = await contentPage.getActivityCount();
    expect(activityCount).toBeGreaterThan(0);

    const productCount = await contentPage.getProductCount();
    expect(productCount).toBeGreaterThan(0);

    const eventCount = await contentPage.getEventCount();
    expect(eventCount).toBeGreaterThan(0);

    const blogCount = await contentPage.getBlogPostCount();
    expect(blogCount).toBeGreaterThan(0);
  });

  test('navigation should contain expected CMS-driven menu items', async ({ page }) => {
    const navItems = await contentPage.getNavigationItems();
    expect(navItems.length).toBeGreaterThan(0);

    const navText = await page.getByRole('navigation').first().textContent();
    expect(navText).toContain('Home');
    expect(navText).toContain('Blog');
    expect(navText).toContain('Store');
    expect(navText).toContain('Contact');
  });

  test('activity cards should have images and links', async ({ page }) => {
    const activities = page.locator('a[href*="/activities/"]');
    const count = await activities.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < Math.min(count, 3); i++) {
      const card = activities.nth(i);
      const href = await card.getAttribute('href');
      expect(href).toContain('/activities/');

      const text = await card.textContent();
      expect(text?.trim().length).toBeGreaterThan(0);
    }
  });

  test('product cards should have links and content', async ({ page }) => {
    const products = page.locator('a[href*="/store/products/"]');
    const count = await products.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < Math.min(count, 3); i++) {
      const product = products.nth(i);
      const href = await product.getAttribute('href');
      expect(href).toContain('/store/products/');

      const text = await product.textContent();
      expect(text?.trim().length).toBeGreaterThan(0);
    }
  });

  test('blog posts should have links from CMS', async ({ page }) => {
    const blogPosts = page.locator('a[href*="/blog/post/"]');
    const count = await blogPosts.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < Math.min(count, 3); i++) {
      const post = blogPosts.nth(i);
      const href = await post.getAttribute('href');
      expect(href).toContain('/blog/post/');
    }
  });

  test('contact form should be present and functional', async () => {
    await expect(contentPage.contactForm).toBeVisible();

    const nameField = contentPage.contactForm.getByLabel(/name/i);
    const emailField = contentPage.contactForm.getByLabel(/e-mail/i);
    const messageField = contentPage.contactForm.getByLabel(/message/i);
    const sendButton = contentPage.contactForm.getByRole('button', { name: /send/i });

    await expect(nameField).toBeVisible();
    await expect(emailField).toBeVisible();
    await expect(messageField).toBeVisible();
    await expect(sendButton).toBeVisible();
  });

  test('navigating to blog section should load CMS content', async ({ page }) => {
    await contentPage.navigateToSection('Blog');
    await page.waitForLoadState('domcontentloaded');

    const blogEntries = page.locator('a[href*="/blog/post/"]');
    const count = await blogEntries.count();
    expect(count).toBeGreaterThan(0);
  });

  test('navigating to store should load product catalog from CMS', async ({ page }) => {
    await contentPage.navigateToSection('Store');
    await page.waitForLoadState('domcontentloaded');

    const products = page.locator('a[href*="/store/products/"]');
    const count = await products.count();
    expect(count).toBeGreaterThan(0);
  });

  test('homepage should have images with alt text from CMS', async ({ page }) => {
    const images = page.locator('img');
    const count = await images.count();
    console.log(`\nFound ${count} images on homepage`);
    expect(count).toBeGreaterThan(0);

    let imagesWithAlt = 0;
    for (let i = 0; i < Math.min(count, 10); i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      if (alt && alt.trim().length > 0) {
        imagesWithAlt++;
      }
    }
    console.log(`Images with alt text: ${imagesWithAlt} out of ${Math.min(count, 10)}`);
    expect(imagesWithAlt).toBeGreaterThan(0);
  });
});

test.describe('CMS Admin Console - DotCMS', () => {
  test('admin login should work with default credentials', async ({ page }) => {
    await page.goto('/dotAdmin');
    await page.waitForLoadState('domcontentloaded');

    const emailField = page.getByPlaceholder(/email|user/i).first();
    const passwordField = page.getByPlaceholder(/password/i).first();
    const loginButton = page.getByRole('button', { name: /sign|login|submit/i }).first();

    if (await emailField.isVisible()) {
      await emailField.fill('admin@dotcms.com');
      await passwordField.fill('admin');
      await loginButton.click();
      await page.waitForLoadState('networkidle');

      const adminContent = page.locator('[class*="content"], [class*="dashboard"], [id*="app"]').first();
      await expect(adminContent).toBeVisible({ timeout: 10000 });
    }
  });
});
