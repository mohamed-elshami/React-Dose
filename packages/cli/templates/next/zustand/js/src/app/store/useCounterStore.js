import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useCounterStore = create(
  persist(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
      decrement: () => set((state) => ({ count: state.count - 1 })),
      reset: () => set({ count: 0 }),
    }),
    {
      name: "react-dose-counter-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
