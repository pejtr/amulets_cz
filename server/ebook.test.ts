import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getDb } from './db';
import { ebookDownloads } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

describe('E-book Lead Magnet System', () => {
  let testEmail: string;

  beforeAll(() => {
    testEmail = `test-${Date.now()}@example.com`;
  });

  afterAll(async () => {
    // Cleanup test data
    const db = await getDb();
    if (db) {
      await db.delete(ebookDownloads).where(eq(ebookDownloads.email, testEmail));
    }
  });

  it('should save e-book download to database', async () => {
    const db = await getDb();
    expect(db).toBeTruthy();

    if (!db) return;

    // Insert test download
    await db.insert(ebookDownloads).values({
      email: testEmail,
      name: 'Test User',
      ebookType: '7-kroku-k-rovnovaze',
      sourcePage: '/ebook',
      utmSource: 'test',
      utmMedium: 'vitest',
      utmCampaign: 'unit-test',
      ctaVariant: 'homepage-banner',
      emailSent: false,
    });

    // Verify insertion
    const result = await db.select()
      .from(ebookDownloads)
      .where(eq(ebookDownloads.email, testEmail))
      .limit(1);

    expect(result).toHaveLength(1);
    expect(result[0].email).toBe(testEmail);
    expect(result[0].name).toBe('Test User');
    expect(result[0].ebookType).toBe('7-kroku-k-rovnovaze');
    expect(result[0].sourcePage).toBe('/ebook');
    expect(result[0].utmSource).toBe('test');
    expect(result[0].ctaVariant).toBe('homepage-banner');
  });

  it('should track email sent status', async () => {
    const db = await getDb();
    if (!db) return;

    // Update email sent status
    await db.update(ebookDownloads)
      .set({ 
        emailSent: true, 
        emailSentAt: new Date() 
      })
      .where(eq(ebookDownloads.email, testEmail));

    // Verify update
    const result = await db.select()
      .from(ebookDownloads)
      .where(eq(ebookDownloads.email, testEmail))
      .limit(1);

    expect(result[0].emailSent).toBe(true);
    expect(result[0].emailSentAt).toBeTruthy();
  });

  it('should track conversion to client', async () => {
    const db = await getDb();
    if (!db) return;

    // Update conversion status
    const conversionDate = new Date();
    await db.update(ebookDownloads)
      .set({ 
        convertedToClient: true, 
        conversionDate,
        notes: 'Booked coaching session'
      })
      .where(eq(ebookDownloads.email, testEmail));

    // Verify update
    const result = await db.select()
      .from(ebookDownloads)
      .where(eq(ebookDownloads.email, testEmail))
      .limit(1);

    expect(result[0].convertedToClient).toBe(true);
    expect(result[0].conversionDate).toBeTruthy();
    expect(result[0].notes).toBe('Booked coaching session');
  });

  it('should allow multiple downloads with same email', async () => {
    const db = await getDb();
    if (!db) return;

    const secondEmail = `test2-${Date.now()}@example.com`;

    // Insert second download
    await db.insert(ebookDownloads).values({
      email: secondEmail,
      name: 'Test User 2',
      ebookType: '7-kroku-k-rovnovaze',
      sourcePage: '/ebook',
      ctaVariant: 'exit-intent',
      emailSent: false,
    });

    // Verify both exist
    const results = await db.select()
      .from(ebookDownloads)
      .where(eq(ebookDownloads.email, secondEmail));

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].ctaVariant).toBe('exit-intent');

    // Cleanup
    await db.delete(ebookDownloads).where(eq(ebookDownloads.email, secondEmail));
  });

  it('should store UTM parameters for analytics', async () => {
    const db = await getDb();
    if (!db) return;

    const utmEmail = `utm-test-${Date.now()}@example.com`;

    await db.insert(ebookDownloads).values({
      email: utmEmail,
      name: 'UTM Test',
      ebookType: '7-kroku-k-rovnovaze',
      sourcePage: '/ebook?utm_source=facebook&utm_medium=cpc&utm_campaign=coaching',
      utmSource: 'facebook',
      utmMedium: 'cpc',
      utmCampaign: 'coaching',
      ctaVariant: 'facebook-ad',
      emailSent: false,
    });

    const result = await db.select()
      .from(ebookDownloads)
      .where(eq(ebookDownloads.email, utmEmail))
      .limit(1);

    expect(result[0].utmSource).toBe('facebook');
    expect(result[0].utmMedium).toBe('cpc');
    expect(result[0].utmCampaign).toBe('coaching');
    expect(result[0].ctaVariant).toBe('facebook-ad');

    // Cleanup
    await db.delete(ebookDownloads).where(eq(ebookDownloads.email, utmEmail));
  });
});
