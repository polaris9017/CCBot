import { ReactNode } from 'react';
import CustomButton from '@/components/CustomButton';

function CardComponent({
  title,
  children,
  showSaveButton = false,
  onSave,
}: {
  title: string;
  children: ReactNode;
  showSaveButton?: boolean;
  onSave?: () => void;
}) {
  return (
    <div className="bg-white rounded-lg p-6 mb-6">
      <div className="flex items-end justify-between pb-4 border-b border-gray-200 mb-4">
        <h3 className="text-lg font-normal text-gray-800">{title}</h3>
        {showSaveButton && (
          <CustomButton onClick={onSave} variant="primary" className="mt-0">
            저장
          </CustomButton>
        )}
      </div>
      {children}
    </div>
  );
}

export default CardComponent;
