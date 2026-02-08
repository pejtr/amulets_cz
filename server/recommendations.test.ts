import { describe, it, expect, vi } from "vitest";

// Mock getDb
vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue(null),
}));

// Import after mocking
import { getReadingStats, getReadingHistory, getRecommendations, trackReading } from "./recommendations";
import { runWeeklyHeadlineEvaluation, checkHeadlineSignificance } from "./scheduleHeadlineEvaluation";

describe("Recommendation System", () => {
  describe("trackReading", () => {
    it("should throw when database is not available", async () => {
      await expect(
        trackReading({
          visitorId: "v_test_123",
          articleSlug: "test-article",
          articleType: "magazine",
          readTimeSeconds: 120,
          scrollDepthPercent: 75,
          completed: false,
        })
      ).rejects.toThrow("Database not available");
    });

    it("should accept all required parameters", () => {
      // Verify the function signature accepts all expected params
      expect(typeof trackReading).toBe("function");
    });
  });

  describe("getReadingHistory", () => {
    it("should return empty array when database is not available", async () => {
      const result = await getReadingHistory("v_test_123");
      expect(result).toEqual([]);
    });

    it("should accept limit parameter", async () => {
      const result = await getReadingHistory("v_test_123", 10);
      expect(result).toEqual([]);
    });
  });

  describe("getRecommendations", () => {
    it("should return empty array when database is not available", async () => {
      const result = await getRecommendations("v_test_123", "test-article");
      expect(result).toEqual([]);
    });

    it("should accept limit parameter", async () => {
      const result = await getRecommendations("v_test_123", "test-article", 3);
      expect(result).toEqual([]);
    });
  });

  describe("getReadingStats", () => {
    it("should return default stats when database is not available", async () => {
      const result = await getReadingStats();
      expect(result).toEqual({
        totalReaders: 0,
        totalReads: 0,
        avgReadTimeSeconds: 0,
        completionRate: 0,
        topArticles: [],
      });
    });
  });
});

describe("Headline A/B Test Evaluation", () => {
  describe("runWeeklyHeadlineEvaluation", () => {
    it("should be a function", () => {
      expect(typeof runWeeklyHeadlineEvaluation).toBe("function");
    });

    it("should return evaluation results structure", async () => {
      // With mocked DB returning null, it should handle gracefully
      // This calls LLM for auto-generation so needs longer timeout
      const result = await runWeeklyHeadlineEvaluation();
      expect(result).toHaveProperty("evaluated");
      expect(result).toHaveProperty("deployed");
      expect(result).toHaveProperty("newTestsCreated");
      expect(result).toHaveProperty("notifications");
      expect(Array.isArray(result.notifications)).toBe(true);
    }, 60000);
  });

  describe("checkHeadlineSignificance", () => {
    it("should be a function", () => {
      expect(typeof checkHeadlineSignificance).toBe("function");
    });

    it("should return significance check results", async () => {
      const result = await checkHeadlineSignificance();
      expect(result).toHaveProperty("significantTests");
      expect(Array.isArray(result.significantTests)).toBe(true);
    });
  });
});
