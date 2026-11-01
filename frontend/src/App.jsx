import { useState, useCallback, useMemo } from "react";
import { Navbar } from "./components/Navbar";
import { EventForm } from "./components/EventForm";
import { PlanSummary } from "./components/PlanSummary";
import { RegenControl } from "./components/RegenControl";
import { LoadingSkeleton } from "./components/LoadingSkeleton";
import { BudgetTab } from "./components/tabs/BudgetTab";
import { TimelineTab } from "./components/tabs/TimelineTab";
import { VendorsTab } from "./components/tabs/VendorsTab";
import { IdeasTab } from "./components/tabs/IdeasTab";
import { PrintView } from "./components/PrintView";
import { PRESETS } from "./types/presets";
import { WalletIcon, ClockIcon, UsersIcon, SparklesIcon } from "./components/Icons";
import { usePlanManager } from "./hooks/usePlanManager";

const TABS = [
  { id: "budget", label: "Budget", icon: WalletIcon },
  { id: "timeline", label: "Timeline", icon: ClockIcon },
  { id: "vendors", label: "Vendors", icon: UsersIcon },
  { id: "ideas", label: "Ideas", icon: SparklesIcon },
];

/**
 * Main Jashn Application Orchestrator.
 * Connects event intake, plan generation, and section modules with accessible ARIA tab navigation.
 */
