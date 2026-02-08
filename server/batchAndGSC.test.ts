import { describe, it, expect, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

/**
 * Tests for:
 * 1. Batch meta description generation (tRPC procedure)
 * 2. Google Search Console integration (tRPC procedures)
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

function createNonAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "regular-user",
    email: "user@amulets.cz",
    name: "Regular User",
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

const caller = appRouter.createCaller;

describe("Google Search Console Integration", () => {
  it("gscStatus should return configured status for admin", async () => {
    const ctx = createAdminContext();
    const result = await caller(ctx).articles.gscStatus();
    
    expect(result).toBeDefined();
    expect(typeof result.configured).toBe("boolean");
    // GSC is not configured in test environment
    expect(result.configured).toBe(false);
    expect(result.siteUrl).toBeNull();
    expect(result.serviceAccount).toBeNull();
  });

  it("gscStatus should reject non-admin users", async () => {
    const ctx = createNonAdminContext();
    await expect(caller(ctx).articles.gscStatus()).rejects.toThrow();
  });

  it("gscStatus should reject unauthenticated users", async () => {
    const ctx = createPublicContext();
    await expect(caller(ctx).articles.gscStatus()).rejects.toThrow();
  });

  it("gscTopPages should return empty when not configured", async () => {
    const ctx = createAdminContext();
    const result = await caller(ctx).articles.gscTopPages({ limit: 10, days: 28 });
    
    expect(result).toBeDefined();
    expect(result.configured).toBe(false);
    expect(result.pages).toEqual([]);
  });

  it("gscTopPages should reject non-admin users", async () => {
    const ctx = createNonAdminContext();
    await expect(caller(ctx).articles.gscTopPages({ limit: 10, days: 28 })).rejects.toThrow();
  });

  it("gscArticleCTR should return empty when not configured", async () => {
    const ctx = createAdminContext();
    const result = await caller(ctx).articles.gscArticleCTR({
      articleSlugs: ["trojity-mesic", "symbol-nesmrtelnosti"],
      days: 14,
    });
    
    expect(result).toBeDefined();
    expect(result.configured).toBe(false);
    expect(result.data).toEqual({});
  });

  it("gscArticleCTR should reject non-admin users", async () => {
    const ctx = createNonAdminContext();
    await expect(caller(ctx).articles.gscArticleCTR({
      articleSlugs: ["test"],
      days: 14,
    })).rejects.toThrow();
  });
});

describe("Batch Meta Description Generation", () => {
  it("batchGenerateMetaDescriptions should reject non-admin users", async () => {
    const ctx = createNonAdminContext();
    await expect(caller(ctx).articles.batchGenerateMetaDescriptions({
      articles: [{
        slug: "test-article",
        title: "Test Article",
        currentDescription: "Test description",
        excerpt: "Test excerpt",
        type: "magazine",
      }],
      numberOfVariants: 2,
      autoCreateTests: false,
    })).rejects.toThrow();
  });

  it("batchGenerateMetaDescriptions should reject unauthenticated users", async () => {
    const ctx = createPublicContext();
    await expect(caller(ctx).articles.batchGenerateMetaDescriptions({
      articles: [{
        slug: "test-article",
        title: "Test Article",
        currentDescription: "Test description",
        excerpt: "Test excerpt",
        type: "magazine",
      }],
      numberOfVariants: 2,
      autoCreateTests: false,
    })).rejects.toThrow();
  });

  it("batchGenerateMetaDescriptions should handle empty articles array gracefully", async () => {
    const ctx = createAdminContext();
    // Empty articles array should return empty results
    const result = await caller(ctx).articles.batchGenerateMetaDescriptions({
      articles: [],
      numberOfVariants: 2,
      autoCreateTests: false,
    });
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });
});

describe("GSC Module Functions", () => {
  it("isGSCConfigured should return false without env vars", async () => {
    const { isGSCConfigured } = await import("./googleSearchConsole");
    expect(isGSCConfigured()).toBe(false);
  });

  it("getGSCStatus should return unconfigured status", async () => {
    const { getGSCStatus } = await import("./googleSearchConsole");
    const status = getGSCStatus();
    expect(status.configured).toBe(false);
    expect(status.siteUrl).toBeNull();
    expect(status.serviceAccount).toBeNull();
  });

  it("getTopPages should return empty array when not configured", async () => {
    const { getTopPages } = await import("./googleSearchConsole");
    const pages = await getTopPages(10, 28);
    expect(pages).toEqual([]);
  });

  it("getArticleCTRData should return empty map when not configured", async () => {
    const { getArticleCTRData } = await import("./googleSearchConsole");
    const data = await getArticleCTRData(["test-slug"], "https://amulets.cz", 14);
    expect(data).toBeInstanceOf(Map);
    expect(data.size).toBe(0);
  });
});
