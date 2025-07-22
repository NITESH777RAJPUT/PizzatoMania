import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('');

  useEffect(() => {
    const verify = async () => {
      try {
        await axios.get(`https://pizzamania-0igb.onrender.com/api/auth/verify/${token}`);
        setStatus('✅ Email verified successfully!');
      } catch (err) {
        setStatus('❌ Invalid or expired token.');
      }
    };
    verify();
  }, [token]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-blue-100">
      <div className="bg-white p-8 rounded-xl shadow-md text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">📧 Email Verification</h2>
        <p className="text-gray-700 mb-4">{status}</p>
        <Link
          to="/login"
          className="inline-block bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmail;
