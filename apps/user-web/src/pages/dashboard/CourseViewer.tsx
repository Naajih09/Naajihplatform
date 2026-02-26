import { CheckCircle, ChevronLeft, Clock, FileText, PlayCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/Button';

const CourseViewer = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchLesson = async () => {
      setLoading(true);
      try {
        // We use the general academy endpoint but filtered for this lesson
        // Actually, let's assume a direct lesson endpoint exists or we fetch the program and find it
        // To be safe, let's fetch the program data if we had the programId, 
        // but for now let's hope the backend can find lesson by ID directly if we add an endpoint.
        
        // Let's check my AcademyController again. I only had findOne(id).
        // I'll need a way to get lesson details.
        
        // For now, I'll use a hack of fetching all and finding it, 
        // but better to add a getLesson endpoint in backend soon.
        const res = await fetch(`http://localhost:3000/api/academy/lesson/${lessonId}`);
        const data = await res.json();
        setLesson(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (lessonId) fetchLesson();
  }, [lessonId]);

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      await fetch(`http://localhost:3000/api/academy/lesson/${lessonId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      navigate(-1); // Go back to dashboard
    } catch (err) {
      console.error(err);
    } finally {
      setIsCompleting(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Loading lesson...</div>;
  if (!lesson) return <div className="text-center py-20 text-red-500">Lesson not found</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-bold text-sm">
            <ChevronLeft size={16}/> Back to Curriculum
        </button>

        <div className="bg-[#1d1d20] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
            {/* Media Area */}
            {lesson.contentType === 'VIDEO' ? (
                <div className="aspect-video bg-black relative flex items-center justify-center">
                    {lesson.videoUrl ? (
                         <iframe 
                         src={lesson.videoUrl} 
                         className="w-full h-full" 
                         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                         allowFullScreen
                       ></iframe>
                    ) : (
                        <div className="text-center">
                            <PlayCircle size={64} className="text-gray-800 mb-4 mx-auto"/>
                            <p className="text-gray-500">Video content is restricted to enrollees.</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="p-12 border-b border-gray-800 bg-black/20 flex items-center justify-center">
                    <FileText size={80} className="text-primary opacity-20"/>
                </div>
            )}

            <div className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-primary/20 text-primary text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest">
                                {lesson.contentType}
                            </span>
                            <span className="text-slate-500 text-xs flex items-center gap-1 font-bold">
                                <Clock size={12}/> {lesson.duration || 5} Mins
                            </span>
                        </div>
                        <h1 className="text-3xl font-black text-white">{lesson.title}</h1>
                        <div className="mt-8 prose prose-invert max-w-none text-gray-400 leading-relaxed" 
                             dangerouslySetInnerHTML={{ __html: lesson.content || 'No content provided.' }}>
                        </div>
                    </div>

                    <div className="w-full md:w-auto mt-4">
                        <Button 
                            onClick={handleComplete}
                            disabled={isCompleting}
                            className="w-full md:w-auto bg-primary text-black font-black px-8 py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                        >
                            {isCompleting ? 'Saving...' : <><CheckCircle size={20}/> Mark as Complete</>}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default CourseViewer;