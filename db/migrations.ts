import { sql, count } from 'drizzle-orm';
import type { Database } from './client';
import { categories } from './schema';
import { buildDefaultCategories } from './seed';

export async function runMigrations(db: Database): Promise<void> {
  db.run(sql`CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    color TEXT NOT NULL,
    icon TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_default INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`);

  db.run(sql`CREATE TABLE IF NOT EXISTS habits (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    frequency TEXT NOT NULL DEFAULT 'daily',
    frequency_days TEXT,
    category_id TEXT NOT NULL REFERENCES categories(id),
    reminder_enabled INTEGER NOT NULL DEFAULT 0,
    reminder_time TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_archived INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`);

  db.run(sql`CREATE TABLE IF NOT EXISTS completions (
    id TEXT PRIMARY KEY NOT NULL,
    habit_id TEXT NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
    date TEXT NOT NULL,
    status TEXT NOT NULL,
    note TEXT,
    created_at TEXT NOT NULL
  )`);

  db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS completions_habit_date_idx ON completions(habit_id, date)`);
}

export async function seedCategories(db: Database): Promise<void> {
  const result = await db.select({ value: count() }).from(categories);
  const categoryCount = result[0]?.value ?? 0;

  if (categoryCount === 0) {
    for (const cat of buildDefaultCategories()) {
      await db.insert(categories).values(cat);
    }
  }
}
