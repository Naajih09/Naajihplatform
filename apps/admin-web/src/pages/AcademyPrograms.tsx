import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  PlusCircle,
  XCircle,
  CheckCircle,
  Upload,
  Trash2,
} from 'lucide-react';
import api from '../utils/api';

interface ProgramModuleCount {
  lessons?: number;
  tasks?: number;
}

interface ProgramModule {
  _count?: ProgramModuleCount;
}

interface Program {
  id: string;
  title?: string;
  description?: string;
  cohort?: string;
  isPremium?: boolean;
  _count?: { modules?: number };
  modules?: ProgramModule[];
}

const AcademyPrograms = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', description: '', cohort: '', isPremium: false });
  const [programCsvFile, setProgramCsvFile] = useState<File | null>(null);
  const [programImportErrors, setProgramImportErrors] = useState<string[]>([]);
  const [programPreviewHeaders, setProgramPreviewHeaders] = useState<string[]>([]);
  const [programPreviewRows, setProgramPreviewRows] = useState<string[][]>([]);
  const [deletingProgramId, setDeletingProgramId] = useState<string | null>(null);
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

  const fetchPrograms = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/academy/admin/programs');
      setPrograms(res.data || []);
    } catch {
      showToast('Failed to load programs.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  const handleCreate = async () => {
    if (!form.title.trim()) {
      showToast('Program title is required.', 'error');
      return;
    }
    try {
      await api.post('/academy/admin/programs', form);
      setForm({ title: '', description: '', cohort: '', isPremium: false });
      showToast('Program created.', 'success');
      fetchPrograms();
    } catch {
      showToast('Failed to create program.', 'error');
    }
  };

  const downloadProgramTemplate = () => {
    const headers = ['title', 'description', 'cohort', 'isPremium'];
    const sample = ['Startup Launchpad', 'Build your first MVP', 'Cohort 3 - Aug 2026', 'false'];
    const csv = `${headers.join(',')}\n${sample.join(',')}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'program-template.csv';
    link.click();
  };

  const handleImportPrograms = async () => {
    if (!programCsvFile) {
      showToast('Select a CSV file first.', 'error');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('file', programCsvFile);
      const res = await api.post('/academy/admin/programs/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProgramCsvFile(null);
      setProgramPreviewHeaders([]);
      setProgramPreviewRows([]);
      const errors = res.data?.errors || [];
      setProgramImportErrors(errors);
      showToast(
        `Imported ${res.data?.created || 0} programs. ${res.data?.failed || 0} failed.`,
        errors.length ? 'error' : 'success',
      );
      fetchPrograms();
    } catch {
      showToast('Failed to import programs.', 'error');
    }
  };

  const parseCsvPreview = (text: string) => {
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (!lines.length) {
      setProgramPreviewHeaders([]);
      setProgramPreviewRows([]);
      return;
    }
    const headers = lines[0].split(',').map((h) => h.trim());
    const rows = lines.slice(1, 6).map((line) => line.split(',').map((v) => v.trim()));
    setProgramPreviewHeaders(headers);
    setProgramPreviewRows(rows);
  };

  const handleProgramFileChange = (file?: File | null) => {
    setProgramCsvFile(file || null);
    if (!file) {
      setProgramPreviewHeaders([]);
      setProgramPreviewRows([]);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => parseCsvPreview(String(reader.result || ''));
    reader.readAsText(file);
  };

  const handleDeleteProgram = async (program: Program) => {
    const label = program.title || 'this program';
    const confirmed = window.confirm(
      `Delete "${label}" and all its modules, lessons, tasks, and enrollments? This cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setDeletingProgramId(program.id);
    try {
      await api.delete(`/academy/admin/programs/${program.id}`);
      setPrograms((prev) => prev.filter((item) => item.id !== program.id));
      showToast('Program deleted.', 'success');
    } catch (error: any) {
      showToast(
        error?.response?.data?.message || 'Failed to delete program.',
        'error',
      );
    } finally {
      setDeletingProgramId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Academy Programs</h1>
          <p className="text-slate-500 dark:text-gray-400">
            Create and manage ALX-style learning programs.
          </p>
        </div>
      </div>

      <div className="admin-surface rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <PlusCircle size={18} className="text-primary" /> Create Program
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            value={form.title}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, title: event.target.value }))
            }
            aria-label="Program title"
            placeholder="Program title"
            className="admin-input px-3 py-2 text-sm"
          />
          <input
            value={form.cohort}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, cohort: event.target.value }))
            }
            aria-label="Program cohort"
            placeholder="Cohort (e.g. Cohort 2 - Apr 2026)"
            className="admin-input px-3 py-2 text-sm"
          />
          <input
            value={form.description}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, description: event.target.value }))
            }
            aria-label="Program description"
            placeholder="Short description"
            className="admin-input px-3 py-2 text-sm"
          />
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={form.isPremium}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, isPremium: event.target.checked }))
              }
              className="accent-primary"
            />
            Premium program
          </label>
        </div>
        <button
          onClick={handleCreate}
          className="bg-primary text-neutral-dark font-bold px-4 py-2 rounded-lg"
        >
          Create Program
        </button>
      </div>

      <div className="admin-surface rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Upload size={18} className="text-primary" /> Bulk Import Programs (CSV)
        </h2>
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <input
            type="file"
            accept=".csv"
            onChange={(event) => handleProgramFileChange(event.target.files?.[0])}
            aria-label="Program CSV file"
            className="text-sm text-slate-500 dark:text-gray-400"
          />
          <button
            onClick={handleImportPrograms}
            className="bg-primary text-neutral-dark font-bold px-4 py-2 rounded-lg"
          >
            Import CSV
          </button>
          <button
            onClick={downloadProgramTemplate}
            className="admin-button-secondary px-4 py-2 rounded-lg text-sm"
          >
            Download Template
          </button>
        </div>
        {programImportErrors.length > 0 && (
          <div className="text-xs text-red-400 space-y-1">
            {programImportErrors.map((err, index) => (
              <div key={`${err}-${index}`}>{err}</div>
            ))}
          </div>
        )}
        {programPreviewHeaders.length > 0 && (
          <div className="admin-surface-muted rounded-lg p-3 text-xs text-slate-700 dark:text-gray-300">
            <div className="font-bold text-slate-500 dark:text-gray-400 mb-2">Preview</div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr>
                    {programPreviewHeaders.map((header) => (
                      <th key={header} className="text-left px-2 py-1 text-slate-500 dark:text-gray-400">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {programPreviewRows.map((row, index) => (
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
      </div>

      {loading ? (
        <div className="text-slate-500 dark:text-gray-400">Loading programs...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {programs.map((program) => (
            <div
              key={program.id}
              className="admin-surface-muted rounded-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <BookOpen size={18} className="text-primary" /> {program.title}
                  </h3>
                  <div className="mt-2">
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${program.isPremium ? 'bg-primary/20 text-primary' : 'bg-slate-200 text-slate-700 dark:bg-white/5 dark:text-gray-300'}`}>
                      {program.isPremium ? 'Premium' : 'Free'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                    {program.cohort || 'No cohort set'}
                  </p>
                </div>
                <Link
                  to={`/admin/academy/${program.id}`}
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  Manage
                </Link>
              </div>
              <p className="text-sm text-slate-500 dark:text-gray-400">
                {program.description || 'No description yet.'}
              </p>
              <div className="grid grid-cols-3 gap-4 text-xs text-slate-500 dark:text-gray-400">
                <div>
                  <p className="uppercase">Modules</p>
                  <p className="text-lg text-slate-900 dark:text-white font-bold">
                    {program._count?.modules || 0}
                  </p>
                </div>
                <div>
                  <p className="uppercase">Lessons</p>
                  <p className="text-lg text-slate-900 dark:text-white font-bold">
                    {program.modules?.reduce(
                      (total: number, mod: ProgramModule) =>
                        total + (mod._count?.lessons || 0),
                      0,
                    )}
                  </p>
                </div>
                <div>
                  <p className="uppercase">Tasks</p>
                  <p className="text-lg text-slate-900 dark:text-white font-bold">
                    {program.modules?.reduce(
                      (total: number, mod: ProgramModule) => total + (mod._count?.tasks || 0),
                      0,
                    )}
                  </p>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => handleDeleteProgram(program)}
                  disabled={deletingProgramId === program.id}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-bold text-red-500 transition-colors hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Trash2 size={16} />
                  {deletingProgramId === program.id ? 'Deleting...' : 'Delete Program'}
                </button>
              </div>
            </div>
          ))}
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

export default AcademyPrograms;
