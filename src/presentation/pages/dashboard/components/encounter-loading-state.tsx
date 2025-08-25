import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  LoadingSpinner,
} from '@/presentation/components';

interface EncounterLoadingStateProps {
  isFilterLoading: boolean;
}

export const EncounterLoadingState: React.FC<EncounterLoadingStateProps> = ({
  isFilterLoading,
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Encounters</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="h-64 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-dashed border-purple-200 rounded-lg flex items-center justify-center">
        <LoadingSpinner
          size="lg"
          text={
            isFilterLoading
              ? 'Applying filters to data...'
              : 'Loading Encounters...'
          }
          variant="purple"
        />
      </div>
    </CardContent>
  </Card>
);
