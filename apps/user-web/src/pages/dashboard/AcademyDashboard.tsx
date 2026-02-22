import React, { useState } from 'react';
import { 
  BookOpen, CheckCircle, Lock, PlayCircle, FileText, 
  Calendar, Award, ChevronRight, Clock, AlertCircle 
} from 'lucide-react';
import Button from '../../components/Button';
import { useNavigate } from 'react-router-dom';

// MOCK DATA (To visualize the structure before connecting API)
const PROGRAM_DATA = {
  title: "Business Builder Program",
  cohort: "Cohort 3 (Feb 2026)",
  progress: 35,
  currentWeek: "Week 2: Market Validation",
  nextDeadline: "Friday, 12 Feb - 11:59 PM",
  modules: [
    {
      id: 1, title: "Week 1: Mindset & Ideation", status: "COMPLETED",
      lessons: [
        { id: 101, title: "Welcome to the Program", type: "VIDEO", completed: true },
        { id: 102, title: "The Entrepreneurial Mindset", type: "READ", completed: true },
      ]
    },
    {
      id: 2, title: "Week 2: Market Validation", status: "ACTIVE",
      lessons: [
        { id: 201, title: "Identifying Your Customer", type: "VIDEO", completed: true },
        { id: 202, title: "Conducting Interviews", type: "READ", completed: false }, // Current
        { id: 203, title: "The Mom Test Framework", type: "READ", completed: false },
      ]
    },
    {
      id: 3, title: "Week 3: Financial Modeling", status: "LOCKED", lessons: []
    }
  ],
  tasks: [
    { id: 1, title: "Submit 50 Customer Interviews", status: "PENDING", due: "12 Feb" },
    { id: 2, title: "Define Value Proposition", status: "SUBMITTED", due: "10 Feb" },
    { id: 3, title: "Week 1 Quiz", status: "APPROVED", due: "05 Feb" },
  ]
};

const AcademyDashboard = () => {
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState(2); // Week 2 is active

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 font-sans text-white">
      
      {/* --- TOP: PROGRAM HEADER --- */}
      <div className="bg-[#1d1d20] border border-gray-800 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between md:items-end gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <span className="bg-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                 {PROGRAM_DATA.cohort}
               </span>
               <span className="text-gray-400 text-sm flex items-center gap-1">
                 <Clock size={14}/> Next Deadline: <span className="text-white font-bold">{PROGRAM_DATA.nextDeadline}</span>
               </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black">{PROGRAM_DATA.title}</h1>
            <p className="text-gray-400 mt-2">You are currently on <span className="text-white font-bold">{PROGRAM_DATA.currentWeek}</span>.</p>
          </div>

          <div className="w-full md:w-64">
            <div className="flex justify-between text-xs font-bold mb-2 uppercase text-gray-500">
              <span>Program Progress</span>
              <span className="text-primary">{PROGRAM_DATA.progress}%</span>
            </div>
            <div className="h-3 w-full bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${PROGRAM_DATA.progress}%` }}></div>
            </div>
            <div className="flex justify-between mt-4">
               <div className="text-center">
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-[10px] text-gray-500 uppercase">Lessons</p>
               </div>
               <div className="text-center">
                  <p className="text-2xl font-bold">4</p>
                  <p className="text-[10px] text-gray-500 uppercase">Projects</p>
               </div>
               <div className="text-center">
                  <p className="text-2xl font-bold">0</p>
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
              <Button className="bg-primary text-black font-bold text-sm px-6">Continue Learning</Button>
           </div>

           <div className="space-y-4">
             {PROGRAM_DATA.modules.map((mod) => (
               <div key={mod.id} className={`border rounded-xl overflow-hidden transition-all ${mod.id === activeModule ? 'bg-[#151518] border-primary/50' : 'bg-[#1d1d20] border-gray-800 opacity-80 hover:opacity-100'}`}>
                  
                  {/* Module Header */}
                  <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => mod.status !== 'LOCKED' && setActiveModule(mod.id)}>
                    <div className="flex items-center gap-4">
                       <div className={`size-10 rounded-full flex items-center justify-center font-bold text-sm ${mod.status === 'COMPLETED' ? 'bg-green-900/50 text-green-500' : mod.status === 'ACTIVE' ? 'bg-primary text-black' : 'bg-gray-800 text-gray-500'}`}>
                          {mod.status === 'COMPLETED' ? <CheckCircle size={20}/> : mod.status === 'LOCKED' ? <Lock size={20}/> : mod.id}
                       </div>
                       <div>
                          <h3 className={`font-bold ${mod.status === 'ACTIVE' ? 'text-white' : 'text-gray-400'}`}>{mod.title}</h3>
                          <p className="text-xs text-gray-500">{mod.status === 'LOCKED' ? 'Available next week' : `${mod.lessons.length} Lessons`}</p>
                       </div>
                    </div>
                    {mod.status !== 'LOCKED' && <ChevronRight size={20} className={`transform transition-transform ${mod.id === activeModule ? 'rotate-90' : ''} text-gray-500`}/>}
                  </div>

                  {/* Lessons List (Only if Active) */}
                  {mod.id === activeModule && (
                    <div className="border-t border-gray-800 bg-black/20">
                       {mod.lessons.map((lesson) => (
                         <div key={lesson.id} className="p-4 flex items-center justify-between hover:bg-white/5 cursor-pointer transition-colors group" onClick={() => navigate(`/dashboard/academy/${lesson.id}`)}>
                            <div className="flex items-center gap-3">
                               {lesson.completed ? (
                                 <CheckCircle size={18} className="text-green-500" />
                               ) : (
                                 <div className="size-4.5 rounded-full border-2 border-gray-600 group-hover:border-primary"></div>
                               )}
                               <span className={`text-sm ${lesson.completed ? 'text-gray-500 line-through' : 'text-white font-medium'}`}>{lesson.title}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                               {lesson.type === 'VIDEO' ? <PlayCircle size={12}/> : <FileText size={12}/>}
                               {lesson.type}
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
                <AlertCircle className="text-yellow-500" size={20}/> This Week's Tasks
              </h3>
              <div className="space-y-3">
                {PROGRAM_DATA.tasks.map((task) => (
                   <div key={task.id} className="p-3 bg-[#151518] rounded-lg border border-gray-800 flex items-start gap-3">
                      <div className={`mt-1 size-2 rounded-full ${task.status === 'PENDING' ? 'bg-yellow-500' : task.status === 'APPROVED' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                      <div className="flex-1">
                         <p className="text-sm font-bold text-white">{task.title}</p>
                         <div className="flex justify-between items-center mt-2">
                            <span className="text-[10px] text-gray-500 bg-gray-800 px-2 py-0.5 rounded">Due: {task.due}</span>
                            <span className={`text-[10px] font-bold uppercase ${task.status === 'PENDING' ? 'text-yellow-500' : task.status === 'APPROVED' ? 'text-green-500' : 'text-blue-500'}`}>
                               {task.status}
                            </span>
                         </div>
                      </div>
                   </div>
                ))}
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
              <div className="flex flex-wrap gap-2">
                 <div className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/50 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle size={12}/> Idea Validated</div>
                 <div className="px-3 py-1 bg-gray-800 text-gray-500 border border-gray-700 rounded-full text-xs font-bold flex items-center gap-1 opacity-50"><Lock size={12}/> First Sale</div>
                 <div className="px-3 py-1 bg-gray-800 text-gray-500 border border-gray-700 rounded-full text-xs font-bold flex items-center gap-1 opacity-50"><Lock size={12}/> Pitch Ready</div>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default AcademyDashboard;