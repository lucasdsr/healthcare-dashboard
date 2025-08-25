import { Status } from '../status';

describe('Status Value Object', () => {
  describe('Status Creation', () => {
    it('should create status with valid value', () => {
      const status = new Status('in-progress');

      expect(status.value).toBe('in-progress');
    });

    it('should handle different status values', () => {
      const statuses = [
        'planned',
        'arrived',
        'triaged',
        'in-progress',
        'onleave',
        'finished',
        'cancelled',
        'entered-in-error',
        'unknown',
      ];

      statuses.forEach(statusValue => {
        const status = new Status(statusValue as any);
        expect(status.value).toBe(statusValue);
      });
    });
  });

  describe('Status Methods', () => {
    it('should check if status is active', () => {
      const activeStatus = new Status('in-progress');
      const inactiveStatus = new Status('finished');

      expect(activeStatus.isActive()).toBe(true);
      expect(inactiveStatus.isActive()).toBe(false);
    });

    it('should check if status is completed', () => {
      const completedStatus = new Status('finished');
      const activeStatus = new Status('in-progress');

      expect(completedStatus.isCompleted()).toBe(true);
      expect(activeStatus.isCompleted()).toBe(false);
    });

    it('should check if status is planned', () => {
      const plannedStatus = new Status('planned');
      const activeStatus = new Status('in-progress');

      expect(plannedStatus.isPlanned()).toBe(true);
      expect(activeStatus.isPlanned()).toBe(false);
    });

    it('should check if status is on leave', () => {
      const onLeaveStatus = new Status('onleave');
      const activeStatus = new Status('in-progress');

      expect(onLeaveStatus.isOnLeave()).toBe(true);
      expect(activeStatus.isOnLeave()).toBe(false);
    });

    it('should check if status is error', () => {
      const errorStatus = new Status('entered-in-error');
      const activeStatus = new Status('in-progress');

      expect(errorStatus.isError()).toBe(true);
      expect(activeStatus.isError()).toBe(false);
    });

    it('should check if status is unknown', () => {
      const unknownStatus = new Status('unknown');
      const activeStatus = new Status('in-progress');

      expect(unknownStatus.isUnknown()).toBe(true);
      expect(activeStatus.isUnknown()).toBe(false);
    });
  });

  describe('Status Display', () => {
    it('should get display name correctly', () => {
      const activeStatus = new Status('in-progress');
      const plannedStatus = new Status('planned');
      const finishedStatus = new Status('finished');

      expect(activeStatus.getDisplayName()).toBe('In Progress');
      expect(plannedStatus.getDisplayName()).toBe('Planned');
      expect(finishedStatus.getDisplayName()).toBe('Finished');
    });

    it('should get color correctly', () => {
      const activeStatus = new Status('in-progress');
      const plannedStatus = new Status('planned');
      const finishedStatus = new Status('finished');
      const cancelledStatus = new Status('cancelled');

      expect(activeStatus.getColor()).toBe('green');
      expect(plannedStatus.getColor()).toBe('blue');
      expect(finishedStatus.getColor()).toBe('gray');
      expect(cancelledStatus.getColor()).toBe('red');
    });

    it('should get priority correctly', () => {
      const inProgressStatus = new Status('in-progress');
      const triagedStatus = new Status('triaged');
      const arrivedStatus = new Status('arrived');
      const plannedStatus = new Status('planned');

      expect(inProgressStatus.getPriority()).toBe(1);
      expect(triagedStatus.getPriority()).toBe(2);
      expect(arrivedStatus.getPriority()).toBe(3);
      expect(plannedStatus.getPriority()).toBe(4);
    });
  });

  describe('Status Transitions', () => {
    it('should check if status can transition to another status', () => {
      const plannedStatus = new Status('planned');
      const arrivedStatus = new Status('arrived');
      const inProgressStatus = new Status('in-progress');

      expect(plannedStatus.canTransitionTo('arrived')).toBe(true);
      expect(plannedStatus.canTransitionTo('cancelled')).toBe(true);
      expect(plannedStatus.canTransitionTo('finished')).toBe(false);

      expect(arrivedStatus.canTransitionTo('triaged')).toBe(true);
      expect(arrivedStatus.canTransitionTo('cancelled')).toBe(true);
      expect(arrivedStatus.canTransitionTo('finished')).toBe(false);

      expect(inProgressStatus.canTransitionTo('onleave')).toBe(true);
      expect(inProgressStatus.canTransitionTo('finished')).toBe(true);
      expect(inProgressStatus.canTransitionTo('cancelled')).toBe(true);
      expect(inProgressStatus.canTransitionTo('planned')).toBe(false);
    });

    it('should handle final statuses correctly', () => {
      const finishedStatus = new Status('finished');
      const cancelledStatus = new Status('cancelled');
      const errorStatus = new Status('entered-in-error');

      expect(finishedStatus.canTransitionTo('in-progress')).toBe(false);
      expect(cancelledStatus.canTransitionTo('in-progress')).toBe(false);
      expect(errorStatus.canTransitionTo('in-progress')).toBe(false);
    });
  });

  describe('Status Serialization', () => {
    it('should convert to string correctly', () => {
      const status = new Status('in-progress');

      expect(status.toString()).toBe('in-progress');
    });

    it('should handle different status values in toString', () => {
      const statuses = [
        'planned',
        'arrived',
        'triaged',
        'in-progress',
        'onleave',
        'finished',
        'cancelled',
        'entered-in-error',
        'unknown',
      ];

      statuses.forEach(statusValue => {
        const status = new Status(statusValue as any);
        expect(status.toString()).toBe(statusValue);
      });
    });
  });

  describe('Status Edge Cases', () => {
    it('should handle status with special characters', () => {
      const status = new Status('in-progress');

      expect(status.value).toBe('in-progress');
      expect(status.getDisplayName()).toBe('In Progress');
    });

    it('should handle all valid status values', () => {
      const validStatuses = [
        'planned',
        'arrived',
        'triaged',
        'in-progress',
        'onleave',
        'finished',
        'cancelled',
        'entered-in-error',
        'unknown',
      ];

      validStatuses.forEach(statusValue => {
        const status = new Status(statusValue as any);
        expect(status.value).toBe(statusValue);
        expect(status.getDisplayName()).toBeDefined();
        expect(status.getColor()).toBeDefined();
        expect(status.getPriority()).toBeDefined();
      });
    });
  });

  describe('Status Business Logic', () => {
    it('should handle workflow transitions correctly', () => {
      const planned = new Status('planned');
      const arrived = new Status('arrived');
      const triaged = new Status('triaged');
      const inProgress = new Status('in-progress');
      const finished = new Status('finished');

      expect(planned.canTransitionTo('arrived')).toBe(true);
      expect(arrived.canTransitionTo('triaged')).toBe(true);
      expect(triaged.canTransitionTo('in-progress')).toBe(true);
      expect(inProgress.canTransitionTo('finished')).toBe(true);
      expect(finished.canTransitionTo('in-progress')).toBe(false);
    });

    it('should handle cancellation at any stage', () => {
      const statuses = [
        'planned',
        'arrived',
        'triaged',
        'in-progress',
        'onleave',
      ];

      statuses.forEach(statusValue => {
        const status = new Status(statusValue as any);
        expect(status.canTransitionTo('cancelled')).toBe(true);
      });
    });

    it('should handle error state transitions', () => {
      const inProgress = new Status('in-progress');
      const error = new Status('entered-in-error');

      expect(inProgress.canTransitionTo('entered-in-error')).toBe(false);
      expect(error.canTransitionTo('in-progress')).toBe(false);
    });
  });
});
