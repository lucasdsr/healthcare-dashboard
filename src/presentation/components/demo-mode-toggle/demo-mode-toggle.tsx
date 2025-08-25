import React from 'react';
import { Button } from '@/presentation/components';
import { useDemoModeStore } from '@/infrastructure/store';
import { PlayIcon, StopIcon } from '@heroicons/react/24/outline';

interface DemoModeToggleProps {
  className?: string;
}

export const DemoModeToggle: React.FC<DemoModeToggleProps> = ({
  className,
}) => {
  const { isEnabled, toggleDemoMode } = useDemoModeStore();

  return (
    <Button
      variant={isEnabled ? 'warning' : 'secondary'}
      size="sm"
      onClick={toggleDemoMode}
      className={`flex items-center space-x-2 ${className || ''}`}
    >
      {isEnabled ? (
        <>
          <StopIcon className="h-4 w-4" />
          <span>Disable Demo Mode</span>
        </>
      ) : (
        <>
          <PlayIcon className="h-4 w-4" />
          <span>Enable Demo Mode</span>
        </>
      )}
    </Button>
  );
};
