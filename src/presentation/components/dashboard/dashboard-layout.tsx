'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
import { MetricsDashboard } from './metrics-dashboard';
import { FilterBar } from '../filters/filter-bar';
import { EncounterList } from './encounter-list';
import { EncounterStatusChart } from '../charts/encounter-status-chart';
import { EncounterTrendsChart } from '../charts/encounter-trends-chart';

export const DashboardLayout: React.FC = () => {
  const [filters, setFilters] = React.useState({
    status: undefined,
    dateRange: undefined,
    patient: undefined,
    practitioner: undefined,
  });

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      status: undefined,
      dateRange: undefined,
      patient: undefined,
      practitioner: undefined,
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Healthcare Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Phase 3: Core Dashboard Components Implementation
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Phase 3 Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-green-600 mb-2">
                    ✅ Design System
                  </h3>
                  <p className="text-sm text-gray-600">
                    Consistent design tokens and components
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-green-600 mb-2">
                    ✅ Metrics Dashboard
                  </h3>
                  <p className="text-sm text-gray-600">
                    Real-time healthcare metrics display
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-green-600 mb-2">
                    ✅ Filter System
                  </h3>
                  <p className="text-sm text-gray-600">
                    Advanced filtering capabilities
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-green-600 mb-2">
                    ✅ Data Visualizations
                  </h3>
                  <p className="text-sm text-gray-600">
                    Interactive charts and graphs
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-green-600 mb-2">
                    ✅ Responsive Design
                  </h3>
                  <p className="text-sm text-gray-600">
                    Mobile-first responsive layout
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-green-600 mb-2">
                    ✅ Loading States
                  </h3>
                  <p className="text-sm text-gray-600">
                    Skeleton loading components
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <MetricsDashboard />

          <FilterBar
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EncounterStatusChart />
            <EncounterTrendsChart />
          </div>

          <EncounterList />
        </div>
      </div>
    </div>
  );
};
