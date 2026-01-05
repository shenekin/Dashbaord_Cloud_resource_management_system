'use client';

import DataDiskItem from './DataDiskList/DataDiskItem';

interface DataDiskListProps {
  data: Array<{ type: string; size: number }>;
  onChange: (data: Array<{ type: string; size: number }>) => void;
}

export default function DataDiskList({ data, onChange }: DataDiskListProps) {
  const addDisk = () => {
    onChange([...data, { type: '', size: 100 }]);
  };

  const updateDisk = (index: number, disk: { type: string; size: number }) => {
    const newData = [...data];
    newData[index] = disk;
    onChange(newData);
  };

  const removeDisk = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-md font-medium text-gray-800">Data Disks</h3>
        <button
          type="button"
          onClick={addDisk}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
        >
          Add Disk
        </button>
      </div>
      {data.map((disk, index) => (
        <DataDiskItem
          key={index}
          data={disk}
          onUpdate={(updatedDisk) => updateDisk(index, updatedDisk)}
          onRemove={() => removeDisk(index)}
        />
      ))}
    </div>
  );
}

