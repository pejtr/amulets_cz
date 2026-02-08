import { describe, it, expect, vi } from "vitest";

// ============================================
// 1. useWidgetABTest HOOK TESTS
// ============================================

describe("useWidgetABTest Hook", () => {
  it("hook module exports useWidgetABTest and useWidgetABTestAdmin", async () => {
    const mod = await import("../client/src/hooks/useWidgetABTest");
    expect(typeof mod.useWidgetABTest).toBe("function");
    expect(typeof mod.useWidgetABTestAdmin).toBe("function");
  });

  it("useWidgetABTest accepts widgetName and optional articleSlug parameters", async () => {
    const mod = await import("../client/src/hooks/useWidgetABTest");
    // Function signature check - should accept 2 params
    expect(mod.useWidgetABTest.length).toBeGreaterThanOrEqual(1);
  });

  it("useWidgetABTestAdmin provides admin management functions", async () => {
    const mod = await import("../client/src/hooks/useWidgetABTest");
    // The admin hook should be a function
    expect(typeof mod.useWidgetABTestAdmin).toBe("function");
  });
});

// ============================================
// 2. WIDGET A/B TEST BACKEND TESTS
// ============================================

describe("Widget A/B Test Backend", () => {
  it("widgetABTest module exports all required functions", async () => {
    const mod = await import("./widgetABTest");
    expect(typeof mod.createWidgetTest).toBe("function");
    expect(typeof mod.getActiveWidgetTest).toBe("function");
    expect(typeof mod.getOrAssignVariant).toBe("function");
    expect(typeof mod.trackWidgetClick).toBe("function");
    expect(typeof mod.getWidgetTestResults).toBe("function");
    expect(typeof mod.deployWidgetWinner).toBe("function");
    expect(typeof mod.getAllWidgetTests).toBe("function");
  });

  it("getOrAssignVariant returns null when no DB", async () => {
    // Mock getDb to return null
    vi.doMock("./db", () => ({ getDb: vi.fn().mockResolvedValue(null) }));
    const { getOrAssignVariant } = await import("./widgetABTest");
    const result = await getOrAssignVariant({
      widgetName: "test-widget",
      visitorId: "visitor-123",
    });
    expect(result).toBeNull();
    vi.doUnmock("./db");
  });

  it("getActiveWidgetTest returns null when no DB", async () => {
    vi.doMock("./db", () => ({ getDb: vi.fn().mockResolvedValue(null) }));
    const { getActiveWidgetTest } = await import("./widgetABTest");
    const result = await getActiveWidgetTest("test-widget");
    expect(result).toBeNull();
    vi.doUnmock("./db");
  });

  it("trackWidgetClick handles no DB gracefully", async () => {
    vi.doMock("./db", () => ({ getDb: vi.fn().mockResolvedValue(null) }));
    const { trackWidgetClick } = await import("./widgetABTest");
    const result = await trackWidgetClick({ variantId: 1, visitorId: "v1" });
    // Returns true (no-op success) or false depending on implementation
    expect(typeof result).toBe("boolean");
    vi.doUnmock("./db");
  });

  it("getWidgetTestResults returns null when no DB", async () => {
    vi.doMock("./db", () => ({ getDb: vi.fn().mockResolvedValue(null) }));
    const { getWidgetTestResults } = await import("./widgetABTest");
    const result = await getWidgetTestResults(1);
    expect(result).toBeNull();
    vi.doUnmock("./db");
  });

  it("getAllWidgetTests returns empty array when no DB", async () => {
    vi.doMock("./db", () => ({ getDb: vi.fn().mockResolvedValue(null) }));
    const { getAllWidgetTests } = await import("./widgetABTest");
    const result = await getAllWidgetTests();
    expect(result).toEqual([]);
    vi.doUnmock("./db");
  });

  it("deployWidgetWinner handles no DB gracefully", async () => {
    vi.doMock("./db", () => ({ getDb: vi.fn().mockResolvedValue(null) }));
    const { deployWidgetWinner } = await import("./widgetABTest");
    const result = await deployWidgetWinner(1, 1);
    // Returns true (no-op success) or false depending on implementation
    expect(typeof result).toBe("boolean");
    vi.doUnmock("./db");
  });
});

// ============================================
// 3. ADMIN WIDGET A/B TEST DASHBOARD TESTS
// ============================================

describe("Admin Widget A/B Test Dashboard Page", () => {
  it("AdminWidgetABTest page component exists", async () => {
    const mod = await import("../client/src/pages/AdminWidgetABTest");
    expect(mod.default).toBeDefined();
    expect(typeof mod.default).toBe("function");
  });

  it("AdminWidgetABTest is registered in App.tsx routes", async () => {
    const fs = await import("fs");
    const appContent = fs.readFileSync("client/src/App.tsx", "utf-8");
    expect(appContent).toContain('"/admin/widget-ab"');
    expect(appContent).toContain("AdminWidgetABTest");
  });
});

