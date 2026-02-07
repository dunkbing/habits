import React, { createContext, useContext, useState } from 'react';

interface SelectedDateContextValue {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

const SelectedDateContext = createContext<SelectedDateContextValue>({
  selectedDate: new Date(),
  setSelectedDate: () => {},
});

export function SelectedDateProvider({ children }: { children: React.ReactNode }) {
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  return (
    <SelectedDateContext.Provider value={{ selectedDate, setSelectedDate }}>
      {children}
    </SelectedDateContext.Provider>
  );
}

export function useSelectedDate() {
  return useContext(SelectedDateContext);
}
