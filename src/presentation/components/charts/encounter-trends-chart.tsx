'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';

export const EncounterTrendsChart: React.FC = () => {
  return (
    <Card className="bg-white border border-neutral-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-neutral-900">
          Gráfico de Tendência
        </CardTitle>
        <p className="text-sm text-neutral-500">
          Volume de encounters por dia na ultima semana
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-64 md:h-72 lg:h-80 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl text-blue-600 mb-2">📈</div>
            <p className="text-blue-700 font-medium">Chart Component</p>
            <p className="text-blue-600 text-sm">Recharts integration needed</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
