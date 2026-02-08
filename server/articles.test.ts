import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user-1",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user-1",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("articles", () => {
  describe("articles.trackView", () => {
    it("should track a view and return a viewId", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.articles.trackView({
        articleSlug: "test-article",
        articleType: "magazine",
        visitorId: "v_test_123",
        device: "desktop|windows|chrome|1920x1080|dpr1|landscape|4g|mouse",
      });

      expect(result).toHaveProperty("viewId");
      expect(typeof result.viewId).toBe("number");
    });

    it("should accept mobile device string with extended info", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.articles.trackView({
        articleSlug: "test-article-mobile",
        articleType: "guide",
        visitorId: "v_test_mobile_1",
        referrer: "https://google.com",
        sourcePage: "/magazin",
        device: "mobile|android|chrome|375x812|dpr3|portrait|4g|touch",
      });

      expect(result).toHaveProperty("viewId");
    });
  });

  describe("articles.updateEngagement", () => {
    it("should update basic engagement metrics", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const view = await caller.articles.trackView({
        articleSlug: "test-engagement-article",
        articleType: "magazine",
        visitorId: "v_engagement_test_1",
      });

      const result = await caller.articles.updateEngagement({
        viewId: view.viewId,
        readTimeSeconds: 120,
        scrollDepthPercent: 85,
      });

      expect(result).toEqual({ success: true });
    });

    it("should update extended mobile engagement metrics", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const view = await caller.articles.trackView({
        articleSlug: "test-mobile-engagement",
        articleType: "magazine",
        visitorId: "v_mobile_engagement_1",
        device: "mobile|ios|safari|390x844|dpr3|portrait|4g|touch",
      });

      const result = await caller.articles.updateEngagement({
        viewId: view.viewId,
        readTimeSeconds: 180,
        scrollDepthPercent: 92,
        activeReadTimeSeconds: 145,
        interactionCount: 23,
        orientationChanges: 2,
      });

      expect(result).toEqual({ success: true });
    });
  });

  describe("articles.getStats", () => {
    it("should return stats structure for an article", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.articles.getStats({
        articleSlug: "test-article",
      });

      expect(result).toHaveProperty("views");
      expect(result).toHaveProperty("ratings");
      expect(result).toHaveProperty("comments");
      expect(result.views).toHaveProperty("total");
      expect(result.views).toHaveProperty("uniqueVisitors");
      expect(result.ratings).toHaveProperty("average");
      expect(result.ratings).toHaveProperty("total");
      expect(result.comments).toHaveProperty("total");
    });

    it("should return zeros for non-existent article", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.articles.getStats({
        articleSlug: "non-existent-article-xyz",
      });

      expect(result.ratings.total).toBe(0);
      expect(result.comments.total).toBe(0);
    });
  });

  describe("articles.rate", () => {
    it("should rate an article", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.articles.rate({
        articleSlug: "test-rate-article",
        articleType: "magazine",
        visitorId: "v_rate_test_1",
        rating: 4,
      });

      expect(result).toHaveProperty("id");
      expect(typeof result.id).toBe("number");
    });

    it("should update existing rating (upsert)", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await caller.articles.rate({
        articleSlug: "test-upsert-article",
        articleType: "magazine",
        visitorId: "v_upsert_test_1",
        rating: 3,
      });

      const result = await caller.articles.rate({
        articleSlug: "test-upsert-article",
        articleType: "magazine",
        visitorId: "v_upsert_test_1",
        rating: 5,
      });

      expect(result).toHaveProperty("updated", true);
    });
  });

  describe("articles.getMyRating", () => {
    it("should return null for unrated article", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.articles.getMyRating({
        articleSlug: "unrated-article-xyz",
        visitorId: "v_no_rating",
      });

      expect(result.rating).toBeNull();
    });
  });

  describe("articles.addComment", () => {
    it("should add a comment as anonymous user (AI moderation decides)", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.articles.addComment({
        articleSlug: "test-comment-article",
        articleType: "magazine",
        visitorId: "v_comment_test_1",
        authorName: "Test User",
        content: "Skvělý článek, moc děkuji!",
      });

      expect(result).toHaveProperty("id");
      // AI moderation may auto-approve quality comments
      expect(typeof result.autoApproved).toBe("boolean");
    });

    it("should auto-approve comment for logged-in user", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.articles.addComment({
        articleSlug: "test-comment-article-2",
        articleType: "guide",
        authorName: "Test User",
        content: "Přihlášený komentář",
      });

      expect(result).toHaveProperty("id");
      expect(result.autoApproved).toBe(true);
    });
  });

  describe("articles.getComments", () => {
    it("should return comments array", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.articles.getComments({
        articleSlug: "test-comment-article",
      });

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("articles.getPendingComments", () => {
    it("should deny access for non-admin users", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(caller.articles.getPendingComments()).rejects.toThrow();
    });

    it("should allow access for admin users", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.articles.getPendingComments();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("articles.getAllComments", () => {
    it("should deny access for non-admin users", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(caller.articles.getAllComments()).rejects.toThrow();
    });

    it("should allow access for admin users and return array", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.articles.getAllComments();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("articles.getEngagementHeatmap", () => {
    it("should deny access for non-admin users", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(caller.articles.getEngagementHeatmap({ days: 7 })).rejects.toThrow();
    });

    it("should return heatmap data for admin users", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.articles.getEngagementHeatmap({ days: 30 });
      expect(Array.isArray(result)).toBe(true);
    });

    it("should work with default days parameter", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.articles.getEngagementHeatmap();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("articles.moderateComment", () => {
    it("should deny access for non-admin users", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.articles.moderateComment({
          commentId: 1,
          status: "approved",
        })
      ).rejects.toThrow();
    });
  });

  describe("articles.getTopArticles", () => {
    it("should return top articles array", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.articles.getTopArticles({
        days: 7,
        limit: 5,
      });

      expect(Array.isArray(result)).toBe(true);
    });
  });

  // ============================================
  // HEADLINE A/B TESTING
  // ============================================

  describe("articles.getHeadlineVariant", () => {
    it("should return null for article without test", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.articles.getHeadlineVariant({
        articleSlug: "no-test-article",
        visitorId: "v_headline_1",
      });

      expect(result).toBeNull();
    });
  });

  describe("articles.createHeadlineTest", () => {
    it("should deny access for non-admin users", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.articles.createHeadlineTest({
          articleSlug: "test-headline-article",
          variants: [
            { variantKey: "control", headline: "Original Title", isControl: true },
            { variantKey: "variant-b", headline: "Better Title" },
          ],
        })
      ).rejects.toThrow();
    });

    it("should create headline test for admin", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.articles.createHeadlineTest({
        articleSlug: "test-headline-create",
        articleType: "magazine",
        variants: [
          { variantKey: "control", headline: "Původní titulek", isControl: true },
          { variantKey: "variant-b", headline: "Lepší titulek" },
        ],
      });

      expect(result).toBe(true);
    });
  });

  describe("articles.getHeadlineTestResults", () => {
    it("should deny access for non-admin users", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(caller.articles.getHeadlineTestResults()).rejects.toThrow();
    });

    it("should return results for admin", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.articles.getHeadlineTestResults();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("articles.trackHeadlineClick", () => {
    it("should track a headline click", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.articles.trackHeadlineClick({
        articleSlug: "test-headline-click",
        visitorId: "v_headline_click_1",
      });

      // Returns true or false depending on whether assignment exists
      expect(typeof result).toBe("boolean");
    });
  });

  describe("articles.updateHeadlineEngagement", () => {
    it("should update headline engagement metrics", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.articles.updateHeadlineEngagement({
        articleSlug: "test-headline-engagement",
        visitorId: "v_headline_eng_1",
        readTimeSeconds: 120,
        scrollDepthPercent: 85,
        completed: true,
      });

      expect(typeof result).toBe("boolean");
    });
  });

  describe("articles.getActiveHeadlineTests", () => {
    it("should return array of article slugs with active tests", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.articles.getActiveHeadlineTests();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  // ============================================
  // AUTO-EVALUATE & DEPLOY
  // ============================================

  describe("articles.evaluateTests", () => {
    it("should deny access for non-admin users", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(caller.articles.evaluateTests()).rejects.toThrow();
    });

    it("should return evaluation results for admin", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.articles.evaluateTests();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("articles.deployWinner", () => {
    it("should deny access for non-admin users", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.articles.deployWinner({
          articleSlug: "test-deploy",
          winnerVariantKey: "control",
        })
      ).rejects.toThrow();
    });

    it("should return error for non-existent variant", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.articles.deployWinner({
        articleSlug: "non-existent-slug",
        winnerVariantKey: "non-existent-variant",
      });

      expect(result.success).toBe(false);
    });
  });

  describe("articles.autoEvaluateAndDeploy", () => {
    it("should deny access for non-admin users", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(caller.articles.autoEvaluateAndDeploy()).rejects.toThrow();
    });

    it("should return deployment results for admin", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.articles.autoEvaluateAndDeploy();
      expect(result).toHaveProperty("evaluated");
      expect(result).toHaveProperty("deployed");
      expect(result).toHaveProperty("results");
      expect(Array.isArray(result.results)).toBe(true);
    });
  });
});
