# Technical Interview Study Guide - QA Engineering Position

## Framework Overview

**Project:** Comprehensive QA automation framework demonstrating UI, API, Accessibility, CMS, Visual Regression, and Performance testing  
**Tech Stack:** Playwright + TypeScript, axe-core, k6, DotCMS  
**Test Count:** 45+ tests across 4 projects  
**Key Features:** Page Object Model, semantic locators, WCAG 2.2 AA testing, CMS validation, visual regression testing, load testing

---

## Part 1: Code Walkthrough Script (1-Hour Presentation)

### Opening (2-3 minutes)

> "This is a comprehensive QA automation framework I built that demonstrates multiple testing disciplines: UI end-to-end tests, REST API tests, accessibility testing aligned with WCAG 2.2 AA, CMS content validation using DotCMS, visual regression testing, and performance testing with k6. It has 45+ passing tests across 4 projects, with Playwright HTML reporting and a GitHub Actions CI/CD pipeline."

### File Order to Present

#### 1. `playwright.config.ts` (5 min)

- **Projects array (lines 16-40):** "I organized tests into 4 projects: UI, API, Accessibility, and CMS. Each has its own `baseURL` and uses `testMatch` regex to run only relevant tests. This separation allows teams to run specific test suites independently."
- **Reporter (lines 8-12):** "Two reporters: `list` for console output and `html` for Playwright's built-in interactive report with screenshots and traces."
- **Timeout config (lines 14-15):** "I set a 60-second timeout to handle slower demo sites, and 15-second action timeout for individual interactions."

#### 2. `fixtures/test-data.ts` (3 min)

- "I centralize all test data here with TypeScript interfaces. `Credentials` and `AlertPayload` are typed interfaces. This means if test data changes, I update one file, not 45 tests."
- "The alert payloads use realistic notification scenarios: severe weather alerts, office closures."

#### 3. `pages/LoginPage.ts` (5 min)

- **Semantic locators (lines 14-17):** "I use Playwright's recommended semantic locators: `getByPlaceholder`, `getByRole`, `getByText`. These are more resilient than CSS selectors because they test the app the way a user interacts with it."
- **login() method (lines 27-31):** "This encapsulates the entire login flow. Tests call `loginPage.login('Admin', 'admin123')` instead of repeating 3 lines of fill/click."

#### 4. `pages/ContentPage.ts` (5 min)

- "This page object is for CMS testing with DotCMS. It defines locators for dynamic content sections: navigation, hero section, activity cards, product cards, event cards, blog posts, and contact form."
- "The methods like `getActivityCount()` and `navigateToSection()` abstract CMS-specific interactions."

#### 5. `tests/ui.spec.ts` (10 min)

- **Login tests (lines 7-38):** "Each `beforeEach` sets up the page object. Tests are descriptive: 'should login with valid credentials', 'should show error with invalid credentials'."
- **Admin tests (lines 75-105):** "The `beforeEach` handles login + navigation to admin, so each test starts at the right state."

#### 6. `tests/api.spec.ts` (10 min)

- **TypeScript interfaces (lines 4-16):** "I define `Post` and `User` interfaces for type safety. No `any` types."
- **POST test (lines 47-55):** "This creates an alert using `alertPayloads.severeWeather` from fixtures. I validate status code 201, response body, and that an ID was generated."
- **404 test (lines 118-121):** "I test negative cases too. Requesting a non-existent resource should return 404."

#### 7. `tests/accessibility.spec.ts` (10 min)

- **axe-core integration (lines 1-2):** "I use `@axe-core/playwright` for automated accessibility testing. This scans pages for WCAG 2.2 AA violations."
- **Keyboard navigation test (lines 5-22):** "This validates that form fields can be navigated using only the keyboard, which is critical for users with motor disabilities."
- **Dashboard scan (lines 39-77):** "After login, I run a full accessibility scan. The test logs violations with their impact level (critical, serious, moderate, minor). This is what I'd report to developers."
- **Real findings:** "The scan found 6 violations including missing lang attribute, color contrast issues, and buttons without discernible text. These are real issues I'd file as bugs."

#### 8. `tests/cms.spec.ts` (10 min)

