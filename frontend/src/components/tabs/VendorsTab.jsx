import { useState, memo } from "react";
import { CopyIcon, CheckIcon } from "../Icons";

export const VendorsTab = memo(function VendorsTab({
  vendors,
  done,
  setDone,
  tasksDone,
  tasksTotal,
}) {
  const [copiedKey, setCopiedKey] = useState(null);
  const [filter, setFilter] = useState("all"); // "all" | "pending" | "completed"

  const toggleTask = (key) => {
    setDone((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem("jashn_vendor_tasks", JSON.stringify(next));
      } catch (e) {
        // Ignore localStorage quota errors
      }
      return next;
    });
  };

  const copyQuestion = (q, key) => {
    navigator.clipboard.writeText(q);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const progressPercent = tasksTotal > 0 ? Math.round((tasksDone / tasksTotal) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Progress & Filter Header */}
      <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div>
            <h3 className="font-display text-base font-bold text-ink">
              Vendor Procurement & Due Diligence
            </h3>
            <p className="text-xs text-ink-muted">
              Check off onboarding steps and use verified due diligence questions during negotiations.
            </p>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-mist p-1 text-xs">
            {["all", "pending", "completed"].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-md px-2.5 py-1 font-semibold capitalize transition-all ${
                  filter === f
                    ? "bg-white text-ink shadow-xs"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="flex justify-between text-xs font-semibold text-ink mb-1">
            <span>Overall Readiness</span>
            <span className="text-teal">{tasksDone} of {tasksTotal} tasks done ({progressPercent}%)</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-mist border border-border/60">
            <div
              className="h-full bg-gradient-to-r from-teal to-marigold transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>
        </div>
      </div>

      {/* Vendor Category Cards */}
      <div className="space-y-4">
        {vendors.map((v, vi) => {
          // Check task visibility based on filter
          const tasksWithStatus = v.tasks.map((task, ti) => {
            const key = `${vi}-${ti}`;
            const isDone = !!done[key];
            return { task, key, isDone };
          });

          const filteredTasks = tasksWithStatus.filter((t) => {
            if (filter === "pending") return !t.isDone;
            if (filter === "completed") return t.isDone;
            return true;
          });

          if (filter !== "all" && filteredTasks.length === 0) {
            return null;
          }

          const categoryTasksDone = tasksWithStatus.filter((t) => t.isDone).length;

          return (
            <div
              key={v.category}
              className="rounded-xl border border-border bg-surface p-5 shadow-sm transition-all"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-light text-teal font-bold text-xs">
                    {vi + 1}
                  </span>
                  <h4 className="font-display text-lg font-bold text-ink">
                    {v.category}
                  </h4>
                </div>
                <span className="rounded-full bg-mist px-2.5 py-0.5 text-xs font-semibold text-ink-muted">
                  {categoryTasksDone}/{v.tasks.length} Completed
                </span>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Action Items */}
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-ink mb-2">
                    Action Checklist
                  </h5>
                  <div className="space-y-2">
                    {filteredTasks.length === 0 ? (
                      <p className="text-xs text-ink-light italic">No matching tasks for this filter.</p>
                    ) : (
                      filteredTasks.map(({ task, key, isDone }) => (
                        <label
                          key={key}
                          htmlFor={`vendor-task-${key}`}
                          className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-colors text-xs ${
                            isDone ? "bg-mist/60 text-ink-muted" : "hover:bg-mist/40 text-ink"
                          }`}
                        >
                          <input
                            id={`vendor-task-${key}`}
                            type="checkbox"
                            checked={isDone}
                            onChange={() => toggleTask(key)}
                            className="mt-0.5 h-4 w-4 rounded border-border text-teal accent-teal focus:ring-teal"
                          />
                          <span className={isDone ? "line-through text-ink-light" : "font-medium"}>
                            {task}
                          </span>
                        </label>
                      ))
                    )}
                  </div>
                </div>

                {/* Questions to Ask */}
                <div className="rounded-xl border border-border/70 bg-mist/30 p-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-rose">
                      Key Questions to Ask
                    </h5>
                    <span className="text-[10px] text-ink-light">Click copy for WhatsApp / Email</span>
                  </div>
                  <ul className="space-y-2">
                    {v.questions.map((q, qi) => {
                      const qKey = `${vi}-q-${qi}`;
                      const isCopied = copiedKey === qKey;
                      return (
                        <li
                          key={qi}
                          className="group flex items-start justify-between gap-2 rounded-lg bg-white p-2 text-xs text-ink border border-border/50 shadow-xs"
                        >
                          <span className="leading-relaxed">"{q}"</span>
                          <button
                            type="button"
                            onClick={() => copyQuestion(q, qKey)}
                            className="shrink-0 rounded p-1 text-ink-muted hover:bg-mist hover:text-ink focus-visible:ring-1 focus-visible:ring-rose"
                            title="Copy question text"
                            aria-label={`Copy question: ${q}`}
                          >
                            {isCopied ? (
                              <CheckIcon className="w-3.5 h-3.5 text-teal" />
                            ) : (
                              <CopyIcon className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

