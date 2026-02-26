import { BadgeCheck, Briefcase, Building2, Filter, Loader2, Search, TrendingUp, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function InvestorDashboard() {
  const [pitches, setPitches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    // In a real scenario, this uses RTK Query or fetch to /api/pitches
    const fetchPitches = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/pitches${filter !== 'All' ? `?category=${filter}` : ''}`);
        if (res.ok) {
           const data = await res.json();
           setPitches(data);
        }
      } catch (error) {
        console.error("Error fetching pitches", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPitches();
  }, [filter]);

  return (
    <div className="min-h-screen bg-background-dark text-white px-6 md:px-10 py-8 pb-24">
      <div className="max-w-[1200px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-black mb-2 flex items-center gap-2">
              <Briefcase className="text-primary" /> Investor Command Center
            </h1>
            <p className="text-white/60 text-sm">Discover and evaluate Sharia-compliant investment opportunities.</p>
          </div>
          
          <div className="flex bg-[#1d1d20] border border-white/10 rounded-lg p-1">
             {['All', 'AgriTech', 'FinTech', 'Real Estate'].map(cat => (
                <button 
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${filter === cat ? 'bg-primary text-black' : 'text-white/60 hover:text-white'}`}
                >
                  {cat}
                </button>
             ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-xl border border-white/5 bg-gradient-to-br from-[#262626] to-[#1a1a1a] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm font-medium">Available Deals</span>
                <TrendingUp className="text-primary/50" size={24} />
              </div>
              <div className="mt-4">
                <h3 className="text-3xl font-bold tracking-tight text-white">{pitches.length > 0 ? pitches.length : '--'}</h3>
                <span className="text-primary text-xs font-bold">Actively seeking capital</span>
              </div>
            </div>

            <div className="p-6 rounded-xl border border-white/5 bg-gradient-to-br from-[#262626] to-[#1a1a1a] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm font-medium">Average Ticket Size</span>
                <Wallet className="text-primary/50" size={24} />
              </div>
              <div className="mt-4">
                <h3 className="text-3xl font-bold tracking-tight text-white">₦2.5M</h3>
                <span className="text-white/50 text-xs font-bold">Platform-wide average</span>
              </div>
            </div>

            <div className="p-6 rounded-xl border border-primary/20 bg-primary/5 flex flex-col justify-between border-l-4 border-l-primary relative overflow-hidden">
               <div className="absolute -right-4 -bottom-4 opacity-10">
                 <BadgeCheck size={100} />
               </div>
              <div className="flex items-center justify-between relative z-10">
                <span className="text-gray-300 text-sm font-medium">Your Network</span>
                <Building2 className="text-primary" size={24} />
              </div>
              <div className="mt-4 relative z-10">
                <h3 className="text-3xl font-bold tracking-tight text-primary">0</h3>
                <span className="text-white/70 text-xs font-medium">Connected founders</span>
              </div>
            </div>

        </div>

        {/* Pitch Feed */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-6">
             <h2 className="text-xl font-bold text-white flex items-center gap-2">
               <Filter size={18} className="text-primary" /> Deal Flow Pipeline
             </h2>
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                <input 
                  type="text" 
                  placeholder="Search pitches..." 
                  className="bg-[#1d1d20] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50 text-white placeholder:text-white/30"
                />
             </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          ) : pitches.length === 0 ? (
            <div className="bg-[#1d1d20] border border-white/5 rounded-xl p-12 text-center">
                <div className="bg-white/5 size-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="text-white/30" size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No deals found</h3>
                <p className="text-gray-500 text-sm">There are currently no active pitches matching your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {pitches.map((pitch: any) => (
                    <div key={pitch.id} className="bg-[#1d1d20] border border-white/5 hover:border-primary/30 transition-all rounded-xl p-6 group flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                           <div>
                               <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{pitch.title}</h3>
                               <p className="text-sm text-white/50">{pitch.tagline}</p>
                           </div>
                           <span className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                               {pitch.category || "General"}
                           </span>
                        </div>
                        
                        <p className="text-sm text-gray-400 line-clamp-3 mb-6 flex-grow">
                            {pitch.problemStatement}
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-6 py-4 border-y border-white/5">
                            <div>
                                <p className="text-[10px] uppercase text-gray-500 mb-1">Funding Ask</p>
                                <p className="font-bold text-white">₦{pitch.fundingAsk?.toLocaleString() || '0'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase text-gray-500 mb-1">Equity Offered</p>
                                <p className="font-bold text-white">{pitch.equityOffer || '0'}%</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Link to={`/dashboard/opportunities/${pitch.id}`} className="flex-1 text-center bg-primary text-black font-bold text-sm py-2.5 rounded-lg hover:bg-primary/90 transition-colors">
                                Review Deal
                            </Link>
                            <button className="px-4 py-2 border border-white/10 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                                Save
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