- **DotCMS demo site (lines 1-10):** "I test against a live DotCMS instance at demo.dotcms.com. This is a real CMS platform with dynamic content."
- **Content validation (lines 12-26):** "I verify that dynamic content sections load: activities, products, events, blog posts. These are all CMS-driven."
- **Navigation test (lines 28-37):** "I validate that CMS-driven navigation contains expected menu items."
- **Admin console (lines 133-148):** "I test the CMS backend login with default credentials to verify admin access works."

#### 9. `performance/load-tests.ts` (10 min)

- **k6 scenarios (lines 10-35):** "I define three load test scenarios: smoke test (5 users, 30s), average load (ramping to 20 users), and stress test (ramping to 50 users)."
- **Thresholds (lines 36-39):** "I set performance thresholds: 95th percentile response time < 2000ms, error rate < 1%. If these are exceeded, the test fails."
- **Batch requests (lines 41-52):** "In the smoke test, I use `http.batch()` to send multiple requests in parallel, simulating real user behavior."

#### 10. `.github/workflows/ci.yml` (3 min)

- "Runs on push to main and on every PR. Installs deps, Playwright browsers, runs all tests, and uploads the HTML report as an artifact."

#### 11. Live Demo (10-15 min)

- Run `npm test` to show all tests passing
- Run `npm run test:a11y` to show accessibility tests with violation reports
- Run `npm run test:cms` to show CMS content validation
- Run `npm run report` to open the Playwright HTML report
- Show k6 performance test output (if k6 is installed)

---

## Part 2: Technical Deep-Dives

### Performance Testing with k6

**What is k6?**

- Open-source load testing tool by Grafana
- JavaScript/TypeScript scripts
- Developer-friendly, CI/CD integration
- Measures response times, throughput, error rates

**Three Test Scenarios:**

1. **Smoke Test:** Low load (5 VUs, 30s) - Verify baseline functionality
2. **Average Load:** Ramping to 20 VUs - Typical usage patterns
3. **Stress Test:** Ramping to 50 VUs - Find breaking point

**Key Metrics:**

- **Response Time:** p(95) < 2000ms, p(99) < 3000ms
- **Error Rate:** < 1%
- **Throughput:** Requests per second
- **Virtual Users (VUs):** Simulated concurrent users

**Thresholds:**

```typescript
thresholds: {
  http_req_duration: ['p(95)<2000', 'p(99)<3000'],
  errors: ['rate<0.01'],
}
```

**Interview Talking Points:**

- "I use k6 because it's JavaScript-native and integrates with our existing TypeScript codebase"
- "I test three scenarios: smoke for baseline, average for typical usage, stress to find limits"
- "I set thresholds on response times and error rates to catch performance regressions in CI"
- "In production, I'd test against staging environments that mirror production load"

---

### Accessibility Testing (WCAG 2.2 AA)

**What is WCAG 2.2 AA?**

- Web Content Accessibility Guidelines, version 2.2, level AA
- International standard for web accessibility
- Covers perceivable, operable, understandable, robust content

**Automated Testing with axe-core:**

```typescript
const results = await new AxeBuilder({ page })
  .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
  .analyze();
```

**Common Violations Found:**

1. **html-has-lang** (serious): Missing `lang` attribute on `<html>`
2. **color-contrast** (serious): Insufficient contrast ratio
3. **button-name** (critical): Buttons without discernible text
4. **image-alt** (critical): Images without alt text
5. **list** (serious): Improper list structure

**Manual Testing Checklist:**

- [ ] Keyboard-only navigation (Tab, Shift+Tab, Enter, Space)
- [ ] Screen reader testing (VoiceOver, NVDA, JAWS)
- [ ] Color contrast validation (WebAIM Contrast Checker)
- [ ] Focus indicators visible
- [ ] Form labels properly associated
- [ ] Error messages accessible
- [ ] Dynamic content announced to screen readers

**Interview Talking Points:**

- "I use axe-core integrated with Playwright for automated accessibility testing"
- "I test at key user journey points: login, navigation, form interactions"
- "I also do manual testing with keyboard-only navigation and VoiceOver"
- "I prioritize violations by impact: critical and serious first, then moderate and minor"
- "I report violations with specific WCAG criteria, affected elements, and remediation guidance"

---

### CMS Testing (Contentful, ContentStack, DotCMS)

**What is CMS Testing?**

