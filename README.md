# AlertMedia QA Demo - Comprehensive Automation Framework

## Overview

A comprehensive QA automation framework demonstrating **UI testing**, **API testing**, **Accessibility testing (WCAG 2.2 AA)**, **CMS content validation**, and **Performance testing** with Playwright, TypeScript, axe-core, and k6.

## Features

- **Page Object Model**: Clean separation of UI logic
- **API Testing**: REST endpoint validation with CRUD operations
- **Accessibility Testing**: WCAG 2.2 AA compliance with axe-core
- **CMS Testing**: Content validation with DotCMS demo site
- **Performance Testing**: Load testing with k6 (smoke, average, stress scenarios)
- **Semantic Locators**: Using `getByRole`, `getByPlaceholder`, `getByText` for resilient tests
- **TypeScript**: Type-safe code with interfaces
- **CI/CD**: GitHub Actions workflow

## Tech Stack

- **Playwright** - Browser automation & API testing
- **TypeScript** - Type-safe test code
- **axe-core** - Accessibility testing (WCAG 2.2 AA)
- **k6** - Performance/load testing
- **GitHub Actions** - CI/CD pipeline

## Project Structure

```
alertmedia-qa-demo/
├── pages/
│   ├── LoginPage.ts          # Login page object
│   ├── DashboardPage.ts      # Dashboard page object
│   ├── AdminPage.ts          # Admin panel page object
│   └── ContentPage.ts        # CMS content page object
├── tests/
│   ├── ui.spec.ts            # UI tests (login, dashboard, admin)
│   ├── api.spec.ts           # API tests (CRUD operations)
│   ├── accessibility.spec.ts # Accessibility tests (WCAG 2.2 AA)
│   └── cms.spec.ts           # CMS content validation tests
├── performance/
│   └── load-tests.ts         # k6 load test scenarios
├── fixtures/
│   └── test-data.ts          # Test data with TypeScript interfaces
├── playwright.config.ts      # Playwright config
└── package.json
```

## Getting Started

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Run all tests
npm test

# Run specific test suites
npm run test:ui
npm run test:api
npm run test:a11y
npm run test:cms

# Run in headed mode
npm run test:headed

# Debug mode
npm run test:debug

# View Playwright HTML report
npm run report

# Performance tests (requires k6)
npm run perf:smoke
npm run perf:average
npm run perf:stress
npm run perf:all
```

## Test Results

**51+ tests passing** across 4 projects:

- **UI**: 14 tests (Login: 5, Dashboard: 5, Admin: 4)
- **API**: 12 tests (Users CRUD: 7, Posts: 5)
- **Accessibility**: 5 tests (Keyboard navigation, alt text, WCAG scans, navigation, admin)
- **CMS**: 10 tests (Content validation, navigation, forms, admin console)
- **Performance**: 3 scenarios (Smoke, Average Load, Stress Test)

## Key Features Explained

### Semantic Locators

Tests use Playwright's recommended semantic locators for resilience:

```typescript
// Instead of CSS selectors
page.locator('input[name="username"]');

// Use semantic locators
page.getByPlaceholder('Username');
page.getByRole('button', { name: 'Login' });
page.getByText('Forgot your password?');
```

### Page Object Model

Each page is a class with locators and methods:

```typescript
export class LoginPage {
  readonly usernameInput = page.getByPlaceholder('Username');
  readonly loginButton = page.getByRole('button', { name: 'Login' });

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
```

### Accessibility Testing

Automated WCAG 2.2 AA compliance testing with axe-core:

```typescript
const results = await new AxeBuilder({ page })
  .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
  .analyze();

// Log violations with impact levels
results.violations.forEach((v) => {
  console.log(`${v.id}: ${v.impact} - ${v.description}`);
});
```

### CMS Testing

Validate dynamic content from CMS platforms:

```typescript
// Verify CMS-driven content sections load
const activities = page.locator('a[href*="/activities/"]');
expect(await activities.count()).toBeGreaterThan(0);

// Validate content structure
const images = page.locator('img');
const alt = await images.first().getAttribute('alt');
expect(alt).toBeTruthy();
```

### Performance Testing

Load testing with k6:

```typescript
export const options = {
  scenarios: {
    smoke_test: { executor: 'constant-vus', vus: 5, duration: '30s' },
    average_load: { executor: 'ramping-vus', stages: [...] },
    stress_test: { executor: 'ramping-vus', stages: [...] },
  },
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    errors: ['rate<0.01'],
  },
};
```

## Interview Talking Points

1. **Why Playwright?** - Auto-waiting, multi-browser, built-in API testing, semantic locators
2. **Why Page Object Model?** - Maintainability, reusability, separation of concerns
3. **Why Semantic Locators?** - More resilient than CSS, test the app like users interact with it
4. **Test Strategy** - UI for user flows, API for data validation, a11y for compliance, CMS for content
5. **Accessibility** - WCAG 2.2 AA compliance with automated and manual testing
6. **CMS Testing** - Validate dynamic content delivery and admin workflows
7. **Performance** - k6 load testing with smoke, average, and stress scenarios
8. **CI/CD** - Automated on PR, HTML reports, artifact preservation

## Study Guide

See [STUDY_GUIDE.md](./STUDY_GUIDE.md) for comprehensive interview preparation including:

- Code walkthrough script
- Technical deep-dives (performance, accessibility, CMS)
- 25+ interview questions with detailed answers
- Behavioral questions (STAR format)
- Scenario-based questions
- Test strategy templates
- Key concepts reference
