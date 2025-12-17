import React from 'react';
import { PlusCircle, TrendingUp, Users, Eye } from 'lucide-react';
import Button from '../../components/Button';
import { Link } from 'react-router-dom';

const EntrepreneurDashboard = ({ user }) => {
  return (
    <div className="space-y-8">
      {/* 1. Welcome & Action Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">
            Salaam, {user.entrepreneurProfile?.firstName || user.email.split('@')[0]}! 👋
          </h1>
          <p className="text-brand-gray">Here is how your business is performing today.</p>
        </div>
        <Link to="/dashboard/create-pitch">
  <Button variant="secondary"><PlusCircle size={20} /> Post New Pitch</Button>
</Link>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Pitch Views" 
          value="0" 
          icon={Eye} 
          trend="No activity yet" 
        />
        <StatCard 
          title="Investor Connections" 
          value="0" 
          icon={Users} 
          trend="Pending verification" 
        />
        <StatCard 
          title="Funding Raised" 
          value="₦ 0.00" 
          icon={TrendingUp} 
          trend="Upload pitch to start" 
        />
      </div>

      {/* 3. Empty State (Call to Action) */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
        <div className="w-16 h-16 bg-blue-50 text-brand-blue rounded-full flex items-center justify-center mx-auto mb-4">
          <TrendingUp size={32} />
        </div>
        <h3 className="text-lg font-bold text-brand-dark mb-2">No Active Pitches</h3>
        <p className="text-brand-gray max-w-md mx-auto mb-6">
          You haven't posted your business yet. Investors cannot find you until you create a structured pitch.
        </p>
        <Button variant="outline">Create My First Pitch</Button>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, trend }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-brand-bg rounded-lg text-brand-blue"><Icon size={20}/></div>
      <span className="text-xs font-medium text-brand-gray bg-gray-100 px-2 py-1 rounded">{trend}</span>
    </div>
    <p className="text-brand-gray text-sm">{title}</p>
    <h3 className="text-2xl font-bold text-brand-dark mt-1">{value}</h3>
  </div>
);

export default EntrepreneurDashboard;