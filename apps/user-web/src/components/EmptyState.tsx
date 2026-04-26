import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
  compact?: boolean;
};

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
  compact = false,
}: EmptyStateProps) {
  const content = (
    <div className={`rounded-2xl border border-dashed border-slate-300 bg-white text-center shadow-sm dark:border-white/10 dark:bg-[#151518] ${compact ? 'p-6' : 'p-10'}`}>
      <h3 className={`${compact ? 'text-base' : 'text-lg'} font-bold text-slate-900 dark:text-white`}>
        {title}
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-gray-400">
        {description}
      </p>
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

  return content;
}
