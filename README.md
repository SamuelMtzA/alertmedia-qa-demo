# AlertMedia QA Demo - Automation Framework

## Overview

A clean QA automation framework demonstrating **UI testing** and **API testing** with Playwright and TypeScript. Features **Allure reporting** and **automatic bug report generation**.

## Features

- **Page Object Model**: Clean separation of UI logic
- **API Testing**: REST endpoint validation
- **Allure Reporting**: Rich, interactive test reports with step-by-step details
- **TypeScript**: Type-safe code
- **CI/CD**: GitHub Actions workflow

## Tech Stack

- **Playwright** - Browser automation & API testing
- **TypeScript** - Type-safe test code
- **Allure** - Advanced test reporting
- **GitHub Actions** - CI/CD pipeline

## Project Structure

```
alertmedia-qa-demo/
├── pages/
│   ├── LoginPage.ts          # Login page object
│   └── DashboardPage.ts      # Dashboard page object
├── tests/
│   ├── ui.spec.ts            # UI tests (login, dashboard, admin)
│   └── api.spec.ts           # API tests (CRUD operations)
├── fixtures/
│   └── test-data.ts          # Test data
├── allure-results/           # Allure test results
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

# Run in headed mode
npm run test:headed

# View Playwright HTML report
npm run report
```

## Viewing Reports

### Allure Report (Recommended)
Allure provides rich, interactive reports with test hierarchies, steps, and attachments:

```bash
# Generate and serve Allure report
npm run report:allure

# Or generate static report
npm run report:allure:generate
```

**Note:** Allure requires Java to be installed. Download from [allure-framework/allure2](https://github.com/allure-framework/allure2/releases) or install via:
- macOS: `brew install allure`
- Windows: `scoop install allure`
- Linux: Download from GitHub releases

### Playwright HTML Report
```bash
npm run report
```

## Test Results

**26 tests passing** across 2 projects:
- **UI**: 14 tests (login, dashboard, admin panel)
- **API**: 12 tests (users CRUD, posts CRUD)

## Key Features Explained

### Allure Annotations
Tests use `allure.step()`, `allure.epic()`, `allure.feature()`, and `allure.story()` to create hierarchical, readable test reports:

```typescript
await allure.epic('Authentication');
await allure.feature('Login');
await allure.story('Valid Login');

await allure.step('Enter valid credentials', async () => {
  await loginPage.login('Admin', 'admin123');
});
```

### Automatic Bug Reports
The custom `BugReporter` automatically generates detailed markdown bug reports when tests fail, including:
- Test environment information
- Extracted test steps
- Error messages and stack traces
- Suggested debugging actions

## Interview Talking Points

1. **Why Playwright?** - Auto-waiting, multi-browser, built-in API testing
2. **Why Page Object Model?** - Maintainability, reusability, separation of concerns
3. **Why Allure?** - Professional, interactive reports with test hierarchies and step details
4. **Test Strategy** - UI for user flows, API for data validation
5. **CI/CD** - Automated on PR, HTML reports, artifact preservation
