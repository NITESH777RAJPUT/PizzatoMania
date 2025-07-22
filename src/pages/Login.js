import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ setToken, setAdminToken }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [userType, setUserType] = useState('user');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl =
      userType === 'admin'
        ? 'https://pizzamania-0igb.onrender.com/api/admin/login'
        : 'https://pizzamania-0igb.onrender.com/api/auth/login';

    try {
      const res = await axios.post(apiUrl, formData);

      if (userType === 'admin') {
        const token = res.data.token;
        localStorage.setItem('adminToken', token);
        if (typeof setAdminToken === 'function') {
          setAdminToken(token);
        }
        navigate('/admin/dashboard');
      } else {
        const { token, user } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userName', user.name);
        localStorage.setItem('userPhoto', user.photo || '');
        setToken(token);
        navigate('/dashboard');
      }
    } catch (err) {
      alert('Login failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 🍕 Background Pizza Video */}
      <video autoPlay muted loop className="absolute top-0 left-0 w-full h-full object-cover z-[-1]">
        <source src="/videos/pizza-bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-black/60 to-red-900/40 z-[-1]" />

      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="bg-white/40 p-10 rounded-3xl shadow-2xl w-full max-w-lg backdrop-blur-sm">
          <h2 className="text-3xl font-bold text-center text-red-600 mb-6">🍕 Login to PizzaZone</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-center gap-8">
              <label className="font-medium text-gray-700">
                <input
                  type="radio"
                  name="userType"
                  value="user"
                  checked={userType === 'user'}
                  onChange={(e) => setUserType(e.target.value)}
                  className="mr-2"
                />
                User
              </label>
              <label className="font-medium text-gray-700">
                <input
                  type="radio"
                  name="userType"
                  value="admin"
                  checked={userType === 'admin'}
                  onChange={(e) => setUserType(e.target.value)}
                  className="mr-2"
                />
                Admin
              </label>
            </div>

            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              onChange={handleChange}
              required
            />
            <button
              type="submit"
              className="w-full bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition"
            >
              Login
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-800 font-medium">
            Don’t have an account?{' '}
            <Link to="/register" className="text-blue-700 font-bold underline hover:text-blue-900 transition">
              Register here
            </Link>
          </p>

          <p className="mt-2 text-center text-sm text-red-700">
            <Link to="/forgot-password" className="underline hover:text-red-900 transition">
              Forgot Password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;