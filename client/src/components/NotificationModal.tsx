import React, { Fragment } from 'react';
import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react';

export default function NotificationModal({
  header,
  description,
}: {
  header: string;
  description: string;
}) {
  return (
    <Dialog as={Fragment} open={true} onClose={() => {}}>
      <div className="fixed inset-0 top-16 z-40 bg-white/60 backdrop-blur-sm flex items-center justify-center">
        <DialogPanel className="w-full max-w-md rounded-lg bg-gray-100 p-6 text-center shadow-xl">
          <div className="mt-6">
            {/* You can add an animated spinner or icon here if you like */}
            <svg
              className="mx-auto h-12 w-12 text-blue-500 animate-bounce"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2zm0 0l-2 2m2-2l2 2m-3-6h6"
              />
            </svg>
          </div>

          <DialogTitle as="h2" className="text-2xl font-bold text-gray-900">
            {header}
          </DialogTitle>
          <Description className="mt-2 text-base text-gray-700">{description}</Description>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
