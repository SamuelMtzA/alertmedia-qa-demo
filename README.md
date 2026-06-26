# AlertMedia QA Demo - Automation Framework

## Overview

A clean QA automation framework demonstrating **UI testing** and **API testing** with Playwright and TypeScript.

## Features

- **Page Object Model**: Clean separation of UI logic
- **API Testing**: REST endpoint validation
- **Semantic Locators**: Using `getByRole`, `getByPlaceholder`, `getByText` for resilient tests
- **TypeScript**: Type-safe code with interfaces
- **CI/CD**: GitHub Actions workflow

## Tech Stack

- **Playwright** - Browser automation & API testing
- **TypeScript** - Type-safe test code
- **GitHub Actions** - CI/CD pipeline

## Project Structure

```
alertmedia-qa-demo/
├── pages/
│   ├── LoginPage.ts          # Login page object
│   ├── DashboardPage.ts      # Dashboard page object
│   └── AdminPage.ts          # Admin panel page object
├── tests/
│   ├── ui.spec.ts            # UI tests (login, dashboard, admin)
│   └── api.spec.ts           # API tests (CRUD operations)
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

# Run in headed mode
npm run test:headed

# View Playwright HTML report
npm run report
```

## Test Results

**26 tests passing** across 2 projects:
- **UI**: 14 tests (login, dashboard, admin panel)
- **API**: 12 tests (users CRUD, posts CRUD)

## Key Features Explained

### Semantic Locators
Tests use Playwright's recommended semantic locators for resilience:

```typescript
// Instead of CSS selectors
page.locator('input[name="username"]')

// Use semantic locators
page.getByPlaceholder('Username')
page.getByRole('button', { name: 'Login' })
page.getByText('Forgot your password?')
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

### TypeScript Interfaces
Test data is typed for safety:

```typescript
export interface Credentials {
  username: string;
  password: string;
}

export interface AlertPayload {
  title: string;
  body: string;
  userId: number;
}
```

## Interview Talking Points

1. **Why Playwright?** - Auto-waiting, multi-browser, built-in API testing, semantic locators
2. **Why Page Object Model?** - Maintainability, reusability, separation of concerns
3. **Why Semantic Locators?** - More resilient than CSS, test the app like users interact with it
4. **Test Strategy** - UI for user flows, API for data validation
5. **CI/CD** - Automated on PR, HTML reports, artifact preservation
