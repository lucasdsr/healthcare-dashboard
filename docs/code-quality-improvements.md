# Code Quality Improvements and Clean Code Practices

## Overview

This document outlines comprehensive recommendations for improving code quality, applying clean code principles, and enhancing the overall development experience in the healthcare dashboard project.

## 1. Component Architecture and Separation of Concerns

### Current Issues

- Large components with mixed responsibilities (e.g., `FilterBar` with 473 lines)
- Business logic mixed with UI rendering
- Complex state management within components

### Recommended Improvements

#### 1.1 Extract Business Logic into Custom Hooks

```typescript
// hooks/use-filter-logic.ts
export const useFilterLogic = (initialFilters: FilterState) => {
  const [pendingFilters, setPendingFilters] = useState(initialFilters);
  const [isApplyingFilters, setIsApplyingFilters] = useState(false);

  const handleFilterChange = useCallback((key: string, value: any) => {
    setPendingFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const hasPendingChanges = useMemo(
    () => JSON.stringify(pendingFilters) !== JSON.stringify(initialFilters),
    [pendingFilters, initialFilters]
  );

  return {
    pendingFilters,
    isApplyingFilters,
    handleFilterChange,
    hasPendingChanges,
    // ... other logic
  };
};
```

#### 1.2 Separate UI Components from Logic

```typescript
// components/filters/filter-bar-container.tsx
export const FilterBarContainer: React.FC<FilterBarProps> = (props) => {
  const filterLogic = useFilterLogic(props.filters);
  const patientSearch = usePatientSearchLogic();

  return (
    <FilterBarUI
      {...props}
      {...filterLogic}
      {...patientSearch}
    />
  );
};

// components/filters/filter-bar-ui.tsx
export const FilterBarUI: React.FC<FilterBarUIProps> = (props) => {
  // Pure UI rendering logic
};
```

#### 1.3 Create Specialized Components

```typescript
// components/filters/filter-sections/
├── basic-filters.tsx
├── search-filters.tsx
├── active-filters-display.tsx
└── filter-actions.tsx
```

## 2. Type Safety and Interface Design

### Current Issues

- `any` types in component props
- Inconsistent interface naming
- Missing type definitions for complex objects

### Recommended Improvements

#### 2.1 Strict Typing for All Props

```typescript
// Before
interface FilterBarProps {
  filters: {
    status?: FilterOption[];
    dateRange?: { start: Date; end: Date };
    patient?: string;
    practitioner?: string;
  };
  onFiltersChange: (filters: any) => void; // ❌ any type
}

// After
interface FilterBarProps {
  filters: EncounterFilters;
  onFiltersChange: (filters: EncounterFilters) => void;
  onLoadingChange?: (loading: boolean) => void;
}

interface EncounterFilters {
  status?: EncounterStatus[];
  dateRange?: DateRange;
  patient?: string;
  practitioner?: string;
}

interface DateRange {
  start?: Date;
  end?: Date;
}
```

#### 2.2 Create Type Guards and Validators

```typescript
// utils/type-guards.ts
export const isValidDateRange = (
  dateRange: unknown
): dateRange is DateRange => {
  if (!dateRange || typeof dateRange !== 'object') return false;
  const range = dateRange as DateRange;
  return (
    (range.start === undefined || range.start instanceof Date) &&
    (range.end === undefined || range.end instanceof Date)
  );
};

export const isValidEncounterFilters = (
  filters: unknown
): filters is EncounterFilters => {
  // Implementation
};
```

## 3. State Management Optimization

### Current Issues

- Complex state updates in Zustand store
- Mixed concerns in store (entities + UI state)
- Inefficient state updates

### Recommended Improvements

#### 3.1 Separate Entity Store from UI Store

```typescript
// stores/entity-store.ts
export const useEntityStore = create<EntityState>()(
  devtools(
    persist(
      (set, get) => ({
        encounters: {},
        patients: {},
        // ... entity management only
      }),
      { name: 'entity-store' }
    )
  )
);

// stores/ui-store.ts
export const useUIStore = create<UIState>()(
  devtools((set, get) => ({
    loadingStates: {},
    pagination: {},
    // ... UI state only
  }))
);
```

#### 3.2 Implement Immutable Updates

