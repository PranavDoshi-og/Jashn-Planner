import { useState, useRef, useCallback, useEffect } from "react";
import { PRESETS } from "../types/presets";

const API = import.meta.env.VITE_API_URL ?? "";

/**
 * Execute an HTTP POST request with abort signal and error normalization.
 * @param {string} path - Endpoint path.
 * @param {object} body - Request body payload.
 * @param {AbortSignal} signal - AbortSignal for request cancellation.
 * @returns {Promise<any>} The parsed JSON response.
 */
async function post(path, body, signal) {
  const r = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });
  if (!r.ok) {
    const e = await r.json().catch(() => ({}));
    const message =
      typeof e.detail === "string"
        ? e.detail
        : r.status === 429
        ? "Too many requests. Please wait a minute and try again."
        : "Check the form fields and try again.";
    const err = new Error(message);
    err.status = r.status;
    throw err;
  }
  return r.json();
}

/**
 * Custom hook encapsulating celebration planning business logic, section regeneration,
 * in-flight request cancellation, and rate limit cooldown handling.
 * @returns {object} Plan management state and handler actions.
 */
export function usePlanManager() {
  const [form, setForm] = useState(PRESETS[0].form);
  const [intake, setIntake] = useState(null);
  const [plan, setPlan] = useState(null);
  const [total, setTotal] = useState(PRESETS[0].form.budget);
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState("");
  const [rateLimitCountdown, setRateLimitCountdown] = useState(0);

  const ctrl = useRef(null);

  // Rate-limit countdown timer
  useEffect(() => {
    if (rateLimitCountdown <= 0) return;
    const interval = setInterval(() => {
      setRateLimitCountdown((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [rateLimitCountdown]);

  const nextSignal = useCallback(() => {
    ctrl.current?.abort();
    ctrl.current = new AbortController();
    return ctrl.current.signal;
  }, []);

  const generate = useCallback(
    async (e, onSuccess) => {
      if (e) e.preventDefault();
      setBusy("all");
      setError("");
      try {
        const data = await post("/api/plan", form, nextSignal());
        setPlan(data);
        setIntake(form);
        setTotal(form.budget);
        if (onSuccess) onSuccess(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
          if (err.status === 429) {
            setRateLimitCountdown(60);
          }
        }
      } finally {
        setBusy(null);
      }
    },
    [form, nextSignal]
  );

  const regen = useCallback(
    async (section, tweak, onSuccess) => {
      setBusy(section);
      setError("");
      try {
        const data = await post(
          "/api/section",
          {
            intake: { ...intake, budget: total },
            section,
            tweak,
            categories: plan?.budget?.map((b) => b.category) || [],
          },
          nextSignal()
        );
        setPlan((prev) => ({ ...prev, [section]: data[section] }));
        if (onSuccess) onSuccess(section, data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
          if (err.status === 429) {
            setRateLimitCountdown(60);
          }
        }
      } finally {
        setBusy(null);
      }
    },
    [intake, total, plan, nextSignal]
  );

  return {
    form,
    setForm,
    intake,
    plan,
    setPlan,
    total,
    setTotal,
    busy,
    error,
    setError,
    rateLimitCountdown,
    generate,
    regen,
  };
}
