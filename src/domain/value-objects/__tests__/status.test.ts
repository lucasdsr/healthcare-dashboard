import { Status } from '../status';
import { EncounterStatus } from '@/domain/entities/encounter';

describe('Status', () => {
  describe('constructor', () => {
    it('should create a status with valid value', () => {
      const status = new Status('in-progress');
      expect(status.value).toBe('in-progress');
    });
  });

  describe('status checks', () => {
    it('should identify active statuses', () => {
      expect(new Status('arrived').isActive()).toBe(true);
      expect(new Status('triaged').isActive()).toBe(true);
      expect(new Status('in-progress').isActive()).toBe(true);
      expect(new Status('planned').isActive()).toBe(false);
      expect(new Status('finished').isActive()).toBe(false);
    });

    it('should identify completed statuses', () => {
      expect(new Status('finished').isCompleted()).toBe(true);
      expect(new Status('cancelled').isCompleted()).toBe(true);
      expect(new Status('in-progress').isCompleted()).toBe(false);
      expect(new Status('planned').isCompleted()).toBe(false);
    });

    it('should identify planned status', () => {
      expect(new Status('planned').isPlanned()).toBe(true);
      expect(new Status('in-progress').isPlanned()).toBe(false);
    });

    it('should identify on leave status', () => {
      expect(new Status('onleave').isOnLeave()).toBe(true);
      expect(new Status('in-progress').isOnLeave()).toBe(false);
    });

    it('should identify error status', () => {
      expect(new Status('entered-in-error').isError()).toBe(true);
      expect(new Status('in-progress').isError()).toBe(false);
    });

    it('should identify unknown status', () => {
      expect(new Status('unknown').isUnknown()).toBe(true);
      expect(new Status('in-progress').isUnknown()).toBe(false);
    });
  });

  describe('display methods', () => {
    it('should return correct display names', () => {
      expect(new Status('planned').getDisplayName()).toBe('Planned');
      expect(new Status('arrived').getDisplayName()).toBe('Arrived');
      expect(new Status('triaged').getDisplayName()).toBe('Triaged');
      expect(new Status('in-progress').getDisplayName()).toBe('In Progress');
      expect(new Status('onleave').getDisplayName()).toBe('On Leave');
      expect(new Status('finished').getDisplayName()).toBe('Finished');
      expect(new Status('cancelled').getDisplayName()).toBe('Cancelled');
      expect(new Status('entered-in-error').getDisplayName()).toBe('Error');
      expect(new Status('unknown').getDisplayName()).toBe('Unknown');
    });

    it('should return correct colors', () => {
      expect(new Status('planned').getColor()).toBe('blue');
      expect(new Status('arrived').getColor()).toBe('yellow');
      expect(new Status('triaged').getColor()).toBe('orange');
      expect(new Status('in-progress').getColor()).toBe('green');
      expect(new Status('onleave').getColor()).toBe('purple');
      expect(new Status('finished').getColor()).toBe('gray');
      expect(new Status('cancelled').getColor()).toBe('red');
      expect(new Status('entered-in-error').getColor()).toBe('red');
      expect(new Status('unknown').getColor()).toBe('gray');
    });

    it('should return correct priorities', () => {
      expect(new Status('in-progress').getPriority()).toBe(1);
      expect(new Status('triaged').getPriority()).toBe(2);
      expect(new Status('arrived').getPriority()).toBe(3);
      expect(new Status('planned').getPriority()).toBe(4);
      expect(new Status('onleave').getPriority()).toBe(5);
      expect(new Status('finished').getPriority()).toBe(6);
      expect(new Status('cancelled').getPriority()).toBe(7);
      expect(new Status('entered-in-error').getPriority()).toBe(8);
      expect(new Status('unknown').getPriority()).toBe(9);
    });
  });

  describe('status transitions', () => {
    it('should allow valid transitions', () => {
      const planned = new Status('planned');
      expect(planned.canTransitionTo('arrived')).toBe(true);
      expect(planned.canTransitionTo('cancelled')).toBe(true);
      expect(planned.canTransitionTo('in-progress')).toBe(false);

      const arrived = new Status('arrived');
      expect(arrived.canTransitionTo('triaged')).toBe(true);
      expect(arrived.canTransitionTo('cancelled')).toBe(true);
      expect(arrived.canTransitionTo('finished')).toBe(false);

      const triaged = new Status('triaged');
      expect(triaged.canTransitionTo('in-progress')).toBe(true);
      expect(triaged.canTransitionTo('cancelled')).toBe(true);
      expect(triaged.canTransitionTo('planned')).toBe(false);

      const inProgress = new Status('in-progress');
      expect(inProgress.canTransitionTo('onleave')).toBe(true);
      expect(inProgress.canTransitionTo('finished')).toBe(true);
      expect(inProgress.canTransitionTo('cancelled')).toBe(true);
      expect(inProgress.canTransitionTo('planned')).toBe(false);

      const onLeave = new Status('onleave');
      expect(onLeave.canTransitionTo('in-progress')).toBe(true);
      expect(onLeave.canTransitionTo('finished')).toBe(true);
      expect(onLeave.canTransitionTo('cancelled')).toBe(true);
      expect(onLeave.canTransitionTo('planned')).toBe(false);
    });

    it('should not allow transitions from terminal statuses', () => {
      const finished = new Status('finished');
      expect(finished.canTransitionTo('in-progress')).toBe(false);
      expect(finished.canTransitionTo('planned')).toBe(false);

      const cancelled = new Status('cancelled');
      expect(cancelled.canTransitionTo('in-progress')).toBe(false);
      expect(cancelled.canTransitionTo('planned')).toBe(false);

      const error = new Status('entered-in-error');
      expect(error.canTransitionTo('in-progress')).toBe(false);
      expect(error.canTransitionTo('planned')).toBe(false);
    });

    it('should allow transitions from unknown status', () => {
      const unknown = new Status('unknown');
      expect(unknown.canTransitionTo('planned')).toBe(true);
      expect(unknown.canTransitionTo('arrived')).toBe(true);
      expect(unknown.canTransitionTo('in-progress')).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return the status value as string', () => {
      expect(new Status('in-progress').toString()).toBe('in-progress');
      expect(new Status('planned').toString()).toBe('planned');
      expect(new Status('finished').toString()).toBe('finished');
    });
  });
});
