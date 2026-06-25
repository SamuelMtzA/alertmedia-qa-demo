import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { AdminPage } from '../../pages/AdminPage';
import { ApiHelper } from '../../utils/api-helpers';
import { credentials, alertPayloads } from '../../fixtures/test-data';

test.describe('Hybrid Tests - API + UI Integration', () => {
  test('create alert via API then navigate UI to verify admin access', async ({ page, request }) => {
    const api = new ApiHelper(request);

    const createResponse = await api.post('/posts', alertPayloads.severeWeather);
    api.assertStatus(createResponse, 201);
    expect(createResponse.body.title).toBe(alertPayloads.severeWeather.title);

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.valid.username, credentials.valid.password);

    const dashboardPage = new DashboardPage(page);
    expect(await dashboardPage.isDashboardLoaded()).toBeTruthy();

    await dashboardPage.navigateToAdmin();

    const adminPage = new AdminPage(page);
    expect(await adminPage.isPageLoaded()).toBeTruthy();
  });

  test('verify API data consistency - fetch user via API then search in UI', async ({ page, request }) => {
    const api = new ApiHelper(request);

    const apiResponse = await api.get('/users/1');
    api.assertStatus(apiResponse, 200);
    expect(apiResponse.body.name).toBe('Leanne Graham');

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.valid.username, credentials.valid.password);

    const dashboardPage = new DashboardPage(page);
    expect(await dashboardPage.isDashboardLoaded()).toBeTruthy();

    await dashboardPage.navigateToAdmin();

    const adminPage = new AdminPage(page);
    await adminPage.searchByUsername('Admin');
    const count = await adminPage.getResultsCount();
    expect(count).toBeGreaterThan(0);
  });

  test('full workflow - login, create alert via API, verify dashboard loads', async ({ page, request }) => {
    const api = new ApiHelper(request);

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.valid.username, credentials.valid.password);

    const dashboardPage = new DashboardPage(page);
    expect(await dashboardPage.isDashboardLoaded()).toBeTruthy();

    const alertResponse = await api.post('/posts', alertPayloads.officeClosure);
    api.assertStatus(alertResponse, 201);

    const commentsResponse = await api.get(`/posts/${alertResponse.body.id}/comments`);
    api.assertStatus(commentsResponse, 200);

    await dashboardPage.navigateToAdmin();

    const adminPage = new AdminPage(page);
    expect(await adminPage.isPageLoaded()).toBeTruthy();

    const title = await adminPage.getPageTitle();
    expect(title).toBeTruthy();
  });
});
