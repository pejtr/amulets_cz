import { describe, expect, it, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

/**
 * Meta Description A/B Testing - Integration Tests
 * 
 * Tests the tRPC procedures for meta description A/B testing:
 * - createMetaDescTest
 * - getMetaDescVariant
 * - trackMetaDescClick
 * - updateMetaDescEngagement
 * - getMetaDescTestResults
 * - getActiveMetaDescTests
 */

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-test-user",
    email: "admin@amulets.cz",
    name: "Admin Test",
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

const TEST_SLUG = `meta-desc-test-${Date.now()}`;
const TEST_VISITOR = `visitor-test-${Date.now()}`;

describe("Meta Description A/B Testing", () => {
  let adminCaller: ReturnType<typeof appRouter.createCaller>;
  let publicCaller: ReturnType<typeof appRouter.createCaller>;

  beforeAll(() => {
    adminCaller = appRouter.createCaller(createAdminContext());
    publicCaller = appRouter.createCaller(createPublicContext());
  });

  describe("createMetaDescTest", () => {
    it("creates a meta description A/B test with variants", async () => {
      const result = await adminCaller.articles.createMetaDescTest({
        articleSlug: TEST_SLUG,
        articleType: "magazine",
        variants: [
          { variantKey: "control", metaDescription: "Původní meta popis článku pro testování.", isControl: true },
          { variantKey: "variant-b", metaDescription: "Optimalizovaný meta popis s CTA a klíčovými slovy.", isControl: false },
          { variantKey: "variant-c", metaDescription: "Emotivní meta popis zaměřený na benefity čtenáře.", isControl: false },
        ],
      });

      expect(result).toBe(true);
    });

    it("rejects non-admin users", async () => {
      await expect(
        publicCaller.articles.createMetaDescTest({
          articleSlug: "test-slug",
          variants: [
            { variantKey: "control", metaDescription: "Test", isControl: true },
          ],
        })
      ).rejects.toThrow();
    });
  });

  describe("getMetaDescVariant", () => {
    it("returns a variant for a visitor", async () => {
      const result = await publicCaller.articles.getMetaDescVariant({
        articleSlug: TEST_SLUG,
        visitorId: TEST_VISITOR,
      });

      expect(result).not.toBeNull();
      expect(result).toHaveProperty("variantKey");
      expect(result).toHaveProperty("metaDescription");
      expect(result).toHaveProperty("isControl");
      expect(typeof result!.metaDescription).toBe("string");
      expect(result!.metaDescription.length).toBeGreaterThan(0);
    });

    it("returns the same variant for the same visitor (sticky assignment)", async () => {
      const result1 = await publicCaller.articles.getMetaDescVariant({
        articleSlug: TEST_SLUG,
        visitorId: TEST_VISITOR,
      });

      const result2 = await publicCaller.articles.getMetaDescVariant({
        articleSlug: TEST_SLUG,
        visitorId: TEST_VISITOR,
      });

      expect(result1!.variantKey).toBe(result2!.variantKey);
      expect(result1!.metaDescription).toBe(result2!.metaDescription);
    });

    it("returns null for non-existent article", async () => {
      const result = await publicCaller.articles.getMetaDescVariant({
        articleSlug: "non-existent-article-xyz-123",
        visitorId: TEST_VISITOR,
      });

      expect(result).toBeNull();
    });
  });

  describe("trackMetaDescClick", () => {
    it("tracks an organic click from search engine", async () => {
      const result = await publicCaller.articles.trackMetaDescClick({
        articleSlug: TEST_SLUG,
        visitorId: TEST_VISITOR,
        referrerSource: "google",
      });

      expect(result).toBe(true);
    });
  });

  describe("updateMetaDescEngagement", () => {
    it("updates engagement metrics", async () => {
      const result = await publicCaller.articles.updateMetaDescEngagement({
        articleSlug: TEST_SLUG,
        visitorId: TEST_VISITOR,
        readTimeSeconds: 120,
        scrollDepthPercent: 85,
        completed: true,
      });

      expect(result).toBe(true);
    });
  });

  describe("getMetaDescTestResults", () => {
    it("returns test results for admin", async () => {
      const results = await adminCaller.articles.getMetaDescTestResults({
        articleSlug: TEST_SLUG,
      });

      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThanOrEqual(3);

      const control = results.find((r: any) => r.variantKey === "control");
      expect(control).toBeDefined();
      expect(control!.isControl).toBe(true);
      expect(control!.metaDescription).toBe("Původní meta popis článku pro testování.");

      // Check computed fields
      for (const r of results) {
        expect(r).toHaveProperty("ctr");
        expect(r).toHaveProperty("avgReadTime");
        expect(r).toHaveProperty("avgScrollDepth");
        expect(r).toHaveProperty("completionRate");
        expect(typeof r.ctr).toBe("number");
      }
    });

    it("rejects non-admin users", async () => {
      await expect(
        publicCaller.articles.getMetaDescTestResults({})
      ).rejects.toThrow();
    });
  });

  describe("getActiveMetaDescTests", () => {
    it("returns list of articles with active tests", async () => {
      const result = await publicCaller.articles.getActiveMetaDescTests();

      expect(Array.isArray(result)).toBe(true);
      expect(result).toContain(TEST_SLUG);
    });
  });

  describe("evaluateMetaDescTests", () => {
    it("evaluates tests (may return empty if not enough data)", async () => {
      const result = await adminCaller.articles.evaluateMetaDescTests({
        minImpressions: 1, // Low threshold for testing
        confidenceThreshold: 0.5,
      });

      expect(Array.isArray(result)).toBe(true);
      // With only 1 impression, may or may not find significant results
    });
  });

  describe("deployMetaDescWinner", () => {
    it("deploys a winning variant", async () => {
      // Get current variant to deploy
      const variant = await publicCaller.articles.getMetaDescVariant({
        articleSlug: TEST_SLUG,
        visitorId: TEST_VISITOR,
      });

      if (variant) {
        const result = await adminCaller.articles.deployMetaDescWinner({
          articleSlug: TEST_SLUG,
          winnerVariantKey: variant.variantKey,
        });

        expect(result).toHaveProperty("success");
        expect(result).toHaveProperty("message");
        expect(result.success).toBe(true);
      }
    });
  });

  describe("autoEvaluateMetaDesc", () => {
    it("auto-evaluates and deploys (may not deploy with low data)", async () => {
      // First recreate the test since deploy deactivated variants
      await adminCaller.articles.createMetaDescTest({
        articleSlug: `${TEST_SLUG}-auto`,
        articleType: "magazine",
        variants: [
          { variantKey: "control", metaDescription: "Auto test kontrola.", isControl: true },
          { variantKey: "variant-b", metaDescription: "Auto test varianta B.", isControl: false },
        ],
      });

      const result = await adminCaller.articles.autoEvaluateMetaDesc({
        minImpressions: 1000, // High threshold - won't deploy
        confidenceThreshold: 0.95,
      });

      expect(result).toHaveProperty("evaluated");
      expect(result).toHaveProperty("deployed");
      expect(result).toHaveProperty("results");
      expect(typeof result.evaluated).toBe("number");
      expect(typeof result.deployed).toBe("number");
    });
  });
});
