import {
    AlertCircle,
    Award,
    BookOpen, CheckCircle,
    ChevronRight, Clock,
    FileText,
    PlayCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/Button';

const AcademyDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeModule, setActiveModule] = useState<string | null>(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchProgram = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/api/academy/${id}?userId=${user.id}`);
        const data = await res.json();
        setProgram(data);
        // Set first active module if any
        if (data.modules?.length > 0) {
           setActiveModule(data.modules[0].id);
        }
      } catch (err) {
        console.error("Failed to load program", err);
      } finally {
        setLoading(false);
      }
    };

    if (id && user.id) fetchProgram();
  }, [id, user.id]);

  if (loading) return <div className="text-center py-20 text-gray-500">Loading your curriculum...</div>;
  if (!program) return <div className="text-center py-20 text-red-500">Program not found</div>;

  // Calculate progress
  const allLessons = program.modules.flatMap((m: any) => m.lessons);
  const completedLessons = allLessons.filter((l: any) => l.progress && l.progress.length > 0);
  const progressPercent = allLessons.length > 0 ? Math.round((completedLessons.length / allLessons.length) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 font-sans text-white">
      
      {/* --- TOP: PROGRAM HEADER --- */}
      <div className="bg-[#1d1d20] border border-gray-800 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between md:items-end gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <span className="bg-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                 {program.cohort || 'Cohort 1'}
               </span>
               <span className="text-gray-400 text-sm flex items-center gap-1">
                 <Clock size={14}/> Ongoing Learning
               </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black">{program.title}</h1>
            <p className="text-gray-400 mt-2">{program.description}</p>
          </div>

          <div className="w-full md:w-64">
            <div className="flex justify-between text-xs font-bold mb-2 uppercase text-gray-500">
              <span>Program Progress</span>
              <span className="text-primary">{progressPercent}%</span>
            </div>
            <div className="h-3 w-full bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <div className="flex justify-between mt-4">
               <div className="text-center">
                  <p className="text-2xl font-bold">{allLessons.length}</p>
                  <p className="text-[10px] text-gray-500 uppercase">Lessons</p>
               </div>
               <div className="text-center">
                  <p className="text-2xl font-bold">{completedLessons.length}</p>
                  <p className="text-[10px] text-gray-500 uppercase">Completed</p>
               </div>
               <div className="text-center">
                  <p className="text-2xl font-bold">{progressPercent === 100 ? 1 : 0}</p>
                  <p className="text-[10px] text-gray-500 uppercase">Certs</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT: CURRICULUM (2/3 Width) --- */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                 <BookOpen className="text-primary" size={24}/> Curriculum
              </h2>
           </div>

           <div className="space-y-4">
             {program.modules.map((mod: any) => (
               <div key={mod.id} className={`border rounded-xl overflow-hidden transition-all ${mod.id === activeModule ? 'bg-[#151518] border-primary/50' : 'bg-[#1d1d20] border-gray-800'}`}>
                  
                  {/* Module Header */}
                  <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => setActiveModule(mod.id)}>
                    <div className="flex items-center gap-4">
                       <div className={`size-10 rounded-full flex items-center justify-center font-bold text-sm ${mod.id === activeModule ? 'bg-primary text-black' : 'bg-gray-800 text-gray-500'}`}>
                          {mod.order}
                       </div>
                       <div>
                          <h3 className={`font-bold ${mod.id === activeModule ? 'text-white' : 'text-gray-400'}`}>{mod.title}</h3>
                          <p className="text-xs text-gray-500">{mod.lessons?.length || 0} Lessons</p>
                       </div>
                    </div>
                    <ChevronRight size={20} className={`transform transition-transform ${mod.id === activeModule ? 'rotate-90' : ''} text-gray-500`}/>
                  </div>

                  {/* Lessons List (Only if Active) */}
                  {mod.id === activeModule && (
                    <div className="border-t border-gray-800 bg-black/20">
                       {mod.lessons.map((lesson: any) => (
                         <div key={lesson.id} className="p-4 flex items-center justify-between hover:bg-white/5 cursor-pointer transition-colors group" onClick={() => navigate(`/dashboard/academy/course/${lesson.id}`)}>
                            <div className="flex items-center gap-3">
                               {lesson.progress && lesson.progress.length > 0 ? (
                                 <CheckCircle size={18} className="text-green-500" />
                               ) : (
                                 <div className="size-4.5 rounded-full border-2 border-gray-600 group-hover:border-primary"></div>
                               )}
                               <span className={`text-sm ${lesson.progress?.length > 0 ? 'text-gray-500 line-through' : 'text-white font-medium'}`}>{lesson.title}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                               {lesson.contentType === 'VIDEO' ? <PlayCircle size={12}/> : <FileText size={12}/>}
                               {lesson.contentType}
                            </div>
                         </div>
                       ))}
                    </div>
                  )}
               </div>
             ))}
           </div>
        </div>

        {/* --- RIGHT: TASKS & MILESTONES (1/3 Width) --- */}
        <div className="space-y-8">
           
           {/* Weekly Tasks */}
           <div className="bg-[#1d1d20] border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <AlertCircle className="text-yellow-500" size={20}/> Program Tasks
              </h3>
              <div className="space-y-3">
                 <div className="p-8 text-center text-xs text-gray-500">
                    Submit your business assignments here.
                 </div>
              </div>
              <Button variant="outline" className="w-full mt-4 text-xs h-10 border-gray-700 hover:border-primary hover:text-primary">
                 View All Assignments
              </Button>
           </div>

           {/* Milestones */}
           <div className="bg-[#1d1d20] border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Award className="text-primary" size={20}/> Milestones
              </h3>
              <div className="flex flex-wrap gap-2 text-[10px] text-gray-500 uppercase font-bold">
                 No milestones achieved yet.
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default AcademyDashboard;