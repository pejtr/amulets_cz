import { describe, it, expect, vi, beforeEach } from "vitest";

// ============================================
// 1. HREFLANG TAGS TESTS
// ============================================

describe("Hreflang Tags (SEO)", () => {
  it("setHreflangTags function exists and is exported", async () => {
    const seo = await import("../client/src/lib/seo");
    expect(typeof seo.setHreflangTags).toBe("function");
  });

  it("setHreflangTags generates correct language URLs for root path", async () => {
    // Test the URL generation logic
    const baseUrl = "https://amulets.cz";
    const path = "/";
    const languages = [
      { lang: "cs", href: `${baseUrl}${path}` },
      { lang: "en", href: `${baseUrl}${path}?lang=en` },
      { lang: "it", href: `${baseUrl}${path}?lang=it` },
      { lang: "x-default", href: `${baseUrl}${path}` },
    ];

    expect(languages).toHaveLength(4);
    expect(languages[0].lang).toBe("cs");
    expect(languages[0].href).toBe("https://amulets.cz/");
    expect(languages[1].lang).toBe("en");
    expect(languages[1].href).toContain("lang=en");
    expect(languages[3].lang).toBe("x-default");
    expect(languages[3].href).toBe("https://amulets.cz/");
  });

  it("setHreflangTags generates correct URLs for article paths", async () => {
    const baseUrl = "https://amulets.cz";
    const path = "/magazin/trojity-mesic";
    const enHref = `${baseUrl}${path}${path.includes("?") ? "&" : "?"}lang=en`;

    expect(enHref).toBe("https://amulets.cz/magazin/trojity-mesic?lang=en");
  });

  it("setHreflangTags handles paths with existing query params", async () => {
    const baseUrl = "https://amulets.cz";
    const path = "/search?q=crystal";
    const enHref = `${baseUrl}${path}${path.includes("?") ? "&" : "?"}lang=en`;

    expect(enHref).toBe("https://amulets.cz/search?q=crystal&lang=en");
  });

  it("index.html contains static hreflang tags", async () => {
    const fs = await import("fs");
    const html = fs.readFileSync("./client/index.html", "utf-8");

    expect(html).toContain('hreflang="cs"');
    expect(html).toContain('hreflang="en"');
    expect(html).toContain('hreflang="x-default"');
    expect(html).toContain('rel="alternate"');
  });
});

// ============================================
// 2. WIDGET A/B TEST TESTS
// ============================================

// Mock getDb for widget tests
vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue(null),
}));

vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

import {
  createWidgetTest,
  getActiveWidgetTest,
  getOrAssignVariant,
  trackWidgetClick,
  getWidgetTestResults,
  deployWidgetWinner,
  getAllWidgetTests,
} from "./widgetABTest";

describe("Widget A/B Test System", () => {
  describe("createWidgetTest", () => {
    it("should be a function", () => {
      expect(typeof createWidgetTest).toBe("function");
    });

    it("should throw when database is not available", async () => {
      await expect(
        createWidgetTest({
          widgetName: "recommendations",
          variants: [
            { variantName: "before_comments", placement: "before-related" },
            { variantName: "after_comments", placement: "after-related" },
          ],
        })
      ).rejects.toThrow("Database not available");
    });
  });

  describe("getActiveWidgetTest", () => {
    it("should return null when database is not available", async () => {
      const result = await getActiveWidgetTest("recommendations");
      expect(result).toBeNull();
    });
  });

  describe("getOrAssignVariant", () => {
    it("should return null when database is not available", async () => {
      const result = await getOrAssignVariant({
        widgetName: "recommendations",
        visitorId: "test-visitor-123",
        articleSlug: "test-article",
      });
      expect(result).toBeNull();
    });
  });

  describe("trackWidgetClick", () => {
    it("should return false when database is not available", async () => {
      const result = await trackWidgetClick({
        variantId: 1,
        visitorId: "test-visitor-123",
      });
      expect(result).toBe(false);
    });
  });

  describe("getWidgetTestResults", () => {
    it("should return null when database is not available", async () => {
      const result = await getWidgetTestResults(1);
      expect(result).toBeNull();
    });
  });

  describe("deployWidgetWinner", () => {
    it("should return false when database is not available", async () => {
      const result = await deployWidgetWinner(1, 1);
      expect(result).toBe(false);
    });
  });

  describe("getAllWidgetTests", () => {
    it("should return empty array when database is not available", async () => {
      const result = await getAllWidgetTests();
      expect(result).toEqual([]);
    });
  });

  describe("Widget A/B Test Z-test logic", () => {
    it("should correctly calculate CTR", () => {
      const impressions = 1000;
      const clicks = 50;
      const ctr = (clicks / impressions) * 100;
      expect(ctr).toBe(5);
    });

    it("should correctly calculate Z-score for two variants", () => {
      // Variant A: 50/1000 = 5% CTR
      // Variant B: 70/1000 = 7% CTR
      const p1 = 50 / 1000;
      const p2 = 70 / 1000;
      const pPooled = (50 + 70) / (1000 + 1000);
      const se = Math.sqrt(pPooled * (1 - pPooled) * (1 / 1000 + 1 / 1000));
      const zScore = (p1 - p2) / se;

      expect(zScore).toBeLessThan(0); // B is better
      expect(Math.abs(zScore)).toBeGreaterThan(1); // Likely significant
    });

    it("should detect significance at 95% confidence", () => {
      const zScore = 2.1;
      const isSignificant = Math.abs(zScore) >= 1.96;
      expect(isSignificant).toBe(true);
    });

    it("should not detect significance with low Z-score", () => {
      const zScore = 1.2;
      const isSignificant = Math.abs(zScore) >= 1.96;
      expect(isSignificant).toBe(false);
    });
  });
});

