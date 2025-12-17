import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, DollarSign, PieChart, FileText, Target } from 'lucide-react';
import Button from '../../components/Button';

const CreatePitch = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    problemStatement: '',
    solution: '',
    traction: '',
    marketSize: '',
    fundingAsk: '',
    equityOffer: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3000/pitches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id, // Linking pitch to this user
          ...formData
        }),
      });

      if (!res.ok) throw new Error('Failed to post pitch');

      alert("Pitch Posted Successfully!");
      navigate('/dashboard');

    } catch (err) {
      alert("Error posting pitch. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-brand-dark mb-2">Create New Pitch</h2>
        <p className="text-gray-500 mb-8">Structure your idea clearly to attract serious investors.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Business Title" name="title" icon={Lightbulb} onChange={handleChange} required placeholder="e.g. SolarMax" />
            <Input label="Tagline (Short)" name="tagline" icon={Target} onChange={handleChange} required placeholder="Affordable solar for everyone" />
          </div>

          <TextArea label="The Problem" name="problemStatement" onChange={handleChange} placeholder="What pain point are you solving?" />
          <TextArea label="The Solution" name="solution" onChange={handleChange} placeholder="How does your product solve it?" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Traction / Revenue" name="traction" icon={FileText} onChange={handleChange} placeholder="e.g. 500 users, ₦1M revenue" />
            <Input label="Market Size" name="marketSize" icon={Target} onChange={handleChange} placeholder="e.g. 50M potential users in NG" />
          </div>

          <div className="p-4 bg-green-50 rounded-xl border border-green-100 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Funding Ask (₦)" name="fundingAsk" icon={DollarSign} type="number" onChange={handleChange} required />
            <Input label="Equity Offer (%)" name="equityOffer" icon={PieChart} type="number" onChange={handleChange} required />
          </div>

          <Button type="submit" className="w-full" isLoading={loading}>Post Pitch</Button>
        </form>
      </div>
    </div>
  );
};

const Input = ({ label, icon: Icon, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-brand-dark mb-1">{label}</label>
    <div className="relative">
      {Icon && <Icon size={18} className="absolute left-3 top-3 text-gray-400" />}
      <input className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-brand-blue outline-none ${Icon ? 'pl-10' : ''}`} {...props} />
    </div>
  </div>
);

const TextArea = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-brand-dark mb-1">{label}</label>
    <textarea rows="4" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-brand-blue outline-none" {...props} />
  </div>
);

export default CreatePitch;