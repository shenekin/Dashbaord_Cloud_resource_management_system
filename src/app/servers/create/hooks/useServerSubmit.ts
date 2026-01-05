'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ServerFormData } from '@/types/server';
import { serverFormToApi } from '@/mappers/serverFormToApi';

export function useServerSubmit() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (formData: ServerFormData) => {
    setLoading(true);
    setError(null);

    try {
      const apiData = serverFormToApi(formData);
      // TODO: Implement actual API call
      // const response = await api.createServer(apiData);
      // router.push(`/servers/${response.id}`);
      
      // Placeholder
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push('/servers');
    } catch (err: any) {
      setError(err.message || 'Failed to create server');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    submit,
  };
}

