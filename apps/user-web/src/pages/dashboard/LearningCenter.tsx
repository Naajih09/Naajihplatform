import React, { useEffect, useState } from 'react';
import { PlayCircle, Lock, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LearningCenter = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/api/academy').then(r => r.json()).then(setCourses);
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 text-white font-sans pb-20">
      <h1 className="text-3xl font-black">Naajih Academy</h1>
      <p className="text-gray-400">Master the art of Halal Business.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map(course => (
          <div key={course.id} onClick={() => navigate(`/dashboard/academy/${course.id}`)} 
               className="bg-[#1d1d20] border border-gray-800 rounded-2xl overflow-hidden hover:border-primary cursor-pointer transition-all">
            <div className="h-40 bg-gray-800 flex items-center justify-center">
                {course.thumbnail ? <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover"/> : <BookOpen size={40} className="text-gray-600"/>}
            </div>
            <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-primary uppercase">{course.lessons.length} Lessons</span>
                    {course.isPremium && <Lock size={14} className="text-yellow-500" />}
                </div>
                <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{course.description}</p>
                <button className="mt-4 w-full py-2 bg-white/5 hover:bg-primary hover:text-black rounded font-bold text-sm transition-colors flex items-center justify-center gap-2">
                    <PlayCircle size={16} /> Start Learning
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default LearningCenter;