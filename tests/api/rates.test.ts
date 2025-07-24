import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';

vi.mock('@/utils/dateUtils', () => ({
  getToday: vi.fn(() => '2024-07-24')
}));

vi.mock('@/utils/rateUtils', () => ({
  fetchRates: vi.fn(),
  getExchangeRate: vi.fn()
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    rate: {
      findUnique: vi.fn(),
      findMany: vi.fn()
    }
  }
}));

global.fetch = vi.fn();

import { GET, POST } from '@/app/api/rates/route';

describe('/api/rates', () => {
  let mockPrisma: any;
  let mockRateUtils: any;

  beforeAll(async () => {
    mockPrisma = await import('@/lib/prisma');
    mockRateUtils = await import('@/utils/rateUtils');
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/rates', () => {
    it('should return rate for specific currency pair when found in database', async () => {
      const mockRateRow = {
        rate: 32.5,
        date: '2024-07-24',
        updatedAt: '2024-07-24T10:00:00.000Z'
      };

      vi.mocked(mockPrisma.prisma.rate.findUnique).mockResolvedValue(mockRateRow);

      const request = new NextRequest('http://localhost:3000/api/rates?from=USD&to=TWD');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        from: 'USD',
        to: 'TWD',
        rate: 32.5,
        date: '2024-07-24',
        updatedAt: mockRateRow.updatedAt
      });
    });

    it('should return rate of 1 when from and to currencies are the same', async () => {
      const request = new NextRequest('http://localhost:3000/api/rates?from=USD&to=USD');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        from: 'USD',
        to: 'USD',
        rate: 1,
        date: '2024-07-24',
        updatedAt: '2024-07-24'
      });
    });

    it('should return error when currency pair not found in database', async () => {
      vi.mocked(mockPrisma.prisma.rate.findUnique).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/rates?from=USD&to=EUR');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'Currency not found' });
    });

    it('should return all rates when no from/to parameters provided', async () => {
      const mockRates = [
        { rate: 32.5, date: '2024-07-24', from: 'USD', to: 'TWD' },
        { rate: 0.85, date: '2024-07-24', from: 'USD', to: 'EUR' }
      ];

      vi.mocked(mockPrisma.prisma.rate.findMany).mockResolvedValue(mockRates);

      const request = new NextRequest('http://localhost:3000/api/rates');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        date: '2024-07-24',
        rates: mockRates
      });
    });

    it('should use custom date when date parameter is provided', async () => {
      const mockRateRow = {
        rate: 31.8,
        date: '2024-07-23',
        updatedAt: '2024-07-23T10:00:00.000Z'
      };

      vi.mocked(mockPrisma.prisma.rate.findUnique).mockResolvedValue(mockRateRow);

      const request = new NextRequest('http://localhost:3000/api/rates?from=USD&to=TWD&date=2024-07-23');
      const response = await GET(request);
      const data = await response.json();

      expect(mockPrisma.prisma.rate.findUnique).toHaveBeenCalledWith({
        where: { date_from_to: { date: '2024-07-23', from: 'USD', to: 'TWD' } }
      });
      expect(data.date).toBe('2024-07-23');
    });

    it('should handle database errors gracefully', async () => {
      vi.mocked(mockPrisma.prisma.rate.findUnique).mockRejectedValue(new Error('Database connection failed'));

      const request = new NextRequest('http://localhost:3000/api/rates?from=USD&to=TWD');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Failed to fetch rates from DB' });
    });
  });

  describe('POST /api/rates', () => {
    it('should update rates successfully', async () => {
      const mockRates = {
        USD: 32.0,
        EUR: 37.6,
        TWD: 1
      };

      vi.mocked(mockRateUtils.fetchRates).mockResolvedValue(mockRates);
      vi.mocked(mockRateUtils.getExchangeRate).mockImplementation((from, to, rates) => {
        if (rates[from] && rates[to]) {
          return rates[from] / rates[to];
        }
        return null;
      });

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('Success')
      } as Response);

      const request = new NextRequest('http://localhost:3000/api/rates', {
        method: 'POST',
        headers: { host: 'localhost:3000' }
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ message: 'Rates updated in DB' });
      expect(mockRateUtils.fetchRates).toHaveBeenCalledWith('https://api.rter.info/json/rates');
    });

    it('should handle external API fetch failure', async () => {
      vi.mocked(mockRateUtils.fetchRates).mockRejectedValue(new Error('External API failed'));

      const request = new NextRequest('http://localhost:3000/api/rates', {
        method: 'POST',
        headers: { host: 'localhost:3000' }
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to fetch or update rates');
      expect(data.detail).toContain('External API failed');
    });

    it('should handle HTTPS protocol for production hosts', async () => {
      const mockRates = { USD: 32.0, TWD: 1 };
      vi.mocked(mockRateUtils.fetchRates).mockResolvedValue(mockRates);
      vi.mocked(mockRateUtils.getExchangeRate).mockReturnValue(32.0);
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('Success')
      } as Response);

      const request = new NextRequest('http://production.com/api/rates', {
        method: 'POST',
        headers: { host: 'production.com' }
      });

      await POST(request);

      expect(fetch).toHaveBeenCalledWith(
        'https://production.com/api/rates-db',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })
      );
    });

    it('should handle HTTP protocol for localhost', async () => {
      const mockRates = { USD: 32.0, TWD: 1 };
      vi.mocked(mockRateUtils.fetchRates).mockResolvedValue(mockRates);
      vi.mocked(mockRateUtils.getExchangeRate).mockReturnValue(32.0);
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('Success')
      } as Response);

      const request = new NextRequest('http://localhost:3000/api/rates', {
        method: 'POST',
        headers: { host: 'localhost:3000' }
      });

      await POST(request);

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/rates-db',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })
      );
    });

    it('should handle rates-db endpoint failure gracefully', async () => {
      const mockRates = { USD: 32.0, EUR: 37.6, TWD: 1 };
      vi.mocked(mockRateUtils.fetchRates).mockResolvedValue(mockRates);
      vi.mocked(mockRateUtils.getExchangeRate).mockReturnValue(32.0);
      
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 500,
        text: () => Promise.resolve('Database error')
      } as Response);

      const request = new NextRequest('http://localhost:3000/api/rates', {
        method: 'POST',
        headers: { host: 'localhost:3000' }
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      expect((await response.json()).message).toBe('Rates updated in DB');
    });
  });

});