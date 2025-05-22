import { ReactNode } from 'react';
import { SharedStateContextProvider } from '@/providers/shared-state';

export default function DashboardLayout({
  sidebar,
  board,
}: {
  sidebar: ReactNode;
  board: ReactNode;
}) {
  return (
    <SharedStateContextProvider>
      <div className="flex justify-start">
        {sidebar}
        {board}
      </div>
    </SharedStateContextProvider>
  );
}
