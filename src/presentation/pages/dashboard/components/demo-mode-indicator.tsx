import React from 'react';
import { Button } from '@/presentation/components';

interface DemoModeIndicatorProps {
  shouldShow: boolean;
}

export const DemoModeIndicator: React.FC<DemoModeIndicatorProps> = ({
  shouldShow,
}) => {
  if (!shouldShow) return null;

  return (
    <div className="flex items-center justify-center">
      <Button variant="warning" size="sm" className="cursor-default" disabled>
        📊 Demo Mode - Using Sample Data
      </Button>
    </div>
  );
};
