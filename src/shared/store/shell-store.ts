import { create } from "zustand";

type ShellState = {
  isMobileNavOpen: boolean;
  activeSkipTarget: string;
  setMobileNavOpen: (next: boolean) => void;
  toggleMobileNav: () => void;
  closeMobileNav: () => void;
  setActiveSkipTarget: (target: string) => void;
};

export const useShellStore = create<ShellState>((set) => ({
  isMobileNavOpen: false,
  activeSkipTarget: "main-content",
  setMobileNavOpen: (next) => set({ isMobileNavOpen: next }),
  toggleMobileNav: () => set((state) => ({ isMobileNavOpen: !state.isMobileNavOpen })),
  closeMobileNav: () => set({ isMobileNavOpen: false }),
  setActiveSkipTarget: (target) => set({ activeSkipTarget: target }),
}));
