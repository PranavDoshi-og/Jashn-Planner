import { useState, memo } from "react";
import { SparklesIcon, CalendarIcon, UsersIcon, WalletIcon, MapPinIcon, AlertCircleIcon, RefreshCwIcon } from "./Icons";
import { PRESETS, isoInDays } from "../types/presets";
import { formatCurrency } from "../utils/formatters";

const TYPES = ["Wedding", "Birthday", "Anniversary", "Baby shower", "Community festival", "Corporate celebration"];
const CURRENCIES = ["INR", "USD", "EUR", "GBP", "AED"];

export const EventForm = memo(function EventForm({
  form,
  setForm,
  onSubmit,
  busy,
  error,
  rateLimitCountdown,
}) {
  const [selectedPreset, setSelectedPreset] = useState("");
  const todayIso = new Date().toISOString().slice(0, 10);

  const setField = (key) => (e) => {
    setSelectedPreset("");
    setForm((prev) => ({
      ...prev,
      [key]: e.target.type === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value,
    }));
  };

  const handleApplyPreset = (presetId) => {
    setSelectedPreset(presetId);
    const found = PRESETS.find((p) => p.id === presetId);
    if (found) {
      setForm(found.form);
    }
  };

  // Allow Ctrl+Enter / Cmd+Enter to submit
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && !busy) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-sm">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-ink">Design Celebration</h2>
          <span className="text-xs font-semibold uppercase tracking-wider text-rose bg-rose-light px-2 py-0.5 rounded-full">
            Intake
          </span>
        </div>
        <p className="mt-1 text-xs text-ink-muted">
          Fill in details or select a curated Indian celebration scenario below.
        </p>
      </div>

      {/* Preset Scenarios */}
      <div className="mb-5 rounded-xl border border-border/80 bg-mist/60 p-3">
        <label htmlFor="preset-select" className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-ink">
          <SparklesIcon className="w-3.5 h-3.5 text-marigold" />
          <span>Quick Demo Presets:</span>
        </label>
        <select
          id="preset-select"
          value={selectedPreset}
          onChange={(e) => handleApplyPreset(e.target.value)}
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-xs font-medium text-ink focus:border-rose focus:ring-1 focus:ring-rose"
        >
          <option value="">— Select a pre-configured celebration —</option>
          {PRESETS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title} ({p.badge})
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={onSubmit} onKeyDown={handleKeyDown} className="space-y-4">
        {/* Event Type */}
        <div>
          <label htmlFor="event_type" className="block text-xs font-semibold text-ink">
            Event Type <span className="text-rose">*</span>
          </label>
          <select
            id="event_type"
            value={form.event_type}
            onChange={setField("event_type")}
            className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink focus:border-rose focus:ring-1 focus:ring-rose"
            required
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Date and Guests */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="event_date" className="block text-xs font-semibold text-ink">
              Date <span className="text-rose">*</span>
            </label>
            <div className="relative mt-1">
              <input
                id="event_date"
                type="date"
                min={todayIso}
                value={form.event_date}
                onChange={setField("event_date")}
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink focus:border-rose focus:ring-1 focus:ring-rose"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="guests" className="block text-xs font-semibold text-ink">
              Guests <span className="text-rose">*</span>
            </label>
            <div className="relative mt-1">
              <input
                id="guests"
                type="number"
                min="1"
                max="5000"
                value={form.guests}
                onChange={setField("guests")}
                placeholder="150"
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink focus:border-rose focus:ring-1 focus:ring-rose"
                required
              />
            </div>
          </div>
        </div>

        {/* Budget & Currency */}
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="budget" className="block text-xs font-semibold text-ink">
              Total Budget <span className="text-rose">*</span>
            </label>
            {form.budget ? (
              <span className="text-xs font-semibold text-teal">
                {formatCurrency(form.budget, form.currency)}
              </span>
            ) : null}
          </div>
          <div className="mt-1 grid grid-cols-[1fr_84px] gap-2">
            <input
              id="budget"
              type="number"
              min="1000"
              step="1000"
              value={form.budget}
              onChange={setField("budget")}
              placeholder="1500000"
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink focus:border-rose focus:ring-1 focus:ring-rose"
              required
            />
            <label htmlFor="currency" className="sr-only">Currency</label>
            <select
              id="currency"
              value={form.currency}
              onChange={setField("currency")}
              className="rounded-lg border border-border bg-white px-2.5 py-2 text-sm font-semibold text-ink focus:border-rose focus:ring-1 focus:ring-rose"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-xs font-semibold text-ink">
            City or Venue Area <span className="text-rose">*</span>
          </label>
          <input
            id="location"
            type="text"
            maxLength={120}
            value={form.location}
            onChange={setField("location")}
            placeholder="e.g. Pune, Maharashtra"
            className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink focus:border-rose focus:ring-1 focus:ring-rose"
            required
          />
        </div>

        {/* Vibe */}
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="vibe" className="block text-xs font-semibold text-ink">
              Aesthetic & Vibe
            </label>
            <span className="text-[10px] text-ink-light">{(form.vibe || "").length}/300</span>
          </div>
          <input
            id="vibe"
            type="text"
            maxLength={300}
            value={form.vibe}
            onChange={setField("vibe")}
            placeholder="e.g. Intimate, colourful, marigold & mogra, energetic"
            className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink focus:border-rose focus:ring-1 focus:ring-rose"
          />
        </div>

        {/* Culture & Traditions */}
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="culture" className="block text-xs font-semibold text-ink">
              Culture, Rituals & Diet
            </label>
            <span className="text-[10px] text-ink-light">{(form.culture || "").length}/300</span>
          </div>
          <input
            id="culture"
            type="text"
            maxLength={300}
            value={form.culture}
            onChange={setField("culture")}
            placeholder="e.g. Maharashtrian Hindu, strictly vegetarian feast"
            className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink focus:border-rose focus:ring-1 focus:ring-rose"
          />
        </div>

        {/* Must-Haves */}
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="must_haves" className="block text-xs font-semibold text-ink">
              Specific Must-Haves
            </label>
            <span className="text-[10px] text-ink-light">{(form.must_haves || "").length}/400</span>
          </div>
          <textarea
            id="must_haves"
            rows="2"
            maxLength={400}
            value={form.must_haves}
            onChange={setField("must_haves")}
            placeholder="e.g. Live Tutari troupe, eco-friendly mandap, live Puran Poli station"
            className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink focus:border-rose focus:ring-1 focus:ring-rose"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!!busy || rateLimitCountdown > 0}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-marigold to-marigold-hover px-4 py-3 text-base font-bold text-ink shadow-sm hover:opacity-95 disabled:opacity-50 transition-all focus-visible:ring-2 focus-visible:ring-rose"
        >
          {busy === "all" ? (
            <>
              <RefreshCwIcon className="w-5 h-5 animate-spin" />
              <span>Architecting Celebration…</span>
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5" />
              <span>{rateLimitCountdown > 0 ? `Wait ${rateLimitCountdown}s` : "Plan My Celebration"}</span>
            </>
          )}
        </button>

        <p className="text-center text-[11px] text-ink-light">
          Tip: Press <kbd className="rounded border border-border bg-mist px-1 py-0.5 text-[10px]">Ctrl</kbd> + <kbd className="rounded border border-border bg-mist px-1 py-0.5 text-[10px]">Enter</kbd> to run
        </p>

        {/* Error Alert */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-xl border border-rose/30 bg-rose-light/50 p-3.5 text-xs text-rose"
          >
            <AlertCircleIcon className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{error}</div>
          </div>
        )}
      </form>
    </div>
  );
});

