import { useEffect, useState } from 'react';
import { AlertOctagon, Loader2, CheckCircle, XCircle, Search, Eye, X, Clock } from 'lucide-react';
import EmptyState from '../components/EmptyState';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const PitchesList = () => {
  const [pitches, setPitches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filters
  const[searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Modal & Toast
  const[selectedPitch, setSelectedPitch] = useState<any | null>(null);
  const [toast, setToast] = useState<{show: boolean; message: string; type: 'success' | 'error'}>({ show: false, message: '', type: 'success' });
  const hasFilters = searchQuery.trim() !== '' || categoryFilter !== 'ALL' || statusFilter !== 'ALL';

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const fetchPitches = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const params = new URLSearchParams();
      if (searchQuery) params.set('search', searchQuery);
      if (categoryFilter !== 'ALL') params.set('category', categoryFilter);
      if (statusFilter !== 'ALL') params.set('status', statusFilter);
      params.set('page', String(currentPage));
      params.set('pageSize', String(pageSize));

      const res = await fetch(`${API_BASE}/api/pitches/admin?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      const list = data.data || data || [];
      setPitches(list);
      setTotalItems(data.meta?.total ?? list.length);
      setTotalPages(data.meta?.totalPages ?? 1);
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch pitches", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPitches();
  }, [searchQuery, categoryFilter, statusFilter, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, statusFilter, pageSize]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Remove this pitch entirely from the platform? This cannot be undone.")) return;
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_BASE}/api/pitches/${id}`, { 
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` } 
      });
      
      if (res.ok) {
        showToast("Pitch removed successfully.", "success");
        setPitches(pitches.filter(p => p.id !== id));
        if (selectedPitch?.id === id) setSelectedPitch(null);
      } else {
        showToast("Failed to delete. Check Auth.", "error");
      }
    } catch (err) {
      showToast("Network error", "error");
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: 'APPROVED' | 'REJECTED') => {
    try {
      const token = localStorage.getItem('accessToken');
      // Assumes your backend has a PATCH /api/pitches/:id endpoint capable of updating status
      const res = await fetch(`${API_BASE}/api/pitches/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        showToast(`Pitch ${newStatus.toLowerCase()} successfully.`, "success");
        setPitches(pitches.map(p => p.id === id ? { ...p, status: newStatus } : p));
        if (selectedPitch?.id === id) setSelectedPitch({ ...selectedPitch, status: newStatus });
      } else {
        showToast("Failed to update status", "error");
      }
    } catch (err) {
      showToast("Network error", "error");
    }
  };

  // Extract unique categories for filter dropdown
  const categories = Array.from(new Set(pitches.map(p => p.category || p.sector).filter(Boolean)));

  const safePage = Math.min(currentPage, totalPages);

  const getStatusBadge = (status: string = 'PENDING') => {
    switch(status) {
      case 'APPROVED': return <span className="bg-green-500/10 text-green-500 border border-green-500/20 text-xs px-2 py-1 rounded font-bold flex items-center gap-1"><CheckCircle size={12}/> APPROVED</span>;
      case 'REJECTED': return <span className="bg-red-500/10 text-red-500 border border-red-500/20 text-xs px-2 py-1 rounded font-bold flex items-center gap-1"><XCircle size={12}/> REJECTED</span>;
      default: return <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs px-2 py-1 rounded font-bold flex items-center gap-1"><Clock size={12}/> PENDING</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Pitch Moderation</h1>
          <p className="text-slate-500 mt-1 dark:text-gray-500">Review and approve Sharia-compliant business proposals.</p>
        </div>
        
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Search pitches..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-input w-full md:w-64 pl-9 pr-4 py-2 text-sm"
            />
          </div>
          
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="admin-input px-3 py-2 text-sm"
            aria-label="Filter by category"
            title="Filter by category"
          >
            <option value="ALL">All Sectors</option>
            {categories.map((cat: any) => <option key={cat} value={cat}>{cat}</option>)}
          </select>

          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="admin-input px-3 py-2 text-sm"
            aria-label="Filter by status"
            title="Filter by status"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="admin-input px-3 py-2 text-sm"
            aria-label="Items per page"
            title="Items per page"
          >
            <option value={6}>6 per page</option>
            <option value={12}>12 per page</option>
            <option value={24}>24 per page</option>
          </select>
        </div>
      </div>

      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded shadow-lg text-white font-medium flex items-center gap-2 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
          {toast.message}
        </div>
      )}

      {loading ? <div className="text-center py-20 text-slate-500 dark:text-gray-400"><Loader2 className="animate-spin inline mr-2"/> Loading Pitches...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
           {pitches.length === 0 ? (
             <div className="col-span-full admin-surface">
               <EmptyState
                 title={hasFilters ? 'No pitches match this view' : 'No pitches yet'}
                 description={
                   hasFilters
                     ? 'Change the search term or moderation filters to find the pitch records you want to review.'
                     : 'Pitch submissions will appear here once founders publish them.'
                 }
                 actionLabel={hasFilters ? 'Clear filters' : 'Refresh pitches'}
                 onAction={() => {
                   if (hasFilters) {
                     setSearchQuery('');
                     setCategoryFilter('ALL');
                     setStatusFilter('ALL');
                     setCurrentPage(1);
                   } else {
                     fetchPitches();
                   }
                 }}
               />
             </div>
           ) : pitches.map((pitch) => {
             const ask = pitch.fundingAsk ? parseInt(pitch.fundingAsk) : 0;
             const status = pitch.status || 'PENDING';
             
             return (
               <div key={pitch.id} className="admin-surface p-6 rounded-xl relative flex flex-col h-full hover:border-slate-300 dark:hover:border-white/20 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                      <div>
                          {getStatusBadge(status)}
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-3 line-clamp-1" title={pitch.title}>{pitch.title}</h3>
                          <p className="text-primary text-xs font-bold uppercase mt-1">{pitch.category || pitch.sector || 'Uncategorized'}</p>
                      </div>
                  </div>
                  
                  <p className="text-slate-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">{pitch.tagline || pitch.description}</p>
                  
                  <div className="admin-surface-muted p-3 rounded-lg mb-4 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-slate-500 dark:text-gray-500 uppercase font-bold">Funding Ask</p>
                      <p className="text-slate-900 dark:text-white font-bold">NGN {ask.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-500 dark:text-gray-500 uppercase font-bold">Equity</p>
                      <p className="text-slate-900 dark:text-white font-bold">{pitch.equityOffered || 'N/A'}%</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-gray-500 mb-4 border-t border-slate-200 dark:border-white/5 pt-4">
                      <span className="truncate">By: {pitch.user?.entrepreneurProfile?.firstName || pitch.user?.email || 'Unknown User'}</span>
                  </div>
                  
                  <div className="flex gap-2 mt-auto">
                    <button onClick={() => setSelectedPitch(pitch)} className="flex-1 py-2 admin-button-secondary rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-2">
                        <Eye size={14} /> Details
                    </button>
                    {status === 'PENDING' && (
                      <button onClick={() => handleStatusUpdate(pitch.id, 'APPROVED')} className="flex-1 py-2 bg-primary/20 text-primary border border-primary/30 rounded-lg font-bold text-xs hover:bg-primary hover:text-black transition-all">
                          Approve
                      </button>
                    )}
                  </div>
               </div>
             );
           })}
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

      {/* View Details Modal */}
      {selectedPitch && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative dark:bg-[#1d1d20] dark:border-white/10">
            <button
              type="button"
              onClick={() => setSelectedPitch(null)}
              className="absolute top-4 right-4 text-slate-500 dark:text-gray-500 hover:text-slate-900 dark:hover:text-white admin-surface-muted p-1 rounded-full"
              aria-label="Close details modal"
              title="Close details modal"
            >
              <X size={20} />
            </button>
            
            <div className="mb-6 border-b border-slate-200 dark:border-white/10 pb-4 pr-8">
              <div className="flex items-center gap-2 mb-2">
                {getStatusBadge(selectedPitch.status)}
                <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs font-bold">{selectedPitch.category || selectedPitch.sector}</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">{selectedPitch.title}</h2>
              <p className="text-slate-600 dark:text-gray-400 mt-2">{selectedPitch.tagline}</p>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-slate-900 dark:text-white font-bold mb-2 uppercase text-xs tracking-wider">Full Description</h4>
                <p className="text-slate-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{selectedPitch.description}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="admin-surface-muted p-3 rounded">
                  <p className="text-slate-500 dark:text-gray-500 text-[10px] uppercase font-bold mb-1">Funding Ask</p>
                  <p className="text-slate-900 dark:text-white font-bold">NGN {parseInt(selectedPitch.fundingAsk || '0').toLocaleString()}</p>
                </div>
                <div className="admin-surface-muted p-3 rounded">
                  <p className="text-slate-500 dark:text-gray-500 text-[10px] uppercase font-bold mb-1">Equity Offered</p>
                  <p className="text-slate-900 dark:text-white font-bold">{selectedPitch.equityOffered || 'N/A'}%</p>
                </div>
                <div className="admin-surface-muted p-3 rounded">
                  <p className="text-slate-500 dark:text-gray-500 text-[10px] uppercase font-bold mb-1">Valuation</p>
                  <p className="text-slate-900 dark:text-white font-bold">
                    {selectedPitch.fundingAsk && selectedPitch.equityOffered ? 
                      `NGN ${Math.round((parseInt(selectedPitch.fundingAsk) / parseFloat(selectedPitch.equityOffered)) * 100).toLocaleString()}` : 'N/A'}
                  </p>
                </div>
                <div className="admin-surface-muted p-3 rounded">
                  <p className="text-slate-500 dark:text-gray-500 text-[10px] uppercase font-bold mb-1">Business Stage</p>
                  <p className="text-slate-900 dark:text-white font-bold truncate">{selectedPitch.stage || 'N/A'}</p>
                </div>
              </div>

              {selectedPitch.businessModel && (
                <div>
                  <h4 className="text-slate-900 dark:text-white font-bold mb-2 uppercase text-xs tracking-wider">Business Model</h4>
                  <p className="text-slate-700 dark:text-gray-300 text-sm admin-surface-muted p-4 rounded">{selectedPitch.businessModel}</p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-200 dark:border-white/10 mt-8">
                <button onClick={() => handleDelete(selectedPitch.id)} className="px-4 py-2 text-red-500 hover:bg-red-500/10 rounded flex items-center gap-2 text-sm font-bold mr-auto">
                  <AlertOctagon size={16} /> Delete Pitch
                </button>

                {(selectedPitch.status !== 'APPROVED') && (
                  <button onClick={() => handleStatusUpdate(selectedPitch.id, 'APPROVED')} className="px-6 py-2 bg-green-600 text-white rounded font-bold text-sm hover:bg-green-700">
                    Approve Pitch
                  </button>
                )}
                {(selectedPitch.status !== 'REJECTED') && (
                  <button onClick={() => handleStatusUpdate(selectedPitch.id, 'REJECTED')} className="px-6 py-2 border border-red-600/50 text-red-500 rounded font-bold text-sm hover:bg-red-900/30">
                    Reject Pitch
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PitchesList;
