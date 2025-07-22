import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = ({ setAdminToken }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.email === 'admin@pizza.com' && formData.password === 'admin123') {
      const token = 'true';
      localStorage.setItem('adminToken', token);
      if (typeof setAdminToken === 'function') {
        setAdminToken(token);
      }
      window.dispatchEvent(new Event('storage'));
      navigate('/admin/dashboard');
    } else {
      alert('Invalid admin credentials');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        <input
          type="email"
          name="email"
          placeholder="Admin Email"
          className="border p-2 w-full mb-2"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border p-2 w-full mb-2"
          onChange={handleChange}
          required
        />
        <button type="submit" className="bg-blue-600 text-white w-full p-2">
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