```typescript
// Before
setEncounters: encounters => {
  const encountersMap = encounters.reduce(
    (acc, encounter) => {
      acc[encounter.id] = encounter;
      return acc;
    },
    {} as Record<string, Encounter>
  );
  set(state => ({
    encounters: { ...state.encounters, ...encountersMap },
  }));
},

// After
setEncounters: encounters => {
  const encountersMap = encounters.reduce(
    (acc, encounter) => ({ ...acc, [encounter.id]: encounter }),
    {} as Record<string, Encounter>
  );
  set(state => ({
    encounters: { ...state.encounters, ...encountersMap },
  }));
},
```

## 4. Query and Data Fetching Optimization

### Current Issues

- Mixed concerns in query hooks
- Side effects in query functions
- Inconsistent error handling

### Recommended Improvements

#### 4.1 Separate Data Fetching from State Management

```typescript
// hooks/queries/use-encounters.ts
export const useEncounters = (filters?: EncounterFilters) => {
  const query = useQuery({
    queryKey: ['encounters', filters],
    queryFn: () => fhirService.getEncounters(filters),
    staleTime: 1 * 60 * 1000,
    gcTime: 3 * 60 * 1000,
  });

  // Separate effect for state management
  useEffect(() => {
    if (query.data) {
      useEntityStore.getState().setEncounters(query.data.encounters);
      useUIStore.getState().setPagination({
        currentPage: query.data.currentPage,
        totalCount: query.data.total,
        totalPages: Math.ceil(query.data.total / query.data.pageSize),
        pageSize: query.data.pageSize,
      });
    }
  }, [query.data]);

  return query;
};
```

#### 4.2 Create Query Factories

```typescript
// queries/query-factories.ts
export const createEncounterQueries = (filters?: EncounterFilters) => ({
  dashboardMetrics: {
    queryKey: ['dashboard-metrics', filters],
    queryFn: () => fhirService.getDashboardMetrics(filters),
    staleTime: 30 * 1000,
    gcTime: 2 * 60 * 1000,
  },
  encounters: {
    queryKey: ['encounters', filters],
    queryFn: () => fhirService.getEncounters(filters),
    staleTime: 1 * 60 * 1000,
    gcTime: 3 * 60 * 1000,
  },
});
```

## 5. Error Handling and User Experience

### Current Issues

- Generic error messages
- Inconsistent error handling patterns
- Missing error boundaries

### Recommended Improvements

#### 5.1 Create Error Boundary Components

```typescript
// components/error-boundary/error-boundary.tsx
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to monitoring service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}
```

#### 5.2 Implement Consistent Error Handling

```typescript
// utils/error-handling.ts
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public userMessage: string,
    public severity: 'low' | 'medium' | 'high' = 'medium'
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleApiError = (error: unknown): AppError => {
  if (error instanceof AppError) return error;

  if (error instanceof Error) {
    return new AppError(
      error.message,
      'UNKNOWN_ERROR',
      'An unexpected error occurred. Please try again.',
      'medium'
    );
  }

  return new AppError(
    'Unknown error',
    'UNKNOWN_ERROR',
    'An unexpected error occurred. Please try again.',
    'medium'
  );
};
```

## 6. Performance Optimization

### Current Issues

- Unnecessary re-renders
- Missing memoization
- Large bundle sizes

### Recommended Improvements

#### 6.1 Implement React.memo and useMemo

```typescript
// components/filters/filter-bar.tsx
export const FilterBar = React.memo<FilterBarProps>(
  ({ filters, onFiltersChange, onLoadingChange }) => {
    const hasActiveFilters = useMemo(
      () =>
        Object.entries(filters).some(([key, value]) => {
          if (value === undefined || value === null || value === '')
            return false;
          if (key === 'status' && Array.isArray(value)) return value.length > 0;
          if (key === 'dateRange' && typeof value === 'object') {
            const dateRange = value as DateRange;
            return dateRange.start !== undefined || dateRange.end !== undefined;
          }
          return typeof value === 'string' ? value.trim() !== '' : true;
        }),
      [filters]
    );

    // ... rest of component
  }
);
```

#### 6.2 Implement Virtual Scrolling for Large Lists

```typescript
// components/encounter-list/virtual-encounter-list.tsx
import { FixedSizeList as List } from 'react-window';

export const VirtualEncounterList: React.FC<VirtualEncounterListProps> = ({
  encounters,
  height = 400,
  itemHeight = 60,
}) => {
  const Row = ({ index, style }: { index: number; style: CSSProperties }) => (
    <div style={style}>
      <EncounterListItem encounter={encounters[index]} />
    </div>
  );

  return (
    <List
      height={height}
      itemCount={encounters.length}
      itemSize={itemHeight}
      width="100%"
    >
      {Row}
    </List>
  );
};
```

