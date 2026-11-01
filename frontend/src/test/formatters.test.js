import { describe, it, expect } from "vitest";
import { formatCurrency } from "../utils/formatters";

describe("formatCurrency utility", () => {
  it("formats positive numbers as INR by default", () => {
    const formatted = formatCurrency(1500000, "INR");
    expect(formatted).toContain("15,00,000");
  });

  it("formats different currencies properly", () => {
    const usd = formatCurrency(5000, "USD");
    expect(usd).toContain("5,000");

    const eur = formatCurrency(2500, "EUR");
    expect(eur).toContain("2,500");
  });

  it("handles zero gracefully", () => {
    const zero = formatCurrency(0, "INR");
    expect(zero).toContain("0");
  });

  it("returns empty string on invalid non-numeric inputs", () => {
    expect(formatCurrency(null)).toBe("");
    expect(formatCurrency(undefined)).toBe("");
    expect(formatCurrency(NaN)).toBe("");
    expect(formatCurrency("not a number")).toBe("");
  });

  it("reuses cached Intl.NumberFormat instances for high performance", () => {
    const first = formatCurrency(1000, "INR");
    const second = formatCurrency(2000, "INR");
    expect(first).toBeDefined();
    expect(second).toBeDefined();
  });
});

