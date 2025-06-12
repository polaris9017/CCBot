import { ReactNode } from 'react';
import { Button } from '@headlessui/react';

export default function CenteredCardContainer({
  action,
  message,
  buttonStyle,
  children,
}: {
  action: string | ((formData?: FormData) => void | Promise<void>) | undefined;
  message: string;
  buttonStyle?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 w-full">
      <div className="p-8 bg-white rounded-xl shadow-lg space-y-6">
        <form className="space-y-4" action={action}>
          <p className="text-gray-600 text-center">{message}</p>
          <Button type="submit" className={buttonStyle ? `w-full ${buttonStyle}` : 'w-full'}>
            {children}
          </Button>
        </form>
      </div>
    </div>
  );
}
