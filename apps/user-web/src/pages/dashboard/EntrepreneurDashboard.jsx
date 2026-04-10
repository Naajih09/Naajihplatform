import { MapPin, BadgeCheck, CheckCircle, User as UserIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function EntrepreneurProfile() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const profile = user?.entrepreneurProfile || user?.investorProfile || {};
  const profileAvatar = profile.avatarUrl || user.avatarUrl || '';
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
  const authToken =
    localStorage.getItem('accessToken') ||
    localStorage.getItem('access_token') ||
    '';
  const authHeaders = authToken
    ? { Authorization: `Bearer ${authToken}` }
    : {};

  const [stats, setStats] = useState({
    activePitches: 0,
    pendingConnections: 0,
    isVerified: false,
    totalViews: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) return;
      try {
        const res = await fetch(`${API_BASE}/users/stats/${user.id}`, {
          headers: authHeaders,
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch stats", error);
      }
    };
    fetchStats();
  }, [user?.id]);

  const fullName = `${profile.firstName || 'User'} ${profile.lastName || ''}`.trim();
  const businessName = profile.businessName || profile.organization || 'Startup';
  const location = profile.location || 'Nigeria';
  const interests = profile.focusIndustries || [];
  const bio = profile.businessName
    ? `Building ${profile.businessName} with a focus on ${profile.industry || 'sustainable growth'}.`
    : 'Complete your profile to showcase your business story to investors.';

  return (
    <div className="min-h-screen bg-background-dark text-white px-6 md:px-10 py-8">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Sidebar */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-primary text-xs font-bold uppercase tracking-widest mb-3">
              Interests
            </h3>
            <div className="flex flex-wrap gap-2 text-xs">
              {(interests.length > 0 ? interests : ["Sharia-Compliant"]).map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 border border-white/10 rounded-full text-white/80"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </aside>

        {/* Main */}
        <section className="lg:col-span-9 space-y-6">

          {/* Profile Header */}
          <div className="glass-card rounded-xl p-8 border-l-4 border-primary">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">

              <div className="flex items-center gap-6">
                <div className="w-28 h-28 rounded-2xl border-2 border-primary bg-white/5 flex items-center justify-center overflow-hidden">
                  {profileAvatar ? (
                    <img
                      src={profileAvatar}
                      alt={`${fullName} profile`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserIcon size={40} className="text-white/60" />
                  )}
                </div>

                <div>
                  <h1 className="text-3xl font-extrabold">{fullName}</h1>
                  <p className="text-primary text-xs font-bold uppercase">
                    Founder @ {businessName}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-white/70 mt-2">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} /> {location}
                    </span>
                    <span className="flex items-center gap-1 text-primary">
                      <BadgeCheck size={14} /> Sharia-Compliant
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle size={14} /> {stats.isVerified ? 'KYC Verified' : 'Not Verified'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-bold">
                  Contact
                </button>
                <button className="px-6 py-2 bg-primary text-black rounded-lg text-sm font-bold">
                  Share Profile
                </button>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              ["Active Pitches", String(stats.activePitches), "Total"],
              ["Pending Connections", String(stats.pendingConnections), "Requests"],
              ["Verified", stats.isVerified ? "Yes" : "No", "Status"],
              ["Total Views", String(stats.totalViews || 0), "Profile"],
            ].map(([label, value, sub]) => (
              <div
                key={label}
                className="glass-card rounded-xl p-4 text-center"
              >
                <p className="text-xs uppercase text-white/50">{label}</p>
                <p className="text-2xl font-black text-primary">{value}</p>
                <p className="text-[10px] text-white/40">{sub}</p>
              </div>
            ))}
          </div>

          {/* Bio */}
          <div className="glass-card rounded-xl p-8">
            <h2 className="text-xl font-bold mb-3">Business Bio</h2>
            <p className="text-white/70 text-sm leading-relaxed">
              {bio}
            </p>
          </div>

        </section>
      </div>
    </div>
  );
}
