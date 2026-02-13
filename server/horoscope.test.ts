import { describe, it, expect, vi, beforeEach } from "vitest";
import { ZODIAC_SIGNS, getWeekDates } from "./horoscopeGenerator";

describe("Horoscope Generator", () => {
  describe("ZODIAC_SIGNS", () => {
    it("should have 12 zodiac signs", () => {
      expect(ZODIAC_SIGNS).toHaveLength(12);
    });

    it("should have all required properties for each sign", () => {
      ZODIAC_SIGNS.forEach((sign) => {
        expect(sign).toHaveProperty("key");
        expect(sign).toHaveProperty("nameCs");
        expect(sign).toHaveProperty("emoji");
        expect(sign).toHaveProperty("element");
      });
    });

    it("should have unique keys for each sign", () => {
      const keys = ZODIAC_SIGNS.map((s) => s.key);
      const uniqueKeys = new Set(keys);
      expect(uniqueKeys.size).toBe(12);
    });

    it("should include all 4 elements", () => {
      const elements = new Set(ZODIAC_SIGNS.map((s) => s.element));
      expect(elements).toContain("fire");
      expect(elements).toContain("earth");
      expect(elements).toContain("air");
      expect(elements).toContain("water");
    });
  });

  describe("getWeekDates", () => {
    it("should return start and end dates", () => {
      const result = getWeekDates(new Date("2026-01-22"));
      expect(result).toHaveProperty("start");
      expect(result).toHaveProperty("end");
    });

    it("should return Monday as start date", () => {
      // January 22, 2026 is Thursday
      const result = getWeekDates(new Date("2026-01-22"));
      // Monday should be January 19, 2026
      expect(result.start.getDay()).toBe(1); // Monday = 1
    });

    it("should return Sunday as end date", () => {
      const result = getWeekDates(new Date("2026-01-22"));
      expect(result.end.getDay()).toBe(0); // Sunday = 0
    });

    it("should span a full week (Monday 00:00 to Sunday 23:59)", () => {
      const result = getWeekDates(new Date("2026-01-22"));
      // Start is Monday 00:00:00, End is Sunday 23:59:59
      // So the difference is almost 7 days
      const diffTime = result.end.getTime() - result.start.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      expect(diffDays).toBeGreaterThan(6);
      expect(diffDays).toBeLessThan(7);
    });

    it("should handle Sunday input correctly", () => {
      // January 25, 2026 is Sunday
      const result = getWeekDates(new Date("2026-01-25"));
      expect(result.start.getDay()).toBe(1); // Monday
      expect(result.end.getDay()).toBe(0); // Sunday
    });

    it("should handle Monday input correctly", () => {
      // January 19, 2026 is Monday
      const result = getWeekDates(new Date("2026-01-19"));
      expect(result.start.getDay()).toBe(1); // Monday
      expect(result.end.getDate()).toBe(result.start.getDate() + 6);
    });
  });
});
