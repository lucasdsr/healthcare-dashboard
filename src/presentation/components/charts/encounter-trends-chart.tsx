'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
import { useEncounters } from '@/infrastructure/queries/encounter-queries';

export const EncounterTrendsChart: React.FC = () => {
  const trendData = [
    { date: '2024-01-15', total: 15, active: 8, completed: 7 },
    { date: '2024-01-16', total: 18, active: 10, completed: 8 },
    { date: '2024-01-17', total: 22, active: 12, completed: 10 },
    { date: '2024-01-18', total: 20, active: 11, completed: 9 },
    { date: '2024-01-19', total: 25, active: 14, completed: 11 },
    { date: '2024-01-20', total: 28, active: 16, completed: 12 },
    { date: '2024-01-21', total: 30, active: 18, completed: 12 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-neutral-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Encounter Trends (Last 7 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Total Encounters"
              />
              <Line
                type="monotone"
                dataKey="active"
                stroke="#10b981"
                strokeWidth={2}
                name="Active Encounters"
              />
              <Line
                type="monotone"
                dataKey="completed"
                stroke="#06b6d4"
                strokeWidth={2}
                name="Completed Encounters"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
