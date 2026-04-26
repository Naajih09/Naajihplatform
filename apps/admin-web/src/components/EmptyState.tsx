import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
};

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center dark:border-white/10 dark:bg-white/[0.03]">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-gray-400">{description}</p>
      {actionLabel && (actionTo || onAction) && (
        <div className="mt-4">
          {actionTo ? (
            <Link
              to={actionTo}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-black transition hover:brightness-110"
            >
              {actionLabel}
              <ChevronRight size={16} />
            </Link>
          ) : (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-black transition hover:brightness-110"
            >
              {actionLabel}
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
