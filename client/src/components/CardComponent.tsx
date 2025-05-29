import { ReactNode } from 'react';

function CardComponent({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="bg-white rounded-lg p-6 mb-6">
      <h3 className="text-lg font-normal text-gray-800 pb-4 border-b border-gray-200 mb-4">
        {title}
      </h3>
      {children}
    </div>
  );
}

export default CardComponent;
