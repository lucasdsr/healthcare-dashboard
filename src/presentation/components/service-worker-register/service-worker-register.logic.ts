import { useEffect } from 'react';
import { register } from '@/infrastructure/service-worker/register';

export const useServiceWorkerRegisterLogic = () => {
  useEffect(() => {
    register();
  }, []);

  return {};
};
