import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("alphastream-theme") || "emerald",
  setTheme: (theme) => {
    localStorage.setItem("alphastream-theme", theme);
    set({ theme });
  },
}));
