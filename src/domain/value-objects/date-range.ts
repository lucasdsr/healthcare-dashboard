export class DateRange {
  constructor(
    public readonly start: Date,
    public readonly end: Date
  ) {
    if (start > end) {
      throw new Error('Start date must be before end date');
    }
  }

  static fromISO(start: string, end: string): DateRange {
    return new DateRange(new Date(start), new Date(end));
  }

  static fromDates(start: Date, end: Date): DateRange {
    return new DateRange(start, end);
  }

  static today(): DateRange {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const end = new Date(start.getTime() + 24 * 60 * 60 * 1000 - 1);
    return new DateRange(start, end);
  }

  static thisWeek(): DateRange {
    const now = new Date();
    const start = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - now.getDay()
    );
    const end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000 - 1);
    return new DateRange(start, end);
  }

  static thisMonth(): DateRange {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );
    return new DateRange(start, end);
  }

  getDays(): number {
    return Math.ceil(
      (this.end.getTime() - this.start.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  getHours(): number {
    return Math.ceil(
      (this.end.getTime() - this.start.getTime()) / (1000 * 60 * 60)
    );
  }

  getMinutes(): number {
    return Math.ceil((this.end.getTime() - this.start.getTime()) / (1000 * 60));
  }

  contains(date: Date): boolean {
    return date >= this.start && date <= this.end;
  }

  overlaps(other: DateRange): boolean {
    return this.start <= other.end && other.start <= this.end;
  }

  toISOString(): { start: string; end: string } {
    return {
      start: this.start.toISOString(),
      end: this.end.toISOString(),
    };
  }

  toString(): string {
    return `${this.start.toISOString()} - ${this.end.toISOString()}`;
  }
}
