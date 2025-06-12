export default function MenuHeaderItem({ title }: { title: string }) {
  return (
    <div className="flex items-left justify-between py-4">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
    </div>
  );
}