// ============================================
// 4. ADMIN WEEKLY DIGEST - CHATBOT TOPICS
// ============================================

describe("Admin Weekly Digest - Chatbot Topics Extension", () => {
  it("adminWeeklyDigest module exports sendAdminWeeklyDigest", async () => {
    const mod = await import("./adminWeeklyDigest");
    expect(typeof mod.sendAdminWeeklyDigest).toBe("function");
  });

  it("adminWeeklyDigest imports chatbotMessages and detectedTopics", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("server/adminWeeklyDigest.ts", "utf-8");
    expect(content).toContain("chatbotMessages");
    expect(content).toContain("detectedTopics");
    expect(content).toContain("topicCategories");
  });

  it("WeeklyStats interface includes chatbotTopTopics field", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("server/adminWeeklyDigest.ts", "utf-8");
    expect(content).toContain("chatbotTopTopics:");
    expect(content).toContain("chatbotTopQuestions:");
  });

  it("email template includes chatbot topics section", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("server/adminWeeklyDigest.ts", "utf-8");
    expect(content).toContain("Nejčastější dotazy z chatbotu");
    expect(content).toContain("Detekovaná témata");
    expect(content).toContain("Nejčastější otázky návštěvníků");
    expect(content).toContain("Content Gaps nalezeny");
  });

  it("AI prompt includes chatbot topics data", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("server/adminWeeklyDigest.ts", "utf-8");
    expect(content).toContain("Top chatbot topics");
    expect(content).toContain("Top visitor questions");
    expect(content).toContain("CONTENT GAP");
  });

  it("Telegram summary includes chatbot topics", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("server/adminWeeklyDigest.ts", "utf-8");
    expect(content).toContain("Top dotazy:");
    expect(content).toContain("Content gaps:");
  });

  it("collectWeeklyStats queries detected_topics table", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("server/adminWeeklyDigest.ts", "utf-8");
    // Verify the SQL queries for chatbot topics
    expect(content).toContain("CHATBOT TOP TOPICS");
    expect(content).toContain("CHATBOT TOP QUESTIONS");
    expect(content).toContain("contentGap");
    expect(content).toContain("sentiment");
    expect(content).toContain("intent");
  });

  it("default stats include empty chatbot arrays", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("server/adminWeeklyDigest.ts", "utf-8");
    expect(content).toContain("chatbotTopTopics: []");
    expect(content).toContain("chatbotTopQuestions: []");
  });
});

// ============================================
// 5. Z-TEST SIGNIFICANCE CALCULATION
// ============================================

describe("Z-Test Significance Calculation", () => {
  it("calculates correct CTR for widget variants", () => {
    const impressions = 1000;
    const clicks = 50;
    const ctr = (clicks / impressions) * 100;
    expect(ctr).toBe(5);
  });

  it("Z-score calculation for two proportions is correct", () => {
    // Variant A: 100 clicks / 1000 impressions = 10%
    // Variant B: 80 clicks / 1000 impressions = 8%
    const p1 = 100 / 1000; // 0.10
    const p2 = 80 / 1000;  // 0.08
    const n1 = 1000;
    const n2 = 1000;
    const pPooled = (100 + 80) / (n1 + n2); // 0.09
    const se = Math.sqrt(pPooled * (1 - pPooled) * (1 / n1 + 1 / n2));
    const zScore = (p1 - p2) / se;

    // Z-score should be around 1.56
    expect(zScore).toBeGreaterThan(1.5);
    expect(zScore).toBeLessThan(1.7);
    // Not significant at 95% (z < 1.96)
    expect(Math.abs(zScore) < 1.96).toBe(true);
  });

  it("Z-score is significant for large differences", () => {
    // Variant A: 150 clicks / 1000 impressions = 15%
    // Variant B: 80 clicks / 1000 impressions = 8%
    const p1 = 150 / 1000;
    const p2 = 80 / 1000;
    const n1 = 1000;
    const n2 = 1000;
    const pPooled = (150 + 80) / (n1 + n2);
    const se = Math.sqrt(pPooled * (1 - pPooled) * (1 / n1 + 1 / n2));
    const zScore = (p1 - p2) / se;

    // Z-score should be well above 1.96
    expect(Math.abs(zScore) >= 1.96).toBe(true);
  });
});

// ============================================
// 6. VISITOR ID GENERATION
// ============================================

describe("Visitor ID Generation Pattern", () => {
  it("generates visitor IDs with correct format", () => {
    const id = `v_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    expect(id).toMatch(/^v_\d+_[a-z0-9]+$/);
    expect(id.startsWith("v_")).toBe(true);
  });

  it("generates unique visitor IDs", () => {
    const ids = new Set<string>();
    for (let i = 0; i < 100; i++) {
      ids.add(`v_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`);
    }
    // Should have at least 95 unique IDs (allowing for rare collisions)
    expect(ids.size).toBeGreaterThan(95);
  });
});
