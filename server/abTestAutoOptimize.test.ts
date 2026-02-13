import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the database module
vi.mock('./db', () => ({
  getDb: vi.fn(),
}));

describe('A/B Test Auto-Optimize', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should export autoOptimizeVariantWeights function', async () => {
    const { autoOptimizeVariantWeights } = await import('./abTestAutoOptimize');
    expect(typeof autoOptimizeVariantWeights).toBe('function');
  });

  it('should export getOptimizationStatus function', async () => {
    const { getOptimizationStatus } = await import('./abTestAutoOptimize');
    expect(typeof getOptimizationStatus).toBe('function');
  });

  it('should return not optimized when database is not available', async () => {
    const { getDb } = await import('./db');
    (getDb as any).mockResolvedValue(null);

    const { autoOptimizeVariantWeights } = await import('./abTestAutoOptimize');
    const result = await autoOptimizeVariantWeights();

    expect(result.optimized).toBe(false);
    expect(result.reason).toBe('Database not available');
  });

  it('should return optimization status with conversions needed', async () => {
    const { getDb } = await import('./db');
    (getDb as any).mockResolvedValue(null);

    const { getOptimizationStatus } = await import('./abTestAutoOptimize');
    const status = await getOptimizationStatus();

    expect(status.conversionsNeeded).toBe(100);
    expect(status.totalConversions).toBe(0);
    expect(status.isOptimized).toBe(false);
    expect(status.variants).toEqual([]);
  });
});
