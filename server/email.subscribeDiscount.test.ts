import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as brevo from "./brevo";

// Mock Brevo functions
vi.mock("./brevo", () => ({
  addBrevoContact: vi.fn(),
  sendDiscountWelcomeEmail: vi.fn(),
}));

function createTestContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("email.subscribeDiscount", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("successfully subscribes email and sends welcome email", async () => {
    // Mock successful Brevo calls
    vi.mocked(brevo.addBrevoContact).mockResolvedValue(true);
    vi.mocked(brevo.sendDiscountWelcomeEmail).mockResolvedValue(true);

    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.email.subscribeDiscount({
      email: "test@example.com",
    });

    expect(result).toEqual({ success: true });
    expect(brevo.addBrevoContact).toHaveBeenCalledWith({
      email: "test@example.com",
      attributes: {
        SOURCE: "exit_intent_popup",
        DISCOUNT_CODE: "OHORAI11",
      },
      listIds: [2],
    });
    expect(brevo.sendDiscountWelcomeEmail).toHaveBeenCalledWith(
      "test@example.com",
      "OHORAI11"
    );
  });

  it("throws error when adding contact fails", async () => {
    vi.mocked(brevo.addBrevoContact).mockResolvedValue(false);

    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.email.subscribeDiscount({
        email: "test@example.com",
      })
    ).rejects.toThrow("Failed to add contact to email list");

    expect(brevo.sendDiscountWelcomeEmail).not.toHaveBeenCalled();
  });

  it("throws error when sending email fails", async () => {
    vi.mocked(brevo.addBrevoContact).mockResolvedValue(true);
    vi.mocked(brevo.sendDiscountWelcomeEmail).mockResolvedValue(false);

    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.email.subscribeDiscount({
        email: "test@example.com",
      })
    ).rejects.toThrow("Failed to send welcome email");
  });

  it("validates email format", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.email.subscribeDiscount({
        email: "invalid-email",
      })
    ).rejects.toThrow();

    expect(brevo.addBrevoContact).not.toHaveBeenCalled();
    expect(brevo.sendDiscountWelcomeEmail).not.toHaveBeenCalled();
  });
});
