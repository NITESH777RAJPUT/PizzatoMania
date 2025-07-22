import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`https://pizzamania-0igb.onrender.com/api/auth/reset-password/${token}`, { password });
      setMsg('✅ ' + res.data.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.message || 'Something went wrong'));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-100 to-red-100">
      <form onSubmit={handleReset} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-red-600 mb-6">🔑 Reset Password</h2>
        <input
          type="password"
          placeholder="Enter new password"
          className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-red-500 text-white py-2 rounded font-semibold hover:bg-red-600 transition"
        >
          Reset Password
        </button>
        {msg && <p className="mt-4 text-center text-sm text-gray-700">{msg}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;
