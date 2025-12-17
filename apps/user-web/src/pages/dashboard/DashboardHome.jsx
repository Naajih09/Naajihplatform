import React from 'react';
import { useNavigate } from 'react-router-dom';
import EntrepreneurDashboard from './EntrepreneurDashboard';
import InvestorDashboard from './InvestorDashboard';

const DashboardHome = () => {
  const navigate = useNavigate();
  // Get user data from local storage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Logic: Switch based on Role
  if (user.role === 'ENTREPRENEUR' || user.role === 'ASPIRING_BUSINESS_OWNER') {
    return <EntrepreneurDashboard user={user} />;
  }

  if (user.role === 'INVESTOR') {
    return <InvestorDashboard user={user} />;
  }

  // Fallback (If role is weird or admin)
  return (
    <div className="p-10 text-center">
      <h1 className="text-xl">Welcome, {user.email}</h1>
      <p>Role: {user.role}</p>
    </div>
  );
};

export default DashboardHome;