# AlertMedia QA Demo - Automation Framework

## Overview

A comprehensive QA automation framework for testing a notification/alert management platform. This project demonstrates modern testing practices including **UI testing**, **API testing**, and **hybrid (UI + API) integration tests**.

## Architecture

### Design Patterns
- **Page Object Model (POM)**: All UI interactions are abstracted into page classes under `pages/`
- **Data-Driven Testing**: Test data is centralized in `fixtures/test-data.ts`
- **API Helper Layer**: Reusable API utilities in `utils/api-helpers.ts`

### Test Layers
| Layer | Location | Purpose |
|-------|----------|---------|
| UI Tests | `tests/ui/` | End-to-end user flow validation |
| API Tests | `tests/api/` | REST API CRUD & auth validation |
| Hybrid Tests | `tests/hybrid/` | Cross-layer data consistency checks |

### Test Targets
- **UI**: OrangeHRM Demo (SaaS platform with login, dashboard, admin features)
- **API**: JSONPlaceholder (REST API for CRUD operations on users, posts/alerts, comments)

## Tech Stack

- **Playwright** - Browser automation & API testing
- **TypeScript** - Type-safe test code
- **GitHub Actions** - CI/CD pipeline with sharded parallel execution
- **HTML Reporter** - Built-in Playwright test reporting

## Project Structure

```
alertmedia-qa-demo/
├── .github/workflows/ci.yml    # CI/CD pipeline
├── pages/                       # Page Object Model
│   ├── BasePage.ts             # Shared page functionality
│   ├── LoginPage.ts            # Login page interactions
│   ├── DashboardPage.ts        # Dashboard navigation & widgets
│   └── AdminPage.ts            # Admin panel operations
├── tests/
│   ├── ui/                     # UI end-to-end tests
│   │   ├── login.spec.ts       # Authentication flows
│   │   ├── dashboard.spec.ts   # Dashboard navigation
│   │   └── admin.spec.ts       # Admin CRUD operations
│   ├── api/                    # API tests
│   │   ├── users.spec.ts       # User & alert CRUD operations
│   │   └── auth.spec.ts        # Post/notification endpoints
│   └── hybrid/                 # Cross-layer tests
│       └── create-verify.spec.ts
├── fixtures/
│   └── test-data.ts            # Centralized test data
├── utils/
│   └── api-helpers.ts          # API request utilities
├── playwright.config.ts        # Playwright configuration
├── tsconfig.json               # TypeScript config
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
npm run test:hybrid

# Run in headed mode (watch tests execute)
npm run test:headed

# Debug mode
npm run test:debug

# View HTML report
npm run report
```

## Key Design Decisions

### Why Playwright?
- **Auto-waiting**: Eliminates flaky tests from timing issues
- **Multi-browser**: Test across Chromium, Firefox, and WebKit
- **Built-in API testing**: No need for separate HTTP libraries
- **Parallel execution**: Faster test runs with worker pools
- **Trace viewer**: Powerful debugging with screenshots, DOM snapshots, and network logs

### Why Page Object Model?
- **Separation of concerns**: UI selectors isolated from test logic
- **Maintainability**: Single place to update when UI changes
- **Reusability**: Page methods shared across multiple test files
- **Readability**: Tests read like user stories

### Why Hybrid Testing?
- **API for speed**: Create test data via API (fast, no UI dependency)
- **UI for validation**: Verify user-facing behavior
- **Data consistency**: Ensure API and UI show the same data
- **Realistic scenarios**: Mirrors how modern apps work (API + frontend)

## CI/CD Pipeline

The GitHub Actions workflow:
1. **Triggers**: On push to main/develop, PRs, and weekday schedule
2. **Sharding**: Tests split across 3 parallel runners for speed
3. **Artifacts**: HTML reports and failure screenshots preserved
4. **Merged reports**: Combined report from all shards

## Test Results

**38 tests passing** across 3 projects:
- **Chromium**: 20 UI tests (login, dashboard, admin)
- **Firefox**: 20 UI tests (cross-browser validation)
- **API**: 16 API tests + 3 hybrid tests (CRUD, schema, performance)

## Interview Talking Points

1. **Scalability**: Framework supports adding new pages/tests without modifying existing code
2. **Reliability**: Playwright's auto-wait + retries in CI reduce flakiness
3. **Speed**: Parallel execution + sharding keeps CI under 10 minutes
4. **Debugging**: Screenshots on failure, traces on retry, video recording
5. **Data isolation**: Each test uses independent data to prevent cross-test contamination
