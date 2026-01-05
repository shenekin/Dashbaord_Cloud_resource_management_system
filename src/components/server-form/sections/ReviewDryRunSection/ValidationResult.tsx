'use client';

interface ValidationResultProps {
  result: any;
  loading: boolean;
  error: string | null;
}

export default function ValidationResult({ result, loading, error }: ValidationResultProps) {
  if (loading) {
    return (
      <div className="p-4 border border-gray-200 rounded-md">
        <p className="text-sm text-gray-600">Validating...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 rounded-md">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (result) {
    return (
      <div className="p-4 border border-green-200 bg-green-50 rounded-md">
        <p className="text-sm text-green-600">Validation passed</p>
        {result.estimatedCost && (
          <p className="text-sm text-gray-600 mt-2">
            Estimated Cost: ${result.estimatedCost}
          </p>
        )}
      </div>
    );
  }

  return null;
}

