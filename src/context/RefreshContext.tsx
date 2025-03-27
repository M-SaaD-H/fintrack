'use client';

import { createContext, useContext, useState } from "react";

const RefreshContext = createContext({
  refreshTrigger: 0,
  refresh: () => {}
});

export function RefreshProvider({ children }: { children: React.ReactNode }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refresh = () => {
    setRefreshTrigger(prev => prev + 1);
  }

  return (
    <RefreshContext.Provider value={{ refreshTrigger, refresh }}>
      {children}
    </RefreshContext.Provider>
  )
}

export const useRefresh = () => useContext(RefreshContext);