import { describe, it, expect } from 'vitest';
import { CURRENCY_NAME_MAP, SYMBOLS, CURRENCIES } from '@/constants';

describe('constants', () => {
  describe('CURRENCY_NAME_MAP', () => {
    it('should contain all expected currencies with Chinese names', () => {
      const expectedCurrencies = {
        USD: '美元',
        EUR: '歐元',
        JPY: '日圓',
        TWD: '新台幣',
        HKD: '港幣',
        GBP: '英鎊',
        AUD: '澳幣',
        CAD: '加幣',
        SGD: '新幣',
        CNY: '人民幣'
      };

      expect(CURRENCY_NAME_MAP).toEqual(expectedCurrencies);
    });

    it('should have 10 currencies', () => {
      expect(Object.keys(CURRENCY_NAME_MAP)).toHaveLength(10);
    });

    it('should contain TWD as base currency', () => {
      expect(CURRENCY_NAME_MAP.TWD).toBe('新台幣');
    });

    it('should contain major world currencies', () => {
      const majorCurrencies = ['USD', 'EUR', 'JPY', 'GBP', 'CNY'];
      majorCurrencies.forEach(currency => {
        expect(CURRENCY_NAME_MAP).toHaveProperty(currency);
      });
    });
  });

  describe('SYMBOLS', () => {
    it('should contain correct currency symbols', () => {
      const expectedSymbols = {
        USD: '$',
        EUR: '€',
        JPY: '¥',
        TWD: 'NT$',
        HKD: 'HK$',
        GBP: '£',
        AUD: 'A$',
        CAD: 'C$',
        SGD: 'S$',
        CNY: '¥'
      };

      expect(SYMBOLS).toEqual(expectedSymbols);
    });

    it('should have same number of symbols as currency names', () => {
      expect(Object.keys(SYMBOLS)).toHaveLength(Object.keys(CURRENCY_NAME_MAP).length);
    });

    it('should have unique symbols for most currencies', () => {
      const symbolValues = Object.values(SYMBOLS);
      const uniqueSymbols = new Set(symbolValues);
      
      expect(uniqueSymbols.size).toBe(symbolValues.length - 1);
      expect(SYMBOLS.JPY).toBe('¥');
      expect(SYMBOLS.CNY).toBe('¥');
    });

    it('should contain Taiwan dollar symbol', () => {
      expect(SYMBOLS.TWD).toBe('NT$');
    });

    it('should contain US dollar symbol', () => {
      expect(SYMBOLS.USD).toBe('$');
    });
  });

  describe('CURRENCIES', () => {
    it('should be derived from CURRENCY_NAME_MAP keys', () => {
      const expectedCurrencies = Object.keys(CURRENCY_NAME_MAP);
      expect(CURRENCIES).toEqual(expectedCurrencies);
    });

    it('should contain all supported currency codes', () => {
      const expectedCodes = ['USD', 'EUR', 'JPY', 'TWD', 'HKD', 'GBP', 'AUD', 'CAD', 'SGD', 'CNY'];
      expect(CURRENCIES).toEqual(expect.arrayContaining(expectedCodes));
      expect(CURRENCIES).toHaveLength(expectedCodes.length);
    });

    it('should be an array of strings', () => {
      expect(Array.isArray(CURRENCIES)).toBe(true);
      CURRENCIES.forEach(currency => {
        expect(typeof currency).toBe('string');
      });
    });

    it('should contain TWD for base currency operations', () => {
      expect(CURRENCIES).toContain('TWD');
    });

    it('should maintain consistency across all three constants', () => {
      CURRENCIES.forEach(currency => {
        expect(CURRENCY_NAME_MAP).toHaveProperty(currency);
        expect(SYMBOLS).toHaveProperty(currency);
      });
    });

    it('should not contain duplicate currencies', () => {
      const uniqueCurrencies = new Set(CURRENCIES);
      expect(uniqueCurrencies.size).toBe(CURRENCIES.length);
    });
  });

  describe('data integrity', () => {
    it('should maintain data consistency across all constants', () => {
      const nameMapKeys = Object.keys(CURRENCY_NAME_MAP);
      const symbolKeys = Object.keys(SYMBOLS);

      expect(new Set(nameMapKeys)).toEqual(new Set(symbolKeys));
      expect(new Set(nameMapKeys)).toEqual(new Set(CURRENCIES));
    });

    it('should not have empty or null values', () => {
      Object.values(CURRENCY_NAME_MAP).forEach(name => {
        expect(name).toBeTruthy();
        expect(typeof name).toBe('string');
        expect(name.length).toBeGreaterThan(0);
      });

      Object.values(SYMBOLS).forEach(symbol => {
        expect(symbol).toBeTruthy();
        expect(typeof symbol).toBe('string');
        expect(symbol.length).toBeGreaterThan(0);
      });

      CURRENCIES.forEach(currency => {
        expect(currency).toBeTruthy();
        expect(typeof currency).toBe('string');
        expect(currency.length).toBeGreaterThan(0);
      });
    });
  });
});