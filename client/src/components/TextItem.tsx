export default function TextItem({
  label,
  placeholder = 'Value',
  onChange,
}: {
  label: string;
  placeholder?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <label htmlFor={label} className="text-gray-700 mr-4">
        {label}
      </label>
      <input
        type="text"
        id={label}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        className="flex-grow border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
