import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, Play } from 'lucide-react';

const CourseViewer = () => {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [course, setCourse] = useState<any>(null);
  const [activeLesson, setActiveLesson] = useState<any>(null);

  useEffect(() => {
    fetch(`http://localhost:3000/api/academy/${id}/user/${user.id}`)
      .then(r => r.json())
      .then(data => {
        setCourse(data);
        setActiveLesson(data.lessons[0]);
      });
  }, [id]);

  const markComplete = async () => {
    await fetch('http://localhost:3000/api/academy/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, lessonId: activeLesson.id })
    });
    alert("Lesson Completed!");
  };

  if (!course) return <div>Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 text-white font-sans h-[calc(100vh-100px)]">
      {/* Sidebar List */}
      <div className="bg-[#1d1d20] border border-gray-800 rounded-xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-800 font-bold">{course.title}</div>
        <div className="flex-1 overflow-y-auto">
            {course.lessons.map((lesson: any) => (
                <div key={lesson.id} onClick={() => setActiveLesson(lesson)} 
                     className={`p-4 border-b border-gray-800 cursor-pointer flex items-center justify-between ${activeLesson?.id === lesson.id ? 'bg-primary/10 border-l-4 border-l-primary' : 'hover:bg-white/5'}`}>
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Lesson {lesson.order}</p>
                        <p className="text-sm font-bold">{lesson.title}</p>
                    </div>
                    {lesson.progress.length > 0 && <CheckCircle size={16} className="text-green-500" />}
                </div>
            ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-2 bg-[#1d1d20] border border-gray-800 rounded-xl p-8 overflow-y-auto">
         <h2 className="text-2xl font-bold mb-4">{activeLesson?.title}</h2>
         
         {activeLesson?.videoUrl && (
             <div className="aspect-video bg-black rounded-xl mb-6 overflow-hidden">
                 <iframe src={activeLesson.videoUrl} className="w-full h-full" frameBorder="0" allowFullScreen></iframe>
             </div>
         )}
         
         <div className="prose prose-invert max-w-none text-gray-300">
             <p>{activeLesson?.content}</p>
         </div>

         <button onClick={markComplete} className="mt-8 px-6 py-3 bg-primary text-black font-bold rounded-xl flex items-center gap-2">
             Mark as Complete <CheckCircle size={18}/>
         </button>
      </div>
    </div>
  );
};
export default CourseViewer;