- Validating content managed through a CMS
- Testing dynamic content delivery
- Verifying content structure and schema
- Testing admin workflows (create, edit, publish)

**CMS Testing Strategy:**

1. **Content Retrieval:** Verify content loads on frontend
2. **Content Structure:** Validate expected fields (title, body, images)
3. **Admin Workflows:** Test create/edit/publish in backend
4. **Content Publishing:** Verify content appears after publishing
5. **Dynamic Content:** Test templates, variables, personalization

**DotCMS Demo Testing:**

- **Frontend:** https://demo.dotcms.com (public content)
- **Backend:** https://demo.dotcms.com/dotAdmin (admin console)
- **Credentials:** admin@dotcms.com / admin

**What I Test:**

- Homepage loads with all dynamic sections (activities, products, events, blog)
- Navigation contains CMS-driven menu items
- Activity cards have images and links
- Product cards have content
- Blog posts have links
- Contact form is functional
- Admin console login works

**Interview Talking Points:**

- "I test CMS-driven content by validating that dynamic sections load correctly"
- "I verify content structure: images have alt text, links have valid hrefs, forms have labels"
- "I test both frontend content delivery and backend admin workflows"
- "For Contentful/ContentStack, I'd also test the Content API (GraphQL/REST)"
- "I validate content schema to ensure required fields are present"
- "I test preview environments vs published content to catch issues before going live"

---

### Visual Regression Testing

**What is Visual Regression Testing?**

- Automated screenshot comparison to catch visual bugs
- Detects layout shifts, styling issues, rendering problems
- Complements functional tests (which validate structure, not appearance)
- Critical for CMS-driven sites where content changes affect layout

**How It Works:**

1. **Baseline:** First run captures screenshot and saves as baseline
2. **Comparison:** Subsequent runs compare against baseline
3. **Detection:** Any visual difference beyond threshold fails the test
4. **Review:** Developer reviews diff and updates baseline if change is intentional

**Playwright Implementation:**

```typescript
test('CMS homepage should match visual baseline', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('cms-homepage.png', {
    fullPage: true,
    maxDiffPixelRatio: 0.05, // Allow 5% pixel difference
  });
});
```

**Configuration:**

- **Viewport:** 1280x720 (standard desktop)
- **Full page:** Captures entire scrollable page
- **Threshold:** 5% pixel difference allowed (accounts for minor rendering variations)
- **Baselines:** Stored in `tests/cms-visual.spec.ts-snapshots/` and committed to repo

**What I Test:**

- CMS homepage full-page rendering
- Blog post page layout
- Product listing page structure
- Contact page form rendering

**Interview Talking Points:**

- "I use Playwright's built-in visual regression testing to catch visual bugs when CMS content changes"
- "Visual tests complement functional tests - functional tests validate structure, visual tests validate appearance"
- "Baselines are committed to the repo, so any visual change triggers a test failure for review"
- "I evaluated Applitools for AI-powered visual testing, but Playwright's native solution met our needs"
- "Visual testing is especially important for CMS-driven sites where content editors can inadvertently break layouts"

---

## Part 3: Interview Questions & Answers

### Technical Questions

#### Q1: "Why did you choose Playwright over Selenium or Cypress?"

> "Three main reasons. First, **auto-waiting** - Playwright automatically waits for elements to be actionable, which eliminates most flaky tests without explicit waits. Second, **built-in API testing** - I can test both UI and API in the same framework without needing separate tools. Third, **speed** - parallel execution with workers, and the `testMatch` pattern lets me run UI and API tests independently. Also, Playwright's semantic locators like `getByRole` and `getByPlaceholder` are more resilient than CSS selectors."

#### Q2: "Explain the Page Object Model and why you use it."

> "POM separates UI selectors and actions from test logic. Each page of the application is a class. For example, my `LoginPage` class has locators like `usernameInput` and methods like `login()`. The test just calls `loginPage.login('Admin', 'admin123')`. The benefits are: **maintainability** - if the login form changes, I update one file, not every test. **Readability** - tests read like user stories. **Reusability** - the same `login()` method is used across all test suites."

#### Q3: "How do you approach performance testing?"

