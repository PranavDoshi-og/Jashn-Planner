import { useState, useEffect, memo } from "react";
import { SparklesIcon, WalletIcon, ClockIcon, UsersIcon } from "./Icons";

const STEPS = [
  { icon: SparklesIcon, title: "Analyzing event parameters & cultural nuances…" },
  { icon: WalletIcon, title: "Calculating normalized budget breakdown & contingency…" },
  { icon: ClockIcon, title: "Synthesizing backward timeline & day-of run sheet…" },
  { icon: UsersIcon, title: "Compiling vendor checklist, due diligence & creative themes…" },
];

export const LoadingSkeleton = memo(function LoadingSkeleton() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 1600);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6 rounded-2xl border border-border bg-surface p-6 shadow-sm animate-pulse-subtle">
      {/* Header step tracker */}
      <div className="rounded-xl bg-mist/80 p-4 border border-border">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-marigold text-ink text-xs font-bold animate-spin">
            ⚡
          </span>
          <span className="font-display text-sm font-bold text-ink">
            Crafting Your Celebration Blueprint
          </span>
        </div>
        <div className="space-y-2">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isDone = idx < activeStep;
            const isCurrent = idx === activeStep;
            return (
              <div
                key={idx}
                className={`flex items-center gap-2.5 text-xs transition-colors duration-300 ${
                  isCurrent
                    ? "font-semibold text-rose"
                    : isDone
                    ? "text-teal font-medium"
                    : "text-ink-light"
                }`}
              >
                <div
                  className={`h-4 w-4 rounded-full flex items-center justify-center text-[10px] ${
                    isCurrent
                      ? "bg-rose text-white"
                      : isDone
                      ? "bg-teal text-white"
                      : "bg-border text-ink-muted"
                  }`}
                >
                  {isDone ? "✓" : idx + 1}
                </div>
                <span>{step.title}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Placeholder skeleton cards */}
      <div className="space-y-4">
        <div className="h-8 w-3/4 rounded-lg bg-mist animate-pulse" />
        <div className="h-4 w-full rounded bg-mist animate-pulse" />
        <div className="h-4 w-5/6 rounded bg-mist animate-pulse" />
      </div>

      <div className="grid grid-cols-4 gap-2 pt-2">
        <div className="h-10 rounded-lg bg-mist animate-pulse" />
        <div className="h-10 rounded-lg bg-mist animate-pulse" />
        <div className="h-10 rounded-lg bg-mist animate-pulse" />
        <div className="h-10 rounded-lg bg-mist animate-pulse" />
      </div>

      <div className="h-40 rounded-xl bg-mist/60 border border-border animate-pulse p-4 flex flex-col justify-between">
        <div className="h-6 w-1/3 rounded bg-mist" />
        <div className="h-12 w-full rounded-lg bg-mist" />
        <div className="space-y-2">
          <div className="h-4 w-2/3 rounded bg-mist" />
          <div className="h-4 w-1/2 rounded bg-mist" />
        </div>
      </div>
    </div>
  );
});