export default function App() {
  const {
    form,
    setForm,
    intake,
    plan,
    total,
    setTotal,
    busy,
    error,
    rateLimitCountdown,
    generate,
    regen,
  } = usePlanManager();

  const [tab, setTab] = useState("budget");
  const [done, setDone] = useState(() => {
    try {
      const saved = localStorage.getItem("jashn_vendor_tasks");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handleGenerate = useCallback(
    (e) => {
      generate(e, () => {
        setDone({});
        try {
          localStorage.removeItem("jashn_vendor_tasks");
        } catch {
          // ignore
        }
        setTab("budget");
      });
    },
    [generate]
  );

  const handleRegen = useCallback(
    (section, tweak) => {
      regen(section, tweak, (sec) => {
        if (sec === "vendors") {
          setDone({});
          try {
            localStorage.removeItem("jashn_vendor_tasks");
          } catch {
            // ignore
          }
        }
      });
    },
    [regen]
  );

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleExport = useCallback(() => {
    if (!plan || !intake) return;
    const exportData = {
      app: "Jashn AI Celebration Planner",
      exportedAt: new Date().toISOString(),
      intake: { ...intake, adjustedTotal: total },
      plan,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `jashn-${intake.event_type.toLowerCase()}-${intake.event_date}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [plan, intake, total]);

  // Accessible keyboard navigation for tabs
  const onTabKey = useCallback(
    (e) => {
      const currentIndex = TABS.findIndex((t) => t.id === tab);
      let nextIndex;
      if (e.key === "ArrowRight") {
        nextIndex = (currentIndex + 1) % TABS.length;
      } else if (e.key === "ArrowLeft") {
        nextIndex = (currentIndex - 1 + TABS.length) % TABS.length;
      } else if (e.key === "Home") {
        nextIndex = 0;
      } else if (e.key === "End") {
        nextIndex = TABS.length - 1;
      } else {
        return;
      }
      e.preventDefault();
      const nextTab = TABS[nextIndex].id;
      setTab(nextTab);
      document.getElementById(`tab-${nextTab}`)?.focus();
    },
    [tab]
  );

  const tasksTotal = useMemo(
    () => (plan ? plan.vendors.reduce((n, v) => n + v.tasks.length, 0) : 0),
    [plan]
  );

  const tasksDone = useMemo(
    () => Object.values(done).filter(Boolean).length,
    [done]
  );

  return (
    <div className="min-h-screen">
      {/* Top Navbar */}
      <Navbar plan={plan} onPrint={handlePrint} onExport={handleExport} />

      {/* Main App Layout */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 no-print">
        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          {/* Left Column: Intake Form (Sticky on Desktop) */}
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <EventForm
              form={form}
              setForm={setForm}
              onSubmit={handleGenerate}
              busy={busy}
              error={error}
              rateLimitCountdown={rateLimitCountdown}
            />
          </aside>

          {/* Right Column: Active Plan or Getting Started State */}
          <main id="main-content" tabIndex="-1" className="outline-none">
            <p role="status" aria-live="polite" className="sr-only">
              {busy === "all"
                ? "Planning celebration..."
                : busy
                ? `Regenerating ${busy} section...`
                : plan
                ? "Celebration plan updated"
                : ""}
            </p>

            {busy === "all" ? (
              <LoadingSkeleton />
            ) : !plan ? (
              <div className="rounded-2xl border-2 border-dashed border-border bg-surface/60 p-8 sm:p-12 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-marigold-light to-rose-light text-rose mb-4 shadow-sm">
                  <SparklesIcon className="w-8 h-8 text-rose" />
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-ink">
                  Your Celebration Blueprint Awaits
                </h2>
                <p className="mx-auto mt-2 max-w-lg text-sm text-ink-muted leading-relaxed">
                  Select a preset on the left or customize your guest count, budget, and cultural preferences, then click{" "}
                  <strong className="text-ink">Plan My Celebration</strong>. Jashn will generate a verified budget, backward timeline, vendor due-diligence, and creative ideas.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {PRESETS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setForm(p.form);
                        setTotal(p.form.budget);
                      }}
                      className="rounded-full border border-border bg-white px-3.5 py-1.5 text-xs font-semibold text-ink hover:border-rose hover:text-rose transition-colors shadow-xs"
                    >
                      Load {p.title}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                {/* Hero Summary & Key Metrics */}
                <PlanSummary
                  plan={plan}
                  intake={intake}
                  total={total}
                  tasksDone={tasksDone}
                  tasksTotal={tasksTotal}
                />

                {/* Accessible Tab Navigation */}
                <div
                  role="tablist"
                  aria-label="Celebration Plan Sections"
                  onKeyDown={onTabKey}
                  className="mb-4 flex gap-1.5 border-b border-border pb-1 overflow-x-auto"
                >
                  {TABS.map((t) => {
                    const Icon = t.icon;
                    const isActive = tab === t.id;
                    return (
                      <button
                        key={t.id}
                        role="tab"
                        id={`tab-${t.id}`}
                        aria-controls={`panel-${t.id}`}
                        aria-selected={isActive}
                        tabIndex={isActive ? 0 : -1}
                        onClick={() => setTab(t.id)}
                        className={`inline-flex items-center gap-2 rounded-t-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all ${
                          isActive
                            ? "bg-surface border-t-2 border-l border-r border-t-rose border-l-border border-r-border text-rose shadow-xs"
                            : "text-ink-muted hover:text-ink hover:bg-mist/50"
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? "text-rose" : "text-ink-muted"}`} />
                        <span>{t.label}</span>
                        {t.id === "vendors" && tasksTotal > 0 && (
                          <span
                            className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                              tasksDone === tasksTotal
                                ? "bg-teal-light text-teal"
                                : "bg-mist text-ink-muted"
                            }`}
                          >
                            {tasksDone}/{tasksTotal}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Tab Panel Content */}
                <div
                  role="tabpanel"
                  id={`panel-${tab}`}
                  aria-labelledby={`tab-${tab}`}
                  className="focus-visible:outline-none"
                >
                  {/* Granular Section Regenerator */}
                  <RegenControl
                    key={tab}
                    section={tab}
                    busy={busy}
                    onRun={handleRegen}
                  />

                  {tab === "budget" && (
                    <BudgetTab
                      budget={plan.budget}
                      total={total}
                      setTotal={setTotal}
                      initialBudget={intake.budget}
                      currency={intake.currency}
                    />
                  )}

                  {tab === "timeline" && (
                    <TimelineTab
                      timeline={plan.timeline}
                      onPrint={handlePrint}
                    />
                  )}

                  {tab === "vendors" && (
                    <VendorsTab
                      vendors={plan.vendors}
                      done={done}
                      setDone={setDone}
                      tasksDone={tasksDone}
                      tasksTotal={tasksTotal}
                    />
                  )}

                  {tab === "ideas" && (
                    <IdeasTab ideas={plan.ideas} />
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Print View: Displayed exclusively when printing / saving as PDF */}
      <PrintView plan={plan} intake={intake} total={total} />
    </div>
  );
}
