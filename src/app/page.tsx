'use client';

import React, { useState } from 'react';
import { MetricsDashboard } from '@/presentation/components/dashboard/metrics-dashboard';
import { EncounterStatusChart } from '@/presentation/components/charts/encounter-status-chart';
import { EncounterTrendsChart } from '@/presentation/components/charts/encounter-trends-chart';
import { FilterBar } from '@/presentation/components/filters/filter-bar';
import { Button } from '@/presentation/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const [filters, setFilters] = useState({
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-900 mb-4 sm:mb-0">
            🏥 Healthcare Dashboard
          </h1>
          <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto shadow-lg">
            Query Builder
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-400" />
            <input
              type="text"
              placeholder="Search encounters, patients, practitioners..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            />
          </div>
        </div>

        {/* Filter Bar */}
        <FilterBar
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
        />

        {/* Metrics Section */}
        <div className="mb-8">
          <MetricsDashboard />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <EncounterTrendsChart />
          <EncounterStatusChart />
        </div>

        {/* Top Lists Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top 5 Professionals */}
          <Card className="bg-white border border-blue-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
              <CardTitle className="text-lg font-semibold text-blue-900">
                🏆 Top 5 Profissionais
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {[
                  { name: 'Dr. A. Silva', value: 4512 },
                  { name: 'Dr. J. Santos', value: 3982 },
                  { name: 'Dr. M. Oliveira', value: 3567 },
                  { name: 'Dr. R. Pereira', value: 3432 },
                  { name: 'Dr. L. Souza', value: 3198 },
                ].map((professional, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <span className="text-blue-800 text-sm md:text-base font-medium">
                      {professional.name}
                    </span>
                    <span className="font-bold text-blue-900 text-sm md:text-base">
                      {professional.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top 5 Organizations */}
          <Card className="bg-white border border-green-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
              <CardTitle className="text-lg font-semibold text-green-900">
                🏥 Top 5 Organizações
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {[
                  { name: 'Hospital Alpha', value: 12563 },
                  { name: 'Clinic Beta', value: 11247 },
                  { name: 'Hospital Gamma', value: 9834 },
                  { name: 'Clinic Delta', value: 8512 },
                  { name: 'Hospital Epsilon', value: 7896 },
                ].map((organization, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <span className="text-green-800 text-sm md:text-base font-medium">
                      {organization.name}
                    </span>
                    <span className="font-bold text-green-900 text-sm md:text-base">
                      {organization.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ranking Section */}
        <Card className="bg-white border border-purple-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
            <CardTitle className="text-lg font-semibold text-purple-900">
              📊 Ranking Geral
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {[
                {
                  rank: 1,
                  name: 'Hospital Alpha',
                  value: 'Hospital Alpha',
                  category: 'Hospital Alpha',
                },
                {
                  rank: 2,
                  name: 'Clinic Beta',
                  value: 'Clinic Beta',
                  category: 'Clinic Beta',
                },
                {
                  rank: 3,
                  name: 'Hospital Gamma',
                  value: 'Hospital Gamma',
                  category: 'Hospital Gamma',
                },
                {
                  rank: 4,
                  name: 'Clinic Delta',
                  value: 'Clinic Delta',
                  category: 'Clinic Delta',
                },
                {
                  rank: 5,
                  name: 'Hospital Epsilon',
                  value: 'Hospital Epsilon',
                  category: 'Hospital Epsilon',
                },
              ].map(item => (
                <div
                  key={item.rank}
                  className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <span className="font-bold text-purple-900 w-8 text-center">
                    #{item.rank}
                  </span>
                  <span className="text-purple-800 flex-1 text-sm md:text-base font-medium">
                    {item.name}
                  </span>
                  <span className="text-purple-700 flex-1 text-sm md:text-base">
                    {item.value}
                  </span>
                  <span className="text-purple-600 flex-1 text-sm md:text-base">
                    {item.category}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
