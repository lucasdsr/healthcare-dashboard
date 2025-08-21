'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';

export const EncounterStatusChart: React.FC = () => {
  return (
    <Card className="bg-white border border-neutral-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-neutral-900">
          Gráfico de Distribuição
        </CardTitle>
        <p className="text-sm text-neutral-500">Encounters por status e tipo</p>
      </CardHeader>
      <CardContent>
        <div className="h-64 md:h-72 lg:h-80 bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl text-green-600 mb-2">📊</div>
            <p className="text-green-700 font-medium">Pie Chart Component</p>
            <p className="text-green-600 text-sm">
              Recharts integration needed
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
