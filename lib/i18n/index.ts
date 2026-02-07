import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './en';
import vi from './vi';

const LANGUAGE_KEY = 'app_language';

const resources = {
  en: { translation: en },
  vi: { translation: vi },
};

const getDeviceLanguage = (): string => {
  const locales = getLocales();
  const deviceLang = locales[0]?.languageCode ?? 'en';
  return deviceLang in resources ? deviceLang : 'en';
};

i18n.use(initReactI18next).init({
  resources,
  lng: getDeviceLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export async function loadSavedLanguage() {
  const saved = await AsyncStorage.getItem(LANGUAGE_KEY);
  if (saved && saved in resources) {
    await i18n.changeLanguage(saved);
  }
}

export async function setLanguage(lang: string) {
  await AsyncStorage.setItem(LANGUAGE_KEY, lang);
  await i18n.changeLanguage(lang);
}

export default i18n;
