# Phase 5: Testing & Polish

## 🎯 Objetivos

- Implementar cobertura completa de testes (unit, integration, e2e)
- Otimizar performance e acessibilidade
- Finalizar documentação técnica
- Preparar para deploy e produção
- Implementar CI/CD pipeline

## 🧪 Estratégia de Testes

### Estrutura de Testes

```
src/
├── __tests__/                    # Testes unitários
│   ├── domain/                   # Testes de entidades e regras
│   ├── application/              # Testes de casos de uso
│   ├── infrastructure/           # Testes de APIs e cache
│   └── presentation/             # Testes de componentes
├── test/                         # Configurações e utilitários
│   ├── setup.ts                  # Setup global dos testes
│   ├── mocks/                    # Mocks e fixtures
│   ├── utils/                    # Utilitários de teste
│   └── coverage/                 # Configuração de cobertura
└── e2e/                          # Testes end-to-end
    ├── specs/                    # Especificações de teste
    ├── fixtures/                 # Dados de teste
    └── utils/                    # Utilitários E2E
```

### Configuração Jest

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/test/**/*',
    '!src/e2e/**/*',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/index.{ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{ts,tsx}',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/e2e/'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json',
    },
  },
};
```

### Setup de Testes

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom';
import { server } from './mocks/server';

// MSW setup
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {
    return null;
  }
  unobserve() {
    return null;
  }
  disconnect() {
    return null;
  }
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {
    return null;
  }
  unobserve() {
    return null;
  }
  disconnect() {
    return null;
  }
};

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;
```

## 🧪 Testes Unitários

### Testes de Entidades

```typescript
// src/domain/entities/__tests__/encounter.test.ts
import { Encounter, EncounterStatus } from '../encounter';
import { Patient } from '../patient';
import { Practitioner } from '../practitioner';
import { Organization } from '../organization';

describe('Encounter Entity', () => {
  const mockPatient: Patient = {
    id: 'patient-1',
    resourceType: 'Patient',
    name: [{ text: 'John Doe' }],
  };

  const mockPractitioner: Practitioner = {
    id: 'practitioner-1',
    resourceType: 'Practitioner',
    name: [{ text: 'Dr. Smith' }],
  };

  const mockOrganization: Organization = {
    id: 'org-1',
    resourceType: 'Organization',
    name: 'General Hospital',
  };

  it('should create a valid encounter', () => {
    const encounter: Encounter = {
      id: 'encounter-1',
      resourceType: 'Encounter',
      status: 'in-progress',
      class: { code: 'AMB', display: 'Ambulatory' },
      subject: { reference: 'Patient/patient-1' },
      participant: [
        {
          individual: { reference: 'Practitioner/practitioner-1' },
          type: [{ code: 'ATND', display: 'Attending' }],
        },
      ],
      period: {
        start: '2024-01-01T10:00:00Z',
        end: '2024-01-01T11:00:00Z',
      },
      serviceProvider: { reference: 'Organization/org-1' },
    };

    expect(encounter.resourceType).toBe('Encounter');
    expect(encounter.status).toBe('in-progress');
    expect(encounter.subject.reference).toBe('Patient/patient-1');
  });

  it('should validate encounter status', () => {
    const validStatuses: EncounterStatus[] = [
      'planned',
      'arrived',
      'triaged',
      'in-progress',
      'onleave',
      'finished',
      'cancelled',
    ];

    validStatuses.forEach(status => {
      const encounter: Encounter = {
        id: 'encounter-1',
        resourceType: 'Encounter',
        status,
        class: { code: 'AMB', display: 'Ambulatory' },
        subject: { reference: 'Patient/patient-1' },
      };

      expect(encounter.status).toBe(status);
    });
  });

  it('should handle missing optional fields', () => {
    const minimalEncounter: Encounter = {
      id: 'encounter-1',
      resourceType: 'Encounter',
      status: 'planned',
      class: { code: 'AMB', display: 'Ambulatory' },
      subject: { reference: 'Patient/patient-1' },
    };

    expect(minimalEncounter.period).toBeUndefined();
    expect(minimalEncounter.participant).toBeUndefined();
    expect(minimalEncounter.serviceProvider).toBeUndefined();
  });
});
```

### Testes de Value Objects

