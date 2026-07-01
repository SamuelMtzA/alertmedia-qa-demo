import { test, expect } from '@playwright/test';

test.describe('CMS Visual Regression Tests - DotCMS Demo', () => {
  test('CMS homepage should match visual baseline', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    await expect(page).toHaveScreenshot('cms-homepage.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.05,
    });
  });

  test('Blog post page should render correctly', async ({ page }) => {
    await page.goto('/blog/post/ecotourism-in-costa-rica');
    await page.waitForLoadState('domcontentloaded');

    await expect(page).toHaveScreenshot('blog-post-page.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.05,
    });
  });

  test('Product listing page should match visual baseline', async ({ page }) => {
    await page.goto('/store');
    await page.waitForLoadState('domcontentloaded');

    await expect(page).toHaveScreenshot('product-listing-page.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.05,
    });
  });

  test('Contact page should render correctly', async ({ page }) => {
    await page.goto('/contact-us');
    await page.waitForLoadState('domcontentloaded');

    await expect(page).toHaveScreenshot('contact-page.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.05,
    });
  });
});
