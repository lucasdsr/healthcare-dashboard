import { DateRange } from '../date-range';

describe('DateRange Value Object', () => {
  describe('DateRange Creation', () => {
    it('should create a valid date range', () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-01-31');
      const dateRange = new DateRange(start, end);

      expect(dateRange.start).toEqual(start);
      expect(dateRange.end).toEqual(end);
    });

    it('should throw error when start date is after end date', () => {
      const start = new Date('2024-01-31');
      const end = new Date('2024-01-01');

      expect(() => new DateRange(start, end)).toThrow(
        'Start date must be before end date'
      );
    });

    it('should create from ISO strings', () => {
      const dateRange = DateRange.fromISO('2024-01-01', '2024-01-31');

      expect(dateRange.start).toEqual(new Date('2024-01-01'));
      expect(dateRange.end).toEqual(new Date('2024-01-31'));
    });

    it('should create from Date objects', () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-01-31');
      const dateRange = DateRange.fromDates(start, end);

      expect(dateRange.start).toEqual(start);
      expect(dateRange.end).toEqual(end);
    });
  });

  describe('DateRange Factory Methods', () => {
    it('should create today range', () => {
      const todayRange = DateRange.today();
      const now = new Date();
      const expectedStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );
      const expectedEnd = new Date(
        expectedStart.getTime() + 24 * 60 * 60 * 1000 - 1
      );

      expect(todayRange.start.getDate()).toBe(expectedStart.getDate());
      expect(todayRange.start.getMonth()).toBe(expectedStart.getMonth());
      expect(todayRange.start.getFullYear()).toBe(expectedStart.getFullYear());
      expect(todayRange.end.getDate()).toBe(expectedEnd.getDate());
      expect(todayRange.end.getMonth()).toBe(expectedEnd.getMonth());
      expect(todayRange.end.getFullYear()).toBe(expectedEnd.getFullYear());
    });

    it('should create this week range', () => {
      const thisWeekRange = DateRange.thisWeek();
      const now = new Date();
      const expectedStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - now.getDay()
      );
      const expectedEnd = new Date(
        expectedStart.getTime() + 7 * 24 * 60 * 60 * 1000 - 1
      );

      expect(thisWeekRange.start.getDate()).toBe(expectedStart.getDate());
      expect(thisWeekRange.start.getMonth()).toBe(expectedStart.getMonth());
      expect(thisWeekRange.start.getFullYear()).toBe(
        expectedStart.getFullYear()
      );
      expect(thisWeekRange.end.getDate()).toBe(expectedEnd.getDate());
      expect(thisWeekRange.end.getMonth()).toBe(expectedEnd.getMonth());
      expect(thisWeekRange.end.getFullYear()).toBe(expectedEnd.getFullYear());
    });

    it('should create this month range', () => {
      const thisMonthRange = DateRange.thisMonth();
      const now = new Date();
      const expectedStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const expectedEnd = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );

      expect(thisMonthRange.start.getDate()).toBe(expectedStart.getDate());
      expect(thisMonthRange.start.getMonth()).toBe(expectedStart.getMonth());
      expect(thisMonthRange.start.getFullYear()).toBe(
        expectedStart.getFullYear()
      );
      expect(thisMonthRange.end.getDate()).toBe(expectedEnd.getDate());
      expect(thisMonthRange.end.getMonth()).toBe(expectedEnd.getMonth());
      expect(thisMonthRange.end.getFullYear()).toBe(expectedEnd.getFullYear());
    });
  });

  describe('DateRange Duration Calculations', () => {
    it('should calculate days correctly', () => {
      const dateRange = new DateRange(
        new Date('2024-01-01'),
        new Date('2024-01-31')
      );

      expect(dateRange.getDays()).toBe(30);
    });

    it('should calculate hours correctly', () => {
      const dateRange = new DateRange(
        new Date('2024-01-01T00:00:00.000Z'),
        new Date('2024-01-01T24:00:00.000Z')
      );

      expect(dateRange.getHours()).toBe(24);
    });

    it('should calculate minutes correctly', () => {
      const dateRange = new DateRange(
        new Date('2024-01-01T00:00:00.000Z'),
        new Date('2024-01-01T01:00:00.000Z')
      );

      expect(dateRange.getMinutes()).toBe(60);
    });

    it('should handle single day range', () => {
      const dateRange = new DateRange(
        new Date('2024-01-01T00:00:00.000Z'),
        new Date('2024-01-01T23:59:59.999Z')
      );

      expect(dateRange.getDays()).toBe(1);
    });
  });

  describe('DateRange Operations', () => {
    it('should check if date is contained within range', () => {
      const dateRange = new DateRange(
        new Date('2024-01-01'),
        new Date('2024-01-31')
      );

      expect(dateRange.contains(new Date('2024-01-15'))).toBe(true);
      expect(dateRange.contains(new Date('2024-01-01'))).toBe(true);
      expect(dateRange.contains(new Date('2024-01-31'))).toBe(true);
      expect(dateRange.contains(new Date('2023-12-31'))).toBe(false);
      expect(dateRange.contains(new Date('2024-02-01'))).toBe(false);
    });

    it('should check if ranges overlap', () => {
      const range1 = new DateRange(
        new Date('2024-01-01'),
        new Date('2024-01-31')
      );
      const range2 = new DateRange(
        new Date('2024-01-15'),
        new Date('2024-02-15')
      );
      const range3 = new DateRange(
        new Date('2024-02-01'),
        new Date('2024-02-28')
      );

      expect(range1.overlaps(range2)).toBe(true);
      expect(range2.overlaps(range1)).toBe(true);
      expect(range1.overlaps(range3)).toBe(false);
      expect(range3.overlaps(range1)).toBe(false);
    });

    it('should handle edge case overlaps', () => {
      const range1 = new DateRange(
        new Date('2024-01-01'),
        new Date('2024-01-31')
      );
      const range2 = new DateRange(
        new Date('2024-01-31'),
        new Date('2024-02-28')
      );

      expect(range1.overlaps(range2)).toBe(true);
      expect(range2.overlaps(range1)).toBe(true);
    });
  });

  describe('DateRange Serialization', () => {
    it('should serialize to ISO string format', () => {
      const dateRange = new DateRange(
        new Date('2024-01-01T00:00:00.000Z'),
        new Date('2024-01-31T23:59:59.999Z')
      );

      const iso = dateRange.toISOString();

      expect(iso.start).toBe('2024-01-01T00:00:00.000Z');
      expect(iso.end).toBe('2024-01-31T23:59:59.999Z');
    });

    it('should convert to string representation', () => {
      const dateRange = new DateRange(
        new Date('2024-01-01T00:00:00.000Z'),
        new Date('2024-01-31T23:59:59.999Z')
      );

      const stringRep = dateRange.toString();

      expect(stringRep).toContain('2024-01-01T00:00:00.000Z');
      expect(stringRep).toContain('2024-01-31T23:59:59.999Z');
      expect(stringRep).toContain(' - ');
    });
  });

  describe('DateRange Edge Cases', () => {
    it('should handle leap year dates', () => {
      const leapYearRange = new DateRange(
        new Date('2024-02-01'),
        new Date('2024-02-29')
      );

      expect(leapYearRange.getDays()).toBe(28);
    });

    it('should handle month boundaries', () => {
      const monthBoundaryRange = new DateRange(
        new Date('2024-01-31'),
        new Date('2024-02-01')
      );

      expect(monthBoundaryRange.getDays()).toBe(1);
    });

    it('should handle year boundaries', () => {
      const yearBoundaryRange = new DateRange(
        new Date('2023-12-31'),
        new Date('2024-01-01')
      );

      expect(yearBoundaryRange.getDays()).toBe(1);
    });

    it('should handle very short ranges', () => {
      const shortRange = new DateRange(
        new Date('2024-01-01T00:00:00.000Z'),
        new Date('2024-01-01T00:01:00.000Z')
      );

      expect(shortRange.getMinutes()).toBe(1);
    });

    it('should handle very long ranges', () => {
      const longRange = new DateRange(
        new Date('2020-01-01'),
        new Date('2030-12-31')
      );

      expect(longRange.getDays()).toBeGreaterThan(4000);
    });
  });

  describe('DateRange Validation', () => {
    it('should handle same start and end dates', () => {
      const sameDate = new Date('2024-01-01');
      const dateRange = new DateRange(sameDate, sameDate);

      expect(dateRange.start).toEqual(sameDate);
      expect(dateRange.end).toEqual(sameDate);
      expect(dateRange.getDays()).toBe(0);
    });

    it('should handle timezone differences', () => {
      const start = new Date('2024-01-01T00:00:00.000Z');
      const end = new Date('2024-01-01T23:59:59.999Z');
      const dateRange = new DateRange(start, end);

      expect(dateRange.getDays()).toBe(1);
      expect(dateRange.getHours()).toBe(24);
    });
  });
});
