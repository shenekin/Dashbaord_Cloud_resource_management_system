'use client';

interface TagItemProps {
  tag: { key: string; value: string };
  onUpdate: (tag: { key: string; value: string }) => void;
  onRemove: () => void;
}

export default function TagItem({ tag, onUpdate, onRemove }: TagItemProps) {
  return (
    <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-md">
      <input
        type="text"
        value={tag.key}
        onChange={(e) => onUpdate({ ...tag, key: e.target.value })}
        className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
      />
      <span className="text-gray-500">:</span>
      <input
        type="text"
        value={tag.value}
        onChange={(e) => onUpdate({ ...tag, value: e.target.value })}
        className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
      />
      <button
        type="button"
        onClick={onRemove}
        className="px-3 py-2 text-red-600 hover:text-red-800"
      >
        Remove
      </button>
    </div>
  );
}

