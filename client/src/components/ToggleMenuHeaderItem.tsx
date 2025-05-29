import { Switch } from '@headlessui/react';
import { useState } from 'react';

export default function ToggleMenuHeaderItem({
  title,
  initialValue = false,
}: {
  title: string;
  initialValue?: boolean;
}) {
  const [enabled, setEnabled] = useState(initialValue);

  return (
    <div className="flex items-center justify-between py-4">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className={`${
          enabled ? 'bg-blue-500' : 'bg-gray-300'
        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
      >
        <span
          className={`${
            enabled ? 'translate-x-6' : 'translate-x-1'
          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
        />
      </Switch>
    </div>
  );
}
