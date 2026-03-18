import {
    AlertCircle,
    Award,
    BookOpen, CheckCircle,
    ChevronRight, Clock,
    FileText,
    Lock,
    PlayCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/Button';
import { showToast } from '../../lib/utils';

const AcademyDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [submissionUrls, setSubmissionUrls] = useState<Record<string, string>>({});
  const [submittingTaskId, setSubmittingTaskId] = useState<string | null>(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
  const authToken =
    localStorage.getItem('accessToken') ||
    localStorage.getItem('access_token') ||
    '';
  const authHeaders = authToken
    ? { Authorization: `Bearer ${authToken}` }
    : {};

  useEffect(() => {
    const fetchProgram = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/academy/${id}`, {
          headers: authHeaders,
        });
        const data = await res.json();
        setProgram(data);
        // Set first active module if any
        if (data.modules?.length > 0) {
          const firstUnlocked = data.modules.find((mod: any) => mod.isUnlocked !== false);
          setActiveModule((firstUnlocked || data.modules[0]).id);
        }
      } catch (err) {
        console.error("Failed to load program", err);
      } finally {
        setLoading(false);
      }
    };

    if (id && user.id) fetchProgram();
  }, [id, user.id]);

  useEffect(() => {
    const fetchMilestones = async () => {
      if (!authToken) return;
      try {
        const res = await fetch(`${API_BASE}/academy/milestones`, {
          headers: authHeaders,
        });
        const data = await res.json();
        setMilestones(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load milestones', err);
      }
    };

    fetchMilestones();
  }, [authToken]);

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

  if (loading) return <div className="text-center py-20 text-slate-500 dark:text-gray-500">Loading your curriculum...</div>;
  if (!program) return <div className="text-center py-20 text-red-500">Program not found</div>;

  const enrollment = program.enrollments?.[0];
  const enrollmentStatus = enrollment?.status;
  const isEnrolled = enrollmentStatus === 'APPROVED';
  const isPending = enrollmentStatus === 'PENDING';
  const isRejected = enrollmentStatus === 'REJECTED';
  const activeUntil = subscription?.endDate || subscription?.trialEndsAt;
  const hasPremium =
    subscription?.plan === 'PREMIUM' &&
    (!activeUntil || new Date(activeUntil) > new Date());

  const handleJoin = async () => {
    if (!authToken) {
      showToast('Please log in to join this program.', 'error');
      return;
    }
    if (program?.isPremium && !hasPremium) {
      showToast('Premium subscription required for this program.', 'error');
      navigate('/dashboard/subscription');
      return;
    }
    setIsJoining(true);
    try {
      await fetch(`${API_BASE}/academy/join/${program.id}`, {
        method: 'POST',
        headers: authHeaders,
      });
      setProgram((prev: any) => ({
        ...prev,
        enrollments: [{ id: 'local', enrolledAt: new Date().toISOString() }],
      }));
      showToast('Enrollment submitted for approval.', 'success');
    } catch (err) {
      console.error(err);
      showToast('Unable to submit enrollment.', 'error');
    } finally {
      setIsJoining(false);
    }
  };

  const activeModuleData = program.modules.find((mod: any) => mod.id === activeModule);
  const programCertificate = milestones.find(
    (entry: any) => entry?.milestone?.title === `Completed: ${program.title}`,
  );

  const handleSubmitTask = async (taskId: string) => {
    if (!authToken) {
      showToast('Please log in to submit assignments.', 'error');
      return;
    }
    if (!isEnrolled) {
      showToast('Enrollment approval is required to submit assignments.', 'error');
      return;
    }
    const submissionUrl = submissionUrls[taskId];
    if (!submissionUrl) {
      showToast('Please add a submission link.', 'error');
      return;
    }

    setSubmittingTaskId(taskId);
    try {
      const res = await fetch(`${API_BASE}/academy/task/${taskId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify({ submissionUrl }),
      });
      if (!res.ok) {
        throw new Error('Submit failed');
      }

      setProgram((prev: any) => {
        const updatedModules = prev.modules.map((mod: any) => ({
          ...mod,
          tasks: mod.tasks?.map((task: any) =>
            task.id === taskId
              ? {
                  ...task,
                  submissions: [
                    {
                      id: `local-${Date.now()}`,
                      submissionUrl,
                      status: 'SUBMITTED',
                      submittedAt: new Date().toISOString(),
                    },
                  ],
                }
              : task,
          ),
        }));
        return { ...prev, modules: updatedModules };
      });

      showToast('Assignment submitted.', 'success');
    } catch (err) {
      console.error(err);
      showToast('Unable to submit assignment.', 'error');
    } finally {
      setSubmittingTaskId(null);
    }
  };

  // Calculate progress
  const allLessons = program.modules.flatMap((m: any) => m.lessons);
  const completedLessons = allLessons.filter((l: any) => l.progress && l.progress.length > 0);
  const progressPercent = allLessons.length > 0 ? Math.round((completedLessons.length / allLessons.length) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 font-sans text-slate-900 dark:text-white">
      
      {/* --- TOP: PROGRAM HEADER --- */}
      <div className="bg-white dark:bg-[#1d1d20] border border-slate-200 dark:border-gray-800 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between md:items-end gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <span className="bg-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                 {program.cohort || 'Cohort 1'}
               </span>
               <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full ${program.isPremium ? 'bg-amber-500/20 text-amber-400' : 'bg-green-500/20 text-green-400'}`}>
                 {program.isPremium ? 'Premium' : 'Free'}
               </span>
               {enrollmentStatus && (
                 <span
                   className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full ${
                     enrollmentStatus === 'APPROVED'
                       ? 'bg-green-500/20 text-green-400'
                       : enrollmentStatus === 'REJECTED'
                       ? 'bg-red-500/20 text-red-400'
                       : 'bg-yellow-500/20 text-yellow-400'
                   }`}
                 >
                   {enrollmentStatus}
                 </span>
               )}
               <span className="text-slate-500 dark:text-gray-400 text-sm flex items-center gap-1">
                 <Clock size={14}/> Ongoing Learning
               </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black">{program.title}</h1>
            <p className="text-slate-500 dark:text-gray-400 mt-2">{program.description}</p>
          </div>

          <div className="w-full md:w-64">
            <div className="flex justify-between text-xs font-bold mb-2 uppercase text-slate-500 dark:text-gray-500">
              <span>Program Progress</span>
              <span className="text-primary">{progressPercent}%</span>
            </div>
            <div className="h-3 w-full bg-slate-200 dark:bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <div className="flex justify-between mt-4">
               <div className="text-center">
                  <p className="text-2xl font-bold">{allLessons.length}</p>
                  <p className="text-[10px] text-slate-500 dark:text-gray-500 uppercase">Lessons</p>
               </div>
               <div className="text-center">
                  <p className="text-2xl font-bold">{completedLessons.length}</p>
                  <p className="text-[10px] text-slate-500 dark:text-gray-500 uppercase">Completed</p>
               </div>
               <div className="text-center">
                  <p className="text-2xl font-bold">{progressPercent === 100 ? 1 : 0}</p>
                  <p className="text-[10px] text-slate-500 dark:text-gray-500 uppercase">Certs</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {!isEnrolled && (
        <div className="bg-slate-50 dark:bg-[#151518] border border-slate-200 dark:border-gray-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {isPending
                ? 'Enrollment pending approval.'
                : isRejected
                ? 'Enrollment declined. You can reapply.'
                : program.isPremium && !hasPremium
                ? 'Premium subscription required to enroll.'
                : 'Join this cohort to unlock the lessons.'}
            </h3>
            <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">
              {isPending
                ? 'An admin will review your request shortly.'
                : isRejected
                ? 'Update your details and submit again.'
                : program.isPremium && !hasPremium
                ? 'Upgrade your plan to access premium programs.'
                : 'Enroll once and your progress will be tracked automatically.'}
            </p>
          </div>
          <Button
            onClick={handleJoin}
            disabled={isJoining || isPending}
            className="bg-primary text-neutral-dark font-bold px-6 py-3 rounded-xl"
          >
            {isJoining
              ? 'Submitting...'
              : isPending
              ? 'Pending Approval'
              : isRejected
              ? 'Reapply'
              : program.isPremium && !hasPremium
              ? 'Upgrade to Access'
              : 'Join Program'}
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT: CURRICULUM (2/3 Width) --- */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                 <BookOpen className="text-primary" size={24}/> Curriculum
              </h2>
           </div>

           <div className="space-y-4">
             {program.modules.map((mod: any) => {
               const isLocked = mod.isUnlocked === false;
               const unlockDateLabel = mod.unlockDate
                 ? new Date(mod.unlockDate).toLocaleDateString('en-NG', { dateStyle: 'medium' })
                 : null;

               return (
               <div key={mod.id} className={`border rounded-xl overflow-hidden transition-all ${mod.id === activeModule ? 'bg-slate-50 dark:bg-[#151518] border-primary/50' : 'bg-white dark:bg-[#1d1d20] border-slate-200 dark:border-gray-800'}`}>
                  
                  {/* Module Header */}
                  <div
                    className="p-4 flex items-center justify-between cursor-pointer"
                    onClick={() => {
                      if (isLocked) {
                        showToast(
                          `Module unlocks on ${unlockDateLabel || 'soon'}.`,
                          'error',
                        );
                        return;
                      }
                      setActiveModule(mod.id);
                    }}
                  >
                    <div className="flex items-center gap-4">
                       <div className={`size-10 rounded-full flex items-center justify-center font-bold text-sm ${mod.id === activeModule ? 'bg-primary text-black' : 'bg-slate-200 dark:bg-gray-800 text-slate-500 dark:text-gray-500'}`}>
                          {mod.order}
                       </div>
                       <div>
                          <h3 className={`font-bold ${mod.id === activeModule ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-gray-400'}`}>{mod.title}</h3>
                          <p className="text-xs text-slate-500 dark:text-gray-500">{mod.lessons?.length || 0} Lessons</p>
                       </div>
                    </div>
                    {isLocked ? (
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-gray-500">
                        <Lock size={14} />
                        <span>Locked</span>
                      </div>
                    ) : (
                    <ChevronRight size={20} className={`transform transition-transform ${mod.id === activeModule ? 'rotate-90' : ''} text-slate-500 dark:text-gray-500`}/>
                    )}
                  </div>

                  {/* Lessons List (Only if Active) */}
                  {mod.id === activeModule && (
                    <div className="border-t border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-black/20">
                       {mod.lessons.map((lesson: any) => {
                         const contentLabel = String(lesson.contentType || '').toUpperCase();
                         return (
                         <div
                           key={lesson.id}
                           className="p-4 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer transition-colors group"
                           onClick={() => {
                             if (!isEnrolled) {
                               showToast('Join the program to access lessons.', 'error');
                               return;
                             }
                             if (isLocked) {
                               showToast(
                                 `Module unlocks on ${unlockDateLabel || 'soon'}.`,
                                 'error',
                               );
                               return;
                             }
                             navigate(`/dashboard/academy/course/${lesson.id}`);
                           }}
                         >
                            <div className="flex items-center gap-3">
                               {lesson.progress && lesson.progress.length > 0 ? (
                                 <CheckCircle size={18} className="text-green-500" />
                               ) : (
                                 <div className="size-4.5 rounded-full border-2 border-slate-400 dark:border-gray-600 group-hover:border-primary"></div>
                               )}
                               <span className={`text-sm ${lesson.progress?.length > 0 ? 'text-slate-500 dark:text-gray-500 line-through' : 'text-slate-900 dark:text-white font-medium'}`}>{lesson.title}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-gray-500 bg-slate-100 dark:bg-gray-800 px-2 py-1 rounded">
                               {contentLabel === 'VIDEO' ? <PlayCircle size={12}/> : <FileText size={12}/>}
                               {contentLabel || 'LESSON'}
                            </div>
                         </div>
                       );
                       })}
                    </div>
                  )}
               </div>
             );
             })}
           </div>
        </div>

        {/* --- RIGHT: TASKS & MILESTONES (1/3 Width) --- */}
        <div className="space-y-8">
           
           {/* Weekly Tasks */}
           <div className="bg-white dark:bg-[#1d1d20] border border-slate-200 dark:border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <AlertCircle className="text-yellow-500" size={20}/> Program Tasks
              </h3>
              <div className="space-y-3">
                {activeModuleData?.tasks?.length ? (
                  activeModuleData.tasks.map((task: any) => {
                    const latestSubmission = task.submissions?.[0];
                    const status = latestSubmission?.status || 'PENDING';
                    const dueLabel = task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString('en-NG', { dateStyle: 'medium' })
                      : null;

                    return (
                      <div key={task.id} className="bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-gray-800 rounded-xl p-4 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-sm">{task.title}</h4>
                            <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">{task.description}</p>
                            {dueLabel && (
                              <p className="text-[10px] uppercase text-slate-500 dark:text-gray-500 mt-2">Due {dueLabel}</p>
                            )}
                          </div>
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                              status === 'APPROVED'
                                ? 'bg-green-500/20 text-green-400'
                                : status === 'REJECTED'
                                ? 'bg-red-500/20 text-red-400'
                                : status === 'SUBMITTED'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-gray-400'
                            }`}
                          >
                            {status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="url"
                            placeholder="Paste submission link"
                            value={submissionUrls[task.id] || latestSubmission?.submissionUrl || ''}
                            onChange={(event) =>
                              setSubmissionUrls((prev) => ({ ...prev, [task.id]: event.target.value }))
                            }
                            className="flex-1 bg-white dark:bg-black/30 border border-slate-300 dark:border-gray-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-primary"
                          />
                          <Button
                            onClick={() => handleSubmitTask(task.id)}
                            disabled={submittingTaskId === task.id || !isEnrolled}
                            className="bg-primary text-neutral-dark text-xs font-bold px-3 py-2 rounded-lg"
                          >
                            {submittingTaskId === task.id ? 'Submitting...' : 'Submit'}
                          </Button>
                        </div>
                        {latestSubmission?.feedback && (
                          <p className="text-xs text-slate-500 dark:text-gray-400">Feedback: {latestSubmission.feedback}</p>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-xs text-slate-500 dark:text-gray-500">
                    Select a module to view assignments.
                  </div>
                )}
              </div>
           </div>

           {/* Milestones */}
           <div className="bg-white dark:bg-[#1d1d20] border border-slate-200 dark:border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Award className="text-primary" size={20}/> Milestones
              </h3>
              {milestones.length ? (
                <div className="space-y-2">
                  {milestones.map((entry: any) => (
                    <div key={entry.id} className="bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-gray-800 rounded-lg p-3">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{entry.milestone?.title}</p>
                      <p className="text-[10px] text-slate-500 dark:text-gray-500 mt-1">
                        Achieved {new Date(entry.achievedAt).toLocaleDateString('en-NG', { dateStyle: 'medium' })}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-[10px] text-slate-500 dark:text-gray-500 uppercase font-bold">
                  No milestones achieved yet.
                </div>
              )}
           </div>

           {progressPercent === 100 && isEnrolled && (
            <div className="bg-primary/10 border border-primary/40 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">Certificate Unlocked</h3>
              <p className="text-xs text-slate-600 dark:text-gray-300 mb-4">
                {hasPremium
                  ? 'You completed the full curriculum. Download your certificate.'
                  : 'Certificates are available on Premium plans.'}
              </p>
              <Button
                className="w-full bg-primary text-neutral-dark font-bold"
                disabled={!programCertificate || !hasPremium}
                onClick={() => {
                  if (!hasPremium) {
                    showToast('Premium access required for certificates.', 'error');
                    navigate('/dashboard/subscription');
                    return;
                  }
                  navigate(`/dashboard/academy/certificate/${program.id}`);
                }}
              >
                {!hasPremium ? 'Upgrade to Premium' : programCertificate ? 'View Certificate' : 'Processing Certificate'}
              </Button>
            </div>
           )}

        </div>
      </div>
    </div>
  );
};

export default AcademyDashboard;
