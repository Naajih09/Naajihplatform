import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Briefcase, TrendingUp, Lightbulb, AlertCircle, CheckCircle } from 'lucide-react';
import Button from '../../components/Button';

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = Role Selection, 2 = Form
  const [role, setRole] = useState('ENTREPRENEUR');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Connect to NestJS API
      const res = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          role: role // Sends 'ENTREPRENEUR', 'INVESTOR', or 'ASPIRING_BUSINESS_OWNER'
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Signup failed');

      alert("Account created successfully!");
      navigate('/login');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* LEFT: Branding */}
      <div className="hidden lg:flex w-1/3 bg-brand-blue p-12 flex-col justify-between text-white relative overflow-hidden">
        <div className="z-10 font-bold text-2xl">NaajihBiz<span className="text-brand-gold">.</span></div>
        <div className="z-10">
          <h1 className="text-4xl font-bold mb-4">Join the Ecosystem.</h1>
          <p className="text-blue-100">Connect with trusted investors and build the future of halal business.</p>
        </div>
        {/* Abstract Circles */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-gold/20 rounded-full blur-2xl"></div>
      </div>

      {/* RIGHT: Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-brand-dark">Create Account</h2>
            <p className="text-brand-gray">Step {step} of 2</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2 mb-6 text-sm">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          {step === 1 ? (
            <div className="space-y-4">
              <p className="font-medium text-brand-dark">I am joining as:</p>
              
              <RoleCard 
                selected={role === 'ENTREPRENEUR'} 
                onClick={() => setRole('ENTREPRENEUR')}
                icon={Briefcase}
                title="Entrepreneur"
                desc="I have a business or idea and need funding."
              />
              
              <RoleCard 
                selected={role === 'INVESTOR'} 
                onClick={() => setRole('INVESTOR')}
                icon={TrendingUp}
                title="Investor"
                desc="I want to fund verified halal businesses."
              />

              <RoleCard 
                selected={role === 'ASPIRING_BUSINESS_OWNER'} 
                onClick={() => setRole('ASPIRING_BUSINESS_OWNER')}
                icon={Lightbulb}
                title="Aspiring Owner"
                desc="I am learning and looking for opportunities."
              />

              <Button className="w-full mt-6" onClick={() => setStep(2)}>Continue</Button>
            </div>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-brand-dark">First Name</label>
                  <input required type="text" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none" 
                    onChange={e => setFormData({...formData, firstName: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-medium text-brand-dark">Last Name</label>
                  <input required type="text" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none" 
                    onChange={e => setFormData({...formData, lastName: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-brand-dark">Email Address</label>
                <input required type="email" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none" 
                  onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>

              <div>
                <label className="text-sm font-medium text-brand-dark">Password</label>
                <input required type="password" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none" 
                  onChange={e => setFormData({...formData, password: e.target.value})} />
                <p className="text-xs text-brand-gray mt-1">Must be at least 6 characters.</p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="ghost" type="button" onClick={() => setStep(1)}>Back</Button>
                <Button variant="primary" type="submit" className="flex-1" isLoading={loading}>Create Account</Button>
              </div>
            </form>
          )}

          <p className="text-center text-sm text-brand-gray mt-8">
            Already have an account? <Link to="/login" className="text-brand-blue font-semibold hover:underline">Log In</Link>
          </p>

        </div>
      </div>
    </div>
  );
};

// Helper Component for Role Selection
const RoleCard = ({ selected, onClick, icon: Icon, title, desc }) => (
  <div 
    onClick={onClick}
    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
      selected 
      ? 'border-brand-blue bg-blue-50/50' 
      : 'border-gray-100 hover:border-blue-100 hover:bg-gray-50'
    }`}
  >
    <div className={`p-2 rounded-lg ${selected ? 'bg-brand-blue text-white' : 'bg-gray-100 text-gray-500'}`}>
      <Icon size={24} />
    </div>
    <div>
      <h3 className={`font-bold ${selected ? 'text-brand-blue' : 'text-brand-dark'}`}>{title}</h3>
      <p className="text-sm text-brand-gray leading-snug">{desc}</p>
    </div>
    {selected && <CheckCircle className="ml-auto text-brand-blue" size={20} />}
  </div>
);

export default Signup;