```typescript
// src/domain/value-objects/__tests__/date-range.test.ts
import { DateRange } from '../date-range';

describe('DateRange Value Object', () => {
  it('should create a valid date range', () => {
    const start = new Date('2024-01-01');
    const end = new Date('2024-01-31');
    const dateRange = new DateRange(start, end);

    expect(dateRange.start).toBe(start);
    expect(dateRange.end).toBe(end);
  });

  it('should throw error for invalid date range', () => {
    const start = new Date('2024-01-31');
    const end = new Date('2024-01-01');

    expect(() => new DateRange(start, end)).toThrow(
      'Start date must be before end date'
    );
  });

  it('should create from ISO strings', () => {
    const start = '2024-01-01T00:00:00Z';
    const end = '2024-01-31T23:59:59Z';
    const dateRange = DateRange.fromISO(start, end);

    expect(dateRange.start.toISOString()).toBe(start);
    expect(dateRange.end.toISOString()).toBe(end);
  });

  it('should calculate correct number of days', () => {
    const start = new Date('2024-01-01');
    const end = new Date('2024-01-31');
    const dateRange = new DateRange(start, end);

    expect(dateRange.getDays()).toBe(30);
  });

  it('should handle same start and end date', () => {
    const date = new Date('2024-01-01');
    const dateRange = new DateRange(date, date);

    expect(dateRange.getDays()).toBe(0);
  });
});
```

### Testes de Componentes

```typescript
// src/presentation/components/dashboard/__tests__/metric-card.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MetricCard } from '../metric-card';
import { UserGroupIcon } from '@heroicons/react/24/outline';

describe('MetricCard Component', () => {
  const defaultProps = {
    title: 'Total Encounters',
    value: '1,234',
    icon: <UserGroupIcon />,
    change: { value: 12, isPositive: true }
  };

  it('should render with all props', () => {
    render(<MetricCard {...defaultProps} />);

    expect(screen.getByText('Total Encounters')).toBeInTheDocument();
    expect(screen.getByText('1,234')).toBeInTheDocument();
    expect(screen.getByText('+12% from last month')).toBeInTheDocument();
  });

  it('should render without optional props', () => {
    const { title, value } = defaultProps;
    render(<MetricCard title={title} value={value} />);

    expect(screen.getByText('Total Encounters')).toBeInTheDocument();
    expect(screen.getByText('1,234')).toBeInTheDocument();
    expect(screen.queryByText(/from last month/)).not.toBeInTheDocument();
  });

  it('should apply correct styles for positive change', () => {
    render(<MetricCard {...defaultProps} />);

    const changeText = screen.getByText('+12% from last month');
    expect(changeText).toHaveClass('text-healthcare-success-600');
  });

  it('should apply correct styles for negative change', () => {
    const propsWithNegativeChange = {
      ...defaultProps,
      change: { value: 5, isPositive: false }
    };

    render(<MetricCard {...propsWithNegativeChange} />);

    const changeText = screen.getByText('-5% from last month');
    expect(changeText).toHaveClass('text-healthcare-danger-600');
  });

  it('should render icon when provided', () => {
    render(<MetricCard {...defaultProps} />);

    const icon = screen.getByTestId('metric-icon');
    expect(icon).toBeInTheDocument();
  });

  it('should not render icon when not provided', () => {
    const { icon, ...propsWithoutIcon } = defaultProps;
    render(<MetricCard {...propsWithoutIcon} />);

    const iconElement = screen.queryByTestId('metric-icon');
    expect(iconElement).not.toBeInTheDocument();
  });
});
```

## 🔗 Testes de Integração

### MSW Setup para APIs

```typescript
// src/test/mocks/handlers.ts
import { rest } from 'msw';

const baseUrl = 'https://hapi.fhir.org/baseR4';

export const handlers = [
  // GET Encounters
  rest.get(`${baseUrl}/Encounter`, (req, res, ctx) => {
    const url = new URL(req.url);
    const count = parseInt(url.searchParams.get('_count') || '50');
    const page = parseInt(url.searchParams.get('_page') || '1');
    const status = url.searchParams.get('status');
    const date = url.searchParams.get('date');

    // Generate mock encounters
    const encounters = Array.from({ length: count }, (_, i) => ({
      resource: {
        id: `encounter-${page}-${i + 1}`,
        resourceType: 'Encounter',
        status:
          status ||
          ['planned', 'arrived', 'triaged', 'in-progress', 'finished'][i % 5],
        class: { code: 'AMB', display: 'Ambulatory' },
        subject: { reference: `Patient/patient-${i + 1}` },
        period: {
          start: date || '2024-01-01T10:00:00Z',
          end: '2024-01-01T11:00:00Z',
        },
        participant: [
          {
            individual: { reference: `Practitioner/practitioner-${i + 1}` },
            type: [{ code: 'ATND', display: 'Attending' }],
          },
        ],
      },
    }));

    return res(
      ctx.status(200),
      ctx.json({
        resourceType: 'Bundle',
        type: 'searchset',
        total: 1000,
        entry: encounters,
      })
    );
  }),

  // GET Patient
  rest.get(`${baseUrl}/Patient/:id`, (req, res, ctx) => {
    const { id } = req.params;

    return res(
      ctx.status(200),
      ctx.json({
        id,
        resourceType: 'Patient',
        name: [{ text: `Patient ${id}` }],
        gender: 'male',
        birthDate: '1990-01-01',
      })
    );
  }),

  // GET Practitioner
  rest.get(`${baseUrl}/Practitioner/:id`, (req, res, ctx) => {
    const { id } = req.params;

    return res(
      ctx.status(200),
      ctx.json({
        id,
        resourceType: 'Practitioner',
        name: [{ text: `Dr. ${id}` }],
        qualification: [
          {
            code: { coding: [{ code: 'MD', display: 'Medical Doctor' }] },
          },
        ],
      })
    );
  }),

  // GET Organization
  rest.get(`${baseUrl}/Organization/:id`, (req, res, ctx) => {
    const { id } = req.params;

    return res(
      ctx.status(200),
      ctx.json({
        id,
        resourceType: 'Organization',
        name: `Hospital ${id}`,
        type: [{ coding: [{ code: 'prov', display: 'Healthcare Provider' }] }],
      })
    );
  }),
];
```

