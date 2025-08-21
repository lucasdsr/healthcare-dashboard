'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
import { useEncounterStore } from '@/infrastructure/store/encounter-store';

const COLORS = [
  '#3b82f6', // Blue - Planned
  '#10b981', // Green - Arrived
  '#f59e0b', // Yellow - Triaged
  '#ef4444', // Red - In Progress
  '#8b5cf6', // Purple - On Leave
  '#06b6d4', // Cyan - Finished
  '#6b7280', // Gray - Cancelled
];

export const EncounterStatusChart: React.FC = () => {
  const statusData = [
    {
      name: 'Planned',
      value: 5,
      color: COLORS[0],
    },
    {
      name: 'Arrived',
      value: 3,
      color: COLORS[1],
    },
    {
      name: 'Triaged',
      value: 2,
      color: COLORS[2],
    },
    {
      name: 'In Progress',
      value: 8,
      color: COLORS[3],
    },
    {
      name: 'On Leave',
      value: 1,
      color: COLORS[4],
    },
    {
      name: 'Finished',
      value: 12,
      color: COLORS[5],
    },
    {
      name: 'Cancelled',
      value: 1,
      color: COLORS[6],
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-neutral-200 rounded-lg shadow-lg">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-neutral-600">Count: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Encounter Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
