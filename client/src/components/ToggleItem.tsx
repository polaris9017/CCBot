import { Switch } from '@headlessui/react';
import { useState } from 'react';

export default function ToggleItem({
  label,
  initialValue = false,
  onChange,
}: {
  label: string;
  initialValue?: boolean;
  onChange?: (value: boolean) => void;
}) {
  const [enabled, setEnabled] = useState(initialValue);

  const handleChange = (value: boolean) => {
    setEnabled(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-gray-700">{label}</span>
      <Switch
        checked={enabled}
        onChange={handleChange}
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
