'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Login page - Redirects to unified authentication page
 */
export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/identity/auth?mode=login');
  }, [router]);

  return null;
}
