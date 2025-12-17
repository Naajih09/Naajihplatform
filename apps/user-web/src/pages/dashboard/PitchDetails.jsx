import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Building, MapPin, DollarSign, PieChart, FileText, CheckCircle, ArrowLeft } from 'lucide-react';
import Button from '../../components/Button';

const PitchDetails = () => {
  const { id } = useParams(); // Get Pitch ID from URL
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  
  const [pitch, setPitch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    // Fetch Pitch Details
    const fetchPitch = async () => {
      try {
        const res = await fetch(`http://localhost:3000/pitches/${id}`);
        const data = await res.json();
        setPitch(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPitch();
  }, [id]);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const res = await fetch('http://localhost:3000/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: currentUser.id,
          receiverId: pitch.userId // The Entrepreneur's ID
        })
      });

      if (res.ok) {
        alert("Connection Request Sent! 🚀");
      }
    } catch (err) {
      alert("Failed to connect.");
    } finally {
      setConnecting(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Details...</div>;
  if (!pitch) return <div className="p-10 text-center">Pitch not found.</div>;

  const profile = pitch.user?.entrepreneurProfile || {};

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 text-sm pl-0 hover:bg-transparent">
        <ArrowLeft size={16}/> Back to Feed
      </Button>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="p-8 bg-brand-bg border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <span className="bg-blue-100 text-brand-blue text-xs font-bold px-3 py-1 rounded-full uppercase">
                {profile.industry || 'Business'}
              </span>
              <h1 className="text-3xl font-bold text-brand-dark mt-3">{pitch.title}</h1>
              <p className="text-gray-600 text-lg mt-2">{pitch.tagline}</p>
              <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                <div className="flex items-center gap-1"><Building size={16}/> {profile.businessName}</div>
                <div className="flex items-center gap-1"><MapPin size={16}/> {profile.location}</div>
              </div>
            </div>
            
            {/* Connect Button (Only for Investors) */}
            {currentUser.role === 'INVESTOR' && (
              <Button onClick={handleConnect} isLoading={connecting}>
                Connect with Founder
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left: The Story */}
          <div className="md:col-span-2 space-y-8">
            <Section title="The Problem" content={pitch.problemStatement} />
            <Section title="The Solution" content={pitch.solution} />
            <Section title="Traction & Numbers" content={pitch.traction} icon={FileText} />
          </div>

          {/* Right: The Ask */}
          <div className="space-y-6">
            <div className="bg-green-50 p-6 rounded-xl border border-green-100">
              <p className="text-green-700 font-bold mb-1 flex items-center gap-2"><DollarSign size={18}/> Funding Ask</p>
              <p className="text-3xl font-bold text-brand-dark">₦ {parseInt(pitch.fundingAsk).toLocaleString()}</p>
            </div>
            <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-100">
              <p className="text-yellow-700 font-bold mb-1 flex items-center gap-2"><PieChart size={18}/> Equity Offered</p>
              <p className="text-3xl font-bold text-brand-dark">{pitch.equityOffer}%</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl">
              <p className="text-gray-500 font-bold mb-2">Market Size</p>
              <p className="text-brand-dark">{pitch.marketSize}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const Section = ({ title, content, icon: Icon }) => (
  <div>
    <h3 className="text-lg font-bold text-brand-dark mb-2 flex items-center gap-2">
      {Icon && <Icon size={20} className="text-brand-blue"/>} {title}
    </h3>
    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{content}</p>
  </div>
);

export default PitchDetails;