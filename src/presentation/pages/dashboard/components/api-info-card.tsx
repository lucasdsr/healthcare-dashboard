import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/presentation/components';

interface ApiInfoCardProps {
  showInfo: boolean;
}

export const ApiInfoCard: React.FC<ApiInfoCardProps> = ({ showInfo }) => {
  if (!showInfo) return null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">HAPI FHIR Integration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-sm text-neutral-600">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>
              Connected to:{' '}
              <code className="bg-neutral-100 px-2 py-1 rounded">
                https://hapi.fhir.org/baseR4
              </code>
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Status: Public test server (may have limited data)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span>
              Demo Mode: Toggle button to switch between API and demo data
            </span>
          </div>
          <div className="text-xs text-neutral-500 mt-2">
            💡 The HAPI FHIR server is a public test server. For production use,
            configure your own FHIR server in the environment variables.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
