'use client';

import { useEffect } from 'react';
import { register } from '@/infrastructure/service-worker/register';

export function ServiceWorkerRegister() {
  useEffect(() => {
    register();
  }, []);

  return null;
}
