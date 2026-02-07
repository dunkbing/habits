import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeContextValue {
  themeMode: ThemeMode;
  colorScheme: ResolvedTheme;
  setThemeMode: (mode: ThemeMode) => void;
  isLoaded: boolean;
}

const THEME_KEY = 'app_theme';

const ThemeContext = createContext<ThemeContextValue>({
  themeMode: 'system',
  colorScheme: 'light',
  setThemeMode: () => {},
  isLoaded: false,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useSystemColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((saved) => {
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        setThemeModeState(saved);
      }
      setIsLoaded(true);
    });
  }, []);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    AsyncStorage.setItem(THEME_KEY, mode);
  }, []);

  const colorScheme: ResolvedTheme =
    themeMode === 'system' ? (systemScheme ?? 'light') : themeMode;

  return (
    <ThemeContext.Provider value={{ themeMode, colorScheme, setThemeMode, isLoaded }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