## 7. Testing Strategy

### Current Issues

- Limited test coverage
- Missing integration tests
- No testing utilities

### Recommended Improvements

#### 7.1 Create Testing Utilities

```typescript
// test/utils/test-utils.tsx
export const renderWithProviders = (
  ui: ReactElement,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    ...renderOptions
  } = {}
) => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={createTestQueryClient()}>
      <Provider store={store}>
        {children}
      </Provider>
    </QueryClientProvider>
  );

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};

export const createTestStore = (preloadedState: Partial<RootState> = {}) =>
  createTestStore(preloadedState);
```

#### 7.2 Implement Component Testing

```typescript
// components/filters/__tests__/filter-bar.test.tsx
describe('FilterBar', () => {
  it('should render all filter sections when expanded', () => {
    const { getByText, getByLabelText } = renderWithProviders(
      <FilterBar filters={mockFilters} onFiltersChange={jest.fn()} />
    );

    fireEvent.click(getByText('Show Filters'));

    expect(getByText('Basic Filters')).toBeInTheDocument();
    expect(getByText('Search Filters')).toBeInTheDocument();
    expect(getByLabelText('Status')).toBeInTheDocument();
  });

  it('should call onFiltersChange when filters are applied', () => {
    const mockOnFiltersChange = jest.fn();
    const { getByText } = renderWithProviders(
      <FilterBar filters={mockFilters} onFiltersChange={mockOnFiltersChange} />
    );

    fireEvent.click(getByText('Show Filters'));
    fireEvent.click(getByText('Apply Filters'));

    expect(mockOnFiltersChange).toHaveBeenCalled();
  });
});
```

## 8. Code Organization and File Structure

### Recommended File Structure

```
src/
├── components/
│   ├── filters/
│   │   ├── filter-bar/
│   │   │   ├── index.ts
│   │   │   ├── filter-bar.tsx
│   │   │   ├── filter-bar-container.tsx
│   │   │   ├── filter-bar-ui.tsx
│   │   │   ├── filter-bar.types.ts
│   │   │   ├── filter-bar.test.tsx
│   │   │   └── filter-bar.stories.tsx
│   │   └── filter-sections/
│   └── metrics/
├── hooks/
│   ├── filters/
│   ├── queries/
│   └── ui/
├── stores/
│   ├── entity-store.ts
│   ├── ui-store.ts
│   └── index.ts
├── utils/
│   ├── error-handling.ts
│   ├── type-guards.ts
│   └── validation.ts
└── types/
    ├── api.ts
    ├── components.ts
    └── common.ts
```

## 9. Documentation and Standards

### Recommended Practices

- Use JSDoc for all public functions and components
- Create component storybooks for visual documentation
- Implement consistent naming conventions
- Use semantic commit messages
- Create API documentation for all endpoints

### Naming Conventions

```typescript
// Components: PascalCase
export const FilterBarContainer: React.FC<FilterBarProps> = () => {};

// Hooks: camelCase with 'use' prefix
export const useFilterLogic = () => {};

// Types/Interfaces: PascalCase with descriptive names
interface EncounterFiltersState {}
interface FilterBarContainerProps {}

// Constants: UPPER_SNAKE_CASE
const DEFAULT_PAGE_SIZE = 50;
const STATUS_OPTIONS: FilterOption[] = [];
```

## 10. Implementation Priority

### Phase 1 (Immediate - 1-2 weeks)

1. Extract business logic from large components
2. Implement strict typing for all props
3. Create custom hooks for complex logic
4. Add error boundaries

### Phase 2 (Short-term - 2-4 weeks)

1. Refactor state management
2. Implement performance optimizations
3. Create testing utilities
4. Add comprehensive tests

### Phase 3 (Medium-term - 1-2 months)

1. Implement virtual scrolling
2. Create component library
3. Add comprehensive documentation
4. Performance monitoring and optimization

## Conclusion

These improvements will significantly enhance code quality, maintainability, and developer experience. The focus should be on incremental improvements rather than complete rewrites, ensuring that the application remains functional while improving its architecture.

Key benefits:

- Improved code readability and maintainability
- Better performance and user experience
- Easier testing and debugging
- Reduced technical debt
- Better developer onboarding experience