> "I use k6 for load testing. I create three scenarios: **smoke test** with 5 virtual users to verify baseline, **average load** ramping to 20 users to simulate typical usage, and **stress test** ramping to 50 users to find the breaking point. I set thresholds on response times (p95 < 2000ms) and error rates (< 1%). If these thresholds are exceeded, the test fails, which catches performance regressions in CI. I test key endpoints like GET /posts, GET /posts/1, and POST /posts to cover read and write operations."

#### Q4: "What's your experience with accessibility testing?"

> "I use axe-core integrated with Playwright for automated WCAG 2.2 AA testing. I scan pages at key user journey points: login, dashboard, forms. The scan identifies violations like missing lang attributes, color contrast issues, buttons without text, and images without alt text. I also do manual testing with keyboard-only navigation to verify focus order and screen reader compatibility. In this framework, the accessibility scan found 6 violations including 2 critical issues (buttons without discernible text, images without alt text) and 4 serious issues (color contrast, missing lang attribute). I'd report these to developers with specific WCAG criteria and remediation guidance."

#### Q5: "How do you test CMS-driven content?"

> "I test CMS content at multiple levels. First, I validate that dynamic content sections load correctly on the frontend - activities, products, events, blog posts. Second, I verify content structure: images have alt text, links have valid hrefs, forms have proper labels. Third, I test navigation to ensure CMS-driven menu items are present. Fourth, I test the admin console to verify content management workflows work. For headless CMS platforms like Contentful or ContentStack, I'd also test the Content API (GraphQL or REST) to validate content schema and delivery. I'd test preview environments vs published content to catch issues before they go live."

#### Q5b: "How do you catch visual bugs when CMS content changes?"

> "I use Playwright's built-in visual regression testing. When content editors update the CMS, visual tests catch layout shifts, styling issues, and rendering problems that functional tests miss. I take full-page screenshots at 1280x720 viewport and compare against committed baselines with a 5% pixel difference threshold. In this framework, I have 4 visual tests covering the homepage, blog posts, product listings, and contact page. Baselines are stored in the repo, so any visual change triggers a test failure for review. I evaluated Applitools for AI-powered visual testing, but Playwright's native solution met our needs without additional cost."

#### Q6: "How do you handle test data?"

> "I centralize test data in a `fixtures/test-data.ts` file. I define TypeScript interfaces like `Credentials` and `AlertPayload`, then export typed constants. Tests import `credentials.valid` instead of hardcoding 'Admin'. This means if credentials change, I update one file. In a production framework, I'd extend this with environment variables for sensitive data and dynamic data generation for test isolation."

#### Q7: "How do you ensure tests don't depend on each other?"

> "Each test has its own `beforeEach` that sets up the required state. For UI tests, each test logs in fresh. For API tests, each test sends its own request and validates independently. I don't share state between tests. The `fullyParallel: true` config means tests can run in any order, which forces independence."

#### Q8: "What's your approach to API testing?"

> "I test the full CRUD lifecycle: GET for reading, POST for creating, PUT for updating, DELETE for removing. For each endpoint I validate: **status codes** (200, 201, 404), **response body** (correct fields, correct values), **response headers** (content-type), and **edge cases** like non-existent resources or filtering. I use Playwright's built-in `request` fixture, which means no external HTTP libraries needed."

#### Q9: "How do you handle flaky tests?"

> "Playwright's auto-waiting handles most timing issues. For the remaining cases: I use `waitForLoadState('networkidle')` after navigation instead of hardcoded timeouts. I use semantic locators like `getByRole` which are more stable than CSS classes. In CI, I'd set `retries: 2` for flaky tests. I also take screenshots on failure and traces on retry for debugging. If a test is consistently flaky, I quarantine it and fix it separately rather than letting it block the pipeline."

#### Q10: "Explain your CI/CD setup."

> "I use GitHub Actions. The workflow triggers on push to main and on PRs. It checks out the code, installs Node.js with npm caching, runs `npm ci` for deterministic installs, installs Playwright browsers, runs all tests, and uploads the HTML report as an artifact with 14-day retention. The `if: always()` on the upload step ensures we get reports even when tests fail, which is critical for debugging."

#### Q11: "How would you scale this framework for a larger application?"

