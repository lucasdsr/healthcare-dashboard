import { DateRange } from '../date-range';

describe('DateRange', () => {
  describe('constructor', () => {
    it('should create a valid date range', () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-01-31');
      const dateRange = new DateRange(start, end);

      expect(dateRange.start).toBe(start);
      expect(dateRange.end).toBe(end);
    });

    it('should throw error when start date is after end date', () => {
      const start = new Date('2024-01-31');
      const end = new Date('2024-01-01');

      expect(() => new DateRange(start, end)).toThrow(
        'Start date must be before end date'
      );
    });
  });

  describe('static methods', () => {
    it('should create from ISO strings', () => {
      const dateRange = DateRange.fromISO(
        '2024-01-01T00:00:00Z',
        '2024-01-31T23:59:59Z'
      );

      expect(dateRange.start).toEqual(new Date('2024-01-01T00:00:00Z'));
      expect(dateRange.end).toEqual(new Date('2024-01-31T23:59:59Z'));
    });

    it('should create from Date objects', () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-01-31');
      const dateRange = DateRange.fromDates(start, end);

      expect(dateRange.start).toBe(start);
      expect(dateRange.end).toBe(end);
    });

    it('should create today range', () => {
      const today = new Date();
      const dateRange = DateRange.today();

      expect(dateRange.start.getDate()).toBe(today.getDate());
      expect(dateRange.start.getMonth()).toBe(today.getMonth());
      expect(dateRange.start.getFullYear()).toBe(today.getFullYear());
      expect(dateRange.end.getTime()).toBeGreaterThan(
        dateRange.start.getTime()
      );
    });

    it('should create this week range', () => {
      const dateRange = DateRange.thisWeek();
      const now = new Date();

      expect(dateRange.start.getDay()).toBe(0); // Sunday
      expect(dateRange.end.getTime()).toBeGreaterThan(
        dateRange.start.getTime()
      );
    });

    it('should create this month range', () => {
      const dateRange = DateRange.thisMonth();
      const now = new Date();

      expect(dateRange.start.getDate()).toBe(1);
      expect(dateRange.start.getMonth()).toBe(now.getMonth());
      expect(dateRange.start.getFullYear()).toBe(now.getFullYear());
      expect(dateRange.end.getTime()).toBeGreaterThan(
        dateRange.start.getTime()
      );
    });
  });

  describe('calculation methods', () => {
    it('should calculate days correctly', () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-01-31');
      const dateRange = new DateRange(start, end);

      expect(dateRange.getDays()).toBe(30);
    });

    it('should calculate hours correctly', () => {
      const start = new Date('2024-01-01T00:00:00Z');
      const end = new Date('2024-01-01T12:00:00Z');
      const dateRange = new DateRange(start, end);

      expect(dateRange.getHours()).toBe(12);
    });

    it('should calculate minutes correctly', () => {
      const start = new Date('2024-01-01T00:00:00Z');
      const end = new Date('2024-01-01T00:30:00Z');
      const dateRange = new DateRange(start, end);

      expect(dateRange.getMinutes()).toBe(30);
    });
  });

  describe('utility methods', () => {
    it('should check if date is contained', () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-01-31');
      const dateRange = new DateRange(start, end);

      expect(dateRange.contains(new Date('2024-01-15'))).toBe(true);
      expect(dateRange.contains(new Date('2024-02-01'))).toBe(false);
      expect(dateRange.contains(new Date('2023-12-31'))).toBe(false);
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
      expect(range1.overlaps(range3)).toBe(false);
    });

    it('should convert to ISO string', () => {
      const start = new Date('2024-01-01T00:00:00Z');
      const end = new Date('2024-01-31T23:59:59Z');
      const dateRange = new DateRange(start, end);

      const iso = dateRange.toISOString();
      expect(iso.start).toBe('2024-01-01T00:00:00.000Z');
      expect(iso.end).toBe('2024-01-31T23:59:59.000Z');
    });

    it('should convert to string', () => {
      const start = new Date('2024-01-01T00:00:00Z');
      const end = new Date('2024-01-31T23:59:59Z');
      const dateRange = new DateRange(start, end);

      const str = dateRange.toString();
      expect(str).toContain('2024-01-01T00:00:00.000Z');
      expect(str).toContain('2024-01-31T23:59:59.000Z');
    });
  });
});
