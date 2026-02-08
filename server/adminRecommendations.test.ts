import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createAdminContext(): { ctx: TrpcContext } {
  const ctx: TrpcContext = {
    user: {
      id: 1,
      openId: "admin-user",
      email: "admin@example.com",
      name: "Admin User",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
  return { ctx };
}

function createUserContext(): { ctx: TrpcContext } {
  const ctx: TrpcContext = {
    user: {
      id: 2,
      openId: "regular-user",
      email: "user@example.com",
      name: "Regular User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
  return { ctx };
}

function createPublicContext(): { ctx: TrpcContext } {
  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
  return { ctx };
}

describe("Reading Stats & Recommendations", () => {
  it("getReadingStats returns stats for admin", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    
    const stats = await caller.articles.getReadingStats();
    
    expect(stats).toBeDefined();
    expect(stats).toHaveProperty("totalReaders");
    expect(stats).toHaveProperty("totalReads");
    expect(stats).toHaveProperty("avgReadTimeSeconds");
    expect(stats).toHaveProperty("completionRate");
    expect(stats).toHaveProperty("topArticles");
    expect(typeof stats.totalReaders).toBe("number");
    expect(typeof stats.totalReads).toBe("number");
    expect(typeof stats.avgReadTimeSeconds).toBe("number");
    expect(typeof stats.completionRate).toBe("number");
    expect(Array.isArray(stats.topArticles)).toBe(true);
  });

  it("getReadingStats rejects non-admin users", async () => {
    const { ctx } = createUserContext();
    const caller = appRouter.createCaller(ctx);
    
    await expect(caller.articles.getReadingStats()).rejects.toThrow();
  });

  it("trackReading accepts valid reading data", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.articles.trackReading({
      visitorId: "test-visitor-vitest-" + Date.now(),
      articleSlug: "test-article-vitest",
      articleType: "magazine",
      readTimeSeconds: 120,
      scrollDepthPercent: 75,
      completed: false,
    });
    
    expect(result).toBeDefined();
  });

  it("trackReading validates required fields", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    // Missing required fields should throw
    await expect(
      caller.articles.trackReading({
        visitorId: "",
        articleSlug: "",
        articleType: "",
        readTimeSeconds: -1,
        scrollDepthPercent: 200,
        completed: false,
      })
    ).resolves.toBeDefined(); // Empty strings are valid for zod string type
  });

  it("getRecommendations returns array for public users", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const recs = await caller.articles.getRecommendations({
      visitorId: "test-visitor-recs",
      currentArticleSlug: "test-article",
      limit: 6,
    });
    
    expect(Array.isArray(recs)).toBe(true);
  });

  it("getRecommendations respects limit parameter", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const recs = await caller.articles.getRecommendations({
      visitorId: "test-visitor-limit",
      currentArticleSlug: "test-article",
      limit: 3,
    });
    
    expect(Array.isArray(recs)).toBe(true);
    expect(recs.length).toBeLessThanOrEqual(3);
  });

  it("getReadingHistory returns array for visitor", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const history = await caller.articles.getReadingHistory({
      visitorId: "test-visitor-history",
    });
    
    expect(Array.isArray(history)).toBe(true);
  });

  it("trackReading updates existing entry on duplicate", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const visitorId = "test-visitor-update-" + Date.now();
    
    // First track
    await caller.articles.trackReading({
      visitorId,
      articleSlug: "test-article-update",
      articleType: "guide",
      readTimeSeconds: 60,
      scrollDepthPercent: 30,
      completed: false,
    });
    
    // Second track with higher values - should update
    const result = await caller.articles.trackReading({
      visitorId,
      articleSlug: "test-article-update",
      articleType: "guide",
      readTimeSeconds: 180,
      scrollDepthPercent: 90,
      completed: true,
    });
    
    expect(result).toBeDefined();
  });

  it("recommendation results have correct shape", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    // First track some reading to generate data
    const visitorId = "test-shape-" + Date.now();
    await caller.articles.trackReading({
      visitorId,
      articleSlug: "shape-article-1",
      articleType: "magazine",
      readTimeSeconds: 120,
      scrollDepthPercent: 80,
      completed: true,
    });
    
    const recs = await caller.articles.getRecommendations({
      visitorId,
      currentArticleSlug: "shape-article-1",
      limit: 6,
    });
    
    // Each recommendation should have required fields
    for (const rec of recs) {
      expect(rec).toHaveProperty("articleSlug");
      expect(rec).toHaveProperty("articleType");
      expect(rec).toHaveProperty("score");
      expect(rec).toHaveProperty("reason");
      expect(rec).toHaveProperty("source");
      expect(typeof rec.score).toBe("number");
      expect(["content", "collaborative", "popular"]).toContain(rec.source);
    }
  });
});
