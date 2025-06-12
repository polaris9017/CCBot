import { ReactNode } from 'react';

export default function ErrorPageContainer({
  title,
  message,
  linkList,
}: {
  title: string;
  message: string;
  linkList: ReactNode[];
}) {
  return (
    <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
          {title}
        </h1>
        <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">{message}</p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          {linkList.map((link) => link)}
        </div>
      </div>
    </main>
  );
}