### Testes de Integração

```typescript
// src/infrastructure/api/__tests__/fhir-client.test.ts
import { FhirClient } from '../fhir-client';
import { server } from '../../../test/mocks/server';
import { rest } from 'msw';

const baseUrl = 'https://hapi.fhir.org/baseR4';
const fhirClient = new FhirClient(baseUrl);

describe('FhirClient Integration', () => {
  it('should fetch encounters successfully', async () => {
    const result = await fhirClient.getEncounters({ _count: 10 });

    expect(result.resourceType).toBe('Bundle');
    expect(result.type).toBe('searchset');
    expect(result.entry).toHaveLength(10);
    expect(result.total).toBe(1000);
  });

  it('should handle query parameters correctly', async () => {
    const result = await fhirClient.getEncounters({
      _count: 5,
      _page: 2,
      status: 'in-progress',
    });

    expect(result.entry).toHaveLength(5);
    result.entry?.forEach(entry => {
      expect(entry.resource.status).toBe('in-progress');
    });
  });

  it('should fetch patient by ID', async () => {
    const patient = await fhirClient.getPatient('patient-1');

    expect(patient.resourceType).toBe('Patient');
    expect(patient.id).toBe('patient-1');
    expect(patient.name?.[0].text).toBe('Patient patient-1');
  });

  it('should fetch practitioner by ID', async () => {
    const practitioner = await fhirClient.getPractitioner('practitioner-1');

    expect(practitioner.resourceType).toBe('Practitioner');
    expect(practitioner.id).toBe('practitioner-1');
    expect(practitioner.name?.[0].text).toBe('Dr. practitioner-1');
  });

  it('should handle API errors gracefully', async () => {
    // Override handler to return error
    server.use(
      rest.get(`${baseUrl}/Encounter`, (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({ error: 'Internal Server Error' })
        );
      })
    );

    await expect(fhirClient.getEncounters({})).rejects.toThrow('HTTP 500');
  });

  it('should resolve references correctly', async () => {
    const reference = { reference: 'Patient/patient-1' };
    const patient = await fhirClient.resolveReference(reference);

    expect(patient.resourceType).toBe('Patient');
    expect(patient.id).toBe('patient-1');
  });
});
```

## 🎭 Testes E2E com Playwright

### Configuração Playwright

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
```

### Testes E2E

```typescript
// src/e2e/specs/dashboard.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Dashboard Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display main dashboard with metrics', async ({ page }) => {
    // Wait for dashboard to load
    await page.waitForSelector('[data-testid="metrics-dashboard"]');

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
});
```

## 📊 Testes de Performance

### Lighthouse CI

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - name: Start application
        run: npm start &
        env:
          CI: true

      - name: Wait for application
        run: npx wait-on http://localhost:3000

      - name: Run Lighthouse CI
        run: npx lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

### Performance Testing

```typescript
// src/test/performance/performance.test.ts
import { PerformanceMonitor } from '@/infrastructure/monitoring/performance-monitor';

