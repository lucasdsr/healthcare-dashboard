'use client';

import { useEffect } from 'react';
import { registerServiceWorker } from '@/infrastructure/service-worker/register';

export function ServiceWorkerRegister() {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return null;
}