> "Several things: **Add more page objects** for each feature area. **Create a base page class** with shared methods like `waitForPageLoad()` and `takeScreenshot()`. **Add custom Playwright fixtures** using `test.extend()` to share authenticated state across tests, eliminating the login in every `beforeEach`. **Add visual regression testing** with `expect(page).toHaveScreenshot()`. **Add test sharding** in CI to split tests across multiple machines. **Add Slack/Teams notifications** for test failures. **Add database helpers** for test data setup and teardown."

#### Q12: "How do you debug a failing test?"

> "First, I check the **error message and stack trace** in the console output. Playwright shows the exact line that failed. Second, I check the **screenshot on failure** - my config has `screenshot: 'only-on-failure'`. Third, I use the **trace viewer** - with `trace: 'on-first-retry'`, Playwright records DOM snapshots, network logs, and console output at each step. I can replay the test step by step. For local debugging, I use `--debug` flag which opens Playwright Inspector for step-through debugging."

#### Q13: "What testing strategies do you follow?"

> "I follow the **testing pyramid**: many fast unit tests at the base, integration tests in the middle, and fewer E2E tests at the top. In this framework, API tests are my integration layer - they're fast and test the backend independently. UI tests are my E2E layer - they test the full user experience. I also do **negative testing** - not just happy paths, but invalid credentials, empty fields, 404 responses. And I test **boundary conditions** like filtering and pagination."

#### Q14: "How do you use AI tools in your QA workflow?"

> "I use AI tools like Cursor and Claude to speed up test writing - generating test cases from requirements, creating page objects from UI screenshots, and debugging failures by analyzing error logs. I also use AI for test data generation and for reviewing test coverage gaps. AI significantly improves productivity for repetitive tasks like writing boilerplate test code. However, I always review AI-generated tests to ensure they follow our patterns and actually test what we need."

#### Q15: "What QA metrics do you track?"

> "I track several key metrics: **Test coverage** - percentage of features covered by automated tests. **Defect escape rate** - bugs found in production vs found in testing. **Automation coverage** - percentage of tests that are automated vs manual. **Flaky test rate** - percentage of tests that fail intermittently. **Mean time to detect** - how long it takes to find a bug. **Mean time to resolve** - how long it takes to fix a bug. **Test execution time** - how long the test suite takes to run. I'd present these in dashboards to give visibility into quality."

---

### Behavioral Questions (STAR Format)

#### Q16: "Tell me about a time you found a critical bug."

> **Situation:** "While testing a payment processing feature..."
> **Task:** "I needed to validate the checkout flow..."
> **Action:** "I noticed that when a user's session expired during checkout, the payment was processed but the order confirmation wasn't shown. I wrote an automated test that reproduced it consistently by simulating session timeout during the payment step. I documented it with steps to reproduce, environment details, and screenshots."
> **Result:** "The fix was to extend the session during critical checkout steps. I added a regression test to prevent it from happening again. This prevented potential revenue loss and customer frustration."

#### Q17: "Tell me about a time you had to push back on a release."

> **Situation:** "We were about to release a major feature update..."
> **Task:** "I was responsible for signing off on quality..."
> **Action:** "During final regression testing, I found that the new feature broke an existing workflow for 20% of our users. I documented the issue, calculated the business impact, and presented it to the product owner and engineering lead. I recommended delaying the release by 2 days to fix the issue."
> **Result:** "The release was delayed by 2 days. The fix was implemented and tested. We avoided a situation that would have impacted thousands of users and generated support tickets. The product owner thanked me for catching it."

#### Q18: "Tell me about a time you mentored a junior QA."

> **Situation:** "A junior QA joined our team and was struggling with test automation..."
> **Task:** "I was asked to mentor them..."
> **Action:** "I set up weekly 1:1 sessions to review their code and discuss best practices. I created a training plan covering Playwright basics, page object model, and debugging techniques. I paired with them on their first few test scripts and provided detailed code reviews. I encouraged them to ask questions and experiment."
> **Result:** "Within 3 months, they were writing independent test scripts and contributing to the framework. They eventually became the go-to person for accessibility testing on the team."

#### Q19: "Tell me about a time you improved a testing process."

