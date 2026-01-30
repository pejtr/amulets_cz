import { describe, it, expect, beforeAll } from 'vitest';
import { appRouter } from './routers';
import type { TrpcContext } from './_core/trpc';

describe('Chatbot Analytics', () => {
  const mockContext: TrpcContext = {
    user: null,
    req: {} as any,
    res: {} as any,
  };

  const caller = appRouter.createCaller(mockContext);

  describe('getStats', () => {
    it('should return analytics statistics', async () => {
      const result = await caller.chatbotAnalytics.getStats({});
      
      expect(result).toHaveProperty('totalConversations');
      expect(result).toHaveProperty('totalMessages');
      expect(result).toHaveProperty('avgMessagesPerConversation');
      expect(result).toHaveProperty('topUsers');
      
      expect(typeof result.totalConversations).toBe('number');
      expect(typeof result.totalMessages).toBe('number');
      expect(typeof result.avgMessagesPerConversation).toBe('number');
      expect(Array.isArray(result.topUsers)).toBe(true);
    });

    it('should accept date filters', async () => {
      const result = await caller.chatbotAnalytics.getStats({
        startDate: '2026-01-01',
        endDate: '2026-12-31',
      });
      
      expect(result).toHaveProperty('totalConversations');
      expect(typeof result.totalConversations).toBe('number');
    });
  });

  describe('getRecentConversations', () => {
    it('should return recent conversations', async () => {
      const result = await caller.chatbotAnalytics.getRecentConversations({
        limit: 5,
        offset: 0,
      });
      
      expect(Array.isArray(result)).toBe(true);
      
      if (result.length > 0) {
        const conversation = result[0];
        expect(conversation).toHaveProperty('id');
        expect(conversation).toHaveProperty('userId');
        expect(conversation).toHaveProperty('messageCount');
        expect(conversation).toHaveProperty('lastMessageAt');
      }
    });

    it('should respect limit parameter', async () => {
      const result = await caller.chatbotAnalytics.getRecentConversations({
        limit: 3,
        offset: 0,
      });
      
      expect(result.length).toBeLessThanOrEqual(3);
    });
  });

  describe('getPopularTopics', () => {
    it('should return popular topics', async () => {
      const result = await caller.chatbotAnalytics.getPopularTopics();
      
      expect(Array.isArray(result)).toBe(true);
      
      if (result.length > 0) {
        const topic = result[0];
        expect(topic).toHaveProperty('word');
        expect(topic).toHaveProperty('count');
        expect(typeof topic.word).toBe('string');
        expect(typeof topic.count).toBe('number');
      }
    });

    it('should return topics sorted by frequency', async () => {
      const result = await caller.chatbotAnalytics.getPopularTopics();
      
      if (result.length > 1) {
        // Check that counts are in descending order
        for (let i = 0; i < result.length - 1; i++) {
          expect(result[i].count).toBeGreaterThanOrEqual(result[i + 1].count);
        }
      }
    });
  });
});
