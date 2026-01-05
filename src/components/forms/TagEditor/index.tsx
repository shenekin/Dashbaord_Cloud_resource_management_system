'use client';

import { useState } from 'react';

interface TagEditorProps {
  tags: Array<{ key: string; value: string }>;
  onChange: (tags: Array<{ key: string; value: string }>) => void;
}

export default function TagEditor({ tags, onChange }: TagEditorProps) {
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const addTag = () => {
    if (newKey && newValue) {
      onChange([...tags, { key: newKey, value: newValue }]);
      setNewKey('');
      setNewValue('');
    }
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Key"
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          placeholder="Value"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
        />
        <button
          type="button"
          onClick={addTag}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
        >
          Add
        </button>
      </div>
      {tags.map((tag, index) => (
        <div key={index} className="flex items-center gap-2">
          <span className="text-sm text-gray-600">{tag.key}: {tag.value}</span>
          <button
            type="button"
            onClick={() => removeTag(index)}
            className="text-red-600 hover:text-red-800"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

