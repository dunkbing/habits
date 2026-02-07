import { StyleSheet, Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme, type ThemeMode } from '@/contexts/theme-context';
import { setLanguage } from '@/lib/i18n';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const THEME_OPTIONS: ThemeMode[] = ['system', 'light', 'dark'];
const LANGUAGE_OPTIONS = [
  { code: 'en', label: 'languageEn' },
  { code: 'vi', label: 'languageVi' },
] as const;

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const { themeMode, setThemeMode } = useTheme();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        {t('settings.title')}
      </ThemedText>

      <ThemedText type="subtitle" style={styles.sectionTitle}>
        {t('settings.theme')}
      </ThemedText>
      <View style={styles.optionRow}>
        {THEME_OPTIONS.map((mode) => {
          const isActive = themeMode === mode;
          return (
            <Pressable
              key={mode}
              onPress={() => setThemeMode(mode)}
              style={[
                styles.optionButton,
                {
                  backgroundColor: isActive ? colors.tint : colors.background,
                  borderColor: colors.tint,
                },
              ]}>
              <ThemedText
                style={[
                  styles.optionText,
                  { color: isActive ? (colorScheme === 'dark' ? '#151718' : '#fff') : colors.text },
                ]}>
                {t(`settings.theme${mode.charAt(0).toUpperCase() + mode.slice(1)}` as any)}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>

      <ThemedText type="subtitle" style={styles.sectionTitle}>
        {t('settings.language')}
      </ThemedText>
      <View style={styles.optionRow}>
        {LANGUAGE_OPTIONS.map(({ code, label }) => {
          const isActive = i18n.language === code;
          return (
            <Pressable
              key={code}
              onPress={() => setLanguage(code)}
              style={[
                styles.optionButton,
                {
                  backgroundColor: isActive ? colors.tint : colors.background,
                  borderColor: colors.tint,
                },
              ]}>
              <ThemedText
                style={[
                  styles.optionText,
                  { color: isActive ? (colorScheme === 'dark' ? '#151718' : '#fff') : colors.text },
                ]}>
                {t(`settings.${label}` as any)}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 80,
  },
  title: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 12,
    marginTop: 24,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  optionButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '500',
  },
});
