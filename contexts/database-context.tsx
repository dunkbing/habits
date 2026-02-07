import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { db } from '@/db/client';
import { runMigrations, seedCategories } from '@/db/migrations';

interface DatabaseContextValue {
  isReady: boolean;
  refresh: number;
  triggerRefresh: () => void;
}

const DatabaseContext = createContext<DatabaseContextValue>({
  isReady: false,
  refresh: 0,
  triggerRefresh: () => {},
});

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    (async () => {
      await runMigrations(db);
      await seedCategories(db);
      setIsReady(true);
    })();
  }, []);

  const triggerRefresh = useCallback(() => {
    setRefresh((prev) => prev + 1);
  }, []);

  if (!isReady) return null;

  return (
    <DatabaseContext.Provider value={{ isReady, refresh, triggerRefresh }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  return useContext(DatabaseContext);
}
