import { describe, it, expect } from "vitest";
import { sendMetaConversion } from "./meta-conversions";

describe("Meta Conversions API", () => {
  it("should successfully send a test event to Meta Conversions API", async () => {
    // Send a test Lead event
    const result = await sendMetaConversion({
      eventName: "Lead",
      email: "test@example.com",
      eventSourceUrl: "https://amulets.cz",
      customData: {
        content_name: "Test Event",
        value: 0,
        currency: "CZK",
      },
    });

    // Should return true if token is valid
    expect(result).toBe(true);
  }, 10000); // 10 second timeout for API call
});
