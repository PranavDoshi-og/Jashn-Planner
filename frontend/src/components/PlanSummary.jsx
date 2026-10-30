import { WalletIcon, UsersIcon, CalendarIcon, CheckCircleIcon } from "./Icons";

export function PlanSummary({ plan, intake, total, tasksDone, tasksTotal }) {
  const currency = intake?.currency || "INR";
  const money = (n) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(n);

  const daysRemaining = Math.max(
    0,
    Math.ceil((new Date(intake.event_date) - new Date()) / (1000 * 60 * 60 * 24))
  );

  const perGuestCost = intake.guests > 0 ? Math.round(total / intake.guests) : 0;

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-sm mb-6">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-teal animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-teal">
            Celebration Blueprint Active
          </span>
        </div>
        <span className="text-xs text-ink-muted">
          {intake.event_type} • {intake.location}
        </span>
      </div>

      <p className="font-display text-xl sm:text-2xl font-bold leading-snug text-ink mb-6">
        {plan.summary}
      </p>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Total Budget */}
        <div className="rounded-xl border border-border/80 bg-mist/50 p-3">
          <div className="flex items-center gap-1.5 text-xs text-ink-muted">
            <WalletIcon className="w-3.5 h-3.5 text-rose" />
            <span>Budget</span>
          </div>
          <div className="mt-1 font-display text-lg font-bold text-ink">
            {money(total)}
          </div>
          <div className="text-[10px] text-ink-light">Total planned</div>
        </div>

        {/* Per Guest */}
        <div className="rounded-xl border border-border/80 bg-mist/50 p-3">
          <div className="flex items-center gap-1.5 text-xs text-ink-muted">
            <UsersIcon className="w-3.5 h-3.5 text-marigold" />
            <span>Per Guest</span>
          </div>
          <div className="mt-1 font-display text-lg font-bold text-ink">
            {money(perGuestCost)}
          </div>
          <div className="text-[10px] text-ink-light">{intake.guests} attendees</div>
        </div>

        {/* Timeline */}
        <div className="rounded-xl border border-border/80 bg-mist/50 p-3">
          <div className="flex items-center gap-1.5 text-xs text-ink-muted">
            <CalendarIcon className="w-3.5 h-3.5 text-teal" />
            <span>Timeline</span>
          </div>
          <div className="mt-1 font-display text-lg font-bold text-ink">
            {daysRemaining} Days
          </div>
          <div className="text-[10px] text-ink-light">{intake.event_date}</div>
        </div>

        {/* Vendor Checklist */}
        <div className="rounded-xl border border-border/80 bg-mist/50 p-3">
          <div className="flex items-center gap-1.5 text-xs text-ink-muted">
            <CheckCircleIcon className="w-3.5 h-3.5 text-teal" />
            <span>Vendor Tasks</span>
          </div>
          <div className="mt-1 font-display text-lg font-bold text-ink">
            {tasksDone} / {tasksTotal}
          </div>
          <div className="text-[10px] text-ink-light">
            {tasksTotal > 0 ? `${Math.round((tasksDone / tasksTotal) * 100)}% ready` : "No tasks"}
          </div>
        </div>
      </div>
    </div>
  );
}

