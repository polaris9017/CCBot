import { ReactNode } from 'react';
import { SharedStateContextProvider } from '@/providers/shared-state';

export default function DashboardLayout({
  sidebar,
  children,
}: {
  sidebar: ReactNode;
  children: ReactNode;
}) {
  return (
    <SharedStateContextProvider>
      <div className="flex justify-start">
        {sidebar}
        {children}
      </div>
    </SharedStateContextProvider>
  );
}
