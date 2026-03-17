import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BookOpen, CalendarDays, CheckCircle, PlusCircle, XCircle, Upload } from 'lucide-react';
import api from '../utils/api';

const AcademyProgramDetail = () => {
  const { id } = useParams();
  const [program, setProgram] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [moduleForm, setModuleForm] = useState({ title: '', order: 1, unlockDate: '' });
  const [lessonForms, setLessonForms] = useState<Record<string, any>>({});
  const [taskForms, setTaskForms] = useState<Record<string, any>>({});
  const [moduleEdits, setModuleEdits] = useState<Record<string, any>>({});
  const [lessonEdits, setLessonEdits] = useState<Record<string, any>>({});
  const [taskEdits, setTaskEdits] = useState<Record<string, any>>({});
  const [lessonCsvFiles, setLessonCsvFiles] = useState<Record<string, File | null>>({});
  const [taskCsvFiles, setTaskCsvFiles] = useState<Record<string, File | null>>({});
  const [moduleCsvFile, setModuleCsvFile] = useState<File | null>(null);
  const [lessonImportErrors, setLessonImportErrors] = useState<Record<string, string[]>>({});
  const [taskImportErrors, setTaskImportErrors] = useState<Record<string, string[]>>({});
  const [moduleImportErrors, setModuleImportErrors] = useState<string[]>([]);
  const [lessonPreviewHeaders, setLessonPreviewHeaders] = useState<Record<string, string[]>>({});
  const [lessonPreviewRows, setLessonPreviewRows] = useState<Record<string, string[][]>>({});
  const [taskPreviewHeaders, setTaskPreviewHeaders] = useState<Record<string, string[]>>({});
  const [taskPreviewRows, setTaskPreviewRows] = useState<Record<string, string[][]>>({});
  const [modulePreviewHeaders, setModulePreviewHeaders] = useState<string[]>([]);
  const [modulePreviewRows, setModulePreviewRows] = useState<string[][]>([]);
  const [savingProgram, setSavingProgram] = useState(false);
  const [uploadingModuleId, setUploadingModuleId] = useState<string | null>(null);
  const [uploadingLessonId, setUploadingLessonId] = useState<string | null>(null);
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

  const fetchProgram = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/academy/admin/programs/${id}`);
      setProgram(res.data);
    } catch (error) {
      showToast('Failed to load program.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProgram();
  }, [id]);

  const handleProgramUpdate = async () => {
    if (!program) return;
    setSavingProgram(true);
    try {
      await api.patch(`/academy/admin/programs/${program.id}`, {
        title: program.title,
        description: program.description,
        cohort: program.cohort,
        isPremium: program.isPremium,
      });
      showToast('Program updated.', 'success');
    } catch (error) {
      showToast('Failed to update program.', 'error');
    } finally {
      setSavingProgram(false);
    }
  };

  const handleCreateModule = async () => {
    if (!moduleForm.title.trim()) {
      showToast('Module title is required.', 'error');
      return;
    }
    try {
      await api.post(`/academy/admin/programs/${program.id}/modules`, {
        title: moduleForm.title,
        order: Number(moduleForm.order) || 1,
        unlockDate: moduleForm.unlockDate || null,
      });
      setModuleForm({ title: '', order: 1, unlockDate: '' });
      showToast('Module created.', 'success');
      fetchProgram();
    } catch (error) {
      showToast('Failed to create module.', 'error');
    }
  };

  const handleCreateLesson = async (moduleId: string) => {
    const form = lessonForms[moduleId];
    if (!form?.title?.trim()) {
      showToast('Lesson title is required.', 'error');
      return;
    }
    try {
      await api.post(`/academy/admin/modules/${moduleId}/lessons`, {
        title: form.title,
        order: Number(form.order) || 1,
        videoUrl: form.videoUrl,
        content: form.content,
        contentType: form.contentType,
        duration: Number(form.duration) || 300,
      });
      setLessonForms((prev) => ({ ...prev, [moduleId]: {} }));
      showToast('Lesson created.', 'success');
      fetchProgram();
    } catch (error) {
      showToast('Failed to create lesson.', 'error');
    }
  };

  const downloadLessonTemplate = () => {
    const headers = ['title', 'order', 'videoUrl', 'content', 'contentType', 'duration'];
    const sample = ['Intro Lesson', '1', 'https://video.url', 'Lesson content', 'VIDEO', '300'];
    const csv = `${headers.join(',')}\n${sample.join(',')}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'lesson-template.csv';
    link.click();
  };

  const downloadTaskTemplate = () => {
    const headers = ['title', 'description', 'dueDate'];
    const sample = ['Customer Interview Summary', 'Submit 1 page summary', '2026-04-10'];
    const csv = `${headers.join(',')}\n${sample.join(',')}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'task-template.csv';
    link.click();
  };

  const handleImportLessons = async (moduleId: string) => {
    const file = lessonCsvFiles[moduleId];
    if (!file) {
      showToast('Select a CSV file first.', 'error');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post(`/academy/admin/modules/${moduleId}/lessons/import`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const errors = res.data?.errors || [];
      setLessonImportErrors((prev) => ({ ...prev, [moduleId]: errors }));
      showToast(
        `Imported ${res.data?.created || 0} lessons. ${res.data?.failed || 0} failed.`,
        errors.length ? 'error' : 'success',
      );
      setLessonCsvFiles((prev) => ({ ...prev, [moduleId]: null }));
      setLessonPreviewHeaders((prev) => ({ ...prev, [moduleId]: [] }));
      setLessonPreviewRows((prev) => ({ ...prev, [moduleId]: [] }));
      fetchProgram();
    } catch (error) {
      showToast('Failed to import lessons.', 'error');
    }
  };

  const handleImportTasks = async (moduleId: string) => {
    const file = taskCsvFiles[moduleId];
    if (!file) {
      showToast('Select a CSV file first.', 'error');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post(`/academy/admin/modules/${moduleId}/tasks/import`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const errors = res.data?.errors || [];
      setTaskImportErrors((prev) => ({ ...prev, [moduleId]: errors }));
      showToast(
        `Imported ${res.data?.created || 0} tasks. ${res.data?.failed || 0} failed.`,
        errors.length ? 'error' : 'success',
      );
      setTaskCsvFiles((prev) => ({ ...prev, [moduleId]: null }));
      setTaskPreviewHeaders((prev) => ({ ...prev, [moduleId]: [] }));
      setTaskPreviewRows((prev) => ({ ...prev, [moduleId]: [] }));
      fetchProgram();
    } catch (error) {
      showToast('Failed to import tasks.', 'error');
    }
  };

  const downloadModuleTemplate = () => {
    const headers = ['title', 'order', 'unlockDate'];
    const sample = ['Week 1: Foundations', '1', '2026-04-01'];
    const csv = `${headers.join(',')}\n${sample.join(',')}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'module-template.csv';
    link.click();
  };

  const handleImportModules = async () => {
    if (!moduleCsvFile || !program) {
      showToast('Select a CSV file first.', 'error');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('file', moduleCsvFile);
      const res = await api.post(`/academy/admin/programs/${program.id}/modules/import`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setModuleCsvFile(null);
      setModulePreviewHeaders([]);
      setModulePreviewRows([]);
      const errors = res.data?.errors || [];
      setModuleImportErrors(errors);
      showToast(
        `Imported ${res.data?.created || 0} modules. ${res.data?.failed || 0} failed.`,
        errors.length ? 'error' : 'success',
      );
      fetchProgram();
    } catch (error) {
      showToast('Failed to import modules.', 'error');
    }
  };

  const parseCsvPreview = (text: string) => {
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (!lines.length) return { headers: [], rows: [] };
    const headers = lines[0].split(',').map((h) => h.trim());
    const rows = lines.slice(1, 6).map((line) => line.split(',').map((v) => v.trim()));
    return { headers, rows };
  };

  const handleModuleFileChange = (file?: File | null) => {
    setModuleCsvFile(file || null);
    if (!file) {
      setModulePreviewHeaders([]);
      setModulePreviewRows([]);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const { headers, rows } = parseCsvPreview(String(reader.result || ''));
      setModulePreviewHeaders(headers);
      setModulePreviewRows(rows);
    };
    reader.readAsText(file);
  };

  const handleLessonFileChange = (moduleId: string, file?: File | null) => {
    setLessonCsvFiles((prev) => ({ ...prev, [moduleId]: file || null }));
    if (!file) {
      setLessonPreviewHeaders((prev) => ({ ...prev, [moduleId]: [] }));
      setLessonPreviewRows((prev) => ({ ...prev, [moduleId]: [] }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const { headers, rows } = parseCsvPreview(String(reader.result || ''));
      setLessonPreviewHeaders((prev) => ({ ...prev, [moduleId]: headers }));
      setLessonPreviewRows((prev) => ({ ...prev, [moduleId]: rows }));
    };
    reader.readAsText(file);
  };

  const handleTaskFileChange = (moduleId: string, file?: File | null) => {
    setTaskCsvFiles((prev) => ({ ...prev, [moduleId]: file || null }));
    if (!file) {
      setTaskPreviewHeaders((prev) => ({ ...prev, [moduleId]: [] }));
      setTaskPreviewRows((prev) => ({ ...prev, [moduleId]: [] }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const { headers, rows } = parseCsvPreview(String(reader.result || ''));
      setTaskPreviewHeaders((prev) => ({ ...prev, [moduleId]: headers }));
      setTaskPreviewRows((prev) => ({ ...prev, [moduleId]: rows }));
    };
    reader.readAsText(file);
  };

  const handleUploadLessonVideo = async (
    file: File,
    moduleId: string,
    lessonId?: string,
  ) => {
    if (!file) return;
    try {
      if (lessonId) {
        setUploadingLessonId(lessonId);
      } else {
        setUploadingModuleId(moduleId);
      }
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/upload?folder=naajih-academy', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const url = res.data?.secure_url;
      if (!url) {
        showToast('Upload failed.', 'error');
        return;
      }

      if (lessonId) {
        setLessonEdits((prev) => ({
          ...prev,
          [lessonId]: { ...prev[lessonId], videoUrl: url },
        }));
      } else {
        setLessonForms((prev) => ({
          ...prev,
          [moduleId]: { ...prev[moduleId], videoUrl: url },
        }));
      }
      showToast('Video uploaded.', 'success');
    } catch (error) {
      showToast('Video upload failed.', 'error');
    } finally {
      setUploadingModuleId(null);
      setUploadingLessonId(null);
    }
  };

  const handleCreateTask = async (moduleId: string) => {
    const form = taskForms[moduleId];
    if (!form?.title?.trim()) {
      showToast('Task title is required.', 'error');
      return;
    }
    try {
      await api.post(`/academy/admin/modules/${moduleId}/tasks`, {
        title: form.title,
        description: form.description,
        dueDate: form.dueDate || null,
      });
      setTaskForms((prev) => ({ ...prev, [moduleId]: {} }));
      showToast('Task created.', 'success');
      fetchProgram();
    } catch (error) {
      showToast('Failed to create task.', 'error');
    }
  };

  const handleUpdateModule = async (moduleId: string) => {
    const payload = moduleEdits[moduleId];
    try {
      await api.patch(`/academy/admin/modules/${moduleId}`, {
        title: payload?.title,
        order: payload?.order ? Number(payload.order) : undefined,
        unlockDate: payload?.unlockDate || null,
      });
      showToast('Module updated.', 'success');
      fetchProgram();
    } catch (error) {
      showToast('Failed to update module.', 'error');
    }
  };

  const handleUpdateLesson = async (lessonId: string) => {
    const payload = lessonEdits[lessonId];
    try {
      await api.patch(`/academy/admin/lessons/${lessonId}`, {
        title: payload?.title,
        order: payload?.order ? Number(payload.order) : undefined,
        videoUrl: payload?.videoUrl || null,
        content: payload?.content || null,
        contentType: payload?.contentType,
        duration: payload?.duration ? Number(payload.duration) : undefined,
      });
      showToast('Lesson updated.', 'success');
      fetchProgram();
    } catch (error) {
      showToast('Failed to update lesson.', 'error');
    }
  };

  const handleUpdateTask = async (taskId: string) => {
    const payload = taskEdits[taskId];
    try {
      await api.patch(`/academy/admin/tasks/${taskId}`, {
        title: payload?.title,
        description: payload?.description,
        dueDate: payload?.dueDate || null,
      });
      showToast('Task updated.', 'success');
      fetchProgram();
    } catch (error) {
      showToast('Failed to update task.', 'error');
    }
  };

  if (loading) {
    return <div className="text-gray-400">Loading program...</div>;
  }

  if (!program) {
    return <div className="text-red-500">Program not found.</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <BookOpen size={20} className="text-primary" />
            {program.title}
          </h1>
          <p className="text-gray-400 text-sm">{program.cohort || 'No cohort set'}</p>
        </div>
        <button
          onClick={handleProgramUpdate}
          disabled={savingProgram}
          className="bg-primary text-neutral-dark font-bold px-4 py-2 rounded-lg"
        >
          {savingProgram ? 'Saving...' : 'Save Program'}
        </button>
      </div>

      <div className="bg-[#1d1d20] border border-gray-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-bold">Program Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            value={program.title}
            onChange={(event) =>
              setProgram((prev: any) => ({ ...prev, title: event.target.value }))
            }
            className="bg-black/30 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
            placeholder="Program title"
          />
          <input
            value={program.cohort || ''}
            onChange={(event) =>
              setProgram((prev: any) => ({ ...prev, cohort: event.target.value }))
            }
            className="bg-black/30 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
            placeholder="Cohort"
          />
          <input
            value={program.description || ''}
            onChange={(event) =>
              setProgram((prev: any) => ({ ...prev, description: event.target.value }))
            }
            className="bg-black/30 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
            placeholder="Short description"
          />
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={Boolean(program.isPremium)}
              onChange={(event) =>
                setProgram((prev: any) => ({ ...prev, isPremium: event.target.checked }))
              }
              className="accent-primary"
            />
            Premium program
          </label>
        </div>
      </div>

      <div className="bg-[#1d1d20] border border-gray-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <PlusCircle size={18} className="text-primary" /> Add Module
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            value={moduleForm.title}
            onChange={(event) => setModuleForm((prev) => ({ ...prev, title: event.target.value }))}
            className="bg-black/30 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
            placeholder="Module title"
          />
          <input
            type="number"
            value={moduleForm.order}
            onChange={(event) =>
              setModuleForm((prev) => ({ ...prev, order: Number(event.target.value) }))
            }
            className="bg-black/30 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
            placeholder="Order"
          />
          <input
            type="date"
            value={moduleForm.unlockDate}
            onChange={(event) =>
              setModuleForm((prev) => ({ ...prev, unlockDate: event.target.value }))
            }
            className="bg-black/30 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
          />
        </div>
        <button
          onClick={handleCreateModule}
          className="bg-primary text-neutral-dark font-bold px-4 py-2 rounded-lg"
        >
          Create Module
        </button>
      </div>

      <div className="bg-[#1d1d20] border border-gray-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Upload size={18} className="text-primary" /> Bulk Import Modules (CSV)
        </h2>
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <input
            type="file"
            accept=".csv"
            onChange={(event) => handleModuleFileChange(event.target.files?.[0])}
            className="text-sm text-gray-400"
          />
          <button
            onClick={handleImportModules}
            className="bg-primary text-neutral-dark font-bold px-4 py-2 rounded-lg"
          >
            Import CSV
          </button>
          <button
            onClick={downloadModuleTemplate}
            className="border border-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm"
          >
            Download Template
          </button>
        </div>
        {moduleImportErrors.length > 0 && (
          <div className="text-xs text-red-400 space-y-1">
            {moduleImportErrors.map((err, index) => (
              <div key={`${err}-${index}`}>{err}</div>
            ))}
          </div>
        )}
        {modulePreviewHeaders.length > 0 && (
          <div className="bg-black/30 border border-gray-800 rounded-lg p-3 text-xs text-gray-300">
            <div className="font-bold text-gray-400 mb-2">Preview</div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr>
                    {modulePreviewHeaders.map((header) => (
                      <th key={header} className="text-left px-2 py-1 text-gray-400">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {modulePreviewRows.map((row, index) => (
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

      <div className="space-y-6">
        {program.modules?.map((module: any) => (
          <div key={module.id} className="bg-[#151518] border border-gray-800 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold">{module.title}</h3>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <CalendarDays size={14} />
                  Unlocks {module.unlockDate ? new Date(module.unlockDate).toLocaleDateString('en-NG') : 'Anytime'}
                </p>
              </div>
            </div>

            <div className="bg-black/20 border border-gray-800 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-gray-400 uppercase">Edit Module</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  value={moduleEdits[module.id]?.title ?? module.title}
                  onChange={(event) =>
                    setModuleEdits((prev) => ({
                      ...prev,
                      [module.id]: { ...prev[module.id], title: event.target.value },
                    }))
                  }
                  className="bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white"
                  placeholder="Module title"
                />
                <input
                  type="number"
                  value={moduleEdits[module.id]?.order ?? module.order}
                  onChange={(event) =>
                    setModuleEdits((prev) => ({
                      ...prev,
                      [module.id]: { ...prev[module.id], order: event.target.value },
                    }))
                  }
                  className="bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white"
                  placeholder="Order"
                />
                <input
                  type="date"
                  value={
                    moduleEdits[module.id]?.unlockDate ??
                    (module.unlockDate ? new Date(module.unlockDate).toISOString().slice(0, 10) : '')
                  }
                  onChange={(event) =>
                    setModuleEdits((prev) => ({
                      ...prev,
                      [module.id]: { ...prev[module.id], unlockDate: event.target.value },
                    }))
                  }
                  className="bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
              <button
                onClick={() => handleUpdateModule(module.id)}
                className="bg-primary text-neutral-dark font-bold px-3 py-2 rounded-lg text-xs"
              >
                Save Module
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-primary">Lessons</h4>
                {module.lessons?.length ? (
                  module.lessons.map((lesson: any) => (
                    <div key={lesson.id} className="bg-black/20 border border-gray-800 rounded-lg p-3">
                      <div className="space-y-2">
                        <input
                          value={lessonEdits[lesson.id]?.title ?? lesson.title}
                          onChange={(event) =>
                            setLessonEdits((prev) => ({
                              ...prev,
                              [lesson.id]: { ...prev[lesson.id], title: event.target.value },
                            }))
                          }
                          className="bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white w-full"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            value={lessonEdits[lesson.id]?.contentType ?? lesson.contentType}
                            onChange={(event) =>
                              setLessonEdits((prev) => ({
                                ...prev,
                                [lesson.id]: { ...prev[lesson.id], contentType: event.target.value },
                              }))
                            }
                            className="bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white"
                          />
                          <input
                            type="number"
                            value={lessonEdits[lesson.id]?.duration ?? lesson.duration}
                            onChange={(event) =>
                              setLessonEdits((prev) => ({
                                ...prev,
                                [lesson.id]: { ...prev[lesson.id], duration: event.target.value },
                              }))
                            }
                            className="bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white"
                          />
                        </div>
                        <input
                          value={lessonEdits[lesson.id]?.videoUrl ?? lesson.videoUrl ?? ''}
                          onChange={(event) =>
                            setLessonEdits((prev) => ({
                              ...prev,
                              [lesson.id]: { ...prev[lesson.id], videoUrl: event.target.value },
                            }))
                          }
                          className="bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white w-full"
                          placeholder="Video URL"
                        />
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (file) {
                              handleUploadLessonVideo(file, module.id, lesson.id);
                            }
                          }}
                          className="text-xs text-gray-400"
                        />
                        {uploadingLessonId === lesson.id && (
                          <p className="text-xs text-gray-500">Uploading video...</p>
                        )}
                        <textarea
                          value={lessonEdits[lesson.id]?.content ?? lesson.content ?? ''}
                          onChange={(event) =>
                            setLessonEdits((prev) => ({
                              ...prev,
                              [lesson.id]: { ...prev[lesson.id], content: event.target.value },
                            }))
                          }
                          className="bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white w-full min-h-[70px]"
                        />
                        <button
                          onClick={() => handleUpdateLesson(lesson.id)}
                          className="bg-primary text-neutral-dark font-bold px-3 py-2 rounded-lg text-xs"
                        >
                          Save Lesson
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500">No lessons yet.</p>
                )}
                <div className="bg-black/30 border border-gray-800 rounded-lg p-3 space-y-2">
                  <h5 className="text-xs font-bold text-gray-400">Bulk Import Lessons (CSV)</h5>
                  <div className="flex flex-col md:flex-row md:items-center gap-3">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={(event) =>
                        handleLessonFileChange(module.id, event.target.files?.[0])
                      }
                      className="text-xs text-gray-400"
                    />
                    <button
                      onClick={() => handleImportLessons(module.id)}
                      className="bg-primary text-neutral-dark font-bold px-3 py-2 rounded-lg text-xs"
                    >
                      Import CSV
                    </button>
                    <button
                      onClick={downloadLessonTemplate}
                      className="border border-gray-700 text-gray-300 px-3 py-2 rounded-lg text-xs"
                    >
                      Download Template
                    </button>
                  </div>
                  {lessonImportErrors[module.id]?.length > 0 && (
                    <div className="text-[10px] text-red-400 space-y-1">
                      {lessonImportErrors[module.id].map((err, index) => (
                        <div key={`${err}-${index}`}>{err}</div>
                      ))}
                    </div>
                  )}
                  {lessonPreviewHeaders[module.id]?.length > 0 && (
                    <div className="bg-black/40 border border-gray-800 rounded-lg p-2 text-[10px] text-gray-300">
                      <div className="font-bold text-gray-400 mb-1">Preview</div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-[10px]">
                          <thead>
                            <tr>
                              {lessonPreviewHeaders[module.id].map((header) => (
                                <th key={header} className="text-left px-2 py-1 text-gray-400">
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {(lessonPreviewRows[module.id] || []).map((row, index) => (
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
                <div className="bg-black/30 border border-gray-800 rounded-lg p-3 space-y-2">
                  <h5 className="text-xs font-bold text-gray-400">Add Lesson</h5>
                  <input
                    placeholder="Lesson title"
                    value={lessonForms[module.id]?.title || ''}
                    onChange={(event) =>
                      setLessonForms((prev) => ({
                        ...prev,
                        [module.id]: { ...prev[module.id], title: event.target.value },
                      }))
                    }
                    className="bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white w-full"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      placeholder="Content type (VIDEO)"
                      value={lessonForms[module.id]?.contentType || ''}
                      onChange={(event) =>
                        setLessonForms((prev) => ({
                          ...prev,
                          [module.id]: { ...prev[module.id], contentType: event.target.value },
                        }))
                      }
                      className="bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white"
                    />
                    <input
                      type="number"
                      placeholder="Duration (sec)"
                      value={lessonForms[module.id]?.duration || ''}
                      onChange={(event) =>
                        setLessonForms((prev) => ({
                          ...prev,
                          [module.id]: { ...prev[module.id], duration: event.target.value },
                        }))
                      }
                      className="bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <input
                    placeholder="Video URL (optional)"
                    value={lessonForms[module.id]?.videoUrl || ''}
                    onChange={(event) =>
                      setLessonForms((prev) => ({
                        ...prev,
                        [module.id]: { ...prev[module.id], videoUrl: event.target.value },
                      }))
                    }
                    className="bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white w-full"
                  />
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) {
                        handleUploadLessonVideo(file, module.id);
                      }
                    }}
                    className="text-xs text-gray-400"
                  />
                  {uploadingModuleId === module.id && (
                    <p className="text-xs text-gray-500">Uploading video...</p>
                  )}
                  <textarea
                    placeholder="Lesson content (HTML allowed)"
                    value={lessonForms[module.id]?.content || ''}
                    onChange={(event) =>
                      setLessonForms((prev) => ({
                        ...prev,
                        [module.id]: { ...prev[module.id], content: event.target.value },
                      }))
                    }
                    className="bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white w-full min-h-[80px]"
                  />
                  <button
                    onClick={() => handleCreateLesson(module.id)}
                    className="bg-primary text-neutral-dark font-bold px-3 py-2 rounded-lg text-xs"
                  >
                    Add Lesson
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold text-primary">Tasks</h4>
                {module.tasks?.length ? (
                  module.tasks.map((task: any) => (
                    <div key={task.id} className="bg-black/20 border border-gray-800 rounded-lg p-3">
                      <div className="space-y-2">
                        <input
                          value={taskEdits[task.id]?.title ?? task.title}
                          onChange={(event) =>
                            setTaskEdits((prev) => ({
                              ...prev,
                              [task.id]: { ...prev[task.id], title: event.target.value },
                            }))
                          }
                          className="bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white w-full"
                        />
                        <textarea
                          value={taskEdits[task.id]?.description ?? task.description ?? ''}
                          onChange={(event) =>
                            setTaskEdits((prev) => ({
                              ...prev,
                              [task.id]: { ...prev[task.id], description: event.target.value },
                            }))
                          }
                          className="bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white w-full min-h-[60px]"
                        />
                        <input
                          type="date"
                          value={
                            taskEdits[task.id]?.dueDate ??
                            (task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : '')
                          }
                          onChange={(event) =>
                            setTaskEdits((prev) => ({
                              ...prev,
                              [task.id]: { ...prev[task.id], dueDate: event.target.value },
                            }))
                          }
                          className="bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white w-full"
                        />
                        <button
                          onClick={() => handleUpdateTask(task.id)}
                          className="bg-primary text-neutral-dark font-bold px-3 py-2 rounded-lg text-xs"
                        >
                          Save Task
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500">No tasks yet.</p>
                )}
                <div className="bg-black/30 border border-gray-800 rounded-lg p-3 space-y-2">
                  <h5 className="text-xs font-bold text-gray-400">Bulk Import Tasks (CSV)</h5>
                  <div className="flex flex-col md:flex-row md:items-center gap-3">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={(event) =>
                        handleTaskFileChange(module.id, event.target.files?.[0])
                      }
                      className="text-xs text-gray-400"
                    />
                    <button
                      onClick={() => handleImportTasks(module.id)}
                      className="bg-primary text-neutral-dark font-bold px-3 py-2 rounded-lg text-xs"
                    >
                      Import CSV
                    </button>
                    <button
                      onClick={downloadTaskTemplate}
                      className="border border-gray-700 text-gray-300 px-3 py-2 rounded-lg text-xs"
                    >
                      Download Template
                    </button>
                  </div>
                  {taskImportErrors[module.id]?.length > 0 && (
                    <div className="text-[10px] text-red-400 space-y-1">
                      {taskImportErrors[module.id].map((err, index) => (
                        <div key={`${err}-${index}`}>{err}</div>
                      ))}
                    </div>
                  )}
                  {taskPreviewHeaders[module.id]?.length > 0 && (
                    <div className="bg-black/40 border border-gray-800 rounded-lg p-2 text-[10px] text-gray-300">
                      <div className="font-bold text-gray-400 mb-1">Preview</div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-[10px]">
                          <thead>
                            <tr>
                              {taskPreviewHeaders[module.id].map((header) => (
                                <th key={header} className="text-left px-2 py-1 text-gray-400">
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {(taskPreviewRows[module.id] || []).map((row, index) => (
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
                <div className="bg-black/30 border border-gray-800 rounded-lg p-3 space-y-2">
                  <h5 className="text-xs font-bold text-gray-400">Add Task</h5>
                  <input
                    placeholder="Task title"
                    value={taskForms[module.id]?.title || ''}
                    onChange={(event) =>
                      setTaskForms((prev) => ({
                        ...prev,
                        [module.id]: { ...prev[module.id], title: event.target.value },
                      }))
                    }
                    className="bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white w-full"
                  />
                  <textarea
                    placeholder="Task description"
                    value={taskForms[module.id]?.description || ''}
                    onChange={(event) =>
                      setTaskForms((prev) => ({
                        ...prev,
                        [module.id]: { ...prev[module.id], description: event.target.value },
                      }))
                    }
                    className="bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white w-full min-h-[60px]"
                  />
                  <input
                    type="date"
                    value={taskForms[module.id]?.dueDate || ''}
                    onChange={(event) =>
                      setTaskForms((prev) => ({
                        ...prev,
                        [module.id]: { ...prev[module.id], dueDate: event.target.value },
                      }))
                    }
                    className="bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white w-full"
                  />
                  <button
                    onClick={() => handleCreateTask(module.id)}
                    className="bg-primary text-neutral-dark font-bold px-3 py-2 rounded-lg text-xs"
                  >
                    Add Task
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

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

export default AcademyProgramDetail;
