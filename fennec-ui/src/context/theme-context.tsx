"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { type Theme, THEME } from "@/types/theme.type";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return THEME.dark;

    const stored = localStorage.getItem("theme");
    return stored === THEME.dark || stored === THEME.light
      ? stored
      : THEME.dark;
  });

  const toggleTheme = () => {
    setTheme((prev) => (prev === THEME.dark ? THEME.light : THEME.dark));
  };

  useEffect(() => {
    document.documentElement.classList.remove(THEME.dark, THEME.light);
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
    document.cookie = `theme=${theme}; path=/; max-age=31536000`;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
