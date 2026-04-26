import { useCallback, useEffect, useState } from 'react';
import { CheckCircle, XCircle, Users, Filter, Upload } from 'lucide-react';
import api from '../utils/api';
import EmptyState from '../components/EmptyState';

const statusOptions = ['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const;
type EnrollmentFilter = (typeof statusOptions)[number];
type EnrollmentStatus = Exclude<EnrollmentFilter, 'ALL'>;

interface AdminProfile {
  firstName?: string;
  lastName?: string;
}

interface EnrollmentUser {
  email?: string;
  entrepreneurProfile?: AdminProfile;
  investorProfile?: AdminProfile;
}

interface EnrollmentProgram {
  title?: string;
  cohort?: string;
}

interface Enrollment {
  id: string;
  status: EnrollmentStatus;
  user?: EnrollmentUser;
  program?: EnrollmentProgram;
  enrolledAt?: string;
}

const AcademyEnrollments = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<EnrollmentFilter>('PENDING');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [enrollmentCsvFile, setEnrollmentCsvFile] = useState<File | null>(null);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [previewRows, setPreviewRows] = useState<string[][]>([]);
  const [previewHeaders, setPreviewHeaders] = useState<string[]>([]);
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

  const fetchEnrollments = useCallback(async () => {
    setLoading(true);
    try {
      const params =
        statusFilter !== 'ALL' ? { status: statusFilter as EnrollmentStatus } : undefined;
      const res = await api.get('/academy/admin/enrollments', { params });
      setEnrollments(res.data || []);
    } catch {
      showToast('Failed to load enrollments.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast, statusFilter]);

  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  const handleUpdate = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      await api.patch(`/academy/admin/enrollments/${id}`, { status });
      showToast(`Enrollment ${status.toLowerCase()}.`, 'success');
      fetchEnrollments();
    } catch {
      showToast('Failed to update enrollment.', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const downloadEnrollmentTemplate = () => {
    const headers = ['userEmail', 'programTitle', 'programId', 'status'];
    const sample = ['user@example.com', 'Build a Profitable Business in 30 Days', '', 'APPROVED'];
    const csv = `${headers.join(',')}\n${sample.join(',')}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'enrollment-template.csv';
    link.click();
  };

  const parseCsvPreview = (text: string) => {
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (!lines.length) {
      setPreviewHeaders([]);
      setPreviewRows([]);
      return;
    }
    const headers = lines[0].split(',').map((h) => h.trim());
    const rows = lines.slice(1, 6).map((line) => line.split(',').map((v) => v.trim()));
    setPreviewHeaders(headers);
    setPreviewRows(rows);
  };

  const handleFileChange = (file?: File | null) => {
    setEnrollmentCsvFile(file || null);
    if (!file) {
      setPreviewHeaders([]);
      setPreviewRows([]);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => parseCsvPreview(String(reader.result || ''));
    reader.readAsText(file);
  };

  const handleImportEnrollments = async () => {
    if (!enrollmentCsvFile) {
      showToast('Select a CSV file first.', 'error');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('file', enrollmentCsvFile);
      const res = await api.post('/academy/admin/enrollments/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImportErrors(res.data?.errors || []);
      showToast(
        `Imported ${res.data?.created || 0} enrollments. ${res.data?.failed || 0} failed.`,
        res.data?.errors?.length ? 'error' : 'success',
      );
      setEnrollmentCsvFile(null);
      setPreviewHeaders([]);
      setPreviewRows([]);
      fetchEnrollments();
    } catch {
      showToast('Failed to import enrollments.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2 text-slate-900 dark:text-white">
            <Users size={20} className="text-primary" />
            Enrollment Requests
          </h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">
            Approve or reject cohort enrollment requests.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-slate-500 dark:text-gray-400" />
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as EnrollmentFilter)
            }
            className="admin-input px-3 py-2 text-sm"
            id="status-filter-select"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="admin-surface rounded-2xl p-6 space-y-3">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Upload size={18} className="text-primary" /> Bulk Import Enrollments (CSV)
        </h2>
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <label htmlFor="status-filter-select" className="sr-only">Filter by Status</label> 
          <input
            type="file"
            accept=".csv"
            onChange={(event) => handleFileChange(event.target.files?.[0])}
            className="text-sm text-slate-500 dark:text-gray-400"
            id="enrollment-csv-upload"
          />
          <label htmlFor="enrollment-csv-upload" className="sr-only">Upload Enrollment CSV</label> 
          <button
            onClick={handleImportEnrollments}
            className="bg-primary text-neutral-dark font-bold px-4 py-2 rounded-lg"
          >
            Import CSV
          </button>
          <button
            onClick={downloadEnrollmentTemplate}
            className="admin-button-secondary px-4 py-2 rounded-lg text-sm"
          >
            Download Template
          </button>
        </div>
        {previewHeaders.length > 0 && (
          <div className="admin-surface-muted rounded-lg p-3 text-xs text-slate-700 dark:text-gray-300">
            <div className="font-bold text-slate-500 dark:text-gray-400 mb-2">Preview</div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr>
                    {previewHeaders.map((header) => (
                      <th key={header} className="text-left px-2 py-1 text-slate-500 dark:text-gray-400">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewRows.map((row, index) => (
                    <tr key={`${row.join('-')}-${index}`}>
                      {row.map((cell, cellIndex) => (
                        <td key={`${cell}-${cellIndex}`} className="px-2 py-1">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {importErrors.length > 0 && (
          <div className="text-xs text-red-400 space-y-1">
            {importErrors.map((err, index) => (
              <div key={`${err}-${index}`}>{err}</div>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-slate-500 dark:text-gray-400">Loading enrollments...</div>
      ) : enrollments.length === 0 ? (
        <div className="admin-surface">
          <EmptyState
            title="No enrollment requests found"
            description="No learner enrollments match the current filters. New requests will show here for review."
            actionLabel="Refresh enrollments"
            onAction={fetchEnrollments}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {enrollments.map((enrollment) => {
            const profile =
              enrollment.user?.entrepreneurProfile ||
              enrollment.user?.investorProfile ||
              {};
            const userName = `${profile.firstName || ''} ${profile.lastName || ''}`.trim();
            return (
              <div
                key={enrollment.id}
                className="admin-surface-muted rounded-2xl p-6 space-y-3"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {enrollment.program?.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-gray-400">
                      {enrollment.program?.cohort || 'No cohort set'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-gray-400">
                      Requested by {userName || enrollment.user?.email}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-gray-500">
                      {enrollment.enrolledAt
                        ? new Date(enrollment.enrolledAt).toLocaleString('en-NG')
                        : 'Unknown request date'}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full ${
                      enrollment.status === 'APPROVED'
                        ? 'bg-green-500/20 text-green-400'
                        : enrollment.status === 'REJECTED'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}
                  >
                    {enrollment.status}
                  </span>
                </div>
                {enrollment.status === 'PENDING' && (
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleUpdate(enrollment.id, 'APPROVED')}
                      disabled={updatingId === enrollment.id}
                      className="bg-green-500 text-black font-bold px-4 py-2 rounded-lg text-xs"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleUpdate(enrollment.id, 'REJECTED')}
                      disabled={updatingId === enrollment.id}
                      className="bg-red-500 text-white font-bold px-4 py-2 rounded-lg text-xs"
                    >
                      Reject
                    </button>
                  </div>
                )}
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

export default AcademyEnrollments;
