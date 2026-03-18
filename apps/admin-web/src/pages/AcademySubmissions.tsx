import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, ClipboardCheck, Filter } from 'lucide-react';
import api from '../utils/api';

const statusOptions = ['ALL', 'PENDING', 'SUBMITTED', 'APPROVED', 'REJECTED'];

const AcademySubmissions = () => {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
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

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type }), 2500);
  };

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const params =
        statusFilter !== 'ALL' ? { status: statusFilter } : undefined;
      const res = await api.get('/academy/admin/submissions', { params });
      setSubmissions(res.data || []);
    } catch (error) {
      showToast('Failed to load submissions.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [statusFilter]);

  const handleUpdate = async (submissionId: string, status: string) => {
    setUpdatingId(submissionId);
    try {
      await api.patch(`/academy/admin/submissions/${submissionId}`, {
        status,
        feedback: feedbackMap[submissionId],
      });
      showToast(`Submission ${status.toLowerCase()}.`, 'success');
      fetchSubmissions();
    } catch (error) {
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
            onChange={(event) => setStatusFilter(event.target.value)}
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
          No submissions found.
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
                      {new Date(submission.submittedAt).toLocaleString('en-NG')}
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
