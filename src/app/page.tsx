import { ServiceWorkerRegister } from '@/presentation/components/service-worker-register';
import { DashboardLayout } from '@/presentation/components/dashboard/dashboard-layout';

export default function Home() {
  return (
    <main>
      <ServiceWorkerRegister />
      <DashboardLayout />
    </main>
  );
}
