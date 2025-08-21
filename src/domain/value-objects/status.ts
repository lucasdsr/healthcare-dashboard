import { EncounterStatus } from '@/domain/entities/encounter';

export class Status {
  constructor(public readonly value: EncounterStatus) {}

  isActive(): boolean {
    return ['arrived', 'triaged', 'in-progress'].includes(this.value);
  }

  isCompleted(): boolean {
    return ['finished', 'cancelled'].includes(this.value);
  }

  isPlanned(): boolean {
    return this.value === 'planned';
  }

  isOnLeave(): boolean {
    return this.value === 'onleave';
  }

  isError(): boolean {
    return this.value === 'entered-in-error';
  }

  isUnknown(): boolean {
    return this.value === 'unknown';
  }

  getDisplayName(): string {
    const displayNames: Record<EncounterStatus, string> = {
      planned: 'Planned',
      arrived: 'Arrived',
      triaged: 'Triaged',
      'in-progress': 'In Progress',
      onleave: 'On Leave',
      finished: 'Finished',
      cancelled: 'Cancelled',
      'entered-in-error': 'Error',
      unknown: 'Unknown',
    };
    return displayNames[this.value];
  }

  getColor(): string {
    const colors: Record<EncounterStatus, string> = {
      planned: 'blue',
      arrived: 'yellow',
      triaged: 'orange',
      'in-progress': 'green',
      onleave: 'purple',
      finished: 'gray',
      cancelled: 'red',
      'entered-in-error': 'red',
      unknown: 'gray',
    };
    return colors[this.value];
  }

  getPriority(): number {
    const priorities: Record<EncounterStatus, number> = {
      'in-progress': 1,
      triaged: 2,
      arrived: 3,
      planned: 4,
      onleave: 5,
      finished: 6,
      cancelled: 7,
      'entered-in-error': 8,
      unknown: 9,
    };
    return priorities[this.value];
  }

  canTransitionTo(targetStatus: EncounterStatus): boolean {
    const validTransitions: Record<EncounterStatus, EncounterStatus[]> = {
      planned: ['arrived', 'cancelled'],
      arrived: ['triaged', 'cancelled'],
      triaged: ['in-progress', 'cancelled'],
      'in-progress': ['onleave', 'finished', 'cancelled'],
      onleave: ['in-progress', 'finished', 'cancelled'],
      finished: [],
      cancelled: [],
      'entered-in-error': [],
      unknown: ['planned', 'arrived'],
    };
    return validTransitions[this.value].includes(targetStatus);
  }

  toString(): string {
    return this.value;
  }
}
