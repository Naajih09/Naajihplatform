import { CheckCircle, ExternalLink, FileText, Loader2, XCircle, ChevronLeft, ChevronRight, X, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const Verification = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('PENDING');

  // Modals State
  const[rejectModal, setRejectModal] = useState<{show: boolean; id: string | null}>({ show: false, id: null });
  const [rejectionReason, setRejectionReason] = useState("");
  const[docModal, setDocModal] = useState<{show: boolean; url: string | null}>({ show: false, url: null });

  // Toast State
  const [toast, setToast] = useState<{show: boolean; message: string; type: 'success' | 'error'}>({ show: false, message: '', type: 'success' });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const params = new URLSearchParams();
      params.set('page', String(currentPage));
      params.set('pageSize', String(pageSize));
      if (searchQuery) params.set('search', searchQuery);
      if (statusFilter) params.set('status', statusFilter);
      const res = await fetch(`${API_BASE}/api/verification/admin/pending?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      const list = data.data || data || [];
      setRequests(list);
      setTotalItems(data.meta?.total ?? list.length);
      setTotalPages(data.meta?.totalPages ?? 1);
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch requests", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [currentPage, pageSize, searchQuery, statusFilter]);

  const handleApprove = async (id: string) => {
    if (!window.confirm(`Are you sure you want to APPROVE this user?`)) return;
    executeAction(id, 'APPROVED');
  };

  const handleRejectSubmit = async () => {
    if (!rejectModal.id || !rejectionReason.trim()) {
      showToast("Please provide a rejection reason.", "error");
      return;
    }
    await executeAction(rejectModal.id, 'REJECTED', rejectionReason);
    setRejectModal({ show: false, id: null });
    setRejectionReason("");
  };

  const executeAction = async (id: string, status: 'APPROVED' | 'REJECTED', reason?: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_BASE}/api/verification/admin/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status, rejectionReason: reason })
      });
      
      if (res.ok) {
        showToast(`Request ${status} successfully!`, "success");
        fetchRequests(); 
      } else {
        showToast("Action failed to save.", "error");
      }
    } catch (err) {
      showToast("Network error occurred.", "error");
    }
  };

  const safePage = Math.min(currentPage, totalPages);

  return (
    <div className="max-w-6xl mx-auto pb-20 relative">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">KYC Verification Queue</h1>
          <p className="text-sm text-gray-500 mt-1">Review pending, approved, and rejected verification requests.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
              value={searchQuery}
              onChange={(e) => { setCurrentPage(1); setSearchQuery(e.target.value); }}
              placeholder="Search email or name"
              className="w-full md:w-64 pl-9 pr-4 py-2 bg-[#1d1d20] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-primary"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setCurrentPage(1); setStatusFilter(e.target.value); }}
            className="bg-[#1d1d20] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
            aria-label="Filter by status"
            title="Filter by status"
          >
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <button
            type="button"
            onClick={() => exportCsv(requests)}
            className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded shadow-lg text-white font-medium flex items-center gap-2 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
          {toast.message}
        </div>
      )}

      {loading ? (
        <div className="text-white text-center py-20"><Loader2 className="animate-spin inline mr-2"/> Loading queue...</div>
      ) : requests.length === 0 ? (
        <div className="p-10 bg-[#1d1d20] rounded-xl border border-white/5 text-center text-gray-500">
           No pending verifications. Good job!
        </div>
      ) : (
        <div className="bg-[#1d1d20] border border-white/5 rounded-xl overflow-hidden flex flex-col min-h-[500px]">
          <table className="w-full text-left flex-grow">
            <thead className="bg-white/5 text-gray-400 text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Document</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300 text-sm">
              {requests.map((req) => {
                const profile = req.user?.entrepreneurProfile || req.user?.investorProfile || {};
                const fullName = `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || req.user?.email;

                return (
                  <tr key={req.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{fullName}</div>
                      <div className="text-xs text-gray-500">{req.user?.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded font-bold">{req.user?.role}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => setDocModal({ show: true, url: req.documentUrl })}
                        className="flex items-center gap-2 text-primary hover:underline"
                      >
                        <FileText size={16} /> Preview <ExternalLink size={12}/>
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button onClick={() => handleApprove(req.id)} className="px-3 py-1.5 bg-green-600/20 text-green-500 border border-green-600/30 rounded hover:bg-green-600 hover:text-white flex items-center gap-1 transition-all">
                        <CheckCircle size={14}/> Approve
                      </button>
                      <button onClick={() => setRejectModal({ show: true, id: req.id })} className="px-3 py-1.5 bg-red-600/20 text-red-500 border border-red-600/30 rounded hover:bg-red-600 hover:text-white flex items-center gap-1 transition-all">
                        <XCircle size={14}/> Reject
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination */}
          {totalItems > 0 && (
            <div className="p-4 border-t border-white/5 flex items-center justify-between text-sm text-gray-400">
              <span>
                Showing {(safePage - 1) * pageSize + 1}-{Math.min(safePage * pageSize, totalItems)} of {totalItems}
              </span>
              <div className="flex items-center gap-2">
                <select
                  value={pageSize}
                  onChange={(e) => { setCurrentPage(1); setPageSize(Number(e.target.value)); }}
                  className="bg-[#111113] border border-white/10 rounded px-2 py-1 text-xs text-white"
                  aria-label="Items per page"
                  title="Items per page"
                >
                  <option value={5}>5 / page</option>
                  <option value={10}>10 / page</option>
                  <option value={20}>20 / page</option>
                </select>
                <button 
                  type="button"
                  disabled={safePage === 1} 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="p-1 rounded hover:bg-white/10 disabled:opacity-30"
                  title="Previous page"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={20} />
                  <span className="sr-only">Previous page</span>
                </button>
                <button 
                  type="button"
                  disabled={safePage === totalPages} 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="p-1 rounded hover:bg-white/10 disabled:opacity-30"
                  title="Next page"
                  aria-label="Next page"
                >
                  <ChevronRight size={20} />
                  <span className="sr-only">Next page</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- MODALS --- */}
      
      {/* Rejection Modal */}
      {rejectModal.show && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1d1d20] border border-white/10 rounded-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-white mb-4">Reject Verification</h3>
            <p className="text-sm text-gray-400 mb-4">Please provide a reason for rejection. This will be sent to the user.</p>
            <textarea
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary resize-none"
              rows={4}
              placeholder="e.g., ID document is blurry, mismatch in name..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => { setRejectModal({ show: false, id: null }); setRejectionReason(""); }}
                className="px-4 py-2 rounded text-gray-400 hover:bg-white/5"
              >
                Cancel
              </button>
              <button 
                onClick={handleRejectSubmit}
                className="px-4 py-2 rounded bg-red-600 text-white font-medium hover:bg-red-700"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {docModal.show && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-4xl h-[80vh] bg-white rounded-xl overflow-hidden flex flex-col">
            <div className="p-3 bg-gray-100 flex justify-between items-center border-b">
              <span className="font-bold text-gray-800">Document Preview</span>
              <button 
                onClick={() => setDocModal({ show: false, url: null })} 
                className="p-1 hover:bg-gray-200 rounded text-gray-600"
                title="Close document preview"
                aria-label="Close document preview"
                type="button"
              >
                <X size={20} />
                <span className="sr-only">Close document preview</span>
              </button>
            </div>
            <div className="flex-grow bg-gray-200 flex items-center justify-center p-4">
              {docModal.url?.match(/\.(jpeg|jpg|gif|png)$/) != null ? (
                <img src={docModal.url} alt="Document Preview" className="max-h-full max-w-full object-contain shadow-md" />
              ) : (
                <iframe src={docModal.url || ''} title="Document PDF" className="w-full h-full border-0" />
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

const exportCsv = (rows: any[]) => {
  if (!rows.length) return;
  const headers = ['email', 'role', 'status', 'documentUrl', 'createdAt'];
  const lines = [
    headers.join(','),
    ...rows.map((req) => {
      const email = req.user?.email || '';
      const role = req.user?.role || '';
      const status = req.status || '';
      const documentUrl = req.documentUrl || '';
      const createdAt = req.createdAt ? new Date(req.createdAt).toISOString() : '';
      return [email, role, status, documentUrl, createdAt]
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(',');
    }),
  ];

  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `verification-requests-${Date.now()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default Verification;
