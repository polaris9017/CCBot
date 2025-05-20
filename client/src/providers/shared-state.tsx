'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

/* 상태 추가 시 아래 interface 에도 추가 */
interface ContextType {
  menuItem: string;
  setMenuItem: (menuItem: string) => void;
}

const sharedStateContext = createContext<ContextType | undefined>(undefined);

export function SharedStateContextProvider({ children }: { children: ReactNode }) {
  const [menuItem, setMenuItem] = useState('');

  return (
    <sharedStateContext.Provider value={{ menuItem, setMenuItem }}>
      {children}
    </sharedStateContext.Provider>
  );
}

export function useSharedState() {
  const context = useContext(sharedStateContext);
  if (context === undefined) {
    throw new Error('useSharedState must be used within a MyContextProvider');
  }
  return context;
}
