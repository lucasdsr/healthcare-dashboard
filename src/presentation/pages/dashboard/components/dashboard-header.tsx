import React from 'react';
import { Button, DemoModeToggle } from '@/presentation/components';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

interface DashboardHeaderProps {
  showInfo: boolean;
  onToggleInfo: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  showInfo,
  onToggleInfo,
}) => (
  <div className="mb-8">
    <div className="flex items-center justify-between mb-4">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Healthcare Dashboard
        </h1>
        <p className="text-neutral-600">
          Real-time encounter monitoring and analytics
        </p>
      </div>
      <div className="flex items-center space-x-3">
        <DemoModeToggle />
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleInfo}
          className="flex items-center space-x-2"
        >
          <InformationCircleIcon className="h-4 w-4" />
          <span>API Info</span>
        </Button>
      </div>
    </div>
  </div>
);
