import { useCallback, useEffect, useState } from 'react';
import { CheckCircle, XCircle, ClipboardCheck, Filter } from 'lucide-react';
import api from '../utils/api';

const statusOptions = ['ALL', 'PENDING', 'SUBMITTED', 'APPROVED', 'REJECTED'] as const;
type SubmissionFilter = (typeof statusOptions)[number];
type SubmissionStatus = Exclude<SubmissionFilter, 'ALL'>;

interface SubmissionUser {
  email?: string;
  entrepreneurProfile?: { firstName?: string; lastName?: string };
  investorProfile?: { firstName?: string; lastName?: string };
}

interface SubmissionTask {
  title?: string;
  module?: {
    title?: string;
    program?: {
      title?: string;
    };
  };
}

interface SubmissionRecord {
  id: string;
  status: SubmissionStatus;
  user?: SubmissionUser;
  task?: SubmissionTask;
  submittedAt?: string;
  submissionUrl?: string;
  feedback?: string;
}

const AcademySubmissions = () => {
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<SubmissionFilter>('ALL');
  const [feedbackMap, setFeedbackMap] = useState<Record<string, string>>({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    show: false,
    message: '',
    type: 'success',
  });

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type }), 2500);
  }, []);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const params =
        statusFilter !== 'ALL' ? { status: statusFilter } : undefined;
      const res = await api.get('/academy/admin/submissions', { params });
      setSubmissions(res.data || []);
    } catch {
      showToast('Failed to load submissions.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast, statusFilter]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleUpdate = async (submissionId: string, status: SubmissionStatus) => {
    setUpdatingId(submissionId);
    try {
      await api.patch(`/academy/admin/submissions/${submissionId}`, {
        status,
        feedback: feedbackMap[submissionId],
      });
      showToast(`Submission ${status.toLowerCase()}.`, 'success');
      fetchSubmissions();
    } catch {
      showToast('Failed to update submission.', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2 text-slate-900 dark:text-white">
            <ClipboardCheck size={20} className="text-primary" />
            Assignment Review
          </h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">
            Review and approve learner submissions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-slate-500 dark:text-gray-400" />
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as SubmissionFilter)
            }
            aria-label="Filter submissions by status"
            className="admin-input px-3 py-2 text-sm"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-slate-500 dark:text-gray-400">Loading submissions...</div>
      ) : submissions.length === 0 ? (
        <div className="admin-surface rounded-2xl p-6 text-slate-500 dark:text-gray-400">
          <div className="mx-auto max-w-lg rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center dark:border-white/10 dark:bg-white/[0.03]">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm dark:bg-[#151518] dark:text-gray-400">
              0
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No submissions found</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-gray-400">
              Try a different status or program filter. Student task submissions will appear here once they are sent in.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => {
            const profile =
              submission.user?.entrepreneurProfile ||
              submission.user?.investorProfile ||
              {};
            const userName = `${profile.firstName || ''} ${profile.lastName || ''}`.trim();
            const programTitle = submission.task?.module?.program?.title || 'Unknown Program';
            const moduleTitle = submission.task?.module?.title || 'Module';

            return (
              <div
                key={submission.id}
                className="admin-surface-muted rounded-2xl p-6 space-y-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {submission.task?.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-gray-400">
                      {programTitle} · {moduleTitle}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-gray-400">
                      Submitted by {userName || submission.user?.email}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-gray-500">
                      {submission.submittedAt
                        ? new Date(submission.submittedAt).toLocaleString('en-NG')
                        : 'Unknown submission date'}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full ${
                      submission.status === 'APPROVED'
                        ? 'bg-green-500/20 text-green-400'
                        : submission.status === 'REJECTED'
                        ? 'bg-red-500/20 text-red-400'
                        : submission.status === 'SUBMITTED'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-gray-400'
                    }`}
                  >
                    {submission.status}
                  </span>
                </div>

                {submission.submissionUrl && (
                  <a
                    href={submission.submissionUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-primary underline"
                  >
                    View Submission
                  </a>
                )}

                <textarea
                  placeholder="Feedback (optional)"
                  value={feedbackMap[submission.id] || submission.feedback || ''}
                  onChange={(event) =>
                    setFeedbackMap((prev) => ({
                      ...prev,
                      [submission.id]: event.target.value,
                    }))
                  }
                  aria-label={`Feedback for ${submission.task?.title || 'submission'}`}
                  className="admin-input px-3 py-2 text-xs w-full min-h-[80px]"
                />

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleUpdate(submission.id, 'APPROVED')}
                    disabled={updatingId === submission.id}
                    className="bg-green-500 text-black font-bold px-4 py-2 rounded-lg text-xs"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleUpdate(submission.id, 'REJECTED')}
                    disabled={updatingId === submission.id}
                    className="bg-red-500 text-white font-bold px-4 py-2 rounded-lg text-xs"
                  >
                    Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {toast.show && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded shadow-lg text-white font-medium flex items-center gap-2 ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default AcademySubmissions;
