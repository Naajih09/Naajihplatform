import {
  BadgeCheck,
  Bookmark,
  Briefcase,
  Building2,
  Filter,
  Loader2,
  MessageSquare,
  Search,
  Settings,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../../components/EmptyState';
import { getApiBaseUrl } from '../../lib/api-base';
import { formatNaira, formatPercent, getNumericValue } from '../../lib/format-money';

const categories = ['All', 'AgriTech', 'FinTech', 'HealthTech', 'Retail', 'Real Estate'];

const getProfileName = (user: any) => {
  const profile = user?.entrepreneurProfile || user?.investorProfile || {};
  return `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || user?.email || 'Contact';
};

const DealCard = ({
  pitch,
  saved,
  onToggleSaved,
}: {
  pitch: any;
  saved: boolean;
  onToggleSaved: (id: string) => void;
}) => (
  <article className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-primary/40 dark:border-white/10 dark:bg-[#1d1d20]">
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        <h3 className="text-lg font-black text-slate-900 dark:text-white">{pitch.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-white/50">{pitch.tagline}</p>
      </div>
      <span className="shrink-0 rounded-full bg-primary/10 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-primary">
        {pitch.category || 'General'}
      </span>
    </div>

    <p className="line-clamp-3 flex-1 text-sm leading-6 text-slate-600 dark:text-gray-400">
      {pitch.problemStatement}
    </p>

    <div className="my-5 grid grid-cols-2 gap-4 border-y border-slate-200 py-4 dark:border-white/10">
      <div>
        <p className="mb-1 text-[10px] font-bold uppercase text-slate-500">Funding Ask</p>
        <p className="font-black text-slate-900 dark:text-white">{formatNaira(pitch.fundingAsk, '--')}</p>
      </div>
      <div>
        <p className="mb-1 text-[10px] font-bold uppercase text-slate-500">Equity</p>
        <p className="font-black text-slate-900 dark:text-white">{formatPercent(pitch.equityOffer, '--')}</p>
      </div>
    </div>

    <div className="mb-5 flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-wider">
      <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-500 dark:bg-white/10 dark:text-white/60">
        {pitch.investmentType === 'CONVENTIONAL' ? 'Conventional' : 'Sharia Compliant'}
      </span>
      <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-500 dark:bg-white/10 dark:text-white/60">
        {pitch.user?.entrepreneurProfile?.stage || 'Stage not set'}
      </span>
    </div>

    <div className="flex gap-3">
      <Link
        to={`/dashboard/opportunities/${pitch.id}`}
        className="flex-1 rounded-lg bg-primary py-2.5 text-center text-sm font-black text-black transition hover:brightness-110"
      >
        Review Deal
      </Link>
      <button
        type="button"
        onClick={() => onToggleSaved(pitch.id)}
        className={`inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-bold transition-colors ${
          saved
            ? 'border-primary bg-primary/10 text-primary'
            : 'border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/5'
        }`}
      >
        <Bookmark size={16} />
        {saved ? 'Saved' : 'Save'}
      </button>
    </div>
  </article>
);

export default function InvestorDashboard() {
  const [pitches, setPitches] = useState<any[]>([]);
  const [recommended, setRecommended] = useState<any[]>([]);
  const [connections, setConnections] = useState<any[]>([]);
  const [chatPartners, setChatPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedPitchIds, setSavedPitchIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('saved-pitches') || '[]');
    } catch {
      return [];
    }
  });

  const API_BASE = getApiBaseUrl();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const investorProfile = user?.investorProfile || {};
  const authToken =
    localStorage.getItem('accessToken') ||
    localStorage.getItem('access_token') ||
    '';
  const authHeaders = authToken ? { Authorization: `Bearer ${authToken}` } : {};

  useEffect(() => {
    const fetchPitches = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filter !== 'All') params.set('category', filter);
        if (investorProfile.investmentPreference && investorProfile.investmentPreference !== 'BOTH') {
          params.set('investmentType', investorProfile.investmentPreference);
        }

        const res = await fetch(`${API_BASE}/pitches${params.toString() ? `?${params.toString()}` : ''}`);
        if (res.ok) {
          const data = await res.json();
          setPitches(data?.data || data || []);
        }
      } catch (error) {
        console.error('Error fetching pitches', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPitches();
  }, [API_BASE, filter, investorProfile.investmentPreference]);

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
        console.error('Error fetching recommendations', error);
      }
    };

    fetchRecommended();
  }, [API_BASE, authToken]);

  useEffect(() => {
    const fetchNetwork = async () => {
      if (!user?.id || !authToken) return;
      try {
        const [connectionsRes, partnersRes] = await Promise.all([
          fetch(`${API_BASE}/connections/user/${user.id}`, { headers: authHeaders }),
          fetch(`${API_BASE}/messages/partners`, { headers: authHeaders }),
        ]);

        if (connectionsRes.ok) {
          const data = await connectionsRes.json();
          setConnections(Array.isArray(data) ? data : []);
        }

        if (partnersRes.ok) {
          const data = await partnersRes.json();
          setChatPartners(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Error fetching investor network', error);
      }
    };

    fetchNetwork();
  }, [API_BASE, authToken, user?.id]);

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
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(needle));
  };

  const visiblePitches = pitches.filter(matchesSearch);
  const visibleRecommended = recommended.filter(matchesSearch);
  const savedPitches = pitches.filter((pitch) => savedPitchIds.includes(pitch.id));
  const avgTicket = useMemo(() => {
    const asks = pitches
      .map((pitch) => getNumericValue(pitch.fundingAsk))
      .filter((value) => Number.isFinite(value) && value > 0);
    return asks.length > 0
      ? Math.round(asks.reduce((sum, value) => sum + value, 0) / asks.length)
      : 0;
  }, [pitches]);
  const hasFilters = filter !== 'All' || Boolean(searchQuery.trim());

  const toggleSavedPitch = (pitchId: string) => {
    setSavedPitchIds((prev) =>
      prev.includes(pitchId) ? prev.filter((id) => id !== pitchId) : [...prev, pitchId],
    );
  };

  const getConnectionContact = (connection: any) =>
    connection.senderId === user.id ? connection.receiver : connection.sender;

  const getChatContact = (connection: any) =>
    connection.senderId === user.id ? connection.receiver : connection.sender;

  return (
    <div className="min-h-screen bg-[#f8fafc] px-6 py-8 pb-24 text-slate-900 dark:bg-background-dark dark:text-white md:px-10">
      <div className="mx-auto max-w-[1240px] space-y-8">
        <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-primary">Investor Workspace</p>
            <h1 className="mt-2 flex items-center gap-2 text-3xl font-black">
              <Briefcase className="text-primary" /> Deal Flow Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-white/60">
              Review approved opportunities, save promising pitches, and manage founder conversations from one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              to="/dashboard/settings"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-[#1d1d20] dark:text-white/70 dark:hover:bg-white/5"
            >
              <Settings size={16} /> Preferences
            </Link>
            <Link
              to="/dashboard/opportunities"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-black text-black hover:brightness-110"
            >
              Browse All Deals
            </Link>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#1d1d20]">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-500">Available Deals</span>
              <TrendingUp className="text-primary/70" size={22} />
            </div>
            <p className="mt-4 text-3xl font-black">{pitches.length}</p>
            <p className="text-xs font-bold text-primary">Approved pipeline</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#1d1d20]">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-500">Average Ask</span>
              <Wallet className="text-primary/70" size={22} />
            </div>
            <p className="mt-4 text-2xl font-black">{avgTicket > 0 ? formatNaira(avgTicket) : '--'}</p>
            <p className="text-xs text-slate-500">Across current view</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#1d1d20]">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-500">Saved Pitches</span>
              <Bookmark className="text-primary/70" size={22} />
            </div>
            <p className="mt-4 text-3xl font-black">{savedPitchIds.length}</p>
            <p className="text-xs text-slate-500">Stored on this device</p>
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/10 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-700 dark:text-white/80">My Connections</span>
              <Users className="text-primary" size={22} />
            </div>
            <p className="mt-4 text-3xl font-black text-primary">{connections.length}</p>
            <p className="text-xs text-slate-600 dark:text-white/70">Accepted founder network</p>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#1d1d20]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-black">
                <Filter size={18} className="text-primary" /> Pitch Browser
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-white/50">
                Filter by sector and search founder opportunities.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex flex-wrap rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-white/10 dark:bg-[#151518]">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFilter(cat)}
                    className={`rounded-md px-3 py-1.5 text-xs font-black transition-colors ${
                      filter === cat
                        ? 'bg-primary text-black'
                        : 'text-slate-500 hover:text-slate-900 dark:text-white/60 dark:hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Search deals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-900 outline-none focus:border-primary/50 dark:border-white/10 dark:bg-[#151518] dark:text-white"
                />
              </div>
            </div>
          </div>
        </section>

        {visibleRecommended.length > 0 && (
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-black">Recommended Deal Flow</h2>
              <Link to="/dashboard/settings" className="text-sm font-bold text-primary">
                Tune focus areas
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {visibleRecommended.slice(0, 4).map((pitch) => (
                <DealCard
                  key={pitch.id}
                  pitch={pitch}
                  saved={savedPitchIds.includes(pitch.id)}
                  onToggleSaved={toggleSavedPitch}
                />
              ))}
            </div>
          </section>
        )}

        {savedPitches.length > 0 && (
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-black">Saved Pitches</h2>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                {savedPitches.length} saved
              </span>
            </div>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {savedPitches.slice(0, 4).map((pitch) => (
                <DealCard
                  key={pitch.id}
                  pitch={pitch}
                  saved
                  onToggleSaved={toggleSavedPitch}
                />
              ))}
            </div>
          </section>
        )}

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-black">Deal Flow Pipeline</h2>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                {visiblePitches.length} visible
              </span>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-primary" size={32} />
              </div>
            ) : visiblePitches.length === 0 ? (
              hasFilters ? (
                <EmptyState
                  title="No deals found"
                  description="No approved pitches match the current filters. Broaden sector or search terms."
                  actionLabel="Clear filters"
                  onAction={() => {
                    setFilter('All');
                    setSearchQuery('');
                  }}
                />
              ) : (
                <EmptyState
                  title="No approved opportunities yet"
                  description="Approved founder pitches will appear here when they enter investor discovery."
                  actionLabel="Open Opportunities"
                  actionTo="/dashboard/opportunities"
                />
              )
            ) : (
              <div className="grid grid-cols-1 gap-5">
                {visiblePitches.map((pitch) => (
                  <DealCard
                    key={pitch.id}
                    pitch={pitch}
                    saved={savedPitchIds.includes(pitch.id)}
                    onToggleSaved={toggleSavedPitch}
                  />
                ))}
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#1d1d20]">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-black">
                  <Building2 size={18} className="text-primary" /> My Connections
                </h2>
                <Link to="/dashboard/connections" className="text-xs font-bold text-primary">
                  View all
                </Link>
              </div>
              {connections.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-white/50">
                  Accepted founder connections will appear here after requests are approved.
                </p>
              ) : (
                <div className="space-y-3">
                  {connections.slice(0, 4).map((connection) => {
                    const contact = getConnectionContact(connection);
                    return (
                      <div key={connection.id} className="rounded-lg border border-slate-100 p-3 dark:border-white/10">
                        <p className="font-bold">{getProfileName(contact)}</p>
                        <p className="text-xs text-slate-500 dark:text-white/50">
                          {contact?.entrepreneurProfile?.businessName || contact?.entrepreneurProfile?.industry || 'Founder'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#1d1d20]">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-black">
                  <MessageSquare size={18} className="text-primary" /> Recent Messages
                </h2>
                <Link to="/dashboard/messages" className="text-xs font-bold text-primary">
                  Open inbox
                </Link>
              </div>
              {chatPartners.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-white/50">
                  Message threads will appear after you connect and start a conversation.
                </p>
              ) : (
                <div className="space-y-3">
                  {chatPartners.slice(0, 4).map((connection) => {
                    const contact = getChatContact(connection);
                    return (
                      <Link
                        key={connection.id}
                        to="/dashboard/messages"
                        className="block rounded-lg border border-slate-100 p-3 transition hover:border-primary/40 dark:border-white/10"
                      >
                        <p className="font-bold">{getProfileName(contact)}</p>
                        <p className="text-xs text-slate-500 dark:text-white/50">Continue conversation</p>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/10 p-5">
              <div className="mb-3 flex items-center gap-2 text-primary">
                <BadgeCheck size={18} />
                <h2 className="font-black">Investor Focus</h2>
              </div>
              <p className="text-sm leading-6 text-slate-700 dark:text-white/80">
                Your dashboard prioritizes saved pitches, focus areas, and investment preference. Update those settings when your mandate changes.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}