> **Situation:** "Our test suite was taking 45 minutes to run, blocking deployments..."
> **Task:** "I was asked to optimize test execution time..."
> **Action:** "I analyzed the test suite and identified several bottlenecks: tests were running sequentially, there were redundant login steps, and some tests were waiting unnecessarily. I implemented parallel execution with 3 workers, created custom fixtures to share authentication state, and removed unnecessary waits. I also added test sharding in CI to split tests across multiple machines."
> **Result:** "Test execution time dropped from 45 minutes to 12 minutes, a 73% improvement. This allowed us to run tests on every PR instead of just on main, catching bugs earlier."

#### Q20: "Tell me about a time you had to communicate with non-technical stakeholders."

> **Situation:** "The marketing team wanted to launch a new landing page..."
> **Task:** "I needed to explain the testing requirements and timeline..."
> **Action:** "I created a simple test plan document that avoided technical jargon. I used visual diagrams to show the testing flow and provided clear timelines. I held a 30-minute meeting to walk through the plan and answer questions. I set up a shared dashboard showing test progress and results."
> **Result:** "The marketing team understood the testing process and timeline. They appreciated the transparency and felt confident in the quality. The launch went smoothly with no issues."

---

### Scenario-Based Questions

#### Q21: "How would you build a test strategy from scratch for a new product?"

> "I'd start by understanding the product requirements and user journeys. I'd identify critical paths that must work (e.g., user registration, checkout, core features). Then I'd apply the testing pyramid: many unit tests for business logic, integration tests for API endpoints, and fewer E2E tests for critical user flows. I'd prioritize tests by risk and impact. I'd set up CI/CD integration from day one. I'd establish quality metrics and reporting. I'd also plan for accessibility, performance, and security testing based on the product's requirements."

#### Q22: "How would you test a mass notification system?"

> "I'd test at multiple levels: **API tests** for creating/sending notifications, validating response times, and checking delivery status. **UI tests** for the notification creation flow, template selection, and recipient group management. **Performance tests** for sending to large recipient groups - does the system handle 10,000 recipients? **Integration tests** for delivery channels - SMS, email, push notifications. **Reliability tests** for retry logic and delivery confirmations. I'd also test **alert templates**, **scheduling**, and **recipient group management** as separate test suites."

#### Q23: "How would you handle a situation where tests are passing but users are reporting bugs?"

> "First, I'd analyze the production bugs to identify patterns. Are they in specific browsers, devices, or user flows? Then I'd review our test coverage to see if we're missing these scenarios. I'd add tests for the reported bugs to prevent regression. I'd also consider whether we need more exploratory testing, user acceptance testing, or monitoring in production. The goal is to close the gap between our test environment and real-world usage."

#### Q24: "How would you convince a developer that a bug they think is minor is actually critical?"

> "I'd quantify the impact. How many users are affected? What's the business impact (revenue loss, support costs, reputation damage)? I'd provide data: analytics showing user drop-off, support ticket volume, or error logs. I'd frame it in terms of user experience and business goals, not just technical correctness. For example, 'This accessibility issue prevents 15% of users from completing checkout' is more compelling than 'This violates WCAG 2.1.1'."

#### Q25: "How would you prioritize testing when you have limited time before a release?"

> "I'd use risk-based testing. I'd identify the highest-risk areas: new features, recently changed code, critical user flows, and areas with historical bugs. I'd focus on smoke tests and critical path testing first. I'd skip low-priority tests like edge cases and nice-to-have features. I'd also consider the impact of potential bugs - what's the worst that could happen? I'd communicate the risks to stakeholders and get their sign-off on what to test and what to skip."

---

## Part 4: Questions YOU Should Ask Them

1. "What does your current test coverage look like, and where are the biggest gaps?"
2. "What CI/CD tools are you using, and how long does your test pipeline take?"
3. "How do you handle test environments - do you have staging environments that mirror production?"
4. "What's your process for handling flaky tests?"
5. "How does the QA team collaborate with Engineering and Product on bug prioritization?"
6. "What accessibility standards do you follow, and how do you validate compliance?"
7. "How do you measure quality? What metrics do you track?"
8. "What does your on-call or production monitoring look like?"
9. "How do you balance manual vs automated testing?"
10. "What opportunities are there for mentorship and knowledge sharing on the team?"

---

## Part 5: Test Strategy Templates

### Test Strategy Document Template

