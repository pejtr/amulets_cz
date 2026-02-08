import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock dependencies before importing the module
vi.mock("./metaDescABTest", () => ({
  autoEvaluateAndDeployMetaDesc: vi.fn(),
  evaluateMetaDescTests: vi.fn(),
  getActiveMetaDescTests: vi.fn(),
  getMetaDescTestResults: vi.fn(),
}));

vi.mock("./telegram", () => ({
  sendTelegramMessage: vi.fn().mockResolvedValue(true),
}));

vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

import {
  runWeeklyMetaDescEvaluation,
  checkForSignificantResults,
  getPerformanceSnapshot,
} from "./scheduleMetaDescEvaluation";

import {
  autoEvaluateAndDeployMetaDesc,
  evaluateMetaDescTests,
  getActiveMetaDescTests,
  getMetaDescTestResults,
} from "./metaDescABTest";

import { sendTelegramMessage } from "./telegram";
import { notifyOwner } from "./_core/notification";

describe("scheduleMetaDescEvaluation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("runWeeklyMetaDescEvaluation", () => {
    it("returns success with zero counts when no active tests", async () => {
      vi.mocked(getActiveMetaDescTests).mockResolvedValue([]);

      const result = await runWeeklyMetaDescEvaluation();

      expect(result.success).toBe(true);
      expect(result.evaluated).toBe(0);
      expect(result.deployed).toBe(0);
      expect(result.message).toContain("Žádné aktivní");
    });

    it("evaluates and deploys when active tests exist", async () => {
      vi.mocked(getActiveMetaDescTests).mockResolvedValue(["article-1", "article-2"]);
      vi.mocked(autoEvaluateAndDeployMetaDesc).mockResolvedValue({
        evaluated: 2,
        deployed: 1,
        results: [
          { articleSlug: "article-1", winner: "variant-b", confidence: 97, deployed: true },
          { articleSlug: "article-2", winner: "control", confidence: 92, deployed: false },
        ],
      });

      const result = await runWeeklyMetaDescEvaluation();

      expect(result.success).toBe(true);
      expect(result.evaluated).toBe(2);
      expect(result.deployed).toBe(1);
      expect(autoEvaluateAndDeployMetaDesc).toHaveBeenCalledWith(50, 0.90);
      expect(sendTelegramMessage).toHaveBeenCalled();
      expect(notifyOwner).toHaveBeenCalled();
    });

    it("handles errors gracefully", async () => {
      vi.mocked(getActiveMetaDescTests).mockRejectedValue(new Error("DB connection failed"));

      const result = await runWeeklyMetaDescEvaluation();

      expect(result.success).toBe(false);
      expect(result.evaluated).toBe(0);
      expect(result.deployed).toBe(0);
    });

    it("sends Telegram notification with report", async () => {
      vi.mocked(getActiveMetaDescTests).mockResolvedValue(["article-1"]);
      vi.mocked(autoEvaluateAndDeployMetaDesc).mockResolvedValue({
        evaluated: 1,
        deployed: 1,
        results: [{ articleSlug: "article-1", winner: "variant-b", confidence: 98, deployed: true }],
      });

      await runWeeklyMetaDescEvaluation();

      const telegramCall = vi.mocked(sendTelegramMessage).mock.calls[0][0];
      expect(telegramCall).toContain("Týdenní vyhodnocení");
      expect(telegramCall).toContain("article-1");
    });
  });

  describe("checkForSignificantResults", () => {
    it("does nothing when no significant results", async () => {
      vi.mocked(evaluateMetaDescTests).mockResolvedValue([]);

      await checkForSignificantResults();

      expect(sendTelegramMessage).not.toHaveBeenCalled();
    });

    it("sends notification for new significant result", async () => {
      vi.mocked(evaluateMetaDescTests).mockResolvedValue([
        {
          articleSlug: "new-significant-article",
          winner: { variantKey: "variant-b", metaDescription: "Better desc", ctr: 12.5, completionRate: 65, confidence: 97 },
          loser: { variantKey: "control", metaDescription: "Original desc", ctr: 8.2, completionRate: 45 },
          recommendation: "Deploy variant-b",
        },
      ]);

      await checkForSignificantResults();

      expect(sendTelegramMessage).toHaveBeenCalled();
      const msg = vi.mocked(sendTelegramMessage).mock.calls[0][0];
      expect(msg).toContain("Statisticky signifikantní");
      expect(msg).toContain("new-significant-article");
    });

    it("does not re-notify for already notified articles", async () => {
      const mockResult = {
        articleSlug: "already-notified-article-unique",
        winner: { variantKey: "variant-b", metaDescription: "Better", ctr: 15, completionRate: 70, confidence: 99 },
        loser: { variantKey: "control", metaDescription: "Original", ctr: 8, completionRate: 40 },
        recommendation: "Deploy",
      };

      vi.mocked(evaluateMetaDescTests).mockResolvedValue([mockResult]);

      // First call - should notify
      await checkForSignificantResults();
      expect(sendTelegramMessage).toHaveBeenCalledTimes(1);

      vi.clearAllMocks();

      // Second call - same article, should NOT notify again
      vi.mocked(evaluateMetaDescTests).mockResolvedValue([mockResult]);
      await checkForSignificantResults();
      expect(sendTelegramMessage).not.toHaveBeenCalled();
    });

    it("handles errors silently", async () => {
      vi.mocked(evaluateMetaDescTests).mockRejectedValue(new Error("DB error"));

      // Should not throw
      await expect(checkForSignificantResults()).resolves.toBeUndefined();
    });
  });

  describe("getPerformanceSnapshot", () => {
    it("returns formatted snapshot data", async () => {
      vi.mocked(getMetaDescTestResults).mockResolvedValue([
        {
          articleSlug: "test-article",
          articleType: "magazine",
          variantKey: "control",
          metaDescription: "Test desc",
          isControl: true,
          isActive: true,
          impressions: 100,
          clicks: 10,
          ctr: 10,
          avgReadTime: 45,
          avgScrollDepth: 75,
          completionRate: 60,
        },
        {
          articleSlug: "test-article",
          articleType: "magazine",
          variantKey: "variant-b",
          metaDescription: "Better desc",
          isControl: false,
          isActive: true,
          impressions: 100,
          clicks: 15,
          ctr: 15,
          avgReadTime: 55,
          avgScrollDepth: 85,
          completionRate: 70,
        },
      ]);

      const snapshot = await getPerformanceSnapshot();

      expect(snapshot).toHaveLength(2);
      expect(snapshot[0].articleSlug).toBe("test-article");
      expect(snapshot[0].variantKey).toBe("control");
      expect(snapshot[0].impressions).toBe(100);
      expect(snapshot[0].clicks).toBe(10);
      expect(snapshot[0].ctr).toBeCloseTo(10, 0);
      expect(snapshot[0].completionRate).toBe(60);
      expect(snapshot[0].timestamp).toBeGreaterThan(0);

      expect(snapshot[1].variantKey).toBe("variant-b");
      expect(snapshot[1].ctr).toBeCloseTo(15, 0);
    });

    it("returns empty array when no results", async () => {
      vi.mocked(getMetaDescTestResults).mockResolvedValue([]);

      const snapshot = await getPerformanceSnapshot();

      expect(snapshot).toHaveLength(0);
    });

    it("handles zero impressions gracefully", async () => {
      vi.mocked(getMetaDescTestResults).mockResolvedValue([
        {
          articleSlug: "new-article",
          articleType: "guide",
          variantKey: "control",
          metaDescription: "Desc",
          isControl: true,
          isActive: true,
          impressions: 0,
          clicks: 0,
          ctr: 0,
          avgReadTime: 0,
          avgScrollDepth: 0,
          completionRate: 0,
        },
      ]);

      const snapshot = await getPerformanceSnapshot();

      expect(snapshot[0].ctr).toBe(0);
      expect(snapshot[0].completionRate).toBe(0);
    });
  });
});
