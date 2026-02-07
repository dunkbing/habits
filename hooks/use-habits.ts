import { useCallback, useEffect, useState } from 'react';
import { db } from '@/db/client';
import { habits } from '@/db/schema';
import type { Habit, NewHabit } from '@/db/schema';
import { useDatabase } from '@/contexts/database-context';
import { eq, asc, and } from 'drizzle-orm';
import { generateId } from '@/lib/uuid';

export function useHabits(options?: { categoryId?: string; includeArchived?: boolean }) {
  const { refresh, triggerRefresh } = useDatabase();
  const [data, setData] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const conditions = [];

      if (!options?.includeArchived) {
        conditions.push(eq(habits.isArchived, false));
      }
      if (options?.categoryId) {
        conditions.push(eq(habits.categoryId, options.categoryId));
      }

      const result = await db
        .select()
        .from(habits)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(asc(habits.sortOrder));

      setData(result);
      setIsLoading(false);
    })();
  }, [refresh, options?.categoryId, options?.includeArchived]);

  const createHabit = useCallback(
    async (input: Omit<NewHabit, 'id' | 'createdAt' | 'updatedAt'>) => {
      const now = new Date().toISOString();
      const newHabit: NewHabit = {
        ...input,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      };
      await db.insert(habits).values(newHabit);
      triggerRefresh();
      return newHabit;
    },
    [triggerRefresh]
  );

  const updateHabit = useCallback(
    async (id: string, updates: Partial<Omit<Habit, 'id' | 'createdAt'>>) => {
      await db
        .update(habits)
        .set({ ...updates, updatedAt: new Date().toISOString() })
        .where(eq(habits.id, id));
      triggerRefresh();
    },
    [triggerRefresh]
  );

  const deleteHabit = useCallback(
    async (id: string) => {
      await db.delete(habits).where(eq(habits.id, id));
      triggerRefresh();
    },
    [triggerRefresh]
  );

  const archiveHabit = useCallback(
    async (id: string, archived = true) => {
      await db
        .update(habits)
        .set({ isArchived: archived, updatedAt: new Date().toISOString() })
        .where(eq(habits.id, id));
      triggerRefresh();
    },
    [triggerRefresh]
  );

  return { habits: data, isLoading, createHabit, updateHabit, deleteHabit, archiveHabit };
}
