export default function TextItem({
  label,
  placeholder = 'Value',
}: {
  label: string;
  placeholder?: string;
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
        className="flex-grow border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
