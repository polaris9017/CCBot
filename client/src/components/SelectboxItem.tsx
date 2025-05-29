import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { useState } from 'react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid'; // You'll need to install @heroicons/react

// Install heroicons: npm install @heroicons/react

export type OptionItem = {
  id: number;
  name: string;
  value: string;
};

const options: OptionItem[] = [
  { id: 1, name: 'Value 1', value: 'Value 1' },
  { id: 2, name: 'Value 2', value: 'Value 2' },
  { id: 3, name: 'Value 3', value: 'Value 3' },
];

function SelectboxItem({
  label,
  optionList = options,
}: {
  label: string;
  optionList?: OptionItem[];
}) {
  const [selectedOption, setSelectedOption] = useState(optionList[0]);

  return (
    <div className="flex items-center justify-between py-2">
      <label className="text-gray-700 mr-4">{label}</label>
      <Listbox value={selectedOption} onChange={setSelectedOption}>
        <div className="relative flex-grow">
          <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm">
            <span className="block truncate">{selectedOption.name}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </span>
          </ListboxButton>
          <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {optionList.map((option) => (
              <ListboxOption
                key={option.id}
                className={({ focus }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    focus ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                  }`
                }
                value={option}
              >
                {({ selected }) => (
                  <>
                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                      {option.name}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                        {/* You can add a check icon here if desired */}
                      </span>
                    ) : null}
                  </>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  );
}

export default SelectboxItem;
