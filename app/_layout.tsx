import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { ThemeProvider, useTheme } from '@/contexts/theme-context';
import { DatabaseProvider } from '@/contexts/database-context';
import { SelectedDateProvider } from '@/contexts/selected-date-context';
import { loadSavedLanguage } from '@/lib/i18n';
import '@/lib/i18n';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootNavigation() {
  const { colorScheme } = useTheme();

  return (
    <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="habit/create"
          options={{ presentation: 'modal', title: 'Create Habit', headerShown: false }}
        />
        <Stack.Screen
          name="habit/[id]"
          options={{ title: 'Habit Detail', headerShown: false }}
        />
      </Stack>
      <StatusBar style="auto" />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  useEffect(() => {
    loadSavedLanguage();
  }, []);

  return (
    <ThemeProvider>
      <DatabaseProvider>
        <SelectedDateProvider>
          <RootNavigation />
        </SelectedDateProvider>
      </DatabaseProvider>
    </ThemeProvider>
  );
}
