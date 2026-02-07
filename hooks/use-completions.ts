import { useCallback, useEffect, useState } from 'react';
import { db } from '@/db/client';
import { completions } from '@/db/schema';
import type { Completion } from '@/db/schema';
import { useDatabase } from '@/contexts/database-context';
import { eq, and, gte, lte } from 'drizzle-orm';
import { generateId } from '@/lib/uuid';
import { formatDateKey } from '@/lib/date-utils';

export function useCompletions(startDate: Date, endDate: Date) {
  const { refresh, triggerRefresh } = useDatabase();
  const [data, setData] = useState<Completion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const startKey = formatDateKey(startDate);
  const endKey = formatDateKey(endDate);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const result = await db
        .select()
        .from(completions)
        .where(and(gte(completions.date, startKey), lte(completions.date, endKey)));
      setData(result);
      setIsLoading(false);
    })();
  }, [refresh, startKey, endKey]);

  const toggleComplete = useCallback(
    async (habitId: string, date: Date) => {
      const dateKey = formatDateKey(date);
      const existing = await db
        .select()
        .from(completions)
        .where(and(eq(completions.habitId, habitId), eq(completions.date, dateKey)));

      if (existing.length > 0 && existing[0].status === 'completed') {
        await db.delete(completions).where(eq(completions.id, existing[0].id));
      } else if (existing.length > 0) {
        await db
          .update(completions)
          .set({ status: 'completed' })
          .where(eq(completions.id, existing[0].id));
      } else {
        await db.insert(completions).values({
          id: generateId(),
          habitId,
          date: dateKey,
          status: 'completed',
          createdAt: new Date().toISOString(),
        });
      }
      triggerRefresh();
    },
    [triggerRefresh]
  );

  const skipHabit = useCallback(
    async (habitId: string, date: Date) => {
      const dateKey = formatDateKey(date);
      const existing = await db
        .select()
        .from(completions)
        .where(and(eq(completions.habitId, habitId), eq(completions.date, dateKey)));

      if (existing.length > 0) {
        await db
          .update(completions)
          .set({ status: 'skipped' })
          .where(eq(completions.id, existing[0].id));
      } else {
        await db.insert(completions).values({
          id: generateId(),
          habitId,
          date: dateKey,
          status: 'skipped',
          createdAt: new Date().toISOString(),
        });
      }
      triggerRefresh();
    },
    [triggerRefresh]
  );

  return { completions: data, isLoading, toggleComplete, skipHabit };
}
