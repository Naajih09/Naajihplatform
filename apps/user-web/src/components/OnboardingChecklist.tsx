import { Check, ChevronDown, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getApiBaseUrl } from "../lib/api-base";

type OnboardingStep = {
  key: string;
  title: string;
  ctaLabel: string;
  ctaTo: string;
  completed: boolean;
  completedAt?: string | null;
};

type OnboardingState = {
  percent: number;
  complete: boolean;
  dismissed: boolean;
  completedCount: number;
  totalSteps: number;
  nextStep?: OnboardingStep | null;
  steps: OnboardingStep[];
};

const getAuthHeaders = () => {
  const token =
    localStorage.getItem("accessToken") ||
    localStorage.getItem("access_token") ||
    "";
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default function OnboardingChecklist() {
  const API_BASE = getApiBaseUrl();
  const [state, setState] = useState<OnboardingState | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadOnboarding = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/users/me/onboarding`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) return;
      const data = await res.json();
      setState(data);
      setCollapsed(Boolean(data.dismissed && data.complete));
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  useEffect(() => {
    loadOnboarding();
    window.addEventListener("naajih:onboarding-refresh", loadOnboarding);
    return () =>
      window.removeEventListener("naajih:onboarding-refresh", loadOnboarding);
  }, [loadOnboarding]);

  const dismiss = async () => {
    await fetch(`${API_BASE}/users/me/onboarding/dismiss`, {
      method: "POST",
      headers: getAuthHeaders(),
    });
    setCollapsed(true);
  };

  if (loading || !state) return null;
  if (state.dismissed && state.complete && collapsed) {
    return (
      <button
        type="button"
        onClick={() => setCollapsed(false)}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-gray-800 dark:bg-[#151518] dark:text-white dark:hover:bg-white/5"
      >
        Show onboarding <ChevronDown size={16} />
      </button>
    );
  }

  const nextStep = state.nextStep || state.steps.find((step) => !step.completed);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#151518]">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Guided Start
          </p>
          <h3 className="mt-1 text-lg font-black text-slate-900 dark:text-white">
            {state.complete ? "Onboarding complete" : "Your next best steps"}
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
            {state.complete
              ? "You have completed the core setup for Cohort 1."
              : nextStep
                ? nextStep.title
                : "Keep building your trusted platform presence."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 dark:bg-white/5 dark:text-white">
            {state.percent}% complete
          </div>
          {state.complete && (
            <button
              type="button"
              onClick={dismiss}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/5 dark:hover:text-white"
              aria-label="Dismiss onboarding checklist"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${state.percent}%` }}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2">
        {state.steps.map((step) => (
          <Link
            key={step.key}
            to={step.ctaTo}
            className={`flex items-start gap-3 rounded-2xl border px-4 py-3 transition ${
              step.completed
                ? "border-primary/30 bg-primary/5"
                : "border-slate-200 hover:border-primary/50 hover:bg-slate-50 dark:border-gray-800 dark:hover:bg-white/5"
            }`}
          >
            <span
              className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border ${
                step.completed
                  ? "border-primary bg-primary text-black"
                  : "border-slate-300 text-transparent dark:border-gray-700"
              }`}
            >
              <Check size={12} strokeWidth={3} />
            </span>
            <span className="min-w-0 flex-1">
              <span
                className={`block text-sm font-bold ${
                  step.completed
                    ? "text-slate-500 line-through dark:text-gray-500"
                    : "text-slate-900 dark:text-white"
                }`}
              >
                {step.title}
              </span>
              {!step.completed && (
                <span className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-primary">
                  {step.ctaLabel} <ChevronRight size={12} />
                </span>
              )}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
