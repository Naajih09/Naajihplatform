import { BadgeCheck, Briefcase, Building2, Filter, Loader2, Search, TrendingUp, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function InvestorDashboard() {
  const [pitches, setPitches] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [networkCount, setNetworkCount] = useState(0);
  const [avgTicket, setAvgTicket] = useState(0);
  const [savedPitchIds, setSavedPitchIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('saved-pitches') || '[]');
    } catch {
      return [];
    }
  });
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const authToken =
    localStorage.getItem('accessToken') ||
    localStorage.getItem('access_token') ||
    '';
  const authHeaders = authToken
    ? { Authorization: `Bearer ${authToken}` }
    : {};

  useEffect(() => {
    const fetchPitches = async () => {
      try {
        const res = await fetch(`${API_BASE}/pitches${filter !== 'All' ? `?category=${filter}` : ''}`);
        if (res.ok) {
          const data = await res.json();
          const list = data?.data || data || [];
          setPitches(list);

          const asks = list
            .map((pitch: any) => Number(pitch.fundingAsk))
            .filter((value: number) => Number.isFinite(value) && value > 0);
          const avg = asks.length > 0 ? Math.round(asks.reduce((sum: number, v: number) => sum + v, 0) / asks.length) : 0;
          setAvgTicket(avg);
        }
      } catch (error) {
        console.error("Error fetching pitches", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPitches();
  }, [filter]);

  useEffect(() => {
    const fetchConnections = async () => {
      if (!user?.id) return;
      try {
        const res = await fetch(`${API_BASE}/connections/user/${user.id}`, {
          headers: authHeaders,
        });
        if (res.ok) {
          const data = await res.json();
          setNetworkCount(Array.isArray(data) ? data.length : 0);
        }
      } catch (error) {
        console.error("Error fetching connections", error);
      }
    };
    fetchConnections();
  }, [user?.id]);

  useEffect(() => {
    const fetchRecommended = async () => {
      if (!authToken) return;
      try {
        const res = await fetch(`${API_BASE}/pitches/recommended`, {
          headers: authHeaders,
        });
        if (res.ok) {
          const data = await res.json();
          setRecommended(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Error fetching recommendations", error);
      }
    };
    fetchRecommended();
  }, [authToken]);

  useEffect(() => {
    localStorage.setItem('saved-pitches', JSON.stringify(savedPitchIds));
  }, [savedPitchIds]);

  const matchesSearch = (pitch: any) => {
    const needle = searchQuery.trim().toLowerCase();
    if (!needle) return true;
    return [
      pitch.title,
      pitch.tagline,
      pitch.problemStatement,
      pitch.category,
      pitch.user?.entrepreneurProfile?.firstName,
      pitch.user?.entrepreneurProfile?.lastName,
      pitch.user?.investorProfile?.firstName,
      pitch.user?.investorProfile?.lastName,
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(needle));
  };

  const visiblePitches = pitches.filter(matchesSearch);
  const visibleRecommended = recommended.filter(matchesSearch);

  const toggleSavedPitch = (pitchId: string) => {
    setSavedPitchIds((prev) =>
      prev.includes(pitchId) ? prev.filter((id) => id !== pitchId) : [...prev, pitchId],
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 dark:bg-background-dark dark:text-white px-6 md:px-10 py-8 pb-24">
      <div className="max-w-[1200px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-black mb-2 flex items-center gap-2">
              <Briefcase className="text-primary" /> Investor Command Center
            </h1>
            <p className="text-slate-500 dark:text-white/60 text-sm">Discover and evaluate Sharia-compliant investment opportunities.</p>
          </div>
          
          <div className="flex bg-white dark:bg-[#1d1d20] border border-slate-200 dark:border-white/10 rounded-lg p-1">
             {['All', 'AgriTech', 'FinTech', 'Real Estate'].map(cat => (
                <button 
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${filter === cat ? 'bg-primary text-black' : 'text-slate-500 hover:text-slate-900 dark:text-white/60 dark:hover:text-white'}`}
                >
                  {cat}
                </button>
             ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-xl border border-slate-200 dark:border-white/5 bg-gradient-to-br from-white to-slate-100 dark:from-[#262626] dark:to-[#1a1a1a] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-gray-400 text-sm font-medium">Available Deals</span>
                <TrendingUp className="text-primary/50" size={24} />
              </div>
              <div className="mt-4">
                <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{pitches.length > 0 ? pitches.length : '--'}</h3>
                <span className="text-primary text-xs font-bold">Actively seeking capital</span>
              </div>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 dark:border-white/5 bg-gradient-to-br from-white to-slate-100 dark:from-[#262626] dark:to-[#1a1a1a] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-gray-400 text-sm font-medium">Average Ticket Size</span>
                <Wallet className="text-primary/50" size={24} />
              </div>
              <div className="mt-4">
                <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {avgTicket > 0 ? `NGN ${avgTicket.toLocaleString()}` : '--'}
                </h3>
                <span className="text-slate-400 dark:text-white/50 text-xs font-bold">Platform-wide average</span>
              </div>
            </div>

            <div className="p-6 rounded-xl border border-primary/20 bg-primary/5 flex flex-col justify-between border-l-4 border-l-primary relative overflow-hidden">
               <div className="absolute -right-4 -bottom-4 opacity-10">
                 <BadgeCheck size={100} />
               </div>
              <div className="flex items-center justify-between relative z-10">
                <span className="text-slate-600 dark:text-gray-300 text-sm font-medium">Your Network</span>
                <Building2 className="text-primary" size={24} />
              </div>
              <div className="mt-4 relative z-10">
                <h3 className="text-3xl font-bold tracking-tight text-primary">{networkCount}</h3>
                <span className="text-slate-600 dark:text-white/70 text-xs font-medium">Connected founders</span>
              </div>
            </div>

        </div>

        {/* Pitch Feed */}
        <div className="mt-10">
          {visibleRecommended.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Recommended for You</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {visibleRecommended.slice(0, 4).map((pitch: any) => (
                  <div key={pitch.id} className="bg-white dark:bg-[#1d1d20] border border-slate-200 dark:border-white/5 hover:border-primary/30 transition-all rounded-xl p-6 group flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{pitch.title}</h3>
                        <p className="text-sm text-slate-500 dark:text-white/50">{pitch.tagline}</p>
                      </div>
                      <span className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                        {pitch.category || "General"}
                      </span>
                    </div>
                    
                    <p className="text-sm text-slate-500 dark:text-gray-400 line-clamp-3 mb-6 flex-grow">
                      {pitch.problemStatement}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-6 py-4 border-y border-slate-200 dark:border-white/5">
                      <div>
                        <p className="text-[10px] uppercase text-slate-500 dark:text-gray-500 mb-1">Funding Ask</p>
                        <p className="font-bold text-slate-900 dark:text-white">NGN {pitch.fundingAsk?.toLocaleString() || '0'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase text-slate-500 dark:text-gray-500 mb-1">Equity Offered</p>
                        <p className="font-bold text-slate-900 dark:text-white">{pitch.equityOffer || '0'}%</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Link to={`/dashboard/opportunities/${pitch.id}`} className="flex-1 text-center bg-primary text-black font-bold text-sm py-2.5 rounded-lg hover:bg-primary/90 transition-colors">
                        Review Deal
                      </Link>
                      <button
                        onClick={() => toggleSavedPitch(pitch.id)}
                        className="px-4 py-2 border border-slate-200 dark:border-white/10 rounded-lg text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                      >
                        {savedPitchIds.includes(pitch.id) ? 'Saved' : 'Save'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-6">
             <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
               <Filter size={18} className="text-primary" /> Deal Flow Pipeline
             </h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40" size={16} />
                <input 
                  type="text" 
                  placeholder="Search pitches..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white dark:bg-[#1d1d20] border border-slate-200 dark:border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30"
                />
             </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          ) : visiblePitches.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-white/10 dark:bg-[#1d1d20]">
                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/5">
                  <Briefcase className="text-slate-400 dark:text-white/30" size={24} />
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">No deals found</h3>
                <p className="mx-auto max-w-md text-sm text-slate-500 dark:text-gray-500">
                  No active pitches match the current filters. Broaden the stage, sector, or search terms to uncover more deals.
                </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {visiblePitches.map((pitch: any) => (
                    <div key={pitch.id} className="bg-white dark:bg-[#1d1d20] border border-slate-200 dark:border-white/5 hover:border-primary/30 transition-all rounded-xl p-6 group flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                           <div>
                               <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{pitch.title}</h3>
                               <p className="text-sm text-slate-500 dark:text-white/50">{pitch.tagline}</p>
                           </div>
                           <span className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                               {pitch.category || "General"}
                           </span>
                        </div>
                        
                        <p className="text-sm text-slate-500 dark:text-gray-400 line-clamp-3 mb-6 flex-grow">
                            {pitch.problemStatement}
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-6 py-4 border-y border-slate-200 dark:border-white/5">
                            <div>
                                <p className="text-[10px] uppercase text-slate-500 dark:text-gray-500 mb-1">Funding Ask</p>
                                <p className="font-bold text-slate-900 dark:text-white">NGN {pitch.fundingAsk?.toLocaleString() || '0'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase text-slate-500 dark:text-gray-500 mb-1">Equity Offered</p>
                                <p className="font-bold text-slate-900 dark:text-white">{pitch.equityOffer || '0'}%</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Link to={`/dashboard/opportunities/${pitch.id}`} className="flex-1 text-center bg-primary text-black font-bold text-sm py-2.5 rounded-lg hover:bg-primary/90 transition-colors">
                                Review Deal
                            </Link>
                            <button
                                onClick={() => toggleSavedPitch(pitch.id)}
                                className="px-4 py-2 border border-slate-200 dark:border-white/10 rounded-lg text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                            >
                                {savedPitchIds.includes(pitch.id) ? 'Saved' : 'Save'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
