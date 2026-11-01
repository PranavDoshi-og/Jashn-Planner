import { useState, memo } from "react";
import { ClockIcon, CheckIcon, PrinterIcon } from "../Icons";

export const TimelineTab = memo(function TimelineTab({ timeline, onPrint }) {
  const [completedMilestones, setCompletedMilestones] = useState({});

  const toggleMilestone = (idx) => {
    setCompletedMilestones((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-white p-4 shadow-sm">
        <div>
          <h3 className="font-display text-base font-bold text-ink">
            Backward Planning Sequence
          </h3>
          <p className="text-xs text-ink-muted">
            Milestones planned backward from event date to today, culminating in the Day-of Run Sheet.
          </p>
        </div>
        <button
          onClick={onPrint}
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-ink hover:bg-mist transition-colors no-print"
        >
          <PrinterIcon className="w-3.5 h-3.5 text-rose" />
          <span>Print Timeline</span>
        </button>
      </div>

      <div className="relative pl-6 sm:pl-8">
        {/* Continuous vertical timeline connector line */}
        <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-gradient-to-b from-marigold via-rose to-teal" />

        <div className="space-y-6">
          {timeline.map((m, idx) => {
            const isCompleted = !!completedMilestones[idx];
            const isLast = idx === timeline.length - 1;
            const isDayOfRunSheet =
              isLast ||
              m.when.toLowerCase().includes("day of") ||
              m.title.toLowerCase().includes("run sheet") ||
              m.title.toLowerCase().includes("day-of");

            return (
              <div
                key={idx}
                className={`relative rounded-xl border p-4 sm:p-5 transition-all shadow-sm ${
                  isDayOfRunSheet
                    ? "border-marigold bg-gradient-to-br from-marigold-light/40 to-surface ring-1 ring-marigold/30"
                    : isCompleted
                    ? "border-teal/40 bg-teal-light/20"
                    : "border-border bg-surface hover:border-ink/20"
                }`}
              >
                {/* Node icon on line */}
                <button
                  type="button"
                  onClick={() => toggleMilestone(idx)}
                  className={`absolute -left-6 sm:-left-8 top-5 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border-2 border-white shadow-sm transition-transform hover:scale-110 ${
                    isDayOfRunSheet
                      ? "bg-marigold text-ink ring-2 ring-marigold/40"
                      : isCompleted
                      ? "bg-teal text-white"
                      : "bg-rose text-white"
                  }`}
                  title={isCompleted ? "Mark milestone as in-progress" : "Mark milestone as completed"}
                >
                  {isCompleted ? (
                    <CheckIcon className="w-3.5 h-3.5" />
                  ) : isDayOfRunSheet ? (
                    <ClockIcon className="w-3.5 h-3.5" />
                  ) : (
                    <span className="text-[10px] font-bold">{idx + 1}</span>
                  )}
                </button>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        isDayOfRunSheet
                          ? "bg-marigold text-ink uppercase tracking-wider"
                          : "bg-rose-light text-rose"
                      }`}
                    >
                      {m.when}
                    </span>
                    {isDayOfRunSheet && (
                      <span className="rounded-full bg-teal-light px-2 py-0.5 text-[10px] font-bold text-teal">
                        ★ Day-of Event Run Sheet
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleMilestone(idx)}
                    className="text-xs text-ink-muted hover:text-ink font-medium"
                  >
                    {isCompleted ? "Completed ✓" : "Mark done"}
                  </button>
                </div>

                <h4 className="mt-2 font-display text-lg font-bold text-ink">
                  {m.title}
                </h4>

                {/* Tasks list */}
                <ul className="mt-3 space-y-2">
                  {m.tasks.map((task, tIdx) => {
                    const hasClockTime = /^\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?/i.test(task);
                    return (
                      <li
                        key={tIdx}
                        className="flex items-start gap-2.5 text-xs text-ink/90 leading-relaxed"
                      >
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-ink-muted shrink-0" />
                        <span className={hasClockTime ? "font-semibold text-ink" : ""}>
                          {task}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

