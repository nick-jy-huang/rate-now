import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/rates-db/route';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    rate: {
      upsert: vi.fn(),
      findMany: vi.fn()
    }
  }
}));

describe('/api/rates-db', () => {
  let mockPrisma: any;

  beforeAll(async () => {
    mockPrisma = await import('@/lib/prisma');
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/rates-db', () => {
    it('should create new rate when it does not exist', async () => {
      const requestBody = {
        date: '2024-07-24',
        from: 'USD',
        to: 'TWD',
        rate: 32.5
      };

      const mockUpsertResult = {
        id: 1,
        date: '2024-07-24',
        from: 'USD',
        to: 'TWD',
        rate: 32.5,
        createdAt: '2024-07-24T10:00:00.000Z',
        updatedAt: '2024-07-24T10:00:00.000Z'
      };

      vi.mocked(mockPrisma.prisma.rate.upsert).mockResolvedValue(mockUpsertResult);

      const request = new NextRequest('http://localhost:3000/api/rates-db', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const response = await POST(request);
      const data = await response.json();

      expect(mockPrisma.prisma.rate.upsert).toHaveBeenCalledWith({
        where: { date_from_to: { date: '2024-07-24', from: 'USD', to: 'TWD' } },
        update: { rate: 32.5 },
        create: { date: '2024-07-24', from: 'USD', to: 'TWD', rate: 32.5 }
      });

      expect(response.status).toBe(200);
      expect(data).toEqual(mockUpsertResult);
    });

    it('should update existing rate', async () => {
      const requestBody = {
        date: '2024-07-24',
        from: 'USD',
        to: 'TWD',
        rate: 33.0
      };

      const mockUpsertResult = {
        id: 1,
        date: '2024-07-24',
        from: 'USD',
        to: 'TWD',
        rate: 33.0,
        createdAt: '2024-07-24T09:00:00.000Z',
        updatedAt: '2024-07-24T11:00:00.000Z'
      };

      vi.mocked(mockPrisma.prisma.rate.upsert).mockResolvedValue(mockUpsertResult);

      const request = new NextRequest('http://localhost:3000/api/rates-db', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const response = await POST(request);
      const data = await response.json();

      expect(mockPrisma.prisma.rate.upsert).toHaveBeenCalledWith({
        where: { date_from_to: { date: '2024-07-24', from: 'USD', to: 'TWD' } },
        update: { rate: 33.0 },
        create: { date: '2024-07-24', from: 'USD', to: 'TWD', rate: 33.0 }
      });

      expect(response.status).toBe(200);
      expect(data).toEqual(mockUpsertResult);
    });

    it('should handle database errors', async () => {
      const requestBody = {
        date: '2024-07-24',
        from: 'USD',
        to: 'TWD',
        rate: 32.5
      };

      vi.mocked(mockPrisma.prisma.rate.upsert).mockRejectedValue(new Error('Database connection failed'));

      const request = new NextRequest('http://localhost:3000/api/rates-db', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      await expect(POST(request)).rejects.toThrow('Database connection failed');
    });

    it('should handle malformed JSON request', async () => {
      const request = new NextRequest('http://localhost:3000/api/rates-db', {
        method: 'POST',
        body: 'invalid json',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      await expect(POST(request)).rejects.toThrow();
    });

    it('should handle decimal rate values correctly', async () => {
      const requestBody = {
        date: '2024-07-24',
        from: 'EUR',
        to: 'USD',
        rate: 1.0856
      };

      const mockUpsertResult = {
        id: 2,
        ...requestBody,
        createdAt: '2024-07-24T10:00:00.000Z',
        updatedAt: '2024-07-24T10:00:00.000Z'
      };

      vi.mocked(mockPrisma.prisma.rate.upsert).mockResolvedValue(mockUpsertResult);

      const request = new NextRequest('http://localhost:3000/api/rates-db', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const response = await POST(request);
      
      expect(mockPrisma.prisma.rate.upsert).toHaveBeenCalledWith({
        where: { date_from_to: { date: '2024-07-24', from: 'EUR', to: 'USD' } },
        update: { rate: 1.0856 },
        create: { date: '2024-07-24', from: 'EUR', to: 'USD', rate: 1.0856 }
      });

      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/rates-db', () => {
    it('should return all rates when no filters provided', async () => {
      const mockRates = [
        { id: 1, date: '2024-07-24', from: 'USD', to: 'TWD', rate: 32.5 },
        { id: 2, date: '2024-07-24', from: 'EUR', to: 'TWD', rate: 35.2 }
      ];

      vi.mocked(mockPrisma.prisma.rate.findMany).mockResolvedValue(mockRates);

      const request = new NextRequest('http://localhost:3000/api/rates-db');
      const response = await GET(request);
      const data = await response.json();

      expect(mockPrisma.prisma.rate.findMany).toHaveBeenCalledWith({ where: {} });
      expect(response.status).toBe(200);
      expect(data).toEqual(mockRates);
    });

    it('should filter by from currency', async () => {
      const mockRates = [
        { id: 1, date: '2024-07-24', from: 'USD', to: 'TWD', rate: 32.5 },
        { id: 3, date: '2024-07-24', from: 'USD', to: 'EUR', rate: 0.85 }
      ];

      vi.mocked(mockPrisma.prisma.rate.findMany).mockResolvedValue(mockRates);

      const request = new NextRequest('http://localhost:3000/api/rates-db?from=USD');
      const response = await GET(request);
      const data = await response.json();

      expect(mockPrisma.prisma.rate.findMany).toHaveBeenCalledWith({
        where: { from: 'USD' }
      });
      expect(response.status).toBe(200);
      expect(data).toEqual(mockRates);
    });

    it('should filter by to currency', async () => {
      const mockRates = [
        { id: 1, date: '2024-07-24', from: 'USD', to: 'TWD', rate: 32.5 },
        { id: 2, date: '2024-07-24', from: 'EUR', to: 'TWD', rate: 35.2 }
      ];

      vi.mocked(mockPrisma.prisma.rate.findMany).mockResolvedValue(mockRates);

      const request = new NextRequest('http://localhost:3000/api/rates-db?to=TWD');
      const response = await GET(request);
      const data = await response.json();

      expect(mockPrisma.prisma.rate.findMany).toHaveBeenCalledWith({
        where: { to: 'TWD' }
      });
      expect(response.status).toBe(200);
      expect(data).toEqual(mockRates);
    });

    it('should filter by date', async () => {
      const mockRates = [
        { id: 1, date: '2024-07-23', from: 'USD', to: 'TWD', rate: 31.8 }
      ];

      vi.mocked(mockPrisma.prisma.rate.findMany).mockResolvedValue(mockRates);

      const request = new NextRequest('http://localhost:3000/api/rates-db?date=2024-07-23');
      const response = await GET(request);
      const data = await response.json();

      expect(mockPrisma.prisma.rate.findMany).toHaveBeenCalledWith({
        where: { date: '2024-07-23' }
      });
      expect(response.status).toBe(200);
      expect(data).toEqual(mockRates);
    });

    it('should filter by multiple parameters', async () => {
      const mockRates = [
        { id: 1, date: '2024-07-24', from: 'USD', to: 'TWD', rate: 32.5 }
      ];

      vi.mocked(mockPrisma.prisma.rate.findMany).mockResolvedValue(mockRates);

      const request = new NextRequest('http://localhost:3000/api/rates-db?from=USD&to=TWD&date=2024-07-24');
      const response = await GET(request);
      const data = await response.json();

      expect(mockPrisma.prisma.rate.findMany).toHaveBeenCalledWith({
        where: {
          from: 'USD',
          to: 'TWD',
          date: '2024-07-24'
        }
      });
      expect(response.status).toBe(200);
      expect(data).toEqual(mockRates);
    });

    it('should return empty array when no rates match filters', async () => {
      vi.mocked(mockPrisma.prisma.rate.findMany).mockResolvedValue([]);

      const request = new NextRequest('http://localhost:3000/api/rates-db?from=GBP&to=CNY');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([]);
    });

    it('should handle database errors', async () => {
      vi.mocked(mockPrisma.prisma.rate.findMany).mockRejectedValue(new Error('Database query failed'));

      const request = new NextRequest('http://localhost:3000/api/rates-db');

      await expect(GET(request)).rejects.toThrow('Database query failed');
    });

    it('should ignore empty query parameters', async () => {
      const mockRates = [
        { id: 1, date: '2024-07-24', from: 'USD', to: 'TWD', rate: 32.5 }
      ];

      vi.mocked(mockPrisma.prisma.rate.findMany).mockResolvedValue(mockRates);

      const request = new NextRequest('http://localhost:3000/api/rates-db?from=&to=&date=');
      const response = await GET(request);

      expect(mockPrisma.prisma.rate.findMany).toHaveBeenCalledWith({ where: {} });
      expect(response.status).toBe(200);
    });
  });
});