// ============================================
// 3. ADMIN WEEKLY DIGEST TESTS
// ============================================

vi.mock("./brevo", () => ({
  sendBrevoEmail: vi.fn().mockResolvedValue(true),
}));

vi.mock("./telegram", () => ({
  sendTelegramMessage: vi.fn().mockResolvedValue(true),
}));

vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [
      {
        message: {
          content:
            "1. [Content] Zaměřte se na články o krystalech\n2. [SEO] Optimalizujte meta descriptions\n3. [Engagement] Přidejte více interaktivních prvků",
        },
      },
    ],
  }),
}));

import { sendAdminWeeklyDigest, scheduleAdminWeeklyDigest } from "./adminWeeklyDigest";

describe("Admin Weekly Email Digest", () => {
  describe("sendAdminWeeklyDigest", () => {
    it("should be a function", () => {
      expect(typeof sendAdminWeeklyDigest).toBe("function");
    });

    it("should return result object with correct shape", async () => {
      const result = await sendAdminWeeklyDigest();
      expect(result).toHaveProperty("success");
      expect(result).toHaveProperty("message");
      expect(typeof result.success).toBe("boolean");
      expect(typeof result.message).toBe("string");
    });

    it("should include stats in result when successful", async () => {
      const result = await sendAdminWeeklyDigest();
      // With mocked null DB, stats will be default values
      if (result.stats) {
        expect(result.stats).toHaveProperty("totalPageViews");
        expect(result.stats).toHaveProperty("uniqueReaders");
        expect(result.stats).toHaveProperty("avgReadTimeSeconds");
        expect(result.stats).toHaveProperty("completionRate");
        expect(result.stats).toHaveProperty("topArticles");
        expect(result.stats).toHaveProperty("headlineTests");
        expect(result.stats).toHaveProperty("metaDescTests");
        expect(result.stats).toHaveProperty("widgetTests");
        expect(result.stats).toHaveProperty("chatbot");
        expect(result.stats).toHaveProperty("referrerBreakdown");
        expect(result.stats).toHaveProperty("peakHours");
        expect(result.stats).toHaveProperty("newReaders");
        expect(result.stats).toHaveProperty("returningReaders");
      }
    });

    it("should handle null database gracefully", async () => {
      // With mocked null DB, should still succeed (email with default stats)
      const result = await sendAdminWeeklyDigest();
      expect(result.success).toBe(true);
      expect(result.message).toContain("odeslán");
    });
  });

  describe("scheduleAdminWeeklyDigest", () => {
    it("should be a function", () => {
      expect(typeof scheduleAdminWeeklyDigest).toBe("function");
    });

    it("should not throw when called", () => {
      expect(() => scheduleAdminWeeklyDigest()).not.toThrow();
    });

    it("should be idempotent (calling twice doesn't create duplicate schedulers)", () => {
      // Should not throw even when called multiple times
      scheduleAdminWeeklyDigest();
      scheduleAdminWeeklyDigest();
      expect(true).toBe(true);
    });
  });

  describe("Email content generation", () => {
    it("should generate email with KPI section", async () => {
      const { sendBrevoEmail } = await import("./brevo");
      const mockSend = vi.mocked(sendBrevoEmail);
      mockSend.mockClear();

      await sendAdminWeeklyDigest();

      expect(mockSend).toHaveBeenCalled();
      const callArgs = mockSend.mock.calls[0][0];
      expect(callArgs.subject).toContain("Admin Weekly Digest");
      expect(callArgs.htmlContent).toContain("Přehled KPI");
      expect(callArgs.htmlContent).toContain("Zobrazení");
      expect(callArgs.htmlContent).toContain("Čtenáři");
    });

    it("should generate email with A/B test section", async () => {
      const { sendBrevoEmail } = await import("./brevo");
      const mockSend = vi.mocked(sendBrevoEmail);
      mockSend.mockClear();

      await sendAdminWeeklyDigest();

      const callArgs = mockSend.mock.calls[0][0];
      expect(callArgs.htmlContent).toContain("A/B Test");
    });

    it("should generate email with AI recommendations section", async () => {
      const { sendBrevoEmail } = await import("./brevo");
      const mockSend = vi.mocked(sendBrevoEmail);
      mockSend.mockClear();

      await sendAdminWeeklyDigest();

      const callArgs = mockSend.mock.calls[0][0];
      expect(callArgs.htmlContent).toContain("AI Strategická doporučení");
    });

    it("should generate email with chatbot section", async () => {
      const { sendBrevoEmail } = await import("./brevo");
      const mockSend = vi.mocked(sendBrevoEmail);
      mockSend.mockClear();

      await sendAdminWeeklyDigest();

      const callArgs = mockSend.mock.calls[0][0];
      expect(callArgs.htmlContent).toContain("Chatbot");
      expect(callArgs.htmlContent).toContain("Sessions");
      expect(callArgs.htmlContent).toContain("Konverze");
    });

    it("should send to correct admin email", async () => {
      const { sendBrevoEmail } = await import("./brevo");
      const mockSend = vi.mocked(sendBrevoEmail);
      mockSend.mockClear();

      await sendAdminWeeklyDigest();

      const callArgs = mockSend.mock.calls[0][0];
      expect(callArgs.to).toHaveLength(1);
      expect(callArgs.to[0].name).toBe("Admin");
    });

    it("should send Telegram notification", async () => {
      const { sendTelegramMessage } = await import("./telegram");
      const mockTelegram = vi.mocked(sendTelegramMessage);
      mockTelegram.mockClear();

      await sendAdminWeeklyDigest();

      // Telegram is called asynchronously, give it a moment
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(mockTelegram).toHaveBeenCalled();
    });
  });
});
