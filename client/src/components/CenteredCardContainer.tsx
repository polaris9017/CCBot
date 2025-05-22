import { ReactNode } from 'react';

export default function CenteredCardContainer({
  action,
  message,
  image,
}: {
  action: string | ((formData: FormData) => void | Promise<void>) | undefined;
  message: string;
  image: ReactNode;
}) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-xl shadow-lg space-y-6">
        <form className="space-y-4" action={action}>
          <p className="text-gray-600 text-center">{message}</p>
          <button type="submit" className="w-full">
            {image}
          </button>
        </form>
      </div>
    </div>
  );
}
