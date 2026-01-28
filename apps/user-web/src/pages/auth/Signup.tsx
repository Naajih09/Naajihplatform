import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Rocket, Wallet, GraduationCap, ArrowRight, CheckCircle, 
  AlertCircle, Landmark, Eye, EyeOff, ChevronRight, Lock, ShieldCheck, BadgeDollarSign
} from 'lucide-react';
import Button from '../../components/Button';

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = Role Selection, 2 = Form
  const [role, setRole] = useState('ENTREPRENEUR');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    location: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (selectedRole: string) => {
    setRole(selectedRole);
    setStep(2); // Move to form
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
    }

    // Split Full Name
    const [firstName, ...lastNameParts] = formData.fullName.split(' ');
    const lastName = lastNameParts.join(' ');

    const roleMapping: Record<string, string> = {
      ENTREPRENEUR: 'ENTREPRENEUR',
      INVESTOR: 'INVESTOR',
      ASPIRING_BUSINESS_OWNER: 'ASPIRING_BUSINESS_OWNER'
    };

    try {
      const response = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: roleMapping[role],
          firstName: firstName || 'User',
          lastName: lastName || '',
          // We can add location to the profile update later
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create account.");
      }

      alert("Account created successfully!");
      navigate('/login');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- STEP 1: ROLE SELECTION ---
  if (step === 1) {
    return (
      <div className="bg-background-light dark:bg-background-dark text-gray-900 dark:text-white min-h-screen flex flex-col font-sans">
        {/* Header */}
        <header className="w-full border-b border-gray-200 dark:border-white/5 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="size-10 bg-primary flex items-center justify-center rounded">
                <Landmark className="text-background-dark font-bold" />
              </div>
              <h2 className="text-2xl font-bold tracking-tighter uppercase">NaajihBiz</h2>
            </div>
            <Link to="/login" className="bg-primary/10 text-primary border border-primary/20 px-5 py-2 rounded font-bold text-sm hover:bg-primary/20 transition-all uppercase tracking-wider">
              Log in
            </Link>
          </div>
        </header>

        <main className="flex-grow flex flex-col items-center justify-center px-6 py-12">
          <div className="w-full max-w-6xl">
            {/* Progress Bar */}
            <div className="mb-12 flex flex-col items-center">
              <div className="w-full max-w-md bg-gray-200 dark:bg-white/10 h-1 rounded-full overflow-hidden mb-4">
                <div className="bg-primary h-full w-1/3 transition-all duration-500"></div>
              </div>
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-500 dark:text-gray-400">Step 01: Identity Selection</span>
            </div>

            {/* Heading */}
            <div className="text-center mb-16 space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase">
                Choose your <span className="text-primary">path.</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light">
                Build your legacy on ethical foundations. Select the role that best defines your journey.
              </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <RoleCard 
                title="Entrepreneur" 
                icon={Rocket} 
                desc="Scale your Halal-certified business and access Sharia-compliant funding."
                features={['Equity-based funding', 'Halal compliance tools']}
                onClick={() => handleRoleSelect('ENTREPRENEUR')}
              />
              <RoleCard 
                title="Investor" 
                icon={Wallet} 
                desc="Invest in Sharia-compliant opportunities. Diversify your portfolio."
                features={['Ethical vetting reports', 'Dividend tracking']}
                onClick={() => handleRoleSelect('INVESTOR')}
              />
              <RoleCard 
                title="Aspiring Owner" 
                icon={GraduationCap} 
                desc="Start from scratch. Access the Naajih Academy to learn and build."
                features={['Mentorship access', 'Certification paths']}
                onClick={() => handleRoleSelect('ASPIRING_BUSINESS_OWNER')}
              />
            </div>

            <div className="mt-20 text-center">
              <Link to="/login" className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors text-sm font-medium underline underline-offset-8 decoration-primary/30 hover:decoration-primary">
                Already have an account? Log in to your dashboard
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // --- STEP 2: ENTREPRENEUR FORM (Your New Design) ---
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen flex flex-col font-sans">
      {/* Top Nav (Simplified) */}
      <header className="w-full px-6 md:px-20 py-5 bg-background-light dark:bg-background-dark border-b border-slate-200 dark:border-white/5">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setStep(1)}>
                <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-background-dark">
                    <Landmark size={20} className="font-bold" />
                </div>
                <h2 className="text-xl font-bold tracking-tight">NaajihBiz</h2>
            </div>
            <div className="hidden md:flex items-center gap-8">
                <Link to="/login" className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-5 py-2 rounded-lg text-sm font-bold transition-all">Log in</Link>
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-[520px] bg-white dark:bg-[#1a1a1a] p-8 md:p-10 rounded-xl shadow-sm border border-slate-100 dark:border-white/5">
            
            {/* Badge & Header */}
            <div className="flex flex-col items-center mb-8">
                <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary/20 px-4 mb-4 border border-primary/30">
                    <Rocket size={16} className="text-slate-900 dark:text-primary" />
                    <p className="text-slate-900 dark:text-primary text-xs font-bold uppercase tracking-wider">Signing up as Entrepreneur</p>
                </div>
                <h1 className="text-3xl font-bold text-center tracking-tight text-slate-900 dark:text-white">Fuel Your Vision</h1>
                <p className="text-slate-500 dark:text-slate-400 text-base mt-2 text-center">Join Nigeria's premier Sharia-compliant investment bridge.</p>
            </div>

            {error && (
                <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg flex items-center gap-2 text-sm">
                    <AlertCircle size={16} /> {error}
                </div>
            )}

            {/* Form */}
            <form className="space-y-5" onSubmit={handleSignup}>
                <div className="flex flex-col gap-2">
                    <label className="text-slate-900 dark:text-slate-200 text-sm font-bold">Full Name</label>
                    <input name="fullName" required onChange={handleChange} className="w-full rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-[#262626] dark:text-white h-12 px-4 focus:border-primary focus:ring-0 outline-none transition-colors" placeholder="e.g. Amina Yusuf" type="text"/>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-slate-900 dark:text-slate-200 text-sm font-bold">Work Email</label>
                    <input name="email" required onChange={handleChange} className="w-full rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-[#262626] dark:text-white h-12 px-4 focus:border-primary focus:ring-0 outline-none transition-colors" placeholder="amina@yourbrand.ng" type="email"/>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-slate-900 dark:text-slate-200 text-sm font-bold">Business Location</label>
                    <select name="location" onChange={handleChange} className="w-full rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-[#262626] dark:text-white h-12 px-4 focus:border-primary focus:ring-0 outline-none transition-colors">
                        <option disabled selected value="">Select State</option>
                        <option value="abuja">FCT - Abuja</option>
                        <option value="lagos">Lagos</option>
                        <option value="kano">Kano</option>
                        <option value="kaduna">Kaduna</option>
                        <option value="rivers">Rivers</option>
                        <option value="other">Other State...</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-slate-900 dark:text-slate-200 text-sm font-bold">Password</label>
                        <div className="relative">
                            <input name="password" required onChange={handleChange} className="w-full rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-[#262626] dark:text-white h-12 px-4 focus:border-primary focus:ring-0 outline-none transition-colors" placeholder="••••••••" type={showPassword ? "text" : "password"}/>
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-slate-400 hover:text-white">
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-slate-900 dark:text-slate-200 text-sm font-bold">Confirm</label>
                        <input name="confirmPassword" required onChange={handleChange} className="w-full rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-[#262626] dark:text-white h-12 px-4 focus:border-primary focus:ring-0 outline-none transition-colors" placeholder="••••••••" type="password"/>
                    </div>
                </div>

                {/* Terms */}
                <div className="flex items-start gap-3 py-2">
                    <input className="mt-1 h-5 w-5 rounded border-slate-300 dark:border-white/10 text-primary focus:ring-0 accent-primary" type="checkbox" required />
                    <label className="text-sm text-slate-600 dark:text-slate-400 leading-tight">
                        I agree to the <a className="text-slate-900 dark:text-white font-bold underline decoration-primary underline-offset-4" href="#">Halal Investment Terms</a> which prohibit interest (Riba).
                    </label>
                </div>

                {/* CTA Button */}
                <button 
                    disabled={loading}
                    className="w-full bg-primary hover:brightness-110 text-background-dark h-14 rounded-lg font-bold text-lg shadow-lg shadow-primary/10 transition-transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed" 
                    type="submit"
                >
                    {loading ? 'Creating Account...' : 'Create Account'}
                    {!loading && <ChevronRight size={20} />}
                </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 text-center">
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                    Already have a business account? 
                    <Link to="/login" className="text-slate-900 dark:text-white font-bold ml-1 hover:underline">Log in here</Link>
                </p>
            </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex items-center gap-6 opacity-50 grayscale hover:grayscale-0 transition-all cursor-default">
            <div className="flex items-center gap-1 text-slate-900 dark:text-white">
                <ShieldCheck size={16} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Sharia Certified</span>
            </div>
            <div className="flex items-center gap-1 text-slate-900 dark:text-white">
                <Lock size={16} />
                <span className="text-[10px] font-bold uppercase tracking-widest">256-bit Encrypted</span>
            </div>
            <div className="flex items-center gap-1 text-slate-900 dark:text-white">
                <BadgeDollarSign size={16} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Interest-Free Equity</span>
            </div>
        </div>
      </main>
      
      {/* Footer Line */}
      <div className="h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0 w-full opacity-20"></div>
    </div>
  );
};

// Helper Component for Role Card (Step 1)
const RoleCard = ({ title, icon: Icon, desc, features, onClick }: any) => (
  <div className="group relative bg-white dark:bg-[#141414] border-2 border-slate-200 dark:border-[#262626] p-8 flex flex-col h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#aaff00]">
    <div className="mb-8">
      <Icon className="size-12 text-primary mb-6" strokeWidth={1.5} />
      <h3 className="text-2xl font-bold uppercase tracking-tight mb-4 text-slate-900 dark:text-white">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">{desc}</p>
    </div>
    <div className="mt-auto">
      <ul className="space-y-3 mb-8 text-sm text-slate-500 dark:text-gray-400">
        {features.map((feat: string) => (
          <li key={feat} className="flex items-center gap-2">
            <CheckCircle className="text-primary size-5" /> {feat}
          </li>
        ))}
      </ul>
      <button onClick={onClick} className="w-full bg-primary text-background-dark py-4 font-black uppercase tracking-widest text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2">
        Select Role <ArrowRight size={18} />
      </button>
    </div>
  </div>
);

export default Signup;