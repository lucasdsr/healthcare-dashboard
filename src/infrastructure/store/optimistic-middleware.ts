import { StateCreator } from 'zustand';

export interface OptimisticState {
  optimisticUpdates: Array<{
    id: string;
    type: 'encounter' | 'patient' | 'practitioner' | 'organization';
    data: unknown;
    timestamp: number;
  }>;
}

export const optimisticMiddleware =
  <T extends OptimisticState>(config: StateCreator<T>): StateCreator<T> =>
  (set, get, api) => {
    const state = config(set, get, api);

    const addOptimisticUpdate = (
      type: OptimisticState['optimisticUpdates'][0]['type'],
      id: string,
      data: unknown
    ) => {
      set((state: T) => ({
        ...state,
        optimisticUpdates: [
          ...state.optimisticUpdates,
          {
            id,
            type,
            data,
            timestamp: Date.now(),
          },
        ],
      }));
    };

    const removeOptimisticUpdate = (id: string) => {
      set((state: T) => ({
        ...state,
        optimisticUpdates: state.optimisticUpdates.filter(
          update => update.id !== id
        ),
      }));
    };

    const getOptimisticUpdate = (id: string) => {
      const state = get();
      return state.optimisticUpdates.find(update => update.id === id);
    };

    const clearOptimisticUpdates = () => {
      set((state: T) => ({
        ...state,
        optimisticUpdates: [],
      }));
    };

    return {
      ...state,
      addOptimisticUpdate,
      removeOptimisticUpdate,
      getOptimisticUpdate,
      clearOptimisticUpdates,
    };
  };
