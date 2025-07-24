import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchRates, getExchangeRate } from '@/utils/rateUtils';

vi.mock('@/constants', () => ({
  CURRENCIES: ['USD', 'EUR', 'JPY', 'TWD', 'HKD', 'GBP', 'AUD', 'CAD', 'SGD', 'CNY']
}));

global.fetch = vi.fn();

describe('rateUtils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchRates', () => {
    it('should fetch and process rates correctly', async () => {
      const mockApiResponse = {
        USDTWD: { Exrate: 32.0 },
        USDUSD: { Exrate: 1.0 },
        USDEUR: { Exrate: 0.85 },
        USDJPY: { Exrate: 150.0 },
        USDHKD: { Exrate: 7.8 },
        USDGBP: { Exrate: 0.75 },
        USDAUD: { Exrate: 1.5 },
        USDCAD: { Exrate: 1.35 },
        USDSGD: { Exrate: 1.25 },
        USDCNY: { Exrate: 7.2 }
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApiResponse)
      } as Response);

      const result = await fetchRates('https://api.example.com');

      expect(fetch).toHaveBeenCalledWith('https://api.example.com');
      expect(result).toEqual({
        USD: 32.0 / 1.0,
        EUR: 32.0 / 0.85,
        JPY: 32.0 / 150.0,
        TWD: 1,
        HKD: 32.0 / 7.8,
        GBP: 32.0 / 0.75,
        AUD: 32.0 / 1.5,
        CAD: 32.0 / 1.35,
        SGD: 32.0 / 1.25,
        CNY: 32.0 / 7.2
      });
    });

    it('should throw error when fetch fails', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 500
      } as Response);

      await expect(fetchRates('https://api.example.com'))
        .rejects.toThrow('Failed to fetch rates');
    });

    it('should throw error when USDTWD is missing', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({})
      } as Response);

      await expect(fetchRates('https://api.example.com'))
        .rejects.toThrow('USDTWD not found');
    });

    it('should handle missing currency rates gracefully', async () => {
      const mockApiResponse = {
        USDTWD: { Exrate: 32.0 },
        USDEUR: { Exrate: 0.85 }
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApiResponse)
      } as Response);

      const result = await fetchRates('https://api.example.com');

      expect(result.TWD).toBe(1);
      expect(result.EUR).toBe(32.0 / 0.85);
      expect(result.USD).toBeUndefined();
      expect(result.JPY).toBeUndefined();
    });
  });

  describe('getExchangeRate', () => {
    const mockRates = {
      USD: 32.0,
      EUR: 37.65,
      JPY: 0.213,
      TWD: 1,
      HKD: 4.1
    };

    it('should calculate exchange rate correctly', () => {
      const result = getExchangeRate('USD', 'TWD', mockRates);
      expect(result).toBe(32.0 / 1);
    });

    it('should calculate reverse exchange rate correctly', () => {
      const result = getExchangeRate('TWD', 'USD', mockRates);
      expect(result).toBe(1 / 32.0);
    });

    it('should calculate between non-TWD currencies', () => {
      const result = getExchangeRate('USD', 'EUR', mockRates);
      expect(result).toBe(32.0 / 37.65);
    });

    it('should return same rate when from and to are the same', () => {
      const result = getExchangeRate('USD', 'USD', mockRates);
      expect(result).toBe(1);
    });

    it('should return null when from currency is missing', () => {
      const result = getExchangeRate('GBP', 'USD', mockRates);
      expect(result).toBeNull();
    });

    it('should return null when to currency is missing', () => {
      const result = getExchangeRate('USD', 'GBP', mockRates);
      expect(result).toBeNull();
    });

    it('should return null when both currencies are missing', () => {
      const result = getExchangeRate('GBP', 'AUD', mockRates);
      expect(result).toBeNull();
    });

    it('should handle edge case with zero rates', () => {
      const ratesWithZero = { ...mockRates, EUR: 0 };
      const result = getExchangeRate('USD', 'EUR', ratesWithZero);
      expect(result).toBeNull();
    });
  });
});