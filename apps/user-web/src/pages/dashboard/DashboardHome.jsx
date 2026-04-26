import { Award, BookOpen, Calendar, ChevronRight, Network, PlayCircle, Rocket, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import EmptyState from '../../components/EmptyState';
import OnboardingChecklist from '../../components/OnboardingChecklist';
import { showToast } from '../../lib/utils';
import { getApiBaseUrl } from '../../lib/api-base';

function DashboardHome() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const API_BASE = getApiBaseUrl();
  const authToken =
    localStorage.getItem('accessToken') ||
    localStorage.getItem('access_token') ||
    '';
  const authHeaders = authToken
    ? { Authorization: `Bearer ${authToken}` }
    : {};

  // Extract Name & Role
  const profile = user.entrepreneurProfile || user.investorProfile || {};
  const firstName = profile.firstName || user.firstName || 'User';
  const isAspirant = user.role === 'ASPIRING_BUSINESS_OWNER';

  const [stats, setStats] = useState({
    activePitches: 0,
    pendingConnections: 0,
    isVerified: false,
    totalViews: 0,
    hasPremium: false,
    pitchLimit: 1,
    remainingPitchSlots: 1,
    canCreatePitch: true,
  });

  // FIX: Removed <any[]>
  const [courses, setCourses] = useState([]);
  const [certificateCount, setCertificateCount] = useState(0);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState(null);

  // FETCH DATA BASED ON ROLE
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
if (isAspirant) {
  // If Aspirant, fetch Programs
  const res = await fetch(`${API_BASE}/academy`, { headers: authHeaders });
  if (!res.ok) {
    throw new Error(`Failed to load academy programs (${res.status})`);
  }
  const data = await res.json();
  const list = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data?.items)
    ? data.items
    : Array.isArray(data)
    ? data
    : [];
  setCourses(list); // "courses" actually refers to Programs here
} else {
  // If Entrepreneur/Investor, fetch Stats
  const res = await fetch(`${API_BASE}/users/stats/${user.id}`, { headers: authHeaders });
  const data = await res.json();
  setStats(data);
}
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    if (user.id) fetchData();
  }, [user.id, isAspirant]);

  useEffect(() => {
    if (!authToken || !user?.email) return;
    fetch(`${API_BASE}/users/${user.email}`, { headers: authHeaders })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          setSubscription(data.subscription || null);
          localStorage.setItem('user', JSON.stringify(data));
        }
      })
      .catch(() => null);
  }, [authToken, user?.email]);

  useEffect(() => {
    if (!isAspirant || !authToken || !Array.isArray(courses) || courses.length === 0) {
      setCertificateCount(0);
      return;
    }

    let active = true;

    const loadCertificates = async () => {
      try {
        const results = await Promise.all(
          courses.map(async (course) => {
            const enrollment = course.enrollments?.[0];
            const enrollmentStatus = enrollment?.status;
            const isEnrolled = enrollmentStatus === 'APPROVED';
            const totalLessons = course.modules?.reduce(
              (sum, mod) => sum + (mod.lessons?.length || 0),
              0,
            );
            const completedLessons = course.modules?.reduce(
              (sum, mod) =>
                sum +
                (mod.lessons?.filter((lesson) => lesson.progress?.length > 0)
                  .length || 0),
              0,
            );

            if (!isEnrolled || totalLessons === 0 || completedLessons < totalLessons) {
              return false;
            }

            const res = await fetch(`${API_BASE}/academy/certificate/${course.id}`, {
              headers: authHeaders,
            });
            return res.ok;
          }),
        );

        if (active) {
          setCertificateCount(results.filter(Boolean).length);
        }
      } catch (error) {
        console.error('Failed to load certificates', error);
        if (active) {
          setCertificateCount(0);
        }
      }
    };

    loadCertificates();

    return () => {
      active = false;
    };
  }, [courses, isAspirant, authToken, API_BASE]);

  const activeUntil = subscription?.endDate || subscription?.trialEndsAt;
  const hasPremium =
    subscription?.plan === 'PREMIUM' &&
    (!activeUntil || new Date(activeUntil) > new Date());
  const pitchLimitReached = user.role === 'ENTREPRENEUR' && stats.canCreatePitch === false;
  const pitchLimitText = stats.remainingPitchSlots === 0
    ? 'Free pitch allowance used'
    : stats.remainingPitchSlots === 1
    ? '1 free pitch slot left'
    : `${stats.remainingPitchSlots || 0} free pitch slots left`;

  const handleJoin = async (event, programId, isEnrolled, isPremium) => {
    event.stopPropagation();
    if (isEnrolled) {
      navigate(`/dashboard/academy/${programId}`);
      return;
    }
    if (!authToken) {
      showToast('Please log in to join this program.', 'error');
      return;
    }
    if (isPremium && !hasPremium) {
      showToast('Premium subscription required for this program.', 'error');
      navigate('/dashboard/subscription');
      return;
    }
    setJoiningId(programId);
    try {
      await fetch(`${API_BASE}/academy/join/${programId}`, {
        method: 'POST',
        headers: authHeaders,
      });
      setCourses(prev =>
        prev.map(course =>
          course.id === programId
            ? {
                ...course,
                enrollments: [
                  { id: 'local', enrolledAt: new Date().toISOString() },
                ],
              }
            : course,
        ),
      );
      navigate(`/dashboard/academy/${programId}`);
    } catch (err) {
      console.error(err);
      showToast('Unable to join program right now.', 'error');
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">

      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Welcome back, {firstName}
          </h2>
          <p className="text-slate-500 dark:text-neutral-muted font-medium mt-1">
            {isAspirant
              ? "Ready to learn? Here is your business curriculum."
              : "Here is what is happening with your business today."}
          </p>
        </div>
        <div className="text-slate-500 dark:text-neutral-muted text-sm font-medium flex items-center gap-1">
          <Calendar size={16} /> {new Date().toLocaleDateString('en-NG', { dateStyle: 'long' })}
        </div>
      </div>

      {/* Value section */}
      <section className="rounded-3xl border border-slate-200 dark:border-gray-800 bg-gradient-to-br from-white via-white to-slate-50 dark:from-[#151518] dark:via-[#151518] dark:to-[#1d1d20] p-6 md:p-8 shadow-sm">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            <Rocket size={14} />
            Halal business network
          </p>
          <h3 className="mt-4 text-2xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Connect with entrepreneurs, investors, and real opportunities
          </h3>
          <p className="mt-3 max-w-2xl text-sm md:text-base text-slate-600 dark:text-neutral-muted">
            Discover vetted founders, practical learning, and funding-ready opportunities in one place so you can grow with confidence.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              to="/dashboard/create-pitch"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-black shadow-lg shadow-primary/20 transition hover:brightness-110"
            >
              Create Opportunity
              <ChevronRight size={16} />
            </Link>
            <Link
              to="/dashboard/opportunities"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:bg-slate-50 dark:border-gray-700 dark:bg-[#1d1d20] dark:text-white dark:hover:bg-white/5"
            >
              Explore Opportunities
            </Link>
          </div>
        </div>
      </section>

      <div className="mt-6">
        <OnboardingChecklist />
      </div>

      {/* --- CONDITIONAL VIEW --- */}

      {isAspirant ? (
        /* --- ASPIRING OWNER VIEW (Learning Center) --- */
        <div className="space-y-8">
          {/* Quick Stats for Student */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-[#151518] p-6 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm flex items-center gap-4">
              <div className="size-12 bg-primary/20 rounded-full flex items-center justify-center text-primary"><BookOpen size={24} /></div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase">Available Courses</p>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">{courses.length}</h3>
              </div>
            </div>
            <div className="bg-white dark:bg-[#151518] p-6 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm flex items-center gap-4">
              <div className="size-12 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-500"><Award size={24} /></div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase">Certificates</p>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">{certificateCount}</h3>
              </div>
            </div>
          </div>

          {/* Course Grid */}
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recommended Courses</h3>
          {loading ? <div className="text-center py-10 text-gray-500">Loading Academy...</div> : courses.length === 0 ? (
            <EmptyState
              title="No academy programs yet"
              description="We will show learning programs here as soon as they are available for your account."
              actionLabel="Explore community"
              actionTo="/dashboard/community"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(course => {
                const totalLessons = course.modules?.reduce(
                  (sum, mod) => sum + (mod.lessons?.length || 0),
                  0,
                );
                const completedLessons = course.modules?.reduce(
                  (sum, mod) =>
                    sum +
                    (mod.lessons?.filter((lesson) => lesson.progress?.length > 0)
                      .length || 0),
                  0,
                );
                const enrollment = course.enrollments?.[0];
                const enrollmentStatus = enrollment?.status;
                const isEnrolled = enrollmentStatus === 'APPROVED';
                const isPending = enrollmentStatus === 'PENDING';
                const isRejected = enrollmentStatus === 'REJECTED';

                return (
                <div key={course.id} onClick={() => navigate(`/dashboard/academy/${course.id}`)}
                  className="bg-white dark:bg-[#151518] border border-slate-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:border-primary/50 cursor-pointer transition-all shadow-sm group">
                  <div className="h-40 bg-slate-200 dark:bg-gray-800 flex items-center justify-center relative">
                    {course.thumbnail && !course.thumbnail.includes('sample') ? (
                      <img src={course.thumbnail} className="w-full h-full object-cover" alt="Course Thumbnail" />
                    ) : (
                      <BookOpen size={40} className="text-slate-400 dark:text-gray-600" />
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <PlayCircle size={48} className="text-white" />
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-primary uppercase">{totalLessons || 0} Lessons</span>
                      {course.isPremium ? (
                        <span className="bg-amber-500/20 text-amber-500 text-[10px] font-bold px-2 py-1 rounded">PREMIUM</span>
                      ) : (
                        <span className="bg-green-500/20 text-green-500 text-[10px] font-bold px-2 py-1 rounded">FREE</span>
                      )}
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">{course.title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2">{course.description}</p>
                    <div className="flex items-center justify-between mt-4 text-xs text-slate-500">
                      <span>{completedLessons}/{totalLessons || 0} completed</span>
                      <span className="uppercase font-bold">
                        {isEnrolled ? 'Enrolled' : isPending ? 'Pending' : isRejected ? 'Rejected' : 'Not Joined'}
                      </span>
                    </div>
                    <Button
                      onClick={(event) => handleJoin(event, course.id, isEnrolled, Boolean(course.isPremium))}
                      className={`mt-3 w-full font-bold ${
                        isEnrolled ? 'bg-white/10 text-white' : 'bg-primary text-neutral-dark'
                      }`}
                      disabled={joiningId === course.id || isPending}
                    >
                      {joiningId === course.id
                        ? 'Joining...'
                        : isEnrolled
                        ? 'Continue'
                        : isPending
                        ? 'Pending Approval'
                        : isRejected
                        ? 'Reapply'
                        : course.isPremium && !hasPremium
                        ? 'Upgrade to Access'
                        : 'Join Program'}
                    </Button>
                  </div>
                </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* --- NORMAL VIEW (Entrepreneur / Investor) --- */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-[#151518] p-6 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm flex flex-col justify-between min-h-[160px]">
            <div className="flex justify-between items-start">
              <Rocket className="text-primary" size={32} />
            </div>
            <div>
              <p className="text-slate-500 dark:text-neutral-muted text-xs font-bold uppercase tracking-wider">Active Pitches</p>
              <h3 className="text-4xl font-black mt-1 text-slate-900 dark:text-white">
                {loading ? '...' : stats.activePitches}
              </h3>
            </div>
          </div>

          <div className="bg-white dark:bg-[#151518] p-6 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm flex flex-col justify-between min-h-[160px]">
            <div className="flex justify-between items-start">
              <Network className="text-primary" size={32} />
            </div>
            <div>
              <p className="text-slate-500 dark:text-neutral-muted text-xs font-bold uppercase tracking-wider">Pending Connections</p>
              <h3 className="text-4xl font-black mt-1 text-slate-900 dark:text-white">
                {loading ? '...' : stats.pendingConnections}
              </h3>
            </div>
          </div>

          <div className="col-span-1 md:col-span-1 lg:col-span-2 bg-slate-900 dark:bg-black p-6 rounded-2xl border border-gray-800 shadow-xl flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-primary" size={24} />
                <h4 className="text-white font-bold text-sm tracking-wide uppercase">Verification Status</h4>
              </div>
              <span className={`px-3 py-1 text-neutral-dark text-[10px] font-black rounded-full uppercase ${stats.isVerified ? 'bg-primary' : 'bg-yellow-500'}`}>
                {stats.isVerified ? 'Verified' : 'Pending'}
              </span>
            </div>
            <div className="mt-8">
              <div className="flex justify-between items-end mb-2">
                <p className="text-white text-2xl font-black">
                  {stats.isVerified ? '100%' : user.emailVerified ? '60%' : '20%'}
                </p>
                <p className="text-neutral-muted text-xs">
                  {stats.isVerified
                    ? 'Fully verified'
                    : user.emailVerified
                    ? 'Identity review in progress'
                    : 'Verify your email and identity'}
                </p>
              </div>
              <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full"
                  style={{ width: stats.isVerified ? '100%' : user.emailVerified ? '60%' : '20%' }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section (Dynamic) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-primary p-8 rounded-3xl relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-2xl font-black text-neutral-dark mb-2">
              {isAspirant ? "Start Your Business" : pitchLimitReached ? "Upgrade to keep posting" : "Ready to expand?"}
            </h3>
            <p className="text-neutral-dark/70 font-medium mb-6 max-w-sm">
              {isAspirant
                ? "Have you completed your courses? Create your first pitch now."
                : pitchLimitReached
                ? `You have reached the free plan limit. ${pitchLimitText}. Upgrade to Premium to post unlimited pitches.`
                : "Connect with over 500+ certified halal investors."}
            </p>

            <Link to={pitchLimitReached ? "/dashboard/subscription?reason=pitch-limit" : "/dashboard/create-pitch"} className="inline-block">
              <button className="bg-neutral-dark text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-neutral-dark/90 transition-all flex items-center gap-2">
                {pitchLimitReached ? "Upgrade Now" : "Launch New Pitch"} <ChevronRight size={16} />
              </button>
            </Link>
            {user.role === 'ENTREPRENEUR' && (
              <p className="mt-4 text-xs font-bold uppercase tracking-widest text-neutral-dark/70">
                {hasPremium ? 'Premium active - unlimited pitches' : pitchLimitText}
              </p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-[#151518] border border-slate-200 dark:border-gray-800 p-8 rounded-3xl flex items-center justify-between shadow-sm">
          <div>
            <h3 className="text-xl font-black mb-2 text-slate-900 dark:text-white">Need Guidance?</h3>
            <p className="text-slate-500 dark:text-neutral-muted text-sm mb-4">Book a session with our Islamic Finance consultants.</p>

            <a href="mailto:support@naajihbiz.com?subject=Consultation%20Request" className="text-slate-900 dark:text-white font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
              Schedule a Call <ChevronRight size={14} />
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}

export default DashboardHome;
