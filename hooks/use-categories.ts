import { useEffect, useState } from 'react';
import { db } from '@/db/client';
import { categories } from '@/db/schema';
import type { Category } from '@/db/schema';
import { useDatabase } from '@/contexts/database-context';
import { asc } from 'drizzle-orm';

export function useCategories() {
  const { refresh } = useDatabase();
  const [data, setData] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const result = await db
        .select()
        .from(categories)
        .orderBy(asc(categories.sortOrder));
      setData(result);
      setIsLoading(false);
    })();
  }, [refresh]);

  return { categories: data, isLoading };
}
