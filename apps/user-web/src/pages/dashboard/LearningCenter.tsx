import React, { useEffect, useState } from 'react';
import { PlayCircle, BookOpen, Clock, BarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { showToast } from '../../lib/utils';

const LearningCenter = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
  const authToken =
    localStorage.getItem('accessToken') ||
    localStorage.getItem('access_token') ||
    '';
  const authHeaders = authToken
    ? { Authorization: `Bearer ${authToken}` }
    : {};

  useEffect(() => {
    let active = true;
    fetch(`${API_BASE}/academy`, { headers: authHeaders })
      .then(async (r) => {
        if (!r.ok) throw new Error('Failed to load academy programs.');
        return r.json();
      })
      .then((data) => {
        if (!active) return;
        const list = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.items)
          ? data.items
          : Array.isArray(data)
          ? data
          : [];
        setCourses(list);
      })
      .catch(() => showToast('Failed to load academy programs.', 'error'));
    return () => {
      active = false;
    };
  }, [API_BASE, authToken]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user?.email || !authToken) return;
    fetch(`${API_BASE}/users/${user.email}`, { headers: authHeaders })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          setSubscription(data.subscription || null);
          localStorage.setItem('user', JSON.stringify(data));
        }
      })
      .catch(() => null);
  }, [API_BASE, authToken]);

  const handleJoin = async (event: React.MouseEvent, programId: string, isPremium: boolean) => {
    event.stopPropagation();
    if (!authToken) {
      showToast('Please log in to join this program.', 'error');
      return;
    }
    const activeUntil = subscription?.endDate || subscription?.trialEndsAt;
    const hasPremium =
      subscription?.plan === 'PREMIUM' &&
      (!activeUntil || new Date(activeUntil) > new Date());
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
    <div className="max-w-7xl mx-auto space-y-10 pb-20 font-sans text-slate-900 dark:text-white">
      
      {/* HEADER */}
      <div className="text-center space-y-4 py-10 bg-white dark:bg-[#1d1d20] rounded-3xl border border-slate-200 dark:border-gray-800">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          Naajih <span className="text-primary">Academy</span>
        </h1>
        <p className="text-slate-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
          Practical, Islam-compliant business education. Go from idea to investment in weeks, not years.
        </p>
      </div>

      {/* COURSE LIST */}
      <div>
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <BookOpen className="text-primary"/> Flagship Programs
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => {
            const totalLessons = course.modules?.reduce(
              (sum: number, mod: any) => sum + (mod.lessons?.length || 0),
              0,
            );
            const completedLessons = course.modules?.reduce(
              (sum: number, mod: any) =>
                sum +
                (mod.lessons?.filter((lesson: any) => lesson.progress?.length > 0)
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
                 className="group bg-white dark:bg-[#151518] border border-slate-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:border-primary/50 cursor-pointer transition-all hover:-translate-y-1 shadow-lg">
              
              {/* Thumbnail */}
              <div className="h-48 bg-slate-100 dark:bg-gray-800 relative overflow-hidden">
                  {course.thumbnail ? (
                    <img src={course.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={course.title}/>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500 dark:text-gray-500">
                      <BookOpen size={40} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <PlayCircle size={48} className="text-white fill-white/20" />
                  </div>
                  {/* Badge */}
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white border border-white/10">
                    {course.isPremium ? 'Premium' : 'Free Access'}
                  </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col h-52">
                  <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-gray-500 line-clamp-3 mb-4 flex-1">
                    {course.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-gray-800">
                     <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-gray-400 font-medium">
                        <span className="flex items-center gap-1"><BarChart size={14}/> Beginner</span>
                        <span className="flex items-center gap-1"><Clock size={14}/> {totalLessons || 0} Lessons</span>
                     </div>
                     <span className="text-[10px] font-bold text-slate-500 dark:text-gray-500 uppercase">
                       {completedLessons}/{totalLessons || 0} done
                     </span>
                  </div>

                  <Button
                    onClick={(event) => handleJoin(event, course.id, Boolean(course.isPremium))}
                    className={`mt-4 w-full font-bold ${
                      isEnrolled ? 'bg-slate-100 text-slate-900 dark:bg-white/10 dark:text-white' : 'bg-primary text-neutral-dark'
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
                      : course.isPremium
                      ? 'Upgrade to Access'
                      : 'Join Program'}
                  </Button>
              </div>
            </div>
          );
          })}
        </div>
      </div>
    </div>
  );
};
export default LearningCenter;
