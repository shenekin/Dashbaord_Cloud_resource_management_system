'use client';

interface SummaryCardProps {
  title: string;
  data: any;
}

export default function SummaryCard({ title, data }: SummaryCardProps) {
  return (
    <div className="p-4 border border-gray-200 rounded-md">
      <h3 className="text-md font-medium text-gray-800 mb-2">{title}</h3>
      <pre className="text-sm text-gray-600 overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}