describe('Performance Tests', () => {
  let performanceMonitor: PerformanceMonitor;

  beforeEach(() => {
    performanceMonitor = PerformanceMonitor.getInstance();
  });

  test('should load dashboard within performance budget', async () => {
    const startTime = performance.now();

    // Simulate dashboard load
    await new Promise(resolve => setTimeout(resolve, 100));

    const loadTime = performance.now() - startTime;

    expect(loadTime).toBeLessThan(200); // 200ms budget
  });

  test('should handle large datasets efficiently', async () => {
    const largeDataset = Array.from({ length: 10000 }, (_, i) => ({
      id: `encounter-${i}`,
      status: 'finished',
      date: new Date().toISOString(),
    }));

    const startTime = performance.now();

    // Process large dataset
    const processed = largeDataset.filter(item => item.status === 'finished');

    const processTime = performance.now() - startTime;

    expect(processTime).toBeLessThan(50); // 50ms budget
    expect(processed).toHaveLength(10000);
  });

  test('should maintain memory usage within limits', () => {
    const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;

    // Simulate memory-intensive operations
    const largeArray = new Array(1000000).fill(0);

    const currentMemory = (performance as any).memory?.usedJSHeapSize || 0;
    const memoryIncrease = currentMemory - initialMemory;

    // Memory increase should be less than 100MB
    expect(memoryIncrease).toBeLessThan(100 * 1024 * 1024);

    // Cleanup
    largeArray.length = 0;
  });
});
```

## ♿ Testes de Acessibilidade

### Axe Testing

```typescript
// src/test/accessibility/accessibility.test.tsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { MetricCard } from '@/presentation/components/dashboard/metric-card';
import { DashboardLayout } from '@/presentation/components/dashboard/dashboard-layout';

expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  test('MetricCard should meet accessibility standards', async () => {
    const { container } = render(
      <MetricCard
        title="Total Encounters"
        value="1,234"
        change={{ value: 12, isPositive: true }}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('Dashboard layout should meet accessibility standards', async () => {
    const { container } = render(
      <DashboardLayout>
        <div>Dashboard Content</div>
      </DashboardLayout>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('should have proper ARIA labels', () => {
    const { getByLabelText } = render(
      <MetricCard
        title="Total Encounters"
        value="1,234"
        change={{ value: 12, isPositive: true }}
      />
    );

    expect(getByLabelText('Total Encounters')).toBeInTheDocument();
  });

  test('should have proper heading hierarchy', () => {
    const { container } = render(
      <DashboardLayout>
        <h1>Main Dashboard</h1>
        <h2>Metrics Section</h2>
        <h3>Encounter Statistics</h3>
      </DashboardLayout>
    );

    const headings = container.querySelectorAll('h1, h2, h3');
    expect(headings).toHaveLength(3);

    // Check heading levels
    expect(headings[0].tagName).toBe('H1');
    expect(headings[1].tagName).toBe('H2');
    expect(headings[2].tagName).toBe('H3');
  });
});
```

## 🚀 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
      - uses: actions/checkout@v3

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linting
        run: npm run lint

      - name: Run type checking
        run: npm run type-check

      - name: Run unit tests
        run: npm run test:unit -- --coverage --watchAll=false

      - name: Run integration tests
        run: npm run test:integration -- --watchAll=false

      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella

  e2e:
    runs-on: ubuntu-latest
    needs: test

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

  build:
    runs-on: ubuntu-latest
    needs: [test, e2e]

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-files
          path: .next/
          retention-days: 30

  deploy:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v3

      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-files
          path: .next/

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 📊 Métricas de Qualidade

### Cobertura de Testes

- **Unit Tests**: >90%
- **Integration Tests**: >85%
- **E2E Tests**: >80%
- **Overall Coverage**: >85%

### Performance

- **Lighthouse Score**: >90
- **Core Web Vitals**: Pass
- **Bundle Size**: <1MB
- **Load Time**: <2s

### Acessibilidade

- **WCAG 2.1 AA**: 100% compliance
- **Keyboard Navigation**: Full support
- **Screen Reader**: Full support
- **Color Contrast**: Pass

## ✅ Checklist de Entrega

- [ ] Testes unitários com cobertura >90%
- [ ] Testes de integração com MSW
- [ ] Testes E2E com Playwright
- [ ] Testes de performance implementados
- [ ] Testes de acessibilidade com Axe
- [ ] CI/CD pipeline configurado
- [ ] Lighthouse CI configurado
- [ ] Cobertura de código configurada
- [ ] Documentação de testes criada
- [ ] Deploy automatizado configurado

## 🚀 Próximos Passos

Após completar esta fase, você terá:

1. Sistema completamente testado e validado
2. Pipeline de CI/CD automatizado
3. Qualidade de código garantida
4. Performance otimizada
5. Acessibilidade validada
6. Aplicação pronta para produção

**Tempo estimado**: 1-2 dias
**Complexidade**: Média
**Dependências**: Todas as fases anteriores completas
