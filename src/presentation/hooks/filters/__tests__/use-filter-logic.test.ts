import { renderHook, act } from '@testing-library/react';
import { useFilterLogic } from '../use-filter-logic';
import { EncounterFilters } from '@/shared/types/filters';

describe('useFilterLogic', () => {
  const mockFilters: EncounterFilters = {
    status: 'planned',
    dateRange: { start: new Date('2024-01-01'), end: new Date('2024-01-31') },
    patient: 'patient-123',
    practitioner: 'practitioner-456',
  };

  it('should initialize with provided filters', () => {
    const { result } = renderHook(() => useFilterLogic(mockFilters));

    expect(result.current.pendingFilters.status?.[0]?.value).toBe('planned');
    expect(result.current.pendingFilters.dateRange).toEqual(
      mockFilters.dateRange
    );
    expect(result.current.pendingFilters.patient).toBe('patient-123');
    expect(result.current.pendingFilters.practitioner).toBe('practitioner-456');
  });

  it('should detect active filters correctly', () => {
    const { result } = renderHook(() => useFilterLogic(mockFilters));

    expect(result.current.hasActiveFilters).toBe(true);
  });

  it('should detect no active filters for empty filters', () => {
    const { result } = renderHook(() => useFilterLogic({}));

    expect(result.current.hasActiveFilters).toBe(false);
  });

  it('should handle filter changes', () => {
    const { result } = renderHook(() => useFilterLogic(mockFilters));

    act(() => {
      result.current.handleFilterChange('patient', 'new-patient-123');
    });

    expect(result.current.pendingFilters.patient).toBe('new-patient-123');
  });

  it('should detect pending changes', () => {
    const { result } = renderHook(() => useFilterLogic(mockFilters));

    act(() => {
      result.current.handleFilterChange('patient', 'new-patient-123');
    });

    expect(result.current.hasPendingChanges).toBe(true);
  });

  it('should validate date range correctly', () => {
    const { result } = renderHook(() => useFilterLogic(mockFilters));

    expect(result.current.isDateRangeValid).toBe(true);

    act(() => {
      result.current.handleFilterChange('dateRange', {
        start: new Date('2024-01-31'),
        end: new Date('2024-01-01'),
      });
    });

    expect(result.current.isDateRangeValid).toBe(false);
  });
});
