import { useEffect, useState } from 'react';
import { CheckCircle, Filter, Loader2, Search, XCircle } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const AuditLogs = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [toast, setToast] = useState<{show: boolean; message: string; type: 'success' | 'error'}>({
    show: false,
    message: '',
    type: 'success',
  });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const params = new URLSearchParams();
      params.set('page', String(currentPage));
      params.set('pageSize', String(pageSize));
      if (searchQuery) params.set('search', searchQuery);
      if (actionFilter !== 'ALL') params.set('action', actionFilter);
      if (dateFrom) params.set('dateFrom', dateFrom);
      if (dateTo) params.set('dateTo', dateTo);

      const res = await fetch(`${API_BASE}/api/audit?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      const list = data.data || data || [];
      setLogs(list);
      setTotalItems(data.meta?.total ?? list.length);
      setTotalPages(data.meta?.totalPages ?? 1);
    } catch (err) {
      showToast('Failed to load audit logs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [searchQuery, actionFilter, dateFrom, dateTo, currentPage, pageSize]);

  const safePage = Math.min(currentPage, totalPages);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 relative">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Audit Log</h1>
          <p className="text-slate-500 mt-1 dark:text-gray-500">Track administrative actions and system events.</p>
        </div>
        <button
          type="button"
          onClick={() => exportCsv(logs)}
          className="px-3 py-2 admin-button-secondary rounded-lg text-sm font-medium transition-colors"
        >
          Export CSV
        </button>
      </div>

      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded shadow-lg text-white font-medium flex items-center gap-2 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
          {toast.message}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-grow md:flex-grow-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-gray-500" size={16} />
          <input
            value={searchQuery}
            onChange={(e) => { setCurrentPage(1); setSearchQuery(e.target.value); }}
            placeholder="Search action, email, entity..."
            className="admin-input w-full md:w-72 pl-9 pr-4 py-2 text-sm"
          />
        </div>
        <div className="flex items-center gap-2 admin-input px-3 py-2">
          <Filter size={16} className="text-slate-500 dark:text-gray-500" />
          <select
            value={actionFilter}
            onChange={(e) => { setCurrentPage(1); setActionFilter(e.target.value); }}
            className="bg-transparent text-sm text-slate-900 focus:outline-none dark:text-white"
            title="Filter by action"
            aria-label="Filter by action"
          >
            <option value="ALL">All Actions</option>
            <option value="VERIFICATION_STATUS_UPDATED">Verification Updated</option>
            <option value="PITCH_STATUS_UPDATED">Pitch Updated</option>
          </select>
        </div>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => { setCurrentPage(1); setDateFrom(e.target.value); }}
          className="admin-input px-3 py-2 text-sm"
          aria-label="From date"
          title="From date"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => { setCurrentPage(1); setDateTo(e.target.value); }}
          className="admin-input px-3 py-2 text-sm"
          aria-label="To date"
          title="To date"
        />
        <select
          value={pageSize}
          onChange={(e) => { setCurrentPage(1); setPageSize(Number(e.target.value)); }}
          className="admin-input px-3 py-2 text-sm"
          aria-label="Items per page"
          title="Items per page"
        >
          <option value={10}>10 / page</option>
          <option value={20}>20 / page</option>
          <option value={50}>50 / page</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500 dark:text-gray-400"><Loader2 className="animate-spin inline mr-2"/> Loading audit logs...</div>
      ) : (
        <div className="admin-surface rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-white/[0.02] text-slate-500 dark:text-gray-500 text-xs font-bold uppercase tracking-widest">
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Actor</th>
                  <th className="px-6 py-4">Entity</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/5 text-sm text-slate-700 dark:text-gray-300">
                {logs.length === 0 ? (
                  <tr><td colSpan={4} className="py-10 text-center text-slate-500 dark:text-gray-500">No audit logs found.</td></tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-slate-900 dark:text-white font-medium">{formatAuditTitle(log)}</td>
                      <td className="px-6 py-4 text-slate-500 dark:text-gray-400">{log.actor?.email || 'System'}</td>
                      <td className="px-6 py-4 text-slate-500 dark:text-gray-400">{log.entityType} {log.entityId ? `(${log.entityId.slice(0, 6)}...)` : ''}</td>
                      <td className="px-6 py-4 text-slate-500 dark:text-gray-400">{log.createdAt ? new Date(log.createdAt).toLocaleString() : ''}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && totalItems > 0 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-slate-500 dark:text-gray-400">
          <div>
            Showing {(safePage - 1) * pageSize + 1}-{Math.min(safePage * pageSize, totalItems)} of {totalItems}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              className="px-3 py-1.5 rounded admin-button-secondary disabled:opacity-40"
              disabled={safePage === 1}
            >
              Prev
            </button>
            <span className="text-slate-500 dark:text-gray-500">
              Page {safePage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              className="px-3 py-1.5 rounded admin-button-secondary disabled:opacity-40"
              disabled={safePage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const formatAuditTitle = (log: any) => {
  if (log.action === 'VERIFICATION_STATUS_UPDATED') {
    const status = log.metadata?.status || 'UPDATED';
    const target = log.metadata?.targetUserEmail || log.metadata?.targetUserId || 'user';
    return `Verification ${String(status).toLowerCase()} for ${target}`;
  }

  if (log.action === 'PITCH_STATUS_UPDATED') {
    const status = log.metadata?.status || 'UPDATED';
    const title = log.metadata?.pitchTitle || 'pitch';
    return `Pitch ${String(status).toLowerCase()}: ${title}`;
  }

  return log.action || 'Activity';
};

const exportCsv = (rows: any[]) => {
  if (!rows.length) return;
  const headers = ['action', 'actorEmail', 'entityType', 'entityId', 'createdAt'];
  const lines = [
    headers.join(','),
    ...rows.map((log) => {
      const action = log.action || '';
      const actorEmail = log.actor?.email || '';
      const entityType = log.entityType || '';
      const entityId = log.entityId || '';
      const createdAt = log.createdAt ? new Date(log.createdAt).toISOString() : '';
      return [action, actorEmail, entityType, entityId, createdAt]
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(',');
    }),
  ];

  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `audit-logs-${Date.now()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default AuditLogs;
