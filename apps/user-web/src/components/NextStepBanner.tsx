import { ChevronRight, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";

type NextStepBannerProps = {
  onboarding?: {
    nextStep?: {
      title: string;
      ctaLabel: string;
      ctaTo: string;
    } | null;
    profileQuality?: {
      percent?: number;
      missing?: string[];
    };
  } | null;
  fallbackTitle?: string;
  fallbackBody?: string;
  fallbackCta?: string;
  fallbackTo?: string;
};

export default function NextStepBanner({
  onboarding,
  fallbackTitle = "Keep moving",
  fallbackBody = "Complete the next high-impact action to improve trust and matching.",
  fallbackCta = "Continue",
  fallbackTo = "/dashboard",
}: NextStepBannerProps) {
  const step = onboarding?.nextStep;
  const profilePercent = onboarding?.profileQuality?.percent;
  const title = step?.title || fallbackTitle;
  const cta = step?.ctaLabel || fallbackCta;
  const to = step?.ctaTo || fallbackTo;
  const body =
    typeof profilePercent === "number" && profilePercent < 100
      ? `Your profile is ${profilePercent}% complete. Add the missing details to improve matching.`
      : fallbackBody;

  return (
    <div className="rounded-2xl border border-primary/25 bg-primary/10 p-4 text-slate-900 dark:text-white">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <Lightbulb className="mt-0.5 shrink-0 text-primary" size={20} />
          <div>
            <h3 className="font-black">{title}</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-gray-300">
              {body}
            </p>
          </div>
        </div>
        <Link
          to={to}
          className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-black hover:brightness-110"
        >
          {cta} <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
