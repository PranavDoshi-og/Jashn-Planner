import { useState, memo } from "react";
import { RefreshCwIcon, SparklesIcon } from "./Icons";

const SUGGESTIONS = {
  budget: [
    "Make it more cost-effective",
    "Allocate more to decor & photography",
    "Increase contingency to 12%",
    "Prioritize premium catering",
  ],
  timeline: [
    "Compress into fewer milestones",
    "Add dedicated Sangeet / Mehendi schedule",
    "Focus heavily on day-of morning rituals",
    "Earlier venue lock-in",
  ],
  vendors: [
    "Emphasize eco-friendly & zero-waste vendors",
    "Add strict weather & power backup clauses",
    "Focus on live regional entertainment",
    "Ask for comprehensive overtime rates",
  ],
  ideas: [
    "Eco-friendly & sustainable celebration",
    "Royal vintage heritage aesthetic",
    "Modern fusion food & live mocktail counters",
    "High-energy interactive guest games",
  ],
};

export const RegenControl = memo(function RegenControl({ section, busy, onRun }) {
  const [tweak, setTweak] = useState("");
  const isBusy = busy === section;

  const handleSubmit = (e) => {
    e.preventDefault();
    onRun(section, tweak);
    setTweak("");
  };

  const handlePillClick = (suggestion) => {
    setTweak(suggestion);
  };

  const currentSuggestions = SUGGESTIONS[section] || [];

  return (
    <div className="mb-6 rounded-xl border border-border/80 bg-mist/40 p-3.5 no-print">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-1.5 text-xs text-ink-muted">
        <span className="flex items-center gap-1 font-semibold text-ink">
          <SparklesIcon className="w-3.5 h-3.5 text-marigold" />
          <span>Refine & Tweak this {section.charAt(0).toUpperCase() + section.slice(1)}</span>
        </span>
        <span className="text-[10px] text-ink-light">AI re-generates only this section</span>
      </div>

      {/* Suggested Quick Tweak Pills */}
      <div className="mb-2.5 flex flex-wrap gap-1.5">
        {currentSuggestions.map((pill, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handlePillClick(pill)}
            className="rounded-full border border-border bg-white px-2.5 py-1 text-[11px] font-medium text-ink-muted hover:border-rose hover:text-rose transition-colors"
          >
            + {pill}
          </button>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-2">
        <input
          type="text"
          maxLength={300}
          value={tweak}
          onChange={(e) => setTweak(e.target.value)}
          placeholder={`e.g. "Focus on local seasonal ingredients" or "Add extra buffer"`}
          className="flex-1 min-w-[200px] rounded-lg border border-border bg-white px-3 py-1.5 text-xs text-ink placeholder:text-ink-light focus:border-rose focus:ring-1 focus:ring-rose"
          disabled={!!busy}
        />
        <button
          type="submit"
          disabled={!!busy}
          className="inline-flex items-center gap-1.5 rounded-lg border border-ink bg-ink text-white px-3.5 py-1.5 text-xs font-semibold hover:bg-ink-muted disabled:opacity-50 transition-colors"
        >
          {isBusy ? (
            <>
              <RefreshCwIcon className="w-3.5 h-3.5 animate-spin" />
              <span>Regenerating…</span>
            </>
          ) : (
            <>
              <RefreshCwIcon className="w-3.5 h-3.5" />
              <span>Regenerate Section</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
});

