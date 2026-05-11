"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { THEME_STORAGE_KEY } from "./theme-constants";

type Theme = "light" | "dark";
export type ThemeMode = Theme | "system";

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

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeMode] = useState<ThemeMode>("system");
  const [resolvedTheme, setResolvedTheme] = useState<Theme>("light");
  const hasSyncedFromStorage = useRef(false);

  useLayoutEffect(() => {
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

    const applyResolvedTheme = (nextResolvedTheme: Theme) => {
      const restoreTransitions = disableTransitionsTemporarily();
      const root = document.documentElement;
      root.classList.toggle("dark", nextResolvedTheme === "dark");
      root.style.colorScheme = nextResolvedTheme === "dark" ? "dark" : "light";
      restoreTransitions();
      setResolvedTheme(nextResolvedTheme);
    };

    const resolveToResolvedTheme = (mode: ThemeMode): Theme => {
      if (mode === "system") {
        return mediaQuery.matches ? "dark" : "light";
      }
      return mode;
    };

    const syncFromStorageOnce = () => {
      const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
      const storedThemeMode: ThemeMode =
        saved === "light" || saved === "dark" || saved === "system" ? saved : "system";

      applyResolvedTheme(resolveToResolvedTheme(storedThemeMode));
      window.localStorage.setItem(THEME_STORAGE_KEY, storedThemeMode);

      if (storedThemeMode !== themeMode) {
        void Promise.resolve().then(() => setThemeMode(storedThemeMode));
      }
    };

    if (!hasSyncedFromStorage.current) {
      hasSyncedFromStorage.current = true;
      syncFromStorageOnce();
    } else {
      applyResolvedTheme(resolveToResolvedTheme(themeMode));
      window.localStorage.setItem(THEME_STORAGE_KEY, themeMode);
    }

    const handleSystemThemeChange = () => {
      if (themeMode === "system") {
        applyResolvedTheme(mediaQuery.matches ? "dark" : "light");
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