```markdown
# Test Strategy: [Product/Feature Name]

## 1. Overview

- Product/feature description
- Key objectives
- Scope (in/out)

## 2. Test Approach

- Testing levels (unit, integration, E2E)
- Testing types (functional, performance, accessibility, security)
- Test environments
- Test data strategy

## 3. Test Coverage

- Critical user flows
- Feature coverage matrix
- Risk-based prioritization

## 4. Automation Strategy

- Framework selection
- Test architecture (POM, fixtures)
- CI/CD integration
- Test reporting

## 5. Quality Metrics

- Test coverage %
- Defect escape rate
- Automation coverage %
- Flaky test rate

## 6. Risks & Mitigation

- Identified risks
- Mitigation strategies
- Contingency plans

## 7. Timeline & Resources

- Test planning phase
- Test development phase
- Execution phase
- Resources needed
```

### Shift-Left Testing Checklist

- [ ] Participate in requirements review
- [ ] Identify testable requirements
- [ ] Create test cases during design phase
- [ ] Review API contracts before development
- [ ] Write automated tests alongside development
- [ ] Run tests on every PR
- [ ] Provide feedback within 24 hours
- [ ] Pair with developers on complex features
- [ ] Conduct code reviews for test coverage
- [ ] Advocate for testability in design

---

## Part 6: Key Commands

```bash
npm test              # Run all 51+ tests
npm run test:ui       # Run only UI tests (14 tests)
npm run test:api      # Run only API tests (12 tests)
npm run test:a11y     # Run accessibility tests (5 tests)
npm run test:cms      # Run CMS tests (14 tests: 10 content + 4 visual)
npm run test:headed   # Run tests with browser visible
npm run test:debug    # Debug mode with Playwright Inspector
npm run report        # Open HTML report
npm run perf:smoke    # Run k6 smoke test
npm run perf:average  # Run k6 average load test
npm run perf:stress   # Run k6 stress test
npm run perf:all      # Run all k6 scenarios
```

---

## Part 7: Framework Stats

- **Total Tests:** 45+
- **UI Tests:** 14 (Login: 5, Dashboard: 5, Admin: 4)
- **API Tests:** 12 (Users CRUD: 7, Posts: 5)
- **Accessibility Tests:** 5 (Keyboard nav, alt text, WCAG scans, navigation, admin)
- **CMS Tests:** 14 (Content validation: 10, Visual regression: 4)
- **Performance Tests:** 3 scenarios (smoke, average, stress)
- **Test Time:** ~2 minutes for all Playwright tests
- **Page Objects:** 4 (LoginPage, DashboardPage, AdminPage, ContentPage)
- **TypeScript Interfaces:** 4 (Credentials, AlertPayload, Post, User)

---

## Part 8: Quick Reference - Key Concepts

### Playwright

- **Auto-waiting:** Automatically waits for elements to be actionable
- **Semantic locators:** `getByRole`, `getByPlaceholder`, `getByText`
- **Page Object Model:** Separate UI logic from test logic
- **Fixtures:** Share setup code across tests
- **Trace viewer:** Debug failed tests with DOM snapshots and network logs

### Accessibility (WCAG 2.2 AA)

- **axe-core:** Automated accessibility testing library
- **Keyboard navigation:** Tab, Shift+Tab, Enter, Space
- **Screen readers:** VoiceOver (Mac), NVDA (Windows), JAWS (Windows)
- **Color contrast:** Minimum 4.5:1 for normal text, 3:1 for large text
- **Alt text:** Descriptive text for images

### CMS Testing

- **Content validation:** Verify dynamic content loads correctly
- **Content structure:** Validate fields, images, links
- **Admin workflows:** Test create, edit, publish
- **Preview vs published:** Test content before going live

### Visual Regression Testing

- **Screenshot comparison:** Catch visual bugs when content changes
- **Baselines:** Committed to repo for version control
- **Threshold:** 5% pixel difference allowed for minor rendering variations
- **Viewport:** 1280x720 standard desktop resolution
- **Full page:** Captures entire scrollable page
- **Content API:** Test GraphQL/REST endpoints

### Performance Testing (k6)

- **Virtual Users (VUs):** Simulated concurrent users
- **Scenarios:** Smoke, average load, stress test
- **Thresholds:** Response time, error rate
- **Metrics:** p95, p99, throughput, error rate
- **Ramping:** Gradually increase load

---

**Good luck with your interview! Remember: be confident, show the code, and explain your decisions clearly.**
