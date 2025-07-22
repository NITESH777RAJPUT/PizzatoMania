import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('user');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl =
      userType === 'admin'
        ? 'https://pizzamania-0igb.onrender.com/admin/register'
        : 'https://pizzamania-0igb.onrender.com/api/auth/register';

    try {
      await axios.post(apiUrl, formData);
      if (userType === 'admin') {
        alert('Admin registered successfully. Now please login.');
      } else {
        alert('User registered. Check your email to verify before login.');
      }
      navigate('/login');
    } catch (err) {
      alert('Registration failed: ' + (err.response?.data?.message || err.message));
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
          <h2 className="text-3xl font-bold text-center text-red-600 mb-6">📝 Register at PizzaZone</h2>

          <div className="flex justify-center gap-8 mb-4">
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              onChange={handleChange}
              required
            />
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
              className="w-full px-4 py-2 border rounded-lg bg-white text-black placeholder-gray-500"
              onChange={handleChange}
              required
            />
            <button
              type="submit"
              className="w-full bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition"
            >
              Register
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-800 font-medium">
            Already registered?{' '}
            <Link to="/login" className="text-blue-700 font-bold underline hover:text-blue-900 transition">
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
