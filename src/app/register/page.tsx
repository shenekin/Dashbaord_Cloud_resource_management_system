'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Register page - Redirects to unified authentication page
 */
export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/identity/auth?mode=register');
  }, [router]);

  return null;
}
