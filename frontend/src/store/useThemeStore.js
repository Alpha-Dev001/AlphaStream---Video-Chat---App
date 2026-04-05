import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("alphastream-theme") || "night",
  setTheme: (theme) => {
    localStorage.setItem("alphastream-theme", theme);
    set({ theme });
  },
}));
