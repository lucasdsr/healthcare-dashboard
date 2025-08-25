import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface DemoModeState {
  isEnabled: boolean;
  toggleDemoMode: () => void;
  enableDemoMode: () => void;
  disableDemoMode: () => void;
}

export const useDemoModeStore = create<DemoModeState>()(
  devtools(
    persist(
      set => ({
        isEnabled: true,

        toggleDemoMode: () => set(state => ({ isEnabled: !state.isEnabled })),

        enableDemoMode: () => set({ isEnabled: true }),

        disableDemoMode: () => set({ isEnabled: false }),
      }),
      {
        name: 'demo-mode-store',
        partialize: state => ({ isEnabled: state.isEnabled }),
      }
    )
  )
);
