'use client';

import { useState } from 'react';
import { Textarea } from '@headlessui/react';

export default function TextareaItem({
  label,
  initialValue = '',
}: {
  label: string;
  initialValue?: string;
}) {
  const [value, setValue] = useState(initialValue);

  return (
    <div className="flex flex-col justify-between py-2">
      {/* Label */}
      <label className="text-left text-gray-700">{label}</label>

      {/* Headless UI Textarea */}
      <div className="w-64">
        {/* Adjust width as needed */}
        <Textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="입력"
          className="block w-full resize-y rounded-lg border border-gray-300 bg-white p-3 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
          // You can control resizability with CSS 'resize' property if needed,
          // but standard textareas are resizable vertically by default.
          // To match the image exactly (resize handle in bottom-right),
          // the default browser behavior for textarea is usually sufficient.
          // Add 'resize-none' to disable resizing if needed.
        />
      </div>
    </div>
  );
}
