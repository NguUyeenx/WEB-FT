import { create } from 'zustand';

interface UIState {
  isMiniCartOpen: boolean;
  setMiniCartOpen: (open: boolean) => void;
  toggleMiniCart: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMiniCartOpen: false,
  setMiniCartOpen: (open) => set({ isMiniCartOpen: open }),
  toggleMiniCart: () =>
    set((state) => ({ isMiniCartOpen: !state.isMiniCartOpen })),
}));
