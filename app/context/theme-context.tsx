"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

type Theme = "light" | "dark";
type ThemeMode = Theme | "system";

type ThemeActions = {
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
};

type ThemeValue = {
  themeMode: ThemeMode;
  resolvedTheme: Theme;
};

const ThemeValueContext = createContext<ThemeValue | null>(null);
const ThemeActionsContext = createContext<ThemeActions | null>(null);
const STORAGE_KEY = "dashboard-theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") {
      return "system";
    }

    const savedTheme = window.localStorage.getItem(STORAGE_KEY);
    if (savedTheme === "light" || savedTheme === "dark" || savedTheme === "system") {
      return savedTheme;
    }

    return "system";
  });
  const [resolvedTheme, setResolvedTheme] = useState<Theme>("light");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const disableTransitionsTemporarily = () => {
      const style = document.createElement("style");
      style.textContent = "* { transition: none !important; }";
      document.head.appendChild(style);

      return () => {
        window.requestAnimationFrame(() => {
          document.head.removeChild(style);
        });
      };
    };

    const applyTheme = (nextTheme: Theme) => {
      const restoreTransitions = disableTransitionsTemporarily();
      document.documentElement.classList.toggle("dark", nextTheme === "dark");
      restoreTransitions();
      setResolvedTheme(nextTheme);
    };

    const resolveTheme = () => {
      const nextTheme: Theme =
        themeMode === "system" ? (mediaQuery.matches ? "dark" : "light") : themeMode;
      applyTheme(nextTheme);
      window.localStorage.setItem(STORAGE_KEY, themeMode);
    };

    resolveTheme();

    const handleSystemThemeChange = () => {
      if (themeMode === "system") {
        resolveTheme();
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, [themeMode]);

  const toggleTheme = useCallback(() => {
    setThemeMode((prev) => {
      if (prev === "system") return "light";
      if (prev === "light") return "dark";
      return "system";
    });
  }, []);

  const actions = useMemo<ThemeActions>(
    () => ({
      setTheme: setThemeMode,
      toggleTheme,
    }),
    [toggleTheme]
  );

  return (
    <ThemeActionsContext.Provider value={actions}>
      <ThemeValueContext.Provider value={{ themeMode, resolvedTheme }}>
        {children}
      </ThemeValueContext.Provider>
    </ThemeActionsContext.Provider>
  );
}

export function useThemeValue() {
  const context = useContext(ThemeValueContext);

  if (!context) {
    throw new Error("useThemeValue must be used within a ThemeProvider");
  }

  return context;
}

export function useThemeActions() {
  const context = useContext(ThemeActionsContext);

  if (!context) {
    throw new Error("useThemeActions must be used within a ThemeProvider");
  }

  return context;
}

export function useTheme() {
  const { themeMode, resolvedTheme } = useThemeValue();
  const { setTheme, toggleTheme } = useThemeActions();

  return { themeMode, resolvedTheme, setTheme, toggleTheme };
}
