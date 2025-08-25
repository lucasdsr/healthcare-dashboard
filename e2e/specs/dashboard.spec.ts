import { test, expect } from '@playwright/test';

test.describe('Dashboard Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display main dashboard with metrics', async ({ page }) => {
    // Wait for dashboard to load
    await page.waitForSelector('[data-testid="metrics-dashboard"]', {
      timeout: 10000,
    });

    // Check if metrics are displayed
    await expect(page.getByText('Total Encounters')).toBeVisible();
    await expect(page.getByText('Active Encounters')).toBeVisible();
    await expect(page.getByText('Completed Today')).toBeVisible();
    await expect(page.getByText('Pending')).toBeVisible();

    // Check if metrics have values
    const totalEncounters = page.locator(
      '[data-testid="metric-total-encounters"]'
    );
    await expect(totalEncounters).toContainText(/\d+/);
  });

  test('should filter encounters by status', async ({ page }) => {
    // Open filters
    await page.click('[data-testid="filter-toggle"]');

    // Select status filter
    await page.selectOption('[data-testid="status-filter"]', 'in-progress');

    // Apply filter
    await page.click('[data-testid="apply-filters"]');

    // Wait for filtered results
    await page.waitForSelector('[data-testid="encounters-list"]');

    // Verify all displayed encounters have correct status
    const encounterStatuses = page.locator('[data-testid="encounter-status"]');
    await expect(encounterStatuses).toHaveCount(
      await encounterStatuses.count()
    );

    for (let i = 0; i < (await encounterStatuses.count()); i++) {
      await expect(encounterStatuses.nth(i)).toContainText('in-progress');
    }
  });

  test('should search encounters by patient name', async ({ page }) => {
    // Open search
    await page.click('[data-testid="search-toggle"]');

    // Type search query
    await page.fill('[data-testid="patient-search"]', 'John Doe');

    // Wait for search results
    await page.waitForSelector('[data-testid="search-results"]');

    // Verify search results contain the query
    const searchResults = page.locator('[data-testid="search-result"]');
    await expect(searchResults.first()).toContainText('John Doe');
  });

  test('should display charts correctly', async ({ page }) => {
    // Wait for charts to load
    await page.waitForSelector('[data-testid="status-chart"]');
    await page.waitForSelector('[data-testid="trends-chart"]');

    // Check if charts are rendered
    const statusChart = page.locator('[data-testid="status-chart"] svg');
    const trendsChart = page.locator('[data-testid="trends-chart"] svg');

    await expect(statusChart).toBeVisible();
    await expect(trendsChart).toBeVisible();

    // Verify chart legends
    await expect(page.getByText('Planned')).toBeVisible();
    await expect(page.getByText('In Progress')).toBeVisible();
    await expect(page.getByText('Finished')).toBeVisible();
  });

  test('should handle pagination correctly', async ({ page }) => {
    // Wait for encounters list
    await page.waitForSelector('[data-testid="encounters-list"]');

    // Check if pagination controls are visible
    const pagination = page.locator('[data-testid="pagination"]');
    await expect(pagination).toBeVisible();

    // Go to next page
    await page.click('[data-testid="next-page"]');

    // Verify page changed
    await expect(page.locator('[data-testid="current-page"]')).toContainText(
      '2'
    );

    // Verify different encounters are displayed
    const firstPageEncounters = await page
      .locator('[data-testid="encounter-id"]')
      .allTextContents();
    await page.click('[data-testid="prev-page"]');
    const secondPageEncounters = await page
      .locator('[data-testid="encounter-id"]')
      .allTextContents();

    expect(firstPageEncounters).not.toEqual(secondPageEncounters);
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check if mobile menu is accessible
    await page.click('[data-testid="mobile-menu-toggle"]');

    // Verify mobile menu is open
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();

    // Check if metrics are stacked vertically on mobile
    const metricsGrid = page.locator('[data-testid="metrics-grid"]');
    await expect(metricsGrid).toHaveClass(/grid-cols-1/);
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Focus on first interactive element
    await page.keyboard.press('Tab');

    // Navigate through interactive elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Verify focus is visible
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should handle accessibility features', async ({ page }) => {
    // Check for proper ARIA labels
    const chart = page.locator('[data-testid="status-chart"]');
    await expect(chart).toHaveAttribute('aria-label');

    // Check for proper heading hierarchy
    const headings = page.locator('h1, h2, h3');
    await expect(headings).toHaveCount(3);
  });
});
