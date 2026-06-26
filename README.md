# AlertMedia QA Demo - Automation Framework

## Overview

A clean QA automation framework demonstrating **UI testing** and **API testing** with Playwright and TypeScript.

## Tech Stack

- **Playwright** - Browser automation & API testing
- **TypeScript** - Type-safe test code
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
├── playwright.config.ts      # Playwright config
└── package.json
```

## Getting Started

```bash
npm install
npx playwright install
npm test
```

## Test Results

**26 tests passing** across 2 projects:
- **UI**: 14 tests (login, dashboard, admin panel)
- **API**: 12 tests (users CRUD, posts CRUD)

## Key Features

- **Page Object Model**: Clean separation of UI logic
- **API Testing**: REST endpoint validation
- **TypeScript**: Type-safe code
- **CI/CD**: GitHub Actions workflow

## Interview Talking Points

1. **Why Playwright?** - Auto-waiting, multi-browser, built-in API testing
2. **Why Page Object Model?** - Maintainability, reusability, separation of concerns
3. **Test Strategy** - UI for user flows, API for data validation
4. **CI/CD** - Automated on PR, HTML reports, artifact preservation
