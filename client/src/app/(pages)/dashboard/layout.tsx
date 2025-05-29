import { ReactNode } from 'react';

export default function DashboardLayout({ board }: { board: ReactNode }) {
  return <div className="flex justify-center">{board}</div>;
}
