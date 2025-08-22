'use client';

import React, { useState, useCallback } from 'react';
import { EncounterList } from './encounter-list';
import { FilterBar } from './filters/filter-bar';
import {
  EncounterStatusChart,
  EncounterTrendsChart,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from '@/presentation/components';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { MetricsDashboard } from './metrics-dashboard/metrics-dashboard';

interface DashboardFilters {
  status?: { label: string; value: string }[];
  dateRange?: { start: Date; end: Date };
  patient?: string;
  practitioner?: string;
}

// Transform dashboard filters to FHIR service format
const transformFiltersToFHIR = (filters: DashboardFilters) => {
  const fhirFilters: any = {};

  if (filters.status && filters.status.length > 0) {
    fhirFilters.status = filters.status[0].value;
  }

  if (filters.dateRange) {
    fhirFilters.dateRange = filters.dateRange;
  }

  if (filters.patient) {
    fhirFilters.patient = filters.patient;
  }

  if (filters.practitioner) {
    fhirFilters.practitioner = filters.practitioner;
  }

  return fhirFilters;
};

export const DashboardLayout: React.FC = () => {
  const [filters, setFilters] = useState<DashboardFilters>({});
  const [showInfo, setShowInfo] = useState(false);

  const handleFiltersChange = useCallback((newFilters: DashboardFilters) => {
    setFilters(newFilters);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const fhirFilters = transformFiltersToFHIR(filters);

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowInfo(!showInfo)}
              className="flex items-center space-x-2"
            >
              <InformationCircleIcon className="h-4 w-4" />
              <span>API Info</span>
            </Button>
          </div>

          {showInfo && (
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
                    <span>
                      Status: Public test server (may have limited data)
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>
                      Fallback: Demo data available when API has no records
                    </span>
                  </div>
                  <div className="text-xs text-neutral-500 mt-2">
                    💡 The HAPI FHIR server is a public test server. For
                    production use, configure your own FHIR server in the
                    environment variables.
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <FilterBar
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
        />

        {/* Debug Info */}
        {Object.keys(filters).length > 0 && (
          <Card className="mb-4 bg-blue-50 border-blue-200">
            <CardContent className="p-3">
              <div className="text-sm text-blue-800">
                🔍 <strong>Filters Active:</strong>{' '}
                {JSON.stringify(fhirFilters)}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-8">
          <MetricsDashboard filters={fhirFilters} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <EncounterStatusChart filters={fhirFilters} />
            <EncounterTrendsChart filters={fhirFilters} />
          </div>

          <EncounterList filters={fhirFilters} />
        </div>
      </div>
    </div>
  );
};
