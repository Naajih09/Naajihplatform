import { Check, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type ChecklistKey = 'profile' | 'opportunity' | 'explore' | 'message';

type ChecklistState = Record<ChecklistKey, boolean>;

const defaultState: ChecklistState = {
  profile: false,
  opportunity: false,
  explore: false,
  message: false,
};

const steps: Array<{
  key: ChecklistKey;
  label: string;
  description: string;
  path: string;
}> = [
  {
    key: 'profile',
    label: 'Complete profile',
    description: 'Set up your public profile so people can find you.',
    path: '/dashboard/profile',
  },
  {
    key: 'opportunity',
    label: 'Create your first opportunity',
    description: 'Share a pitch or business opportunity with the community.',
    path: '/dashboard/create-pitch',
  },
  {
    key: 'explore',
    label: 'Explore opportunities',
    description: 'Browse available opportunities and programs.',
    path: '/dashboard/opportunities',
  },
  {
    key: 'message',
    label: 'Send your first message',
    description: 'Start a conversation with a founder, investor, or mentor.',
    path: '/dashboard/messages',
  },
];

export default function OnboardingChecklist() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const profile = user.entrepreneurProfile || user.investorProfile || {};
  const storageKey = `onboarding-checklist:${user.id || 'guest'}`;

  const [completed, setCompleted] = useState<ChecklistState>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      const parsed = stored ? (JSON.parse(stored) as Partial<ChecklistState>) : {};
      return {
        ...defaultState,
        ...parsed,
        profile: Boolean(profile.firstName && profile.lastName) || Boolean(parsed.profile),
      };
    } catch {
      return {
        ...defaultState,
        profile: Boolean(profile.firstName && profile.lastName),
      };
    }
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(completed));
  }, [completed, storageKey]);

  const completedCount = steps.filter((step) => completed[step.key]).length;

  const handleStepClick = (step: (typeof steps)[number]) => {
    setCompleted((prev) => ({ ...prev, [step.key]: true }));
    navigate(step.path);
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#151518]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-gray-400">
            Onboarding
          </p>
          <h3 className="mt-1 text-lg font-black text-slate-900 dark:text-white">
            Get started in 4 steps
          </h3>
        </div>
        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 dark:bg-white/5 dark:text-white">
          {completedCount}/4 completed
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {steps.map((step) => {
          const isDone = completed[step.key];

          return (
            <button
              key={step.key}
              type="button"
              onClick={() => handleStepClick(step)}
              className={`flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                isDone
                  ? 'border-primary/30 bg-primary/5'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:border-gray-800 dark:hover:bg-white/5'
              }`}
            >
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                  isDone
                    ? 'border-primary bg-primary text-black'
                    : 'border-slate-300 text-transparent dark:border-gray-700'
                }`}
                aria-hidden="true"
              >
                <Check size={12} strokeWidth={3} />
              </span>

              <span className="flex-1">
                <span
                  className={`block text-sm font-semibold ${
                    isDone ? 'text-slate-500 line-through dark:text-gray-500' : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {step.label}
                </span>
                <span className="mt-0.5 block text-xs text-slate-500 dark:text-gray-400">
                  {step.description}
                </span>
              </span>

              <ChevronRight
                size={16}
                className="mt-1 shrink-0 text-slate-400 dark:text-gray-500"
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}
