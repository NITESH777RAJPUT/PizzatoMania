import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 👤 User Pages
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import ProfileCard from './components/ProfileCard';

// 🛡️ Admin Pages
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

// 🌐 Public Pages
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';

// 🔐 Auth-related Pages
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';

// 🆕 Live Tracker Page
import LiveTrackerPage from './pages/LiveTrackerPage';

// 🧭 Navbar
import Navbar from './components/Navbar';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken'));

  useEffect(() => {
    const syncAuth = () => {
      setToken(localStorage.getItem('token'));
      setAdminToken(localStorage.getItem('adminToken'));
    };
    window.addEventListener('storage', syncAuth);
    return () => window.removeEventListener('storage', syncAuth);
  }, []);

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* 🔁 Default Route Based on Login */}
        <Route
          path="/"
          element={
            token
              ? <Navigate to="/dashboard" />
              : adminToken
              ? <Navigate to="/admin/dashboard" />
              : <Navigate to="/login" />
          }
        />

        {/* 👤 User Routes */}
        <Route path="/login" element={<Login setToken={setToken} setAdminToken={setAdminToken} />} />
        <Route path="/register" element={<Register setToken={setToken} />} />
        <Route
          path="/dashboard"
          element={token ? <UserDashboard setToken={setToken} /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={token ? <ProfileCard /> : <Navigate to="/login" />}
        />

        {/* 🛡️ Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin setAdminToken={setAdminToken} />} />
        <Route
          path="/admin/dashboard"
          element={adminToken ? <AdminDashboard setAdminToken={setAdminToken} /> : <Navigate to="/login" />}
        />

        {/* 🌐 Public Pages */}
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />

        {/* 🔐 Auth Utility Routes */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verify/:token" element={<VerifyEmail />} />

        {/* 🛵 Live Order Tracker Route */}
        <Route path="/track/:orderId" element={<LiveTrackerPage />} />
      </Routes>
    </Router>
  );
}

export default App;
