import { useRef, useState } from "react";

const API = import.meta.env.VITE_API_URL ?? "";
const SWATCH = ["#D63A6E", "#F5A60B", "#0E7C74", "#5B3FD1", "#E4572E", "#2A9DF4", "#8A5A44", "#7A8B99", "#A3A3A3"];
const TABS = [["budget", "Budget"], ["timeline", "Timeline"], ["vendors", "Vendors"], ["ideas", "Ideas"]];
const TYPES = ["Wedding", "Birthday", "Anniversary", "Baby shower", "Community festival", "Corporate celebration"];

const isoIn = (d) => { const t = new Date(); t.setDate(t.getDate() + d); return t.toISOString().slice(0, 10); };

async function post(path, body, signal) {
  const r = await fetch(`${API}${path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal });
  if (!r.ok) {
    const e = await r.json().catch(() => ({}));
    throw new Error(typeof e.detail === "string" ? e.detail : "Check the form fields and try again.");
  }
  return r.json();
}

const Field = ({ label, children }) => (
  <label className="block text-sm font-medium">
    {label}
    <div className="mt-1">{children}</div>
  </label>
);
const inputCls = "w-full rounded-lg border border-ink/50 bg-white px-3 py-2 text-base";

function Regen({ section, busy, onRun }) {
  const [tweak, setTweak] = useState("");
  return (
    <form
      className="mb-5 flex flex-wrap gap-2"
      onSubmit={(e) => { e.preventDefault(); onRun(section, tweak); setTweak(""); }}
    >
      <input className={`${inputCls} flex-1 min-w-48`} placeholder="Optional: what should change?" value={tweak} onChange={(e) => setTweak(e.target.value)} />
      <button disabled={!!busy} className="rounded-lg border border-ink px-4 py-2 font-medium disabled:opacity-50">
        {busy === section ? "Regenerating…" : "Regenerate this section"}
      </button>
    </form>
  );
}

export default function App() {
  const [form, setForm] = useState({ event_type: "Wedding", event_date: isoIn(90), guests: 150, budget: 1500000, currency: "INR", location: "", vibe: "", culture: "", must_haves: "" });
  const [intake, setIntake] = useState(null);
  const [plan, setPlan] = useState(null);
  const [total, setTotal] = useState(0);
  const [tab, setTab] = useState("budget");
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState("");
  const [done, setDone] = useState({});
  const ctrl = useRef(null);

  const nextSignal = () => { ctrl.current?.abort(); ctrl.current = new AbortController(); return ctrl.current.signal; };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === "number" ? Number(e.target.value) : e.target.value });
  const money = (n) => new Intl.NumberFormat("en-IN", { style: "currency", currency: form.currency || "INR", maximumFractionDigits: 0 }).format(n);

  async function generate(e) {
    e.preventDefault();
    setBusy("all"); setError("");
    try {
      const data = await post("/api/plan", form, nextSignal());
      setPlan(data); setIntake(form); setTotal(form.budget); setDone({}); setTab("budget");
    } catch (err) { if (err.name !== "AbortError") setError(err.message); }
    setBusy(null);
  }

  async function regen(section, tweak) {
    setBusy(section); setError("");
    try {
      const data = await post("/api/section", { intake: { ...intake, budget: total }, section, tweak, categories: plan.budget.map((b) => b.category) }, nextSignal());
      setPlan((p) => ({ ...p, [section]: data[section] }));
      if (section === "vendors") setDone({});
    } catch (err) { if (err.name !== "AbortError") setError(err.message); }
    setBusy(null);
  }

  function onTabKey(e) {
    const i = TABS.findIndex(([k]) => k === tab);
    let n;
    if (e.key === "ArrowRight") n = (i + 1) % TABS.length;
    else if (e.key === "ArrowLeft") n = (i - 1 + TABS.length) % TABS.length;
    else return;
    e.preventDefault();
    setTab(TABS[n][0]);
    document.getElementById(`tab-${TABS[n][0]}`)?.focus();
  }

  const tasksTotal = plan ? plan.vendors.reduce((n, v) => n + v.tasks.length, 0) : 0;
  const tasksDone = Object.values(done).filter(Boolean).length;

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-5 py-8 lg:grid-cols-[360px_1fr]">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded focus:bg-white focus:p-2">Skip to your plan</a>
      <form onSubmit={generate} className="space-y-4 lg:sticky lg:top-6 lg:self-start">
        <h1 className="font-display text-5xl font-bold leading-none">Jashn</h1>
        <p className="text-ink/70">Tell us about the celebration. Get a budget, timeline, vendor checklist and ideas.</p>
        <Field label="Event type">
          <select className={inputCls} value={form.event_type} onChange={set("event_type")}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Date"><input required type="date" className={inputCls} value={form.event_date} onChange={set("event_date")} /></Field>
          <Field label="Guests"><input required type="number" min="1" className={inputCls} value={form.guests} onChange={set("guests")} /></Field>
        </div>
        <div className="grid grid-cols-[1fr_90px] gap-3">
          <Field label="Total budget"><input required type="number" min="1000" step="1000" className={inputCls} value={form.budget} onChange={set("budget")} /></Field>
          <Field label="Currency"><select className={inputCls} value={form.currency} onChange={set("currency")}>{["INR", "USD", "EUR", "GBP", "AED"].map((c) => <option key={c}>{c}</option>)}</select></Field>
        </div>
        <Field label="City or venue area"><input required className={inputCls} value={form.location} onChange={set("location")} placeholder="Pune, Maharashtra" /></Field>
        <Field label="Vibe"><input className={inputCls} value={form.vibe} onChange={set("vibe")} placeholder="Intimate, colourful, music-heavy" /></Field>
        <Field label="Culture or traditions"><input className={inputCls} value={form.culture} onChange={set("culture")} placeholder="Maharashtrian, vegetarian menu" /></Field>
        <Field label="Must-haves"><textarea rows="2" className={inputCls} value={form.must_haves} onChange={set("must_haves")} placeholder="Live band, outdoor ceremony" /></Field>
        <button disabled={!!busy} className="w-full rounded-lg bg-marigold px-4 py-3 text-lg font-semibold text-ink disabled:opacity-60">
          {busy === "all" ? "Planning…" : plan ? "Re-plan everything" : "Plan my event"}
        </button>
        {error && <p role="alert" className="rounded-lg bg-rose/10 p-3 text-sm text-rose">{error}</p>}
      </form>

      <main id="main">
        <p role="status" aria-live="polite" className="sr-only">{busy ? "Working on your plan" : plan ? "Plan ready" : ""}</p>
        {!plan ? (
          <div className="rounded-2xl border-2 border-dashed border-ink/20 p-10">
            <h2 className="font-display text-3xl font-semibold">Your plan appears here</h2>
            <p className="mt-2 max-w-prose text-ink/70">Fill in the form and choose Plan my event. You can then adjust the budget, check off vendor tasks, and regenerate any section.</p>
          </div>
        ) : (
          <>
            <p className="mb-6 max-w-prose font-display text-2xl leading-snug">{plan.summary}</p>
            <div role="tablist" aria-label="Plan sections" onKeyDown={onTabKey} className="mb-6 flex gap-1 border-b border-ink/15">
              {TABS.map(([k, l]) => (
                <button key={k} role="tab" id={`tab-${k}`} aria-controls="panel" aria-selected={tab === k} tabIndex={tab === k ? 0 : -1} onClick={() => setTab(k)}
                  className={`px-4 py-2 font-medium ${tab === k ? "border-b-4 border-rose" : "text-ink/75"}`}>{l}</button>
              ))}
            </div>
            <div role="tabpanel" id="panel" aria-labelledby={`tab-${tab}`}>
            <Regen key={tab} section={tab} busy={busy} onRun={regen} />

            {tab === "budget" && (
              <section>
                <div className="flex h-14 overflow-hidden rounded-xl" aria-hidden="true">
                  {plan.budget.map((b, i) => <div key={b.category} style={{ width: `${b.percent}%`, background: SWATCH[i % SWATCH.length] }} title={b.category} />)}
                </div>
                <label className="mt-5 block text-sm font-medium">
                  Total budget: <strong>{money(total)}</strong>
                  <input type="range" className="mt-1 w-full accent-rose" min={Math.round(intake.budget * 0.5)} max={Math.round(intake.budget * 2)} step={Math.max(1000, Math.round(intake.budget / 100))} value={total} onChange={(e) => setTotal(Number(e.target.value))} />
                </label>
                <ul className="mt-4 divide-y divide-ink/10">
                  {plan.budget.map((b, i) => (
                    <li key={b.category} className="flex items-start gap-3 py-3">
                      <span className="mt-1.5 h-3 w-3 shrink-0 rounded-full" style={{ background: SWATCH[i % SWATCH.length] }} />
                      <div className="flex-1"><p className="font-semibold">{b.category} <span className="font-normal text-ink/75">{b.percent}%</span></p><p className="text-sm text-ink/70">{b.note}</p></div>
                      <p className="font-display text-lg font-semibold">{money(Math.round((total * b.percent) / 100))}</p>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {tab === "timeline" && (
              <ol className="ml-2 border-l-2 border-ink/20">
                {plan.timeline.map((m, i) => (
                  <li key={i} className="relative pb-7 pl-6">
                    <span className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full bg-marigold ring-4 ring-mist" />
                    <p className="text-sm font-semibold text-rose">{m.when}</p>
                    <h3 className="font-display text-xl font-semibold">{m.title}</h3>
                    <ul className="mt-1 list-disc space-y-1 pl-5 text-ink/80">{m.tasks.map((t, j) => <li key={j}>{t}</li>)}</ul>
                  </li>
                ))}
              </ol>
            )}

            {tab === "vendors" && (
              <section>
                <p className="mb-4 text-sm font-medium">{tasksDone} of {tasksTotal} tasks done</p>
                <div className="mb-6 h-2 overflow-hidden rounded-full bg-ink/10"><div className="h-full bg-teal transition-all" style={{ width: `${tasksTotal ? (tasksDone / tasksTotal) * 100 : 0}%` }} /></div>
                {plan.vendors.map((v, vi) => (
                  <div key={v.category} className="mb-8 grid gap-4 border-t border-ink/15 pt-4 md:grid-cols-2">
                    <div>
                      <h3 className="font-display text-xl font-semibold">{v.category}</h3>
                      {v.tasks.map((t, ti) => {
                        const key = `${vi}-${ti}`;
                        return (
                          <label key={key} className="mt-2 flex items-start gap-2">
                            <input type="checkbox" className="mt-1.5 accent-teal" checked={!!done[key]} onChange={() => setDone({ ...done, [key]: !done[key] })} />
                            <span className={done[key] ? "text-ink/70 line-through" : ""}>{t}</span>
                          </label>
                        );
                      })}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Ask the vendor</p>
                      <ul className="mt-1 list-disc space-y-1 pl-5 text-ink/80">{v.questions.map((q, i) => <li key={i}>{q}</li>)}</ul>
                    </div>
                  </div>
                ))}
              </section>
            )}

            {tab === "ideas" && (
              <section className="space-y-8">
                <div className="grid gap-6 md:grid-cols-3">
                  {plan.ideas.themes.map((t) => (
                    <div key={t.title} className="border-t-4 border-marigold pt-3"><h3 className="font-display text-xl font-semibold">{t.title}</h3><p className="mt-1 text-ink/80">{t.description}</p></div>
                  ))}
                </div>
                <div className="grid gap-8 md:grid-cols-2">
                  <div><h3 className="font-display text-xl font-semibold">Menu</h3><ul className="mt-2 list-disc space-y-1 pl-5">{plan.ideas.menu.map((m, i) => <li key={i}>{m}</li>)}</ul></div>
                  <div><h3 className="font-display text-xl font-semibold">Activities</h3><ul className="mt-2 list-disc space-y-1 pl-5">{plan.ideas.activities.map((a, i) => <li key={i}>{a}</li>)}</ul></div>
                </div>
              </section>
            )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
