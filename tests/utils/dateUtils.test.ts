import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getToday } from '@/utils/dateUtils';
import dayjs from 'dayjs';

describe('dateUtils', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('getToday', () => {
    it('should return today date in YYYY-MM-DD format', () => {
      const mockDate = '2024-07-24';
      vi.setSystemTime(new Date('2024-07-24T10:30:00Z'));
      
      const result = getToday();
      
      expect(result).toBe(mockDate);
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should return correct format for different dates', () => {
      vi.setSystemTime(new Date('2023-12-31T12:00:00'));
      expect(getToday()).toBe('2023-12-31');

      vi.setSystemTime(new Date('2024-01-01T12:00:00'));
      expect(getToday()).toBe('2024-01-01');
    });

    it('should handle single digit months and days correctly', () => {
      vi.setSystemTime(new Date('2024-03-05T12:00:00Z'));
      expect(getToday()).toBe('2024-03-05');
    });
  });
});