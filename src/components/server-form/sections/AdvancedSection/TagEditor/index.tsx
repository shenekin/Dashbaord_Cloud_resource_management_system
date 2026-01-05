'use client';

import { useState } from 'react';
import TagItem from './TagItem';

interface TagEditorProps {
  tags: Array<{ key: string; value: string }>;
  onChange: (tags: Array<{ key: string; value: string }>) => void;
}

export default function TagEditor({ tags, onChange }: TagEditorProps) {
  const [newTagKey, setNewTagKey] = useState('');
  const [newTagValue, setNewTagValue] = useState('');

  const addTag = () => {
    if (newTagKey && newTagValue) {
      onChange([...tags, { key: newTagKey, value: newTagValue }]);
      setNewTagKey('');
      setNewTagValue('');
    }
  };

  const updateTag = (index: number, tag: { key: string; value: string }) => {
    const newTags = [...tags];
    newTags[index] = tag;
    onChange(newTags);
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Tag Key"
          value={newTagKey}
          onChange={(e) => setNewTagKey(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          placeholder="Tag Value"
          value={newTagValue}
          onChange={(e) => setNewTagValue(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
        />
        <button
          type="button"
          onClick={addTag}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
        >
          Add Tag
        </button>
      </div>
      {tags.map((tag, index) => (
        <TagItem
          key={index}
          tag={tag}
          onUpdate={(updatedTag) => updateTag(index, updatedTag)}
          onRemove={() => removeTag(index)}
        />
      ))}
    </div>
  );
}

