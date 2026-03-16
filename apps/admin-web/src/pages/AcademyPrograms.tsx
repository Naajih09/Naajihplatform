import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, PlusCircle, XCircle, CheckCircle, Upload } from 'lucide-react';
import api from '../utils/api';

const AcademyPrograms = () => {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', description: '', cohort: '' });
  const [programCsvFile, setProgramCsvFile] = useState<File | null>(null);
  const [programImportErrors, setProgramImportErrors] = useState<string[]>([]);
  const [programPreviewHeaders, setProgramPreviewHeaders] = useState<string[]>([]);
  const [programPreviewRows, setProgramPreviewRows] = useState<string[][]>([]);
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

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const res = await api.get('/academy/admin/programs');
      setPrograms(res.data || []);
    } catch (error) {
      showToast('Failed to load programs.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleCreate = async () => {
    if (!form.title.trim()) {
      showToast('Program title is required.', 'error');
      return;
    }
    try {
      await api.post('/academy/admin/programs', form);
      setForm({ title: '', description: '', cohort: '' });
      showToast('Program created.', 'success');
      fetchPrograms();
    } catch (error) {
      showToast('Failed to create program.', 'error');
    }
  };

  const downloadProgramTemplate = () => {
    const headers = ['title', 'description', 'cohort'];
    const sample = ['Startup Launchpad', 'Build your first MVP', 'Cohort 3 - Aug 2026'];
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
    } catch (error) {
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

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black">Academy Programs</h1>
          <p className="text-gray-400">
            Create and manage ALX-style learning programs.
          </p>
        </div>
      </div>

      <div className="bg-[#1d1d20] border border-gray-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <PlusCircle size={18} className="text-primary" /> Create Program
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            value={form.title}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, title: event.target.value }))
            }
            placeholder="Program title"
            className="bg-black/30 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
          />
          <input
            value={form.cohort}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, cohort: event.target.value }))
            }
            placeholder="Cohort (e.g. Cohort 2 - Apr 2026)"
            className="bg-black/30 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
          />
          <input
            value={form.description}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, description: event.target.value }))
            }
            placeholder="Short description"
            className="bg-black/30 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
          />
        </div>
        <button
          onClick={handleCreate}
          className="bg-primary text-neutral-dark font-bold px-4 py-2 rounded-lg"
        >
          Create Program
        </button>
      </div>

      <div className="bg-[#1d1d20] border border-gray-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Upload size={18} className="text-primary" /> Bulk Import Programs (CSV)
        </h2>
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <input
            type="file"
            accept=".csv"
            onChange={(event) => handleProgramFileChange(event.target.files?.[0])}
            className="text-sm text-gray-400"
          />
          <button
            onClick={handleImportPrograms}
            className="bg-primary text-neutral-dark font-bold px-4 py-2 rounded-lg"
          >
            Import CSV
          </button>
          <button
            onClick={downloadProgramTemplate}
            className="border border-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm"
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
          <div className="bg-black/30 border border-gray-800 rounded-lg p-3 text-xs text-gray-300">
            <div className="font-bold text-gray-400 mb-2">Preview</div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr>
                    {programPreviewHeaders.map((header) => (
                      <th key={header} className="text-left px-2 py-1 text-gray-400">
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
        <div className="text-gray-400">Loading programs...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {programs.map((program) => (
            <div
              key={program.id}
              className="bg-[#151518] border border-gray-800 rounded-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <BookOpen size={18} className="text-primary" /> {program.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
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
              <p className="text-sm text-gray-400">
                {program.description || 'No description yet.'}
              </p>
              <div className="grid grid-cols-3 gap-4 text-xs text-gray-400">
                <div>
                  <p className="uppercase">Modules</p>
                  <p className="text-lg text-white font-bold">
                    {program._count?.modules || 0}
                  </p>
                </div>
                <div>
                  <p className="uppercase">Lessons</p>
                  <p className="text-lg text-white font-bold">
                    {program.modules?.reduce(
                      (total: number, mod: any) =>
                        total + (mod._count?.lessons || 0),
                      0,
                    )}
                  </p>
                </div>
                <div>
                  <p className="uppercase">Tasks</p>
                  <p className="text-lg text-white font-bold">
                    {program.modules?.reduce(
                      (total: number, mod: any) => total + (mod._count?.tasks || 0),
                      0,
                    )}
                  </p>
                </div>
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
