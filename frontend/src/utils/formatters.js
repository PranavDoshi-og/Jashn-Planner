/**
 * High-performance cached currency formatter to eliminate redundant
 * Intl.NumberFormat allocations during 60 FPS slider animations and render loops.
 */
const formatterCache = new Map();

/**
 * Formats a numeric amount into localized currency string with cached formatters.
 * @param {number} amount - The amount to format.
 * @param {string} [currency="INR"] - The 3-letter ISO currency code.
 * @returns {string} The formatted currency string.
 */
export function formatCurrency(amount, currency = "INR") {
  if (typeof amount !== "number" || isNaN(amount)) {
    return "";
  }
  const curr = currency || "INR";
  let formatter = formatterCache.get(curr);
  if (!formatter) {
    try {
      formatter = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: curr,
        maximumFractionDigits: 0,
      });
    } catch {
      formatter = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      });
    }
    formatterCache.set(curr, formatter);
  }
  return formatter.format(amount);
}
