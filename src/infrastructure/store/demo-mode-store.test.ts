import { renderHook, act } from '@testing-library/react';
import { useDemoModeStore } from './demo-mode-store';

describe('DemoModeStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useDemoModeStore());
    act(() => {
      result.current.disableDemoMode();
    });
  });

  it('should start with demo mode enabled by default', () => {
    const { result } = renderHook(() => useDemoModeStore());

    expect(result.current.isEnabled).toBe(true);
  });

  it('should enable demo mode', () => {
    const { result } = renderHook(() => useDemoModeStore());

    act(() => {
      result.current.enableDemoMode();
    });

    expect(result.current.isEnabled).toBe(true);
  });

  it('should disable demo mode', () => {
    const { result } = renderHook(() => useDemoModeStore());

    act(() => {
      result.current.enableDemoMode();
    });

    act(() => {
      result.current.disableDemoMode();
    });

    expect(result.current.isEnabled).toBe(false);
  });

  it('should toggle demo mode', () => {
    const { result } = renderHook(() => useDemoModeStore());

    act(() => {
      result.current.toggleDemoMode();
    });

    expect(result.current.isEnabled).toBe(true);

    act(() => {
      result.current.toggleDemoMode();
    });

    expect(result.current.isEnabled).toBe(false);
  });

  it('should persist demo mode state', () => {
    const { result } = renderHook(() => useDemoModeStore());

    act(() => {
      result.current.enableDemoMode();
    });

    expect(result.current.isEnabled).toBe(true);

    const { result: newResult } = renderHook(() => useDemoModeStore());

    expect(newResult.current.isEnabled).toBe(true);
  });
});
