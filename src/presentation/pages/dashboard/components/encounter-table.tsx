import React from 'react';
import { FixedSizeList as List } from 'react-window';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/presentation/components';
import { EncounterRow } from './encounter-row';
import { EncounterTableHeader } from './encounter-table-header';
import { Encounter } from '@/domain/entities/encounter';

interface EncounterTableProps {
  encounters: Encounter[];
  listHeight: number;
}

export const EncounterTable: React.FC<EncounterTableProps> = ({
  encounters,
  listHeight,
}) => {
  if (encounters.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">No encounters found</p>
    );
  }

  return (
    <div className="relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <EncounterTableHeader />
      <List
        height={listHeight}
        width="100%"
        itemCount={encounters.length}
        itemSize={80}
        itemData={{ encounters }}
        className="virtual-list-scrollbar"
        overscanCount={5}
      >
        {EncounterRow}
      </List>
    </div>
  );
};
