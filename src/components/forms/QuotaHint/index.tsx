'use client';

interface QuotaHintProps {
  quota: {
    [key: string]: number;
  };
  resourceType: string;
}

export default function QuotaHint({ quota, resourceType }: QuotaHintProps) {
  const currentQuota = quota[resourceType] || 0;

  return (
    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
      <p className="text-sm text-blue-800">
        Available quota for {resourceType}: {currentQuota}
      </p>
    </div>
  );
}

