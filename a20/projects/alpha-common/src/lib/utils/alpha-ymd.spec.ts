import { AlphaYmd } from './alpha-ymd';

describe('AlphaYmd', () => {
  describe('parse', () => {
    it('should parse yyyy-MM-dd string to Date', () => {
      const date = AlphaYmd.parse('2025-10-08');
      expect(date).toBeInstanceOf(Date);
      expect(date.getFullYear()).toBe(2025);
      expect(date.getMonth()).toBe(9); // October is month 9 (0-based)
      expect(date.getDate()).toBe(8);
    });
  });

  describe('stringify', () => {
    it('should stringify a Date', () => {
      const date = new Date('2025-10-08');
      expect(AlphaYmd.stringify(date)).toContain('2025');
    });
    it('should stringify via instance', () => {
      const ymd = new AlphaYmd(new Date('2025-10-08'));
      expect(ymd.stringify()).toContain('2025');
    });
  });

  describe('format', () => {
    it('should format date with default params', () => {
      const ymd = new AlphaYmd(new Date('2025-10-08'));
      expect(typeof ymd.format()).toBe('string');
    });
    it('should format date with YMD and Dash', () => {
      const date = new Date('2025-10-08');
      expect(AlphaYmd.format(date, 'YMD', 'Dash')).toBe('2025-10-08');
    });
    it('should format date with DMY and Slash', () => {
      const date = new Date('2025-10-08');
      expect(AlphaYmd.format(date, 'DMY', 'Slash')).toBe('08/10/2025');
    });
  });

  describe('formatRange', () => {
    it('should format a range of dates', () => {
      const start = new Date('2025-10-08');
      const end = new Date('2025-11-08');
      expect(AlphaYmd.formatRange(start, end, ' to ', 'YMD', 'Dash')).toBe('2025-10-08 to 2025-11-08');
    });
  });

  describe('toYmd', () => {
    it('should normalize date to YYYY-MM-DD', () => {
      const date = new Date('2025-10-08T15:30:00');
      const normalized = AlphaYmd.toYmd(date);
      expect(normalized.getFullYear()).toBe(2025);
      expect(normalized.getMonth()).toBe(9);
      expect(normalized.getDate()).toBe(8);
      expect(normalized.getHours()).toBe(0);
      expect(normalized.getMinutes()).toBe(0);
      expect(normalized.getSeconds()).toBe(0);
    });
  });

  describe('inYmdRange', () => {
    it('should return true if date is in range', () => {
      const date = new Date('2025-10-08');
      const min = new Date('2025-10-01');
      const max = new Date('2025-10-31');
      expect(AlphaYmd.inYmdRange(date, min, max)).toBe(true);
    });
    it('should return false if date is out of range', () => {
      const date = new Date('2025-09-30');
      const min = new Date('2025-10-01');
      const max = new Date('2025-10-31');
      expect(AlphaYmd.inYmdRange(date, min, max)).toBe(false);
    });
  });

  describe('ymdEqual', () => {
    it('should return true for same year, month, day', () => {
      const dt0 = new Date('2025-10-08');
      const dt1 = new Date('2025-10-08T23:59:59');
      expect(AlphaYmd.ymdEqual(dt0, dt1)).toBe(true);
    });
    it('should return false for different dates', () => {
      const dt0 = new Date('2025-10-08');
      const dt1 = new Date('2025-10-09');
      expect(AlphaYmd.ymdEqual(dt0, dt1)).toBe(false);
    });
  });

  describe('ymdCompare', () => {
    it('should return 0 for equal dates', () => {
      const dt0 = new Date('2025-10-08');
      const dt1 = new Date('2025-10-08');
      expect(AlphaYmd.ymdCompare(dt0, dt1)).toBe(0);
    });
    it('should return -1 if first date is before second', () => {
      const dt0 = new Date('2025-10-07');
      const dt1 = new Date('2025-10-08');
      expect(AlphaYmd.ymdCompare(dt0, dt1)).toBe(-1);
    });
    it('should return 1 if first date is after second', () => {
      const dt0 = new Date('2025-10-09');
      const dt1 = new Date('2025-10-08');
      expect(AlphaYmd.ymdCompare(dt0, dt1)).toBe(1);
    });
  });
});
