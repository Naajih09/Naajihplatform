import React from 'react';
import { Search, Filter, PieChart, Briefcase } from 'lucide-react';
import Button from '../../components/Button';

const InvestorDashboard = ({ user }) => {
  return (
    <div className="space-y-8">
      {/* 1. Header */}
      <div>
        <h1 className="text-2xl font-bold text-brand-dark">
          Welcome, {user.investorProfile?.firstName || 'Investor'}
        </h1>
        <p className="text-brand-gray">Explore high-growth, halal-compliant opportunities.</p>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by industry, location, or keywords..." 
            className="w-full pl-10 p-2.5 border rounded-lg focus:ring-2 focus:ring-brand-blue outline-none"
          />
        </div>
        <Button variant="outline" className="px-4"><Filter size={20}/> Filters</Button>
      </div>

      {/* 3. Deal Flow (Empty State) */}
      <div>
        <h3 className="font-bold text-xl text-brand-dark mb-4">Recommended Deals</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mock Card 1 */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-brand-blue transition cursor-pointer group">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">AgriTech</span>
              <span className="text-xs text-gray-400">Lagos</span>
            </div>
            <h4 className="font-bold text-lg mb-2 group-hover:text-brand-blue">GreenFarm Solutions</h4>
            <p className="text-sm text-brand-gray mb-4 line-clamp-2">
              Using AI drones to optimize fertilizer usage for cassava farmers in Ogun state.
            </p>
            <div className="flex justify-between items-center text-sm font-medium border-t pt-4">
              <span>Ask: ₦5,000,000</span>
              <span className="text-brand-blue">View Pitch &rarr;</span>
            </div>
          </div>
          
          {/* Mock Card 2 */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-brand-blue transition cursor-pointer group">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-blue-100 text-brand-blue text-xs font-bold px-2 py-1 rounded">FinTech</span>
              <span className="text-xs text-gray-400">Abuja</span>
            </div>
            <h4 className="font-bold text-lg mb-2 group-hover:text-brand-blue">HalalPay</h4>
            <p className="text-sm text-brand-gray mb-4 line-clamp-2">
              Interest-free payment gateway for Islamic cooperative societies.
            </p>
            <div className="flex justify-between items-center text-sm font-medium border-t pt-4">
              <span>Ask: ₦12,000,000</span>
              <span className="text-brand-blue">View Pitch &rarr;</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorDashboard;