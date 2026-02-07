import { useEffect, useState } from 'react';
import { db } from '@/db/client';
import { completions } from '@/db/schema';
import { useDatabase } from '@/contexts/database-context';
import { eq, and, desc } from 'drizzle-orm';
import { formatDateKey } from '@/lib/date-utils';

export function useStreak(habitId: string) {
  const { refresh } = useDatabase();
  const [currentStreak, setCurrentStreak] = useState(0);

  useEffect(() => {
    (async () => {
      const result = await db
        .select()
        .from(completions)
        .where(and(eq(completions.habitId, habitId), eq(completions.status, 'completed')))
        .orderBy(desc(completions.date));

      if (result.length === 0) {
        setCurrentStreak(0);
        return;
      }

      let streak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayKey = formatDateKey(today);

      const completedDates = new Set(result.map((c) => c.date));

      // Start from today or yesterday
      const checkDate = new Date(today);
      if (!completedDates.has(todayKey)) {
        checkDate.setDate(checkDate.getDate() - 1);
      }

      while (completedDates.has(formatDateKey(checkDate))) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      }

      setCurrentStreak(streak);
    })();
  }, [habitId, refresh]);

  return { currentStreak };
}
