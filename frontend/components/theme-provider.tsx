// components/theme-provider.tsx
"use client";

import * as React from "react";

type Theme = "light" | "dark" | "system";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (t: Theme) => void;
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}

export interface ThemeProviderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "echallan-theme",
  ...props
}: ThemeProviderProps) {
  const getInitialTheme = (): Theme => {
    if (typeof window === "undefined") return defaultTheme; // SSR guard
    try {
      const saved = window.localStorage.getItem(storageKey) as Theme | null;
      return saved ?? defaultTheme;
    } catch {
      return defaultTheme;
    }
  };

  const [theme, setTheme] = React.useState<Theme>(getInitialTheme);

  // Re-sync from storage on mount (in case SSR used default)
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(storageKey) as Theme | null;
    if (saved && saved !== theme) setTheme(saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply theme to <html> and persist to storage
  React.useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;

    const apply = (t: Theme) => {
      if (t === "system") {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        root.classList.toggle("dark", prefersDark);
      } else {
        root.classList.toggle("dark", t === "dark");
      }
    };

    apply(theme);
    try {
      window.localStorage.setItem(storageKey, theme);
    } catch {}
  }, [theme, storageKey]);

  const value = React.useMemo(() => ({ theme, setTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      <div {...props} data-theme={theme}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}


