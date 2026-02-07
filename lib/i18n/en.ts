export default {
  common: {
    settings: 'Settings',
    home: 'Home',
    explore: 'Explore',
    cancel: 'Cancel',
    save: 'Save',
    ok: 'OK',
  },
  home: {
    welcome: 'Welcome!',
    step1Title: 'Step 1: Try it',
    step1Description:
      'Edit <bold>app/(tabs)/index.tsx</bold> to see changes. Press <bold>{{devTools}}</bold> to open developer tools.',
    step2Title: 'Step 2: Explore',
    step2Description: "Tap the Explore tab to learn more about what's included in this starter app.",
    step3Title: 'Step 3: Get a fresh start',
    step3Description:
      "When you're ready, run <bold>npm run reset-project</bold> to get a fresh <bold>app</bold> directory. This will move the current <bold>app</bold> to <bold>app-example</bold>.",
  },
  settings: {
    title: 'Settings',
    appearance: 'Appearance',
    theme: 'Theme',
    themeSystem: 'System',
    themeLight: 'Light',
    themeDark: 'Dark',
    language: 'Language',
    languageEn: 'English',
    languageVi: 'Tiếng Việt',
  },
} as const;
