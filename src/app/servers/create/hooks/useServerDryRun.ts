'use client';

import { useState } from 'react';
import { ServerFormData } from '@/types/server';
import { serverFormToApi } from '@/mappers/serverFormToApi';

export function useServerDryRun() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const dryRun = async (formData: ServerFormData) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const apiData = serverFormToApi(formData);
      // TODO: Implement actual API call
      // const response = await api.dryRunServer(apiData);
      // setResult(response);
      
      // Placeholder response
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setResult({
        valid: true,
        estimatedCost: 0,
        warnings: [],
      });
    } catch (err: any) {
      setError(err.message || 'Dry run failed');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    result,
    error,
    dryRun,
  };
}

