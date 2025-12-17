import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CreatePitch from './pages/dashboard/CreatePitch';
import Opportunities from './pages/dashboard/Opportunities';
import Profile from './pages/dashboard/Profile';
import './index.css';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Landing from './pages/Landing';
import Signup from './pages/auth/Signup';
import Login from './pages/auth/Login';
import DashboardHome from './pages/dashboard/DashboardHome';
import PitchDetails from './pages/dashboard/pitchDetails';

// Simple Guard
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('user');
  if (!user) return <Navigate to="/login" />;
  return children;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected Dashboard */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<DashboardHome />} />
          <Route path="messages" element={<div className="p-10">Messages Page Coming Soon</div>} />
          <Route path="settings" element={<div className="p-10">Settings Page Coming Soon</div>} />
          <Route path="create-pitch" element={<CreatePitch />} />
          <Route path="opportunities" element={<Opportunities />} />
          <Route path="opportunities/:id" element={<PitchDetails />} />
                    <Route path="profile" element={<Profile />} /> 


        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);