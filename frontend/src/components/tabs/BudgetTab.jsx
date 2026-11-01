import { memo, useMemo } from "react";
import { CheckCircleIcon } from "../Icons";
import { formatCurrency } from "../../utils/formatters";

const SWATCHES = [
  "#B42356", // Rose
  "#F59E0B", // Marigold
  "#0E7C74", // Teal
  "#6366F1", // Indigo
  "#EC4899", // Pink
  "#3B82F6", // Blue
  "#8B5CF6", // Purple
  "#10B981", // Emerald
  "#6B7280", // Gray (Contingency)
];

export const BudgetTab = memo(function BudgetTab({
  budget,
  total,
  setTotal,
  initialBudget,
  currency = "INR",
}) {
  const minRange = useMemo(() => Math.round(initialBudget * 0.5), [initialBudget]);
  const maxRange = useMemo(() => Math.round(initialBudget * 2.0), [initialBudget]);
  const stepVal = useMemo(
    () => Math.max(1000, Math.round(initialBudget / 100)),
    [initialBudget]
  );

  const contingency = useMemo(
    () => budget.find((b) => b.category.toLowerCase().includes("contingency")),
    [budget]
  );

  return (
    <div className="space-y-6">
      {/* Visual Proportional Allocation Bar */}
      <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-ink uppercase tracking-wider">
            Portfolio Allocation ({budget.length} Categories)
          </span>
          <span className="text-xs text-ink-muted">100% Normalized Sum</span>
        </div>

        <div
          className="flex h-10 w-full overflow-hidden rounded-xl bg-mist shadow-inner"
          role="img"
          aria-label="Proportional budget breakdown bar chart"
        >
          {budget.map((b, i) => (
            <div
              key={b.category}
              style={{
                width: `${b.percent}%`,
                backgroundColor: SWATCHES[i % SWATCHES.length],
              }}
              className="h-full transition-all duration-300 relative group cursor-pointer"
              title={`${b.category}: ${b.percent}% (${formatCurrency(
                Math.round((total * b.percent) / 100),
                currency
              )})`}
            />
          ))}
        </div>

        {/* Legend pills */}
        <div className="mt-3 flex flex-wrap gap-2 pt-1 border-t border-border/50 text-[11px]">
          {budget.map((b, i) => (
            <div key={b.category} className="flex items-center gap-1.5 text-ink-muted">
              <span
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: SWATCHES[i % SWATCHES.length] }}
              />
              <span className="font-medium text-ink">{b.category}</span>
              <span className="text-ink-light">({b.percent}%)</span>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Budget Slider */}
      <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div>
            <label htmlFor="budget-slider" className="text-sm font-bold text-ink">
              Interactive Budget Rescaler
            </label>
            <p className="text-xs text-ink-muted">
              Slide to simulate budget changes. Percentages stay locked; amounts re-scale instantly in your browser.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-display text-xl font-extrabold text-rose">
              {formatCurrency(total, currency)}
            </span>
            {total !== initialBudget && (
              <button
                type="button"
                onClick={() => setTotal(initialBudget)}
                className="rounded-md border border-border bg-white px-2 py-1 text-[11px] font-semibold text-ink-muted hover:text-ink hover:bg-mist transition-colors"
                title="Reset to original budget"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        <input
          id="budget-slider"
          type="range"
          min={minRange}
          max={maxRange}
          step={stepVal}
          value={total}
          onChange={(e) => setTotal(Number(e.target.value))}
          className="w-full h-2.5 bg-mist rounded-lg appearance-none cursor-pointer accent-rose focus-visible:ring-2 focus-visible:ring-rose"
          aria-valuemin={minRange}
          aria-valuemax={maxRange}
          aria-valuenow={total}
          aria-valuetext={formatCurrency(total, currency)}
        />

        <div className="mt-1 flex justify-between text-[11px] text-ink-light">
          <span>Min: {formatCurrency(minRange, currency)}</span>
          <span className="font-medium text-ink">Base: {formatCurrency(initialBudget, currency)}</span>
          <span>Max: {formatCurrency(maxRange, currency)}</span>
        </div>
      </div>

      {/* Category Breakdown Cards */}
      <div className="grid gap-3 sm:grid-cols-2">
        {budget.map((b, i) => {
          const catAmount = Math.round((total * b.percent) / 100);
          const isContingency = b.category.toLowerCase().includes("contingency");
          return (
            <div
              key={b.category}
              className={`rounded-xl border p-4 transition-all shadow-sm ${
                isContingency
                  ? "border-marigold/60 bg-marigold-light/30"
                  : "border-border bg-surface hover:border-ink/20"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full shrink-0"
                    style={{ backgroundColor: SWATCHES[i % SWATCHES.length] }}
                  />
                  <h3 className="font-display text-base font-bold text-ink">
                    {b.category}
                  </h3>
                </div>
                <div className="text-right">
                  <div className="font-display text-base font-black text-ink">
                    {formatCurrency(catAmount, currency)}
                  </div>
                  <span className="inline-block rounded bg-mist px-1.5 py-0.5 text-[10px] font-bold text-ink-muted">
                    {b.percent}% of total
                  </span>
                </div>
              </div>
              <p className="mt-2 text-xs text-ink-muted leading-relaxed">
                {b.note}
              </p>
            </div>
          );
        })}
      </div>

      {contingency && (
        <div className="rounded-xl border border-teal/30 bg-teal-light/40 p-3.5 text-xs text-teal flex items-center gap-2">
          <CheckCircleIcon className="w-4 h-4 shrink-0 text-teal" />
          <span>
            <strong>Contingency Shield Active:</strong> {contingency.percent}% (
            {formatCurrency(
              Math.round((total * contingency.percent) / 100),
              currency
            )}
            ) is reserved for unexpected last-minute expenses or emergencies.
          </span>
        </div>
      )}
    </div>
  );
});
