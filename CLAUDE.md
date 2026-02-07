# Habits - Habit Tracker App

## Project Overview

A local-first habit tracking app built with Expo 54, React Native 0.81, and TypeScript (strict mode). Uses expo-sqlite + Drizzle ORM for persistence with a Turso-ready schema (UUID primary keys, ISO timestamps).

## Commands

```bash
bun start              # Start Expo dev server
bun run ios            # Build and run on iOS
bun run android        # Build and run on Android
bun run web            # Start web dev server
bun run lint           # Run ESLint
bunx tsc --noEmit      # Type check (must pass with zero errors)
```

Always use `bun`/`bunx` — never `npm`/`npx`/`yarn`.

## Architecture

### Tech Stack

- **Framework:** Expo ~54.0.33 / React Native 0.81.5
- **Routing:** Expo Router ~6.0.23 (file-based, typed routes)
- **Database:** expo-sqlite + Drizzle ORM (local SQLite)
- **State:** React Context (3 providers: Theme, Database, SelectedDate)
- **i18n:** i18next + react-i18next (English + Vietnamese)
- **Styling:** React Native StyleSheet (no CSS framework)

### Navigation Structure

```
Stack (app/_layout.tsx)
├── (tabs)/_layout.tsx
│   ├── index.tsx       → Today screen
│   ├── add.tsx         → Placeholder (+ button opens modal)
│   ├── browse.tsx      → Browse habits by category
│   └── settings.tsx    → Hidden from tab bar (href: null)
├── habit/create.tsx    → Modal: create/edit habit
└── habit/[id].tsx      → Habit detail + activity log
```

### Provider Hierarchy (app/_layout.tsx)

```
ThemeProvider → DatabaseProvider → SelectedDateProvider → NavigationThemeProvider → Stack
```

### Database Schema (db/schema.ts)

Three tables: `categories`, `habits`, `completions`. All use text UUIDs as primary keys. Completions have a unique index on `(habit_id, date)`. Foreign keys: habits → categories, completions → habits (cascade delete).

### Data Flow

Hooks (`use-habits`, `use-completions`, `use-categories`, `use-streak`) read from the database via Drizzle ORM. Mutations call `triggerRefresh()` from `DatabaseContext`, which increments a counter that all hooks watch via `useEffect` dependencies.

## Key Directories

```
app/            → Expo Router screens and layouts
components/     → Reusable UI components
  habits/       → Habit-specific components (cards, grid, form, etc.)
  ui/           → Icon symbols, collapsible
contexts/       → React Context providers (theme, database, selected-date)
db/             → Drizzle schema, client, migrations, seed data
hooks/          → Data hooks (habits CRUD, completions, categories, streak)
lib/            → Utilities (date-utils, uuid, i18n setup + translations)
constants/      → Theme colors and fonts
```

## Code Conventions

- **No `any` types.** The codebase must have zero `any` or `as any` — always use proper types.
- **Path aliases:** Use `@/` for imports from root (e.g., `@/components/themed-text`).
- **Imports:** Named exports preferred. Default exports only for screen components (Expo Router requirement).
- **Styling:** `StyleSheet.create()` at file bottom. Theme-aware colors via `useColorScheme()` and `Colors[colorScheme]`.
- **UUIDs:** Use `generateId()` from `@/lib/uuid` (wraps `expo-crypto.randomUUID()`). Never call at module-level — always inside functions.
- **Dates:** All date keys are `"YYYY-MM-DD"` strings. Use `formatDateKey()` from `@/lib/date-utils`.
- **i18n:** All user-facing strings must use `t('key')` from `useTranslation()`. Translations in `lib/i18n/en.ts` and `lib/i18n/vi.ts`.
- **Database:** Raw SQL via `db.run(sql\`...\`)` for migrations only. All queries use Drizzle's typed query builder.
- **Components:** Functional components only. Props interfaces defined inline or above the component.

## Theme System

Colors defined in `constants/theme.ts` with `light`, `dark`, and `habit` palettes. Components use `useColorScheme()` hook to resolve the current scheme. Theme mode (system/light/dark) persisted in AsyncStorage.

## Verification

**After every coding session**, run the type checker before finishing:

```bash
bunx tsc --noEmit
```

This must pass with **zero errors**. Also verify no `any` types were introduced. Do not consider work complete until this passes.

## Adding New Features

- **New screen:** Add file in `app/` directory. Expo Router auto-registers it. Update `.expo/types/router.d.ts` if typed routes break.
- **New hook:** Place in `hooks/`. Follow pattern: subscribe to `refresh` from `useDatabase()`, call `triggerRefresh()` after mutations.
- **New translation:** Add keys to both `lib/i18n/en.ts` and `lib/i18n/vi.ts`.
- **New DB table:** Define in `db/schema.ts`, add `CREATE TABLE IF NOT EXISTS` in `db/migrations.ts`.
